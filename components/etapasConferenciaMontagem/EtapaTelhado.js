import React, { useState } from "react";
import { BsFillSunFill } from "react-icons/bs";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { setCookie } from "nookies";
import { fileTypes } from "../../utils/constants";
import { storage } from "../../utils/firebase";
function EtapaTelhado({ infoCliente, next, cliente }) {
  const [checkRoofStage, setCheckRoofStage] = useState(false);
  const [files, setFiles] = useState({});
  const [msg, setMsg] = useState({ text: "", color: "" });
  function resetMsgTimeOut() {
    setTimeout(() => {
      setMsg({ text: "", color: "" });
    }, 2000);
  }
  function validateStage() {
    if (!checkRoofStage) {
      setMsg({
        text: "Por favor, preencha a sobre a execução das conferências.",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.fotoEtiquetaModulos) {
      setMsg({
        text: "Por favor, anexe as fotos das etiquetas dos módulos",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.fotoEtiquetaInversores) {
      setMsg({
        text: "Por favor, anexe foto(s) das etiquetas dos micros/inversores",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.filmagemTelhadoPorCima) {
      setMsg({
        text: "Por favor, anexe uma filmagem do telhado por cima.",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.filmagemTelhadoPorBaixo) {
      setMsg({
        text: "Por favor, anexe uma filmagem do telhado mostrando a parte de baixo",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.fotosTrilhosMontados) {
      setMsg({
        text: "Por favor, anexe fotos dos trilhos montados",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    {
    }
    if (infoCliente.topologia == "MICRO" && !files.fotosInversoresAlocados) {
      setMsg({
        text: "Por favor, anexe foto(s) ou filmagem dos micros instalados.",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (infoCliente.topologia == "MICRO" && !files.fotosConexoesMicros) {
      setMsg({
        text: "Por favor, anexe fotos das conexões dos micros instalados.",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.fotosPaineisInstalados) {
      setMsg({
        text: "Por favor, anexe foto(s) ou filmagem dos painéis instalados.",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    setMsg({ text: "", color: "" });
    return true;
  }
  async function uploadFiles() {
    var holder;
    var links = [];
    try {
      if (files.fotoEtiquetaModulos) {
        for (let i = 0; i < files.fotoEtiquetaModulos.length; i++) {
          let file = files.fotoEtiquetaModulos.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoEtiquetaModulos${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO ETIQUETA DO MÓDULO (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotoEtiquetaInversores) {
        for (let i = 0; i < files.fotoEtiquetaInversores.length; i++) {
          let file = files.fotoEtiquetaInversores.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoEtiquetaInversores${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO ETIQUETA DO INVERSOR (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.filmagemTelhadoPorCima) {
        for (let i = 0; i < files.filmagemTelhadoPorCima.length; i++) {
          let file = files.filmagemTelhadoPorCima.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/filmagemTelhadoPorCima${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FILMAGEM DO TELHADO (POR CIMA) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.filmagemTelhadoPorBaixo) {
        for (let i = 0; i < files.filmagemTelhadoPorBaixo.length; i++) {
          let file = files.filmagemTelhadoPorBaixo.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/filmagemTelhadoPorBaixo${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FILMAGEM DO TELHADO (POR BAIXO) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotosTrilhosMontados) {
        for (let i = 0; i < files.fotosTrilhosMontados.length; i++) {
          let file = files.fotosTrilhosMontados.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotosTrilhosMontados${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO DOS TRILHOS MONTADOS (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotosInversoresAlocados) {
        for (let i = 0; i < files.fotosInversoresAlocados.length; i++) {
          let file = files.fotosInversoresAlocados.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotosInversoresAlocados${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO DOS MICROS/INVERSORES FIXADOS (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotosConexoesMicros) {
        for (let i = 0; i < files.fotosConexoesMicros.length; i++) {
          let file = files.fotosConexoesMicros.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotosConexoesMicros${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO DAS CONEXÕES DOS MICROS (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotosPaineisInstalados) {
        for (let i = 0; i < files.fotosPaineisInstalados.length; i++) {
          let file = files.fotosPaineisInstalados.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotosPaineisInstalados${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO DOS PAINÉIS INSTALADOS (${i + 1})`,
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
  async function goNextStage() {
    if (validateStage()) {
      setMsg({ text: "Processando...", color: "text-[#15599a]" });
      let links = await uploadFiles();
      setMsg({ text: "Arquivos anexadas!", color: "text-green-500" });
      await updateUser(links);
      setCookie(null, `STAGE-${infoCliente.qtde}`, "2");
      next();
    } else return;
  }
  console.log(infoCliente);
  return (
    <div className="w-full flex flex-col my-2">
      <div className="flex flex-col bg-[#fead61] text-white items-center justify-between p-2">
        <h1 className="text-center font-bold w-full">ETAPA TELHADO</h1>
        <p className="text-xs font-bold text-gray-600 italic">
          (OBS: TODAS AS FOTOS DEVEM SER TIRADAS ATRAVÉS DO APLICATIVO{" "}
          <strong className="text-[#15599a]">NOTECAM</strong>.)
        </p>
      </div>
      <div className="flex flex-col gap-y-2 items-center my-2 py-2 border-y border-gray-200">
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            FIXAÇÃO DOS SUPORTES COM APERTO DE TODOS OS PARAFUSOS E CONFERIR
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            FIXAÇÃO DOS TRILHOS COM APERTO DE TODOS OS PARAFUSOS E CONFERIR
            TELHAS ALTAS E ONDAS BAIXAS
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            FIXAÇÃO DA MANTA ASFÁLTICA (PICHE) NAS SAÍDAS DOS GANCHOS, TELHAS
            ALTAS E ONDAS BAIXAS
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            FAZER ATERRAMENTO DE TODOS OS TRILHOS E COLOCAR AS PONTAS DOS TERRAS
            PRA DENTRO DA LAJE
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            FIXAÇÃO DOS MICROS INVERSORES E ATERRAR OS MESMOS
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            VERIFICAR SE TODAS AS CONEXÕES DE CORRENTE ALTERANADA DOS MICROS
            ESTEJAM ESTANHADAS E ISOLADAS CORRETAMENTE
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            VERIFICAR SE OS TAPÕES FORAM COLOCADOS NO FINAL DOS MICROS
            INVERSORES
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            ANTES DA MONTAGEM DOS MÓDULOS FAZER INSPEÇÃO VISUAL SE ESTÁ TUDO
            CORRETO E CONFERIR SE TEM TELHAS QUEBRADAS
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            DURANTE A FIXAÇÃO DOS MÓDULOS FAZER CONFERÊNCIA SE OS MÓDULOS ESTÃO
            SENDO CONECTADOS CORRETAMENTE TANTO EM SÉRIE OU NOS MICROS
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            FURANTE A FIXAÇÃO DOS MÓDULOS FAZER OUTRA INSPEÇÃO VISUAL MÓDULO A
            MÓDULO COM O INTUITO DE RETIRAR TELHAS QUEBRADAS
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            DURANTE TODA A MONTAGEM NO TELHADO LEVAR SACOLAS PARA IR ARMAZENANDO
            O LIXO QUE APARECE DURANTE O PROCESSO. (LIXO EM RUFOS E CALHAS, LIXO
            EM SAÍDAS DE ÁGUA, ABRAÇADEIRAS DESCARTADAS)
          </p>
        </div>
        <div className="grid grid-cols-10 gap-2 w-full lg:w-[60%]">
          <BsFillSunFill style={{ color: "#fead61", fontSize: "25px" }} />
          <p className="col-span-9 font-medium">
            TIRAR UM FOTO E MANDA-LÁ NO GRUPO DO WHATSAPP DA EQUIPE TÉCNICA,
            RELATANDO CONCLUSÃO DA PRIMEIRA ETAPA.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <label className="font-bold">CONFERÊNCIAS FEITAS ?</label>
        <input
          type={"checkbox"}
          checked={checkRoofStage}
          onChange={(e) => setCheckRoofStage(e.target.checked)}
        />
      </div>
      <h1 className="text-center  w-full text-[#fead61] font-bold mt-5 text-lg">
        FOTOS/FILMAGENS
      </h1>
      <div className="flex flex-wrap justify-center gap-2">
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FOTO(S) DAS ETIQUETAS DOS MÓDULOS
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotoEtiquetaModulos ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotoEtiquetaModulos.length == 1
                      ? files.fotoEtiquetaModulos[0].name
                      : `${files.fotoEtiquetaModulos[0].name}...`}
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
                  fotoEtiquetaModulos: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FOTO(S) DAS ETIQUETAS DOS INVERSORES
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotoEtiquetaInversores ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotoEtiquetaInversores.length == 1
                      ? files.fotoEtiquetaInversores[0].name
                      : `${files.fotoEtiquetaInversores[0].name}...`}
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
                  fotoEtiquetaInversores: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FILMAGEM DE TODO O TELHADO (POR CIMA)
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.filmagemTelhadoPorCima ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.filmagemTelhadoPorCima.length == 1
                      ? files.filmagemTelhadoPorCima[0].name
                      : `${files.filmagemTelhadoPorCima[0].name}...`}
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
                  filmagemTelhadoPorCima: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".mp4"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FILMAGEM DE TODO O TELHADO (POR BAIXO)
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.filmagemTelhadoPorBaixo ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.filmagemTelhadoPorBaixo.length == 1
                      ? files.filmagemTelhadoPorBaixo[0].name
                      : `${files.filmagemTelhadoPorBaixo[0].name}...`}
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
                  filmagemTelhadoPorBaixo: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".mp4"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FOTO(S) DOS TRILHOS MONTADOS
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotosTrilhosMontados ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotosTrilhosMontados.length == 1
                      ? files.fotosTrilhosMontados[0].name
                      : `${files.fotosTrilhosMontados[0].name}...`}
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
                  fotosTrilhosMontados: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .pdf"
            />
          </div>
        </div>
        {infoCliente.topologia == "MICRO" && (
          <>
            <div className="w-fit flex flex-col items-center">
              <label className="ml-2 text-center text-[#15599a] font-bold">
                FOTO(S)/FILMAGEM DOS MICROS/INVERSORES INSTALADOS
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotosInversoresAlocados ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotosInversoresAlocados.length == 1
                          ? files.fotosInversoresAlocados[0].name
                          : `${files.fotosInversoresAlocados[0].name}...`}
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
                      fotosInversoresAlocados: e.target.files,
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  multiple={true}
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
            <div className="w-fit flex flex-col items-center">
              <label className="ml-2 text-center text-[#15599a] font-bold">
                FOTO(S) DAS CONEXÕES DOS MICROS
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotosConexoesMicros ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotosConexoesMicros.length == 1
                          ? files.fotosConexoesMicros[0].name
                          : `${files.fotosConexoesMicros[0].name}...`}
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
                      fotosConexoesMicros: e.target.files,
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  multiple={true}
                  accept=".png, .jpeg, .pdf"
                />
              </div>
            </div>
          </>
        )}

        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FOTOS DOS PAINÉIS INSTALADOS
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotosPaineisInstalados ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotosPaineisInstalados.length == 1
                      ? files.fotosPaineisInstalados[0].name
                      : `${files.fotosPaineisInstalados[0].name}...`}
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
                  fotosPaineisInstalados: e.target.files,
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

export default EtapaTelhado;
