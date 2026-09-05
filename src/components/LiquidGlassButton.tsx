'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'glass' | 'emerald' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

/**
 * 21st.dev Inspired Tahoe Liquid Glass Button
 * Implements Apple Tahoe liquid glass refraction, specular highlight inset,
 * and Framer Motion haptic spring feedback.
 */
export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  className = '',
  icon,
  onClick,
  disabled,
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-4 py-2 text-xs gap-2 rounded-xl',
    lg: 'px-5 py-2.5 text-sm gap-2.5 rounded-xl',
  }[size];

  const variantClasses = {
    primary:
      'bg-ink-primary text-surface-base hover:opacity-90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.4)] font-bold',
    glass:
      'backdrop-blur-xl bg-surface-raised/70 border border-white/[0.1] text-ink-primary hover:bg-surface-raised/90 hover:border-white/[0.18] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_6px_20px_rgba(0,0,0,0.35)] font-medium',
    emerald:
      'backdrop-blur-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-500/40 shadow-[inset_0_1px_1px_rgba(16,185,129,0.3),0_6px_20px_rgba(16,185,129,0.15)] font-semibold',
    subtle:
      'bg-surface-overlay/60 border border-surface-hairline text-ink-secondary hover:text-ink-primary hover:bg-surface-overlay hover:border-zinc-500/40 font-medium',
  }[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ y: disabled ? 0 : -1 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`relative inline-flex items-center justify-center transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...(props as any)}
    >
      {/* Specular Top Shimmer Line */}
      <span className="pointer-events-none absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70" />

      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
