import { Suspense } from 'react';

import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

const ResetPasswordPage = () => (
  <Suspense>
    <ResetPasswordForm />
  </Suspense>
);

export default ResetPasswordPage;
