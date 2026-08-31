'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

type Stage = { id: string; num?: string; title: string; subtitle: string; description?: string };

const stages: Stage[] = [
  { id: 'intro', title: 'HOW I BUILD DIGITAL PRODUCTS.', subtitle: '/PROCESS — INTRO', description: 'Centered sticky storytelling — one viewport, content replaces on scroll.' },
  { id: '01', num: '01', title: 'UNDERSTAND', subtitle: 'RESEARCH & REQUIREMENTS', description: 'Kickoff, stakeholder interview & scope mapping — prioritas fitur ditentukan sebelum desain.' },
  { id: '02', num: '02', title: 'STRUCTURE', subtitle: 'SYSTEM & DATABASE', description: 'Arsitektur informasi, ERD & API contract — fondasi yang scalable sebelum coding.' },
  { id: '03', num: '03', title: 'BUILD', subtitle: 'FULL-STACK DEVELOPMENT', description: 'Slicing, integrasi, state & data fetching — performa dan aksesibilitas dijaga.' },
  { id: '04', num: '04', title: 'REFINE', subtitle: 'TEST \u2022 OPTIMIZE \u2022 DEPLOY', description: 'QA, audit, optimasi & deploy — rilis aman dengan monitoring.' },
];

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

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [stage, setStage] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = v < 0.2 ? 0 : v < 0.4 ? 1 : v < 0.6 ? 2 : v < 0.8 ? 3 : 4;
    setStage((p) => (p === next ? p : next));
  });

  const current = stages[stage];
  const isIntro = stage === 0;
  const isBuild = stage === 3;

  return (
    <section ref={ref} className="relative h-[500vh] overflow-x-clip bg-black">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-black">
        <div
          aria-hidden
          className="pointer-events-none absolute right-[6vw] top-10 hidden h-[80px] w-[140px] opacity-[0.07] md:block"
          style={{ backgroundImage: 'radial-gradient(circle, #F5C518 1.2px, transparent 1.5px)', backgroundSize: '14px 14px' }}
        />

        {/* center stage */}
        <div className="flex flex-1 items-center justify-center px-[clamp(18px,5vw,64px)]">
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
                      <SplitReveal text="HOW I BUILD" active={true} />
                    </span>
                    <span className="block text-white">
                      <SplitReveal text="DIGITAL" active={true} />
                    </span>
                    <span className="block" style={{ color: 'transparent', WebkitTextStroke: '2px #F5C518' }}>
                      <SplitReveal text="PRODUCTS." active={true} />
                    </span>
                  </h2>
                ) : (
                  <>
                    <div className="relative mx-auto inline-block">
                      {/* dekoratif 01-04 — SATU angka besar outline, overlap huruf pertama */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -left-[0.12em] top-[42%] -translate-y-1/2 select-none font-display text-[clamp(64px,10vw,118px)] font-black leading-none opacity-[0.68]"
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
        <div className="shrink-0 px-[clamp(18px,5vw,64px)] pb-6 pt-4">
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
              return <span key={s.id} className={stage === idx ? 'text-white' : 'text-[#333]'}>{s.num} — {s.title}</span>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
