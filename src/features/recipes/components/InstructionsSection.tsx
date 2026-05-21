import { Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

import { Instruction } from '@/types/recipes';

type Props = {
  isEditing: boolean;
  instructions: Instruction[];
  instructionDraft: string;
  setInstructionDraft: Dispatch<SetStateAction<string>>;
  handleInstructionChange: (id: string, text: string) => void;
  handleInstructionTipChange: (id: string, tip: string) => void;
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
  handleInstructionTipChange,
  handleAddInstruction,
  handleDeleteInstruction,
  error,
}: Props) => {
  return (
    <section>
      {/* Section title — italic terracotta, text-2xl (30px) */}
      <h2 className="text-terracotta-600 mb-5 font-serif text-3xl font-normal italic">
        Préparation
      </h2>

      {instructions.length === 0 && !isEditing ? (
        <p className="text-neutre-400 text-sm italic">
          Aucune étape renseignée.
        </p>
      ) : (
        <ol className="flex flex-col gap-5">
          {instructions.map((instruction, index) => (
            <li
              key={instruction.id}
              className="group grid grid-cols-[60px_1fr] items-start gap-5"
            >
              {/* Step number — Lora italic, 48px (text-5xl), terracotta-300, leading-0.9, font-normal */}
              <div className="text-terracotta-300 pt-1.5 font-serif text-5xl leading-[0.9] font-normal italic">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <div className="flex gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                      <textarea
                        value={instruction.text}
                        onChange={(e) =>
                          handleInstructionChange(
                            instruction.id,
                            e.target.value,
                          )
                        }
                        rows={3}
                        className="border-neutre-200 text-neutre-700 w-full resize-none rounded-lg border px-3 py-2 text-sm leading-relaxed focus:outline-none"
                      />
                      <input
                        value={instruction.tip ?? ''}
                        onChange={(e) =>
                          handleInstructionTipChange(
                            instruction.id,
                            e.target.value,
                          )
                        }
                        placeholder="Astuce pour cette étape (optionnel)…"
                        className="placeholder:text-neutre-300 w-full rounded-lg border border-olive-200 bg-transparent px-3 py-1.5 text-sm text-olive-700 focus:outline-none"
                      />
                    </div>
                    {/* Delete — visible on hover */}
                    <button
                      type="button"
                      onClick={() => handleDeleteInstruction(instruction.id)}
                      className="text-neutre-300 hover:text-bordeaux-500 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-neutre-700 pt-1.5 text-lg leading-relaxed">
                      {instruction.text}
                    </p>
                    {instruction.tip && (
                      <div className="mt-3 rounded-r-lg border-l-4 border-olive-300 bg-olive-50 px-4 py-2.5">
                        <p className="text-sm text-olive-700 italic">
                          {instruction.tip}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}

          {/* Add step */}
          {isEditing && (
            <li className="grid grid-cols-[60px_1fr] items-start gap-5">
              <div className="text-neutre-300 pt-1.5 font-serif text-5xl leading-[0.9] font-normal italic">
                {String(instructions.length + 1).padStart(2, '0')}
              </div>
              <div className="space-y-2">
                <textarea
                  value={instructionDraft}
                  onChange={(e) => setInstructionDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddInstruction();
                    }
                  }}
                  placeholder="Nouvelle étape… (Entrée pour valider)"
                  rows={2}
                  className="border-neutre-200 text-neutre-700 placeholder:text-neutre-300 w-full resize-none rounded-lg border px-3 py-2 text-sm leading-relaxed focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddInstruction}
                  className="border-terracotta-300 text-terracotta-600 hover:bg-terracotta-50 inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-sm font-medium transition-colors"
                >
                  + Ajouter une étape
                </button>
              </div>
            </li>
          )}
        </ol>
      )}

      {isEditing && error && (
        <p role="alert" className="text-bordeaux-500 mt-3 text-xs">
          {error}
        </p>
      )}
    </section>
  );
};
