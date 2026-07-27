import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingComponent from "@/components/utils/LoadingComponent";
import ResponsiveDialogDrawerViewOnly from "@/components/utils/ResponsiveDialogDrawerViewOnly";
import { useDebounceMemo } from "@/lib/hooks/debounce";
import { formatLocation } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { fetchProjectById } from "@/utils/methods/query/clients";
import { useVinculationProjectsSearch } from "@/utils/methods/query/projects";
import type {
  TProjectDTO,
  TProjectDTODBSimplified,
  TQueryVinculationProjectsFilterInput,
} from "@/utils/schemas/projects";
import { LinkIcon, MapPin, Phone, UserRound } from "lucide-react";
import React, { useState } from "react";
import { FaLink, FaPhone, FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

type ProjectVinculationMenuProps = {
  closeModal: () => void;
  handleSelect: (project: TProjectDTO) => void;
};
function ProjectVinculationMenu({ closeModal, handleSelect }: ProjectVinculationMenuProps) {
  const [queryParams, setQueryParams] = useState<TQueryVinculationProjectsFilterInput>({
    search: "",
  });
  const debouncedQueryParams = useDebounceMemo(queryParams, 350);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
  } = useVinculationProjectsSearch(debouncedQueryParams);
  const projects = data?.projects ?? [];

  async function handleProjectSelection(projectId: string) {
    const project = await fetchProjectById({ id: projectId });
    handleSelect(project);
    closeModal();
  }
  const MENU_TITLE = "MENU DE VINCULAÇÃO DE PROJETO";
  const MENU_DESCRIPTION = "Preencha os campos abaixo para vincular um projeto.";
  return (
    <ResponsiveDialogDrawerViewOnly
      menuTitle={MENU_TITLE}
      menuDescription={MENU_DESCRIPTION}
      menuCancelButtonText="FECHAR"
      stateIsLoading={false}
      closeMenu={closeModal}
      dialogContentClassName="min-h-[60vh] max-h-[70vh] w-full"
      drawerContentClassName="max-h-[70vh]"
    >
      <Input
        value={queryParams.search}
        placeholder="Pesquisa aqui pelo nome ou identificador do projeto..."
        onChange={(e) => setQueryParams((prev) => ({ ...prev, search: e.target.value }))}
        className="w-full ring-0 outline-none"
      />
      {isLoading || isFetching ? <LoadingComponent /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess && !isFetching ? (
        <div className="scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 flex h-full min-h-0 flex-col gap-y-2 overflow-y-auto overscroll-y-auto p-2 py-1">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectVinculationMenuItem
                key={project._id}
                project={project}
                handleProjectSelection={handleProjectSelection}
              />
            ))
          ) : (
            <div className="text-foreground w-full text-center text-sm font-medium tracking-tight">
              Nenhum projeto encontrado.
            </div>
          )}
        </div>
      ) : null}
    </ResponsiveDialogDrawerViewOnly>
  );
}

export default ProjectVinculationMenu;

type ProjectVinculationMenuItemProps = {
  project: TProjectDTODBSimplified;
  handleProjectSelection: (projectId: string) => void;
};
function ProjectVinculationMenuItem({
  project,
  handleProjectSelection,
}: ProjectVinculationMenuItemProps) {
  return (
    <div className="bg-card border-border flex w-full flex-col gap-1 rounded-xl border px-3 py-4 shadow-2xs">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="rounded-lg bg-[#fead41] px-2 py-0.5 text-[0.6rem] font-bold text-white">
            {project.qtde}
          </h1>
          <p className="text-sm leading-none font-bold tracking-tight">{project.nomeDoContrato}</p>
        </div>
        <Button
          type="button"
          onClick={() => handleProjectSelection(project._id)}
          variant={"default"}
          size={"xs"}
          className="flex items-center gap-1"
        >
          <LinkIcon className="h-4 w-4 min-h-4 min-w-4" />
          <h1>VINCULAR</h1>
        </Button>
      </div>
      <div className="flex w-full flex-col items-start gap-1.5">
        <div className="flex items-center gap-1">
          <UserRound className="h-4 w-4 min-h-4 min-w-4" />
          <h1 className="text-foreground text-start text-[0.6rem] font-medium italic">
            {project.nomeDoContrato}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="h-4 w-4 min-h-4 min-w-4" />
          <h1 className="text-foreground text-start text-[0.6rem] font-medium italic">
            {project.telefone}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 min-h-4 min-w-4" />
          <h1 className="text-foreground text-start text-[0.6rem] font-medium italic">
            {formatLocation({
              location: {
                uf: project.uf || "",
                cidade: project.cidade || "",
                cep: project.cep?.toString() || "",
                bairro: project.bairro,
                endereco: project.logradouro,
                numeroOuIdentificador: project.numeroResidencia?.toString() || "",
                complemento: null,
                latitude: null,
                longitude: null,
              },
              includeCity: true,
              includeUf: true,
            })}
          </h1>
        </div>
      </div>
    </div>
  );
}
