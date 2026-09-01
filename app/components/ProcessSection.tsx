'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import AeroShards from './AeroShards';

type Stage = { id: string; num?: string; title: string; subtitle: string; description?: string };

const stages: Stage[] = [
  { id: 'intro', title: 'HOW I BUILD DIGITAL PRODUCTS.', subtitle: '/PROCESS — INTRO', description: 'Centered sticky storytelling — one viewport, content replaces on scroll.' },
  { id: '01', num: '01', title: 'UNDERSTAND', subtitle: 'RESEARCH & REQUIREMENTS', description: 'Kickoff, stakeholder interview & scope mapping — prioritas fitur ditentukan sebelum desain.' },
  { id: '02', num: '02', title: 'STRUCTURE', subtitle: 'SYSTEM & DATABASE', description: 'Arsitektur informasi, ERD & API contract — fondasi yang scalable sebelum coding.' },
  { id: '03', num: '03', title: 'BUILD', subtitle: 'FULL-STACK DEVELOPMENT', description: 'Slicing, integrasi, state & data fetching — performa dan aksesibilitas dijaga.' },
  { id: '04', num: '04', title: 'REFINE', subtitle: 'TEST \u2022 OPTIMIZE \u2022 DEPLOY', description: 'QA, audit, optimasi & deploy — rilis aman dengan monitoring.' },
];

const stageLabels: Record<string, Partial<Stage>> = {
  intro: {
    title: 'CARA SAYA MEMBANGUN PRODUK DIGITAL.',
    subtitle: '/PROSES — PEMBUKAAN',
    description: 'Cerita bergulir terpusat — satu tampilan, konten berganti saat Anda menggulir.',
  },
  '01': {
    title: 'PAHAMI',
    subtitle: 'RISET & KEBUTUHAN',
    description: 'Kickoff, wawancara pemangku kepentingan, dan pemetaan ruang lingkup — prioritas fitur ditentukan sebelum desain.',
  },
  '02': {
    title: 'SUSUN',
    subtitle: 'SISTEM & BASIS DATA',
    description: 'Arsitektur informasi, ERD, dan kontrak API — fondasi yang dapat berkembang sebelum coding.',
  },
  '03': {
    title: 'BANGUN',
    subtitle: 'PENGEMBANGAN FULL STACK',
    description: 'Slicing, integrasi, state, dan pengambilan data — performa serta aksesibilitas tetap dijaga.',
  },
  '04': {
    title: 'SEMPURNAKAN',
    subtitle: 'UJI • OPTIMALKAN • RILIS',
    description: 'QA, audit, optimasi, dan rilis — peluncuran aman dengan pemantauan.',
  },
};

function getStageLabel(stage: Stage) {
  return { ...stage, ...stageLabels[stage.id] };
}

