'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { Renderer, Program, Triangle, Mesh } from 'ogl';

export type SideRaysOrigin = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface SideRaysProps {
  speed?: number;
  rayColor1?: string;
  rayColor2?: string;
  intensity?: number;
  spread?: number;
  origin?: SideRaysOrigin;
  tilt?: number;
  saturation?: number;
  blend?: number;
  falloff?: number;
  opacity?: number;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1];
};

const originToFlip = (origin: SideRaysOrigin): [number, number] => {
  switch (origin) {
    case 'top-left':    return [1, 0];
    case 'bottom-right':return [0, 1];
    case 'bottom-left': return [1, 1];
    default:            return [0, 0]; // top-right
  }
};

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;
uniform float iSpeed;
uniform vec3  iRayColor1;
uniform vec3  iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2  sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.30 + 0.20 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord  = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2  rel        = coord - rayPos;
  vec2  tiltedCoord = vec2(rel.x*cs - rel.y*sn, rel.x*sn + rel.y*cs) + rayPos;

  float halfSpread  = iSpread * 0.275;
  vec2  rayRefDir1  = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2  rayRefDir2  = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214,  21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991,  18.0234,  iSpeed * 0.2);

  vec4  color      = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;
  float distToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness  = iIntensity * 0.4 / pow(max(distToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb  = mix(vec3(gray), color.rgb, iSaturation);

  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`;

export default function SideRays({
  speed      = 2.5,
  rayColor1  = '#EAB308',
  rayColor2  = '#96c8ff',
  intensity  = 2,
  spread     = 2,
  origin     = 'top-right',
  tilt       = 0,
  saturation = 1.5,
  blend      = 0.75,
  falloff    = 1.6,
  opacity    = 1.0,
  className  = '',
}: SideRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rgb1  = useMemo(() => hexToRgb(rayColor1), [rayColor1]);
  const rgb2  = useMemo(() => hexToRgb(rayColor2), [rayColor2]);
  const flips = useMemo(() => originToFlip(origin),  [origin]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let renderer: Renderer | null = null;

    try {
      renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
      const gl = renderer.gl;

      // Make canvas fill the container
      gl.canvas.style.position = 'absolute';
      gl.canvas.style.inset    = '0';
      gl.canvas.style.width    = '100%';
      gl.canvas.style.height   = '100%';

      // Clear container and append canvas
      container.innerHTML = '';
      container.appendChild(gl.canvas);

      const uniforms = {
        iTime:       { value: 0 },
        iResolution: { value: [1, 1] as [number, number] },
        iSpeed:      { value: speed },
        iRayColor1:  { value: rgb1 },
        iRayColor2:  { value: rgb2 },
        iIntensity:  { value: intensity },
        iSpread:     { value: spread },
        iFlipX:      { value: flips[0] },
        iFlipY:      { value: flips[1] },
        iTilt:       { value: tilt },
        iSaturation: { value: saturation },
        iBlend:      { value: blend },
        iFalloff:    { value: falloff },
        iOpacity:    { value: opacity },
      };

      const geometry = new Triangle(gl);
      const program  = new Program(gl, { vertex: vertexShader, fragment: fragmentShader, uniforms });
      const mesh     = new Mesh(gl, { geometry, program });

      const resize = () => {
        if (!container || !renderer) return;
        const w = container.offsetWidth  || window.innerWidth;
        const h = container.offsetHeight || window.innerHeight;
        renderer.setSize(w, h);
        uniforms.iResolution.value = [
          gl.canvas.width,
          gl.canvas.height,
        ];
      };

      resize();
      window.addEventListener('resize', resize, { passive: true });

      const loop = (t: number) => {
        uniforms.iTime.value = t * 0.001;
        renderer!.render({ scene: mesh });
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        try {
          const ext = gl.getExtension('WEBGL_lose_context');
          ext?.loseContext();
        } catch (_) {}
        renderer = null;
      };
    } catch (e) {
      console.error('[SideRays] WebGL init failed:', e);
      return () => {
        cancelAnimationFrame(rafId);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={['absolute inset-0 w-full h-full overflow-hidden pointer-events-none', className].filter(Boolean).join(' ')}
    />
  );
}
