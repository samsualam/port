'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const projects = [
  {
    num: '01',
    role: 'Full Stack Developer · Web App',
    name: 'E-Commerce Platform',
    tagline: 'Building a complete online shopping experience from ground up.',
    desc: 'Developed a full-featured e-commerce platform with product management, cart system, payment gateway integration (Midtrans), and real-time order tracking dashboard.',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Midtrans'],
    year: '2024',
  },
  {
    num: '02',
    role: 'Frontend Developer · Dashboard',
    name: 'Analytics Dashboard',
    tagline: 'Real-time data visualization for a SaaS product.',
    desc: 'Designed and developed an interactive analytics dashboard with dynamic charts, advanced filtering, date range picker, and CSV/PDF export capabilities.',
    tags: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS'],
    year: '2024',
  },
  {
    num: '03',
    role: 'Full Stack Developer · CMS',
    name: 'Company CMS',
    tagline: 'Empowering non-technical teams to own their content.',
    desc: 'Built a custom content management system allowing marketing teams to update website pages, blog posts, and media assets — no developer involvement needed.',
    tags: ['Laravel', 'Vue.js', 'MySQL', 'REST API'],
    year: '2023',
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef   = useRef<HTMLDivElement>(null);
  const htrackRef  = useRef<HTMLDivElement>(null);
  const dotsRef    = useRef<(HTMLElement | null)[]>([]);
  const countRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | null = null;

    const init = () => {
      // Kill any existing ScrollTriggers from this component before re-init
      ctx?.revert();
      ctx = null;

      // Mobile: CSS handles vertical stack, no GSAP needed
      if (window.innerWidth <= 900) return;

      const stage  = stageRef.current;
      const htrack = htrackRef.current;
      if (!stage || !htrack) return;

      const cards = Array.from(htrack.querySelectorAll<HTMLElement>('.hcard'));
      if (!cards.length) return;

      // Force a layout flush so getBoundingClientRect is accurate
      const cardWidth   = cards[0].getBoundingClientRect().width;
      const totalScroll = cardWidth * (cards.length - 1);

      if (cardWidth <= 0) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            pin: true,
            pinSpacing: true,
            start: 'top top',
            end: () => `+=${totalScroll}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress  = self.progress;
              const cardIndex = Math.min(
                cards.length - 1,
                Math.round(progress * (cards.length - 1))
              );

              dotsRef.current.forEach((dot, i) => {
                dot?.classList.toggle('on', i === cardIndex);
              });

              if (countRef.current) {
                countRef.current.textContent =
                  `0${cardIndex + 1} / 0${cards.length}`;
              }

              cards.forEach((card, i) =>
                card.classList.toggle('on', i === cardIndex)
              );
            },
          },
        });

        tl.to(htrack, {
          x: () => -totalScroll,
          ease: 'none',
        });
      }, sectionRef);
    };

    // Wait for fonts + paint before measuring
    const raf = requestAnimationFrame(() => {
      init();
    });

    // Re-init on resize (handles mobile ↔ desktop switch)
    const onResize = () => {
      ScrollTrigger.refresh();
      init();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      ctx?.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="pin-wrap" id="work" ref={sectionRef}>
      <div className="pin-stage" ref={stageRef}>
        {/* Head */}
        <div className="pin-head">
          <div>
            <span className="eyebrow">/work</span>
            <h2 className="h-display h-lg">
              Selected <span className="outline">cases</span>
            </h2>
          </div>
          <div className="pin-dots">
            {projects.map((_, i) => (
              <i
                key={i}
                className={i === 0 ? 'on' : ''}
                ref={(el) => { dotsRef.current[i] = el; }}
              />
            ))}
            <span className="pin-count" ref={countRef}>
              01 / 0{projects.length}
            </span>
          </div>
        </div>

        {/* Horizontal track */}
        <div className="htrack" ref={htrackRef}>
          {projects.map((p, i) => (
            <div className={`hcard${i === 0 ? ' on' : ''}`} key={p.num}>
              <div className="hcard-bg" />
              <div className="hcard-accent" />
              <div className="hcard-num" aria-hidden="true">{p.num}</div>
              <div className="hcard-body">
                <div className="hcard-meta">
                  <span className="idx">{p.num}</span>
                  <i className="sep" />
                  <span className="cat">{p.role}</span>
                </div>
                <h3 className="hcard-name">{p.name}</h3>
                <p className="hcard-tagline">{p.tagline}</p>
                <p className="hcard-desc">{p.desc}</p>
                <div className="hcard-tags">
                  {p.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <span className="hcard-go">
                  View project <i>↗</i>
                </span>
              </div>
              <div className="hcard-year">{p.year}</div>
            </div>
          ))}
        </div>

        {/* Hint */}
        <div className="pin-hint">
          <span>scroll to explore</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
