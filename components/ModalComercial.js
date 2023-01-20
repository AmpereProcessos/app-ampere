import React, { useState, useEffect } from "react";
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
import AnexoArquivo from "./AnexoArquivo";
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
  project,
  editor,
  handleUpdates,
  credentials,
}) {
  const [infoHolder, setInfo] = useState(project);
  const [infoVisita, setInfoVisita] = useState({});
  const [changes, setChanges] = useState({});
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  async function findCPF(field) {
    axios
      .get(`https://viacep.com.br/ws/${infoHolder.cep.replace("-", "")}/json/`)
      .then((res) => {
        if (res.data.erro) {
          return;
        } else {
          console.log(
            cidadesAtendidas.includes(res.data.localidade.toUpperCase())
          );
          setInfo({
            ...infoHolder,
            bairro: res.data.bairro,
            cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase())
              ? res.data.localidade.toUpperCase()
              : "NÃO DEFINIDO",
            logradouro: res.data.logradouro,
            uf: res.data.uf,
          });
          setChanges({
            ...changes,
            bairro: res.data.bairro,
            cidade: cidadesAtendidas.includes(res.data.localidade.toUpperCase())
              ? res.data.localidade.toUpperCase()
              : "NÃO DEFINIDO",
            logradouro: res.data.logradouro,
            uf: res.data.uf,
          });
        }
      });
  }
  async function handleChanges() {
    if (
      infoHolder.contrato.status != "ASSINADO" &&
      infoHolder.pagamento.status == "PAGO"
    ) {
      setMsg({ text: "Verifique as informações!", color: "text-red-400" });
    } else if (
      !infoHolder.comissionamento?.comercial &&
      (infoHolder.compra?.statusLiberacao == "REALIZAR COMPRA" ||
        infoHolder.compra?.statusLiberacao == "PAGO")
    ) {
      setMsg({
        text: "Preencha o relatório de comissionamento.",
        color: "text-red-400",
      });
    } else if (
      infoHolder.linkDrive?.trim().length < 15 &&
      (infoHolder.compra?.statusLiberacao == "REALIZAR COMPRA" ||
        infoHolder.compra?.statusLiberacao == "PAGO")
    ) {
      setMsg({
        text: "Preencha o link do cliente no drive",
        color: "text-red-400",
      });
    } else {
      axios.post(`/api/projects/update/${project._id}`, changes).then((res) => {
        setMsg({ text: "Alterações feitas !", color: "text-green-400" });
        handleUpdates(project._id);
      });
    }
  }
  function getVisitaInfo(id) {
    axios
      .post(`/api/solicitacoes/getVisitaTecnica/${id}`, {
        links: 1,
      })
      .then((res) => {
        console.log(res.data);
        if (!project.links?.visitaTecnica) {
          project.links = { ...project.links, visitaTecnica: res.data.links };
          setInfo({
            ...infoHolder,
            links: {
              ...infoHolder.links,
              visitaTecnica: res.data.links,
            },
          });
          return setChanges({
            ...changes,
            "links.visitaTecnica": res.data.links,
          });
        }
      });
  }
  // useEffect(() => {
  //   if (infoHolder.idVisitaTecnica?.trim().length > 10) {
  //     getVisitaInfo(infoHolder.idVisitaTecnica);
  //   }
  // }, []);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
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
                    value={
                      infoHolder.nomeDoContrato ? infoHolder.nomeDoContrato : ""
                    }
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        nomeDoContrato: value.toUpperCase(),
                      });
                      setInfo({
                        ...infoHolder,
                        nomeDoContrato: value.toUpperCase(),
                      });
                    }}
                  />
                  <TextInput
                    label={"Nome do Projeto"}
                    value={
                      infoHolder.nomeDoProjeto ? infoHolder.nomeDoProjeto : ""
                    }
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        nomeDoProjeto: value.toUpperCase(),
                      });
                      setInfo({
                        ...infoHolder,
                        nomeDoProjeto: value.toUpperCase(),
                      });
                    }}
                  />
                  <TextInput
                    label={"CPF/CNPJ"}
                    editable={editor}
                    value={
                      infoHolder.cpf_cnpj
                        ? formatCnpjCpf(infoHolder.cpf_cnpj.toString())
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
                    editable={editor}
                    value={infoHolder.telefone ? infoHolder.telefone : ""}
                    handleChange={(value) => {
                      setChanges({ ...changes, telefone: value });
                      setInfo({ ...infoHolder, telefone: value });
                    }}
                  />
                  <SelectInput
                    label={"Cidade"}
                    editable={editor}
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
                    editable={editor}
                    value={
                      infoHolder.cep
                        ? formataCEP(infoHolder.cep.toString())
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, cep: value });
                      setInfo({ ...infoHolder, cep: value });
                    }}
                  />
                  <button
                    onClick={() => findCPF()}
                    className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
                  >
                    <AiOutlineSearch />
                  </button>
                  <TextInput
                    label={"Logradouro"}
                    editable={editor}
                    value={infoHolder.logradouro ? infoHolder.logradouro : ""}
                    handleChange={(value) => {
                      setChanges({ ...changes, logradouro: value });
                      setInfo({ ...infoHolder, logradouro: value });
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
                    value={
                      infoHolder.regional ? infoHolder.regional : "NÃO DEFINIDO"
                    }
                    options={[
                      {
                        label: "REGIONAL ITUIUTABA",
                        value: "REGIONAL ITUIUTABA",
                      },
                      {
                        label: "REGIONAL UBERLÂNDIA",
                        value: "REGIONAL UBERLÂNDIA",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
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
                    label={"INSIDER"}
                    value={
                      infoHolder.insider ? infoHolder.insider : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "NÃO DEFINIDO", valor: "NÃO DEFINIDO" },
                      ...vendedores
                        .filter((x) => x.qualificacao?.includes("INSIDE"))
                        .map((vendedor) => {
                          return { label: vendedor.nome, value: vendedor.nome };
                        }),
                    ]}
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        insider: value,
                      });
                      setInfo({
                        ...infoHolder,
                        insider: value,
                      });
                    }}
                  />
                  <SelectInput
                    label={"SEGMENTO"}
                    value={
                      infoHolder.segmento ? infoHolder.segmento : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "COMERCIAL", value: "COMERCIAL" },
                      { label: "INDUSTRIAL", value: "INDUSTRIAL" },
                      { label: "RESIDENCIAL", value: "RESIDENCIAL" },
                      { label: "RURAL", value: "RURAL" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
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
                    label={"ID DA VISITA TÉCNICA"}
                    editable={editor}
                    normalCase={true}
                    value={
                      infoHolder.idVisitaTecnica
                        ? infoHolder.idVisitaTecnica
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, idVisitaTecnica: value });
                      setInfo({ ...infoHolder, idVisitaTecnica: value });
                    }}
                  />
                  {!project.links?.visitaTecnica && (
                    <button
                      onClick={() => getVisitaInfo(infoHolder.idVisitaTecnica)}
                      className="flex items-center p-1 h-[30px] bg-[#15599a] rounded text-white"
                    >
                      <AiOutlineSearch />
                    </button>
                  )}

                  <SelectInput
                    label="TIPO DE SERVIÇO"
                    value={infoHolder.tipoDeServico}
                    editable={editor}
                    options={tiposDeServico.map((tipo) => tipo)}
                    handleChange={(value) => {
                      setChanges({ ...changes, tipoDeServico: value });
                      setInfo({ ...infoHolder, tipoDeServico: value });
                    }}
                  />
                  <div>
                    <input
                      disabled={!editor}
                      checked={infoHolder.possuiaGD ? true : false}
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          possuiaGD: e.target.checked,
                        });
                        setInfo({
                          ...infoHolder,
                          possuiaGD: e.target.checked,
                        });
                      }}
                      type="checkbox"
                      name="possuiaGD"
                      id="possuiaGD"
                    />
                    <label className="ml-2" htmlFor="possuiaGD">
                      JÁ POSSUIA GD?
                    </label>
                  </div>
                  <div>
                    <input
                      disabled={!editor}
                      checked={infoHolder.oem?.aplicavel ? true : false}
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          "oem.aplicavel": e.target.checked,
                        });
                        setInfo({
                          ...infoHolder,
                          oem: {
                            ...infoHolder.oem,
                            aplicavel: e.target.checked,
                          },
                        });
                      }}
                      type="checkbox"
                      name="possuiOEM"
                      id="possuiOEM"
                    />
                    <label className="ml-2" htmlFor="possuiOEM">
                      POSSUI O&M?
                    </label>
                  </div>
                  {infoHolder.oem?.aplicavel && (
                    <NumberInput
                      label={"Duração O&M (anos)"}
                      value={
                        infoHolder.oem?.duracao ? infoHolder.oem?.duracao : 0
                      }
                      editable={editor}
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          "oem.duracao": Number(value),
                        });
                        setInfo({
                          ...infoHolder,
                          oem: { ...infoHolder.oem, duracao: Number(value) },
                        });
                      }}
                    />
                  )}
                  {infoHolder.oem?.aplicavel && (
                    <>
                      <NumberInput
                        label={"QTDE de manutenções"}
                        value={
                          infoHolder.oem?.qtdeManutencoes
                            ? infoHolder.oem?.qtdeManutencoes
                            : 0
                        }
                        editable={editor}
                        handleChange={(value) => {
                          setChanges({
                            ...changes,
                            "oem.qtdeManutencoes": Number(value),
                          });
                          setInfo({
                            ...infoHolder,
                            oem: {
                              ...infoHolder.oem,
                              qtdeManutencoes: Number(value),
                            },
                          });
                        }}
                      />
                      <SelectInput
                        label={"PLANO DE O&M"}
                        editable={editor}
                        value={
                          infoHolder.oem?.plano
                            ? infoHolder.oem.plano
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          ...oemPlans.map((plan) => plan),
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        ]}
                        handleChange={(value) => {
                          setChanges({ ...changes, "oem.plano": value });
                          setInfo({
                            ...infoHolder,
                            oem: {
                              ...infoHolder.oem,
                              plano: value,
                            },
                          });
                        }}
                      />
                    </>
                  )}
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
                      REALIZADA ?
                    </label>
                  </div>
                  <TextInput
                    label={"TÉCNICO RESPONSÁVEL"}
                    editable={editor}
                    value={
                      infoHolder.visitaTecnica?.tecnico
                        ? infoHolder.visitaTecnica?.tecnico
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
                              infoHolder.acStatus != "REALIZADO"
                                ? "PENDÊNCIA"
                                : undefined,
                          });
                          setInfo({
                            ...infoHolder,
                            projeto: {
                              ...infoHolder.projeto,
                              aumentoDeCarga: e.target.checked ? "SIM" : "NÃO",
                              acStatus:
                                e.target.checked &&
                                infoHolder.acStatus != "REALIZADO"
                                  ? "PENDÊNCIA"
                                  : undefined,
                            },
                          });
                        }}
                        type="checkbox"
                        name="aumentodecarga"
                        id="aumentodecarga"
                      />
                      <label className="ml-2" htmlFor="aumentodecarga">
                        APLICÁVEL?
                      </label>
                    </div>
                  </div>
                  {infoHolder.projeto?.aumentoDeCarga == "SIM" && (
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
                        {
                          label: "NÃO DEFINIDO",
                          value: "NÃO DEFINIDO",
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
                  {credentials.visualizacao == undefined && (
                    <NumberInput
                      tag={"R$"}
                      label={"Valor do padrão"}
                      editable={editor}
                      value={
                        infoHolder.padrao?.valor ? infoHolder.padrao?.valor : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          "padrao.valor": Number(value),
                        });
                        setInfo({
                          ...infoHolder,
                          padrao: {
                            ...infoHolder.padrao,
                            valor: Number(value),
                          },
                        });
                      }}
                    />
                  )}
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      CAIXA CONJUGADA
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.padrao.caixaConjugada == "SIM"
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "padrao.caixaConjugada": e.target.checked
                              ? "SIM"
                              : "NÃO",
                          });
                          setInfo({
                            ...infoHolder,
                            padrao: {
                              ...infoHolder.padrao,
                              caixaConjugada: e.target.checked ? "SIM" : "NÃO",
                            },
                          });
                        }}
                        type="checkbox"
                        name="caixaConjugada"
                        id="caixaConjugada"
                      />
                      <label className="ml-2" htmlFor="caixaConjugada">
                        SIM ?
                      </label>
                    </div>
                  </div>
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
                <div className="flex gap-2 justify-center flex-wrap mt-2">
                  <SelectInput
                    label={"TIPO DO PADRÃO"}
                    editable={editor}
                    value={
                      infoHolder.padrao?.tipo != undefined
                        ? infoHolder.padrao?.tipo
                        : "NÃO DEFINIDO"
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
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
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
                    label={"TIPO DE ENTRADA"}
                    value={
                      infoHolder.padrao.tipoEntrada
                        ? infoHolder.padrao.tipoEntrada
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "AÉREA",
                        value: "AÉREA",
                      },
                      {
                        label: "SUBTERRÂNEO",
                        value: "SUBTERRÂNEO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({ ...changes, "padrao.tipoEntrada": value });
                      setInfo({
                        ...infoHolder,
                        padrao: {
                          ...infoHolder.padrao,
                          tipoEntrada: value,
                        },
                      });
                    }}
                  />
                  <SelectInput
                    label={"Saída do cliente"}
                    editable={editor}
                    value={
                      infoHolder.visitaTecnica?.saidaDoCliente
                        ? infoHolder.visitaTecnica?.saidaDoCliente
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
                          "estruturaPersonalizada.status": e.target.checked
                            ? project.estruturaPersonalizada.status != "PRONTA"
                              ? "PENDÊNCIA"
                              : project.estruturaPersonalizada.status
                            : "N/A",
                        });
                        setInfo({
                          ...infoHolder,
                          estruturaPersonalizada: {
                            ...infoHolder.estruturaPersonalizada,
                            aplicavel: e.target.checked ? "SIM" : "NÃO",
                            status: e.target.checked
                              ? project.estruturaPersonalizada.status !=
                                "PRONTA"
                                ? "PENDÊNCIA"
                                : project.estruturaPersonalizada.status
                              : "N/A",
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
                    options={tiposDeEstruturas.map((tipo) => tipo)}
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
                  {credentials.visualizacao == undefined && (
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
                  )}
                  {infoHolder.estruturaPersonalizada?.aplicavel == "SIM" && (
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
                  CONTRATO
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      RELATÓRIO DE COMISSIONAMENTO
                    </span>
                    <div className="flex">
                      <input
                        disabled={!editor}
                        checked={
                          infoHolder.comissionamento?.comercial ? true : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "comissionamento.comercial": e.target.checked,
                          });
                          setInfo({
                            ...infoHolder,
                            comissionamento: {
                              ...infoHolder.comissionamento,
                              comercial: e.target.checked,
                            },
                          });
                        }}
                        type="checkbox"
                        name="comissionamentoComercial"
                        id="comissionamentoComercial"
                      />
                      <label
                        className="ml-2"
                        htmlFor="comissionamentoComercial"
                      >
                        OK
                      </label>
                    </div>
                  </div>
                  <SelectInput
                    label={"STATUS"}
                    editable={editor}
                    value={
                      infoHolder.contrato?.status
                        ? infoHolder.contrato?.status
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
                  {infoHolder.contrato?.status != "NÃO DEFINIDO" && (
                    <DateInput
                      label={"Data de solicitação"}
                      editable={editor}
                      value={
                        infoHolder.contrato.dataSolicitacao != undefined &&
                        infoHolder.contrato.dataSolicitacao != "-"
                          ? new Date(infoHolder.contrato.dataSolicitacao)
                              .toISOString()
                              .slice(0, 10)
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          "contrato.dataSolicitacao": dayjs(value).isValid()
                            ? new Date(value).toISOString()
                            : null,
                        });
                        setInfo({
                          ...infoHolder,
                          contrato: {
                            ...infoHolder.contrato,
                            dataSolicitacao: dayjs(value).isValid()
                              ? new Date(value).toISOString()
                              : null,
                          },
                        });
                      }}
                    />
                  )}
                  <DateInput
                    label={"Data de liberação p/ assinatura"}
                    editable={editor}
                    value={
                      infoHolder.contrato?.dataLiberacao != undefined &&
                      infoHolder.contrato?.dataLiberacao != "-"
                        ? new Date(infoHolder.contrato.dataLiberacao)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "contrato.dataLiberacao": dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        contrato: {
                          ...infoHolder.contrato,
                          dataLiberacao: dayjs(value).isValid()
                            ? new Date(value).toISOString()
                            : null,
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"Data de assinatura"}
                    editable={editor}
                    value={
                      infoHolder.contrato?.dataAssinatura != undefined &&
                      infoHolder.contrato?.dataAssinatura != "-"
                        ? new Date(infoHolder.contrato.dataAssinatura)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "contrato.dataAssinatura": dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        contrato: {
                          ...infoHolder.contrato,
                          dataAssinatura: dayjs(value).isValid()
                            ? new Date(value).toISOString()
                            : null,
                        },
                      });
                    }}
                  />
                  <SelectInput
                    label={"FORMA DE ASSINATURA"}
                    value={
                      infoHolder.contrato?.formaAssinatura
                        ? infoHolder.contrato?.formaAssinatura
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "FISICO",
                        value: "FISICO",
                      },
                      {
                        label: "DIGITAL",
                        value: "DIGITAL",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "contrato.formaAssinatura": value,
                      });
                      setInfo({
                        ...infoHolder,
                        contrato: {
                          ...infoHolder.contrato,
                          formaAssinatura: value,
                        },
                      });
                    }}
                  />
                  <NumberInput
                    label={"PORCENTAGEM DE COMISSÃO"}
                    editable={true}
                    value={
                      infoHolder.contrato.comissaoVendedor
                        ? infoHolder.contrato.comissaoVendedor
                        : null
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "contrato.comissaoVendedor": Number(value),
                      });
                      setInfo({
                        ...infoHolder,
                        contrato: {
                          ...infoHolder.contrato,
                          comissaoVendedor: Number(value),
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
                  {/*<SelectInput
                    label={"STATUS PAGAMENTO"}
                    value={
                      infoHolder.pagamento?.status
                        ? infoHolder.pagamento?.status
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
                  />*/}
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
                        "faturamento.previsaoFaturamento": value.toUpperCase(),
                      });
                      setInfo({
                        ...infoHolder,
                        faturamento: {
                          ...infoHolder.faturamento,
                          previsaoFaturamento: value.toUpperCase(),
                        },
                      });
                    }}
                  />
                  {infoHolder.pagamento?.forma == "FINANCIAMENTO" && (
                    <SelectInput
                      label={"CREDOR"}
                      value={
                        infoHolder.pagamento?.credor != undefined &&
                        infoHolder.pagamento?.credor != "-----" &&
                        infoHolder.pagamento?.credor != "QUAL CREDOR?"
                          ? infoHolder.pagamento.credor
                          : "NÃO DEFINIDO"
                      }
                      editable={editor}
                      options={credores.map((credor) => {
                        return { label: credor.label, value: credor.value };
                      })}
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
                        ? infoHolder.pagamento?.pagador
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "pagamento.pagador": value.toUpperCase(),
                      });
                      setInfo({
                        ...infoHolder,
                        pagamento: {
                          ...infoHolder.pagamento,
                          pagador: value.toUpperCase(),
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
                        "pagamento.contatoPagador": value.toUpperCase(),
                      });
                      setInfo({
                        ...infoHolder,
                        pagamento: {
                          ...infoHolder.pagamento,
                          contatoPagador: value.toUpperCase(),
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
                    options={statusLiberacao.map((status) => {
                      return { label: status.label, value: status.value };
                    })}
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
                    editable={editor}
                    value={
                      infoHolder.compra?.dataLiberacao != undefined &&
                      infoHolder.compra?.dataLiberacao != "-"
                        ? new Date(infoHolder.compra.dataLiberacao)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "compra.dataLiberacao": dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          dataLiberacao: dayjs(value).isValid()
                            ? new Date(value).toISOString()
                            : null,
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
                        "compra.dataPagamento": dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          dataPagamento: dayjs(value).isValid()
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
                  {credentials.visualizacao == undefined && (
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
                  )}
                  <SelectInput
                    label={"LOCAL DE ENTREGA"}
                    value={
                      infoHolder.compra?.localEntrega != undefined &&
                      infoHolder.compra?.localEntrega != "-"
                        ? infoHolder.compra?.localEntrega
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={localEntregaOptions.map((local) => {
                      return { label: local.label, value: local.value };
                    })}
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
                  <div className="w-full flex flex-col mx-2 lg:mx-0 lg:flex-row items-center justify-center gap-4">
                    <div className="flex flex-col w-full lg:w-[450px] self-center mt-2 items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        INFORMAÇÕES DO KIT
                      </span>
                      <textarea
                        readOnly={!editor}
                        value={
                          infoHolder.compra?.kitInfo
                            ? infoHolder.compra?.kitInfo
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
                    <div className="flex flex-col w-full lg:w-[450px] self-center mt-2 items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        MATERIAL FALTANTE
                      </span>
                      <textarea
                        readOnly={!editor}
                        value={
                          infoHolder.material?.materialFaltante
                            ? infoHolder.material?.materialFaltante
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
                        "dadosCemig.titularProjeto": value,
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
                      infoHolder.dadosCemig?.numeroInstalacao
                        ? infoHolder.dadosCemig?.numeroInstalacao
                        : ""
                    }
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "dadosCemig.numeroInstalacao": value,
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
                      infoHolder.dadosCemig?.distCreditos
                        ? infoHolder.dadosCemig?.distCreditos
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
                        "dadosCemig.distCreditos": value,
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
                  {infoHolder.dadosCemig?.distCreditos == "SIM" && (
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
                          "dadosCemig.qtdeDistCreditos": Number(value),
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
                          Number(value * infoHolder.sistema?.qtdeModulos) /
                          1000,
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
                  {credentials.visualizacao == undefined && (
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
                  )}
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
                      setChanges({
                        ...changes,
                        "projeto.projetista.nome": value,
                        "projeto.projetista.codigo":
                          projetistas.filter(
                            (projetista) => projetista.nome == value
                          )[0].cod || "-",
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
                      infoHolder.projeto?.dataAssDocumentacao != undefined &&
                      infoHolder.projeto?.dataAssDocumentacao != "-"
                        ? new Date(infoHolder.projeto.dataAssDocumentacao)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "projeto.dataAssDocumentacao": dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        projeto: {
                          ...infoHolder.projeto,
                          dataAssDocumentacao: dayjs(value).isValid()
                            ? new Date(value).toISOString()
                            : null,
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
                        "parecer.dataParecerDeAcesso": dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        parecer: {
                          ...infoHolder.parecer,
                          dataParecerDeAcesso: dayjs(value).isValid()
                            ? new Date(value).toISOString()
                            : null,
                        },
                      });
                    }}
                  />
                  <SelectInput
                    label={"Status do parecer de acesso"}
                    value={
                      infoHolder.parecer?.statusDoParecerDeAcesso
                        ? infoHolder.parecer?.statusDoParecerDeAcesso
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "AGUARDANDO FATURAMENTO ART",
                        value: "AGUARDANDO FATURAMENTO ART",
                      },
                      {
                        label: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                        value: "AGUARDANDO RESPOSTA DA CONCESSIONARIA",
                      },
                      {
                        label: "CANCELADO",
                        value: "CANCELADO",
                      },
                      {
                        label: "INICIAR PROJETO",
                        value: "INICIAR PROJETO",
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
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "parecer.statusDoParecerDeAcesso": value,
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
                            "projeto.diagramaUnifilar": e.target.checked
                              ? "Ok"
                              : "PENDÊNCIA",
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
                            "projeto.desenhoTelhado": e.target.checked
                              ? "OK"
                              : "PENDÊNCIA",
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
                        "projeto.mapaDeMicro": value,
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
                        "vistoria.dataPedido": dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        vistoria: {
                          ...infoHolder.vistoria,
                          dataPedido: dayjs(value).isValid()
                            ? new Date(value).toISOString()
                            : null,
                        },
                      });
                    }}
                  />
                  <SelectInput
                    label={"STATUS DA VISTORIA"}
                    value={
                      infoHolder.vistoria?.status
                        ? infoHolder.vistoria?.status
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
                        "vistoria.status": value,
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
                        "medidor.data": dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        medidor: {
                          ...infoHolder.medidor,
                          data: dayjs(value).isValid()
                            ? new Date(value).toISOString()
                            : null,
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
                        "medidor.status": value,
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
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      PROJETO CONCLUÍDO
                    </span>
                    <div className="flex">
                      <input
                        disabled={true}
                        checked={
                          infoHolder.projeto?.projetoConcluido === "SIM"
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            "projeto.projetoConcluido": e.target.checked
                              ? "SIM"
                              : "NÃO",
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
                        "obra.entrada": dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        obra: {
                          ...infoHolder.obra,
                          entrada: dayjs(value).isValid()
                            ? new Date(value).toISOString()
                            : null,
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
                        "obra.saida": dayjs(value).isValid()
                          ? new Date(value).toISOString()
                          : null,
                      });
                      setInfo({
                        ...infoHolder,
                        obra: {
                          ...infoHolder.obra,
                          saida: dayjs(value).isValid()
                            ? new Date(value).toISOString()
                            : null,
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
                        APLICÁVEL?
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
                </div>
                <div className="flex flex-col w-full lg:w-[450px] self-center mt-2 items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    OBSERVAÇÕES
                  </span>
                  <textarea
                    readOnly={!editor}
                    value={
                      infoHolder.obra?.observacoes
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
                  {credentials.visualizacao == undefined && (
                    <>
                      {" "}
                      <NumberInput
                        tag={"R$"}
                        label={"Previsão de custos em insumos"}
                        editable={editor}
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
                    </>
                  )}
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
        </div>
      </div>
    </>
  );
}

export default ModalComercial;
