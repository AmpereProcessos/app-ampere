import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, LayoutList, LinkIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { BsFunnelFill } from "react-icons/bs";
import { MdAttachFile } from "react-icons/md";

import { Input } from "@/components/ui/input";
import type { TAuthSession } from "@/lib/authentication/types";
import { cn } from "@/lib/utils";
import { GeneralVisibleHiddenExitMotionVariants } from "@/utils/constants";
import { getErrorMessage } from "@/utils/methods/handlers";
import { getAllowedCategories } from "@/utils/methods/util/file-references";
import { type TUseFileReferencesFilters, useFileReferences } from "@/utils/methods/query/crm/file-references";
import type { TProject } from "@/utils/schemas/projects";
import type { TFileReferencesQueryParams } from "@/utils/schemas/crm/file-reference.schema";
import { FileReferenceCategories } from "@/utils/select-options";
import { useQueryClient } from "@tanstack/react-query";

import FileReferenceCard from "../identificador/referencias-arquivos/FileReferenceCard";
import ErrorComponent from "../utils/ErrorComponent";
import LoadingComponent from "../utils/LoadingComponent";
import NewAttachmentMenu from "./Utils/NewAttachmentMenu";

const FILES_VIEW_MODE_STORAGE_KEY = "ampere-files-view-mode";

type FilesViewMode = "list" | "grid";

type InfoAnexosBlockProps = {
  projectId: string;
  project: TProject;
  session: TAuthSession;
};

