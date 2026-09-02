'use client';

import React from 'react';
import { LayoutDashboard, Calendar, Users, Receipt, GitCommit, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'overview' | 'itinerary' | 'participants' | 'expenses' | 'settlement' | 'activity';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  eventCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, eventCount }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'itinerary', label: 'Itinerary Graph', icon: Calendar },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'expenses', label: 'Expenses & Splits', icon: Receipt },
    { id: 'settlement', label: 'Settlement Graph', icon: GitCommit, badge: 'Debt Engine' },
    { id: 'activity', label: 'Events & Audit Log', icon: Activity, count: eventCount },
  ];

  return (
    <nav className="bg-surface-raised border-b border-surface-hairline px-4 sm:px-6 sticky top-[57px] z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex space-x-1 sm:space-x-2 py-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as TabType)}
                className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
                  isActive
                    ? 'text-brand-coral bg-surface-overlay font-semibold shadow-sm'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-base/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-coral' : 'text-ink-muted'}`} />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-bold uppercase tracking-wider">
                    {tab.badge}
                  </span>
                )}

                {tab.count !== undefined && (
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-surface-hairline text-ink-secondary font-numeric">
                    {tab.count}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-coral rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
