import { redirect } from 'next/navigation';

const DashboardPage = () => {
  redirect('/dashboard/recipes');
};

export default DashboardPage;
