'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    });

    if (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
      return;
    }

    setIsSent(true);
  };

  if (isSent) {
    return (
      <div className="bg-card w-full max-w-sm space-y-4 rounded-xl border p-8 text-center shadow-sm">
        <h1 className="text-foreground text-xl font-semibold">Email envoyé</h1>
        <p className="text-muted-foreground text-sm">
          Si un compte existe pour <strong>{email}</strong>, vous recevrez un
          lien de réinitialisation dans quelques minutes.
        </p>
        <Link href="/login" className="text-primary text-sm hover:underline">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card w-full max-w-sm space-y-4 rounded-xl border p-8 shadow-sm"
    >
      <div className="space-y-1">
        <h1 className="text-foreground text-xl font-semibold">
          Mot de passe oublié
        </h1>
        <p className="text-muted-foreground text-sm">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="text-foreground text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Envoi…' : 'Envoyer le lien'}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
};

export { ForgotPasswordForm };
