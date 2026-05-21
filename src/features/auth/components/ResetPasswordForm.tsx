'use client';

import { Check, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const CRITERIA = [
  { label: 'Au moins 8 caractères', test: (p: string) => p.length >= 8 },
  { label: 'Une majuscule', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Un chiffre', test: (p: string) => /[0-9]/.test(p) },
  {
    label: 'Un caractère spécial (recommandé)',
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
    optional: true,
  },
];

const STRENGTH = ['', 'faible', 'moyen', 'bon', 'excellent'] as const;
const STRENGTH_COLOR = [
  '',
  'text-bordeaux-600',
  'text-sable-600',
  'text-olive-700',
  'text-olive-700',
] as const;

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const metCriteria = CRITERIA.map((c) => c.test(password));
  const metCount = metCriteria.filter(Boolean).length;

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-md">
        <div className="bg-bordeaux-50 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full">
          <Settings size={24} className="text-bordeaux-500" />
        </div>
        <h1 className="text-neutre-800 mb-3 font-serif text-2xl font-semibold">
          Lien invalide
        </h1>
        <p className="text-neutre-500 mb-6 text-sm">
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>
        <Link
          href="/forgot-password"
          className="text-terracotta-600 hover:text-terracotta-700 text-sm font-medium transition-colors"
        >
          Demander un nouveau lien →
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

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (error) {
      setError('Une erreur est survenue. Le lien est peut-être expiré.');
      setIsLoading(false);
      return;
    }

    router.push('/login');
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
      {/* Icône */}
      <div className="bg-terracotta-50 mb-6 flex h-14 w-14 items-center justify-center rounded-full">
        <Settings size={24} className="text-terracotta-500" />
      </div>

      <h1 className="text-neutre-800 mb-3 font-serif text-3xl leading-tight font-semibold">
        Un nouveau
        <br />
        <em className="text-terracotta-600">mot de passe</em>.
      </h1>
      <p className="text-neutre-500 mb-6 text-sm leading-relaxed">
        Choisissez quelque chose dont vous vous souviendrez. On ne juge pas.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p
            role="alert"
            className="bg-bordeaux-50 text-bordeaux-600 rounded-lg px-3 py-2.5 text-sm"
          >
            {error}
          </p>
        )}

        {/* Mot de passe */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-neutre-700 text-sm leading-none font-medium"
          >
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
          {/* Barre de force — toujours visible */}
          <div className="flex gap-1">
            {CRITERIA.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-300',
                  i < metCount ? 'bg-olive-500' : 'bg-neutre-200',
                )}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutre-400">
              Force :{' '}
              <strong
                className={
                  metCount > 0 ? STRENGTH_COLOR[metCount] : 'text-neutre-300'
                }
              >
                {metCount > 0 ? STRENGTH[metCount] : '—'}
              </strong>
            </span>
            <span className="text-neutre-400">
              {password.length} caractères
            </span>
          </div>
        </div>

        <FormField label="Confirmer" htmlFor="confirmPassword">
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
          />
        </FormField>

        {/* Checklist critères */}
        <ul className="space-y-1.5">
          {CRITERIA.map((criterion, i) => (
            <li
              key={i}
              className={cn(
                'flex items-center gap-2 text-xs',
                metCriteria[i]
                  ? 'text-olive-700'
                  : criterion.optional
                    ? 'text-neutre-400'
                    : 'text-neutre-400',
              )}
            >
              {metCriteria[i] ? (
                <Check size={12} className="shrink-0 text-olive-600" />
              ) : (
                <span className="border-neutre-300 h-3 w-3 shrink-0 rounded-full border-[1.5px]" />
              )}
              {criterion.label}
            </li>
          ))}
        </ul>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Enregistrement…' : 'Mettre à jour & se connecter'}
        </Button>
      </form>
    </div>
  );
};

export { ResetPasswordForm };
