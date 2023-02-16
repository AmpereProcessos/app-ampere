import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { destroyCookie, setCookie } from "nookies";
import { fileTypes } from "../../utils/constants";
import { storage } from "../../utils/firebase";

const cidadesGoias = [
  "CALDAS NOVAS", // GO
  "PORTEIRÃO", // GO
  "SÃO SIMÃO", // GO
  "INACIOLÂNDIA", // GO
  "TRINDADE", // GO
  "ITUMBIARA", // GO
  "QUIRINÓPOLIS", // GO
  "PARANAIGUARA", // GO
  "CATALÃO", // GO
];

function EtapaFinalizacao({ infoCliente, next, cliente, index }) {
  const [checkFinishingStage, setCheckFinishingStage] = useState(false);
  const [files, setFiles] = useState({});
  const [msg, setMsg] = useState({ text: "", color: "" });
  // UtilS
  function resetMsgTimeOut() {
    setTimeout(() => {
      setMsg({ text: "", color: "" });
    }, 2000);
  }
  // Validating Fields
  function validateStage() {
    if (!checkFinishingStage) {
      setMsg({
        text: "Por favor, preencha sobre a conferência de execução dos procedimentos dessa etapa",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.filmagemTesteAguaDoTelhado) {
      setMsg({
        text: "Por favor, anexe a filmagem do teste de água (visto do telhado).",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.filmagemPosTesteAguaNaLaje) {
      setMsg({
        text: "Por favor, anexe a filmagem do teste de água (visto da laje).",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.fotoDataloggerPosConfig) {
      setMsg({
        text: "Por favor, anexe foto(s) do datalogger/dtu/antena pós configuração.",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (cidadesGoias.includes(infoCliente.cidade)) {
      if (!files.fotoMedicoesStrings) {
        setMsg({
          text: "Por favor, anexe foto(s) das medições de corrente e tensão CC de todas as strings.",
          color: "text-red-500",
        });
        resetMsgTimeOut();
        return false;
      }
      if (!files.fotoMedicoesCAEntrada) {
        setMsg({
          text: "Por favor, anexe foto(s) das medições de tensão CA fase e linha na entrada de energia.",
          color: "text-red-500",
        });
        resetMsgTimeOut();
        return false;
      }
      if (!files.fotoMedicoesCADisjuntorAntes) {
        setMsg({
          text: "Por favor, anexe foto(s) das medições de tensão CA fase e linha no quadro antes do disjuntor.",
          color: "text-red-500",
        });
        resetMsgTimeOut();
        return false;
      }
      if (!files.fotoMedicoesCADisjuntorDepois) {
        setMsg({
          text: "Por favor, anexe foto(s) das medições de tensão CA fase e linha no quadro depois do disjuntor.",
          color: "text-red-500",
        });
        resetMsgTimeOut();
        return false;
      }
    }

    setMsg({ text: "", color: "" });
    return true;
  }

  async function uploadFiles() {
    var holder;
    var links = [];
    try {
      if (files.filmagemTesteAguaDoTelhado) {
        for (let i = 0; i < files.filmagemTesteAguaDoTelhado.length; i++) {
          let file = files.filmagemTesteAguaDoTelhado.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/filmagemTesteAguaDoTelhado${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FILMAGEM TESTE DA ÁGUA (VISTO DO TELHADO) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.filmagemPosTesteAguaNaLaje) {
        for (let i = 0; i < files.filmagemPosTesteAguaNaLaje.length; i++) {
          let file = files.filmagemPosTesteAguaNaLaje.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/filmagemPosTesteAguaNaLaje${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FILMAGEM PÓS TESTE DA ÁGUA (VISTO Da LAJE) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotoDataloggerPosConfig) {
        for (let i = 0; i < files.fotoDataloggerPosConfig.length; i++) {
          let file = files.fotoDataloggerPosConfig.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoDataloggerPosConfig${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO/FILMAGEM DO DATALOGGER PÓS-CONFIG (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotoMedicoesStrings) {
        for (let i = 0; i < files.fotoMedicoesStrings.length; i++) {
          let file = files.fotoMedicoesStrings.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoMedicoesStrings${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTOS MEDIÇÕES DE TENSÃO E CORRENTE - STRING (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotoMedicoesCAEntrada) {
        for (let i = 0; i < files.fotoMedicoesCAEntrada.length; i++) {
          let file = files.fotoMedicoesCAEntrada.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoMedicoesCAEntrada${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTOS MEDIÇÕES TENSÃO CA FASE E LINHA (ENTRADA) (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotoMedicoesCADisjuntorAntes) {
        for (let i = 0; i < files.fotoMedicoesCADisjuntorAntes.length; i++) {
          let file = files.fotoMedicoesCADisjuntorAntes.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoMedicoesCADisjuntorAntes${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTOS MEDIÇÕES TENSÃO CA FASE E LINHA (ANTES DO DISJUNTOR) (${
              i + 1
            })`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotoMedicoesCADisjuntorDepois) {
        for (let i = 0; i < files.fotoMedicoesCADisjuntorDepois.length; i++) {
          let file = files.fotoMedicoesCADisjuntorDepois.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoMedicoesCADisjuntorDepois${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTOS MEDIÇÕES TENSÃO CA FASE E LINHA (DEPOIS DO DISJUNTOR) (${
              i + 1
            })`,
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
      resetMsgTimeOut();
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
      let { data2 } = await axios.put(
        `/api/projects/update/${infoCliente.id}`,
        {
          operation: {
            $set: {
              [`ordensDeServico.${index}.conferencias.etapaTelhado`]: true,
              [`ordensDeServico.${index}.conferencias.etapaMontagemMecanica`]: true,
              [`ordensDeServico.${index}.conferencias.etapaCabeamento`]: true,
              [`ordensDeServico.${index}.conferencias.etapaFinalizacao`]: true,
            },
          },
        }
      );
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
  async function finishOS() {
    if (validateStage()) {
      setMsg({ text: "Processando...", color: "text-[#15599a]" });
      let links = await uploadFiles();
      await updateUser(links);
      setMsg({
        text: "Fechamento de Ordem De Serviço concluído !",
        color: "text-green-500",
      });
      destroyCookie(null, "OSClosingStage");
    }
  }
  return (
    <div className="w-full flex flex-col my-2">
      <div className="flex flex-col bg-[#fead61] text-white items-center justify-between py-1 rounded-sm">
        <h1 className="text-center font-bold w-full">
          ETAPA FINALIZAÇÃO DE OBRA
        </h1>
        <h1 className="text-xs font-bold text-gray-600 text-center">
          (OBS: TODAS AS FOTOS DEVEM SER TIRADAS ATRAVÉS DO APLICATIVO{" "}
          <strong className="text-[#15599a]">NOTECAM</strong>.)
        </h1>
      </div>
      <ul className="space-y-4 text-gray-500 list-disc list-inside dark:text-gray-400 w-full lg:w-[50%] self-center">
        <li>
          ANTES DE DESCER DO TELHADO
          <ol className="pl-5 mt-2 space-y-1 list-decimal list-inside">
            <li>CONFERIR SE RETIROU TODA A SOBRA DE MATERIAIS</li>
            <li>
              ANTES DE DESCER DO TELHADO CONFERIR SE RETIROU TODAS AS
              FERRAMENTAS
            </li>
            <li>ANTES DE DESCER DO TELHADO CONFERIR SE RETIROU TODO O LIXO</li>
            <li>
              ANTES DE DESCER DO TELHADO RETIRAR TODAS AS TELHAS QUEBRADAS
            </li>
            <li>
              ANTES DE DESCER DO TELHADO CONFERIR SE NÃO FICOU TELHAS ABERTAS
            </li>
            <li>
              ANTES DE DESCER DO TELHADO FAZER INSPEÇÃO VISUAL SE TUDO ESTA
              CORRETO
            </li>
            <li>ANTES DE SAIR DA LAJE</li>
            <li>CONFERIR SE RETIROU TODA A SOBRA DE MATERIAIS</li>
            <li>CONFERIR SE RETIROU TODAS AS FERRAMENTAS</li>
            <li>CONFERIR SE TODO O LIXO DA "AMPÉRE"' FOI RETIRADO</li>
            <li>FAZER INSPEÇÃO VISUAL SE TUDO ESTA CORRETO</li>
          </ol>
        </li>
        <li>
          LOCAL DOS INVERSORES
          <ul className="pl-5 mt-2 space-y-1 list-decimal list-inside">
            <li>
              CONFERIR SE TODA A SOBRA DE MATERIAL FORAM RETIRADAS DO LOCAL DE
              MONTAGEM DOS INVERSORES
            </li>
            <li>
              CONFERIR SE TODAS AS FERRAMENTAS FORAM RETIRADAS DO LOCAL DA
              INSTALAÇÃO DOS INVERSORES
            </li>
            <li>
              CONFERIR SE TODO O LIXO FOI RETIRADO DO LOCAL DA INSTALAÇÃO DOS
              INVERSORES
            </li>
            <li>
              NO TÉRMINO DA MONTAGEM DOS INVERSORES, LAVAR AS MÃOS E PANOS DE
              LIMPEZA E REALIZAR A HIGIENIZAÇÃO DOS INVERSORES, QDG, STRING,
              CANOS E CONDULETES
            </li>
            <li>
              FAZER INSPEÇÃO VISUAL NO LOCAL DA MONTAGEM DOS INVERSORES SE ESTA
              TUDO CORRETO, LEMBRE-SE QUE A MONTAGEM DOS INVERSORES SÃO A
              VITRINE DA AMPÉRE
            </li>
          </ul>
        </li>
        <li>
          CASA DO CLIENTE GERAL
          <ul className="pl-5 mt-2 space-y-1 list-decimal list-inside">
            <li>
              CERTIFICAR-SE QUE TODOS OS LIXOS DE TODAS AS ETAPAS FORAM
              RETIRADOS E DESCARTADOS NOS SEUS DEVIDOS LUGARES
            </li>
            <li>CONFERIR SE PLACA DE GERAÇÃO FOI INSTALADA</li>
            <li>
              ANTES DE SAIR DA CASA DO CLIENTE FAZER UMA ULTIMA INSPEÇÃO VISUAL
              PRA VERIFICAR SE TUDO ESTÁ CORRETO
            </li>
            <li>
              ANTES DE SAIR DA CASA DO CLIENTE PERGUNTAR SE ESTA TUDO CORRETO OU
              SE PODEMOS FAZER MAIS ALGUMA COISA POR ELE
            </li>
            <li>
              DESPEDIR-SE DO CLIENTE E FALAR PRA ELE QUE O ENGENHEIRO
              RESPONSÁVEL VAI FAZER UMA INSPEÇÃO E CONFIGURAÇÕES E AJUSTES
              FINAIS SE HOUVER NECESSIDADE
            </li>
          </ul>
        </li>
      </ul>
      <div className="flex items-center justify-center gap-2">
        <label className="font-bold">CONFERÊNCIAS FEITAS ?</label>
        <input
          type={"checkbox"}
          checked={checkFinishingStage}
          onChange={(e) => setCheckFinishingStage(e.target.checked)}
        />
      </div>
      <h1 className="text-center  w-full text-[#fead61] font-bold mt-5 text-lg">
        FOTOS/FILMAGENS
      </h1>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FILMAGEM DO TESTE DE ÁGUA (VISTO DO TELHADO)
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.filmagemTesteAguaDoTelhado ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.filmagemTesteAguaDoTelhado.length == 1
                      ? files.filmagemTesteAguaDoTelhado[0].name
                      : `${files.filmagemTesteAguaDoTelhado[0].name}...`}
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
                  filmagemTesteAguaDoTelhado: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .mp4"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FILMAGEM DO PÓS TESTE DE ÁGUA (VISTO DA LAJE)
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.filmagemPosTesteAguaNaLaje ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.filmagemPosTesteAguaNaLaje.length == 1
                      ? files.filmagemPosTesteAguaNaLaje[0].name
                      : `${files.filmagemPosTesteAguaNaLaje[0].name}...`}
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
                  filmagemPosTesteAguaNaLaje: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .mp4"
            />
          </div>
        </div>
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FOTO/FILMAGEM DA ANTENA/DATALOGGER/DTU PÓS-CONFIGURAÇÃO
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotoDataloggerPosConfig ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotoDataloggerPosConfig.length == 1
                      ? files.fotoDataloggerPosConfig[0].name
                      : `${files.fotoDataloggerPosConfig[0].name}...`}
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
                  fotoDataloggerPosConfig: e.target.files,
                })
              }
              className="h-full w-full opacity-0"
              type="file"
              multiple={true}
              accept=".png, .jpeg, .mp4"
            />
          </div>
        </div>
        {!cidadesGoias.includes(infoCliente.cidade) && (
          <>
            <div className="w-fit flex flex-col items-center">
              <label className="ml-2 text-center text-[#15599a] font-bold">
                FOTO DAS MEDIÇÕES DE CORRENTE E TENSÃO CC DE TODAS AS STRINGS
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotoMedicoesStrings ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotoMedicoesStrings.length == 1
                          ? files.fotoMedicoesStrings[0].name
                          : `${files.fotoMedicoesStrings[0].name}...`}
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
                      fotoMedicoesStrings: e.target.files,
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  multiple={true}
                  accept=".png, .jpeg, .mp4"
                />
              </div>
            </div>
            <div className="w-fit flex flex-col items-center">
              <label className="ml-2 text-center text-[#15599a] font-bold">
                FOTOS DE TENSÃO CA FASE E LINHA NA ENTRADA DE ENERGIA
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotoMedicoesCAEntrada ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotoMedicoesCAEntrada.length == 1
                          ? files.fotoMedicoesCAEntrada[0].name
                          : `${files.fotoMedicoesCAEntrada[0].name}...`}
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
                      fotoMedicoesCAEntrada: e.target.files,
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  multiple={true}
                  accept=".png, .jpeg, .mp4"
                />
              </div>
            </div>
            <div className="w-fit flex flex-col items-center">
              <label className="ml-2 text-center text-[#15599a] font-bold">
                FOTOS DE TENSÃO CA FASE E LINHA NO QUADRO CA ANTES DO DISJUNTOR
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotoMedicoesCADisjuntorAntes ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotoMedicoesCADisjuntorAntes.length == 1
                          ? files.fotoMedicoesCADisjuntorAntes[0].name
                          : `${files.fotoMedicoesCADisjuntorAntes[0].name}...`}
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
                      fotoMedicoesCADisjuntorAntes: e.target.files,
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  multiple={true}
                  accept=".png, .jpeg, .mp4"
                />
              </div>
            </div>
            <div className="w-fit flex flex-col items-center">
              <label className="ml-2 text-center text-[#15599a] font-bold">
                FOTOS DE TENSÃO CA FASE E LINHA NO QUADRO CA DEPOIS DO DISJUNTOR
              </label>
              <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
                <div className="absolute">
                  {files.fotoMedicoesCADisjuntorDepois ? (
                    <div className="flex flex-col items-center">
                      <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                      <span className="block text-gray-400 font-normal text-center">
                        {files.fotoMedicoesCADisjuntorDepois.length == 1
                          ? files.fotoMedicoesCADisjuntorDepois[0].name
                          : `${files.fotoMedicoesCADisjuntorDepois[0].name}...`}
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
                      fotoMedicoesCADisjuntorDepois: e.target.files,
                    })
                  }
                  className="h-full w-full opacity-0"
                  type="file"
                  multiple={true}
                  accept=".png, .jpeg, .mp4"
                />
              </div>
            </div>
          </>
        )}
      </div>
      {msg.text ? (
        <p className={`text-center text-xs ${msg.color} mt-2`}>{msg.text}</p>
      ) : (
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={finishOS}
            className="border border-[#15599a] text-[#15599a] font-bold hover:text-white hover:bg-[#15599a] p-2 rounded hover:scale-105 ease-in-out duration-500"
          >
            FINALIZAR OS
          </button>
        </div>
      )}
    </div>
  );
}

export default EtapaFinalizacao;
