import { Suspense } from 'react';

import { VerifyOTPForm } from '@/features/auth/components/VerifyOTPForm';

const VerifyPage = () => (
  <Suspense>
    <VerifyOTPForm />
  </Suspense>
);

export default VerifyPage;
