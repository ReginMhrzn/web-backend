'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/home');
  }, [user, loading, router]);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    try {
      login({ email: loginEmail, password: loginPassword });
      router.push('/home');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!agree) {
      setError('You must agree to the Terms & Privacy.');
      return;
    }
    try {
      signup({ name: signupName, email: signupEmail, password: signupPassword });
      router.push('/home');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return null;

  return (
    <div className="card">
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('login');
            clearMessages();
          }}
        >
          Login
        </button>
        <button
          className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('signup');
            clearMessages();
          }}
        >
          Sign Up
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {activeTab === 'login' ? (
        <form onSubmit={handleLogin}>
          <h2 className="form-title">Welcome back</h2>
          <p className="form-sub">Login to your account</p>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="text-input"
              placeholder="you@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="text-input"
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>

          <div className="row-between">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <Link href="/forgot-password" className="forgot-link">Forgot?</Link>
          </div>

          <button type="submit" className="btn-primary">Sign In</button>

          <p
            className="form-sub"
            style={{ marginTop: '1rem', textAlign: 'center' }}
          >
            No account?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('signup');
                clearMessages();
              }}
              style={{ color: '#3b82f6', fontWeight: 500 }}
            >
              Create one
            </a>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <h2 className="form-title">Create account</h2>
          <p className="form-sub">It only takes a minute</p>

          <div className="input-group">
            <label className="input-label">Full name</label>
            <input
              type="text"
              className="text-input"
              placeholder="John Doe"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="text-input"
              placeholder="you@example.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="text-input"
              placeholder="••••••••"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
          </div>

          <label className="terms-row">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>
              I agree to the <a href="#">Terms</a> &amp;{' '}
              <a href="#">Privacy</a>
            </span>
          </label>

          <button type="submit" className="btn-primary">Create Account</button>
        </form>
      )}
    </div>
  );
}