function InfoAnexosBlock({ projectId, project, session }: InfoAnexosBlockProps) {
  const queryClient = useQueryClient();
  const [newAttachmentMenuIsOpen, setNewAttachmentMenuIsOpen] = useState<boolean>(false);
  const [filtersMenuIsOpen, setFiltersMenuIsOpen] = useState<boolean>(false);
  const [filesViewMode, setFilesViewMode] = useState<FilesViewMode>("list");

  useEffect(() => {
    const stored = window.localStorage.getItem(FILES_VIEW_MODE_STORAGE_KEY);
    if (stored === "grid" || stored === "list") {
      setFilesViewMode(stored);
    }
  }, []);

  function updateFilesViewMode(mode: FilesViewMode) {
    setFilesViewMode(mode);
    window.localStorage.setItem(FILES_VIEW_MODE_STORAGE_KEY, mode);
  }

  const allowedCategories = getAllowedCategories({ session });
  const queryParam: TFileReferencesQueryParams = { projectId: projectId };
  const { data: fileReferences, isLoading, isError, isSuccess, error, filters, setFilters } =
    useFileReferences(queryParam);

  async function handleOnMutate() {
    await queryClient.cancelQueries({
      queryKey: ["file-references-by-query", queryParam],
    });
  }
  async function handleOnSettled() {
    await queryClient.invalidateQueries({
      queryKey: ["file-references-by-query", queryParam],
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border border-primary pb-2 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-primary/20 px-2 py-2 rounded">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-4 w-4 min-h-4 min-w-4" />
          <h1 className="text-xs font-medium tracking-tight">ARQUIVOS</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-primary/10 p-0.5">
            <button
              type="button"
              onClick={() => updateFilesViewMode("list")}
              className={cn(
                "flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full text-foreground duration-300 ease-in-out",
                {
                  "bg-primary text-primary-foreground": filesViewMode === "list",
                },
              )}
              aria-label="Visualização em lista"
            >
              <LayoutList width={14} height={14} />
            </button>
            <button
              type="button"
              onClick={() => updateFilesViewMode("grid")}
              className={cn(
                "flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full text-foreground duration-300 ease-in-out",
                {
                  "bg-primary text-primary-foreground": filesViewMode === "grid",
                },
              )}
              aria-label="Visualização em grade"
            >
              <LayoutGrid width={14} height={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setFiltersMenuIsOpen((prev) => !prev)}
            className={cn(
              "flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full text-foreground duration-300 ease-in-out hover:bg-primary/20",
              {
                "bg-primary/30": filtersMenuIsOpen,
              },
            )}
            aria-label="Abrir filtros"
          >
            <BsFunnelFill size={14} />
          </button>
          <button
            type="button"
            onClick={() => setNewAttachmentMenuIsOpen((prev) => !prev)}
            className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-black duration-300 ease-in-out", {
              "bg-primary/20 hover:bg-red-300": newAttachmentMenuIsOpen,
              "bg-green-300 hover:bg-green-400": !newAttachmentMenuIsOpen,
            })}
          >
            <MdAttachFile />
            <h1 className="text-xs font-medium tracking-tight">
              {!newAttachmentMenuIsOpen ? "NOVOS ANEXOS" : "FECHAR ANEXOS"}
            </h1>
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 px-2">
        <AnimatePresence>
          {filtersMenuIsOpen ? (
            <ProjectFilesFiltersMenu
              allowedCategories={allowedCategories}
              filters={filters}
              setFilters={setFilters}
            />
          ) : null}
        </AnimatePresence>
        {newAttachmentMenuIsOpen ? (
          <NewAttachmentMenu
            partnerId={project.idParceiro || ""}
            projectId={projectId}
            projectName={project.nomeDoContrato}
            projectCode={project.codigoSVB?.toString()}
            allowedCategories={allowedCategories}
            session={session}
            closeMenu={() => setNewAttachmentMenuIsOpen(false)}
            callbacks={{
              onMutate: async () => await handleOnMutate(),
              onSettled: async () => await handleOnSettled(),
            }}
          />
        ) : null}
        <div className="flex w-full flex-col gap-1.5">
          {isLoading ? <LoadingComponent /> : null}
          {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
          {isSuccess ? (
            fileReferences.length > 0 ? (
              <div
                className={cn(
                  "w-full pb-2",
                  filesViewMode === "grid"
                    ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col items-stretch gap-1.5",
                )}
              >
                {fileReferences.map((fileReference) => (
                  <FileReferenceCard
                    key={fileReference._id}
                    info={fileReference}
                    variant={filesViewMode}
                    onDeleteCallbacks={{
                      onMutate: async () => await handleOnMutate(),
                      onSettled: async () => await handleOnSettled(),
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full py-4 text-center text-sm font-medium tracking-tight text-foreground/80">
                Nenhum anexo encontrado.
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default InfoAnexosBlock;

type ProjectFilesFiltersProps = {
  allowedCategories: string[];
  filters: TUseFileReferencesFilters;
  setFilters: React.Dispatch<React.SetStateAction<TUseFileReferencesFilters>>;
};

function ProjectFilesFiltersMenu({ allowedCategories, filters, setFilters }: ProjectFilesFiltersProps) {
  function handleCategoryChange(category: string) {
    const selectedCategoryIndex = filters.categories.indexOf(category);
    if (selectedCategoryIndex === -1) setFilters((prev) => ({ ...prev, categories: [...prev.categories, category] }));
    else setFilters((prev) => ({ ...prev, categories: prev.categories.filter((x) => x !== category) }));
  }

  return (
    <motion.div
      key="project-files-filters"
      variants={GeneralVisibleHiddenExitMotionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex w-full flex-col gap-2"
    >
      <h1 className="text-xs font-bold tracking-tight">FILTROS</h1>
      <Input
        placeholder="Pesquise pelo nome do anexo..."
        value={filters.title}
        onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
      />
      <h1 className="text-xs font-bold tracking-tight">CATEGORIAS</h1>
      <div className="flex w-full flex-wrap items-start gap-2">
        {FileReferenceCategories.filter((c) => allowedCategories.includes(c.value)).map((cat) => (
          <button
            type="button"
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={cn(
              "border-primary text-primary rounded-lg border bg-transparent px-2 py-1 text-[0.55rem] font-bold duration-300 ease-in-out lg:text-[0.6rem]",
              filters.categories.includes(cat.value) ? "bg-primary text-secondary" : "",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
