import React, { useState } from "react";
import axios from "axios";
import { vendedores } from "../utils/constants";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
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
  project,
  editor,
  ppsEditor,
  handleUpdates,
  credentials,
}) {
  const [infoHolder, setInfo] = useState(project);
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({ text: "", color: "" });
  async function handleChanges() {
    if (validateChanges().liberar) {
      let { data } = await axios.post("/api/changes", {
        usuario: credentials.nome,
        mudancas: changes,
        projetoMudado: project._id,
      });
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
  console.log(changes);
  console.log(infoHolder);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {infoHolder.qtde} - {infoHolder.nomeDoContrato}
              </h1>
              {infoHolder.codigoSVB && (
                <p className="text-gray-600 text-sm font-bold">
                  #{infoHolder.codigoSVB}
                </p>
              )}
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
                  <TextInput
                    label={"Cidade"}
                    editable={false}
                    value={infoHolder.cidade ? infoHolder.cidade : "-"}
                    handleChange={(value) => {
                      setChanges({ ...changes, cidade: value });
                      setInfo({ ...infoHolder, cidade: value });
                    }}
                  />
                  <TextInput
                    label={"CEP"}
                    editable={false}
                    value={
                      infoHolder.cep
                        ? formataCEP(infoHolder.cep.toString())
                        : "-"
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, cep: value });
                      setInfo({ ...infoHolder, cep: value });
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
                        label: "REGIONAL UBERLÂNDIA",
                        value: "REGIONAL UBERLÂNDIA",
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
                          vendedor: {
                            ...infoHolder.vendedor,
                            nome: value,
                            codigo:
                              vendedores.filter(
                                (vendedor) => vendedor.nome == value
                              )[0].cod || "-",
                          },
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
                    editable={false}
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
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  VISITA TÉCNICA
                </span>
                <div className="flex gap-2 justify-around flex-wrap">
                  <TextInput
                    label={"TÉCNICO RESPONSÁVEL"}
                    editable={false}
                    value={
                      infoHolder.visitaTecnica.tecnico
                        ? infoHolder.visitaTecnica.tecnico
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          tecnico: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          tecnico: value,
                        },
                      });
                    }}
                  />
                  <TextInput
                    label={"Tipo da telha"}
                    editable={false}
                    value={
                      infoHolder.visitaTecnica?.tipoDaTelha
                        ? infoHolder.visitaTecnica?.tipoDaTelha
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          tipoDaTelha: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          tipoDaTelha: value,
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
                    editable={editor}
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
                        "sistema.potPico":
                          Number(infoHolder.sistema?.potModulos * value) / 1000,
                      });
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          qtdeModulos: Number(value),
                          potPico:
                            Number(infoHolder.sistema?.potModulos * value) /
                            1000,
                        },
                      });
                    }}
                  />
                  <NumberInput
                    unit={"W"}
                    label={"POTÊNCIA DOS MÓDULOS"}
                    editable={editor}
                    value={
                      infoHolder.sistema?.potModulos != undefined &&
                      infoHolder.sistema?.potModulos != "-"
                        ? infoHolder.sistema?.potModulos
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "sistema.potModulos": Number(value),
                        "sistema.potPico":
                          Number(value * infoHolder.sistema?.qtdeModulos) /
                          1000,
                      });
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          potModulos: Number(value),
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
                    editable={editor}
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
                    editable={editor}
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
                    editable={editor}
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
                    editable={editor}
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
                          ...infoHolder.sistema,
                          valorProjeto: Number(value),
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
                      infoHolder.compra?.dataLiberacao != undefined &&
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
                        "compra.dataPagamento": isNaN(value)
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          dataPagamento: isNaN(value)
                            ? new Date(value).toISOString()
                            : null,
                        },
                      });
                    }}
                  />
                  <SelectInput
                    label={"Fornecedor"}
                    editable={editor}
                    value={
                      infoHolder.compra?.fornecedor != undefined &&
                      infoHolder.compra.fornecedor != "-"
                        ? infoHolder.compra.fornecedor
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      {
                        label: "ALDO",
                        value: "ALDO",
                      },
                      {
                        label: "AMPÈRE",
                        value: "AMPÈRE",
                      },
                      {
                        label: "BEL ENERGY",
                        value: "BEL ENERGY",
                      },
                      {
                        label: "SKY SOLAR",
                        value: "SKY SOLAR",
                      },
                      {
                        label: "SOU ENERGY",
                        value: "SOU ENERGY",
                      },
                      {
                        label: "FORTLEV",
                        value: "FORTLEV",
                      },
                      {
                        label: "GENYX",
                        value: "GENYX",
                      },
                      {
                        label: "MEGACOMM",
                        value: "MEGACOMM",
                      },
                      {
                        label: "FORTESOL",
                        value: "FORTESOL",
                      },
                      {
                        label: "EDMOND",
                        value: "EDMOND",
                      },
                      {
                        label: "AMARA",
                        value: "AMARA",
                      },
                      {
                        label: "ECORI",
                        value: "ECORI",
                      },
                      {
                        label: "RIBEIRO",
                        value: "RIBEIRO",
                      },
                      {
                        label: "TEN BRASIL",
                        value: "TEN BRASIL",
                      },
                      {
                        label: "ESFERA",
                        value: "ESFERA",
                      },
                      {
                        label: "ELSYS",
                        value: "ELSYS",
                      },
                      {
                        label: "GEL SOLAR",
                        value: "GEL SOLAR",
                      },
                      {
                        label: "HELTE",
                        value: "HELTE",
                      },
                      {
                        label: "LOJA ELÉTRICA",
                        value: "LOJA ELÉTRICA",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
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
                  <SelectInput
                    label={"TIPO DO KIT"}
                    value={
                      infoHolder.compra?.tipoDoKit != undefined &&
                      infoHolder.compra.tipoDoKit != "-"
                        ? infoHolder.compra.tipoDoKit
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
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
                        "compra.tipoDoKit": value,
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
                    editable={editor}
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
                    editable={editor}
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
                  <TextInput
                    label={"INFORMAÇÕES"}
                    value={
                      infoHolder.compra?.informacoes
                        ? infoHolder.compra?.informacoes
                        : ""
                    }
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "compra.informacoes": value,
                      });
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          informacoes: value,
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"Data do pedido"}
                    editable={editor}
                    value={
                      infoHolder.compra.dataPedido != undefined &&
                      infoHolder.compra.dataPedido != "-"
                        ? new Date(infoHolder.compra.dataPedido)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "compra.dataPedido": isNaN(value)
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          dataPedido: isNaN(value)
                            ? new Date(value).toISOString()
                            : null,
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"Previsão de entrega"}
                    editable={editor}
                    value={
                      infoHolder.compra.previsaoEntrega != undefined &&
                      infoHolder.compra.previsaoEntrega != "-"
                        ? new Date(infoHolder.compra.previsaoEntrega)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "compra.previsaoEntrega": isNaN(value)
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          previsaoEntrega: isNaN(value)
                            ? new Date(value).toISOString()
                            : null,
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"Data de entrega"}
                    editable={editor}
                    value={
                      infoHolder.compra.dataEntrega != undefined &&
                      infoHolder.compra.dataEntrega != "-"
                        ? new Date(infoHolder.compra.dataEntrega)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "compra.dataEntrega": isNaN(value)
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          dataEntrega: isNaN(value)
                            ? new Date(value).toISOString()
                            : null,
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
                  <TextInput
                    label={"RASTREIO"}
                    editable={editor}
                    value={
                      infoHolder.compra.rastreio
                        ? infoHolder.compra.rastreio
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "compra.rastreio": value,
                      });
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          rastreio: value,
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
                        "faturamento.dataFaturamento": isNaN(value)
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        faturamento: {
                          ...infoHolder.faturamento,
                          dataFaturamento: isNaN(value)
                            ? new Date(value).toISOString()
                            : null,
                        },
                      });
                    }}
                  />
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      RELATÓRIO DE COMISS. SUPRIMENTOS
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.comissionamento?.suprimentos ? true : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "comissionamento.suprimentos": e.target.checked,
                          });
                          setInfo({
                            ...infoHolder,
                            comissionamento: {
                              ...infoHolder.comissionamento,
                              suprimentos: e.target.checked,
                            },
                          });
                        }}
                        type="checkbox"
                        name="comissionamentoSuprimentos"
                        id="comissionamentoSuprimentos"
                      />
                      <label
                        className="ml-2"
                        htmlFor="comissionamentoSuprimentos"
                      >
                        OK
                      </label>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center gap-x-4">
                    <div className="flex flex-col w-[450px] self-center mt-2 items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        INFORMAÇÕES DO KIT
                      </span>
                      <textarea
                        readOnly={!editor}
                        value={
                          infoHolder.compra.kitInfo
                            ? infoHolder.compra.kitInfo
                            : ""
                        }
                        placeholder={"Observações do material aqui..."}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "compra.kitInfo": e.target.value,
                          });
                          setInfo({
                            ...infoHolder,
                            compra: {
                              ...infoHolder.compra,
                              kitInfo: e.target.value,
                            },
                          });
                        }}
                        className="w-full mb-2 text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                      />
                    </div>
                    <div className="flex flex-col w-[450px] self-center mt-2 items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        MATERIAL FALTANTE
                      </span>
                      <textarea
                        readOnly={!editor}
                        value={
                          infoHolder.material.materialFaltante
                            ? infoHolder.material.materialFaltante
                            : ""
                        }
                        placeholder={"Observações do material aqui..."}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "material.materialFaltante": e.target.value,
                          });
                          setInfo({
                            ...infoHolder,
                            material: {
                              ...infoHolder.material,
                              materialFaltante: e.target.value,
                            },
                          });
                        }}
                        className="w-full mb-2 text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  PAGAMENTO
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalSuprimentos;
