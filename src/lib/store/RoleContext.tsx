"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Creator } from '../types';

interface RoleContextType {
  user: User | null;
  creators: Creator[];
  setUser: (user: User | null) => void;
  addCreator: (creator: Omit<Creator, 'id' | 'createdAt'>) => void;
  removeCreator: (id: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  // Default to Mayank as founder for simulation
  const [user, setUser] = useState<User | null>({ 
    id: '1', 
    name: 'Mayank', 
    role: 'founder', 
    email: 'mayank@clickbait.com' 
  });

  const [creators, setCreators] = useState<Creator[]>([
    { id: 'c1', name: 'Alex Tech', email: 'alex@valkyrie.com', niche: 'tech', createdAt: '2026-04-01' }
  ]);

  const addCreator = (data: Omit<Creator, 'id' | 'createdAt'>) => {
    const newCreator: Creator = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCreators(prev => [...prev, newCreator]);
  };

  const removeCreator = (id: string) => {
    setCreators(prev => prev.filter(c => c.id !== id));
  };

  return (
    <RoleContext.Provider value={{ user, creators, setUser, addCreator, removeCreator }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
