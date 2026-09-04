"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { InteractiveInput } from "@/components/ui/interactive-input";
import { LoadingButton } from "@/components/utils/Buttons/LoadingButton";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { AnimatedSpinner } from "@/components/utils/icons";
import { cn } from "@/lib/utils";
import { formatLocation } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useVinculationProjectsSearchInfinite } from "@/utils/methods/query/projects";
import type { TProjectDTODBSimplified } from "@/utils/schemas/projects";
import { MapPin, Search } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { HiCheck } from "react-icons/hi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import type { TProjectPickerFallback, TProjectPickerSelection } from "./types";

const RESET_VALUE = "__project_reset__";

export function formatProjectLocation(project: TProjectDTODBSimplified) {
  return (
    formatLocation({
      location: {
        uf: project.uf || "",
        cidade: project.cidade || "",
        cep: project.cep?.toString() || null,
        bairro: project.bairro,
        endereco: project.logradouro,
        numeroOuIdentificador: project.numeroResidencia?.toString() || null,
        complemento: null,
        latitude: null,
        longitude: null,
      },
      includeCity: true,
      includeUf: true,
    }) || "Localização não informada"
  );
}

type SelectProjectInputProps = {
  label?: string;
  labelClassName?: string;
  holderClassName?: string;
  showLabel?: boolean;
  width?: string;
  /** ID do projeto selecionado. */
  value: string | null;
  /** Projeto já selecionado (ex: vindo de um registro salvo), usado para rotular o gatilho. */
  selectedProject?: TProjectDTODBSimplified | null;
  /** Rótulo de fallback quando só há `{ nome, identificador }` persistidos. */
  fallbackLabel?: TProjectPickerFallback | null;
  selectedItemLabel?: string;
  editable?: boolean;
  required?: boolean;
  handleChange: (selection: TProjectPickerSelection) => void;
  onReset: () => void;
};

