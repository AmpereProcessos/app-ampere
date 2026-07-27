"use client";

import { cn } from "@/lib/utils";
import type { TProjectDTODBSimplified } from "@/utils/schemas/projects";
import { useState } from "react";
import ProjectResumePanel from "./ProjectResumePanel";
import SelectProjectInput from "./SelectProjectInput";
import type { TProjectPickerFallback, TProjectPickerSelection } from "./types";

export type ProjectPickerProps = {
  label?: string;
  labelClassName?: string;
  holderClassName?: string;
  showLabel?: boolean;
  width?: string;
  className?: string;
  /** ID do projeto vinculado. */
  value: string | null;
  /** Projeto simplificado já conhecido pelo consumidor, se houver. */
  selectedProject?: TProjectDTODBSimplified | null;
  /** Rótulo de fallback para registros salvos, que guardam apenas `{ nome, identificador }`. */
  fallbackLabel?: TProjectPickerFallback | null;
  selectedItemLabel?: string;
  editable?: boolean;
  required?: boolean;
  /** Exibe o painel de resumo abaixo do input quando há um projeto vinculado. */
  showResume?: boolean;
  resumeDefaultExpanded?: boolean;
  handleChange: (selection: TProjectPickerSelection) => void;
  onReset: () => void;
};

/**
 * Seletor de projetos com busca assíncrona e painel de resumo opcional.
 *
 * A busca é feita no servidor (/api/projects/pesquisa-vinculacao) com debounce e paginação,
 * então o componente não carrega a lista inteira de projetos como o antigo `useClients(true)`.
 */
function ProjectPicker({
  label = "PROJETO",
  labelClassName,
  holderClassName,
  showLabel = true,
  width = "100%",
  className,
  value,
  selectedProject,
  fallbackLabel,
  selectedItemLabel = "NENHUM PROJETO VINCULADO",
  editable = true,
  required = false,
  showResume = true,
  resumeDefaultExpanded = false,
  handleChange,
  onReset,
}: ProjectPickerProps) {
  // Guarda o último projeto escolhido nesta sessão para alimentar o cabeçalho do resumo
  // mesmo quando o consumidor só persiste { id, nome }.
  const [pickedProject, setPickedProject] = useState<TProjectDTODBSimplified | null>(null);

  const resolvedProject =
    selectedProject ?? (pickedProject && pickedProject._id === value ? pickedProject : null);

  function handleSelection(selection: TProjectPickerSelection) {
    setPickedProject(selection.project);
    handleChange(selection);
  }

  function handleReset() {
    setPickedProject(null);
    onReset();
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <SelectProjectInput
        label={label}
        labelClassName={labelClassName}
        holderClassName={holderClassName}
        showLabel={showLabel}
        width={width}
        value={value}
        selectedProject={resolvedProject}
        fallbackLabel={fallbackLabel}
        selectedItemLabel={selectedItemLabel}
        editable={editable}
        required={required}
        handleChange={handleSelection}
        onReset={handleReset}
      />
      {showResume && value ? (
        <ProjectResumePanel
          projectId={value}
          selectedProject={resolvedProject}
          fallbackLabel={fallbackLabel}
          defaultExpanded={resumeDefaultExpanded}
        />
      ) : null}
    </div>
  );
}

export default ProjectPicker;
