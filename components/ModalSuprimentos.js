import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  vendedores,
  statusLiberacao,
  credores,
  fornecedores,
} from "../utils/constants";
import { FaSave } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NotificationCreationBlock from "./NotificationCreationBlock";
import NumberInput from "./NumberInput";
import dayjs from "dayjs";
import AnexoArquivo from "./AnexoArquivo";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import { useKey } from "../utils/hooks";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoEstruturaBlock from "./blocosInfoProjeto/InfoEstruturaBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";
import InfoVisitaTecnicaBlock from "./blocosInfoProjeto/InfoVisitaTecnicaBlock";
import InfoClienteBlock from "./blocosInfoProjeto/InfoClienteBlock";
import InfoPagamentoBlock from "./blocosInfoProjeto/InfoPagamentoBlock";
const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#fff",
  width: "93%",
  height: "98%",
  borderRadius: "10px",
  padding: "10px",
  zIndex: 1000,
};
const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 1000,
};
function formataCPF(cpf) {
  //retira os caracteres indesejados...
  cpf = cpf.replace(/[^\d]/g, "");
  //realizar a formatação...
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function formataCEP(cep) {
  cep = cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");

  return cep;
}
function ModalSuprimentos({
  setModalIsOpen,
  modalIsOpen,
  project,
  editor,
  ppsEditor,
  handleUpdates,
  credentials,
}) {
  useKey("Escape", () => setModalIsOpen(false));

  const [infoHolder, setInfo] = useState(project);
  const [infoVisita, setInfoVisita] = useState({});
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({ text: "", color: "" });
  async function handleChanges() {
    if (validateChanges().liberar) {
      axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
        setMsg({ text: "Alterações feitas", color: "text-green-400" });
        handleUpdates(project._id);
      });
    } else {
      setMsg({ text: validateChanges().message, color: "text-red-400" });
    }
  }
  function validateChanges() {
    if (
      infoHolder.compra.statusLiberacao == "PAGO" &&
      infoHolder.projeto.iniciar != "SIM"
    ) {
      return {
        liberar: false,
        message: "Por favor, preencha iniciar projeto.",
      };
    }
    if (
      infoHolder.compra.statusLiberacao == "PAGO" &&
      infoHolder.compra.dataPagamento == undefined
    ) {
      return {
        liberar: false,
        message: "Por favor, preencha a data de pagamento.",
      };
    }
    if (
      infoHolder.compra.statusEntrega == "ENTREGUE" &&
      infoHolder.compra.dataEntrega == undefined
    ) {
      return {
        liberar: false,
        message: "Por favor, preencha a data de entrega.",
      };
    }
    if (
      infoHolder.compra.statusEntrega == "EM ROTA" &&
      infoHolder.compra.previsaoEntrega == undefined
    ) {
      return {
        liberar: false,
        message: "Por favor, preencha a previsão de entrega.",
      };
    }
    if (
      infoHolder.compra.statusEntrega == "EM ROTA" &&
      infoHolder.faturamento?.previsaoFaturamento == undefined
    ) {
      return {
        liberar: false,
        message: "Por favor, preencha as informações de faturamento.",
      };
    }
    if (
      infoHolder.compra.statusEntrega == "EM ROTA" &&
      infoHolder.compra.rastreio == undefined
    ) {
      return {
        liberar: false,
        message: "Por favor, preencha as informações de rastreio.",
      };
    }
    if (infoHolder.projeto.iniciar == "SIM") {
      if (infoHolder.compra.previsaoEntrega == undefined) {
        return {
          liberar: false,
          message: "Preencha previsão de entrega",
        };
      } else if (infoHolder.compra.dataPagamento == undefined) {
        return {
          liberar: false,
          message: "Por favor, preencha a data de pagamento.",
        };
      } else if (infoHolder.compra.dataPedido == undefined) {
        return {
          liberar: false,
          message: "Por favor, preencha a data do pedido.",
        };
      } else if (
        infoHolder.compra.statusEntrega != "EM ROTA" &&
        infoHolder.compra.statusEntrega != "ENTREGUE"
      ) {
        return {
          liberar: false,
          message: "Preencha status de entrega válido",
        };
      } else {
        return { liberar: true, message: "OK" };
      }
    } else {
      return { liberar: true, message: "OK" };
    }
  }
  function getVisitaInfo(id) {
    axios
      .post(`/api/solicitacoes/getVisitaTecnica/${id}`, {
        suprimentos: 1,
        obsSuprimentos: 1,
      })
      .then((res) => {
        console.log(res.data);
        setInfoVisita({
          suprimentos: res.data.suprimentos,
          obsSuprimentos: res.data.obsSuprimentos,
        });
      });
  }
  useEffect(() => {
    if (infoHolder.idVisitaTecnica?.trim().length > 10) {
      getVisitaInfo(infoHolder.idVisitaTecnica);
    }
  }, []);
  // console.log(infoHolder);
  console.log(changes);
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <div className="flex gap-2 items-center">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {infoHolder.qtde} - {infoHolder.nomeDoContrato}
              </h1>
              {infoHolder.codigoSVB && (
                <p className="text-gray-600 text-sm font-bold">
                  #{infoHolder.codigoSVB}
                </p>
              )}
            </div>
            <div className="flex gap-x-2">
              {msg.text && (
                <p className={`text-sm italic ${msg.color}`}>{msg.text}</p>
              )}
              <button
                onClick={handleChanges}
                className="flex items-center gap-x-2 bg-[#15599a] hover:bg-blue-500 p-1 text-white font-bold rounded text-sm"
              >
                <p>Salvar alterações</p>
                <FaSave />
              </button>
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <NotificationCreationBlock
                nomeDoProjeto={project.nomeDoContrato}
                codProjeto={project.qtde}
              />
            </div>
            <InfoClienteBlock
              editor={false}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              project={project}
            />
            <InfoVisitaTecnicaBlock
              editor={false}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              infoVisita={infoVisita}
            />
            <InfoSistemaBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
            />
            {![
              "TROCA DE PADRÃO",
              "REFORMA DE PADRÃO",
              "SUBESTAÇÃO DE ENERGIA",
            ].includes(infoHolder.tipoDeServico) &&
              infoHolder.estruturaPersonalizada.aplicavel == "SIM" && (
                <InfoEstruturaBlock
                  comercialEdition={true}
                  technicalEdition={false}
                  infoHolder={infoHolder}
                  setInfo={setInfo}
                  changes={changes}
                  setChanges={setChanges}
                  showPaymentInfo={false}
                  project={project}
                />
              )}
            {infoHolder.tipoDeServico != "MONTAGEM E DESMONTAGEM" && (
              <InfoCompraBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showDeliveryInfoOnly={false}
                showMonetaryValues={true}
              />
            )}
            <InfoPagamentoBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
            />
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
                  cliente={`${infoHolder.nomeDoContrato}-${infoHolder.codigoSVB}`}
                  categorias={[
                    { label: "DOCUMENTOS", value: "links.documentos" },
                    { label: "CONTRATOS", value: "links.contratos" },
                    { label: "EQUIPAMENTOS", value: "links.equipamentos" },
                    { label: "PROJETOS", value: "links.projetos" },
                    { label: "OBRAS", value: "links.obras" },
                  ]}
                  handleUpdates={handleUpdates}
                />
              </div>
              {project.links && (
                <div className="flex justify-around gap-2 mt-3 flex-wrap">
                  {Object.keys(project.links).map((category, index) => (
                    <div key={index} className="flex flex-col">
                      <h1 className="text-sm font-bold text-center text-[#15599a]">
                        {category.toUpperCase()}
                      </h1>
                      <div className="flex flex-col items-center gap-1">
                        {project.links[category].map((obj, index2) => (
                          <a
                            className="text-xs text-[#15599a] font-bold text-center"
                            key={index2}
                            href={obj.link}
                          >
                            {obj.title} ({obj.format})
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalSuprimentos;
