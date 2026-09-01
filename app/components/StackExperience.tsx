'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';

const experiences = [
  {
    num: '01',
    company: 'Pekerja Lepas',
    role: { en: 'Full Stack Web Developer', id: 'Pengembang Web Full Stack' },
    desc: { en: 'Developed and delivered custom web applications for various clients across different industries. Handled everything from UI/UX design to backend development, database architecture, and cloud deployment.', id: 'Mengembangkan dan mengirimkan aplikasi web kustom untuk berbagai klien di berbagai industri. Menangani seluruh proses dari desain UI/UX hingga pengembangan backend, arsitektur basis data, dan deployment cloud.' },
    tags: ['React', 'Next.js', 'Laravel', 'MySQL', 'Tailwind CSS'],
    period: '2023 — Sekarang',
  },
  {
    num: '02',
    company: 'PT. XYZ Technology',
    role: { en: 'Junior Web Developer', id: 'Pengembang Web Junior' },
    desc: { en: 'Built and maintained internal web tools and client-facing applications. Collaborated with senior developers to implement new features, optimize performance, and fix production bugs in a fast-paced agile environment.', id: 'Membangun dan memelihara alat web internal dan aplikasi yang dihadapi klien. Berkolaborasi dengan pengembang senior untuk mengimplementasikan fitur baru, mengoptimalkan performa, dan memperbaiki bug produksi dalam lingkungan agile yang cepat.' },
    tags: ['Vue.js', 'PHP', 'REST API', 'Git'],
    period: '2022 — 2023',
  },
  {
    num: '03',
    company: 'Universitas Negeri Gorontalo',
    role: { en: 'Informatics Engineering — S1', id: 'Teknik Informatika — S1' },
    desc: { en: "Bachelor's degree in Informatics Engineering. Focused on web development, algorithms, data structures, database systems, and software engineering principles. Active in campus tech community.", id: "Sarjana Teknik Informatika. Berfokus pada pengembangan web, algoritma, struktur data, sistem database, dan prinsip rekayasa perangkat lunak. Aktif di komunitas teknologi kampus." },
    tags: ['Algoritma', 'Basis Data', 'Pengembangan Web', 'OOP'],
    period: '2020 — 2024',
  },
];

export default function StackExperience() {
  const wrapRef  = useRef<HTMLElement>(null);
  const areaRef  = useRef<HTMLDivElement>(null);
  const { lang, t } = useLanguage();

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
            <span className="eyebrow">/pengalaman</span>
            <h2 className="h-display h-lg">
              {t('experience.heading').split(' ')[0]} <span className="outline">{t('experience.heading').split(' ')[1]}</span>
            </h2>
          </div>
          <p className="lede" style={{ maxWidth: '34ch' }}>
            {t('experience.lede')}
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
                    <span className="role">{typeof exp.role === 'string' ? exp.role : exp.role[lang]}</span>
                  </div>
                  <p className="stack-desc">{typeof exp.desc === 'string' ? exp.desc : exp.desc[lang]}</p>
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
