'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [demoToken, setDemoToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleRequest = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed.');

      if (data.demoToken) {
        setDemoToken(data.demoToken);
        setToken(data.demoToken);
      }
      setStep('confirm');
      setSuccess(
        'If that email exists, a reset token was generated. Enter it below with your new password.'
      );
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed.');
      setSuccess('Password reset! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="card">
      <h2 className="form-title">Reset password</h2>
      <p className="form-sub">We'll help you get back in</p>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {step === 'request' ? (
        <form onSubmit={handleRequest}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="text-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Send reset token
          </button>

          <p
            className="form-sub"
            style={{ marginTop: '1rem', textAlign: 'center' }}
          >
            Remembered?{' '}
            <Link
              href="/login"
              style={{ color: '#3b82f6', fontWeight: 500 }}
            >
              Back to login
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleConfirm}>
          {demoToken && (
            <div className="info-box">
              <strong>Demo token (auto-filled):</strong>
              <br />
              <code>{demoToken}</code>
            </div>
          )}
          <div className="input-group">
            <label className="input-label">Reset token</label>
            <input
              type="text"
              className="text-input"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">New password</label>
            <input
              type="password"
              className="text-input"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Reset password
          </button>
        </form>
      )}
    </div>
  );
}