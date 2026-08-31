'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const steps = [
  { num: '01', title: 'UNDERSTAND', subtitle: 'Research & Requirements', description: 'Kickoff, stakeholder interview & scope mapping — prioritas fitur ditentukan sebelum desain.' },
  { num: '02', title: 'STRUCTURE', subtitle: 'System & Database', description: 'Arsitektur informasi, ERD & API contract — fondasi yang scalable sebelum coding.' },
  { num: '03', title: 'BUILD', subtitle: 'Full-Stack Development', description: 'Slicing, integrasi, state & data fetching — performa dan aksesibilitas dijaga.' },
  { num: '04', title: 'REFINE', subtitle: 'Test \u2022 Optimize \u2022 Deploy', description: 'QA, audit, optimasi & deploy — rilis aman dengan monitoring.' },
] as const;

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const nextActive = value >= 0.75 ? 3 : value >= 0.5 ? 2 : value >= 0.25 ? 1 : 0;
    setActive((prev) => (prev === nextActive ? prev : nextActive));
  });

  const currentStep = steps[active];

  return (
    <section ref={ref} className="relative h-[400vh] overflow-x-clip bg-black">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-black">
        {/* subtle dot — editorial, low */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[5vw] top-10 hidden h-[72px] w-[120px] opacity-[0.08] md:block"
          style={{ backgroundImage: 'radial-gradient(circle, #F5C518 1.2px, transparent 1.5px)', backgroundSize: '12px 12px' }}
        />

        {/* main — kiri headline statis vertikal, kanan focal */}
        <div className="flex flex-1 min-h-0 flex-col md:flex-row">
          {/* kiri */}
          <div className="flex flex-col justify-center px-[clamp(20px,5vw,64px)] py-10 md:w-[46%] md:py-0">
            <span className="eyebrow !mb-4 !text-[#F5C518]">/PROCESS</span>
            <h2 className="h-display flex flex-1 flex-col justify-center text-[clamp(52px,8.5vw,96px)] leading-[0.82]">
              <span className="block">HOW</span>
              <span className="block">I</span>
              <span className="block">BUILD</span>
              <span className="block">DIGITAL</span>
              <span className="block outline">PRODUCTS.</span>
            </h2>
          </div>

          {/* kanan — hanya currentStep — geser kanan + perbesar */}
          <div className="flex flex-1 items-center px-[clamp(20px,5vw,64px)] py-8 md:pl-16 md:pr-8 lg:pl-20">
            <div className="relative h-[380px] w-full max-w-[560px] translate-x-2 overflow-hidden md:translate-x-4 md:h-[420px]">
              {steps.map((s, i) => {
                const offset = i - active;
                const isActive = offset === 0;
                const isNext = offset === 1;
                const isNext2 = offset === 2;
                const isPrev = offset === -1;
                let y = 0, opacity = 0, blur = 0, scale = 1, z = 0;
                if (isActive) { y = 0; opacity = 1; blur = 0; scale = 1; z = 10; }
                else if (isNext) { y = 155; opacity = 0.5; blur = 2; scale = 0.98; z = 5; }
                else if (isNext2) { y = 260; opacity = 0.24; blur = 4; scale = 0.95; z = 3; }
                else if (isPrev) { y = -70; opacity = 0.22; blur = 1.5; scale = 0.98; z = 5; }
                else if (offset < -1) { y = -160; opacity = 0; blur = 8; scale = 0.92; z = 0; }
                else { y = 300; opacity = 0; blur = 12; scale = 0.9; z = 0; }
                return (
                  <motion.div
                    key={s.num}
                    initial={false}
                    animate={{ y, opacity, scale, filter: `blur(${blur}px)` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ zIndex: z }}
                    className="absolute inset-x-0 top-[110px]"
                  >
                    <p className={`font-mono text-[11px] uppercase tracking-[0.22em] ${isActive ? 'text-[#F5C518]' : 'text-[#555]'}`}>{s.num} — {s.title}</p>
                    <h3 className={`mt-2 font-display font-extrabold uppercase leading-[0.9] tracking-[-0.02em] ${isActive ? 'text-[clamp(32px,5vw,52px)] text-white' : 'text-[clamp(22px,3.5vw,32px)] text-[#666]'}`}>
                      {s.title}
                    </h3>
                    <p className={`mt-2 font-mono uppercase tracking-[0.16em] ${isActive ? 'text-[12px] text-[#777]' : 'text-[11px] text-[#555]'}`}>{s.subtitle}</p>
                    <p className={`mt-3 leading-[1.7] ${isActive ? 'max-w-[44ch] text-[15px] text-[#888]' : 'max-w-[38ch] text-[13px] text-[#555]'}`}>{s.description}</p>
                    {isActive && i === 2 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }} className="mt-6">
                        <div className="h-px w-full bg-[#1a1a1a]" />
                        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                          {[
                            ['FRONTEND', 'Interface'],
                            ['API', 'Communication'],
                            ['BACKEND', 'Logic'],
                            ['DATABASE', 'Data'],
                          ].map(([t, c], idx) => (
                            <motion.div key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 + idx * 0.07, duration: 0.35 }} className="space-y-1.5">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#F5C518]/30 bg-[#F5C518]/10 text-[7px] text-[#F5C518]">●</span>
                              <p className="font-display text-[10px] font-extrabold tracking-[0.08em] text-white">{t}</p>
                              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#666]">{c}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* bawah — minimal progress 01–04 */}
        <div className="shrink-0 px-[clamp(20px,5vw,64px)] pb-6 pt-4">
          <div className="flex gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
            {steps.map((s, i) => (
              <span key={s.num} className={`transition-colors ${i === active ? 'text-white' : 'text-[#333]'}`}>
                {s.num} — {s.title}
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-1.5">
            {steps.map((_, i) => (
              <span key={i} className={`h-px flex-1 transition-colors ${i <= active ? 'bg-[#F5C518]/50' : 'bg-[#1a1a1a]'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
