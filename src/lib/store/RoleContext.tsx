"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Creator } from '../types';
import { useRouter } from 'next/navigation';

interface RoleContextType {
  user: User | null;
  creators: Creator[];
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  canApprove: boolean;
  addCreator: (creator: Omit<Creator, 'id' | 'createdAt'>) => void;
  removeCreator: (id: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Hardcoded Production Credentials
const VALID_USERS = [
  { email: "mayank@clickbait.labs", pass: "admin2026", name: "Mayank", role: "founder" },
  { email: "tathagat@clickbait.labs", pass: "admin2026", name: "Tathagat", role: "founder" },
  { email: "valkyrie@talent.io", pass: "shoot2026", name: "Valkyrie (Tech)", role: "creator" },
  { email: "kira@talent.io", pass: "shoot2026", name: "Kira (Finance)", role: "creator" }
];

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('clickbait_user');
      const savedCreators = localStorage.getItem('clickbait_creators');
      
      if (savedUser) setUser(JSON.parse(savedUser));
      
      if (savedCreators) {
        setCreators(JSON.parse(savedCreators));
      } else {
        const initialCreators = [
          { id: 'c1', name: 'Valkyrie', email: 'valkyrie@talent.io', niche: 'tech' as const, createdAt: '2026-04-01' },
          { id: 'c2', name: 'Kira', email: 'kira@talent.io', niche: 'finance' as const, createdAt: '2026-04-02' }
        ];
        setCreators(initialCreators);
        localStorage.setItem('clickbait_creators', JSON.stringify(initialCreators));
      }
    } catch (e) {
      console.error('RoleProvider Storage Error:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const login = (email: string, pass: string) => {
    const found = VALID_USERS.find(u => u.email === email && u.pass === pass);
    if (found) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: found.name,
        email: found.email,
        role: found.role as any
      };
      setUser(newUser);
      localStorage.setItem('clickbait_user', JSON.stringify(newUser));
      router.push('/');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clickbait_user');
    router.push('/login');
  };

  const addCreator = (data: Omit<Creator, 'id' | 'createdAt'>) => {
    const newCreator: Creator = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...creators, newCreator];
    setCreators(updated);
    localStorage.setItem('clickbait_creators', JSON.stringify(updated));
  };

  const removeCreator = (id: string) => {
    const updated = creators.filter(c => c.id !== id);
    setCreators(updated);
    localStorage.setItem('clickbait_creators', JSON.stringify(updated));
  };

  const canApprove = user?.role === 'founder';

  if (!isLoaded) return null;

  return (
    <RoleContext.Provider value={{ user, creators, login, logout, canApprove, addCreator, removeCreator }}>
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
