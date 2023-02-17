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
import AnexoArquivo from "./AnexoArquivo";
import AnimatedModalWrapper from "./utils/AnimatedModalWrapper";
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
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                NOTIFICAR
              </span>
              <NotificationCreationBlock
                nomeDoProjeto={project.nomeDoContrato}
                codProjeto={project.qtde}
              />
            </div>
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
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
            </div>
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
                      : "NÃ SE APLICA"
                  }
                  options={[
                    { label: "AMPERE", value: "AMPERE" },
                    { label: "CLIENTE", value: "CLIENTE" },
                    { label: "NÃO SE APLICA", value: "NÃ SE APLICA" },
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
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                CONTRATO
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <SelectInput
                  label={"STATUS"}
                  editable={false}
                  value={
                    infoHolder.contrato.status
                      ? infoHolder.contrato.status
                      : "NÃO DEFINIDO"
                  }
                  options={[
                    {
                      label: "AGUARDANDO SOLICITAÇÃO",
                      value: "AGUARDANDO SOLICITAÇÃO",
                    },
                    { label: "ASSINADO", value: "ASSINADO" },
                    { label: "NÃO ASSINADO", value: "NÃO ASSINADO" },
                    {
                      label: "RECISÃO DE CONTRATO",
                      value: "RECISÃO DE CONTRATO",
                    },
                    { label: "SOLICITADO", value: "SOLICITADO" },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "contrato.status": value,
                    });
                    setInfo({
                      ...infoHolder,
                      contrato: {
                        ...infoHolder.contrato,
                        status: value,
                      },
                    });
                  }}
                />
                <DateInput
                  label={"Data de assinatura"}
                  editable={false}
                  value={
                    infoHolder.contrato.dataAssinatura != undefined &&
                    infoHolder.contrato.dataAssinatura != "-"
                      ? new Date(infoHolder.contrato.dataAssinatura)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "contrato.dataAssinatura": new Date(value).toISOString(),
                    });
                    setInfo({
                      ...infoHolder,
                      contrato: {
                        ...infoHolder.contrato,
                        dataAssinatura: new Date(value).toISOString(),
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                PAGAMENTO
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <div className="w-[350px]">
                  <input
                    disabled={!editor}
                    checked={infoHolder.pagamento?.cobrancaFeita ? true : false}
                    onChange={(e) => {
                      setChanges({
                        ...changes,
                        "pagamento.cobrancaFeita": e.target.checked,
                      });
                      setInfo({
                        ...infoHolder,
                        pagamento: {
                          ...infoHolder.pagamento,
                          cobrancaFeita: e.target.checked,
                        },
                      });
                    }}
                    type="checkbox"
                    name="cobrancaFeita"
                    id="cobrancaFeita"
                  />
                  <label className="ml-2" htmlFor="cobrancaFeita">
                    COBRANÇA REALIZADA ?
                  </label>
                </div>
                {/**
                   * <SelectInput
                    label={"STATUS PAGAMENTO"}
                    value={
                      infoHolder.pagamento.status
                        ? infoHolder.pagamento.status
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "AGUARDANDO PAGAMENTO",
                        value: "AGUARDANDO PAGAMENTO",
                      },
                      {
                        label: "PAGO",
                        value: "PAGO",
                      },
                      {
                        label: "RESCISÃO",
                        value: "RESCISÃO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "pagamento.status": value,
                      });
                      setInfo({
                        ...infoHolder,
                        pagamento: {
                          ...infoHolder.pagamento,
                          status: value,
                        },
                      });
                    }}
                  />
                  */}
                <SelectInput
                  label={"FORMA DE PAGAMENTO"}
                  value={
                    infoHolder.pagamento?.forma
                      ? infoHolder.pagamento?.forma
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    {
                      label: "CAPITAL PROPRIO",
                      value: "CAPITAL PROPRIO",
                    },
                    {
                      label: "FINANCIAMENTO",
                      value: "FINANCIAMENTO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "pagamento.forma": value,
                    });
                    setInfo({
                      ...infoHolder,
                      pagamento: {
                        ...infoHolder.pagamento,
                        forma: value,
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"EMPRESA A FATURAR"}
                  value={
                    infoHolder.faturamento?.empresaFaturamento != undefined &&
                    infoHolder.faturamento?.empresaFaturamento != "-"
                      ? infoHolder.faturamento?.empresaFaturamento
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    { label: "AMPERE ENERGIAS", value: "AMPERE ENERGIAS" },
                    {
                      label: "ANALISE DO FINANCEIRO",
                      value: "ANALISE DO FINANCEIRO",
                    },
                    { label: "IZAIRA SERVIÇOS", value: "IZAIRA SERVIÇOS" },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "faturamento.empresaFaturamento": value,
                    });
                    setInfo({
                      ...infoHolder,
                      faturamento: {
                        ...infoHolder.faturamento,
                        empresaFaturamento: value,
                      },
                    });
                  }}
                />
                <NumberInput
                  label={"CNPJ PARA FATURAMENTO"}
                  editable={editor}
                  value={
                    infoHolder.faturamento?.cnpjFaturamento != undefined &&
                    infoHolder.faturamento.cnpjFaturamento != "#VALUE!"
                      ? infoHolder.faturamento.cnpjFaturamento
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "faturamento.cnpjFaturamento": Number(value),
                    });
                    setInfo({
                      ...infoHolder,
                      faturamento: {
                        ...infoHolder.faturamento,
                        cnpjFaturamento: Number(value),
                      },
                    });
                  }}
                />
                <TextInput
                  label={"Informações faturamento"}
                  editable={editor}
                  value={
                    infoHolder.faturamento?.previsaoFaturamento
                      ? infoHolder.faturamento?.previsaoFaturamento
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "faturamento.previsaoFaturamento": value,
                    });
                    setInfo({
                      ...infoHolder,
                      faturamento: {
                        ...infoHolder.faturamento,
                        previsaoFaturamento: value,
                      },
                    });
                  }}
                />
                <DateInput
                  label="Data de faturamento"
                  editable={editor}
                  value={
                    infoHolder.faturamento?.dataFaturamento
                      ? new Date(infoHolder.faturamento?.dataFaturamento)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "faturamento.dataFaturamento": new Date(
                        value
                      ).toISOString(),
                    });
                    setInfo({
                      ...infoHolder,
                      faturamento: {
                        ...infoHolder.faturamento,
                        dataFaturamento: new Date(value).toISOString(),
                      },
                    });
                  }}
                />
                {infoHolder.pagamento?.forma == "FINANCIAMENTO" && (
                  <SelectInput
                    label={"CREDOR"}
                    value={
                      infoHolder.pagamento.credor != undefined &&
                      infoHolder.pagamento.credor != "-----" &&
                      infoHolder.pagamento.credor != "QUAL CREDOR?"
                        ? infoHolder.pagamento.credor
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "BANCO DO BRASIL",
                        value: "BANCO DO BRASIL",
                      },
                      {
                        label: "BRADESCO",
                        value: "BRADESCO",
                      },
                      {
                        label: "BV FINANCEIRA",
                        value: "BV FINANCEIRA",
                      },
                      {
                        label: "CAIXA",
                        value: "CAIXA",
                      },
                      {
                        label: "COOPACREDI",
                        value: "COOPACREDI",
                      },
                      {
                        label: "CREDICAMPINA",
                        value: "CREDICAMPINA",
                      },
                      {
                        label: "CREDIPONTAL",
                        value: "CREDIPONTAL",
                      },
                      {
                        label: "SANTANDER",
                        value: "SANTANDER",
                      },
                      {
                        label: "SOL FACIL",
                        value: "SOL FACIL",
                      },
                      {
                        label: "SICOOB ARACOOP",
                        value: "SICOOB ARACOOP",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "pagamento.credor": value,
                      });
                      setInfo({
                        ...infoHolder,
                        pagamento: {
                          ...infoHolder.pagamento,
                          credor: value,
                        },
                      });
                    }}
                  />
                )}
                <TextInput
                  label={"Pagador"}
                  editable={editor}
                  value={
                    infoHolder.pagamento?.pagador
                      ? infoHolder.pagamento.pagador
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "pagamento.pagador": value,
                    });
                    setInfo({
                      ...infoHolder,
                      pagamento: {
                        ...infoHolder.pagamento,
                        pagador: value,
                      },
                    });
                  }}
                />
                <TextInput
                  label={"Contato pagador"}
                  editable={editor}
                  value={
                    infoHolder.pagamento?.contatoPagador
                      ? infoHolder.pagamento?.contatoPagador
                      : ""
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "pagamento.contatoPagador": value,
                    });
                    setInfo({
                      ...infoHolder,
                      pagamento: {
                        ...infoHolder.pagamento,
                        contatoPagador: value,
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                Informações da compra
              </span>
              <div className="flex gap-2 justify-center flex-wrap">
                <SelectInput
                  label={"STATUS DA LIBERAÇÃO"}
                  editable={editor}
                  value={
                    infoHolder.compra?.statusLiberacao
                      ? infoHolder.compra?.statusLiberacao
                      : "NÃO DEFINIDO"
                  }
                  options={[
                    {
                      label: "AGUARDAR CONTRATO",
                      value: "AGUARDAR CONTRATO",
                    },
                    {
                      label: "AGUARDAR PARECER DE ACESSO",
                      value: "AGUARDAR PARECER DE ACESSO",
                    },
                    {
                      label: "PAGO",
                      value: "PAGO",
                    },
                    {
                      label: "REALIZAR COMPRA",
                      value: "REALIZAR COMPRA",
                    },
                    {
                      label: "RECISÃO DE CONTRATO",
                      value: "RECISÃO DE CONTRATO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "compra.statusLiberacao": value,
                    });
                    setInfo({
                      ...infoHolder,
                      compra: {
                        ...infoHolder.compra,
                        statusLiberacao: value,
                      },
                    });
                  }}
                />
                <DateInput
                  label={"Data de liberação p/ compra"}
                  editable={false}
                  value={
                    infoHolder.compra.dataLiberacao != undefined &&
                    infoHolder.compra.dataLiberacao != "-"
                      ? new Date(infoHolder.compra.dataLiberacao)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "compra.dataLiberacao": new Date(value).toISOString(),
                    });
                    setInfo({
                      ...infoHolder,
                      compra: {
                        ...infoHolder.compra,
                        dataLiberacao: new Date(value).toISOString(),
                      },
                    });
                  }}
                />
                <DateInput
                  label={"Data do pagamento"}
                  editable={editor}
                  value={
                    infoHolder.compra?.dataPagamento != undefined &&
                    infoHolder.compra?.dataPagamento != "-"
                      ? new Date(infoHolder.compra?.dataPagamento)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "compra.dataPagamento": new Date(value).toISOString(),
                    });
                    setInfo({
                      ...infoHolder,
                      compra: {
                        ...infoHolder.compra,
                        dataPagamento: new Date(value).toISOString(),
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"Fornecedor"}
                  editable={false}
                  value={
                    infoHolder.compra?.fornecedor != undefined &&
                    infoHolder.compra.fornecedor != "-"
                      ? infoHolder.compra.fornecedor
                      : "NÃO DEFINIDO"
                  }
                  options={fornecedores.map((fornecedor) => fornecedor)}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "compra.fornecedor": value,
                    });
                    setInfo({
                      ...infoHolder,
                      compra: {
                        ...infoHolder.compra,
                        fornecedor: value,
                      },
                    });
                  }}
                />
                <TextInput
                  label={"INFORMAÇÕES DA COMPRA"}
                  value={infoHolder.compra?.informacoes}
                  editable={false}
                />
                <SelectInput
                  label={"TIPO DO KIT"}
                  value={
                    infoHolder.compra?.tipoDoKit != undefined &&
                    infoHolder.compra.tipoDoKit != "-"
                      ? infoHolder.compra.tipoDoKit
                      : "NÃO DEFINIDO"
                  }
                  editable={false}
                  options={[
                    {
                      label: "NORMAL",
                      value: "NORMAL",
                    },
                    {
                      label: "PROMO",
                      value: "PROMO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "compra:.tipoDoKit": value,
                    });
                    setInfo({
                      ...infoHolder,
                      compra: {
                        ...infoHolder.compra,
                        tipoDoKit: value,
                      },
                    });
                  }}
                />
                <NumberInput
                  tag={"R$"}
                  label={"VALOR DO KIT"}
                  editable={false}
                  value={
                    infoHolder.compra?.valorDoKit != undefined &&
                    infoHolder.compra?.valorDoKit != "-"
                      ? infoHolder.compra?.valorDoKit
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "compra.valorDoKit": Number(value),
                    });
                    setInfo({
                      ...infoHolder,
                      compra: {
                        ...infoHolder.compra,
                        valorDoKit: Number(value),
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"LOCAL DE ENTREGA"}
                  value={
                    infoHolder.compra?.localEntrega != undefined &&
                    infoHolder.compra?.localEntrega != "-"
                      ? infoHolder.compra?.localEntrega
                      : "NÃO DEFINIDO"
                  }
                  editable={false}
                  options={[
                    { label: "MESMO DO PROJETO", value: "MESMO DO PROJETO" },
                    { label: "SEM RESTRIÇÕES", value: "SEM RESTRIÇÕES" },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "compra.localEntrega": value,
                    });
                    setInfo({
                      ...infoHolder,
                      compra: {
                        ...infoHolder.compra,
                        localEntrega: value,
                      },
                    });
                  }}
                />
                <DateInput
                  label={"Previsão de entrega"}
                  editable={editor}
                  value={
                    infoHolder.compra?.previsaoEntrega != undefined &&
                    infoHolder.compra.previsaoEntrega != "-"
                      ? new Date(infoHolder.compra.previsaoEntrega)
                          .toISOString()
                          .slice(0, 10)
                      : 0
                  }
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "compra.previsaoEntrega": new Date(value).toISOString(),
                    });
                    setInfo({
                      ...infoHolder,
                      compra: {
                        ...infoHolder.compra,
                        previsaoEntrega: new Date(value).toISOString(),
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"STATUS DA ENTREGA"}
                  editable={editor}
                  value={
                    infoHolder.compra?.statusEntrega
                      ? infoHolder.compra?.statusEntrega
                      : "NÃO DEFINIDO"
                  }
                  options={[
                    {
                      label: "AGUARDANDO COMPRA",
                      value: "AGUARDANDO COMPRA",
                    },
                    {
                      label: "EM ROTA",
                      value: "EM ROTA",
                    },
                    {
                      label: "ENTREGUE",
                      value: "ENTREGUE",
                    },
                    {
                      label: "CANCELADO",
                      value: "CANCELADO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "compra.statusEntrega": value,
                    });
                    setInfo({
                      ...infoHolder,
                      compra: {
                        ...infoHolder.compra,
                        statusEntrega: value,
                      },
                    });
                  }}
                />
                <SelectInput
                  label={"INICIAR PROJETO"}
                  value={
                    infoHolder.projeto?.iniciar
                      ? infoHolder.projeto?.iniciar
                      : "NÃO DEFINIDO"
                  }
                  editable={editor}
                  options={[
                    { label: "SIM", value: "SIM" },
                    {
                      label: "CONTRATO CANCELADO",
                      value: "CONTRATO CANCELADO",
                    },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                  handleChange={(value) => {
                    setChanges({
                      ...changes,
                      "projeto.iniciar": value,
                    });
                    setInfo({
                      ...infoHolder,
                      projeto: {
                        ...infoHolder.projeto,
                        iniciar: value,
                      },
                    });
                  }}
                />
              </div>
            </div>
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

export default ModalADM;
