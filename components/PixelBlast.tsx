'use client';

import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

export type PixelBlastVariant = 'square' | 'circle' | 'triangle' | 'diamond';

type PixelBlastProps = {
  variant?: PixelBlastVariant;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  antialias?: boolean;
  patternScale?: number;
  patternDensity?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  liquidWobbleSpeed?: number;
  autoPauseOffscreen?: boolean;
  speed?: number;
  transparent?: boolean;
  edgeFade?: number;
  noiseAmount?: number;
};

const MAX_CLICKS = 10;

interface ThreeState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  material: THREE.ShaderMaterial;
  clock: THREE.Clock;
  clickIx: number;
  uniforms: {
    uResolution: { value: THREE.Vector2 };
    uTime: { value: number };
    uColor: { value: THREE.Color };
    uClickPos: { value: THREE.Vector2[] };
    uClickTimes: { value: Float32Array };
    uShapeType: { value: number };
    uPixelSize: { value: number };
    uScale: { value: number };
    uDensity: { value: number };
    uPixelJitter: { value: number };
    uEnableRipples: { value: number };
    uRippleSpeed: { value: number };
    uRippleThickness: { value: number };
    uRippleIntensity: { value: number };
    uEdgeFade: { value: number };
    uTouchTexture: { value: THREE.Texture | null };
    uLiquidStrength: { value: number };
    uLiquidWobbleSpeed: { value: number };
    uNoiseAmount: { value: number };
  };
  resizeObserver?: ResizeObserver;
  raf?: number;
  quad?: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  timeOffset?: number;
  touch?: {
    canvas: HTMLCanvasElement;
    texture: THREE.Texture;
    addTouch: (norm: { x: number; y: number }) => void;
    update: () => void;
    radiusScale: number;
  };
}

const createTouchTexture = () => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context not available');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.Texture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  const trail: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    force: number;
    age: number;
  }[] = [];
  let last: { x: number; y: number } | null = null;
  const maxAge = 64;
  let radius = 0.1 * size;
  const speed = 1 / maxAge;
  const clear = () => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  const drawPoint = (p: { x: number; y: number; vx: number; vy: number; force: number; age: number }) => {
    const pos = { x: p.x * size, y: (1 - p.y) * size };
    let intensity = 1;
    const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);
    const easeOutQuad = (t: number) => -t * (t - 2);
    if (p.age < maxAge * 0.3) intensity = easeOutSine(p.age / (maxAge * 0.3));
    else intensity = easeOutQuad(1 - (p.age - maxAge * 0.3) / (maxAge * 0.7)) || 0;
    intensity *= p.force;
    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
    const offset = size * 5;
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius;
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,0,0,1)';
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  const addTouch = (norm: { x: number; y: number }) => {
    let force = 0;
    let vx = 0;
    let vy = 0;
    if (last) {
      const dx = norm.x - last.x;
      const dy = norm.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      const d = Math.sqrt(dd);
      vx = dx / (d || 1);
      vy = dy / (d || 1);
      force = Math.min(dd * 10000, 1);
    }
    last = { x: norm.x, y: norm.y };
    trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy });
  };
  const update = () => {
    clear();
    for (let i = trail.length - 1; i >= 0; i--) {
      const point = trail[i];
      const f = point.force * speed * (1 - point.age / maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;
      if (point.age > maxAge) trail.splice(i, 1);
    }
    for (let i = 0; i < trail.length; i++) drawPoint(trail[i]);
    texture.needsUpdate = true;
  };
  return {
    canvas,
    texture,
    addTouch,
    update,
    set radiusScale(v: number) {
      radius = 0.1 * size * v;
    },
    get radiusScale() {
      return radius / (0.1 * size);
    },
    size
  };
};

const SHAPE_MAP: Record<PixelBlastVariant, number> = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3
};

const VERTEX_SRC = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
uniform sampler2D uTouchTexture;
uniform float uLiquidStrength;
uniform float uLiquidWobbleSpeed;
uniform float uNoiseAmount;

