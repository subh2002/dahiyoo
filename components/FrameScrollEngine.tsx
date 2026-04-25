'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useAnimationFrame } from 'framer-motion';
import { Scene } from '@/data/scenes';

interface FrameScrollEngineProps {
  scene: Scene;
}

export default function FrameScrollEngine({ scene }: FrameScrollEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Preload all frames on mount
  useEffect(() => {
    if (scene.totalFrames <= 0) {
      setLoaded(true); // Nothing to load
      return;
    }

    let isMounted = true;

    const loadImages = async () => {
      const promises = [];
      for (let i = 1; i <= scene.totalFrames; i++) {
        promises.push(
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            const frameNum = String(i).padStart(3, '0');
            img.src = `${scene.folderPath}/ezgif-frame-${frameNum}.jpg`;
            img.onload = () => {
              setProgress((prev) => prev + 1);
              resolve(img);
            };
            img.onerror = () => {
              // Graceful fallback if a frame is missing
              resolve(img);
            };
          })
        );
      }
      
      const loadedImages = await Promise.all(promises);
      if (isMounted) {
        setImages(loadedImages);
        setLoaded(true);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [scene]);

  // Handle scroll and canvas drawing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const lastDrawnIndex = useRef<number>(-1);

  useAnimationFrame(() => {
    if (!loaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentProgress = scrollYProgress.get();
    let frameIndex = Math.round(currentProgress * (scene.totalFrames - 1));
    
    // Clamp
    if (frameIndex < 0) frameIndex = 0;
    if (frameIndex >= scene.totalFrames) frameIndex = scene.totalFrames - 1;

    // Only draw if index changed
    if (frameIndex !== lastDrawnIndex.current) {
      lastDrawnIndex.current = frameIndex;
      const img = images[frameIndex];

      if (img && img.complete && img.naturalWidth > 0) {
        // Set canvas to full window size to prevent blurring
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 'cover' logic
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = img.height * (canvas.width / img.width);
        } else {
          drawHeight = canvas.height;
          drawWidth = img.width * (canvas.height / img.height);
        }

        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      }
    }
  });

  // Handle canvas resize on window resize
  useEffect(() => {
    const handleResize = () => {
      lastDrawnIndex.current = -1; // Force redraw
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Button Animations
  // Fades in and slides up 20px: 0.65 -> 0.80. Fades out: 0.88 -> 0.95.
  const btnOpacity = useTransform(
    scrollYProgress,
    [0, 0.65, 0.8, 0.88, 0.95],
    [0, 0, 1, 1, 0]
  );
  
  const btnY = useTransform(
    scrollYProgress,
    [0.65, 0.8],
    [20, 0]
  );

  const buttonPointerEvents = useTransform(
    scrollYProgress,
    (v) => (v >= 0.65 && v <= 0.95 ? 'auto' : 'none')
  );

  return (
    <div id={scene.id} ref={containerRef} className="relative w-full bg-orange" style={{ height: '600vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Canvas for rendering frames */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full object-contain" />
        
        {/* Loading Progress Bar */}
        {!loaded && scene.totalFrames > 0 && (
          <div className="absolute bottom-10 z-20 flex flex-col items-center">
            <span className="font-dm-sans text-sm mb-2 text-white/80">Loading frames... {Math.round((progress / scene.totalFrames) * 100)}%</span>
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${(progress / scene.totalFrames) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Text Overlays */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6 text-center">

          
          {/* CTA Button */}
          <motion.div
            style={{ opacity: btnOpacity, y: btnY, pointerEvents: buttonPointerEvents as any }}
            className="absolute bottom-20 md:bottom-32"
          >
            <a 
              href="https://www.zomato.com/mumbai/dahiyo-2-virar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white text-orange font-bold font-dm-sans rounded-full px-8 py-4 hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] pointer-events-auto"
            >
              {scene.ctaText}
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
