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
            {/* <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                Informações do cliente
              </span>
              <div className="flex gap-2 justify-around flex-wrap">
                <TextInput
                  label={"Nome do contrato"}
                  value={infoHolder.nomeDoContrato}
                  editable={false}
                  handleChange={(value) => {
                    setChanges({ ...changes, nomeDoContrato: value });
                    setInfo({ ...infoHolder, nomeDoContrato: value });
                  }}
                />
                <TextInput
                  label={"Nome do Projeto"}
                  value={infoHolder.nomeDoProjeto}
                  editable={false}
                  handleChange={(value) => {
                    setChanges({ ...changes, nomeDoProjeto: value });
                    setInfo({
                      ...infoHolder,
                      nomeDoProjeto: value,
                    });
                  }}
                />
                <TextInput
                  label={"CPF/CNPJ"}
                  editable={false}
                  value={
                    infoHolder.cpf_cnpj
                      ? formataCPF(infoHolder.cpf_cnpj.toString())
                      : "-"
                  }
                  handleChange={(value) => {
                    setChanges({ ...changes, cpf_cnpj: value });
                    setInfo({
                      ...infoHolder,
                      cpf_cnpj: value,
                    });
                  }}
                />
                <TextInput
                  label={"Telefone"}
                  editable={false}
                  value={infoHolder.telefone ? infoHolder.telefone : "-"}
                  handleChange={(value) => {
                    setChanges({ ...changes, telefone: value });
                    setInfo({ ...infoHolder, telefone: value });
                  }}
                />
                <SelectInput
                  label={"Cidade"}
                  editable={false}
                  value={
                    cidadesAtendidas.includes(infoHolder.cidade.toUpperCase())
                      ? infoHolder.cidade
                      : "NÃO DEFINIDO"
                  }
                  options={[
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ...cidadesAtendidas.map((cidade) => {
                      return { label: cidade, value: cidade };
                    }),
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      cidade: value,
                    });
                    setInfo({
                      ...infoHolder,
                      cidade: value,
                    });
                  }}
                />
                <TextInput
                  label={"CEP"}
                  editable={false}
                  value={
                    infoHolder.cep ? formataCEP(infoHolder.cep.toString()) : "-"
                  }
                  handleChange={(value) => {
                    setChanges({ ...changes, cep: value });
                    setInfo({ ...infoHolder, cep: value });
                  }}
                />
                <TextInput
                  label={"Logradouro"}
                  editable={false}
                  value={infoHolder.logradouro ? infoHolder.logradouro : ""}
                  handleChange={(value) => {
                    setChanges({ ...changes, logradouro: value });
                    setInfo({ ...infoHolder, logradouro: value });
                  }}
                />
                <TextInput
                  label={"Bairro"}
                  editable={false}
                  value={infoHolder.bairro ? infoHolder.bairro : ""}
                  handleChange={(value) => {
                    setChanges({ ...changes, bairro: value });
                    setInfo({ ...infoHolder, bairro: value });
                  }}
                />
                <NumberInput
                  label={"Número da residência"}
                  editable={false}
                  value={
                    infoHolder.numeroResidencia
                      ? infoHolder.numeroResidencia
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      numeroResidencia: Number(value),
                    });
                    setInfo({
                      ...infoHolder,
                      numeroResidencia: Number(value),
                    });
                  }}
                />
                <SelectInput
                  label={"Regional"}
                  editable={false}
                  value={infoHolder.regional}
                  options={[
                    {
                      label: "REGIONAL ITUIUTABA",
                      value: "REGIONAL ITUIUTABA",
                    },
                    {
                      label: "REGIONAL UBERLANDIA",
                      value: "REGIONAL UBERLANDIA",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({ ...changes, regional: value });
                    setInfo({ ...infoHolder, regional: value });
                  }}
                />
                <TextInput
                  label={"EMAIL"}
                  editable={false}
                  value={infoHolder.email ? infoHolder.email : ""}
                  handleChange={(value) => {
                    setChanges({ ...changes, email: value });
                    setInfo({ ...infoHolder, email: value });
                  }}
                />
                <SelectInput
                  label={"Canal de venda"}
                  value={
                    infoHolder.canalVenda != undefined &&
                    infoHolder.canalVenda != "-"
                      ? infoHolder.canalVenda
                      : "NÃO DEFINIDO"
                  }
                  editable={false}
                  options={[
                    { label: "EVENTO", value: "EVENTO" },
                    {
                      label: "INDICAÇÃO DE AMIGO",
                      value: "INDICAÇÃO DE AMIGO",
                    },
                    { label: "INSIDE SALES", value: "INSIDE SALES" },
                    { label: "PASSIVO", value: "PASSIVO" },
                    { label: "PORTA A PORTA", value: "PORTA A PORTA" },
                    { label: "TELEVENDAS", value: "TELEVENDAS" },
                    { label: "NETWORK", value: "NETWORK" },
                    { label: "OUTRO", value: "OUTRO" },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({ ...changes, canalVenda: value });
                    setInfo({ ...infoHolder, canalVenda: value });
                  }}
                />
                <div className="flex">
                  <SelectInput
                    label={"VENDEDOR"}
                    value={
                      infoHolder.vendedor != undefined &&
                      infoHolder.vendedor.nome != "-"
                        ? infoHolder.vendedor.nome
                        : "NÃO DEFINIDO"
                    }
                    options={vendedores.map((vendedor) => {
                      return { label: vendedor.nome, value: vendedor.nome };
                    })}
                    editable={false}
                    handleChange={(value) => {
                      console.log(value);
                      setChanges({
                        ...changes,
                        "vendedor.nome": value,
                        "vendedor.codigo":
                          vendedores.filter(
                            (vendedor) => vendedor.nome == value
                          )[0].cod || "-",
                      });
                      setInfo({
                        ...infoHolder,
                        vendedor: {
                          ...infoHolder.vendedor,
                          nome: value,
                          codigo:
                            vendedores.filter(
                              (vendedor) => vendedor.nome == value
                            )[0].cod || "-",
                        },
                      });
                    }}
                  />
                </div>
                <SelectInput
                  label={"SEGMENTO"}
                  value={infoHolder.segmento}
                  editable={false}
                  options={[
                    { label: "COMERCIAL", value: "COMERCIAL" },
                    { label: "INDUSTRIAL", value: "INDUSTRIAL" },
                    { label: "RESIDENCIAL", value: "RESIDENCIAL" },
                    { label: "RURAL", value: "RURAL" },
                  ]}
                  handleChange={(value) => {
                    setChanges({ ...changes, segmento: value });
                    setInfo({ ...infoHolder, segmento: value });
                  }}
                />
                <TextInput
                  label={"LINK PASTA DO DRIVE"}
                  editable={editor}
                  normalCase={true}
                  value={infoHolder.linkDrive ? infoHolder.linkDrive : ""}
                  handleChange={(value) => {
                    setChanges({ ...changes, linkDrive: value });
                    setInfo({ ...infoHolder, linkDrive: value });
                  }}
                />
                <TextInput
                  label="TIPO DE SERVIÇO"
                  value={infoHolder.tipoDeServico}
                  editable={false}
                  handleChange={(value) => {
                    setChanges({ ...changes, tipoDeServico: value });
                    setInfo({ ...infoHolder, tipoDeServico: value });
                  }}
                />
              </div>
              {infoHolder.linkDrive && (
                <p className="text-center my-2 italic font-bold">
                  Vá para a pasta do drive{" "}
                  <a className="text-blue-400" href={infoHolder.linkDrive}>
                    {infoHolder.linkDrive}
                  </a>
                </p>
              )}
            </div> */}
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                PADRÃO
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <SelectInput
                  label={"PAGAMENTO DO PADRÃO"}
                  editable={false}
                  value={
                    infoHolder.padrao?.respPagamento ==
                      "NÃO HAVERA TROCA DE PADRÃO" ||
                    infoHolder.padrao?.respPagamento == undefined
                      ? "NÃO HAVERA TROCA PADRÃO"
                      : infoHolder.padrao?.respPagamento
                  }
                  options={[
                    {
                      label: "CLIENTE IRÁ COMPRAR EM SEPARADO",
                      value: "CLIENTE IRÁ COMPRAR EM SEPARADO",
                    },
                    {
                      label: "CLIENTE PAGAR POR FORA",
                      value: "CLIENTE PAGAR POR FORA",
                    },
                    {
                      label: "INCLUSO NO CONTRATO",
                      value: "INCLUSO NO CONTRATO",
                    },
                    {
                      label: "NÃO HAVERA TROCA PADRÃO",
                      value: "NÃO HAVERA TROCA PADRÃO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "padrao.respPagamento": value,
                    });
                    setInfo({
                      ...infoHolder,
                      padrao: { ...infoHolder.padrao, respPagamento: value },
                    });
                  }}
                />
                <NumberInput
                  tag={"R$"}
                  label={"Valor do padrão"}
                  editable={false}
                  value={infoHolder.padrao.valor ? infoHolder.padrao.valor : 0}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "padrao.valor": Number(value),
                    });
                    setInfo({
                      ...infoHolder,
                      padrao: { ...infoHolder.padrao, valor: Number(value) },
                    });
                  }}
                />
                <SelectInput
                  label={"RESPONSÁVEL INSTALAÇÃO DO PADRÃO"}
                  editable={false}
                  value={
                    infoHolder.padrao?.respInstalacao
                      ? infoHolder.padrao?.respInstalacao
                      : "NÃO SE APLICA"
                  }
                  options={[
                    { label: "AMPERE", value: "AMPERE" },
                    { label: "CLIENTE", value: "CLIENTE" },
                    { label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "padrao.respInstalacao": value,
                    });
                    setInfo({
                      ...infoHolder,
                      padrao: { ...infoHolder.padrao, respInstalacao: value },
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                ESTRUTURA PERSONALIZADA
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <div>
                  <input
                    disabled={true}
                    checked={
                      infoHolder.estruturaPersonalizada?.aplicavel === "SIM"
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      setChanges({
                        ...changes,
                        "estruturaPersonalizada.aplicavel": e.target.checked
                          ? "SIM"
                          : "NÃO",
                      });
                      setInfo({
                        ...infoHolder,
                        estruturaPersonalizada: {
                          ...infoHolder.estruturaPersonalizada,
                          aplicavel: e.target.checked ? "SIM" : "NÃO",
                        },
                      });
                    }}
                    type="checkbox"
                    name="visitaTecnica"
                    id="visitaTecnica"
                  />
                  <label className="ml-2" htmlFor="visitaTecnica">
                    APLICÁVEL
                  </label>
                </div>
                <SelectInput
                  label={"Tipo da estrutura"}
                  editable={false}
                  value={
                    infoHolder.estruturaPersonalizada?.tipo
                      ? infoHolder.estruturaPersonalizada?.tipo
                      : "N/A"
                  }
                  options={[
                    { label: "INCLINAÇÃO", value: "INCLINAÇÃO" },
                    { label: "SOLO", value: "SOLO" },
                    { label: "TELHADO", value: "TELHADO" },
                    { label: "BARRACÃO", value: "BARRACÃO" },
                    { label: "CARPORT", value: "CARPORT" },
                    { label: "N/A", value: "N/A" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "estruturaPersonalizada.tipo": value,
                    });
                    setInfo({
                      ...infoHolder,
                      estruturaPersonalizada: {
                        ...infoHolder.estruturaPersonalizada,
                        tipo: value,
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"PAGAMENTO DA ESTRUTURA"}
                  editable={false}
                  value={
                    infoHolder.estruturaPersonalizada?.respPagamento
                      ? infoHolder.estruturaPersonalizada?.respPagamento
                      : "NÃO SE APLICA"
                  }
                  options={[
                    { label: "AMPERE", value: "AMPERE" },
                    { label: "CLIENTE", value: "CLIENTE" },
                    { label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "estruturaPersonalizada.respPagamento": value,
                    });
                    setInfo({
                      ...infoHolder,
                      estruturaPersonalizada: {
                        ...infoHolder.estruturaPersonalizada,
                        respPagamento: value,
                      },
                    });
                  }}
                />
                <NumberInput
                  tag={"R$"}
                  label={"Valor da estrutura"}
                  editable={false}
                  value={
                    infoHolder.estruturaPersonalizada?.valor == "-" ||
                    infoHolder.estruturaPersonalizada?.valor == undefined
                      ? 0
                      : infoHolder.estruturaPersonalizada?.valor
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "estruturaPersonalizada.valor": Number(value),
                    });
                    setInfo({
                      ...infoHolder,
                      estruturaPersonalizada: {
                        ...infoHolder.estruturaPersonalizada,
                        valor: Number(value),
                      },
                    });
                  }}
                />
                {infoHolder.estruturaPersonalizada.aplicavel == "SIM" && (
                  <SelectInput
                    label={"STATUS da estrutura personalizada"}
                    editable={false}
                    value={
                      infoHolder.estruturaPersonalizada.aplicavel
                        ? infoHolder.estruturaPersonalizada.status
                          ? infoHolder.estruturaPersonalizada.status
                          : "N/A"
                        : "N/A"
                    }
                    options={[
                      { label: "PRONTA", value: "PRONTA" },
                      { label: "PENDÊNCIA", value: "PENDÊNCIA" },
                      { label: "N/A", value: "N/A" },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "estruturaPersonalizada.status": value,
                      });
                      setInfo({
                        ...infoHolder,
                        estruturaPersonalizada: {
                          ...infoHolder.estruturaPersonalizada,
                          status: value,
                        },
                      });
                    }}
                  />
                )}
              </div>
            </div>
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
              editor={true}
              infoHolder={infoHolder}
              setInfo={setInfo}
              changes={changes}
              setChanges={setChanges}
              showPaymentInfo={true}
            />
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                SISTEMA
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <NumberInput
                  label={"NÚMERO DE MÓDULOS"}
                  editable={false}
                  value={
                    infoHolder.sistema?.qtdeModulos != undefined &&
                    infoHolder.sistema?.qtdeModulos != "-"
                      ? infoHolder.sistema?.qtdeModulos
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "sistema.qtdeModulos": Number(value),
                    });
                    setInfo({
                      ...infoHolder,
                      sistema: {
                        ...infoHolder.sistema,
                        qtdeModulos: Number(value),
                      },
                    });
                  }}
                />
                <TextInput
                  unit={"W"}
                  label={"POTÊNCIA DOS MÓDULOS"}
                  editable={editor}
                  value={
                    infoHolder.sistema?.potModulos != undefined &&
                    infoHolder.sistema?.potModulos != "-"
                      ? infoHolder.sistema?.potModulos
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "sistema.potModulos": value,
                      "sistema.potPico":
                        Number(value * infoHolder.sistema?.qtdeModulos) / 1000,
                    });
                    setInfo({
                      ...infoHolder,
                      sistema: {
                        ...infoHolder.sistema,
                        potModulos: value,
                        potPico:
                          Number(value * infoHolder.sistema?.qtdeModulos) /
                          1000,
                      },
                    });
                  }}
                />
                <NumberInput
                  unit={"kWp"}
                  label={"POTÊNCIA PICO"}
                  editable={false}
                  value={
                    infoHolder.sistema?.potPico != undefined &&
                    infoHolder.sistema?.potPico != "-"
                      ? infoHolder.sistema?.potPico
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "sistema.potPico": Number(value),
                    });
                    setInfo({
                      ...infoHolder,
                      sistema: {
                        ...infoHolder.sistema,
                        potPico: Number(value),
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"TOPOLOGIA"}
                  value={
                    infoHolder.sistema?.topologia
                      ? infoHolder.sistema?.topologia
                      : "NÃO DEFINIDO"
                  }
                  editable={false}
                  options={[
                    { label: "INVERSOR", value: "INVERSOR" },
                    { label: "MICRO", value: "MICRO" },
                    { label: "OUTROS SERV.", value: "OUTROS SERV." },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "sistema.topologia": value,
                    });
                    setInfo({
                      ...infoHolder,
                      sistema: {
                        ...infoHolder.sistema,
                        topologia: value,
                      },
                    });
                  }}
                />
                <TextInput
                  label={"QTDE E POTÊNCIA DO(S) INVERSOR(ES)"}
                  editable={false}
                  value={
                    infoHolder.sistema?.inversor
                      ? infoHolder.sistema?.inversor
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "sistema.inversor": value,
                    });
                    setInfo({
                      ...infoHolder,
                      sistema: {
                        ...infoHolder.sistema,
                        inversor: value,
                      },
                    });
                  }}
                />
                <NumberInput
                  tag={"R$"}
                  label={"VALOR DO PROJETO"}
                  editable={false}
                  value={
                    infoHolder.sistema?.valorProjeto != undefined &&
                    infoHolder.sistema?.valorProjeto != "-"
                      ? infoHolder.sistema?.valorProjeto
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "sistema.valorProjeto": Number(value),
                    });
                    setInfo({
                      ...infoHolder,
                      sistema: {
                        ...changes.sistema,
                        valorProjeto: Number(value),
                      },
                    });
                  }}
                />
              </div>
            </div>
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
