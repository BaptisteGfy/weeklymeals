'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { authClient } from '@/lib/auth-client';

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <div className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-8 shadow-sm text-center">
        <h1 className="text-xl font-semibold text-foreground">Lien invalide</h1>
        <p className="text-sm text-muted-foreground">
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>
        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);

    const { error } = await authClient.resetPassword({ newPassword: password, token });

    if (error) {
      setError('Une erreur est survenue. Le lien est peut-être expiré.');
      setIsLoading(false);
      return;
    }

    router.push('/login');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-8 shadow-sm"
    >
      <h1 className="text-xl font-semibold text-foreground">Nouveau mot de passe</h1>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Nouveau mot de passe
        </label>
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
          Confirmer le mot de passe
        </label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Enregistrement…' : 'Réinitialiser le mot de passe'}
      </Button>
    </form>
  );
};

export { ResetPasswordForm };
