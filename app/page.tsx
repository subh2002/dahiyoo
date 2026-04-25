'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { scenes } from '@/data/scenes';
import Navbar from '@/components/Navbar';
import FrameScrollEngine from '@/components/FrameScrollEngine';
import SceneTransition from '@/components/SceneTransition';
import Footer from '@/components/Footer';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Removed minimum display time to reduce loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full bg-orange">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-orange"
          >
            <div className="relative h-32 w-96 mb-12">
              <Image 
src="/logoupdated.png"
                alt="Dahiyoo Logo" 
                fill
                className="object-contain animate-pulse"
                priority
              />
            </div>
            
            {/* Simple Spinner */}
            <svg className="animate-spin h-8 w-8 text-white mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>

            <h1 className="font-syne font-bold text-white text-xl">
              Loading your Froyo experience...
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      {/* Render sequence: Hero 1 -> Transition -> Hero 2 -> Transition -> Hero 3 */}
      {scenes.map((scene, index) => (
        <React.Fragment key={scene.id}>
          <FrameScrollEngine scene={scene} />
          {/* Render SceneTransition if there's a next scene */}
          {index < scenes.length - 1 && (
            <SceneTransition nextFlavor={scenes[index + 1].flavor} />
          )}
        </React.Fragment>
      ))}

      <Footer />
    </main>
  );
}
