'use client';

import { useEffect, useRef, Suspense, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from './ErrorBoundary';
import Shuffle from '@/components/Shuffle';
import { useLanguage } from '../contexts/LanguageContext';
import LogoLoopComponent from './LogoLoop';
import StaggeredMenu from './StaggeredMenu';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiLaravel,
  SiPostgresql,
} from 'react-icons/si';
const LogoLoop = LogoLoopComponent as ComponentType<any>;

// Semua komponen berat dijadikan dynamic (client-only, no SSR)
const SideRays = dynamic(() => import('@/components/SideRays'), { ssr: false });
const PixelBlast = dynamic(() => import('@/components/PixelBlast'), { ssr: false });
const HorizontalScroll = dynamic(() => import('./HorizontalScroll'), { ssr: false });
const ProcessSection = dynamic(() => import('./ProcessSection'), { ssr: false });

export default function ClientShell() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [heroImgError, setHeroImgError] = useState(false);
  const { lang, setLang, t } = useLanguage();

  /* ── Hero load animation ─────────────────────────────────── */
  useEffect(() => {
    document.body.classList.add('is-loaded');
  }, []);

  /* ── Update html lang attribute ─────────────────────────── */
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /* ── Nav scroll effect ──────────────────────────────────── */
  useEffect(() => {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Nav toggle (mobile) ────────────────────────────────── */
  useEffect(() => {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    const onClick = () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      links.classList.toggle('is-open');
    };

    toggle.addEventListener('click', onClick);
    return () => toggle.removeEventListener('click', onClick);
  }, []);

  /* ── Scroll progress bar ────────────────────────────────── */
  useEffect(() => {
    const fill = progressRef.current;
    if (!fill) return;
    const onScroll = () => {
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      fill.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Fade-up on scroll ──────────────────────────────────── */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.fade-up');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Grain */}
      <div className="grain" aria-hidden="true" />

      {/* Scroll progress */}
      <div className="scroll-progress">
        <div className="scroll-progress-fill" ref={progressRef} />
      </div>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="nav" id="site-nav">
        <a className="nav-logo" href="#">
          <img
            src="/images/logo.png"
            alt="Samsu Alam"
            className="h-10 md:h-11 w-auto object-contain"
          />
          <span>SΛMSU ΛLΛM</span>
        </a>
        <ul className="nav-links" id="nav-links">
          <li><a href="#">{t('nav.home')}</a></li>
          <li><a href="#work">{t('nav.work')}</a></li>
          <li><a href="#process">/proses</a></li>
          <li><a href="#contact">{t('nav.contact')}</a></li>
          <li>
            <a className="nav-cta" href="mailto:samsualam@email.com">
              Let's talk →
            </a>
          </li>
        </ul>

        <button
          className="nav-toggle"
          id="nav-toggle"
          aria-label="Buka menu"
          aria-expanded="false"
          aria-controls="nav-links"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <StaggeredMenu
        items={[
          { label: '/BERANDA', ariaLabel: 'Ke beranda', link: '#' },
          { label: '/PROYEK', ariaLabel: 'Lihat proyek', link: '#work' },
          { label: '/PROSES', ariaLabel: 'Lihat proses', link: '#process' },
          { label: '/KONTAK', ariaLabel: 'Hubungi saya', link: '#contact' },
        ]}
        socialItems={[
          { label: 'LinkedIn', link: 'https://linkedin.com/in/samsualam' },
          { label: 'GitHub', link: 'https://github.com' },
        ]}
      />

      <div className="hero-wrap">
        {/* SideRays — wrapped agar crash tidak merusak halaman */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '160vh',
            pointerEvents: 'none',
            zIndex: 4,
            mixBlendMode: 'screen',
            opacity: 0.4,
          }}
        >
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <SideRays
                speed={2.5}
                rayColor1="#EAB308"
                rayColor2="#96c8ff"
                intensity={3}
                spread={3}
                origin="top-right"
                tilt={0}
                saturation={1.5}
                blend={0.75}
                falloff={1.6}
                opacity={1.0}
              />
            </Suspense>
          </ErrorBoundary>
        </div>

        <header className="hero">
          {/* PixelBlast — wrapped agar crash tidak merusak halaman */}
          <div className="absolute inset-0 z-0">
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <PixelBlast
                  variant="circle"
                  pixelSize={4}
                  color="#FFD700"
                  patternScale={2}
                  patternDensity={1.5}
                  pixelSizeJitter={0.1}
                  enableRipples
                  rippleSpeed={0.3}
                  rippleThickness={0.15}
                  rippleIntensityScale={1.2}
                  liquid
                  liquidStrength={0.1}
                  liquidRadius={1}
                  liquidWobbleSpeed={3}
                  speed={0.4}
                  edgeFade={0.15}
                  transparent
                />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Background image */}
          <div className="hero-bg">
            <img
              src="https://nnpmfxqefxbhrckhequc.supabase.co/storage/v1/object/public/assets/WhatsApp%20Image%202026-08-27%20at%2012.25.33%20PM.jpeg"
              alt="Portrait of Samsu Alam"
              onError={() => setHeroImgError(true)}
              style={{ display: heroImgError ? 'none' : 'block' }}
            />
            {heroImgError && <div className="hero-bg-fallback" aria-hidden="true" />}
          </div>
          <div className="hero-veil" />

          <div className="hero-place" data-hero-fade>
            Gorontalo · Indonesia · 2026
          </div>

          <div className="hero-inner">
            <div className="flex flex-wrap items-baseline gap-2 md:gap-4">
              <span className="mask">
                <Shuffle
                  text="SAMSU"
                  shuffleDirection="right"
                  duration={0.35}
                  animationMode="evenodd"
                  shuffleTimes={1}
                  ease="power3.out"
                  stagger={0.03}
                  threshold={1}
                  rootMargin="0px"
                  triggerOnce={true}
                  triggerOnHover
                  respectReducedMotion={true}
                  loop={false}
                  loopDelay={0}
                  tag="span"
                  className="font-press-start !text-[clamp(40px,7vw,80px)] !leading-none"
                  style={{ color: '#FFD700', display: 'inline-block', fontWeight: 400 }}
                  onShuffleComplete={() => {}}
                  colorFrom=""
                  colorTo=""
                />
              </span>
              <span className="mask">
                <Shuffle
                  text="ALAM"
                  shuffleDirection="right"
                  duration={0.35}
                  animationMode="evenodd"
                  shuffleTimes={1}
                  ease="power3.out"
                  stagger={0.03}
                  threshold={1}
                  rootMargin="0px"
                  triggerOnce={true}
                  triggerOnHover
                  respectReducedMotion={true}
                  loop={false}
                  loopDelay={0}
                  tag="span"
                  onShuffleComplete={() => {}}
                  colorFrom=""
                  colorTo=""
                  className="font-press-start !text-[clamp(40px,7vw,80px)] !leading-none"
                  style={{
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    color: '#FFD700',
                    display: 'inline-block'
                  }}
                />
              </span>
            </div>

            <div className="hero-tag">
              <i className="bar" />
              <span dangerouslySetInnerHTML={{ __html: t('hero.role') }} />
            </div>

            <p className="hero-blurb">
               {t('hero.blurb')}
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="/cv.pdf" download>
                {t('hero.cv')}
              </a>
              <a className="btn btn-ghost" href="#work">
                {t('hero.viewWork')}
              </a>
            </div>
          </div>

          <div className="hero-scroll" data-hero-fade>
            <span>scroll</span>
            <i />
          </div>
        </header>
      </div>

      {/* ── MARQUEE 1 ───────────────────────────────────────── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>{t('marquee.fullstack')}</span><span>//</span>
          <span>{t('marquee.ui')}</span><span>//</span>
          <span>{t('marquee.api')}</span><span>//</span>
          <span>{t('marquee.db')}</span><span>//</span>
          <span>{t('marquee.react')}</span><span>//</span>
          <span>{t('marquee.laravel')}</span><span>//</span>
          <span>{t('marquee.responsive')}</span><span>//</span>
          <span>{t('marquee.ai')}</span><span>//</span>
          <span>{t('marquee.fullstack')}</span><span>//</span>
          <span>{t('marquee.ui')}</span><span>//</span>
          <span>{t('marquee.api')}</span><span>//</span>
          <span>{t('marquee.db')}</span><span>//</span>
          <span>{t('marquee.react')}</span><span>//</span>
          <span>{t('marquee.laravel')}</span><span>//</span>
          <span>{t('marquee.responsive')}</span><span>//</span>
          <span>{t('marquee.ai')}</span><span>//</span>
        </div>
      </div>

      {/* ── STATS /numbers ──────────────────────────────────── */}
      <section className="stats section" style={{ position: 'relative' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">/angka</span>
            <h2 className="h-display h-lg fade-up">
              Berdasarkan <span className="outline">angka</span>
            </h2>
          </div>
          <div className="stats-grid">
            <div className="stat fade-up">
              <div className="stat-number">3+</div>
              <div className="stat-label">{t('stats.years')}</div>
              <p className="stat-desc">
                {t('stats.desc1')}
              </p>
            </div>
            <div className="stat fade-up" style={{ transitionDelay: '0.1s' }}>
              <div className="stat-number">20+</div>
              <div className="stat-label">{t('stats.projects')}</div>
              <p className="stat-desc">
                {t('stats.desc2')}
              </p>
            </div>
            <div className="stat fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="stat-number">10+</div>
              <div className="stat-label">{t('stats.technologies')}</div>
              <p className="stat-desc">
                {t('stats.desc3')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL SCROLL /work ─────────────────────────── */}
      <div className="relative">
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <HorizontalScroll />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* ── PROCESS ───────────────────────────────────────── */}
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <ProcessSection />
        </Suspense>
      </ErrorBoundary>

      {/* ── CTA /contact ────────────────────────────────────── */}
      <section className="cta-band" id="contact">
        <div className="ghost-word" aria-hidden="true">SAMSU ALAM</div>
        <div className="container cta-inner">
          <span className="eyebrow">/contact</span>
          <div className="cta-words">
            <div className="fade-up">{t('cta.letsBuild')}</div>
            <div className="fade-up">
              DARI <span className="text-[#F5C518]">IDE</span> MENJADI{' '}
              <span className="text-[#F5C518]">NYATA</span>
              <span className="inline-block w-[0.15em] h-[0.15em] rounded-full bg-[#F5C518] align-baseline mb-[0.08em] ml-[0.12em]" />
            </div>
          </div>
          <a className="cta-mail" href="mailto:samsualam@email.com">
            samsualam@email.com
          </a>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <div className="footer-loop" aria-label="Teknologi dan layanan">
        <LogoLoop
          logos={[
            { node: <SiReact />, title: 'React' },
            { node: <SiNextdotjs />, title: 'Next.js' },
            { node: <SiTypescript />, title: 'TypeScript' },
            { node: <SiTailwindcss />, title: 'Tailwind CSS' },
            { node: <SiNodedotjs />, title: 'Node.js' },
            { node: <SiLaravel />, title: 'Laravel' },
            { node: <SiPostgresql />, title: 'PostgreSQL' },
          ]}
          speed={80}
          direction="left"
          gap={34}
          pauseOnHover={false}
          ariaLabel="Teknologi dan layanan"
          className="footer-logo-loop"
          renderItem={(item: { node: ReactNode; title: string }) => (
            <span className="footer-loop-logo" title={item.title} aria-label={item.title}>{item.node}</span>
          )}
        />
      </div>

      <footer className="footer">
        <a className="nav-logo" href="#">
          <img
            src="/images/logo.png"
            alt="Samsu Alam"
            className="h-10 md:h-11 w-auto object-contain"
          />
          <span>SΛMSU ΛLΛM</span>
        </a>
        <div className="footer-copy">
          {t('footer.copy')}
        </div>
        <div className="footer-links">
          <a
            href="https://linkedin.com/in/samsualam"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('cta.linkedin')}
          </a>
          <a href="#contact">{t('cta.contactPage')}</a>
          <a href="/cv.pdf" download>
            {t('cta.downloadCv')}
          </a>
        </div>
      </footer>
    </>
  );
}
