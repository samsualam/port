'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../contexts/LanguageContext';

const projects = [
  {
    num: '01',
    role: { en: 'Full Stack Developer · Web App', id: 'Full Stack Developer · Web App' },
    name: 'Sistem Informasi Tamu Digital',
    tagline: { en: 'Solusi digital untuk menggantikan buku tamu fisik.', id: 'Solusi digital untuk menggantikan buku tamu fisik.' },
    desc: { en: 'Dirancang untuk memudahkan pencatatan, pelacakan, dan analisis data pengunjung secara real-time. Dilengkapi dengan antarmuka admin yang intuitif, ekspor laporan, dan notifikasi otomatis.', id: 'Dirancang untuk memudahkan pencatatan, pelacakan, dan analisis data pengunjung secara real-time. Dilengkapi dengan antarmuka admin yang intuitif, ekspor laporan, dan notifikasi otomatis.' },
    tags: ['Next.js', 'Express', 'PostgreSQL', 'Socket.io'],
    year: '2024',
    mockup: 'https://nnpmfxqefxbhrckhequc.supabase.co/storage/v1/object/public/assets/iphone-x-mockup%20(1).png',
    bg: 'https://nnpmfxqefxbhrckhequc.supabase.co/storage/v1/object/public/assets/ipad-screen-mockup-with-keyboard.png',
    bgStyle: { width: '115%', height: '115%', objectFit: 'cover' as const, position: 'absolute' as const, right: '-16%', top: '-4%', left: 'auto', bottom: 'auto' },
  },
  {
    num: '02',
    role: { en: 'Full Stack Developer · Web App', id: 'Full Stack Developer · Web App' },
    name: 'Arsip Digital',
    tagline: { en: 'Solusi digital untuk mengelola dokumen secara terpusat.', id: 'Solusi digital untuk mengelola dokumen secara terpusat.' },
    desc: { en: 'Dirancang untuk memudahkan penyimpanan, pencarian, dan distribusi arsip dengan sistem autentikasi yang ketat, riwayat aktivitas (audit log), dan integrasi cloud storage.', id: 'Dirancang untuk memudahkan penyimpanan, pencarian, dan distribusi arsip dengan sistem autentikasi yang ketat, riwayat aktivitas (audit log), dan integrasi cloud storage.' },
    tags: ['React', 'Node.js', 'PostgreSQL', 'Prisma'],
    year: '2024',
    mockup: 'https://nnpmfxqefxbhrckhequc.supabase.co/storage/v1/object/public/assets/iphone-x-mockup%20(2).png',
    bg: 'https://nnpmfxqefxbhrckhequc.supabase.co/storage/v1/object/public/assets/b31570ff-af9c-4748-a423-d32305c140a2.png',
    bgStyle: { width: '71%', height: 'auto', objectFit: 'contain' as const, position: 'absolute' as const, right: '-15%', top: '-7%', left: 'auto', bottom: 'auto' },
    mockupStyle: { marginRight: '6%' },
  },
  {
    num: '03',
    role: { en: 'Full Stack Developer · Web App', id: 'Full Stack Developer · Web App' },
    name: 'GISTARU',
    tagline: { en: 'Solusi digital untuk mengelola data spasial dan perizinan secara terpusat.', id: 'Solusi digital untuk mengelola data spasial dan perizinan secara terpusat.' },
    desc: { en: 'Dirancang dengan peta interaktif untuk visualisasi zonasi, tracking progres perizinan, notifikasi otomatis, serta sistem manajemen dokumen pendukung yang aman dan terstruktur.', id: 'Dirancang dengan peta interaktif untuk visualisasi zonasi, tracking progres perizinan, notifikasi otomatis, serta sistem manajemen dokumen pendukung yang aman dan terstruktur.' },
    tags: ['React', 'Node.js', 'PostgreSQL', 'MapLibre/Leaflet', 'Prisma'],
    year: '2023',
    mockup: 'https://nnpmfxqefxbhrckhequc.supabase.co/storage/v1/object/public/assets/iphone-x-mockup%20(3)%20(1).png',
    bg: 'https://nnpmfxqefxbhrckhequc.supabase.co/storage/v1/object/public/assets/352ef136-2ee4-4b0d-9495-d3731d9f6aab.png',
    bgStyle: { width: '60%', height: 'auto', objectFit: 'contain' as const, position: 'absolute' as const, right: '-6%', top: '-4%', left: 'auto', bottom: 'auto' },
    mockupStyle: { marginRight: '6%' },
  },
  {
    num: '04',
    role: { en: 'Full Stack Developer · Web', id: 'Full Stack Developer · Web' },
    name: 'Web Profil Jurusan',
    tagline: { en: 'Solusi digital untuk mempresentasikan profil jurusan secara interaktif dan informatif.', id: 'Solusi digital untuk mempresentasikan profil jurusan secara interaktif dan informatif.' },
    desc: { en: 'Dirancang dengan sistem manajemen konten (CMS) untuk mengupdate visi-misi, struktur organisasi, kurikulum, prestasi, dan agenda akademik secara real-time.', id: 'Dirancang dengan sistem manajemen konten (CMS) untuk mengupdate visi-misi, struktur organisasi, kurikulum, prestasi, dan agenda akademik secara real-time.' },
    tags: ['Laravel', 'MySQL', 'Tailwind CSS', 'Alpine.js'],
    year: '2023',
    mockup: 'https://nnpmfxqefxbhrckhequc.supabase.co/storage/v1/object/public/assets/iphone-x-mockup%20(4).png',
    bg: 'https://nnpmfxqefxbhrckhequc.supabase.co/storage/v1/object/public/assets/05159a54-dedb-4f44-8321-14454d588b67.png',
    bgStyle: { width: '60%', height: 'auto', objectFit: 'contain' as const, position: 'absolute' as const, right: '-6%', top: '-7%', left: 'auto', bottom: 'auto' },
    mockupStyle: { marginRight: '6%' },
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef   = useRef<HTMLDivElement>(null);
  const htrackRef  = useRef<HTMLDivElement>(null);
  const dotsRef    = useRef<(HTMLElement | null)[]>([]);
  const countRef   = useRef<HTMLSpanElement>(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | null = null;

    const init = () => {
      ctx?.revert();
      ctx = null;

      if (window.innerWidth <= 900) return;

      const stage  = stageRef.current;
      const htrack = htrackRef.current;
      if (!stage || !htrack) return;

      const cards = Array.from(htrack.querySelectorAll<HTMLElement>('.hcard'));
      if (!cards.length) return;

      // Each card is 100vw
      const cardWidth   = window.innerWidth;
      const totalScroll = cardWidth * (cards.length - 1);

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

    const raf = requestAnimationFrame(() => {
      init();
    });

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
              {t('projects.heading').split(' ')[0]}{' '}
              <span className="outline">{t('projects.heading').split(' ')[1]}</span>
            </h2>
          </div>

          {/* Pagination dots + counter — kanan atas seperti referensi */}
          <div className="pin-head-right">
            <div className="pin-dots">
              {projects.map((_, i) => (
                <span
                  key={i}
                  className={`pin-dot${i === 0 ? ' on' : ''}`}
                  ref={(el) => { dotsRef.current[i] = el; }}
                />
              ))}
            </div>
            <span className="pin-count" ref={countRef}>
              01 / 0{projects.length}
            </span>
          </div>
        </div>

        {/* Horizontal track */}
        <div className="htrack" ref={htrackRef}>
          {projects.map((p, i) => (
            <div className={`hcard${i === 0 ? ' on' : ''}`} key={p.num}>
              {/* Background overlay */}
              <div className="hcard-bg">
                {p.bg && (
                  <img src={p.bg} alt="" aria-hidden="true" style={p.bgStyle ?? undefined} />
                )}
              </div>
              {/* Accent line kiri */}
              <div className="hcard-accent" />
              {/* Nomor ghost besar */}
              <div className="hcard-num" aria-hidden="true">{p.num}</div>

              {/* Kiri: teks */}
              <div className="hcard-text">
                <div className="hcard-role" data-num={p.num}>
                  <span className="hcard-role-sep" />
                  {typeof p.role === 'string' ? p.role : p.role[lang]}
                </div>
                <h3 className="hcard-name">{p.name}</h3>
                <p className="hcard-tagline">
                  {typeof p.tagline === 'string' ? p.tagline : p.tagline[lang]}
                </p>
                <p className="hcard-desc">
                  {typeof p.desc === 'string' ? p.desc : p.desc[lang]}
                </p>
                <div className="hcard-tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="hcard-tag">{tag}</span>
                  ))}
                </div>
                <a className="hcard-go" href="#">
                  {t('projects.seeAll')} <i className="hcard-go-arrow">→</i>
                </a>
              </div>

              {/* Kanan: mockup HP */}
              {p.mockup && (
                <div className="hcard-mockup-area">
                  <div className="hcard-mockup">
                    <img src={p.mockup} alt={`${p.name} mockup`} />
                  </div>
                </div>
              )}

              <div className="hcard-year">{p.year}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint bawah tengah */}
        <div className="pin-scroll-hint" aria-hidden="true">
          SCROLL TO EXPLORE →
        </div>
      </div>
    </section>
  );
}
