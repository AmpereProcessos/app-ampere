import React, { useState } from "react";
import { fileTypes } from "../utils/constants";
import TextInput from "./TextInput";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import axios from "axios";
function AnexoArquivo({ categorias, cliente, id, prevLinks, handleUpdates }) {
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
      if (imagem) {
        var imageRef = ref(storage, `clientes/${cliente}/${fixedNome}`);
        let res = await uploadBytes(imageRef, imagem);
        let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
        let arr = prevLinks[categoria.split(".")[1]]
          ? prevLinks[categoria.split(".")[1]]
          : [];
        arr = [
          ...arr,
          {
            title: nomeDoArquivo,
            link: url,
            category: categorias.filter((x) => x.value == categoria)[0].label,
            format: fileTypes[imagem.type]
              ? fileTypes[imagem.type].title
              : "INDEFINIDO",
          },
        ];
        await axios.post(`/api/projects/update/${id}`, {
          [`${categoria}`]: arr,
        });
        setMsg({
          text: "Imagem salva com sucesso",
          color: "text-green-500",
        });
        setNomeDoArquivo("");
        setCategoria("NÃO DEFINIDO");
        setImagem(null);
        handleUpdates(id);
      }
    } catch (error) {
      setMsg({
        text: "Houve um erro com o envio da imagem, por favor tente novamente.",
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
                {imagem?.name}
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
          onChange={(e) => setImagem(e.target.files[0])}
          className="h-full w-full opacity-0"
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
