import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { setCookie } from "nookies";
import { fileTypes } from "../../utils/constants";
import { storage } from "../../utils/firebase";

function EtapaLancamentoCabosConexos({ infoCliente, next, cliente }) {
  const [checkCableLayingStage, setCheckCableLayingStage] = useState(false);
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
    if (!checkCableLayingStage) {
      setMsg({
        text: "Por favor, preencha sobre a conferência de execução dos procedimentos dessa etapa",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.fotoCabeamentoLaje) {
      setMsg({
        text: "Por favor, anexe fotos/filmages do cabeamento CA lançado na laje",
        color: "text-red-500",
      });
      resetMsgTimeOut();
      return false;
    }
    if (!files.fotoConexaoSistemaRede) {
      setMsg({
        text: "Por favor, anexe foto(s) da conexão do sistema solar com a rede elétrica do cliente (no quadro, ou, se foi necessário, no ramal).",
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
      if (files.fotoCabeamentoLaje) {
        for (let i = 0; i < files.fotoCabeamentoLaje.length; i++) {
          let file = files.fotoCabeamentoLaje.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoCabeamentoLaje${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO/FILMAGEM DO CABEAMENTO CA LANÇADO (${i + 1})`,
            link: url,
            format: fileTypes[res.metadata.contentType]
              ? fileTypes[res.metadata.contentType].title
              : "INDEFINIDO",
          });
        }
      }
      if (files.fotoConexaoSistemaRede) {
        for (let i = 0; i < files.fotoConexaoSistemaRede.length; i++) {
          let file = files.fotoConexaoSistemaRede.item(i);
          var imageRef = ref(
            storage,
            `clientes/${cliente}/fotoConexaoSistemaRede${i + 1}`
          );
          let res = await uploadBytes(imageRef, file);
          let url = await getDownloadURL(ref(storage, res.metadata.fullPath));
          links.push({
            title: `FOTO/FILMAGEM CONEXÃO SISTEMA-REDE (${i + 1})`,
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
      await updateUser(links);
      setCookie(null, "OSClosingStage", "3", {
        maxAge: 60 * 60 * 5,
      });
      next();
    }
  }
  return (
    <div className="w-full flex flex-col my-2">
      <div className="flex flex-col bg-[#fead61] text-white items-center justify-between">
        <h1 className="text-center font-bold w-full">
          ETAPA LANÇAMENTO DOS CABOS CC E CA E SUAS CONEXÕES
        </h1>
        <p className="text-xs font-bold text-gray-600 italic">
          (OBS: TODAS AS FOTOS DEVEM SER TIRADAS ATRAVÉS DO APLICATIVO{" "}
          <strong className="text-[#15599a]">NOTECAM</strong>.)
        </p>
      </div>
      <ul className="text-center my-2 list-decimal list-inside py-2 border-y border-gray-200">
        <li>
          LANÇAMENTO DE CABOS, FIXAÇÃO DE ROLDANAS, ELETRODUTOS, MANGUEIRA
          HIPERFLEX E ESTICAR O CABEAMENTO
        </li>
        <li>
          APÓS CONCLUÍDO O LANÇAMENTO DOS CABOS, VEM A PARTE DE LIGAÇÃO DOS
          EQUIPAMENTOS
        </li>
        <li>
          FAZER INSPEÇÃO VISUAL DE TODAS AS CONEXÕES, CC, CA E PRINCIPALMENTE OS
          TERRAS DO INVERSOR INTERNO E EXTERNA ,STRING E DPSs SE ESTÃO FEITAS
        </li>
        <li>FAZER CONFERENCIA DOS APERTOS DE TODOS OS BORNES DE CONEXÕES</li>
        <li>
          CONEXÃO CORRETA DOS CABOS DE CORRENTE ALTERNADA E DE CORRENTE CONTINUA
          (CORES E CONECTORES)
        </li>
        <li>
          CONEXÃO DOS CABOS DE CORRENTE ALTERNADA SEMPRE NA REDE MESTRE DO
          PADRÃO
        </li>
        <li>
          CONEXÃO DOS CABOS DE CORRENTE ALTERNADA SEMPRE COM CONECTORES CORRETOS
          PARA CONEXÃO, CONECTORES DE PERFURAÇÃO OU BIMETÁLICO QUANDO HOUVER
          NECESSIDADE
        </li>
        <li>
          QUANDO USAR CONECTORES BIMETÁLICO PARA CONEXÃO COM A REDE, FAZER O
          ISOLAMENTO CORRETO, 1° ETAPA PASSAR UMA CAMADA DE FITA DE BAIXA
          TENSÃO, 2° ETAPA CAMADA DE FITA DE ALTA TENSÃO E POR ULTIMO 3° ETAPA
          CAMADA DE FITA DE BAIXA TENSÃO
        </li>
        <li>
          SEMPRE OBSERVAR SE OS CABOS NÃO SE DANIFICOU DURANTE O PROCESSO,
          DANIFICOU FAZER A SUBSTITUIÇÃO
        </li>
        <li>
          CONEXÕES DOS CABOS DE CORRENTE CONTINUA USAR CONECTORES MC4 E CHAVES
          APROPRIADAS
        </li>
        <li>
          FAZER INSPEÇÃO VISUAL SE TODAS AS CONEXÕES ESTÃO CORRETAS, SE ESTÃO
          ISOLADAS CORRETAMENTE, E SE OS CONECTORES DE PERFURAÇÃO QUEBRARAM OS
          PARAFUSOS E ISOLAR A PONTA DO CABO DE DERIVAÇÃO
        </li>
        <li>FAZER A CONEXÃO DO TERRA DOS TRILHO</li>
        <li>
          FAZER UMA INSPEÇÃO VISUAL DE TODO O PROCESSO COM A FINALIDADE DE
          VERIFICAR SE TUDO ESTA CORRETO
        </li>
        <li>
          DURANTE TODO PROCESSO DE MONTAGEM TANTO DOS MÓDULOS, LANÇAMENTO DE
          CABOS OU MONTAGEM MECÂNICA, DEIXAR CEM PORCENTO AS FERRAMENTAS
          ORGANIZADAS, NÃO DEIXAR FERRAMENTAS ESPALHAS POR TODA A CASA DO
          CLIENTE, ISSO ACONTECE MUITO
        </li>
        <li>
          AO FINAL DE TODO DIA DE OBRA FAZER LISTA DE MATERIAL PARA O DIA
          SEGUINTE
        </li>
      </ul>
      <div className="flex items-center justify-center gap-2">
        <label className="font-bold">CONFERÊNCIAS FEITAS ?</label>
        <input
          type={"checkbox"}
          checked={checkCableLayingStage}
          onChange={(e) => setCheckCableLayingStage(e.target.checked)}
        />
      </div>
      <h1 className="text-center  w-full text-[#fead61] font-bold mt-5 text-lg">
        FOTOS/FILMAGENS
      </h1>
      <div className="flex flex-wrap justify-center gap-2">
        <div className="w-fit flex flex-col items-center">
          <label className="ml-2 text-center text-[#15599a] font-bold">
            FOTOS/FILMAGEM DO CABEAMENTO LANÇADO NA LAJE (ROLDANAS FIXADAS,
            ELETRODUTOS, MANGUEIRA HIPERFLEX, ETC)
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotoCabeamentoLaje ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotoCabeamentoLaje.length == 1
                      ? files.fotoCabeamentoLaje[0].name
                      : `${files.fotoCabeamentoLaje[0].name}...`}
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
                  fotoCabeamentoLaje: e.target.files,
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
            FOTOS/FILMAGEM DA CONEXÃO DO SISTEMA COM A REDE DO CLIENTE (NO
            QUADRO OU RAMAL)
          </label>
          <div className="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
            <div className="absolute">
              {files.fotoConexaoSistemaRede ? (
                <div className="flex flex-col items-center">
                  <i className="fa fa-folder-open fa-4x text-blue-700"></i>
                  <span className="block text-gray-400 font-normal text-center">
                    {files.fotoConexaoSistemaRede.length == 1
                      ? files.fotoConexaoSistemaRede[0].name
                      : `${files.fotoConexaoSistemaRede[0].name}...`}
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
                  fotoConexaoSistemaRede: e.target.files,
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

export default EtapaLancamentoCabosConexos;
