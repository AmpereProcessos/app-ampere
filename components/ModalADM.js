import React, { useState } from "react";
import {
  equipesTecnicas,
  fornecedores,
  vendedores,
  cidadesAtendidas,
} from "../utils/constants";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import NotificationCreationBlock from "./NotificationCreationBlock";
import axios from "axios";
import Link from "next/link";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
import InfoContratoBlock from "./blocosInfoProjeto/InfoContratoBlock";
import InfoClienteBlock from "./blocosInfoProjeto/InfoClienteBlock";
import InfoPagamentoBlock from "./blocosInfoProjeto/InfoPagamentoBlock";
import InfoCompraBlock from "./blocosInfoProjeto/InfoCompraBlock";
import InfoSistemaBlock from "./blocosInfoProjeto/InfoSistemaBlock";
import InfoArquivosBlock from "./blocosInfoProjeto/InfoArquivosBlock";
import InfoPadraoBlock from "./blocosInfoProjeto/InfoPadraoBlock";
import InfoEstruturaBlock from "./blocosInfoProjeto/InfoEstruturaBlock";
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
function ModalADM({
  open,
  setModalIsOpen,
  modalIsOpen,
  project,
  editor,
  handleUpdates,
  credentials,
  users,
}) {
  const [infoHolder, setInfo] = useState(project);
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  // function validateChanges() {
  //   if (
  //     infoHolder.compra.statusLiberacao == "PAGO" &&
  //     infoHolder.projeto.iniciar != "SIM"
  //   ) {
  //     return {
  //       liberar: false,
  //       message: "Por favor, preencha iniciar projeto.",
  //     };
  //   }
  //   if (infoHolder.projeto.iniciar == "SIM") {
  //     if (infoHolder.compra.previsaoEntrega == undefined) {
  //       return {
  //         liberar: false,
  //         message: "Preencha previsão de entrega",
  //       };
  //     } else if (infoHolder.compra.dataPagamento == undefined) {
  //       return {
  //         liberar: false,
  //         message: "Por favor, preencha a data de pagamento.",
  //       };
  //     } else if (infoHolder.compra.dataPedido == undefined) {
  //       return {
  //         liberar: false,
  //         message: "Por favor, preencha a data do pedido.",
  //       };
  //     } else if (
  //       infoHolder.compra.statusEntrega != "EM ROTA" &&
  //       infoHolder.compra.statusEntrega != "ENTREGUE"
  //     ) {
  //       return {
  //         liberar: false,
  //         message: "Preencha status de entrega válido",
  //       };
  //     } else {
  //       return { liberar: true, message: "OK" };
  //     }
  //   } else {
  //     return { liberar: true, message: "OK" };
  //   }
  // }
  function handleChanges() {
    if (
      infoHolder.contrato.status != "ASSINADO" &&
      infoHolder.pagamento.status == "PAGO"
    ) {
      setMsg({ text: "Verifique as informações!", color: "text-red-400" });
    } else {
      axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
        setMsg({ text: "Alterações feitas !", color: "text-green-400" });
        handleUpdates(project._id);
      });
    }
  }
  return (
    <>
      <AnimatedModalWrapper modalIsOpen={modalIsOpen}>
        <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
          <div className="flex flex-wrap items-center gap-2 lg:gap-0 justify-center lg:justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <h1 className="text-[#15599a] pl-6  font-bold">
              {infoHolder.qtde} - {infoHolder.nomeDoContrato}
            </h1>
            {infoHolder.codigoSVB && (
              <p className="text-gray-600 text-sm font-bold">
                #{infoHolder.codigoSVB}
              </p>
            )}
            <div className="flex justify-around lg:justify-around items-center gap-2">
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
            {![
              "OPERAÇÃO E MANUTENÇÃO",
              "BOMBA SOLAR",
              "SISTEMA FOTOVOLTAICO (OFF GRID)",
            ].includes(infoHolder.tipoDeServico) ? (
              <InfoPadraoBlock
                comercialEdition={false}
                technicalEdition={false}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
                showPaymentOnly={true}
              />
            ) : null}
            {![
              "TROCA DE PADRÃO",
              "REFORMA DE PADRÃO",
              "SUBESTAÇÃO DE ENERGIA",
            ].includes(infoHolder.tipoDeServico) && (
              <InfoEstruturaBlock
                comercialEdition={false}
                technicalEdition={false}
                project={project}
                infoHolder={infoHolder}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showPaymentInfo={true}
              />
            )}
            <InfoContratoBlock
              editor={false}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              minimalInfo={true}
              showPaymentInfo={true}
            />
            <InfoPagamentoBlock
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              showADMOnly={true}
            />
            {infoHolder.tipoDeServico != "MONTAGEM E DESMONTAGEM" && (
              <InfoCompraBlock
                editor={true}
                infoHolder={infoHolder}
                project={project}
                setInfo={setInfo}
                changes={changes}
                setChanges={setChanges}
                showDeliveryInfoOnly={false}
                showMonetaryValues={true}
              />
            )}
            <InfoSistemaBlock
              editor={false}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              showPaymentInfo={true}
            />
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                Informações sobre a obra
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <DateInput
                  label={"ENTRADA NA OBRA"}
                  editable={false}
                  value={
                    infoHolder.obra?.entrada != undefined &&
                    infoHolder.obra?.entrada != "-"
                      ? new Date(infoHolder.obra?.entrada)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "obra.entrada": new Date(value).toISOString(),
                    });
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        entrada: new Date(value).toISOString(),
                      },
                    });
                  }}
                />
                <DateInput
                  label={"SAIDA DE OBRA"}
                  editable={false}
                  value={
                    infoHolder.obra?.saida != undefined &&
                    infoHolder.obra?.saida != "-"
                      ? new Date(infoHolder.obra?.saida)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "obra.saida": new Date(value).toISOString(),
                    });
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        saida: new Date(value).toISOString(),
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"STATUS DA OBRA"}
                  value={
                    infoHolder.obra?.statusDaObra
                      ? infoHolder.obra?.statusDaObra
                      : "NÃO DEFINIDO"
                  }
                  editable={false}
                  options={[
                    {
                      label: "AGENDADA",
                      value: "AGENDADA",
                    },
                    {
                      label: "AGUARDANDO AGENDAMENTO",
                      value: "AGUARDANDO AGENDAMENTO",
                    },
                    {
                      label: "CONCLUIDA",
                      value: "CONCLUIDA",
                    },
                    {
                      label: "EM ANDAMENTO",
                      value: "EM ANDAMENTO",
                    },
                    {
                      label: "OBRA CANCELADA",
                      value: "OBRA CANCELADA",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "obra.statusDaObra": value,
                    });
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        statusDaObra: value,
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"EQUIPE RESPONSÁVEL"}
                  editable={false}
                  value={
                    infoHolder.obra?.equipeResp != undefined &&
                    infoHolder.obra?.equipeResp != "-"
                      ? infoHolder.obra?.equipeResp == "TERCEIROS" ||
                        infoHolder.obra?.equipeResp == "TERCERIZADOS" ||
                        infoHolder.obra?.equipeResp == "OUTROS"
                        ? "OUTROS"
                        : infoHolder.obra?.equipeResp
                      : "NÃO DEFINIDO"
                  }
                  options={equipesTecnicas.map((equipe) => equipe)}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "obra.equipeResp": value,
                    });
                    setInfo({
                      ...infoHolder,
                      obra: {
                        ...infoHolder.obra,
                        equipeResp: value,
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                MATERIAL
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                {infoHolder.material?.formularioId && (
                  <Link
                    href={`/almoxarifado/pdfFormulario/${infoHolder.material.formularioId}?backTo=adm`}
                  >
                    <p className="cursor-pointer bg-[#15599a] text-white items-center justify-center p-2 rounded font-bold">
                      VER SOLICITAÇÃO
                    </p>
                  </Link>
                )}
                <SelectInput
                  label={"Separação do material"}
                  value={
                    infoHolder.material?.statusSeparacao
                      ? infoHolder.material?.statusSeparacao
                      : "NÃO DEFINIDO"
                  }
                  editable={false}
                  options={[
                    {
                      label: "INICIAR SEPARAÇÃO",
                      value: "INICIAR SEPARAÇÃO",
                    },
                    {
                      label: "SEPARADO",
                      value: "SEPARADO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "material.statusSeparacao": value,
                    });
                    setInfo({
                      ...infoHolder,
                      material: {
                        ...infoHolder.material,
                        statusSeparacao: value,
                      },
                    });
                  }}
                />
                <NumberInput
                  tag={"R$"}
                  label={"Previsão de custos em insumos"}
                  editable={false}
                  value={
                    infoHolder.material?.previsaoCustos != undefined &&
                    infoHolder.material?.previsaoCustos != "#VALUE!"
                      ? infoHolder.material?.previsaoCustos.toFixed(2)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "material.previsaoCustos": Number(value),
                    });
                    setInfo({
                      ...infoHolder,
                      material: {
                        ...infoHolder.material,
                        previsaoCustos: Number(value),
                      },
                    });
                  }}
                />
                <NumberInput
                  tag={"R$"}
                  label={"Custos em insumos"}
                  editable={editor}
                  value={
                    infoHolder.material?.efetivoCustos != undefined &&
                    infoHolder.material?.efetivoCustos != "#VALUE!"
                      ? infoHolder.material?.efetivoCustos
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "material.efetivoCustos": Number(value),
                    });
                    setInfo({
                      ...infoHolder,
                      material: {
                        ...infoHolder.material,
                        efetivoCustos: Number(value),
                      },
                    });
                  }}
                />
              </div>
            </div>
            <InfoArquivosBlock
              project={project}
              infoHolder={infoHolder}
              categories={[
                { label: "DOCUMENTOS", value: "links.documentos" },
                { label: "CONTRATOS", value: "links.contratos" },
                { label: "EQUIPAMENTOS", value: "links.equipamentos" },
                { label: "PROJETOS", value: "links.projetos" },
              ]}
              handleUpdates={handleUpdates}
            />
          </div>
        </div>
      </AnimatedModalWrapper>
    </>
  );
}

export default ModalADM;
