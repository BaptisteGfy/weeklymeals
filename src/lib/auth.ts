import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
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
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'WeeklyMeals <no-reply@weeklymeals.fr>',
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><a href="${url}">${url}</a>`,
      });
    },
  },
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
