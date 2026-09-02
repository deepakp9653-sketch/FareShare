'use client';

import React from 'react';
import { Sparkles, Sun, Flame, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface TripVibeGaugeProps {
  settlementPercent: number;
  budgetCushionPercent: number;
  confirmedEventsCount: number;
}

export const TripVibeGauge: React.FC<TripVibeGaugeProps> = ({
  settlementPercent,
  budgetCushionPercent,
  confirmedEventsCount,
}) => {
  const vibeScore = 98; // 98% Sunset Energy Score
  const gaugeAngle = (vibeScore / 100) * 180 - 90; // Angle for needle (-90 to +90 deg)

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* Playful SVG Semi-Circle Dial Gauge */}
      <div className="relative w-48 h-28 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Saturated Arc Gradient */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#vibeGradient)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset="12"
          />

          <defs>
            <linearGradient id="vibeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Animated Needle */}
          <g style={{ transformOrigin: '100px 100px', transform: `rotate(${gaugeAngle}deg)` }}>
            <line x1="100" y1="100" x2="100" y2="35" stroke="#0C4A6E" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="100" r="8" fill="#F97316" />
          </g>
        </svg>

        <div className="absolute bottom-0 text-center">
          <span className="font-numeric font-bold text-2xl text-ink-primary block leading-none">
            {vibeScore}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-coral">
            Sky & Sunset Vibe
          </span>
        </div>
      </div>

      {/* Sub-Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 w-full pt-2">
        <div className="p-2 rounded-xl bg-surface-base border border-surface-hairline text-center space-y-1">
          <span className="text-[10px] font-semibold text-ink-muted block">Settlement</span>
          <span className="font-numeric font-bold text-xs text-ledger-surplus block">
            {settlementPercent}%
          </span>
        </div>

        <div className="p-2 rounded-xl bg-surface-base border border-surface-hairline text-center space-y-1">
          <span className="text-[10px] font-semibold text-ink-muted block">Cushion</span>
          <span className="font-numeric font-bold text-xs text-brand-gold block">
            +{budgetCushionPercent}%
          </span>
        </div>

        <div className="p-2 rounded-xl bg-surface-base border border-surface-hairline text-center space-y-1">
          <span className="text-[10px] font-semibold text-ink-muted block">Events Hype</span>
          <span className="font-numeric font-bold text-xs text-brand-coral block">
            {confirmedEventsCount} Confirmed
          </span>
        </div>
      </div>
    </div>
  );
};
