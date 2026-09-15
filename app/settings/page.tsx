'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, loading, logout, deleteAccount } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Delete your account permanently? This cannot be undone.'
    );
    if (!confirmed) return;
    try {
      await deleteAccount();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <div className="page-wrap">
      <h1 className="page-title">Settings</h1>

      <div className="settings-card">
        <h2 className="settings-h2">Account</h2>
        <p className="settings-line">
          <strong>Name:</strong> {user.name}
        </p>
        <p className="settings-line">
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <div className="settings-card settings-danger">
        <h2 className="settings-h2">Danger zone</h2>
        <p className="settings-line">
          Deleting your account is permanent. All your data will be removed.
        </p>
        <div className="settings-actions">
          <button className="btn-secondary" onClick={logout}>
            Logout
          </button>
          <button className="btn-danger" onClick={handleDelete}>
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}