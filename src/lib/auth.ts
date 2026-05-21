import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { headers } from 'next/headers';
import { cache } from 'react';

import { prisma } from './prisma';
import { resend } from './resend';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subjects: Record<string, string> = {
          'forget-password': 'Votre code de réinitialisation WeeklyMeals',
          'email-verification': 'Vérifiez votre adresse email WeeklyMeals',
          'sign-in': 'Votre code de connexion WeeklyMeals',
        };
        await resend.emails.send({
          from: 'WeeklyMeals <no-reply@weeklymeals.fr>',
          to: email,
          subject: subjects[type] ?? 'Votre code WeeklyMeals',
          html: `<p>Votre code de vérification :</p><p style="font-size:32px;font-weight:bold;letter-spacing:8px;">${otp}</p><p>Ce code expire dans 10 minutes.</p>`,
        });
      },
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
      },
    },
  },
});

export const getCurrentSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});