function SelectProjectInput({
  label = "PROJETO",
  labelClassName,
  holderClassName,
  showLabel = true,
  width,
  value,
  selectedProject,
  fallbackLabel,
  selectedItemLabel = "NENHUM PROJETO VINCULADO",
  editable = true,
  required = false,
  handleChange,
  onReset,
}: SelectProjectInputProps) {
  const triggerId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // O projeto escolhido é mantido localmente para que o rótulo do gatilho sobreviva
  // a mudanças na busca (os resultados atuais podem não conter mais o item selecionado).
  const [cachedProject, setCachedProject] = useState<TProjectDTODBSimplified | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    debouncedSearch,
  } = useVinculationProjectsSearchInfinite({ search });

  const projects = useMemo(() => data?.pages.flatMap((page) => page.projects) ?? [], [data?.pages]);
  const totalMatched = data?.pages[0]?.projectsMatched ?? 0;

  const resolvedSelected = useMemo(() => {
    if (selectedProject) return selectedProject;
    if (cachedProject && cachedProject._id === value) return cachedProject;
    return projects.find((project) => project._id === value) ?? null;
  }, [selectedProject, cachedProject, projects, value]);

  function handleSelect(project: TProjectDTODBSimplified) {
    setCachedProject(project);
    handleChange({
      id: project._id,
      nome: project.nomeDoContrato,
      identificador: project.qtde,
      project,
    });
    setIsOpen(false);
  }

  function handleReset() {
    setCachedProject(null);
    onReset();
    setIsOpen(false);
  }

  // Sem o registro completo, ainda conseguimos rotular o gatilho com o que foi persistido.
  const hasFallbackLabel = !!value && !resolvedSelected && !!fallbackLabel?.nome;

  const triggerLabel = resolvedSelected ? (
    <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 overflow-hidden text-start">
      <span className="flex w-full min-w-0 items-center gap-1.5">
        <span className="shrink-0 rounded-lg bg-[#fead41] px-2 py-0.5 text-[0.6rem] font-bold text-white">
          {resolvedSelected.qtde}
        </span>
        <span className="min-w-0 grow truncate text-sm font-medium">
          {resolvedSelected.nomeDoContrato}
        </span>
      </span>
      <span className="text-muted-foreground flex w-full min-w-0 items-center gap-1 text-[0.65rem]">
        <MapPin className="h-3 w-3 min-h-3 min-w-3 shrink-0" />
        <span className="min-w-0 truncate">{formatProjectLocation(resolvedSelected)}</span>
      </span>
    </span>
  ) : hasFallbackLabel ? (
    <span className="flex w-full min-w-0 flex-1 items-center gap-1.5 overflow-hidden text-start">
      {fallbackLabel?.identificador ? (
        <span className="shrink-0 rounded-lg bg-[#fead41] px-2 py-0.5 text-[0.6rem] font-bold text-white">
          {fallbackLabel.identificador}
        </span>
      ) : null}
      <span className="min-w-0 grow truncate text-sm font-medium">{fallbackLabel?.nome}</span>
    </span>
  ) : (
    <span className="min-w-0 flex-1 truncate text-start">{selectedItemLabel}</span>
  );

  const triggerButton = (
    <Button
      type="button"
      id={triggerId}
      disabled={!editable}
      variant="outline"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      className={cn(
        "bg-background text-foreground flex h-full min-h-[46.6px] w-full items-center justify-between gap-2 rounded-md border p-3 text-sm font-normal shadow-xs transition-[border-color,box-shadow] duration-500 ease-in-out dark:bg-[#121212]",
        isOpen ? "border-primary" : "border-border",
        "hover:bg-background",
        holderClassName,
      )}
    >
      {triggerLabel}
      {isOpen ? (
        <IoMdArrowDropup className="text-foreground h-5 w-5 min-h-5 min-w-5 shrink-0" aria-hidden />
      ) : (
        <IoMdArrowDropdown
          className="text-foreground h-5 w-5 min-h-5 min-w-5 shrink-0"
          aria-hidden
        />
      )}
    </Button>
  );

  // A filtragem acontece no servidor — o cmdk não deve refiltrar os resultados recebidos.
  const listBox = (
    <Command loop shouldFilter={false} className="w-full">
      <div className="flex items-center gap-2 border-b px-3">
        <Search className="text-muted-foreground h-4 w-4 min-h-4 min-w-4 shrink-0" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pesquise pelo nome, identificador ou código SVB..."
          className="h-10 border-0 px-0 text-sm italic shadow-none focus-visible:ring-0"
        />
        {isFetching && !isFetchingNextPage ? <AnimatedSpinner className="h-4 w-4 shrink-0" /> : null}
      </div>
      <CommandList className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 max-h-[280px] w-full overflow-y-auto overscroll-y-auto">
        {isLoading ? (
          <div className="flex w-full flex-col items-center gap-2 p-6">
            <AnimatedSpinner className="h-6 w-6" />
            <p className="text-muted-foreground text-xs">Carregando projetos...</p>
          </div>
        ) : null}
        {isError ? (
          <div className="p-3">
            <ErrorComponent msg={getErrorMessage(error)} />
          </div>
        ) : null}
        {isSuccess ? (
          <>
            <div className="border-border border-b px-3 py-2">
              <p className="text-muted-foreground text-center text-[0.65rem]">
                {totalMatched === 1 ? "1 PROJETO ENCONTRADO" : `${totalMatched} PROJETOS ENCONTRADOS`}
                {projects.length > 0 ? ` · EXIBINDO ${projects.length}` : null}
              </p>
            </div>
            <CommandGroup className="w-full p-0">
              <CommandItem
                value={RESET_VALUE}
                onSelect={handleReset}
                className="hover:bg-primary/20 data-[selected=true]:bg-primary/20"
              >
                <p className="text-foreground grow text-sm font-medium">{selectedItemLabel}</p>
                <HiCheck
                  className={cn("ml-auto shrink-0", !value ? "opacity-100" : "opacity-0")}
                  style={{ color: "#fead61", fontSize: "20px" }}
                />
              </CommandItem>
              <CommandSeparator className="my-2 h-px bg-gray-200" />
              {projects.map((project) => {
                const isSelected = value === project._id;
                return (
                  <CommandItem
                    key={project._id}
                    value={project._id}
                    onSelect={() => handleSelect(project)}
                    className={cn(
                      "hover:bg-primary/20 data-[selected=true]:bg-primary/20 flex flex-col items-start gap-1 py-2",
                      isSelected && "bg-primary/20",
                    )}
                  >
                    <div className="flex w-full min-w-0 items-center gap-1.5">
                      <span className="shrink-0 rounded-lg bg-[#fead41] px-2 py-0.5 text-[0.6rem] font-bold text-white">
                        {project.qtde}
                      </span>
                      <span className="min-w-0 grow truncate text-sm font-medium">
                        {project.nomeDoContrato}
                      </span>
                      <HiCheck
                        className={cn("ml-auto shrink-0", isSelected ? "opacity-100" : "opacity-0")}
                        style={{ color: "#fead61", fontSize: "20px" }}
                      />
                    </div>
                    <div className="text-muted-foreground flex w-full min-w-0 items-center gap-1 text-[0.65rem]">
                      <MapPin className="h-3 w-3 min-h-3 min-w-3 shrink-0" />
                      <span className="min-w-0 truncate">{formatProjectLocation(project)}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {/* Nao usamos CommandEmpty: com shouldFilter={false} o item de reset ja conta como
                resultado para o cmdk, entao o empty nativo nunca dispararia. */}
            {projects.length === 0 ? (
              <div className="text-muted-foreground w-full p-4 text-center text-sm italic">
                {debouncedSearch.trim().length > 0
                  ? "Nenhum projeto encontrado para essa pesquisa."
                  : "Nenhum projeto disponível."}
              </div>
            ) : null}
            {hasNextPage ? (
              <div className="border-border border-t p-2">
                <LoadingButton
                  type="button"
                  variant="outline"
                  size="sm"
                  loading={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  className="w-full text-xs"
                >
                  CARREGAR MAIS
                </LoadingButton>
              </div>
            ) : null}
          </>
        ) : null}
      </CommandList>
    </Command>
  );

  return (
    <div
      className={cn("relative flex w-full flex-col gap-1", !width && "lg:w-[350px]")}
      style={width ? { width, maxWidth: "100%" } : { maxWidth: "100%" }}
    >
      {showLabel ? (
        <label
          htmlFor={triggerId}
          className={cn(
            "text-foreground text-start text-sm font-medium tracking-tight",
            labelClassName,
          )}
        >
          {label}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      ) : null}
      <InteractiveInput.Root open={isOpen} onOpenChange={setIsOpen} disabled={!editable}>
        <InteractiveInput.Trigger>{triggerButton}</InteractiveInput.Trigger>
        <InteractiveInput.Content
          align="start"
          className="border-border bg-background z-100 w-[var(--radix-popover-trigger-width)] border p-0 shadow-xs dark:bg-[#121212]"
        >
          {listBox}
        </InteractiveInput.Content>
      </InteractiveInput.Root>
    </div>
  );
}

export default SelectProjectInput;
