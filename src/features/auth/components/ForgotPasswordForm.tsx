'use client';

import { Bell, Check, Info } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { FormField } from '@/components/shared/FormField';
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
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <div className="flex flex-col items-center text-center">
          {/* Icône succès olive */}
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-olive-50">
            <Check size={24} className="text-olive-500" />
          </div>

          <h1 className="text-neutre-800 mb-3 font-serif text-3xl leading-tight font-semibold">
            Email <em className="text-terracotta-600">envoyé</em>.
          </h1>
          <p className="text-neutre-500 mb-6 text-sm leading-relaxed">
            Nous avons envoyé un lien à{' '}
            <strong className="text-neutre-800">{email}</strong>. Cliquez dessus
            dans les prochaines minutes pour confirmer votre adresse et
            démarrer.
          </p>

          {/* Info box */}
          <div className="bg-neutre-50 border-neutre-200 mb-6 w-full rounded-xl border p-4 text-left">
            <div className="text-neutre-800 mb-2 flex items-center gap-2 text-sm font-semibold">
              <Info size={14} className="text-neutre-500 shrink-0" />
              Vous ne le trouvez pas ?
            </div>
            <ul className="text-neutre-500 list-disc space-y-1 pl-5 text-xs leading-relaxed">
              <li>Vérifiez le dossier spams / promotions</li>
              <li>
                L&apos;expéditeur est{' '}
                <em className="text-neutre-700">hello@weeklymeals.fr</em>
              </li>
              <li>
                Le lien expire dans{' '}
                <strong className="text-neutre-700">60 minutes</strong>
              </li>
            </ul>
          </div>

          <Button variant="outline" className="mb-3 w-full gap-2">
            <Bell size={14} />
            Renvoyer l&apos;email
          </Button>

          <p className="text-neutre-400 text-sm">
            Mauvais email ?{' '}
            <button
              onClick={() => setIsSent(false)}
              className="text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors"
            >
              Modifier l&apos;adresse
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
      {/* Icône cloche */}
      <div className="bg-terracotta-50 mb-6 flex h-14 w-14 items-center justify-center rounded-full">
        <Bell size={24} className="text-terracotta-500" />
      </div>

      <p className="text-terracotta-600 mb-2 text-xs font-semibold tracking-widest uppercase">
        Mot de passe
      </p>
      <h1 className="text-neutre-800 mb-3 font-serif text-3xl leading-tight font-semibold">
        Vous avez <em className="text-terracotta-600">oublié</em> ?<br />
        Ça arrive.
      </h1>
      <p className="text-neutre-500 mb-6 text-sm leading-relaxed">
        Saisissez l&apos;email de votre compte. Nous vous enverrons un lien pour
        choisir un nouveau mot de passe.
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

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Envoi…' : 'Recevoir le lien de réinitialisation'}
        </Button>
      </form>

      <div className="border-neutre-100 mt-6 border-t pt-6 text-center">
        <Link
          href="/login"
          className="text-neutre-400 hover:text-neutre-600 text-sm transition-colors"
        >
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );
};

export { ForgotPasswordForm };
