'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, logout, deleteAccount } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Active section on scroll — only on the home page
  useEffect(() => {
    if (pathname !== '/home') return;

    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    if (sections.length === 0) return;

    function onScroll() {
      let current = 'home';
      const scrollPos = window.scrollY + 120;

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = sec.id;
        }
      });

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        current = 'contact';
      }

      setActiveSection(current);
    }

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const targetId = href.replace('#', '');

    if (pathname !== '/home') {
      e.preventDefault();
      router.push(`/home#${targetId}`);
      return;
    }

    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const offset = 80;
      window.scrollTo({ top: el.offsetTop - offset, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  const handleDelete = async () => {
    setDropdownOpen(false);
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    );
    if (!confirmed) return;
    try {
      await deleteAccount();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const handleLogoClick = () => {
    if (pathname !== '/home') {
      router.push('/home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleLogoClick}>
        <i className="fas fa-crown" /> ReginMhrzn
      </div>

      <div className="nav-links">
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`nav-link ${
              pathname === '/home' &&
              activeSection === l.href.replace('#', '')
                ? 'active'
                : ''
            }`}
            onClick={(e) => handleNavClick(e, l.href)}
          >
            {l.label}
          </a>
        ))}

        {/* Settings icon + dropdown (only when logged in) */}
        {user && (
          <div className="settings-wrapper" ref={wrapperRef}>
            <button
              className="settings-btn"
              aria-label="Settings"
              aria-expanded={dropdownOpen}
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen((v) => !v);
              }}
            >
              <i className="fas fa-cog" />
            </button>

            <div
              className={`settings-dropdown ${dropdownOpen ? 'show' : ''}`}
            >
              <div className="settings-user">
                <i className="fas fa-user-circle" />
                <div>
                  <div className="settings-user-name">{user.name}</div>
                  <div className="settings-user-email">{user.email}</div>
                </div>
              </div>
              <div className="divider" />
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-sliders-h" /> Account settings
              </Link>
              <button
                className="settings-item"
                onClick={handleDelete}
                type="button"
              >
                <i className="fas fa-trash-alt" /> Delete account
              </button>
              <div className="divider" />
              <button
                className="settings-item"
                onClick={handleLogout}
                type="button"
              >
                <i className="fas fa-sign-out-alt" /> Log out
              </button>
            </div>
          </div>
        )}

        {/* When logged out, show login link */}
        {!user && (
          <Link href="/login" className="nav-login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}