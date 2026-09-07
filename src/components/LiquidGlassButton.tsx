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
      'bg-gradient-to-r from-[#3E7D5A] to-[#5FA97D] text-[#F4F2E6] hover:brightness-110 shadow-[0_4px_16px_rgba(62,125,90,0.3)] font-semibold border border-[#5FA97D]/30',
    glass:
      'backdrop-blur-md bg-[#1B2119]/80 border border-[#2A322A] text-[#F4F2E6] hover:bg-[#1B2119] hover:border-[#3E7D5A]/40 font-medium',
    emerald:
      'bg-[#1B2119] border border-[#2A322A] text-[#5FA97D] hover:border-[#5FA97D]/50 font-medium',
    subtle:
      'bg-[#1B2119] border border-[#2A322A] text-[#8B9A8C] hover:text-[#F4F2E6] hover:border-[#3E7D5A]/30 font-medium',
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