const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  // Liquid distortion from touch texture
  if (uLiquidStrength > 0.0) {
    vec4 tex = texture2D(uTouchTexture, uv);
    float vx = tex.r * 2.0 - 1.0;
    float vy = tex.g * 2.0 - 1.0;
    float intensity = tex.b;
    float wave = 0.5 + 0.5 * sin(uTime * uLiquidWobbleSpeed + intensity * 6.2831853);
    float amt = uLiquidStrength * intensity * wave;
    uv += vec2(vx, vy) * amt;
  }
  
  // Noise distortion
  if (uNoiseAmount > 0.0) {
    float n = random(floor(uv * vec2(1920.0, 1080.0)) + floor(uTime * 60.0));
    float g = (n - 0.5) * uNoiseAmount;
    uv += g * 0.01;
  }
  
  float pixelSize = uPixelSize;
  vec2 fragCoord = uv * uResolution;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 cellUV = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(cellUV, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(cellUV, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    float edge = min(min(uv.x, uv.y), min(1.0 - uv.x, 1.0 - uv.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;
  fragColor = vec4(color, M);
}
`;

const defaultProps: Required<Omit<PixelBlastProps, 'className' | 'style'>> = {
  variant: 'square',
  pixelSize: 3,
  color: '#B19EEF',
  antialias: true,
  patternScale: 2,
  patternDensity: 1,
  liquid: false,
  liquidStrength: 0.1,
  liquidRadius: 1,
  pixelSizeJitter: 0,
  enableRipples: true,
  rippleIntensityScale: 1,
  rippleThickness: 0.1,
  rippleSpeed: 0.3,
  liquidWobbleSpeed: 4.5,
  autoPauseOffscreen: true,
  speed: 0.5,
  transparent: true,
  edgeFade: 0.5,
  noiseAmount: 0
};

export default function PixelBlast(props: PixelBlastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibilityRef = useRef({ visible: true });
  const speedRef = useRef(props.speed ?? defaultProps.speed);
  const threeRef = useRef<ThreeState | null>(null);
  const prevConfigRef = useRef<{ antialias: boolean; liquid: boolean; noiseAmount: number } | null>(null);

  useEffect(() => {
    speedRef.current = props.speed ?? defaultProps.speed;
  }, [props.speed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const needsReinitKeys: (keyof { antialias: boolean; liquid: boolean; noiseAmount: number })[] = ['antialias', 'liquid', 'noiseAmount'];
    const cfg = {
      antialias: props.antialias ?? defaultProps.antialias,
      liquid: props.liquid ?? defaultProps.liquid,
      noiseAmount: props.noiseAmount ?? defaultProps.noiseAmount
    };

    let mustReinit = false;
    if (!threeRef.current) mustReinit = true;
    else if (prevConfigRef.current) {
      for (const k of needsReinitKeys)
        if (prevConfigRef.current[k] !== cfg[k]) {
          mustReinit = true;
          break;
        }
    }

    const cleanup = () => {
      const t = threeRef.current;
      if (!t) return;
      t.resizeObserver?.disconnect();
      cancelAnimationFrame(t.raf!);
      t.quad?.geometry.dispose();
      t.material.dispose();
      t.renderer.dispose();
      if (t.renderer.domElement.parentElement === containerRef.current) {
        containerRef.current?.removeChild(t.renderer.domElement);
      }
      threeRef.current = null;
    };

    if (mustReinit) {
      cleanup();

      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2', { antialias: props.antialias ?? defaultProps.antialias, alpha: true });
      if (!gl) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: props.antialias ?? defaultProps.antialias,
        alpha: true
      });

      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      const uniforms = {
        uResolution: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(props.color ?? defaultProps.color) },
        uClickPos: {
          value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1))
        },
        uClickTimes: { value: new Float32Array(MAX_CLICKS) },
        uShapeType: { value: SHAPE_MAP[props.variant ?? defaultProps.variant] ?? 0 },
        uPixelSize: { value: (props.pixelSize ?? defaultProps.pixelSize) * renderer.getPixelRatio() },
        uScale: { value: props.patternScale ?? defaultProps.patternScale },
        uDensity: { value: props.patternDensity ?? defaultProps.patternDensity },
        uPixelJitter: { value: props.pixelSizeJitter ?? defaultProps.pixelSizeJitter },
        uEnableRipples: { value: (props.enableRipples ?? defaultProps.enableRipples) ? 1 : 0 },
        uRippleSpeed: { value: props.rippleSpeed ?? defaultProps.rippleSpeed },
        uRippleThickness: { value: props.rippleThickness ?? defaultProps.rippleThickness },
        uRippleIntensity: { value: props.rippleIntensityScale ?? defaultProps.rippleIntensityScale },
        uEdgeFade: { value: props.edgeFade ?? defaultProps.edgeFade },
        uTouchTexture: { value: null as THREE.Texture | null },
        uLiquidStrength: { value: (props.liquid ?? defaultProps.liquid) ? (props.liquidStrength ?? defaultProps.liquidStrength) : 0 },
        uLiquidWobbleSpeed: { value: props.liquidWobbleSpeed ?? defaultProps.liquidWobbleSpeed },
        uNoiseAmount: { value: props.noiseAmount ?? defaultProps.noiseAmount }
      };

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SRC,
        fragmentShader: FRAGMENT_SRC,
        uniforms,
        transparent: true,
        glslVersion: THREE.GLSL3,
        depthTest: false,
        depthWrite: false
      });
      const quadGeom = new THREE.PlaneGeometry(2, 2);
      const quad = new THREE.Mesh(quadGeom, material);
      scene.add(quad);
      const clock = new THREE.Clock();

      const setSize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        renderer.setSize(w, h, false);
        uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
        uniforms.uPixelSize.value = (props.pixelSize ?? defaultProps.pixelSize) * renderer.getPixelRatio();
      };
      setSize();

      const ro = new ResizeObserver(setSize);
      ro.observe(container);

      const randomFloat = () => {
        if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
          const u32 = new Uint32Array(1);
          window.crypto.getRandomValues(u32);
          return u32[0] / 0xffffffff;
        }
        return Math.random();
      };
      const timeOffset = randomFloat() * 1000;

      let touch: ThreeState['touch'] | undefined;

      if (props.liquid ?? defaultProps.liquid) {
        touch = createTouchTexture();
        touch.radiusScale = props.liquidRadius ?? defaultProps.liquidRadius;
        uniforms.uTouchTexture.value = touch.texture;
      }

      const mapToPixels = (e: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const scaleX = renderer.domElement.width / rect.width;
        const scaleY = renderer.domElement.height / rect.height;
        const fx = (e.clientX - rect.left) * scaleX;
        const fy = (rect.height - (e.clientY - rect.top)) * scaleY;
        return {
          fx,
          fy,
          w: renderer.domElement.width,
          h: renderer.domElement.height
        };
      };

      const onPointerDown = (e: PointerEvent) => {
        const { fx, fy } = mapToPixels(e);
        const ix = threeRef.current?.clickIx ?? 0;
        uniforms.uClickPos.value[ix].set(fx, fy);
        uniforms.uClickTimes.value[ix] = uniforms.uTime.value;
        if (threeRef.current) threeRef.current.clickIx = (ix + 1) % MAX_CLICKS;
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!touch) return;
        const { fx, fy, w, h } = mapToPixels(e);
        touch.addTouch({ x: fx / w, y: fy / h });
      };

      renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: true });
      renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: true });

      let raf = 0;
      const animate = () => {
        if ((props.autoPauseOffscreen ?? defaultProps.autoPauseOffscreen) && !visibilityRef.current.visible) {
          raf = requestAnimationFrame(animate);
          return;
        }
        uniforms.uTime.value = timeOffset + clock.getElapsedTime() * speedRef.current;
        if (touch) touch.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);

      threeRef.current = {
        renderer,
        scene,
        camera,
        material,
        clock,
        clickIx: 0,
        uniforms,
        resizeObserver: ro,
        raf,
        quad,
        timeOffset,
        touch
      };
    } else {
      const t = threeRef.current!;
      t.uniforms.uShapeType.value = SHAPE_MAP[props.variant ?? defaultProps.variant] ?? 0;
      t.uniforms.uPixelSize.value = (props.pixelSize ?? defaultProps.pixelSize) * t.renderer.getPixelRatio();
      t.uniforms.uColor.value.set(props.color ?? defaultProps.color);
      t.uniforms.uScale.value = props.patternScale ?? defaultProps.patternScale;
      t.uniforms.uDensity.value = props.patternDensity ?? defaultProps.patternDensity;
      t.uniforms.uPixelJitter.value = props.pixelSizeJitter ?? defaultProps.pixelSizeJitter;
      t.uniforms.uEnableRipples.value = (props.enableRipples ?? defaultProps.enableRipples) ? 1 : 0;
      t.uniforms.uRippleIntensity.value = props.rippleIntensityScale ?? defaultProps.rippleIntensityScale;
      t.uniforms.uRippleThickness.value = props.rippleThickness ?? defaultProps.rippleThickness;
      t.uniforms.uRippleSpeed.value = props.rippleSpeed ?? defaultProps.rippleSpeed;
      t.uniforms.uEdgeFade.value = props.edgeFade ?? defaultProps.edgeFade;
      t.uniforms.uLiquidStrength.value = (props.liquid ?? defaultProps.liquid) ? (props.liquidStrength ?? defaultProps.liquidStrength) : 0;
      t.uniforms.uLiquidWobbleSpeed.value = props.liquidWobbleSpeed ?? defaultProps.liquidWobbleSpeed;
      t.uniforms.uNoiseAmount.value = props.noiseAmount ?? defaultProps.noiseAmount;
      if (props.transparent ?? defaultProps.transparent) t.renderer.setClearAlpha(0);
      else t.renderer.setClearColor(0x000000, 1);
      if (t.touch) t.touch.radiusScale = props.liquidRadius ?? defaultProps.liquidRadius;
    }

    prevConfigRef.current = cfg;

    return cleanup;
  }, [
    props.variant,
    props.pixelSize,
    props.color,
    props.antialias,
    props.patternScale,
    props.patternDensity,
    props.liquid,
    props.liquidStrength,
    props.liquidRadius,
    props.pixelSizeJitter,
    props.enableRipples,
    props.rippleIntensityScale,
    props.rippleThickness,
    props.rippleSpeed,
    props.liquidWobbleSpeed,
    props.autoPauseOffscreen,
    props.speed,
    props.transparent,
    props.edgeFade,
    props.noiseAmount,
  ]);

  useEffect(() => {
    const handleVisibility = () => {
      visibilityRef.current.visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const className = props.className ?? '';
  const style = props.style ?? {};

  return (
    <div
      ref={containerRef}
      className={['w-full h-full relative overflow-hidden', className].filter(Boolean).join(' ')}
      style={style}
      aria-label="PixelBlast interactive background"
    />
  );
}
