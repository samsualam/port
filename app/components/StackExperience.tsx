'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const experiences = [
  {
    num: '01',
    company: 'Freelance',
    role: 'Full Stack Web Developer',
    desc: 'Developed and delivered custom web applications for various clients across different industries. Handled everything from UI/UX design to backend development, database architecture, and cloud deployment.',
    tags: ['React', 'Next.js', 'Laravel', 'MySQL', 'Tailwind CSS'],
    period: '2023 — Present',
  },
  {
    num: '02',
    company: 'PT. XYZ Technology',
    role: 'Junior Web Developer',
    desc: 'Built and maintained internal web tools and client-facing applications. Collaborated with senior developers to implement new features, optimize performance, and fix production bugs in a fast-paced agile environment.',
    tags: ['Vue.js', 'PHP', 'REST API', 'Git'],
    period: '2022 — 2023',
  },
  {
    num: '03',
    company: 'Universitas Negeri Gorontalo',
    role: 'Informatics Engineering — S1',
    desc: "Bachelor's degree in Informatics Engineering. Focused on web development, algorithms, data structures, database systems, and software engineering principles. Active in campus tech community.",
    tags: ['Algorithms', 'Database', 'Web Development', 'OOP'],
    period: '2020 — 2024',
  },
];

export default function StackExperience() {
  const wrapRef  = useRef<HTMLElement>(null);
  const areaRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const area  = areaRef.current;
    const wrap  = wrapRef.current;
    if (!area || !wrap) return;

    let ctx: gsap.Context | null = null;

    try {
      gsap.registerPlugin(ScrollTrigger);

      const items = area.querySelectorAll<HTMLElement>('.stack-item');
      if (!items.length) return;

      ctx = gsap.context(() => {
        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => {
              items.forEach((el, j) => el.classList.toggle('on', j === i));
            },
            onEnterBack: () => {
              items.forEach((el, j) => el.classList.toggle('on', j === i));
            },
          });

          gsap.fromTo(
            item,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }, wrap);

      return () => ctx?.revert();
    } catch (e) {
      console.error('[StackExperience] GSAP error:', e);
      return () => ctx?.revert();
    }
  }, []);

  return (
    <section className="stack-wrap" id="experience" ref={wrapRef}>
      <div className="stack-stage">
        {/* Head */}
        <div className="stack-head">
          <div>
            <span className="eyebrow">/experience</span>
            <h2 className="h-display h-lg">
              Work <span className="outline">history</span>
            </h2>
          </div>
          <p className="lede" style={{ maxWidth: '34ch' }}>
            3+ years building web applications across freelance, internship, and full-time roles.
          </p>
        </div>

        {/* Stack area */}
        <div className="stack-area" ref={areaRef}>
          {experiences.map((exp, i) => (
            <article className={`stack-item${i === 0 ? ' on' : ''}`} key={exp.num}>
              <div className="stack-card">
                {/* Number */}
                <div className="stack-num">{exp.num}</div>

                {/* Content */}
                <div>
                  <div className="stack-title">
                    <h3>{exp.company}</h3>
                    <span className="role">{exp.role}</span>
                  </div>
                  <p className="stack-desc">{exp.desc}</p>
                  <div className="stack-tags">
                    {exp.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Year */}
                <div className="stack-side">
                  <span className="stack-year">{exp.period}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
