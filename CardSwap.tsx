'use client';

import { useState, useEffect, Children, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardSwapProps {
  children: ReactNode;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
}

export const Card = ({ children }: { children: ReactNode }) => {
  return <div className="w-full h-full select-none">{children}</div>;
};

const CardSwap = ({
  children,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
}: CardSwapProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cards = Children.toArray(children);

  useEffect(() => {
    if (pauseOnHover && isHovered) return;
    if (cards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, delay);

    return () => clearInterval(interval);
  }, [cards.length, delay, pauseOnHover, isHovered]);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cards.map((card, index) => {
        const position = (index - currentIndex + cards.length) % cards.length;
        const isLast = position === cards.length - 1;
        
        if (position > 2 && !isLast) return null;

        return (
          <motion.div
            key={index}
            className="absolute top-0 left-0 w-full h-full"
            animate={{
              x: -position * cardDistance,
              y: -position * verticalDistance,
              scale: 1 - position * 0.05,
              zIndex: cards.length - position,
              opacity: isLast ? 0 : 1,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ transformOrigin: 'center center' }}
          >
            {card}
          </motion.div>
        );
      })}
    </div>
  );
};

export default CardSwap;