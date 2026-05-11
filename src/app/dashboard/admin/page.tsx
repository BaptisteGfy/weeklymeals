import { getAdminStats } from '@/actions/admin-actions';

const AdminPage = async () => {
  const { userCount, recipeCount, plannedMealCount } = await getAdminStats();

  const stats = [
    { label: 'Utilisateurs', value: userCount },
    { label: 'Recettes', value: recipeCount },
    { label: 'Repas planifiés', value: plannedMealCount },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard admin</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
