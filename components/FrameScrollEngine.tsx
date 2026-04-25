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

  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const loadedCounterRef = useRef(0);
  const sceneReadyRef = useRef(false);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  const INITIAL_FRAME_COUNT = 16;
  const LOAD_CONCURRENCY = 8;

  // Start loading when the scene is near the viewport instead of mounting all scenes at once.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
            break;
          }
        }
      },
      {
        root: null,
        rootMargin: '200% 0px',
        threshold: 0.01,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [scene.id]);

  useEffect(() => {
    imagesRef.current = [];
    loadedCounterRef.current = 0;
    sceneReadyRef.current = false;
    setLoadedCount(0);
    setIsSceneReady(false);
  }, [scene]);

  useEffect(() => {
    if (!shouldLoad) return;

    if (scene.totalFrames <= 0) {
      sceneReadyRef.current = true;
      setIsSceneReady(true);
      return;
    }

    let cancelled = false;
    imagesRef.current = new Array(scene.totalFrames).fill(null);

    const markLoaded = (index: number, img: HTMLImageElement | null) => {
      imagesRef.current[index] = img;
      loadedCounterRef.current += 1;

      const count = loadedCounterRef.current;
      if (count === 1 || count % 4 === 0 || count === scene.totalFrames) {
        setLoadedCount(count);
      }

      if (index === 0 && img && !sceneReadyRef.current) {
        sceneReadyRef.current = true;
        setIsSceneReady(true);
      }
    };

    const loadIndex = (index: number) =>
      new Promise<void>((resolve) => {
        const frameNum = String(index + 1).padStart(3, '0');
        const img = new Image();
        img.src = `${scene.folderPath}/ezgif-frame-${frameNum}.jpg`;

        img.onload = () => {
          if (!cancelled) {
            markLoaded(index, img);
          }
          resolve();
        };

        img.onerror = () => {
          if (!cancelled) {
            markLoaded(index, null);
          }
          resolve();
        };
      });

    const loadWithConcurrency = async (indices: number[], concurrency: number) => {
      let cursor = 0;
      const workers = new Array(Math.max(1, concurrency)).fill(null).map(async () => {
        while (!cancelled) {
          const current = cursor;
          cursor += 1;
          if (current >= indices.length) break;
          await loadIndex(indices[current]);
        }
      });

      await Promise.all(workers);
    };

    const run = async () => {
      const initialCount = Math.min(INITIAL_FRAME_COUNT, scene.totalFrames);
      const initialIndices = Array.from({ length: initialCount }, (_, i) => i);
      const remainingIndices = Array.from(
        { length: scene.totalFrames - initialCount },
        (_, i) => i + initialCount
      );

      await loadWithConcurrency(initialIndices, LOAD_CONCURRENCY);

      if (!cancelled && !sceneReadyRef.current) {
        const firstAvailable = imagesRef.current.find(
          (img) => Boolean(img && img.complete && img.naturalWidth > 0)
        );
        if (firstAvailable) {
          sceneReadyRef.current = true;
          setIsSceneReady(true);
        }
      }

      await loadWithConcurrency(remainingIndices, LOAD_CONCURRENCY);
      if (!cancelled) {
        setLoadedCount(loadedCounterRef.current);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [scene, shouldLoad]);

  // Handle scroll and canvas drawing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const lastDrawnIndex = useRef<number>(-1);

  const getBestAvailableFrame = (index: number): HTMLImageElement | null => {
    const exact = imagesRef.current[index];
    if (exact && exact.complete && exact.naturalWidth > 0) {
      return exact;
    }

    for (let distance = 1; distance < scene.totalFrames; distance++) {
      const left = index - distance;
      if (left >= 0) {
        const leftImg = imagesRef.current[left];
        if (leftImg && leftImg.complete && leftImg.naturalWidth > 0) {
          return leftImg;
        }
      }

      const right = index + distance;
      if (right < scene.totalFrames) {
        const rightImg = imagesRef.current[right];
        if (rightImg && rightImg.complete && rightImg.naturalWidth > 0) {
          return rightImg;
        }
      }
    }

    return null;
  };

  useAnimationFrame(() => {
    if (!isSceneReady || !canvasRef.current) return;

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
      const img = getBestAvailableFrame(frameIndex);

      if (img && img.complete && img.naturalWidth > 0) {
        lastDrawnIndex.current = frameIndex;

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
        {!isSceneReady && scene.totalFrames > 0 && (
          <div className="absolute bottom-10 z-20 flex flex-col items-center">
            <span className="font-dm-sans text-sm mb-2 text-white/80">
              Loading frames... {Math.round((loadedCount / scene.totalFrames) * 100)}%
            </span>
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${(loadedCount / scene.totalFrames) * 100}%` }}
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
