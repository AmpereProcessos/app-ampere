import React, { useState } from "react";
import { BsFillSunFill } from "react-icons/bs";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { setCookie } from "nookies";
import { fileTypes } from "../../utils/constants";
import { storage } from "../../utils/firebase";
function EtapaEntrada({ infoCliente, next, cliente }) {
  const [checkEnterStage, setCheckEnterStage] = useState(false);
  const [files, setFiles] = useState({});
  const [msg, setMsg] = useState({ text: "", color: "" });
  function resetMsgTimeOut() {
    setTimeout(() => {
      setMsg({ text: "", color: "" });
    }, 2000);
  }
  function validateStage() {
    if (!checkEnterStage) {
      setMsg({
        text: "Por favor, preencha a sobre a execução das conferências dessa etapa.",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.fotoConjuntoEscada) {
      setMsg({
        text: "Por favor, anexa um foto do conjunto escada (escada amarrada, cones, corrente e placa de alerta).",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    setMsg({ text: "", color: "" });
    return true;
  }
  async function updateUser(links) {
    if (links.length >= 1) {
      let { data } = await axios.put(`/api/projects/update/${infoCliente.id}`, {
        operation: {
          $push: {
            "links.montagem": {
              $each: links,
            },
          },
        },
      });
      if (data) return true;
      else
        return setMsg({
          text: "Houve um erro no servidor, por favor, tente novamente.",
          color: "text-red-500",
        });
    } else {
      return setMsg({
        text: "Houve um erro no servidor, por favor, tente novamente.",
        color: "text-red-500",
      });
    }
  }
  async function uploadFiles() {
    var holder;
    var links = [];
    try {
      if (files.fotoConjuntoEscada) {
        for (let i = 0; i < files.fotoConjuntoEscada.length; i++) {
          let file = files.fotoConjuntoEscada.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoConjuntoEscada${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO CONJUNTO ESCADA (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      return links;
    } catch (error) {
      setMsg({ text: error, color: "text-red-500" });
      return false;
    }
  }
  async function goNextStage() {
    if (validateStage()) {
      setMsg({ text: "Processando...", color: "text-[#15599a]" });
      let links = await uploadFiles();
      setMsg({ text: "Arquivos anexadas!", color: "text-green-500" });
      await updateUser(links);
      setCookie(null, `STAGE-${infoCliente.qtde}`, "1");
      next();
    }
  }
  return (
    <div className="w-full flex flex-col my-2">
      <div className="flex flex-col bg-[#fead61] text-white items-center justify-between py-2">
        <h1 className="text-center font-bold w-full">ETAPA ENTRADA NA OBRA</h1>
        <p className="text-xs font-bold text-gray-600 italic">
          (OBS: TODAS AS FOTOS DEVEM SER TIRADAS ATRAVÉS DO APLICATIVO{" "}
          <strong className="text-[#15599a]">NOTECAM</strong>.)
        </p>
      </div>
      <div className="flex flex-col gap-y-2 items-center my-2 py-2 border-y border-gray-200">
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            DESENHO DA MONTAGEM NO TELHADO EM MÃOS
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill
            className="col-span-1"
            style={{ color: "#fead61", fontSize: "25px" }}
          />
          <p className="col-span-9 font-medium">DIAGRAMA UNIFILAR EM MÃOS</p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            DESENHO DA MONTAGEM DO INVERSOR EM MÃOS
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            CONFERÊNCIA DAS FERRAMENTAS NECESSÁRIAS FEITA
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">EM POSSE DOS EPIs</p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">EM POSSE DA ESCADA</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <label className="font-bold">CONFERÊNCIAS FEITAS ?</label>
        <input
          type={"checkbox"}
          checked={checkEnterStage}
          onChange={(e) => setCheckEnterStage(e.target.checked)}
        />
      </div>
      <h1 className="text-center  w-full text-[#fead61] font-bold mt-5 text-lg">
        FOTOS/FILMAGENS
      </h1>
      <div className="flex flex-wrap justify-center gap-2">
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FOTO DO CONJUNTO ESCADA (ESCADA AMARRADA, CONES, CORRENTE E PLACA DE
            ALERTA)
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotoConjuntoEscada ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotoConjuntoEscada.length == 1
                      ? files.fotoConjuntoEscada[0].name
                      : `${files.fotoConjuntoEscada[0].name}...`}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal">
                    Adicione o arquivo aqui...
                  </span>
                </div>
              )}
            </div>
            <input
              onChange={(e) =>
                setFiles({
                  ...files,
                  fotoConjuntoEscada: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
      </div>
      {msg.text ? (
        <p className={`text-center text-xs ${msg.color} mt-2`}>{msg.text}</p>
      ) : (
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={goNextStage}
            className="border border-[#15599a] text-[#15599a] font-bold hover:text-white hover:bg-[#15599a] p-2 rounded hover:scale-105 ease-in-out duration-500"
          >
            PRÓXIMO
          </button>
        </div>
      )}
    </div>
  );
}

export default EtapaEntrada;
