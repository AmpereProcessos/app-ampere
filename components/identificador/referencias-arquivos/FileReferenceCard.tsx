import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsCalendarPlus } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { TbDownload } from "react-icons/tb";

import Avatar from "@/components/utils/Avatar";
import { isFileFormatImage } from "@/utils/constants";
import { getErrorMessage } from "@/utils/methods/handlers";
import { handleDownload } from "@/utils/methods/firebase";
import { deleteFileReference } from "@/utils/methods/mutation/crm/file-references";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { handleRenderFileIconWithClassNames } from "@/utils/methods/rendering";
import { cn } from "@/lib/utils";
import type { TFileReferenceDTO } from "@/utils/schemas/crm/file-reference.schema";

import FileReferenceImageViewerDialog from "./FileReferenceImageViewerDialog";

type FileReferenceCardProps = {
  info: TFileReferenceDTO;
  variant?: "list" | "grid";
  onDeleteCallbacks?: {
    onMutate?: () => void;
    onSuccess?: () => void;
    onSettled?: () => void;
  };
};

function useDeleteFileReference(onDeleteCallbacks?: FileReferenceCardProps["onDeleteCallbacks"]) {
  return useMutation({
    mutationKey: ["create-new-file-references"],
    mutationFn: deleteFileReference,
    onMutate: async () => {
      if (onDeleteCallbacks?.onMutate) onDeleteCallbacks.onMutate();
    },
    onSuccess: async (data) => {
      if (onDeleteCallbacks?.onSuccess) onDeleteCallbacks.onSuccess();
      return toast.success(data);
    },
    onSettled: async () => {
      if (onDeleteCallbacks?.onSettled) onDeleteCallbacks.onSettled();
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      return toast.error(msg);
    },
  });
}

function FileReferenceCategories({ categories }: { categories: string[] }) {
  if (!categories.length) return null;
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <h1 className="text-foreground/80 py-0.5 text-center text-[0.6rem] font-medium italic">CATEGORIAS</h1>
      {categories.map((category) => (
        <h1 key={category} className="bg-primary text-xxs text-secondary rounded-lg px-2 py-0.5">
          {category}
        </h1>
      ))}
    </div>
  );
}

type FileReferenceActionsProps = {
  fileId: string;
  title: string;
  url: string;
  isPending: boolean;
  onDelete: (params: { id: string }) => void;
  compact?: boolean;
};

type FileReferencePreviewProps = {
  formato: string;
  url: string;
  titulo: string;
  variant: "list" | "grid";
};

function FileReferenceFormatBadge({ formato, variant }: { formato: string; variant: "list" | "grid" }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 rounded bg-secondary px-2 py-0.5 text-[0.5rem] font-bold italic text-foreground/80",
        variant === "grid" ? "top-2 left-2" : "top-1 left-1 max-w-[calc(100%-0.5rem)] truncate",
      )}
    >
      {formato}
    </div>
  );
}

function FileReferencePreview({ formato, url, titulo, variant }: FileReferencePreviewProps) {
  const isImage = isFileFormatImage(formato);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const previewShellClassName = cn(
    "relative shrink-0 overflow-hidden bg-linear-to-b from-sky-400 to-sky-200",
    variant === "grid" ? "h-40 w-full" : "h-24 w-24 min-h-24 min-w-24 rounded-l-xl",
  );

  if (!isImage) {
    return (
      <div className={previewShellClassName}>
        <div className="absolute inset-0 flex items-center justify-center text-primary">
          {handleRenderFileIconWithClassNames(
            formato,
            variant === "grid" ? "h-8 w-8 min-h-8 min-w-8" : "h-6 w-6 min-h-6 min-w-6",
          )}
        </div>
        <FileReferenceFormatBadge formato={formato} variant={variant} />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setViewerIsOpen(true)}
        className={cn(
          previewShellClassName,
          "cursor-zoom-in transition-opacity hover:opacity-90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        )}
        aria-label={`Ampliar imagem: ${titulo}`}
      >
        <Image src={url} alt={titulo} fill className="object-cover" />
        <FileReferenceFormatBadge formato={formato} variant={variant} />
      </button>
      <FileReferenceImageViewerDialog
        open={viewerIsOpen}
        onOpenChange={setViewerIsOpen}
        imageUrl={url}
        title={titulo}
      />
    </>
  );
}

function FileReferenceActions({ fileId, title, url, isPending, onDelete, compact }: FileReferenceActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => onDelete({ id: fileId })}
        className="disabled:bg-primary/60 flex items-center gap-1 rounded-lg bg-red-600 px-2 py-1 text-[0.6rem] text-white enabled:hover:bg-red-500"
      >
        <MdDelete width={10} height={10} />
        {!compact ? <p>DELETAR</p> : null}
      </button>
      <button
        type="button"
        onClick={() => handleDownload({ fileName: title, fileUrl: url })}
        className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-[0.6rem] text-white hover:bg-blue-500"
      >
        <TbDownload width={10} height={10} />
        {!compact ? <p>BAIXAR</p> : null}
      </button>
    </div>
  );
}

