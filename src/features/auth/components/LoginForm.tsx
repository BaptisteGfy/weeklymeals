'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { PasswordInput } from '@/components/ui/password-input';
import { authClient } from '@/lib/auth-client';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      setError('Email ou mot de passe incorrect.');
      setIsLoading(false);
      return;
    }

    router.refresh();
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Header */}
      <div className="space-y-5">
        <Logo size="md" />
        <div className="space-y-2">
          <p className="text-terracotta-600 text-xs font-semibold tracking-widest uppercase">
            Connexion
          </p>
          <h1 className="text-neutre-800 font-serif text-4xl leading-tight font-semibold">
            Bon <em className="text-terracotta-600">retour</em>
            <br />
            en cuisine.
          </h1>
          <p className="text-neutre-400 text-sm">
            Reprenez là où vous vous étiez arrêté·e.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p
            role="alert"
            className="bg-bordeaux-50 text-bordeaux-600 rounded-lg px-3 py-2.5 text-sm"
          >
            {error}
          </p>
        )}

        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="marine.dubois@email.fr"
          />
        </FormField>

        <FormField label="Mot de passe" htmlFor="password">
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </FormField>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-terracotta-600 hover:text-terracotta-700 text-sm transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>

      <p className="text-neutre-400 text-center text-sm">
        Pas encore de compte ?{' '}
        <Link
          href="/signup"
          className="text-terracotta-600 hover:text-terracotta-700 font-semibold transition-colors"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
};

export { LoginForm };
