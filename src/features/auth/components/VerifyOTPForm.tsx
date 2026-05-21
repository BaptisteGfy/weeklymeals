'use client';

import { Bell } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { authClient } from '@/lib/auth-client';

const RESEND_DELAY = 60;

const VerifyOTPForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const type =
    (searchParams.get('type') as 'forget-password' | 'email-verification') ??
    'forget-password';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_DELAY);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setError('');
    setIsLoading(true);

    const { error } = await authClient.emailOtp.checkVerificationOtp({
      email,
      otp,
      type,
    });

    if (error) {
      setError('Code incorrect ou expiré. Vérifiez et réessayez.');
      setIsLoading(false);
      return;
    }

    if (type === 'forget-password') {
      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
      );
    } else {
      router.push('/dashboard');
    }
  };

  const handleResend = async () => {
    setError('');
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type,
    });
    if (error) {
      setError('Impossible de renvoyer le code. Réessayez.');
    } else {
      setCountdown(RESEND_DELAY);
      setOtp('');
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
      <div className="flex flex-col items-center text-center">
        <div className="bg-terracotta-50 mb-6 flex h-14 w-14 items-center justify-center rounded-full">
          <Bell size={24} className="text-terracotta-500" />
        </div>

        <p className="text-terracotta-600 mb-2 text-xs font-semibold tracking-widest uppercase">
          Vérification
        </p>
        <h1 className="text-neutre-800 mb-3 font-serif text-3xl leading-tight font-semibold">
          Entrez le <em className="text-terracotta-600">code</em>
          <br />
          reçu par email.
        </h1>
        <p className="text-neutre-500 mb-8 text-sm leading-relaxed">
          Nous venons d&apos;envoyer un code à 6 chiffres à{' '}
          <strong className="text-neutre-800">{email}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <p
              role="alert"
              className="bg-bordeaux-50 text-bordeaux-600 rounded-lg px-3 py-2.5 text-sm"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || otp.length < 6}
          >
            {isLoading ? 'Vérification…' : 'Vérifier & continuer'}
          </Button>
        </form>

        <div className="mt-4 flex items-center gap-1.5 text-sm">
          <span className="text-neutre-400">Pas reçu ?</span>
          {countdown > 0 ? (
            <span className="text-neutre-400">
              Renvoyer un nouveau code{' '}
              <span className="text-neutre-300">· dans {countdown}s</span>
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors"
            >
              Renvoyer un nouveau code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { VerifyOTPForm };
