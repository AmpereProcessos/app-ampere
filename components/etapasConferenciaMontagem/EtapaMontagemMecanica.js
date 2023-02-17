import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { setCookie } from "nookies";
import { BsFillSunFill } from "react-icons/bs";
import { fileTypes } from "../../utils/constants";
import { storage } from "../../utils/firebase";
function EtapaMontagemMecanica({ infoCliente, next, cliente }) {
  const [checkMountStage, setCheckMountStage] = useState(false);
  const [files, setFiles] = useState({});
  const [msg, setMsg] = useState({ text: "", color: "" });
  // UtilS
  function resetMsgTimeOut() {
    setTimeout(() => {
      setMsg({ text: "", color: "" });
    }, 2000);
  }

  async function uploadFiles() {
    var holder;
    var links = [];
    try {
      if (files.fotoFixacaoQDG) {
        for (let i = 0; i < files.fotoFixacaoQDG.length; i++) {
          let file = files.fotoFixacaoQDG.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoFixacaoQDG${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO FIXAÇÃO DO QDG (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotoInfraEletrica) {
        for (let i = 0; i < files.fotoInfraEletrica.length; i++) {
          let file = files.fotoInfraEletrica.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoInfraEletrica${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO/FILMAGEM INFRA ELÉTRICA (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotoPlacaGeracaoDistribuida) {
        for (let i = 0; i < files.fotoPlacaGeracaoDistribuida.length; i++) {
          let file = files.fotoPlacaGeracaoDistribuida.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoPlacaGeracaoDistribuida${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO PLACA DE GERAÇÃO DISTRIBUÍDA (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      return links;
    } catch (error) {
      setMsg({
        text: "Houve um erro na comunicação com o servidor, por favor tente novamente mais tarde.",
        color: "text-red-500",
      });
      return false;
    }
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
  // Field and files insert validation
  function validateStage() {
    if (!checkMountStage) {
      setMsg({
        text: "Por favor, preencha sobre a conferença dos procedimentos dessa etapa.",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.fotoFixacaoQDG) {
      setMsg({
        text: "Por favor, anexe foto(s) da fixação do QDG",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }

    if (infoCliente.topologia == "INVERSOR" && !files.fotoInfraEletrica) {
      setMsg({
        text: "Por favor, anexe fotos/filmagem que contemplem a infraestrutura elétrica (inversor, stringbox, conduletes e eletrodutos).",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.fotoPlacaGeracaoDistribuida) {
      setMsg({
        text: "Por favor, anexe uma foto da placa de geração distribuída.",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    setMsg({ text: "", color: "" });
    return true;
  }
  // Finish stage
  async function goNextStage() {
    if (validateStage()) {
      setMsg({ text: "Processando...", color: "text-[#15599a]" });
      let links = await uploadFiles();
      setMsg({ text: "Arquivos anexados !", color: "text-green-500" });
      await updateUser(links);
      setCookie(null, "OSClosingStage", "3");
      next();
    } else return false;
  }
  return (
    <div className="w-full flex flex-col my-2">
      <div className="flex flex-col bg-[#fead61] text-white items-center justify-between p-2">
        <h1 className="text-center font-bold w-full">
          ETAPA MONTAGEM MECÂNICA E INVERSORES
        </h1>
        <p className="text-xs font-bold text-gray-600 italic">
          (OBS: TODAS AS FOTOS DEVEM SER TIRADAS ATRAVÉS DO APLICATIVO{" "}
          <strong className="text-[#15599a]">NOTECAM</strong>.)
        </p>
      </div>
      <div className="flex flex-col gap-y-2 items-center my-2 py-2 border-y border-gray-200">
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            DETERMINAR O LOCAL JUNTO COM O CLIENTE
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            ANTES DE COMEÇAR A MONTAGEM DOS INVERSORES FAZER INSPEÇÃO VISUAL
            PARA EVITAR QUE OS EQUIPAMENTOS MOLHE OU PEGUE SOL
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            OBSERVAR SE TEM CANO DE AGUA PRÓXIMO OU REGISTRO DE AGUA, SE EXISTE
            MONTAGEM E CANOS DE FIOS OU CABOS ELÉTRICOS TAMBÉM
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            FIXAÇÃO DO INVERSOR, STRING BOX E QUADRO DE DISTRIBUIÇÃO GERAL (QDG)
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            SEGUIR O ESQUEMA DE MONTAGEM DO PROJETO
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            FIXAÇÃO DOS CONDULETES E ELETRODUTOS
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            SEMPRE OBSERVAR SE OS ELETRODUTOS E CONDULETES, INVERSORES, STRING E
            QDG ESTÃO FICANDO BEM FIXADOS
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            SEMPRE UTILIZAR O NÍVEL DE MÃO
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            CONCLUINDO A MONTAGEM FAZER INSPEÇÃO VISUAL DE TODA A MONTAGEM, PARA
            GARANTIR QUE NÃO ESTEJA FALTANDO NADA, PRINCIPALMENTE PARAFUSO DE
            BOX RETO E ADESIVOS DA AMPÉRE
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            FIXAÇÃO DA PLACA DE AVISO DE GERAÇÃO DISTRIBUÍDA
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            TIRAR UMA FOTO E MANDA-LÁ NO GRUPO DO WHATSAPP DA EQUIPE TÉCNICA,
            RELATANDO A CONCLUSÃO DA SEGUNDA ETAPA
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <label className="font-bold">CONFERÊNCIAS FEITAS ?</label>
        <input
          type={"checkbox"}
          checked={checkMountStage}
          onChange={(e) => setCheckMountStage(e.target.checked)}
        />
      </div>
      <h1 className="text-center  w-full text-[#fead61] font-bold mt-5 text-lg">
        FOTOS/FILMAGENS
      </h1>
      <div className="flex flex-wrap justify-center gap-2">
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FOTO(S) DA FIXAÇÃO/MONTAGEM DO QUADRO DE DISTRIBUIÇÃO CA (OU QUADRO
            AUXILIAR)
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotoFixacaoQDG ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotoFixacaoQDG.length == 1
                      ? files.fotoFixacaoQDG[0].name
                      : `${files.fotoFixacaoQDG[0].name}...`}
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
                  fotoFixacaoQDG: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        {infoCliente.topologia == "INVERSOR" && (
          <>
            <div className="w-fit flex flex-col items-center">
              <label className="ml-2 text-center text-[#15599a] font-bold">
                FOTOs/FILMAGEM DA INFRAESTRUTURA ELÉTRICA (INVERSOR, STRINGBOX,
                CONDULETES, ELETRODUTOS)
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotoInfraEletrica ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotoInfraEletrica.length == 1
                          ? files.fotoInfraEletrica[0].name
                          : `${files.fotoInfraEletrica[0].name}...`}
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
                      fotoInfraEletrica: e.target.files,
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  multiple={true}
                  accept=".png, .jpeg, .pdf, .mp4"
                />
              </div>
            </div>
          </>
        )}
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FOTO DA FIXAÇÃO DA PLACA DE GERAÇÃO DISTRIBUÍDA
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotoPlacaGeracaoDistribuida ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotoPlacaGeracaoDistribuida.length == 1
                      ? files.fotoPlacaGeracaoDistribuida[0].name
                      : `${files.fotoPlacaGeracaoDistribuida[0].name}...`}
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
                  fotoPlacaGeracaoDistribuida: e.target.files,
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

export default EtapaMontagemMecanica;
