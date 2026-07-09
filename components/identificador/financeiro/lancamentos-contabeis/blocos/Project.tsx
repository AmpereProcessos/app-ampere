import ProjectVinculationMenu from "@/components/identificador/projects/ProjectVinculationMenu";
import { Button } from "@/components/ui/button";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import type { TProjectDTO } from "@/utils/schemas/projects";
import { TUseAccountingEntryState } from "@/utils/state/accounting-entry";
import { Link2, LinkIcon, Unlink } from "lucide-react";
import { useState } from "react";
import { FaLink, FaUser } from "react-icons/fa";

function mapProjectToEntryProjeto(project: TProjectDTO) {
  return {
    identificador: String(project.qtde),
    id: project._id,
    nome: project.nomeDoContrato,
  };
}

type ProjectBlockProps = {
  entry: TUseAccountingEntryState["state"]["entry"];
  updateEntry: TUseAccountingEntryState["updateEntry"];
};

export default function ProjectBlock({ entry, updateEntry }: ProjectBlockProps) {
  const [vinculationModalIsOpen, setVinculationModalIsOpen] = useState(false);
  const hasProject = Boolean(entry.projeto?.id);

  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="PROJETO (CLIENTE)"
      sectionTitleIcon={<Link2 size={15} />}
    >
      {hasProject && entry.projeto ? (
        <div className="flex w-full flex-col gap-3">
          <div className="bg-primary/10 flex w-full flex-col gap-2 rounded-md border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-foreground text-[0.65rem] font-medium uppercase">
                Projeto vinculado
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={() => setVinculationModalIsOpen(true)}
                  size={"fit"}
                  className="flex items-center gap-1 p-1.5"
                >
                  <LinkIcon className="h-4 w-4 min-h-4 min-w-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => updateEntry({ projeto: null })}
                  variant={"destructive"}
                  className="flex items-center gap-1 p-1.5"
                  size={"fit"}
                >
                  <Unlink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="rounded-lg bg-amber-500 px-2 py-0.5 text-[0.6rem] font-bold text-black">
                  {entry.projeto.identificador}
                </h2>
                <div className="flex items-center gap-1">
                  <FaUser className="h-3 w-3" />
                  <p className="text-sm font-semibold leading-none tracking-tight">
                    {entry.projeto.nome}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:justify-end"></div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <p className="text-center text-sm font-medium tracking-tight text-foreground">
            Nenhum projeto (cliente) vinculado a este lançamento.
          </p>
          <button
            type="button"
            onClick={() => setVinculationModalIsOpen(true)}
            className="flex gap-1.5 p-4 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            <FaLink />
            <span>VINCULAR PROJETO</span>
          </button>
        </div>
      )}
      {vinculationModalIsOpen ? (
        <ProjectVinculationMenu
          handleSelect={(project) => updateEntry({ projeto: mapProjectToEntryProjeto(project) })}
          closeModal={() => setVinculationModalIsOpen(false)}
        />
      ) : null}
    </ResponsiveDialogDrawerSection>
  );
}
