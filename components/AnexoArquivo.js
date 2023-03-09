import React, { useState } from "react";
import { fileTypes } from "../utils/constants";
import TextInput from "./TextInput";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import axios from "axios";
function AnexoArquivo({
  categories,
  client,
  id,
  prevLinks,
  handleUpdates,
  multiple,
}) {
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState("NÃO DEFINIDO");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState({ text: "", color: "" });

  function clearMsg(time = 1500) {
    setTimeout(() => {
      setMsg({ text: "", color: "" });
    }, time);
  }
  async function uploadFiles() {
    var splitNome = fileName.toLowerCase().split(" ");
    var fixedNome = splitNome.join("_");
    if (fileName.trim().length < 3) {
      setMsg({
        text: "Por favor, preenche um nome de arquivo válido",
        color: "text-red-500",
      });
      clearMsg(2000);
      return;
    }
    if (category == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha uma categoria",
        color: "text-red-500",
      });
      clearMsg(2000);
      return;
    }
    try {
      var arr = prevLinks[category.split(".")[1]]
        ? prevLinks[category.split(".")[1]]
        : [];
      setMsg({ text: "Enviando arquivos...", color: "text-[#15599a]" });
      if (image.length > 0) {
        for (let i = 0; i < image.length; i++) {
          let file = image.item(i);
          let storageName =
            image.length > 1
              ? `clientes/${client}/${fixedNome}-{${i + 1}}`
              : `clientes/${client}/${fixedNome}`;
          var imageRef = ref(storage, storageName);
          let res = await uploadBytes(imageRef, file).catch((err) => {
            throw "Houve um erro no envio das imagens";
          });
          var url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          let name =
            image.length > 1 ? `${fileName} (${i + 1})` : `${fileName}`;
          arr = [
            ...arr,
            {
              title: name,
              link: url,
              category: categories.filter((x) => x.value == category)[0].label,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            },
          ];
        }
      }
      await axios
        .post(`/api/projects/update/${id}`, {
          [`${category}`]: arr,
        })
        .catch((err) => {
          throw "Houve um erro no salvamento dos links.";
        });
      setMsg({
        text: "Arquivo(s) salvo(s) com sucesso",
        color: "text-green-500",
      });
      clearMsg();
      setFileName("");
      setCategory("NÃO DEFINIDO");
      setImage(null);
      console.log(arr);
      handleUpdates(id, arr);
      return;
    } catch (error) {
      console.log("ERRO", error);
      setMsg({
        text: "Erro no envio das imagens.",
        color: "text-red-500",
      });
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
        <div className="absolute">
          {image ? (
            <div className="flex flex-col items-center">
              <i className="fa fa-folder-open fa-4x text-blue-700"></i>
              <span className="block text-gray-400 font-normal text-center">
                {image.length == 1 ? image[0].name : `${image[0].name}...`}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <i className="fa fa-folder-open fa-4x text-blue-700"></i>
              <span className="block text-gray-400 font-normal">
                Adicione o arquivo aqui
              </span>
            </div>
          )}
        </div>
        <input
          onChange={(e) => setImage(e.target.files)}
          className="h-full w-full opacity-0"
          multiple={multiple != undefined ? multiple : true}
          type="file"
          accept=".png, .jpeg, .jpg, .pdf, .docx, .doc"
        />
      </div>
      <input
        value={fileName}
        onChange={(e) => setFileName(e.target.value.toUpperCase())}
        placeholder="Dê um nome para identificação do arquivo."
        className="outline-none border border-gray-200 p-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 outline-none border border-gray-200"
      >
        {[...categories, { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" }].map(
          (opt, index) => (
            <option key={index} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
      {msg.text ? (
        <p className={`text-center italic ${msg.color} text-xs h-[10px] my-1`}>
          {msg.text}
        </p>
      ) : (
        <div className="h-[10px] my-1"></div>
      )}
      <button
        onClick={uploadFiles}
        className="p-2 rounded bg-blue-400 hover:bg-blue-700 text-white font-bold"
      >
        ANEXAR
      </button>
    </div>
  );
}

export default AnexoArquivo;
