'use client';

import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

interface GlobeProps {
  className?: string;
}

export default function Earth({ className = '' }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: (width || 380) * 2,
      height: (width || 380) * 2,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.03, 0.12, 0.08], // Deep emerald/obsidian
      markerColor: [0.2, 0.9, 0.6],  // Radiant emerald-400
      glowColor: [0.05, 0.35, 0.22],  // Emerald ambient aura
      markers: [],
    });

    let animId: number;
    const animate = () => {
      if (!pointerInteracting.current) {
        phi += 0.005;
      }
      globe.update({
        phi: phi + pointerInteractionMovement.current,
        width: (width || 380) * 2,
        height: (width || 380) * 2,
      });
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className={`w-full aspect-square max-w-[380px] sm:max-w-[420px] mx-auto relative flex items-center justify-center select-none ${className}`}
      onPointerDown={(e) => {
        pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
        if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
      }}
      onPointerUp={() => {
        pointerInteracting.current = null;
        if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        pointerInteracting.current = null;
        if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
      }}
      onMouseMove={(e) => {
        if (pointerInteracting.current !== null) {
          const delta = e.clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta * 0.01;
        }
      }}
      onTouchMove={(e) => {
        if (pointerInteracting.current !== null && e.touches[0]) {
          const delta = e.touches[0].clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta * 0.01;
        }
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab opacity-95 transition-opacity duration-700"
        style={{ width: '100%', height: '100%', contain: 'layout paint size' }}
      />
    </div>
  );
}
