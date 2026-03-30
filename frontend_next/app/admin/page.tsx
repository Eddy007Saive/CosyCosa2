'use client';

// Admin page - full migration from AdminPage.jsx pending
// Requires: Select, Table, Switch, Badge, BlogTab UI components

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminLogin } from '@/lib/api';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await adminLogin(password) as any;
      if (result?.success) {
        // Redirect to old React admin for now
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL?.replace(':8000', ':3000')}/admin`;
      } else {
        setError('Mot de passe incorrect');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f3]">
      <div className="bg-white p-8 md:p-12 max-w-md w-full border border-gray-100 shadow-sm">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#2e2e2e] text-white flex items-center justify-center">
            <Lock className="w-7 h-7" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="font-serif text-2xl text-center text-[#2e2e2e] mb-2">Administration</h1>
        <p className="text-center text-gray-500 text-sm mb-8">Cosy Casa Conciergerie</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full orso-btn-primary" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Interface d&apos;administration en cours de migration vers Next.js
        </p>
      </div>
    </div>
  );
}
