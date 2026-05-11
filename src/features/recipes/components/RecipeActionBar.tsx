import Link from 'next/link';

type Props = {
  isEditing: boolean;
  startEditing: () => void;
  handleCancel: () => void;
  showPlanningButton: boolean;
  onOpenModal: () => void;
};

export const RecipeActionBar = ({
  isEditing,
  startEditing,
  handleCancel,
  showPlanningButton,
  onOpenModal,
}: Props) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Link
        href="/dashboard/recipes"
        className="text-sm text-gray-500 transition hover:text-gray-800"
      >
        ← Mes recettes
      </Link>

      {isEditing ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Sauvegarder
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={startEditing}
            className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          >
            ✏️ Modifier
          </button>

          {showPlanningButton && (
            <button
              type="button"
              onClick={onOpenModal}
              className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
              🕒 Ajouter à l'agenda
            </button>
          )}
        </>
      )}
    </div>
  );
};
