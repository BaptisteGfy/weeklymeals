import { redirect } from 'next/navigation';

import { ProfileView } from '@/features/auth/components/ProfileView';
import { getCurrentSession } from '@/lib/auth';

const ProfilePage = async () => {
  const session = await getCurrentSession();

  if (!session) redirect('/login');

  return <ProfileView user={session.user} />;
};

export default ProfilePage;
