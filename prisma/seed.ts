import 'dotenv/config';

import { auth } from '../src/lib/auth';

async function seed() {
  const result = await auth.api.signUpEmail({
    body: {
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
      name: process.env.ADMIN_NAME!,
    },
  });

  console.log('Compte admin créé :', result.user.email);
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0));
