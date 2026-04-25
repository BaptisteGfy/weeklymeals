import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <nav className="border-b px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-xl font-bold">WeeklyMeals</span>
          <Link
            href="/dashboard"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold">Planifiez vos repas</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-500">
          WeeklyMeals vous aide à organiser vos repas de la semaine, gérer vos
          recettes et générer votre liste de courses automatiquement.
        </p>
        <Link
          href="/dashboard"
          className="mt-10 inline-block rounded-md bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Commencer
        </Link>
      </main>
    </div>
  );
};

export default HomePage;