function SplitReveal({ text, active }: { text: string; active: boolean }) {
  const words = text.split(' ');
  return (
    <span className="inline-flex flex-wrap justify-center gap-x-[0.18em] gap-y-1">
      {words.map((w, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)', rotate: 2 }}
          animate={active ? { opacity: 1, y: 0, filter: 'blur(0px)', rotate: 0 } : { opacity: 0, y: -35, filter: 'blur(8px)', rotate: -1 }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block will-change-transform"
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

type FrameBlock = {
  id: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width: string;
  height: string;
  variant: 'raised-gold' | 'raised-subtle' | 'inset' | 'faint' | 'glow-pulse';
  depthFactor: number;
  marker?: string;
  baseOpacity?: number;
};

// Focused 3D architectural geometric panels positioned intimately around the central content
const CENTER_FRAMING_BLOCKS: FrameBlock[] = [
  // ── Top Edge Framing ──
  {
    id: 'frame-top-l',
    top: '-6%',
    left: '8%',
    width: '140px',
    height: '60px',
    variant: 'raised-gold',
    depthFactor: -1.0,
    marker: '+',
    baseOpacity: 0.5,
  },
  {
    id: 'frame-top-r',
    top: '-4%',
    right: '10%',
    width: '130px',
    height: '56px',
    variant: 'inset',
    depthFactor: 0.8,
    marker: '//',
    baseOpacity: 0.45,
  },

  // ── Side Flanks (Bracketing the Main Title) ──
  {
    id: 'frame-mid-l',
    top: '20%',
    left: '-4%',
    width: '75px',
    height: '140px',
    variant: 'raised-subtle',
    depthFactor: 1.2,
    baseOpacity: 0.45,
  },
  {
    id: 'frame-mid-r',
    top: '24%',
    right: '-4%',
    width: '80px',
    height: '130px',
    variant: 'glow-pulse',
    depthFactor: -1.1,
    baseOpacity: 0.5,
  },

  // ── Inner Sub-Plates ──
  {
    id: 'frame-inner-l',
    top: '56%',
    left: '2%',
    width: '110px',
    height: '70px',
    variant: 'inset',
    depthFactor: -0.6,
    marker: '01',
    baseOpacity: 0.4,
  },
  {
    id: 'frame-inner-r',
    top: '58%',
    right: '3%',
    width: '120px',
    height: '75px',
    variant: 'raised-gold',
    depthFactor: 0.6,
    marker: '◱',
    baseOpacity: 0.48,
  },

  // ── Bottom Edge Grounding ──
  {
    id: 'frame-bot-l',
    bottom: '-6%',
    left: '12%',
    width: '150px',
    height: '55px',
    variant: 'raised-subtle',
    depthFactor: 0.7,
    baseOpacity: 0.4,
  },
  {
    id: 'frame-bot-r',
    bottom: '-4%',
    right: '14%',
    width: '140px',
    height: '58px',
    variant: 'inset',
    depthFactor: -0.8,
    baseOpacity: 0.42,
  },

  // ── Soft Chassis Plate Directly Behind Center ──
  {
    id: 'frame-center-plate',
    top: '12%',
    left: '10%',
    width: '80%',
    height: '76%',
    variant: 'faint',
    depthFactor: 0.2,
    baseOpacity: 0.15,
  },
];

function Geometric3DFocusedBackground({ stage }: { stage: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none flex items-center justify-center"
    >
      {/* ── 1. Minimal Substrate Grid around Center Zone ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.7) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.7) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 65%)',
        }}
      />

      {/* ── 2. Focused 3D Architectural Chassis surrounding the central 860px content box ── */}
      <div className="relative w-full max-w-[960px] h-[460px] md:h-[500px]">
        {CENTER_FRAMING_BLOCKS.map((block) => {
          // Subtle micro-parallax shift when stage changes (2.5px max)
          const shiftY = block.depthFactor * (stage - 2) * 2.8;
          const shiftX = block.depthFactor * (stage - 2) * 0.8;

          let styleObject: React.CSSProperties = {
            position: 'absolute',
            top: block.top,
            left: block.left,
            right: block.right,
            bottom: block.bottom,
            width: block.width,
            height: block.height,
            opacity: block.baseOpacity ?? 0.45,
            borderRadius: '5px',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          };

          if (block.variant === 'raised-gold') {
            styleObject = {
              ...styleObject,
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.75) 0%, rgba(8, 8, 8, 0.9) 100%)',
              borderTop: '1px solid rgba(245, 197, 24, 0.35)',
              borderLeft: '1px solid rgba(245, 197, 24, 0.18)',
              borderRight: '1px solid rgba(0, 0, 0, 0.9)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.95)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.85), inset 1px 1px 0 rgba(245, 197, 24, 0.12)',
            };
          } else if (block.variant === 'raised-subtle') {
            styleObject = {
              ...styleObject,
              background: 'linear-gradient(145deg, rgba(18, 18, 18, 0.7) 0%, rgba(8, 8, 8, 0.9) 100%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.04)',
              borderRight: '1px solid rgba(0, 0, 0, 0.9)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.95)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.75), inset 1px 1px 0 rgba(255, 255, 255, 0.03)',
            };
          } else if (block.variant === 'inset') {
            styleObject = {
              ...styleObject,
              background: 'rgba(4, 4, 4, 0.85)',
              borderTop: '1px solid rgba(0, 0, 0, 0.95)',
              borderLeft: '1px solid rgba(0, 0, 0, 0.9)',
              borderRight: '1px solid rgba(245, 197, 24, 0.12)',
              borderBottom: '1px solid rgba(245, 197, 24, 0.15)',
              boxShadow: 'inset 2px 2px 8px rgba(0, 0, 0, 0.95), inset -1px -1px 0 rgba(245, 197, 24, 0.05)',
            };
          } else if (block.variant === 'glow-pulse') {
            styleObject = {
              ...styleObject,
              background: 'linear-gradient(150deg, rgba(22, 18, 8, 0.75) 0%, rgba(8, 8, 8, 0.9) 100%)',
              border: '1px solid rgba(245, 197, 24, 0.3)',
              boxShadow: '0 0 16px rgba(245, 197, 24, 0.08), inset 0 0 8px rgba(245, 197, 24, 0.04)',
            };
          } else {
            // 'faint'
            styleObject = {
              ...styleObject,
              background: 'rgba(6, 6, 6, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.02)',
              boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.8)',
            };
          }

          return (
            <motion.div
              key={block.id}
              className="transition-all duration-700"
              animate={{
                y: shiftY,
                x: shiftX,
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={styleObject}
            >
              {block.marker && (
                <span className="absolute top-1.5 left-2 font-mono text-[7px] font-bold text-[#F5C518]/35 select-none">
                  {block.marker}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── 3. Subtle Central Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.72) 48%, rgba(0, 0, 0, 0.15) 75%, rgba(0, 0, 0, 0.85) 100%)',
        }}
      />
    </div>
  );
}

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [stage, setStage] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = v < 0.2 ? 0 : v < 0.4 ? 1 : v < 0.6 ? 2 : v < 0.8 ? 3 : 4;
    setStage((p) => (p === next ? p : next));
  });

  const current = getStageLabel(stages[stage]);
  const isIntro = stage === 0;
  const isBuild = stage === 3;

  return (
    <section id="process" ref={ref} className="relative h-[500vh] overflow-x-clip bg-black">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-black">
        
        {/* AeroShards background */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <AeroShards
            backgroundColor="#050505"
            shardColor="#8A7418"
            accentColor="#F5C518"
            placement="full"
            flow="stream"
            material="satin"
            detail="fine"
            effect="none"
            scale={1}
            spread={1}
            depth={1}
            speed={0.7}
            spin={0.8}
            interaction="none"
            density={0.85}
            shardSize={0.9}
            stretch={1.1}
            turbulence={0.8}
            glow={0.7}
            edgeSoftness={2}
            bloom={0.35}
            grain={0.035}
            chromaticAberration={0.002}
            transitionDuration={1}
            interactionRadius={1.5}
            interactionStrength={0.5}
            rippleIntensity={0}
            holdToGather={false}
            onError={(error: Error) => console.error('[AeroShards] WebGPU error:', error)}
          />
        </div>

        {/* decorative dot matrix right */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[6vw] top-10 hidden h-[80px] w-[140px] opacity-[0.07] md:block z-10"
          style={{ backgroundImage: 'radial-gradient(circle, #F5C518 1.2px, transparent 1.5px)', backgroundSize: '14px 14px' }}
        />

        {/* center stage (centered storytelling untouched) */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-[clamp(18px,5vw,64px)]">
          <div className="w-full max-w-[860px] text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)', rotate: 2 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', rotate: 0 }}
                exit={{ opacity: 0, y: -35, filter: 'blur(8px)', rotate: -1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="will-change-transform"
              >
                {isIntro ? (
                  <h2 className="h-display mx-auto mt-3 max-w-[14ch] text-[clamp(48px,8vw,104px)] leading-[0.86] text-center">
                    <span className="block text-white">
                      <SplitReveal text="CARA SAYA" active={true} />
                    </span>
                    <span className="block text-white">
                      <SplitReveal text="MEMBANGUN PRODUK" active={true} />
                    </span>
                    <span className="block" style={{ color: 'transparent', WebkitTextStroke: '2px #F5C518' }}>
                      <SplitReveal text="DIGITAL." active={true} />
                    </span>
                  </h2>
                ) : (
                  <>
                    <div className="relative mx-auto inline-block">
                      {/* dekoratif 01-04 — SATU angka besar outline, overlap huruf pertama */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -left-[0.55em] top-[8%] -translate-y-1/2 select-none font-display text-[clamp(64px,10vw,118px)] font-black leading-none opacity-[0.68]"
                        style={{ color: 'transparent', WebkitTextStroke: '3px #F5C518' }}
                      >
                        {current.num}
                      </span>
                      <h2 className="relative z-10 font-display text-[clamp(38px,6vw,68px)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-white">
                        <SplitReveal text={current.title} active={true} />
                      </h2>
                    </div>
                    <p className="mx-auto mt-3 font-mono text-[12px] uppercase tracking-[0.16em] text-[#777]">{current.subtitle}</p>
                    <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-[1.7] text-[#888]">{current.description}</p>
                  </>
                )}

                {isBuild && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.4 }} className="mx-auto mt-8 max-w-[560px]">
                    <div className="h-px w-full bg-[#1a1a1a]" />
                    <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                      {[
                        ['FRONTEND', 'Interface'],
                        ['API', 'Communication'],
                        ['BACKEND', 'Logic'],
                        ['DATABASE', 'Data'],
                      ].map(([t, c], i) => (
                        <motion.div key={t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }} className="text-center">
                          <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full border border-[#F5C518]/30 bg-[#F5C518]/10 text-[7px] text-[#F5C518]">●</span>
                          <p className="mt-2 font-display text-[11px] font-extrabold tracking-[0.08em] text-white">{t}</p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#666]">{c}</p>
                        </motion.div>
                      ))}
                    </div>
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#333]">FRONTEND → API → BACKEND → DATABASE</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* minimal progress 01-04 */}
        <div className="relative z-10 shrink-0 px-[clamp(18px,5vw,64px)] pb-6 pt-4">
          <div className="mx-auto flex max-w-[520px] gap-1.5">
            {stages.slice(1).map((s, i) => {
              const idx = i + 1;
              const isActive = stage === idx;
              const isPast = stage > idx;
              return <span key={s.id} className={`h-px flex-1 transition-colors ${isActive || isPast ? 'bg-[#F5C518]' : 'bg-[#1a1a1a]'}`} />;
            })}
          </div>
          <div className="mx-auto mt-3 flex max-w-[520px] justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
            {stages.slice(1).map((s, i) => {
              const idx = i + 1;
              const label = getStageLabel(s);
              return <span key={s.id} className={stage === idx ? 'text-white' : 'text-[#333]'}>{s.num} — {label.title}</span>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
