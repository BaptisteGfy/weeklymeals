import type { Instruction } from '../types';

type Props = {
  instruction: string;
  instructions: Instruction[];
  onInstructionChange: (value: string) => void;
  onAddInstruction: () => void;
  onDeleteInstruction: (id: string) => void;
};

export const InstructionSection = ({
  instruction,
  instructions,
  onInstructionChange,
  onAddInstruction,
  onDeleteInstruction,
}: Props) => {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-semibold">Instructions</h3>

      <div className="flex gap-2">
        <input
          type="text"
          value={instruction}
          onChange={(event) => onInstructionChange(event.target.value)}
          placeholder="Ex : Couper les oignons"
          className="flex-1 rounded-md border px-3 py-2"
        />

        <button
          type="button"
          onClick={onAddInstruction}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Ajouter
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {instructions.map((step, index) => (
          <li
            key={step.id}
            className="flex items-center justify-between rounded-md border px-3 py-2"
          >
            <span>
              <strong>Étape {index + 1} :</strong> {step.text}
            </span>

            <button
              type="button"
              onClick={() => onDeleteInstruction(step.id)}
              className="text-red-600 transition hover:text-red-800"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};