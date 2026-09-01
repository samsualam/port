'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';

type MenuItem = { label: string; ariaLabel: string; link: string };
type SocialItem = { label: string; link: string };

type StaggeredMenuProps = {
  items: MenuItem[];
  socialItems?: SocialItem[];
  colors?: string[];
  accentColor?: string;
};

export default function StaggeredMenu({
  items,
  socialItems = [],
  colors = ['#F5C518', '#2A2510'],
  accentColor = '#F5C518',
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const layers = layersRef.current?.querySelectorAll<HTMLElement>('.staggered-menu-layer');
    if (!panel) return;

    gsap.set([panel, ...(layers ? Array.from(layers) : [])], { xPercent: 100 });

    return () => {
      gsap.killTweensOf([panel, ...(layers ? Array.from(layers) : [])]);
    };
  }, []);

  const toggleMenu = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    const panel = panelRef.current;
    const layers = layersRef.current?.querySelectorAll<HTMLElement>('.staggered-menu-layer');
    if (!panel) return;

    const targets = layers ? Array.from(layers) : [];
    if (nextOpen) {
      document.body.classList.add('staggered-menu-open');
      gsap.timeline().to(targets, { xPercent: 0, duration: 0.45, stagger: 0.08, ease: 'power4.out' }).to(
        panel,
        { xPercent: 0, duration: 0.65, ease: 'power4.out' },
        '-=0.25'
      ).fromTo(
        panel.querySelectorAll('.staggered-menu-item'),
        { yPercent: 120, rotate: 8, opacity: 0 },
        { yPercent: 0, rotate: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power4.out' },
        '-=0.35'
      );
    } else {
      document.body.classList.remove('staggered-menu-open');
      gsap.to([panel, ...targets], { xPercent: 100, duration: 0.4, stagger: 0.04, ease: 'power3.in' });
    }
  };

  const closeMenu = () => {
    if (open) toggleMenu();
  };

  return (
    <div ref={rootRef} className="staggered-menu-mobile" data-open={open || undefined} style={{ '--sm-accent': accentColor } as CSSProperties}>
      <div ref={layersRef} className="staggered-menu-layers" aria-hidden="true">
        {colors.map((color, index) => <div key={`${color}-${index}`} className="staggered-menu-layer" style={{ background: color }} />)}
      </div>

      <button
        type="button"
        className="staggered-menu-toggle"
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={open}
        aria-controls="staggered-menu-panel"
        onClick={toggleMenu}
      >
        <span>{open ? 'TUTUP' : 'MENU'}</span>
        <i className={open ? 'is-open' : ''} aria-hidden="true"><b /><b /></i>
      </button>

      <aside ref={panelRef} id="staggered-menu-panel" className="staggered-menu-panel" aria-hidden={!open}>
        <nav aria-label="Navigasi utama">
          <ul>
            {items.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <a className="staggered-menu-item" href={item.link} aria-label={item.ariaLabel} onClick={closeMenu}>
                  <span>{item.label}</span>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {socialItems.length > 0 && (
          <div className="staggered-menu-socials">
            <span>SOSIAL</span>
            <div>
              {socialItems.map((social) => (
                <a key={social.label} href={social.link} target="_blank" rel="noreferrer noopener">{social.label}</a>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
