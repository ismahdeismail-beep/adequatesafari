'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown, MapPin, User, CreditCard, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Safaris', href: '/safaris' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Special Offers', href: '/offers' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const userMenuItems = [
  { label: 'My Bookings', href: '/booking/my-bookings', icon: CreditCard },
  { label: 'My Profile', href: '/account/profile', icon: User },
  { label: 'Logout', icon: LogOut, action: true },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    await api.logout();
    clearAuth();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="Adequate Safaris Home">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-safari-dusk hidden sm:block">
              Adequate Safaris
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-safari-dusk hover:text-primary-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 text-safari-dusk hover:text-primary-600 font-medium transition-colors"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-medium text-sm">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden sm:block">{user?.firstName}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-safari-dusk">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      {userMenuItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={item.action ? handleLogout : undefined}
                          className={cn(
                            'w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors',
                            item.action && 'text-red-600'
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-safari-dusk hover:text-primary-600 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-safari-dusk hover:text-primary-600"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-gray-100 animate-slide-in-right">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 py-2 text-safari-dusk hover:text-primary-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/booking/my-bookings"
                      className="flex items-center space-x-3 px-2 py-2 text-safari-dusk hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>My Bookings</span>
                    </Link>
                    <Link
                      href="/account/profile"
                      className="flex items-center space-x-3 px-2 py-2 text-safari-dusk hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-2 py-2 text-red-600 hover:text-red-700"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-2 py-2 text-safari-dusk hover:text-primary-600 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="btn-primary text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}