function FileReferenceListCard({ info, onDeleteCallbacks }: FileReferenceCardProps) {
  const { mutate: handleDeleteFileReference, isPending } = useDeleteFileReference(onDeleteCallbacks);

  return (
    <div className="border-border bg-card flex w-full overflow-hidden rounded-xl border shadow-2xs">
      <FileReferencePreview formato={info.formato} url={info.url} titulo={info.titulo} variant="list" />
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-3 py-3">
        <div className="flex w-full items-center gap-2">
          <a
            href={info.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500"
          >
            {info.titulo}
          </a>
        </div>
        {info.categorias?.length ? <FileReferenceCategories categories={info.categorias} /> : null}
        <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <BsCalendarPlus />
              <p className="text-foreground/80 text-[0.65rem] font-medium">
                {formatDateAsLocale(info.dataInsercao, true)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Avatar
                url={info.autor.avatar_url || undefined}
                width={20}
                height={20}
                fallback={formatNameAsInitials(info.autor.nome || "")}
              />
              <p className="text-foreground/80 text-[0.65rem] font-medium">{info.autor.nome}</p>
            </div>
          </div>
          <FileReferenceActions
            fileId={info._id}
            title={info.titulo}
            url={info.url}
            isPending={isPending}
            onDelete={handleDeleteFileReference}
          />
        </div>
      </div>
    </div>
  );
}

function FileReferenceGridCard({ info, onDeleteCallbacks }: FileReferenceCardProps) {
  const { mutate: handleDeleteFileReference, isPending } = useDeleteFileReference(onDeleteCallbacks);

  return (
    <div className="border-border bg-card flex w-full flex-col overflow-hidden rounded-xl border shadow-2xs">
      <FileReferencePreview formato={info.formato} url={info.url} titulo={info.titulo} variant="grid" />
      <div className="flex flex-col gap-2 p-2">
        <a
          href={info.url}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 cursor-pointer text-sm font-bold leading-none tracking-tight duration-300 ease-in-out hover:text-cyan-500"
        >
          {info.titulo}
        </a>
        {info.categorias?.length ? (
          <div className="flex w-full flex-wrap items-center gap-2">
            {info.categorias.map((category) => (
              <h1 key={category} className="bg-primary text-xxs text-secondary rounded-lg px-2 py-0.5">
                {category}
              </h1>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-foreground/80 text-[0.65rem] font-medium">
              {formatDateAsLocale(info.dataInsercao, true)}
            </p>
          </div>
          <FileReferenceActions
            fileId={info._id}
            title={info.titulo}
            url={info.url}
            isPending={isPending}
            onDelete={handleDeleteFileReference}
            compact
          />
        </div>
      </div>
    </div>
  );
}

function FileReferenceCard({ info, variant = "list", onDeleteCallbacks }: FileReferenceCardProps) {
  if (variant === "grid") {
    return <FileReferenceGridCard info={info} onDeleteCallbacks={onDeleteCallbacks} />;
  }
  return <FileReferenceListCard info={info} onDeleteCallbacks={onDeleteCallbacks} />;
}

export default FileReferenceCard;
