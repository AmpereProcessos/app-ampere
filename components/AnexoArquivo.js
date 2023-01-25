import React, { useState } from "react";
import { fileTypes } from "../utils/constants";
import TextInput from "./TextInput";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import axios from "axios";
function AnexoArquivo({
  categorias,
  cliente,
  id,
  prevLinks,
  handleUpdates,
  multiple,
}) {
  const [nomeDoArquivo, setNomeDoArquivo] = useState("");
  const [categoria, setCategoria] = useState("NÃO DEFINIDO");
  const [imagem, setImagem] = useState(null);
  const [msg, setMsg] = useState({ text: "", color: "" });
  async function anexarArquivo() {
    var splitNome = nomeDoArquivo.toLowerCase().split(" ");
    var fixedNome = splitNome.join("_");
    if (nomeDoArquivo.trim().length < 3) {
      setMsg({
        text: "Por favor, preenche um nome de arquivo válido",
        color: "text-red-500",
      });
      return;
    }
    if (categoria == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha uma categoria",
        color: "text-red-500",
      });
      return;
    }
    try {
      var arr = prevLinks[categoria.split(".")[1]]
        ? prevLinks[categoria.split(".")[1]]
        : [];
      setMsg({ text: "Enviando arquivos...", color: "text-[#15599a]" });
      if (imagem.length > 0) {
        for (let i = 0; i < imagem.length; i++) {
          let file = imagem.item(i);
          let storageName =
            imagem.length > 1
              ? `clientes/${cliente}/${fixedNome}-{${i + 1}}`
              : `clientes/${cliente}/${fixedNome}`;
          var imageRef = ref(storage, storageName);
          let res = await uploadBytes(imageRef, file).catch((err) => {
            throw "Houve um erro no envio das imagens";
          });
          var url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          let name =
            imagem.length > 1
              ? `${nomeDoArquivo} (${i + 1})`
              : `${nomeDoArquivo}`;
          arr = [
            ...arr,
            {
              title: name,
              link: url,
              category: categorias.filter((x) => x.value == categoria)[0].label,
              format: fileTypes[res.metadata.contentType]
                ? fileTypes[res.metadata.contentType].title
                : "INDEFINIDO",
            },
          ];
        }
      }
      await axios
        .post(`/api/projects/update/${id}`, {
          [`${categoria}`]: arr,
        })
        .catch((err) => {
          throw "Houve um erro no salvamento dos links.";
        });
      setMsg({
        text: "Arquivo(s) salvo(s) com sucesso",
        color: "text-green-500",
      });
      setNomeDoArquivo("");
      setCategoria("NÃO DEFINIDO");
      setImagem(null);
      handleUpdates(id, {
        title: nomeDoArquivo,
        link: url,
        category: categorias.filter((x) => x.value == categoria)[0].label,
        format: fileTypes[imagem[0].contentType]
          ? fileTypes[imagem[0].contentType].title
          : "INDEFINIDO",
      });
      return;
    } catch (error) {
      console.log("ERRO", error);
      setMsg({
        text: "TESTE",
        color: "text-red-500",
      });
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
        <div className="absolute">
          {imagem ? (
            <div className="flex flex-col items-center">
              <i className="fa fa-folder-open fa-4x text-blue-700"></i>
              <span className="block text-gray-400 font-normal text-center">
                {imagem.length == 1 ? imagem[0].name : `${imagem[0].name}...`}
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
          onChange={(e) => setImagem(e.target.files)}
          className="h-full w-full opacity-0"
          multiple={multiple != undefined ? multiple : true}
          type="file"
          accept=".png, .jpeg, .jpg, .pdf, .docx, .doc"
        />
      </div>
      <input
        value={nomeDoArquivo}
        onChange={(e) => setNomeDoArquivo(e.target.value.toUpperCase())}
        placeholder="Dê um nome para identificação do arquivo."
        className="outline-none border border-gray-200 p-2"
      />
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="p-2 outline-none border border-gray-200"
      >
        {[...categorias, { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" }].map(
          (opt, index) => (
            <option key={index} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
      {msg.text ? (
        <p className={`text-center italic ${msg.color} text-xs h-[10px]`}>
          {msg.text}
        </p>
      ) : (
        <div className="h-[10px]"></div>
      )}
      <button
        onClick={anexarArquivo}
        className="p-2 rounded bg-blue-400 hover:bg-blue-700 text-white font-bold"
      >
        ANEXAR
      </button>
    </div>
  );
}

export default AnexoArquivo;
