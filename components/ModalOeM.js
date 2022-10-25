import React, { useState } from "react";
import { vendedores } from "../utils/constants";
import { FaSave } from "react-icons/fa";
import { VscChromeClose } from "react-icons/vsc";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";
import axios from "axios";
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
function ModalOeM({
  open,
  setModalIsOpen,
  project,
  editor,
  handleUpdates,
  credentials,
}) {
  const [infoHolder, setInfo] = useState(project);
  const [msg, setMsg] = useState("");
  const [changes, setChanges] = useState({});
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
  console.log(infoHolder.conferencias);
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
                  PÓS-OBRA
                </span>
                <div className="flex gap-2 justify-around flex-wrap">
                  <DateInput
                    label={"Usina Ligada"}
                    editable={editor}
                    value={
                      infoHolder.conferencias.usinaLigada.data != undefined &&
                      infoHolder.conferencias.usinaLigada.data != "-"
                        ? new Date(infoHolder.conferencias.usinaLigada.data)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "conferencias.usinaLigada.data": new Date(
                          value
                        ).toISOString(),
                        "conferencias.usinaLigada.status": "REALIZADO",
                      });
                      setInfo({
                        ...infoHolder,
                        conferencias: {
                          ...infoHolder.conferencias,
                          usinaLigada: {
                            data: new Date(value).toISOString(),
                            status: "REALIZADO",
                          },
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"Monitoramento feito"}
                    editable={editor}
                    value={
                      infoHolder.conferencias.monitoramentoFeito.data !=
                        undefined &&
                      infoHolder.conferencias.monitoramentoFeito.data != "-"
                        ? new Date(
                            infoHolder.conferencias.monitoramentoFeito.data
                          )
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "conferencias.monitoramentoFeito.data": new Date(
                          value
                        ).toISOString(),
                        "conferencias.monitoramentoFeito.status": "REALIZADO",
                      });
                      setInfo({
                        ...infoHolder,
                        conferencias: {
                          ...infoHolder.conferencias,
                          monitoramentoFeito: {
                            data: new Date(value).toISOString(),
                            status: "REALIZADO",
                          },
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"Data APP no celular"}
                    editable={editor}
                    value={
                      infoHolder.app.data != undefined &&
                      infoHolder.app.data != "-"
                        ? new Date(infoHolder.app.data)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "app.data": new Date(value).toISOString(),
                      });
                      setInfo({
                        ...infoHolder,
                        app: {
                          ...infoHolder.app,
                          data: new Date(value).toISOString(),
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"Energia Injetada"}
                    editable={editor}
                    value={
                      infoHolder.conferencias.energiaInjetada.data !=
                        undefined &&
                      infoHolder.conferencias.energiaInjetada.data != "-"
                        ? new Date(infoHolder.conferencias.energiaInjetada.data)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "conferencias.energiaInjetada.data": new Date(
                          value
                        ).toISOString(),
                        "conferencias.energiaInjetada.status": "REALIZADO",
                      });
                      setInfo({
                        ...infoHolder,
                        conferencias: {
                          ...infoHolder.conferencias,
                          energiaInjetada: {
                            data: new Date(value).toISOString(),
                            status: "REALIZADO",
                          },
                        },
                      });
                    }}
                  />
                  <TextInput
                    label={"LOGIN NO APP"}
                    value={infoHolder.app.login ? infoHolder.app.login : ""}
                    normalCase={true}
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "app.login": value,
                      });
                      setInfo({
                        ...infoHolder,
                        app: {
                          ...infoHolder.app,
                          login: value,
                        },
                      });
                    }}
                  />
                  <TextInput
                    label={"SENHA NO APP"}
                    value={infoHolder.app.senha}
                    normalCase={true}
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "app.senha": value,
                      });
                      setInfo({
                        ...infoHolder,
                        app: {
                          ...infoHolder.app,
                          senha: value,
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"RELATÓRIO 1"}
                    editable={editor}
                    value={
                      infoHolder.relatorios.envioUm?.data != undefined &&
                      infoHolder.relatorios.envioUm.data != "-"
                        ? new Date(infoHolder.relatorios.envioUm.data)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "relatorios.envioUm.data": new Date(
                          value
                        ).toISOString(),
                        "relatorios.envioUm.status": "REALIZADO",
                      });
                      setInfo({
                        ...infoHolder,
                        relatorios: {
                          ...infoHolder.relatorios,
                          envioUm: {
                            data: new Date(value).toISOString(),
                            status: "REALIZADO",
                          },
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"RELATÓRIO 2"}
                    editable={editor}
                    value={
                      infoHolder.relatorios.envioDois?.data != undefined &&
                      infoHolder.relatorios.envioDois.data != "-"
                        ? new Date(infoHolder.relatorios.envioDois.data)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "relatorios.envioDois.data": new Date(
                          value
                        ).toISOString(),
                        "relatorios.envioDois.status": "REALIZADO",
                      });
                      setInfo({
                        ...infoHolder,
                        relatorios: {
                          ...infoHolder.relatorios,
                          envioDois: {
                            data: new Date(value).toISOString(),
                            status: "REALIZADO",
                          },
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"RELATÓRIO 3"}
                    editable={editor}
                    value={
                      infoHolder.relatorios.envioTres.data != undefined &&
                      infoHolder.relatorios.envioTres.data != "-"
                        ? new Date(infoHolder.relatorios.envioTres.data)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "relatorios.envioTres.data": new Date(
                          value
                        ).toISOString(),
                        "relatorios.envioTres.status": "REALIZADO",
                      });
                      setInfo({
                        ...infoHolder,
                        relatorios: {
                          ...infoHolder.relatorios,
                          envioTres: {
                            data: new Date(value).toISOString(),
                            status: "REALIZADO",
                          },
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"RELATÓRIO 4"}
                    editable={editor}
                    value={
                      infoHolder.relatorios.envioQuatro.data != undefined &&
                      infoHolder.relatorios.envioQuatro.data != "-"
                        ? new Date(infoHolder.relatorios.envioQuatro.data)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "relatorios.envioQuatro.data": new Date(
                          value
                        ).toISOString(),
                        "relatorios.envioQuatro.status": "REALIZADO",
                      });
                      setInfo({
                        ...infoHolder,
                        relatorios: {
                          ...infoHolder.relatorios,
                          envioQuatro: {
                            data: new Date(value).toISOString(),
                            status: "REALIZADO",
                          },
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"MANUTENÇÃO PREVENTIVA"}
                    editable={editor}
                    value={
                      infoHolder.manutencaoPreventiva?.data != undefined &&
                      infoHolder.manutencaoPreventiva.data != "-"
                        ? new Date(infoHolder.manutencaoPreventiva.data)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "manutencaoPreventiva.data": new Date(
                          value
                        ).toISOString(),
                        "manutencaoPreventiva.status": "REALIZADO",
                      });
                      setInfo({
                        ...infoHolder,
                        manutencaoPreventiva: {
                          ...infoHolder.manutencaoPreventiva,
                          data: new Date(value).toISOString(),
                          status: "REALIZADO",
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
                      disabled={true}
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
                  <SelectInput
                    label={"Saída do cliente"}
                    editable={false}
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
                    editable={false}
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
                          estruturaPersonalizada: {
                            ...infoHolder.estruturaPersonalizada,
                            aplicavel: e.target.checked ? "SIM" : "NÃO",
                          },
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
                        estruturaPersonalizada: {
                          ...infoHolder.estruturaPersonalizada,
                          tipo: value,
                        },
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
                        estruturaPersonalizada: {
                          ...infoHolder.estruturaPersonalizada,
                          respPagamento: value,
                        },
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
                        estruturaPersonalizada: {
                          ...infoHolder.estruturaPersonalizada,
                          valor: Number(value),
                        },
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
                          estruturaPersonalizada: {
                            ...infoHolder.estruturaPersonalizada,
                            status: value,
                          },
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
                  Informações da compra
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
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
                        compra: {
                          ...infoHolder.compra,
                          dataLiberacao: new Date(value).toISOString(),
                        },
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
                    editable={false}
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
                        compra: {
                          ...infoHolder.compra,
                          dataPagamento: new Date(value).toISOString(),
                        },
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
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        compra: {
                          ...infoHolder.compra,
                          fornecedor: value,
                        },
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
                        compra: {
                          ...infoHolder.compra,
                          tipoDoKit: value,
                        },
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
                        compra: {
                          ...infoHolder.compra,
                          valorDoKit: Number(value),
                        },
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
                        compra: {
                          ...infoHolder.compra,
                          localEntrega: value,
                        },
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
                    editable={false}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        compra: {
                          ...infoHolder.compra,
                          informacoes: value,
                        },
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
                    editable={false}
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
                        compra: {
                          ...infoHolder.compra,
                          statusEntrega: value,
                        },
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
                </div>
              </div>
              <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
                <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                  DADOS INSTALAÇÃO CEMIG
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <TextInput
                    label={"Titular do projeto"}
                    editable={false}
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
                    editable={false}
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
                    editable={false}
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
                      editable={false}
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
                    editable={false}
                    options={[
                      {
                        label: "ALINE",
                        value: "ALINE APARECIDA RODRIGUES CARVALHO",
                      },
                      {
                        label: "ANDREW",
                        value: "ANDRE BORGES ALEXANDER",
                      },
                      {
                        label: "GLENDA",
                        value: "GLENDA ELIAS NASCIMENTO SANTOS",
                      },
                      {
                        label: "POLLIANA",
                        value: "POLLIANA CRISTINA DE REZENDE",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        projeto: {
                          ...infoHolder.projeto,
                          projetista: {
                            ...infoHolder.projeto.projetista,
                            nome: value,
                          },
                        },
                      });
                      setInfo({
                        ...infoHolder,
                        projetista: {
                          ...infoHolder.projeto.projetista,
                          nome: value,
                        },
                      });
                    }}
                  />
                  <DateInput
                    label={"Data de assinatura da documentação"}
                    editable={false}
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
                    editable={false}
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
                    editable={false}
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
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      DIAGRAMA UNIFILAR
                    </span>
                    <div className="flex">
                      <input
                        disabled={true}
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
                        disabled={true}
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
                    editable={false}
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
                  <div className="flex flex-col w-[350px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      AUMENTO DE CARGA
                    </span>
                    <div className="flex">
                      <input
                        disabled={true}
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
                          disabled={true}
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
                  <DateInput
                    label={"DATA DO PEDIDO DE VISTORIA"}
                    editable={false}
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
                    editable={false}
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
                    editable={false}
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
                    editable={false}
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
                    editable={false}
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
                        disabled={true}
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
                        disabled={true}
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
                      readOnly={true}
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

export default ModalOeM;
