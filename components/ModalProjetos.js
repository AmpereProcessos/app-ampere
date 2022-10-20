import React, { useState } from "react";
import { projetistas, vendedores } from "../utils/constants";
import axios from "axios";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import Link from "next/link";
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
function ModalProjetos({ setModalIsOpen, project, editor, handleUpdates }) {
  const [infoHolder, setInfo] = useState(project);
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState("");
  function handleChanges() {
    axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
      setMsg("Alterações feitas");
      handleUpdates(project._id);
    });
  }
  function getParecerWarning(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 110) {
      return {
        text: "PARECER COM >110 DIAS",
        style: "text-red-600 border-2 border-red-600",
      };
    } else if (diffDays > 105) {
      return {
        text: "PARECER COM >105 DIAS",
        style: "text-orange-300 border-2 border-orange-300",
      };
    } else if (diffDays > 90) {
      return {
        text: "PARECER COM >90 DIAS",
        style: "text-blue-300 border-2 border-blue-300",
      };
    } else {
      return "border border-gray-200";
    }
  }
  console.log(changes);

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
              {infoHolder.parecer.dataParecerDeAcesso != undefined &&
                infoHolder.vistoria.status != "REALIZADA" && (
                  <div
                    className={`p-1 text-xs font-bold italic ${
                      getParecerWarning(
                        new Date(infoHolder.parecer.dataParecerDeAcesso),
                        new Date()
                      ).style
                    }`}
                  >
                    {
                      getParecerWarning(
                        new Date(infoHolder.parecer.dataParecerDeAcesso),
                        new Date()
                      ).text
                    }
                  </div>
                )}
              <div className="flex gap-x-2">
                {msg && <p className="text-sm italic text-green-400">{msg}</p>}
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
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({ ...changes, nomeDoContrato: value });
                      setInfo({ ...infoHolder, nomeDoContrato: value });
                    }}
                  />
                  <TextInput
                    label={"Nome do Projeto"}
                    value={infoHolder.nomeDoProjeto}
                    editable={editor}
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
                    editable={editor}
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
                    editable={editor}
                    value={infoHolder.telefone ? infoHolder.telefone : "-"}
                    handleChange={(value) => {
                      setChanges({ ...changes, telefone: value });
                      setInfo({ ...infoHolder, telefone: value });
                    }}
                  />
                  <TextInput
                    label={"Cidade"}
                    editable={editor}
                    value={infoHolder.cidade ? infoHolder.cidade : "-"}
                    handleChange={(value) => {
                      setChanges({ ...changes, cidade: value });
                      setInfo({ ...infoHolder, cidade: value });
                    }}
                  />
                  <TextInput
                    label={"CEP"}
                    editable={editor}
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
                    editable={editor}
                    value={infoHolder.bairro ? infoHolder.bairro : ""}
                    handleChange={(value) => {
                      setChanges({ ...changes, bairro: value });
                      setInfo({ ...infoHolder, bairro: value });
                    }}
                  />
                  <NumberInput
                    label={"Número da residência"}
                    editable={editor}
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
                    editable={editor}
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
                    editable={editor}
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
                    editable={editor}
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
                      editable={editor}
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
                    editable={editor}
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
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  DADOS INSTALAÇÃO CEMIG
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <TextInput
                    label={"Titular do projeto"}
                    editable={editor}
                    value={
                      infoHolder.dadosCemig?.titularProjeto
                        ? infoHolder.dadosCemig?.titularProjeto
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        dadosCemig: {
                          ...infoHolder.dadosCemig,
                          titularProjeto: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        dadosCemig: {
                          ...infoHolder.dadosCemig,
                          titularProjeto: value,
                        },
                      });
                    }}
                  />
                  <TextInput
                    label={"Número da instalação"}
                    value={
                      infoHolder.dadosCemig.numeroInstalacao
                        ? infoHolder.dadosCemig.numeroInstalacao
                        : ""
                    }
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        dadosCemig: {
                          ...infoHolder.dadosCemig,
                          numeroInstalacao: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        dadosCemig: {
                          ...infoHolder.dadosCemig,
                          numeroInstalacao: value,
                        },
                      });
                    }}
                  />
                  <SelectInput
                    label={"DISTRIBUIÇÃO DE CRÉDITOS"}
                    value={
                      infoHolder.dadosCemig.distCreditos
                        ? infoHolder.dadosCemig.distCreditos
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "SIM", value: "SIM" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        dadosCemig: {
                          ...infoHolder.dadosCemig,
                          distCreditos: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        dadosCemig: {
                          ...infoHolder.dadosCemig,
                          distCreditos: value,
                        },
                      });
                    }}
                  />
                  {infoHolder.dadosCemig.distCreditos == "SIM" && (
                    <NumberInput
                      label={"QTDE DE DISTRIBUIÇÕES"}
                      editable={editor}
                      value={
                        infoHolder.dadosCemig?.qtdeDistCreditos != undefined &&
                        infoHolder.dadosCemig?.qtdeDistCreditos != "-"
                          ? infoHolder.dadosCemig?.qtdeDistCreditos
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          dadosCemig: {
                            ...infoHolder.dadosCemig,
                            qtdeDistCreditos: Number(value),
                          },
                        });
                        setInfo({
                          ...infoHolder,
                          dadosCemig: {
                            ...infoHolder.dadosCemig,
                            qtdeDistCreditos: Number(value),
                          },
                        });
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  VISITA TÉCNICA
                </span>
                <div className="flex gap-2 justify-around flex-wrap">
                  <div>
                    <input
                      disabled={!editor}
                      checked={
                        infoHolder.visitaTecnica?.status === "REALIZADA"
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          visitaTecnica: {
                            ...infoHolder.visitaTecnica,
                            status: e.target.checked
                              ? "REALIZADA"
                              : "PENDÊNCIA",
                          },
                        });
                        setInfo({
                          ...infoHolder,
                          visitaTecnica: {
                            ...infoHolder.visitaTecnica,
                            status: e.target.checked
                              ? "REALIZADA"
                              : "PENDÊNCIA",
                          },
                        });
                      }}
                      type="checkbox"
                      name="visitaTecnica"
                      id="visitaTecnica"
                    />
                    <label className="ml-2" htmlFor="visitaTecnica">
                      REALIZADA
                    </label>
                  </div>
                  <TextInput
                    label={"TÉCNICO RESPONSÁVEL"}
                    editable={editor}
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
                    editable={editor}
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
                  PADRÃO
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"TIPO DO PADRÃO"}
                    editable={editor}
                    value={
                      infoHolder.padrao.tipo != undefined
                        ? infoHolder.padrao.tipo
                        : "N/A"
                    }
                    options={[
                      {
                        label: "CONTRA A REDE",
                        value: "CONTRA A REDE",
                      },
                      {
                        label: "A FAVOR DA REDE",
                        value: "A FAVOR DA REDE",
                      },
                      {
                        label: "CONSTRUIR",
                        value: "CONSTRUIR",
                      },
                      {
                        label: "SUBESTAÇÃO",
                        value: "SUBESTAÇÃO",
                      },
                      {
                        label: "REFORMA DE PADRÃO",
                        value: "REFORMA DE PADRÃO",
                      },
                      {
                        label: "N/A",
                        value: "N/A",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        padrao: { ...infoHolder.padrao, tipo: value },
                      });
                      setInfo({
                        ...infoHolder,
                        padrao: { ...infoHolder.padrao, tipo: value },
                      });
                    }}
                  />
                  <SelectInput
                    label={"RESPONSÁVEL INSTALAÇÃO DO PADRÃO"}
                    editable={editor}
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
                        padrao: { ...infoHolder.padrao, respInstalacao: value },
                      });
                      setInfo({
                        ...infoHolder,
                        padrao: { ...infoHolder.padrao, respInstalacao: value },
                      });
                    }}
                  />
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      AUMENTO DE CARGA
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.projeto.aumentoDeCarga === "SIM"
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            projeto: {
                              ...infoHolder.projeto,
                              aumentoDeCarga: e.target.checked ? "SIM" : "NÃO",
                              acStatus:
                                e.target.checked &&
                                infoHolder.acstatus != "REALIZADO"
                                  ? "PÊNDENCIA"
                                  : undefined,
                            },
                          });
                          setInfo({
                            ...infoHolder,
                            projeto: {
                              ...infoHolder.projeto,
                              aumentoDeCarga: e.target.checked ? "SIM" : "NÃO",
                              acStatus:
                                e.target.checked &&
                                infoHolder.acstatus != "REALIZADO"
                                  ? "PÊNDENCIA"
                                  : undefined,
                            },
                          });
                        }}
                        type="checkbox"
                        name="aumentodecarga"
                        id="aumentodecarga"
                      />
                      <label className="ml-2" htmlFor="aumentodecarga">
                        SIM
                      </label>
                    </div>
                  </div>
                  {infoHolder.projeto.aumentoDeCarga == "SIM" && (
                    <div className="flex flex-col w-[350px] items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        STATUS AUMENTO DE CARGA
                      </span>
                      <div className="flex">
                        <input
                          disabled={!editor}
                          checked={
                            infoHolder.projeto?.acStatus === "REALIZADO"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              projeto: {
                                ...infoHolder.projeto,
                                acStatus: e.target.checked
                                  ? "REALIZADO"
                                  : "PENDÊNCIA",
                              },
                            });
                            setInfo({
                              ...infoHolder,
                              projeto: {
                                ...infoHolder.projeto,
                                acStatus: e.target.checked
                                  ? "REALIZADO"
                                  : "PENDÊNCIA",
                              },
                            });
                          }}
                          type="checkbox"
                          name="acstatus"
                          id="acstatus"
                        />
                        <label className="ml-2" htmlFor="acstatus">
                          REALIZADO
                        </label>
                      </div>
                    </div>
                  )}
                  <SelectInput
                    label={"Saída do cliente"}
                    editable={editor}
                    value={
                      infoHolder.visitaTecnica.saidaDoCliente
                        ? infoHolder.visitaTecnica.saidaDoCliente
                        : "N/A"
                    }
                    options={[
                      { label: "SUBTERRANEO", value: "SUBTERRANEO" },
                      { label: "AEREO", value: "AEREO" },
                      { label: "N/A", value: "N/A" },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          saidaDoCliente: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          saidaDoCliente: value,
                        },
                      });
                    }}
                  />
                  <TextInput
                    label={"Amperagem"}
                    editable={editor}
                    value={
                      infoHolder.visitaTecnica?.amperagem
                        ? infoHolder.visitaTecnica.amperagem
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          amperagem: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        visitaTecnica: {
                          ...infoHolder.visitaTecnica,
                          amperagem: value,
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
                        sistema: {
                          ...changes.sistema,
                          qtdeModulos: Number(value),
                        },
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
                        sistema: {
                          ...changes.sistema,
                          potModulos: Number(value),
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          potModulos: Number(value),
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
                        sistema: {
                          ...changes.sistema,
                          potPico: Number(value),
                        },
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
                        sistema: {
                          ...changes.sistema,
                          topologia: value,
                        },
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
                        sistema: {
                          ...changes.sistema,
                          inversor: value,
                        },
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
                        sistema: {
                          ...changes.sistema,
                          valorProjeto: Number(value),
                        },
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
                        projeto: {
                          ...infoHolder.projeto,
                          iniciar: value,
                        },
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
                  PROJETO
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"Projetista"}
                    value={
                      infoHolder.projeto?.projetista?.nome
                        ? infoHolder.projeto?.projetista?.nome
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={projetistas.map((projetista) => {
                      return {
                        label: projetista.label,
                        value: projetista.nome,
                      };
                    })}
                    handleChange={(value) => {
                      console.log(value);
                      setChanges({
                        ...changes,
                        projeto: {
                          ...infoHolder.projeto,
                          projetista: {
                            nome: value,
                            codigo:
                              projetistas.filter(
                                (projetista) => projetista.nome == value
                              )[0].cod || "-",
                          },
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        projeto: {
                          ...infoHolder.projeto,
                          projetista: {
                            nome: value,
                            codigo:
                              projetistas.filter(
                                (projetista) => projetista.nome == value
                              )[0].cod || "-",
                          },
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"Data de assinatura da documentação"}
                    editable={editor}
                    value={
                      infoHolder.projeto.dataAssDocumentacao != undefined &&
                      infoHolder.projeto.dataAssDocumentacao != "-"
                        ? new Date(infoHolder.projeto.dataAssDocumentacao)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        projeto: {
                          ...infoHolder.projeto,
                          dataAssDocumentacao: new Date(value).toISOString(),
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        projeto: {
                          ...infoHolder.projeto,
                          dataAssDocumentacao: new Date(value).toISOString(),
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"Parecer de acesso"}
                    editable={editor}
                    value={
                      infoHolder.parecer?.dataParecerDeAcesso != undefined &&
                      infoHolder.parecer?.dataParecerDeAcesso != "-"
                        ? new Date(infoHolder.parecer?.dataParecerDeAcesso)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        parecer: {
                          ...infoHolder.parecer,
                          dataParecerDeAcesso: new Date(value).toISOString(),
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        parecer: {
                          ...infoHolder.parecer,
                          dataParecerDeAcesso: new Date(value).toISOString(),
                        },
                      });
                    }}
                  />
                  <SelectInput
                    label={"Status do parecer de acesso"}
                    value={
                      infoHolder.parecer.statusDoParecerDeAcesso
                        ? infoHolder.parecer.statusDoParecerDeAcesso
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "AGUARDANDO ASSINATURA",
                        value: "AGUARDANDO ASSINATURA",
                      },
                      {
                        label: "AGUARDANDO AUMENTO DE CARGA",
                        value: "AGUARDANDO AUMENTO DE CARGA",
                      },
                      {
                        label: "AGUARDANDO FATURAMENTO ART",
                        value: "AGUARDANDO FATURAMENTO ART",
                      },
                      {
                        label: "AGUARDANDO FORMULÁRIOS",
                        value: "AGUARDANDO FORMULÁRIOS",
                      },
                      {
                        label: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                        value: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                      },
                      {
                        label: "AGUARDANDO TROCA DE TITULARIDADE",
                        value: "AGUARDANDO TROCA DE TITULARIDADE",
                      },
                      {
                        label: "AUMENTO DE CARGA",
                        value: "AUMENTO DE CARGA",
                      },
                      {
                        label: "CANCELADO",
                        value: "CANCELADO",
                      },
                      {
                        label: "PARECER DE ACESSO APROVADO",
                        value: "PARECER DE ACESSO APROVADO",
                      },
                      {
                        label: "PENDENCIAS",
                        value: "PENDENCIAS",
                      },
                      {
                        label: "SOLICITAR ACESSO",
                        value: "SOLICITAR ACESSO",
                      },
                      {
                        label: "SOLICITAR AUMENTO DE CARGA",
                        value: "SOLICITAR AUMENTO DE CARGA",
                      },
                      {
                        label: "PARECER DE ACESSO COM OBRAS",
                        value: "PARECER DE ACESSO COM OBRAS",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        parecer: {
                          ...infoHolder.parecer,
                          statusDoParecerDeAcesso: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        parecer: {
                          ...infoHolder.parecer,
                          statusDoParecerDeAcesso: value,
                        },
                      });
                    }}
                  />
                  {infoHolder.parecer.statusDoParecerDeAcesso ==
                    "PARECER DE ACESSO COM OBRAS" && (
                    <NumberInput
                      label={"QUANTOS DIAS DE OBRA?"}
                      value={
                        infoHolder.parecer?.qtdeDiasObraDeRede != undefined
                          ? infoHolder.parecer?.qtdeDiasObraDeRede
                          : 0
                      }
                      editable={editor}
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          parecer: {
                            ...infoHolder.parecer,
                            qtdeDiasObraDeRede: Number(value),
                          },
                        });
                        setInfo({
                          ...infoHolder,
                          parecer: {
                            ...infoHolder.parecer,
                            qtdeDiasObraDeRede: Number(value),
                          },
                        });
                      }}
                    />
                  )}
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      DIAGRAMA UNIFILAR
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.projeto?.diagramaUnifilar === "Ok"
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            projeto: {
                              ...infoHolder.projeto,
                              diagramaUnifilar: e.target.checked
                                ? "Ok"
                                : "PENDÊNCIA",
                            },
                          });
                          setInfo({
                            ...infoHolder,
                            projeto: {
                              ...infoHolder.projeto,
                              diagramaUnifilar: e.target.checked
                                ? "Ok"
                                : "PENDÊNCIA",
                            },
                          });
                        }}
                        type="checkbox"
                        name="diagramaunifilar"
                        id="diagramaunifilar"
                      />
                      <label className="ml-2" htmlFor="diagramaunifilar">
                        OK
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      DESENHO DO TELHADO
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.projeto?.desenhoTelhado === "OK"
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            projeto: {
                              ...infoHolder.projeto,
                              desenhoTelhado: e.target.checked
                                ? "OK"
                                : "PENDÊNCIA",
                            },
                          });
                          setInfo({
                            ...infoHolder,
                            projeto: {
                              ...infoHolder.projeto,
                              desenhoTelhado: e.target.checked
                                ? "OK"
                                : "PENDÊNCIA",
                            },
                          });
                        }}
                        type="checkbox"
                        name="desenhotelhado"
                        id="desenhotelhado"
                      />
                      <label className="ml-2" htmlFor="desenhotelhado">
                        OK
                      </label>
                    </div>
                  </div>
                  <SelectInput
                    label={"MAPA DE MICRO"}
                    editable={editor}
                    value={
                      infoHolder.projeto?.mapaDeMicro != undefined &&
                      infoHolder.projeto?.mapaDeMicro != "-"
                        ? infoHolder.projeto?.mapaDeMicro
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "OK", value: "OK" },
                      { label: `N\A`, value: `N\A` },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        projeto: {
                          ...infoHolder.projeto,
                          mapaDeMicro: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        projeto: {
                          ...infoHolder.projeto,
                          mapaDeMicro: value,
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"DATA DO PEDIDO DE VISTORIA"}
                    editable={editor}
                    value={
                      infoHolder.vistoria?.dataPedido != undefined &&
                      infoHolder.vistoria?.dataPedido != "-"
                        ? new Date(infoHolder.vistoria.dataPedido)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        vistoria: {
                          ...infoHolder.vistoria,
                          dataPedido: new Date(value).toISOString(),
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        vistoria: {
                          ...infoHolder.vistoria,
                          dataPedido: new Date(value).toISOString(),
                        },
                      });
                    }}
                  />
                  <SelectInput
                    label={"STATUS DA VISTORIA"}
                    value={
                      infoHolder.vistoria?.status
                        ? infoHolder.vistoria.status
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "REALIZADA", value: "REALIZADA" },
                      {
                        label: "AGUARDANDO OBRA DE REDE",
                        value: "AGUARDANDO OBRA DE REDE",
                      },
                      {
                        label: "AGUARDANDO CONCESSIONARIA",
                        value: "AGUARDANDO CONCESSIONARIA",
                      },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        vistoria: {
                          ...infoHolder.vistoria,
                          status: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        vistoria: {
                          ...infoHolder.vistoria,
                          status: value,
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"DATA TROCA DO MEDIDOR"}
                    editable={editor}
                    value={
                      infoHolder.medidor?.data != undefined &&
                      infoHolder.medidor?.data != "-"
                        ? new Date(infoHolder.medidor.data)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        medidor: {
                          ...infoHolder.medidor,
                          data: new Date(value).toISOString(),
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        medidor: {
                          ...infoHolder.medidor,
                          data: new Date(value).toISOString(),
                        },
                      });
                    }}
                  />
                  <SelectInput
                    label={"STATUS DA TROCA DO MEDIDOR"}
                    value={
                      infoHolder.medidor?.status
                        ? infoHolder.medidor?.status
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "REALIZADA", value: "REALIZADA" },
                      {
                        label: "AGUARDANDO OBRA DE REDE",
                        value: "AGUARDANDO OBRA DE REDE",
                      },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        medidor: {
                          ...infoHolder.medidor,
                          status: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        medidor: {
                          ...infoHolder.medidor,
                          status: value,
                        },
                      });
                    }}
                  />
                  <div className="flex w-full justify-around items-center">
                    <div className="flex flex-col w-[350px] items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        HOUVE REPROVA (PARECER) ?
                      </span>
                      <div className="flex">
                        <input
                          disabled={!editor}
                          checked={
                            infoHolder.parecer.parecerReprovado === "SIM"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              parecer: {
                                ...infoHolder.parecer,
                                parecerReprovado: e.target.checked
                                  ? "SIM"
                                  : "NÃO",
                              },
                            });
                            setInfo({
                              ...infoHolder,
                              parecer: {
                                ...infoHolder.parecer,
                                parecerReprovado: e.target.checked
                                  ? "SIM"
                                  : "NÃO",
                              },
                            });
                          }}
                          type="checkbox"
                          name="parecerReprovado"
                          id="parecerReprovado"
                        />
                        <label className="ml-2" htmlFor="parecerReprovado">
                          SIM
                        </label>
                      </div>
                    </div>
                    {infoHolder.parecer.parecerReprovado == "SIM" && (
                      <NumberInput
                        label={"QTDE DE REPROVAS"}
                        value={
                          infoHolder.parecer?.qtdeReprovas
                            ? infoHolder.parecer?.qtdeReprovas
                            : 0
                        }
                        editable={editor}
                        handleChange={(value) => {
                          setChanges({
                            ...changes,
                            parecer: {
                              ...infoHolder.parecer,
                              qtdeReprovas: Number(value),
                            },
                          });
                          setInfo({
                            ...infoHolder,
                            parecer: {
                              ...infoHolder.parecer,
                              qtdeReprovas: Number(value),
                            },
                          });
                        }}
                      />
                    )}
                    {infoHolder.parecer.parecerReprovado == "SIM" && (
                      <div className="flex flex-col grow items-center">
                        <span className="uppercase font-bold font-raleway text-center text-sm">
                          MOTIVO DA REPROVA
                        </span>
                        <input
                          className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
                          value={
                            infoHolder.parecer.motivoReprova
                              ? infoHolder.parecer.motivoReprova
                              : ""
                          }
                          readOnly={!editor}
                          placeholder={"Informação a preencher..."}
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              parecer: {
                                ...infoHolder.parecer,
                                motivoReprova: e.target.value,
                              },
                            });
                            setInfo({
                              ...infoHolder,
                              parecer: {
                                ...infoHolder.parecer,
                                motivoReprova: e.target.value,
                              },
                            });
                          }}
                          type="text"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex w-full justify-around items-center">
                    <div className="flex flex-col w-[350px] items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        HOUVE REPROVA (VISTORIA) ?
                      </span>
                      <div className="flex">
                        <input
                          disabled={!editor}
                          checked={
                            infoHolder.vistoria.vistoriaReprovada === "SIM"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              vistoria: {
                                ...infoHolder.vistoria,
                                vistoriaReprovada: e.target.checked
                                  ? "SIM"
                                  : "NÃO",
                              },
                            });
                            setInfo({
                              ...infoHolder,
                              vistoria: {
                                ...infoHolder.vistoria,
                                vistoriaReprovada: e.target.checked
                                  ? "SIM"
                                  : "NÃO",
                              },
                            });
                          }}
                          type="checkbox"
                          name="vistoriaReprovada"
                          id="vistoriaReprovada"
                        />
                        <label className="ml-2" htmlFor="vistoriaReprovada">
                          SIM
                        </label>
                      </div>
                    </div>
                    {infoHolder.vistoria.vistoriaReprovada == "SIM" && (
                      <NumberInput
                        label={"QTDE DE REPROVAS"}
                        value={
                          infoHolder.vistoria.qtdeReprovas
                            ? infoHolder.vistoria.qtdeReprovas
                            : 0
                        }
                        editable={editor}
                        handleChange={(value) => {
                          setChanges({
                            ...changes,
                            vistoria: {
                              ...infoHolder.vistoria,
                              qtdeReprovas: Number(value),
                            },
                          });
                          setInfo({
                            ...infoHolder,
                            vistoria: {
                              ...infoHolder.vistoria,
                              qtdeReprovas: Number(value),
                            },
                          });
                        }}
                      />
                    )}
                    {infoHolder.vistoria.vistoriaReprovada == "SIM" && (
                      <div className="flex flex-col grow items-center">
                        <span className="uppercase font-bold font-raleway text-center text-sm">
                          MOTIVO DA REPROVA
                        </span>
                        <input
                          className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
                          value={
                            infoHolder.vistoria?.motivoReprova
                              ? infoHolder.vistoria?.motivoReprova
                              : ""
                          }
                          readOnly={!editor}
                          placeholder={"Informação a preencher..."}
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              vistoria: {
                                ...infoHolder.vistoria,
                                motivoReprova: e.target.value,
                              },
                            });
                            setInfo({
                              ...infoHolder,
                              vistoria: {
                                ...infoHolder.vistoria,
                                motivoReprova: e.target.value,
                              },
                            });
                          }}
                          type="text"
                        />
                      </div>
                    )}
                    {infoHolder.vistoria.vistoriaReprovada == "SIM" && (
                      <div className="flex flex-col w-[350px] items-center">
                        <span className="uppercase font-bold font-raleway text-center text-sm">
                          EQUIPE DE CAMPO NECESSÁRIA
                        </span>
                        <div className="flex">
                          <input
                            disabled={!editor}
                            checked={
                              infoHolder.vistoria.equipeDeCampoNecessaria ===
                              "SIM"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setChanges({
                                ...changes,
                                vistoria: {
                                  ...infoHolder.vistoria,
                                  equipeDeCampoNecessaria: e.target.checked
                                    ? "SIM"
                                    : "NÃO",
                                },
                              });
                              setInfo({
                                ...infoHolder,
                                vistoria: {
                                  ...infoHolder.vistoria,
                                  equipeDeCampoNecessaria: e.target.checked
                                    ? "SIM"
                                    : "NÃO",
                                },
                              });
                            }}
                            type="checkbox"
                            name="equipeDeCampoNecessaria"
                            id="equipeDeCampoNecessaria"
                          />
                          <label
                            className="ml-2"
                            htmlFor="equipeDeCampoNecessaria"
                          >
                            SIM
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      PROJETO CONCLUÍDO
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.projeto?.projetoConcluido === "SIM"
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            projeto: {
                              ...infoHolder.projeto,
                              projetoConcluido: e.target.checked
                                ? "SIM"
                                : "NÃO",
                            },
                          });
                          setInfo({
                            ...infoHolder,
                            projeto: {
                              ...infoHolder.projeto,
                              projetoConcluido: e.target.checked
                                ? "SIM"
                                : "NÃO",
                            },
                          });
                        }}
                        type="checkbox"
                        name="projetoconcluido"
                        id="projetoconcluido"
                      />
                      <label className="ml-2" htmlFor="projetoconcluido">
                        SIM
                      </label>
                    </div>
                  </div>
                  {infoHolder.vistoria.equipeDeCampoNecessaria == "SIM" && (
                    <div className="flex justify-center">
                      <Link href={`/ordemDeServico/${project._id}`}>
                        <button className="p-2 bg-[#fead61] font-bold rounded">
                          GERAR OS
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  Informações sobre a obra
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"Laudo"}
                    value={
                      infoHolder.obra?.laudo
                        ? infoHolder.obra?.laudo
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "EM ESTUDO", value: "EM ESTUDO" },
                      { label: "EMITIDO", value: "EMITIDO" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        obra: {
                          ...infoHolder.obra,
                          laudo: value,
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        obra: {
                          ...infoHolder.obra,
                          laudo: value,
                        },
                      });
                    }}
                  />
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      SOLICITAÇÃO DA OBRA
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.obra?.statusSolicitacao === "SOLICITADA"
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            obra: {
                              ...infoHolder.obra,
                              statusSolicitacao: e.target.checked
                                ? "SOLICITADA"
                                : "NÃO SOLICITADA",
                            },
                          });
                          setInfo({
                            ...infoHolder,
                            obra: {
                              ...infoHolder.obra,
                              statusSolicitacao: e.target.checked
                                ? "SOLICITADA"
                                : "NÃO SOLICITADA",
                            },
                          });
                        }}
                        type="checkbox"
                        name="solicitacaoobra"
                        id="solicitacaoobra"
                      />
                      <label className="ml-2" htmlFor="solicitacaoobra">
                        SOLICITADA
                      </label>
                    </div>
                  </div>
                  <DateInput
                    label={"ENTRADA NA OBRA"}
                    editable={editor}
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
                        obra: {
                          ...infoHolder.obra,
                          entrada: new Date(value).toISOString(),
                        },
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
                    editable={editor}
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
                        obra: {
                          ...infoHolder.obra,
                          saida: new Date(value).toISOString(),
                        },
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
                    label={"EQUIPE RESPONSÁVEL"}
                    editable={editor}
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
                    options={[
                      {
                        label: "EQUIPE 1 - JOSÉ ROBERTO",
                        value: "EQUIPE 1 - JOSÉ ROBERTO",
                      },
                      {
                        label: "EQUIPE 2 - EDUARDO",
                        value: "EQUIPE 2-EDUARDO",
                      },
                      {
                        label: "EQUIPE 3 - EDMAR",
                        value: "EQUIPE 3-EDIMAR",
                      },
                      {
                        label: "EQUIPE 4 - ERICK",
                        value: "EQUIPE 4-ERICK",
                      },
                      {
                        label: "EQUIPE 5 - JUNIN",
                        value: "EQUIPE 5-JUNIN",
                      },
                      {
                        label: "EQUIPE 6 - FELIPE",
                        value: "EQUIPE 6-FELIPE",
                      },
                      {
                        label: "EQUIPE 7 - ADENILSON",
                        value: "EQUIPE 7- ADENILSON",
                      },
                      {
                        label: "EQUIPE 8 - GERSON",
                        value: "EQUIPE 8-GERSON",
                      },
                      {
                        label: "EQUIPE 9 - REGINALDO",
                        value: "EQUIPE 9 - REGINALDO",
                      },
                      {
                        label: "EQUIPE 10 - LUIZ",
                        value: "EQUIPE 10 - LUIZ",
                      },
                      {
                        label: "EQUIPE 11 - GILMAR",
                        value: "EQUIPE 11 - GILMAR",
                      },
                      {
                        label: "EQUIPE 12 - MARCUS V.",
                        value: "EQUIPE 12 - MARCUS V.",
                      },
                      {
                        label: "EQUIPE 13 - EDUARDO FRANCO",
                        value: "EQUIPE 13 - EDUARDO FRANCO",
                      },
                      {
                        label: "EQUIPE 15 - MARCOS B.",
                        value: "EQUIPE 15 - MARCOS B.",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        obra: {
                          ...infoHolder.obra,
                          equipeResp: value,
                        },
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
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      CHECKLIST OBRA
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.obra?.checklist === "SIM" ? true : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            obra: {
                              ...infoHolder.obra,
                              checklist: e.target.checked ? "SIM" : "NÃO",
                            },
                          });
                          setInfo({
                            ...infoHolder,
                            obra: {
                              ...infoHolder.obra,
                              checklist: e.target.checked ? "SIM" : "NÃO",
                            },
                          });
                        }}
                        type="checkbox"
                        name="checklistobra"
                        id="checklistobra"
                      />
                      <label className="ml-2" htmlFor="checklistobra">
                        SIM
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      TRAFO
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.obra?.trafo === "SIM" ? true : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            obra: {
                              ...infoHolder.obra,
                              trafo: e.target.checked ? "SIM" : "NÃO",
                            },
                          });
                          setInfo({
                            ...infoHolder,
                            obra: {
                              ...infoHolder.obra,
                              trafo: e.target.checked ? "SIM" : "NÃO",
                            },
                          });
                        }}
                        type="checkbox"
                        name="trafo"
                        id="trafo"
                      />
                      <label className="ml-2" htmlFor="trafo">
                        SIM
                      </label>
                    </div>
                  </div>
                  <SelectInput
                    label={"STATUS DA OBRA"}
                    value={
                      infoHolder.obra?.statusDaObra
                        ? infoHolder.obra?.statusDaObra
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
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
                        obra: {
                          ...infoHolder.obra,
                          statusDaObra: value,
                        },
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
                  <div className="flex flex-col w-[450px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      OBSERVAÇÕES
                    </span>
                    <textarea
                      readOnly={!editor}
                      value={
                        infoHolder.obra.observacoes
                          ? infoHolder.obra.observacoes
                          : ""
                      }
                      placeholder={"Observações da obra aqui..."}
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          obra: {
                            ...infoHolder.obra,
                            observacoes: e.target.value,
                          },
                        });
                        setInfo({
                          ...infoHolder,
                          obra: {
                            ...infoHolder.obra,
                            observacoes: e.target.value,
                          },
                        });
                      }}
                      className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalProjetos;
