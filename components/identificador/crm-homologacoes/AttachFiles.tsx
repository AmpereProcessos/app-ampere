import DocumentFileInput from "@/components/inputs/DocumentFileInput";
import TextInput from "@/components/inputs/Text";
import { useFileReferencesByOpportunityId } from "@/utils/methods/query/crm/file-references";
import type { TFileHolder } from "@/utils/schemas/crm/file-reference.schema";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiFillFile } from "react-icons/ai";

type AttachFilesProps = {
  opportunityId: string | null;
  files: TFileHolder;
  setFiles: React.Dispatch<React.SetStateAction<TFileHolder>>;
};
function AttachFiles({ opportunityId, files, setFiles }: AttachFilesProps) {
  const { data: fileReferences } = useFileReferencesByOpportunityId({
    opportunityId: opportunityId || null,
  });
  const [personalizedFile, setPersonalizedFile] = useState<{
    titulo: string;
    arquivo: File | string | null;
  }>({
    titulo: "",
    arquivo: null,
  });
  function addFile({ titulo, arquivo }: { titulo: string; arquivo: File | string | null }) {
    if (titulo.trim().length < 3)
      return toast.error("Preencha um título de ao menos 3 caractéres.");
    if (!arquivo) return toast.error("Vincule o arquivo a ser anexado.");
    const fileTitle = titulo.toUpperCase();
    setFiles((prev) => ({ ...prev, [fileTitle]: arquivo }));
    return setPersonalizedFile({ titulo: "", arquivo: null });
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="bg-primary/80 w-full rounded p-1 text-center font-bold text-white">
        ARQUIVOS
      </h1>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <div className="w-full lg:w-1/2">
          <DocumentFileInput
            label="ARQUIVO"
            value={personalizedFile.arquivo}
            handleChange={(value) => setPersonalizedFile((prev) => ({ ...prev, arquivo: value }))}
            fileReferences={fileReferences || []}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <TextInput
            label="TITULO DO ARQUIVO"
            placeholder="Digite o nome a ser dado ao arquivo..."
            value={personalizedFile.titulo}
            handleChange={(value) => setPersonalizedFile((prev) => ({ ...prev, titulo: value }))}
            width="100%"
          />
        </div>
        <button
          onClick={() => addFile(personalizedFile)}
          className="hover:bg-primary/70 rounded bg-black p-1 px-4 text-sm font-medium text-white duration-300 ease-in-out"
        >
          ADICIONAR ARQUIVO
        </button>
      </div>
      <h1 className="font-raleway mb-2 text-start leading-none font-bold tracking-tight">
        ARQUIVOS A SEREM ANEXADOS
      </h1>
      <div className="flex w-full flex-wrap items-center justify-around gap-2">
        {Object.entries(files).length > 0 ? (
          Object.entries(files).map(([key, value], index) => (
            <div
              key={index}
              className="flex w-full flex-col rounded-md border border-cyan-500 p-3 lg:w-[350px]"
            >
              <div className="flex w-full items-center gap-2">
                <div className="text-lg text-black">
                  <AiFillFile />
                </div>
                <p className="text-foreground text-sm leading-none font-bold tracking-tight">
                  {key}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-foreground flex w-full grow items-center justify-center py-2 text-center font-medium tracking-tight italic">
            Nenhum arquivo anexado...
          </p>
        )}
      </div>
    </div>
  );
}

export default AttachFiles;
