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

const SignupForm = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const name = [firstName, lastName].filter(Boolean).join(' ');
    const { error } = await authClient.signUp.email({ name, email, password });

    if (error) {
      setError(
        'Une erreur est survenue. Cet email est peut-être déjà utilisé.',
      );
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
            Créer un compte
          </p>
          <h1 className="text-neutre-800 font-serif text-4xl leading-tight font-semibold">
            Commençons
            <br />
            par <em className="text-terracotta-600">vous</em>.
          </h1>
          <p className="text-neutre-400 text-sm">
            2 minutes, et votre semaine prend forme.
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

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Prénom" htmlFor="firstName">
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
              placeholder="Marine"
            />
          </FormField>
          <FormField label="Nom" htmlFor="lastName">
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              placeholder="Dubois"
            />
          </FormField>
        </div>

        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="vous@exemple.fr"
          />
        </FormField>

        <FormField
          label="Mot de passe"
          htmlFor="password"
          description="Au moins 8 caractères, dont une majuscule et un chiffre."
        >
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
            placeholder="8 caractères minimum"
          />
        </FormField>

        <label className="text-neutre-500 flex cursor-pointer items-start gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="accent-terracotta-500 mt-0.5 shrink-0"
          />
          <span>
            J&apos;accepte les{' '}
            <Link
              href="/legal/terms"
              className="text-terracotta-600 hover:underline"
            >
              conditions d&apos;utilisation
            </Link>{' '}
            et la{' '}
            <Link
              href="/legal/privacy"
              className="text-terracotta-600 hover:underline"
            >
              politique de confidentialité
            </Link>
            .
          </span>
        </label>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || !acceptedTerms}
        >
          {isLoading ? 'Création…' : 'Créer mon compte'}
        </Button>
      </form>

      <p className="text-neutre-400 text-center text-sm">
        Déjà inscrit·e ?{' '}
        <Link
          href="/login"
          className="text-terracotta-600 hover:text-terracotta-700 font-semibold transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
};

export { SignupForm };
