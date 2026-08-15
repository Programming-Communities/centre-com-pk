'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, User, Menu, X } from 'lucide-react';

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-50">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-hover"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-text-primary">Centre.com.pk</h1>
              <p className="text-xs text-text-secondary">Admin Panel</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-background rounded-lg border border-border">
            <Search className="w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-secondary w-40 lg:w-60"
            />
          </div>

          <button className="relative p-2 rounded-lg hover:bg-surface-hover">
            <Bell className="w-5 h-5 text-text-secondary" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-text-primary">{user.name}</p>
              <p className="text-xs text-text-secondary">{user.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
