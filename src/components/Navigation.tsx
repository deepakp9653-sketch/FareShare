'use client';

import React from 'react';
import { LayoutDashboard, Calendar, Users, Receipt, GitCommit, Activity } from 'lucide-react';
import { motion, LayoutGroup } from 'framer-motion';

export type TabType = 'overview' | 'itinerary' | 'participants' | 'expenses' | 'settlement' | 'activity';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  eventCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, eventCount }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'participants', label: 'Squad Roster', icon: Users },
    { id: 'expenses', label: 'Expenses & Splits', icon: Receipt },
    { id: 'settlement', label: 'Settlement Graph', icon: GitCommit, badge: 'Zero-Sum' },
    { id: 'activity', label: 'Audit Trail', icon: Activity, count: eventCount },
  ];

  return (
    <nav className="bg-surface-base/80 backdrop-blur-md border-b border-surface-hairline px-4 sm:px-6 sticky top-[57px] z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none">
        <LayoutGroup id="navTabs">
          <div className="flex space-x-1 py-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id as TabType)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer select-none ${
                    isActive
                      ? 'text-ink-primary font-semibold'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {/* Dub-style sliding spring active pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-surface-overlay border border-surface-hairline rounded-lg shadow-subtle"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-ink-primary' : 'text-ink-muted'}`} />
                    <span>{tab.label}</span>

                    {tab.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tab.badge}
                      </span>
                    )}

                    {tab.count !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-hairline text-ink-muted font-numeric">
                        {tab.count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </nav>
  );
};
