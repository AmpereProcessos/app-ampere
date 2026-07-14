import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generalFirebaseUpload } from "@/utils/methods/uploading";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "react-hot-toast";

type PdfDropzoneProps = {
  uploadPath: string;
  value: { url: string; nomeOriginal: string } | null;
  onChange: (value: { url: string; nomeOriginal: string } | null) => void;
  disabled?: boolean;
};

const ACCEPTED_MIME = "application/pdf";

export default function PdfDropzone({ uploadPath, value, onChange, disabled }: PdfDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.type !== ACCEPTED_MIME) {
        toast.error("Apenas arquivos PDF são aceitos.");
        return;
      }
      try {
        setIsUploading(true);
        const { url } = await generalFirebaseUpload({ file, path: uploadPath });
        onChange({ url, nomeOriginal: file.name });
        toast.success("PDF enviado com sucesso.");
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível enviar o PDF. Tente novamente.");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, uploadPath],
  );

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    void uploadFile(fileList[0]);
  }

  if (value) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{value.nomeOriginal}</span>
              <a
                href={value.url}
                target="_blank"
                rel="noreferrer"
                className="text-[0.65rem] text-muted-foreground underline"
              >
                Abrir PDF em nova aba
              </a>
            </div>
          </div>
          {!disabled ? (
            <Button
              type="button"
              size="xs"
              variant="ghost"
              className="flex items-center gap-1"
              onClick={() => onChange(null)}
            >
              <X className="h-4 w-4" />
              REMOVER
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (disabled || isUploading) return;
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled || isUploading) return;
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card px-6 py-10 text-center transition",
        isDragging && "border-primary bg-primary/5",
        (disabled || isUploading) && "opacity-60",
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {isUploading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <UploadCloud className="h-6 w-6" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">
          {isUploading
            ? "Enviando PDF..."
            : "Arraste o extrato bancário (PDF) ou clique para selecionar"}
        </span>
        <span className="text-[0.65rem] text-muted-foreground">
          Tamanho máximo recomendado: 5 MB.
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={disabled || isUploading}
        onClick={() => inputRef.current?.click()}
      >
        SELECIONAR PDF
      </Button>
    </div>
  );
}
