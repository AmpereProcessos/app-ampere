import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useKey } from "../utils/hooks";
import {
  cidadesAtendidas,
  vendedores,
  projetistas,
  statusLiberacao,
  credores,
  localEntregaOptions,
  fornecedores,
  tiposDeServico,
  tiposDeEstruturas,
  equipesTecnicas,
  oemPlans,
} from "../utils/constants";
import { FaSave } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import axios from "axios";
import dayjs from "dayjs";
import NotificationCreationBlock from "./NotificationCreationBlock";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoPadraoBlock from "./blocosInfoProjeto/InfoPadraoBlock";
import InfoEstruturaBlock from "./blocosInfoProjeto/InfoEstruturaBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";
import InfoVisitaTecnicaBlock from "./blocosInfoProjeto/InfoVisitaTecnicaBlock";
import InfoContratoBlock from "./blocosInfoProjeto/InfoContratoBlock";
import InfoClienteBlock from "./blocosInfoProjeto/InfoClienteBlock";
import InfoDadosConcessionariaBlock from "./blocosInfoProjeto/InfoDadosConcessionariaBlock";
import InfoPagamentoBlock from "./blocosInfoProjeto/InfoPagamentoBlock";
import InfoArquivosBlock from "./blocosInfoProjeto/InfoArquivosBlock";
import InfoProjetoBlock from "./blocosInfoProjeto/InfoProjetoBlock";
import InfoObrasBlock from "./blocosInfoProjeto/InfoObrasBlock";
import InfoMaterialBlock from "./blocosInfoProjeto/InfoMaterialBlock";
import SaveButton from "./utils/Buttons/SaveButton";

function formatCnpjCpf(value) {
  const cnpjCpf = value.replace(/\D/g, "");

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );
}
function formataCEP(cep) {
  cep = cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");

  return cep;
}
function ModalComercial({
  open,
  setModalIsOpen,
  modalIsOpen,
  project,
  editor,
  handleUpdates,
  credentials,
}) {
  useKey("Escape", () => setModalIsOpen(false));

  const [infoHolder, setInfo] = useState(project);

  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  async function notifyContractSigning() {
    const notifyArr = [
      {
        destinatario: "6353eb83ef4e1a367a877949",
        remetente: "SISTEMA",
        mensagem: `Contrato atualizado para ASSINADO.`,
        projetoReferencia: project.qtde,
        nomeDoProjeto: project.nomeDoContrato,
      },
      {
        destinatario: "64638b6c2071c508968bdf08",
        remetente: "SISTEMA",
        mensagem: `Contrato atualizado para ASSINADO.`,
        projetoReferencia: project.qtde,
        nomeDoProjeto: project.nomeDoContrato,
      },
    ];

    try {
      notifyArr.forEach(async (notifyObj) => {
        let data = await axios.post("/api/notificacoes/1", notifyObj);
      });
    } catch (error) {
      console.log("Erro ao notificar usuários sobre assinatura do contrato.");
    }
  }
  function handleValidation() {
    if (
      infoHolder.contrato.status != "ASSINADO" &&
      infoHolder.pagamento.status == "PAGO"
    ) {
      setMsg({
        text: "Status de contrato e status de pagamento incompatíveis.",
        color: "text-red-500",
      });
      return false;
    }
    if (
      !infoHolder.comissionamento?.comercial &&
      (infoHolder.compra?.statusLiberacao == "REALIZAR COMPRA" ||
        infoHolder.compra?.statusLiberacao == "PAGO")
    ) {
      setMsg({
        text: "Liberação para compra não permitida sem relatório de comissionamento.",
        color: "text-red-500",
      });
      return false;
    }
    return true;
  }
  async function handleChanges() {
    if (handleValidation()) {
      setMsg({
        text: "Enviando informações para alteração...",
        color: "text-[#15599a]",
      });
      try {
        if (
          project.contrato?.status != "ASSINADO" &&
          infoHolder.contrato?.status == "ASSINADO"
        ) {
          notifyContractSigning();
        }
        const { data } = await axios.post(
          `/api/projects/update/${project._id}`,
          changes
        );
        setMsg({ text: "Alterações feitas !", color: "text-green-500" });
        handleUpdates(project._id);
      } catch (error) {
        setMsg({
          text: "Um erro ocorreu. Tente novamente.",
          color: "text-red-500",
        });
      }
    }
  }

  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between px-2 text-lg border-b border-gray-200 pb-2">
            <div className="flex gap-x-2">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {infoHolder.qtde} - {infoHolder.nomeDoContrato}
              </h1>
              {infoHolder.codigoSVB && (
                <p className="text-gray-600 text-sm font-bold">
                  #{infoHolder.codigoSVB}
                </p>
              )}
            </div>
            <div className="flex gap-x-2 items-center">
              {msg.text && (
                <p className={`hidden lg:block text-sm italic ${msg.color}`}>
                  {msg.text}
                </p>
              )}
              <SaveButton
                text={"Salvar alterações"}
                icon={<FaSave />}
                handleClick={handleChanges}
              />
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
            {msg.text && (
              <p className={`block lg:hidden text-sm italic ${msg.color}`}>
                {msg.text}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <NotificationCreationBlock
                nomeDoProjeto={project.nomeDoContrato}
                codProjeto={project.qtde}
              />
            </div>
            <InfoClienteBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              project={project}
            />
            <InfoVisitaTecnicaBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
            />
            {![
              "OPERAÇÃO E MANUTENÇÃO",
              "BOMBA SOLAR",
              "SISTEMA FOTOVOLTAICO (OFF GRID)",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoPadraoBlock
                comercialEdition={true}
                technicalEdition={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            {![
              "TROCA DE PADRÃO",
              "REFORMA DE PADRÃO",
              "SUBESTAÇÃO DE ENERGIA",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoEstruturaBlock
                comercialEdition={true}
                technicalEdition={true}
                project={project}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            <InfoContratoBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              minimalInfo={false}
              showPaymentInfo={true}
            />
            <InfoPagamentoBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
            />
            {infoHolder.tipoDeServico != "MONTAGEM E DESMONTAGEM" && (
              <InfoCompraBlock
                editor={true}
                project={project}
                comercialEditionOnly={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showDeliveryInfoOnly={false}
                showMonetaryValues={true}
              />
            )}
            {!["BOMBA SOLAR", "SISTEMA FOTOVOLTAICO (OFF GRID)"].includes(
              infoHolder.tipoDeServico
            ) && (
              <InfoDadosConcessionariaBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
              />
            )}
            {![
              "TROCA DE PADRÃO",
              "REFORMA DE PADRÃO",
              "SUBESTAÇÃO DE ENERGIA",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoSistemaBlock
                editor={true}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            <InfoProjetoBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              handleUpdates={handleUpdates}
              project={project}
            />
            <InfoObrasBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              project={project}
            />
            <InfoMaterialBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
            />
            <InfoArquivosBlock
              project={project}
              infoHolder={infoHolder}
              categories={[
                { label: "DOCUMENTOS", value: "links.documentos" },
                { label: "CONTRATOS", value: "links.contratos" },
                {
                  label: "EQUIPAMENTOS",
                  value: "links.equipamentos",
                },
                { label: "PROJETOS", value: "links.projetos" },
                { label: "VISITA TÉCNICA", value: "links.visitaTecnica" },
              ]}
              handleUpdates={handleUpdates}
            />
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalComercial;
