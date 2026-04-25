'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SceneTransitionProps {
  nextFlavor: string;
}

export default function SceneTransition({ nextFlavor }: SceneTransitionProps) {
  return (
    <div className="h-[30vh] w-full bg-orange flex flex-col items-center justify-center relative z-20">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        <div className="relative h-12 w-36 mb-4 opacity-80">
          <Image 
src="/logoupdated.png"
            alt="Dahiyoo Logo" 
            fill
            className="object-contain"
          />
        </div>
        <span className="font-dm-sans text-sm uppercase tracking-widest text-white/70 mb-1">
          Next:
        </span>
        <h4 className="font-syne font-bold text-4xl md:text-5xl text-white mb-3">
          {nextFlavor}
        </h4>
        <span className="font-dm-sans text-sm text-white/80 flex items-center gap-2">
          Scroll to discover <span>&rarr;</span>
        </span>
      </motion.div>
    </div>
  );
}
