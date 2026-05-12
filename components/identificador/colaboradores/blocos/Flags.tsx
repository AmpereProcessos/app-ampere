import CheckboxInput from "@/components/inputs/Checkbox";
import { TEmployee } from "@/utils/schemas/users";
import { Shield } from "lucide-react";

type FlagsProps = {
  infoHolder: TEmployee;
  updateInfoHolder: (changes: Partial<TEmployee>) => void;
  showEmployeeStatusControl: boolean;
  showAccessStatusControl: boolean;
};

export default function Flags({
  infoHolder,
  updateInfoHolder,
  showEmployeeStatusControl,
  showAccessStatusControl,
}: FlagsProps) {
  if (!showEmployeeStatusControl && !showAccessStatusControl) return null;
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
        <Shield size={15} />
        <h1 className="text-xs tracking-tight font-medium text-start w-fit">STATUS</h1>
      </div>
      {showEmployeeStatusControl && (
        <div className="flex w-full items-center justify-center">
          <div className="w-fit">
            <CheckboxInput
              checked={infoHolder.colaboradorAtivo}
              handleChange={(value) => updateInfoHolder({ colaboradorAtivo: value })}
              labelFalse="COLABORADOR ATIVO"
              labelTrue="COLABORADOR ATIVO"
              justify="justify-center"
            />
          </div>
        </div>
      )}
      {showAccessStatusControl && (
        <div className="flex w-full items-center justify-center">
          <div className="w-fit">
            <CheckboxInput
              checked={infoHolder.acessoAtivo}
              handleChange={(value) => updateInfoHolder({ acessoAtivo: value })}
              labelFalse="ACESSO ATIVO"
              labelTrue="ACESSO ATIVO"
              justify="justify-center"
            />
          </div>
        </div>
      )}
    </div>
  );
}
