'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authClient } from '@/lib/auth-client';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      setError('Email ou mot de passe incorrect.');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Connexion</h1>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
