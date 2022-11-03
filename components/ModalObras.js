import React, { useState } from "react";
import axios from "axios";
import { vendedores } from "../utils/constants";
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
function ModalObras({
  open,
  setModalIsOpen,
  project,
  editor,
  handleUpdates,
  credentials,
}) {
  const [infoHolder, setInfo] = useState(project);
  const [msg, setMsg] = useState("");
  const [osMsg, setOsMsg] = useState({
    text: "",
    color: "text-red-500",
  });
  const [changes, setChanges] = useState({});
  const [osInfo, setOsInfo] = useState({
    categoria: "NÃO DEFINIDO",
    servicoExecutado: "",
    realizarCobranca: false,
    valorCobranca: 0,
    usuarioEmissor: "",
    grauDeUrgencia: "NÃO DEFINIDO",
    observacoes: "",
    dataDeAbertura: new Date(),
  });
  async function handleChanges() {
    let { data } = await axios.post("/api/changes", {
      usuario: credentials.nome,
      mudancas: changes,
      projetoMudado: project._id,
    });
    axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
      setMsg("Alterações feitas");
      handleUpdates(project._id);
    });
  }
  console.log(infoHolder);
  function handleOSChanges(id, index, date) {
    axios
      .put("/api/ordensDeServico/realizarCobranca", {
        id: id,
        index: index,
        date: date,
      })
      .then((res) => handleUpdates(project._id));
  }
  function handleOSCreation() {
    var arr;
    if (osInfo.servicoExecutado.trim().length < 5) {
      setOsMsg({
        text: "Por favor, preencha o serviço a ser executado.",
        color: "text-red-500",
      });
      return;
    } else {
      if (
        infoHolder.ordensDeServico != undefined &&
        infoHolder.ordensDeServico?.length > 0
      ) {
        infoHolder.ordensDeServico.push({
          ...osInfo,
          usuarioEmissor: credentials.nome,
          index: infoHolder.ordensDeServico?.length,
          cobrancaRealizada: false,
        });
        arr = infoHolder.ordensDeServico;
      } else {
        arr = [
          {
            ...osInfo,
            usuarioEmissor: credentials.nome,
            index: 0,
            cobrancaRealizada: false,
          },
        ];
        infoHolder.ordensDeServico = arr;
      }
      axios
        .post("/api/ordensDeServico", { id: project._id, arr: arr })
        .then((res) => {
          setOsMsg({
            text: "Ordem de serviço gerada",
            color: "text-green-500",
          });
          setOsInfo({
            categoria: "NÃO DEFINIDO",
            servicoExecutado: "",
            realizarCobranca: false,
            valorCobranca: 0,
            usuarioEmissor: "",
            grauDeUrgencia: "NÃO DEFINIDO",
            observacoes: "",
            dataDeAbertura: new Date(),
          });
          handleUpdates(project._id);
        });
    }
  }
  console.log(osInfo);
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
                        : ""
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
                    value={infoHolder.telefone ? infoHolder.telefone : ""}
                    handleChange={(value) => {
                      setChanges({ ...changes, telefone: value });
                      setInfo({ ...infoHolder, telefone: value });
                    }}
                  />
                  <TextInput
                    label={"Cidade"}
                    editable={false}
                    value={infoHolder.cidade ? infoHolder.cidade : ""}
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
                        "obra.laudo": value,
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
                      AUMENTO DE CARGA
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.projeto?.aumentoDeCarga === "SIM"
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "projeto.aumentoDeCarga": e.target.checked
                              ? "SIM"
                              : "NÃO",
                            "projeto.acStatus":
                              e.target.checked &&
                              infoHolder.acstatus != "REALIZADO"
                                ? "PÊNDENCIA"
                                : undefined,
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
                    <SelectInput
                      label={"STATUS AUMENTO DE CARGA"}
                      editable={editor}
                      value={
                        infoHolder.projeto.acStatus
                          ? infoHolder.projeto.acStatus
                          : "NÃO DEFINIDO"
                      }
                      options={[
                        {
                          label: "PENDÊNCIA",
                          value: "PENDÊNCIA",
                        },
                        {
                          label: "REALIZADO",
                          value: "REALIZADO",
                        },
                        {
                          label: "SOLICITADO COM G.D",
                          value: "SOLICITADO COM G.D",
                        },
                      ]}
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          "projeto.acStatus": value,
                        });
                        setInfo({
                          ...infoHolder,
                          projeto: {
                            ...infoHolder.projeto,
                            acStatus: value,
                          },
                        });
                      }}
                    />
                  )}
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
                            "obra.statusSolicitacao": e.target.checked
                              ? "SOLICITADA"
                              : "NÃO SOLICITADA",
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
                  <TextInput
                    label={"Status entrega dos equipamentos"}
                    editable={false}
                    value={
                      infoHolder.compra.statusEntrega
                        ? infoHolder.compra.statusEntrega
                        : "-"
                    }
                  />
                  <DateInput
                    label={"PREVISÃO/ENTREGA DOS EQUIPAMENTOS"}
                    editable={false}
                    value={
                      infoHolder.compra.previsaoEntrega != undefined &&
                      infoHolder.compra.previsaoEntrega != "-"
                        ? new Date(infoHolder.compra.previsaoEntrega)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                  />
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
                            "obra.checklist": e.target.checked ? "SIM" : "NÃO",
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
                            "obra.trafo": e.target.checked ? "SIM" : "NÃO",
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
                        label: "CASA EM CONSTRUÇÃO",
                        value: "CASA EM CONSTRUÇÃO",
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
                        "visitaTecnica.saidaDoCliente": value,
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
                        "visitaTecnica.amperagem": value,
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
                <div className="flex flex-col w-[450px] self-center mt-2 items-center">
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
                        "obra.observacoes": e.target.value,
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
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  ORDENS DE SERVIÇO
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"CATEGORIA DA OS"}
                    value={osInfo.categoria}
                    editable={editor}
                    options={[
                      { label: "PADRÃO", value: "PADRÃO" },
                      { label: "ESTRUTURA", value: "ESTRUTURA" },
                      { label: "MONTAGEM", value: "MONTAGEM" },
                      {
                        label: "MANUTENÇÃO PREVENTIVA",
                        value: "MANUTENÇÃO PREVENTIVA",
                      },
                      {
                        label: "MANUTENÇÃO CORRETIVA",
                        value: "MANUTENÇÃO CORRETIVA",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) =>
                      setOsInfo({
                        ...osInfo,
                        categoria: value,
                        servicoExecutado: "",
                        realizarCobranca: false,
                        valorCobranca: 0,
                        usuarioEmissor: "",
                        grauDeUrgencia: "NÃO DEFINIDO",
                        observacoes: "",
                      })
                    }
                  />
                  <TextInput
                    label={"Serviço a ser executado"}
                    value={osInfo.servicoExecutado}
                    editable={editor}
                    handleChange={(value) =>
                      setOsInfo({ ...osInfo, servicoExecutado: value })
                    }
                  />
                  <div>
                    <input
                      disabled={!editor}
                      checked={osInfo.realizarCobranca}
                      onChange={(e) =>
                        setOsInfo({
                          ...osInfo,
                          realizarCobranca: e.target.checked,
                        })
                      }
                      type="checkbox"
                      name="realizarCobranca"
                      id="realizarCobranca"
                    />
                    <label className="ml-2" htmlFor="realizarCobranca">
                      REALIZAR COBRANÇA
                    </label>
                  </div>
                  <NumberInput
                    label={"VALOR DO SERVIÇO A COBRAR"}
                    value={osInfo.valorCobranca}
                    editable={editor}
                    handleChange={(value) =>
                      setOsInfo({ ...osInfo, valorCobranca: Number(value) })
                    }
                  />
                  <SelectInput
                    label={"GRAU DE URGÊNCIA"}
                    value={osInfo.grauDeUrgencia}
                    editable={editor}
                    options={[
                      { label: "EMERGÊNCIA", value: "EMERGÊNCIA" },
                      { label: "URGENTE", value: "URGENTE" },
                      { label: "POUCO URGENTE", value: "POUCO URGENTE" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) =>
                      setOsInfo({ ...osInfo, grauDeUrgencia: value })
                    }
                  />
                  <DateInput
                    label={"DATA DE ABERTURA"}
                    editable={editor}
                    value={new Date(osInfo.dataDeAbertura)
                      .toISOString()
                      .slice(0, 10)}
                    handleChange={(value) =>
                      setOsInfo({
                        ...osInfo,
                        dataDeAbertura: new Date(value).toISOString(),
                      })
                    }
                  />
                  {osInfo.categoria == "MANUTENÇÃO PREVENTIVA" && (
                    <>
                      <div className="flex pl-2 items-center">
                        <input
                          disabled={!editor}
                          checked={osInfo.configurar ? true : false}
                          onChange={(e) =>
                            setOsInfo({
                              ...osInfo,
                              configurar: e.target.checked,
                            })
                          }
                          type="checkbox"
                          name="configurar"
                          id="configurar"
                        />
                        <label className="ml-2" htmlFor="configurar">
                          CONFIGURAR
                        </label>
                      </div>
                      <TextInput
                        label={"Modelo Micro/inversor"}
                        editable={editor}
                        value={osInfo.inversor ? osInfo.inversor : ""}
                        handleChange={(value) =>
                          setOsInfo({
                            ...osInfo,
                            inversor: value.toUpperCase(),
                          })
                        }
                      />
                      <TextInput
                        label={"SENHA DO WIFI"}
                        editable={editor}
                        normalCase={true}
                        value={osInfo.senhaDoWifi ? osInfo.senhaDoWifi : ""}
                        handleChange={(value) =>
                          setOsInfo({
                            ...osInfo,
                            senhaDoWifi: value,
                          })
                        }
                      />
                      <TextInput
                        label={"PONTO DE AGUA"}
                        editable={editor}
                        normalCase={true}
                        value={osInfo.pontoDeAgua ? osInfo.pontoDeAgua : ""}
                        handleChange={(value) =>
                          setOsInfo({ ...osInfo, pontoDeAgua: value })
                        }
                      />
                      <div className="flex pl-2 items-center">
                        <input
                          disabled={!editor}
                          checked={osInfo.trafo ? true : false}
                          onChange={(e) =>
                            setOsInfo({
                              ...osInfo,
                              trafo: e.target.checked,
                            })
                          }
                          type="checkbox"
                          name="trafo"
                          id="trafo"
                        />
                        <label className="ml-2" htmlFor="trafo">
                          TRAFO
                        </label>
                      </div>
                    </>
                  )}
                </div>
                {osInfo.categoria != "MONTAGEM" &&
                  osInfo.categoria != "NÃO DEFINIDO" && (
                    <div className="flex flex-col w-[450px] self-center mt-2 items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        OBSERVAÇÕES DA OS
                      </span>
                      <textarea
                        readOnly={!editor}
                        value={osInfo.observacoes}
                        onChange={(e) =>
                          setOsInfo({ ...osInfo, observacoes: e.target.value })
                        }
                        placeholder="Observações da OS..."
                        className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                      />
                    </div>
                  )}
                {osMsg.text.length > 0 && (
                  <p className={`text-center ${osMsg.color} italic`}>
                    {osMsg.text}
                  </p>
                )}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleOSCreation}
                    className="p-2 bg-[#fead61] font-bold rounded"
                  >
                    GERAR OS DE OBRA
                  </button>
                </div>
                {infoHolder.ordensDeServico != undefined &&
                  infoHolder.ordensDeServico?.length > 0 && (
                    <div className="w-full flex flex-col px-10 border-t border-gray-200 mt-2">
                      <h1 className="text-[#fead61] font-bold">
                        OSs GERADAS DO PROJETO
                      </h1>
                      {infoHolder.ordensDeServico.map((ordem, index) => (
                        <div
                          key={index}
                          className="flex mt-1 items-center justify-around"
                        >
                          <div className="flex flex-col items-center">
                            <p className="uppercase text-gray-500">CATEGORIA</p>
                            <p className="text-xs uppercase">
                              {ordem.categoria}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="uppercase text-gray-500">
                              SERVIÇO PARA EXECUÇÃO
                            </p>
                            <p className="text-xs uppercase">
                              {ordem.servicoExecutado}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="uppercase text-gray-500">
                              REALIZAR COBRANÇA?
                            </p>
                            <p className="text-xs uppercase">
                              {ordem.realizarCobranca ? "SIM" : "NÃO"}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="uppercase text-gray-500">
                              VALOR DA COBRANÇA
                            </p>
                            <p className="text-xs uppercase">
                              R$ {ordem.valorCobranca}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="uppercase text-gray-500">
                              EMISSOR DA OS
                            </p>
                            <p className="text-xs uppercase">
                              {ordem.usuarioEmissor}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="uppercase text-gray-500">
                              DATA DE ABERTURA
                            </p>
                            <p className="text-xs uppercase">
                              {new Date(
                                ordem.dataDeAbertura
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-center">
                            <p className="uppercase text-gray-500">
                              GRAU DE URGÊNCIA
                            </p>
                            <p className="text-xs uppercase">
                              {ordem.grauDeUrgencia}
                            </p>
                          </div>
                          <Link
                            href={`/ordemDeServico//pdf/${project._id}?index=${index}`}
                          >
                            <button className="p-2 bg-[#fead61] font-bold rounded">
                              VER OS
                            </button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <NumberInput
                    unit={"W"}
                    label={"POTÊNCIA DOS MÓDULOS"}
                    editable={false}
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
                        sistema: {
                          ...infoHolder.sistema,
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
                  <SelectInput
                    label={"INICIAR PROJETO"}
                    value={
                      infoHolder.projeto?.iniciar
                        ? infoHolder.projeto?.iniciar
                        : "NÃO DEFINIDO"
                    }
                    editable={false}
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
                          "visitaTecnica.status": e.target.checked
                            ? "REALIZADA"
                            : "PENDÊNCIA",
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
                        "visitaTecnica.tecnico": value,
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
                        "visitaTecnica.tipoDaTelha": value,
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
                        "padrao.tipo": value,
                      });
                      setInfo({
                        ...infoHolder,
                        padrao: { ...infoHolder.padrao, tipo: value },
                      });
                    }}
                  />
                  <SelectInput
                    label={"PAGAMENTO DO PADRÃO"}
                    editable={editor}
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
                    editable={editor}
                    value={
                      infoHolder.padrao.valor ? infoHolder.padrao.valor : 0
                    }
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
                        "padrao.respInstalacao": value,
                      });
                      setInfo({
                        ...infoHolder,
                        padrao: { ...infoHolder.padrao, respInstalacao: value },
                      });
                    }}
                  />
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
                        "visitaTecnica.saidaDoCliente": value,
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
                        "visitaTecnica.amperagem": value,
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
                  ESTRUTURA PERSONALIZADA
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <div>
                    <input
                      disabled={!editor}
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
                    editable={editor}
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
                    editable={editor}
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
                    editable={editor}
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
                      editable={editor}
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
                  MATERIAL
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <SelectInput
                    label={"Separação do material"}
                    value={
                      infoHolder.material?.statusSeparacao
                        ? infoHolder.material?.statusSeparacao
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
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
                    editable={editor}
                    value={
                      infoHolder.material?.previsaoCustos != undefined &&
                      infoHolder.material?.previsaoCustos != "#VALUE!"
                        ? Number(infoHolder.material?.previsaoCustos).toFixed(2)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "material.previsaoCustos": Number(value).toFixed(2),
                      });
                      setInfo({
                        ...infoHolder,
                        material: {
                          ...infoHolder.material,
                          previsaoCustos: Number(value).toFixed(2),
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalObras;
