'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Handle #hash on load (when coming from another page)
  useEffect(() => {
    if (loading || !user) return;
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [loading, user]);

  if (loading || !user) return null;

  return (
    <>
      {/* HERO */}
      <section id="home" className="hero">
        <h1>ReginMhrzn</h1>
        <div className="subhead">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
        <div className="badge">
          <i className="fas fa-palette" style={{ marginRight: 8 }} />
          portfolio · design · code
        </div>
      </section>

      {/* WORK CARDS */}
      <div id="work" className="lorem-grid">
        <div className="card">
          <i className="fas fa-pen-fancy" />
          <h3>Lorem ipsum</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            <i className="fas fa-arrow-right" /> see project
          </p>
        </div>
        <div className="card">
          <i className="fas fa-cube" />
          <h3>Dolor sit</h3>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            <i className="fas fa-arrow-right" /> see project
          </p>
        </div>
        <div className="card">
          <i className="fas fa-meteor" />
          <h3>Consectetur</h3>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
          <p>
            <i className="fas fa-arrow-right" /> see project
          </p>
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="lorem-section">
        <h2>
          <i className="fas fa-user-astronaut" /> about · lorem
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
          non proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
        <p>
          <i
            className="fas fa-quote-left"
            style={{ color: '#2563eb', opacity: 0.7, marginRight: 6 }}
          />
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium.
        </p>
      </section>

      {/* CONTACT */}
      <section id="contact" className="lorem-section" style={{ marginTop: '1.5rem' }}>
        <h2>
          <i className="fas fa-paper-plane" /> contact · lorem
        </h2>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt.
        </p>
        <p>
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit, sed quia non numquam eius modi tempora
          incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        </p>
      </section>
    </>
  );
}