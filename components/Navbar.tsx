'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { scenes } from '@/data/scenes';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeScene, setActiveScene] = useState<string>(scenes[0]?.id || 'hero1');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer for dots
    const observers: IntersectionObserver[] = [];
    
    scenes.forEach((scene) => {
      const element = document.getElementById(scene.id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveScene(scene.id);
              }
            });
          },
          { threshold: 0.1 } // trigger when 10% of the section is visible
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const scrollToScene = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between ${
        scrolled ? 'bg-[#E8630A]/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      {/* Left: Logo */}
      <div className="flex-1 cursor-pointer" onClick={scrollToTop}>
        <div className="relative h-14 w-44">
          {/* Fallback to text if image not placed yet, but standard demands image */}
          <Image 
src="/logoupdated.png"
            alt="Dahiyoo Logo" 
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </div>

      {/* Center: Dots */}
      <div className="flex-1 flex justify-center items-center gap-3">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => scrollToScene(scene.id)}
            aria-label={`Scroll to ${scene.flavor}`}
            className={`rounded-full bg-white transition-all duration-200 ${
              activeScene === scene.id ? 'w-3 h-3 opacity-100' : 'w-2 h-2 opacity-40 hover:opacity-70'
            }`}
          />
        ))}
      </div>

      {/* Right: CTA Button */}
      <div className="flex-1 flex justify-end">
        <a
          href="https://www.zomato.com/mumbai/dahiyo-2-virar"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-orange font-bold font-dm-sans rounded-full px-5 py-2 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        >
          Order Now
        </a>
      </div>
    </nav>
  );
}
