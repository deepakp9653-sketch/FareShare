'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DonutSlice {
  label: string;
  amount: number;
  color: string;
  percentage: number;
}

interface SpendDonutChartProps {
  categoryStats: Record<string, { estimated: number; actual: number }>;
  totalActual: number;
}

export const SpendDonutChart: React.FC<SpendDonutChartProps> = ({ categoryStats, totalActual }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const categoryColors: Record<string, string> = {
    lodging: '#F59E0B',   // Amber Gold
    transport: '#0EA5E9', // Sky Blue
    activity: '#10B981',  // Emerald Green
    food: '#F97316',      // Sunset Orange
    general: '#64748B',   // Slate Muted
  };

  const slices: DonutSlice[] = Object.entries(categoryStats).map(([cat, stats]) => ({
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    amount: stats.actual,
    color: categoryColors[cat] || '#F97316',
    percentage: totalActual > 0 ? (stats.actual / totalActual) * 100 : 0,
  }));

  // Calculate SVG arc paths
  const radius = 65;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-1">
      {/* Interactive SVG Donut Chart */}
      <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 180 180" className="w-full h-full transform -rotate-90">
          {slices.map((slice, idx) => {
            const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += slice.percentage;

            const isHovered = hoveredIndex === idx;

            return (
              <motion.circle
                key={slice.label}
                cx="90"
                cy="90"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all duration-300"
                style={{
                  filter: isHovered ? 'drop-shadow(0px 4px 10px rgba(0,0,0,0.15))' : 'none',
                }}
              />
            );
          })}
        </svg>

        {/* Center Total Summary */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">Total Spent</span>
          <span className="font-numeric font-bold text-base text-ink-primary">
            ₹{totalActual.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          {hoveredIndex !== null && (
            <span className="text-[10px] font-bold text-brand-coral">
              {slices[hoveredIndex].label}: {slices[hoveredIndex].percentage.toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      {/* Interactive Legend Grid */}
      <div className="flex-1 space-y-2 w-full">
        {slices.map((slice, idx) => (
          <div
            key={slice.label}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
              hoveredIndex === idx
                ? 'bg-surface-overlay border-brand-coral/40 shadow-sm'
                : 'bg-surface-base border-surface-hairline'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="font-semibold text-ink-primary">{slice.label}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-ink-muted text-[11px] font-numeric">{slice.percentage.toFixed(0)}%</span>
              <span className="font-numeric font-bold text-ink-primary">
                ₹{slice.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
