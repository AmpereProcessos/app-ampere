import axios from "axios";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { storage } from "../../utils/firebase";
import AnexoArquivo from "../AnexoArquivo";
import FileLinkBlock from "../utils/FileLinkBlock";

function InfoArquivosBlock({ project, infoHolder, categories, handleUpdates }) {
  const [msg, setMsg] = useState({ text: "", color: "" });
  function clearMsg(time = 1500) {
    setTimeout(() => {
      setMsg({ text: "", color: "" });
    }, time);
  }

  async function deleteFile(obj, category) {
    let ableToDelete = categories.some(
      (item) => item.value == `links.${category}`
    );
    if (ableToDelete) {
      setMsg({ text: "Processando...", color: "text-[#15599a]" });
      try {
        let fileRef = ref(storage, obj.link);
        let firebaseResponse = await deleteObject(fileRef).catch((err) => {
          throw new Error("Erro ao excluir arquivo no Firebase.");
        });
        let apiResponse = await axios
          .put(`/api/projects/update/${project._id}`, {
            operation: {
              $pull: {
                [`links.${category}`]: obj,
              },
            },
          })
          .catch((err) => {
            throw new Error("Erro ao atualizar links do usuário.");
          });
        handleUpdates(project._id);
        setMsg({
          text: "Arquivo excluido e informações do cliente atualizadas.",
          color: "text-green-500",
        });
        clearMsg(2500);
      } catch (error) {
        setMsg({ text: "Erro ao excluir arquivo", color: "text-red-500" });
        clearMsg();
      }
    } else {
      setMsg({
        text: "Seu usuário não tem permissão pra exclusão de arquivos dessa categoria.",
        color: "text-red-500",
      });
      clearMsg(2500);
    }
  }
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        ARQUIVOS
      </span>
      <div className="flex flex-col items-center">
        <h1 className="text-xs text-center font-bold text-[#15599a] uppercase py-2">
          ANEXE ARQUIVOS
        </h1>
        <AnexoArquivo
          id={infoHolder._id}
          prevLinks={project.links ? project.links : {}}
          client={`${infoHolder._id}-${infoHolder.nomeDoContrato}-${infoHolder.codigoSVB}`}
          categories={categories}
          handleUpdates={handleUpdates}
        />
      </div>
      {project.links && (
        <div className="flex justify-center gap-2 gap-y-4 mt-3 flex-wrap">
          {Object.keys(project.links).map((category, index) =>
            project.links[category]?.length > 0 ? (
              <div
                key={index}
                className="flex flex-col w-full lg:w-[45%] p-1 shadow-sm"
              >
                <h1 className="font-bold text-center text-green-500">
                  {category.toUpperCase()}
                </h1>
                <div className="flex flex-col items-center gap-1">
                  {project.links[category].map((obj, index2) => (
                    <FileLinkBlock
                      key={index2}
                      obj={obj}
                      prefix={infoHolder.nomeDoContrato}
                      deleteFile={(obj) => deleteFile(obj, category)}
                    />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
      {msg.text ? (
        <p className={`text-center italic h-[20px] text-sm ${msg.color}`}>
          {msg.text}
        </p>
      ) : (
        <div className="h-[20px]"></div>
      )}
    </div>
  );
}

export default InfoArquivosBlock;
