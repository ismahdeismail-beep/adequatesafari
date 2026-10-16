'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ChevronDown, User, CreditCard, LogOut, Phone, Mail } from 'lucide-react';
import { useCurrentUser, signOut } from '@/lib/auth';
import { siteConfig } from '@/lib/site-config';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Safaris', href: '/safaris' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Deals', href: '/deals' },
  { label: 'Services', href: '/services' },
  { label: 'Search', href: '/search' },
  { label: 'Gallery', href: '/gallery' },
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
  const { user } = useCurrentUser();
  const isAuthenticated = Boolean(user);

  const initial = (user?.firstName?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase();
  const displayName = user?.firstName || user?.email || '';

  const handleLogout = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      {(siteConfig.phone || siteConfig.email) && (
        <div className="hidden bg-safari-dusk text-white md:block">
          <div className="container-custom flex items-center justify-between py-1.5 text-xs">
            <div className="flex items-center gap-5">
              {siteConfig.phone && (
                <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-safari-gold">
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {siteConfig.phone}
                </a>
              )}
              {siteConfig.email && (
                <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-1.5 hover:text-safari-gold">
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  {siteConfig.email}
                </a>
              )}
            </div>
            <span className="text-white/70">Tailor-made safaris across East Africa</span>
          </div>
        </div>
      )}
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Adequate Safaris Home">
            <Image
              src="/adequate-logo.png"
              alt="Adequate Safaris"
              width={89}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 lg:flex">
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
                        {initial}
                      </span>
                    </div>
                    <span className="hidden sm:block max-w-[10rem] truncate">{displayName}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-safari-dusk truncate">
                          {`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Your account'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
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
              <CurrencySwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-safari-dusk hover:text-primary-600 lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="py-4 border-t border-gray-100 animate-slide-in-right lg:hidden">
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
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="px-2 text-sm font-medium text-safari-dusk">Show prices in</span>
                <CurrencySwitcher />
              </div>
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
                      className="px-4 py-3 text-safari-dusk hover:text-primary-600 font-medium min-h-[44px] flex items-center justify-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="btn-primary text-center px-4 py-3 min-h-[44px] flex items-center justify-center"
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