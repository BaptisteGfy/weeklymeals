import { Dispatch, SetStateAction } from 'react';

import { Instruction } from '@/features/recipes/types';

type Props = {
  isEditing: boolean;
  instructions: Instruction[];
  instructionDraft: string;
  setInstructionDraft: Dispatch<SetStateAction<string>>;
  handleInstructionChange: (id: string, text: string) => void;
  handleAddInstruction: () => void;
  handleDeleteInstruction: (id: string) => void;
  error?: string;
};

export const InstructionsSection = ({
  isEditing,
  instructions,
  instructionDraft,
  setInstructionDraft,
  handleInstructionChange,
  handleAddInstruction,
  handleDeleteInstruction,
  error,
}: Props) => {
  return (
    <section className="mt-8 pb-12">
      <h2 className="mb-3 text-xl font-semibold">Préparation</h2>
      {instructions.length === 0 && !isEditing ? (
        <p className="text-sm text-gray-400">Aucune instruction renseignée.</p>
      ) : (
        <ol className="space-y-3">
          {instructions.map((instruction, index) => (
            <li key={instruction.id} className="flex items-start gap-3 text-sm">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                {index + 1}
              </span>
              {isEditing ? (
                <>
                  <textarea
                    value={instruction.text}
                    onChange={(e) =>
                      handleInstructionChange(instruction.id, e.target.value)
                    }
                    rows={2}
                    className="min-w-0 flex-1 rounded border px-2 py-1 text-sm leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteInstruction(instruction.id)}
                    className="mt-1 text-gray-400 transition hover:text-red-500"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <span className="leading-relaxed text-gray-700">
                  {instruction.text}
                </span>
              )}
            </li>
          ))}

          {isEditing && (
            <li className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-300">
                {instructions.length + 1}
              </span>
              <textarea
                value={instructionDraft}
                onChange={(e) => setInstructionDraft(e.target.value)}
                placeholder="Nouvelle étape..."
                rows={2}
                className="min-w-0 flex-1 rounded border px-2 py-1 text-sm placeholder-gray-300"
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="mt-1 rounded border border-gray-300 px-2 py-1 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Ajouter
              </button>
            </li>
          )}
        </ol>
      )}
      {isEditing && error && (
        <p
          id="instructions-error"
          role="alert"
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </p>
      )}
    </section>
  );
};
