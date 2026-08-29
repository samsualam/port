'use client';

import { useEffect, useRef, Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from './ErrorBoundary';
import Shuffle from '@/components/Shuffle';

// Semua komponen berat dijadikan dynamic (client-only, no SSR)
const SideRays = dynamic(() => import('@/components/SideRays'), { ssr: false });
const PixelBlast = dynamic(() => import('@/components/PixelBlast'), { ssr: false });
const HorizontalScroll = dynamic(() => import('./HorizontalScroll'), { ssr: false });
const StackExperience = dynamic(() => import('./StackExperience'), { ssr: false });

export default function ClientShell() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [heroImgError, setHeroImgError] = useState(false);

  /* ── Hero load animation ─────────────────────────────────── */
  useEffect(() => {
    document.body.classList.add('is-loaded');
  }, []);

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
        <a className="nav-logo" href="#">[ SAMSU ALAM ]</a>
        <ul className="nav-links" id="nav-links">
          <li><a href="#">/home</a></li>
          <li><a href="#work">/work</a></li>
          <li><a href="#experience">/experience</a></li>
          <li><a href="#contact">/contact</a></li>
          <li>
            <a className="nav-cta" href="mailto:samsualam@email.com">
              Let's talk →
            </a>
          </li>
        </ul>
        <button
          className="nav-toggle"
          id="nav-toggle"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="nav-links"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
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
            {heroImgError && (
              <div className="hero-bg-fallback" aria-hidden="true" />
            )}
          </div>
          <div className="hero-veil" />

          <div className="hero-place" data-hero-fade>
            Gorontalo · Indonesia · 2026
          </div>

          <div className="hero-inner">
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
                className="hero-kicker !text-[clamp(13px,1.8vw,22px)] !leading-none"
                style={{ display: 'block' }}
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
                className="!text-[clamp(48px,12vw,164px)] !leading-[0.88]"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  display: 'block'
                }}
              />
            </span>

            <div className="hero-tag">
              <i className="bar" />
              <span>
                Full Stack Developer · UI Designer · <b>Builder</b>
              </span>
            </div>

            <p className="hero-blurb">
              3+ years converting ideas into real digital products — spanning
              frontend, backend, and everything in between.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href="/cv.pdf" download>
                Download CV ↓
              </a>
              <a className="btn btn-ghost" href="#work">
                /view work
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
          <span>Full Stack Development</span><span>//</span>
          <span>UI Design</span><span>//</span>
          <span>API Integration</span><span>//</span>
          <span>Database Architecture</span><span>//</span>
          <span>React & Next.js</span><span>//</span>
          <span>Laravel & Node.js</span><span>//</span>
          <span>Responsive Design</span><span>//</span>
          <span>AI Integration</span><span>//</span>
          <span>Full Stack Development</span><span>//</span>
          <span>UI Design</span><span>//</span>
          <span>API Integration</span><span>//</span>
          <span>Database Architecture</span><span>//</span>
          <span>React & Next.js</span><span>//</span>
          <span>Laravel & Node.js</span><span>//</span>
          <span>Responsive Design</span><span>//</span>
          <span>AI Integration</span><span>//</span>
        </div>
      </div>

      {/* ── STATS /numbers ──────────────────────────────────── */}
      <section className="stats section" style={{ position: 'relative' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">/numbers</span>
            <h2 className="h-display h-lg fade-up">
              By the <span className="outline">numbers</span>
            </h2>
          </div>
          <div className="stats-grid">
            <div className="stat fade-up">
              <div className="stat-number">3+</div>
              <div className="stat-label">Years of experience</div>
              <p className="stat-desc">
                In full stack web development — spanning freelance, internship,
                and client projects across various industries.
              </p>
            </div>
            <div className="stat fade-up" style={{ transitionDelay: '0.1s' }}>
              <div className="stat-number">20+</div>
              <div className="stat-label">Projects delivered</div>
              <p className="stat-desc">
                From landing pages to complex web applications — shipped with
                clean code and attention to every detail.
              </p>
            </div>
            <div className="stat fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="stat-number">10+</div>
              <div className="stat-label">Technologies</div>
              <p className="stat-desc">
                React, Next.js, Laravel, Node.js, Tailwind CSS, PostgreSQL,
                MySQL, and more — always learning.
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

      {/* ── MARQUEE 2 ───────────────────────────────────────── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>E-Commerce Platform</span><span>//</span>
          <span>Analytics Dashboard</span><span>//</span>
          <span>Company CMS</span><span>//</span>
          <span>Gorontalo</span><span>//</span>
          <span>Indonesia</span><span>//</span>
          <span>Open To Work</span><span>//</span>
          <span>E-Commerce Platform</span><span>//</span>
          <span>Analytics Dashboard</span><span>//</span>
          <span>Company CMS</span><span>//</span>
          <span>Gorontalo</span><span>//</span>
          <span>Indonesia</span><span>//</span>
          <span>Open To Work</span><span>//</span>
        </div>
      </div>

      {/* ── STACK EXPERIENCE ────────────────────────────────── */}
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <StackExperience />
        </Suspense>
      </ErrorBoundary>

      {/* ── CTA /contact ────────────────────────────────────── */}
      <section className="cta-band" id="contact">
        <div className="ghost-word" aria-hidden="true">SAMSU</div>
        <div className="container cta-inner">
          <span className="eyebrow">/contact</span>
          <div className="cta-words">
            <div className="fade-up">Let's build</div>
            <div className="fade-up">the next</div>
            <div className="fade-up">chapter.</div>
          </div>
          <a className="cta-mail" href="mailto:samsualam@email.com">
            samsualam@email.com
          </a>
          <div className="cta-links">
            <a
              href="https://linkedin.com/in/samsualam"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a href="#contact">Contact page</a>
            <a href="/cv.pdf" download>
              Download CV
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="footer">
        <a className="nav-logo" href="#">
          [ SAMSU ALAM ]
        </a>
        <div className="footer-copy">
          Copyright © 2026 Samsu Alam. All Rights Reserved.
        </div>
        <div className="footer-status">
          <i />
          <span>OPEN TO WORK</span>
        </div>
      </footer>
    </>
  );
}
