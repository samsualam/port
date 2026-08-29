'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  textAlign = 'center',
  onLetterAnimationComplete
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;

      const el = ref.current;
      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      // Determine what to split by
      const splitByChars = splitType.includes('chars');
      const splitByWords = splitType.includes('words');
      const splitByLines = splitType.includes('lines');

      // Build the animated elements
      const animateElements: HTMLElement[] = [];

      if (splitByLines) {
        // For lines, we wrap each line in a div
        const lines = text.split('\n');
        el.innerHTML = '';
        lines.forEach((line, lineIndex) => {
          const lineDiv = document.createElement('div');
          lineDiv.style.overflow = 'hidden';
          lineDiv.style.display = 'block';

          if (splitByWords) {
            const words = line.split(' ');
            words.forEach((word, wordIndex) => {
              const wordSpan = document.createElement('span');
              wordSpan.style.display = 'inline-block';
              wordSpan.textContent = word;
              if (wordIndex < words.length - 1) {
                wordSpan.textContent += ' ';
              }
              lineDiv.appendChild(wordSpan);
              animateElements.push(wordSpan);
            });
          } else if (splitByChars) {
            const chars = line.split('');
            chars.forEach((char) => {
              const charSpan = document.createElement('span');
              charSpan.style.display = 'inline-block';
              charSpan.textContent = char;
              lineDiv.appendChild(charSpan);
              animateElements.push(charSpan);
            });
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.textContent = line;
            lineDiv.appendChild(wordSpan);
            animateElements.push(wordSpan);
          }

          el.appendChild(lineDiv);
        });
      } else if (splitByWords) {
        const words = text.split(' ');
        el.innerHTML = '';
        words.forEach((word, index) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.textContent = word;
          if (index < words.length - 1) {
            wordSpan.textContent += ' ';
          }
          el.appendChild(wordSpan);
          animateElements.push(wordSpan);
        });
      } else {
        // chars
        const chars = text.split('');
        el.innerHTML = '';
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.style.display = 'inline-block';
          charSpan.textContent = char;
          el.appendChild(charSpan);
          animateElements.push(charSpan);
        });
      }

      if (animateElements.length === 0) return;

      // Set initial state
      gsap.set(animateElements, { ...from });

      // Animate
      gsap.to(animateElements, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
          fastScrollEnd: true,
          anticipatePin: 0.4
        },
        onComplete: () => {
          animationCompletedRef.current = true;
          onCompleteRef.current?.();
        },
        willChange: 'transform, opacity',
        force3D: true
      });

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        gsap.killTweensOf(animateElements);
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded
      ],
      scope: ref
    }
  );

  const renderTag = () => {
    const style: React.CSSProperties = {
      textAlign,
      wordWrap: 'break-word',
      willChange: 'transform, opacity'
    };
    const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;
    const Tag = (tag || 'p') as React.ElementType;

    return (
      <Tag ref={ref} style={style} className={classes}>
        {text}
      </Tag>
    );
  };

  return renderTag();
};

export default SplitText;
