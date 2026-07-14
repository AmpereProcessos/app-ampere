import React, { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import TextInput from "./inputs/Text";
import SelectInput from "./inputs/Select";

import { fileTypes, formatLongString } from "../utils/constants";
import { storage } from "../utils/services/firebase/firebase-storage";
import { BiSolidCloudDownload } from "react-icons/bi";
import { getErrorMessage } from "../utils/methods/handlers";
import { TProjectDTO } from "@/utils/schemas/projects";
import { TbAlertCircle } from "react-icons/tb";

function renderInputText(files: FileList | null) {
  if (!files)
    return (
      <p className="text-foreground mb-2 px-2 text-center text-sm dark:text-gray-400">
        <span className="font-semibold">Clique para escolher um arquivo</span> ou o arraste para a
        àrea demarcada
      </p>
    );

  const filesAsArr = Array.from(files);
  if (filesAsArr.length > 1) {
    const str = filesAsArr.map((file) => formatLongString(file.name, 15)).join(", ");
    return <p className="text-foreground mb-2 text-sm dark:text-gray-400">{str}</p>;
  }
  return <p className="text-foreground mb-2 text-sm dark:text-gray-400">{filesAsArr[0]?.name}</p>;
}

type ProjectFileAttachmentBlockProps = {
  categories: { label: string; value: string }[];
  client: string;
  project?: TProjectDTO;
  id: string;
  multiple: boolean;
};
function ProjectFileAttachmentBlock({
  categories,
  client,
  project,
  id,
  multiple = true,
}: ProjectFileAttachmentBlockProps) {
  const queryClient = useQueryClient();
  const [fileInfo, setFileInfo] = useState({
    name: "",
    category: null,
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  async function uploadFiles() {
    if (fileInfo.name.trim().length < 3) {
      return toast.error("Preencha o nome do arquivo");
    }
    if (!fileInfo.category) {
      return toast.error("Preencha a categoria do arquivo.");
    }
    if (!files) return toast.error("Anexe ao menos um arquivo.");

    var splitNome = fileInfo.name.replace("/", "").toLowerCase().split(" ");
    var fixedNome = splitNome.join("_");
    const loadingToastID = toast.loading("Enviando arquivos...");
    try {
      var linkArr = [];
      setLoading(true);
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let file = files.item(i);
          if (!file) return;
          let storageName =
            files.length > 1
              ? `clientes/${client}/${fixedNome}-{${i + 1}}`
              : `clientes/${client}/${fixedNome}`;
          var fileRef = ref(storage, storageName);
          const uploadResult = await uploadBytes(fileRef, file);
          console.log("UPLOAD RESULT", uploadResult);
          var url = await getDownloadURL(ref(storage, uploadResult.metadata.fullPath));
          let name = files.length > 1 ? `${fileInfo.name} (${i + 1})` : `${fileInfo.name}`;
          linkArr.push({
            title: name,
            link: url,
            category: categories.filter((x) => x.value == fileInfo.category)[0].label,
            format:
              uploadResult.metadata.contentType && fileTypes[uploadResult.metadata.contentType]
                ? fileTypes[uploadResult.metadata.contentType].title
                : "INDEFINIDO",
          });
        }
      }
      // Updating project files
      await axios.put(`/api/projects/update/${id}`, {
        operation: {
          $push: {
            [`${fileInfo.category}`]: {
              $each: linkArr,
            },
          },
        },
      });

      // Giving feedback on success
      toast.dismiss(loadingToastID);
      toast.success("Arquivos anexados com sucesso !");
      setFileInfo({ name: "", category: null });
      setFiles(null);
      // Invalidating projects query
      await queryClient.invalidateQueries({ queryKey: ["project-by-id", id] });
      setLoading(false);
      return;
    } catch (error) {
      setLoading(false);
      // Giving feedback on error
      toast.dismiss(loadingToastID);
      const msg = getErrorMessage(error);
      toast.error(msg);
    }
  }
  const isAttachingContract =
    fileInfo.name.toUpperCase().includes("CONTRATO ASSINADO") ||
    fileInfo.name.toUpperCase().includes("CONTRATOASSINADO");
  const isPendingProjectInitiation = !!project && !project.homologacao.dataLiberacao;
  const isPendingPurchaseAnalysisLiberation = !!project && !project.compra.liberacao;

  return (
    <div className="flex w-full flex-col gap-2 px-4">
      <div className="relative flex w-full items-center justify-center">
        <label
          htmlFor="dropzone-file"
          className="dark:hover:bg-bray-800 dark:border-primary/80 dark:hover:bg-primary/80 border-border dark:hover:border-primary/60 hover:bg-primary/20 dark:bg-primary/70 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50"
        >
          <div className="text-foreground flex flex-col items-center justify-center pt-5 pb-6">
            <BiSolidCloudDownload color={"rgb(31,41,55)"} size={50} />

            {renderInputText(files)}
          </div>
          <input
            onChange={(e) => setFiles(e.target.files)}
            multiple={multiple}
            id="dropzone-file"
            type="file"
            className="absolute h-full w-full opacity-0"
          />
        </label>
      </div>
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
        <div className="w-full lg:w-[50%]">
          <TextInput
            label="NOME DO(S) ARQUIVO(S)"
            placeholder="Preencha o nome a ser dado ao(s) arquivo(s)."
            value={fileInfo.name}
            handleChange={(value) => setFileInfo((prev) => ({ ...prev, name: value }))}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-[50%]">
          <SelectInput
            label="CATEGORIA DO(S) ARQUIVO(S)"
            value={fileInfo.category}
            options={categories.map((category, index) => ({
              value: category.value,
              label: category.label,
              id: index + 1,
            }))}
            onReset={() => setFileInfo((prev) => ({ ...prev, category: null }))}
            selectedItemLabel="NÃO DEFINIDO"
            handleChange={(value) => setFileInfo((prev) => ({ ...prev, category: value }))}
            width="100%"
          />
        </div>
      </div>
      {isAttachingContract && isPendingProjectInitiation ? (
        <div className="px my-1 flex w-full flex-col rounded-xl border border-orange-500 bg-orange-100 px-2 py-1 text-orange-500 italic">
          <div className="flex items-center justify-center gap-1">
            <TbAlertCircle />
            <p className="text-sm">LEMBRETE</p>
          </div>
          <p className="w-full text-center text-[0.65rem]">
            NOTAMOS QUE VOCÊ ESTÁ ANEXANDO O CONTRATO ASSINADO, LEMBRE-SE DE INICIAR O PROJETO, SE
            APLICÁVEL.
          </p>
        </div>
      ) : null}
      {isAttachingContract && isPendingPurchaseAnalysisLiberation ? (
        <div className="px my-1 flex w-full flex-col rounded-xl border border-yellow-500 bg-yellow-100 px-2 py-1 text-yellow-500 italic">
          <div className="flex items-center justify-center gap-1">
            <TbAlertCircle />
            <p className="text-sm">LEMBRETE</p>
          </div>
          <p className="w-full text-center text-[0.65rem]">
            NOTAMOS QUE VOCÊ ESTÁ ANEXANDO O CONTRATO ASSINADO, LEMBRE-SE DE LIBERAR O PROJETO PARA
            ANÁLISE DE COMPRA, SE APLICÁVEL.
          </p>
        </div>
      ) : null}
      <button
        disabled={loading}
        onClick={uploadFiles}
        className="disabled:bg-primary/60 w-fit self-center rounded-md border border-[#15599a] p-1 text-center font-bold text-[#15599a] duration-300 ease-in-out enabled:hover:bg-[#15599a] enabled:hover:text-white disabled:text-white"
      >
        ANEXAR
      </button>
    </div>
  );
}

export default ProjectFileAttachmentBlock;
