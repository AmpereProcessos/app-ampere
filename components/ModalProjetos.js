import React, { useState } from "react";
import { vendedores } from "../utils/constants";
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
  console.log(infoHolder.qtdeDiasObraDeRede);
  console.log("changes", changes);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {infoHolder.qtde} - {infoHolder.nomedocontrato}
              </h1>
              {infoHolder.codprojetosvb && (
                <p className="text-gray-600 text-sm font-bold">
                  #{infoHolder.codprojetosvb}
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
                    value={infoHolder.nomedocontrato}
                    editable={false}
                    handleChange={(value) => {
                      setChanges({ ...changes, nomedocontrato: value });
                      setInfo({ ...infoHolder, nomedocontrato: value });
                    }}
                  />
                  <TextInput
                    label={"Nome do Projeto"}
                    value={infoHolder.nomedoprojeto}
                    editable={false}
                    handleChange={(value) => {
                      setChanges({ ...changes, nomedoprojeto: value });
                      setInfo({ ...infoHolder, nomedoprojeto: value });
                    }}
                  />
                  <TextInput
                    label={"CPF/CNPJ"}
                    editable={false}
                    value={
                      infoHolder.cpfcnpj
                        ? formataCPF(infoHolder.cpfcnpj.toString())
                        : "-"
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, cpfcnpj: value });
                      setInfo({ ...infoHolder, cpfcnpj: value });
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
                    value={infoHolder.numerores ? infoHolder.numerores : 0}
                    handleChange={(value) => {
                      setChanges({ ...changes, numerores: Number(value) });
                      setInfo({ ...infoHolder, numerores: Number(value) });
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
                      infoHolder.canalvenda != undefined &&
                      infoHolder.canalvenda != "-"
                        ? infoHolder.canalvenda
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
                      setChanges({ ...changes, canalvenda: value });
                      setInfo({ ...infoHolder, canalvenda: value });
                    }}
                  />
                  <div className="flex">
                    <SelectInput
                      label={"VENDEDOR"}
                      value={
                        infoHolder.vendedor != undefined &&
                        infoHolder.vendedor != "-"
                          ? infoHolder.vendedor
                          : "NÃO DEFINIDO"
                      }
                      options={vendedores.map((vendedor) => {
                        return { label: vendedor.nome, value: vendedor.nome };
                      })}
                      editable={false}
                      handleChange={(value) => {
                        setChanges({ ...changes, vendedor: value });
                        setInfo({ ...infoHolder, vendedor: value });
                      }}
                    />
                    <div className="flex flex-col items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        CÓD.VENDEDOR
                      </span>
                      <p>
                        {vendedores.filter(
                          (vendedor) => vendedor.nome == infoHolder.vendedor
                        ).length > 0
                          ? vendedores.filter(
                              (vendedor) => vendedor.nome == infoHolder.vendedor
                            )[0].cod
                          : "-"}
                      </p>
                    </div>
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
                      infoHolder.titulardoprojeto
                        ? infoHolder.titulardoprojeto
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, titulardoprojeto: value });
                      setInfo({ ...infoHolder, titulardoprojeto: value });
                    }}
                  />
                  <TextInput
                    label={"Número da instalação"}
                    value={
                      infoHolder.numeroinstalacao
                        ? infoHolder.numeroinstalacao
                        : ""
                    }
                    editable={editor}
                    handleChange={(value) => {
                      setChanges({ ...changes, numeroinstalacao: value });
                      setInfo({ ...infoHolder, numeroinstalacao: value });
                    }}
                  />
                  <SelectInput
                    label={"DISTRIBUIÇÃO DE CRÉDITOS"}
                    value={
                      infoHolder.distribuicaodecreditos
                        ? infoHolder.distribuicaodecreditos
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      { label: "SIM", value: "SIM" },
                      { label: "NÃO", value: "NÃO" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) => {
                      setChanges({ ...changes, distribuicaodecreditos: value });
                      setInfo({ ...infoHolder, distribuicaodecreditos: value });
                    }}
                  />
                  {infoHolder.distribuicaodecreditos == "SIM" && (
                    <NumberInput
                      label={"QTDE DE DISTRIBUIÇÕES"}
                      editable={editor}
                      value={
                        infoHolder.quantdistribuicoes != undefined &&
                        infoHolder.quantdistribuicoes != "-"
                          ? infoHolder.quantdistribuicoes
                          : 0
                      }
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          quantdistribuicoes: Number(value),
                        });
                        setInfo({
                          ...infoHolder,
                          quantdistribuicoes: Number(value),
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
                        infoHolder.visitatecnica === "REALIZADA" ? true : false
                      }
                      onChange={(e) => {
                        setChanges({
                          ...changes,
                          visitatecnica: e.target.checked
                            ? "REALIZADA"
                            : undefined,
                        });
                        setInfo({
                          ...infoHolder,
                          visitatecnica: e.target.checked
                            ? "REALIZADA"
                            : undefined,
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
                      infoHolder.tecnicoresponsavel
                        ? infoHolder.tecnicoresponsavel
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, tecnicoresponsavel: value });
                      setInfo({
                        ...infoHolder,
                        tecnicoresponsavel: value,
                      });
                    }}
                  />
                  <SelectInput
                    label={"Saída do cliente"}
                    editable={editor}
                    value={
                      infoHolder.saidacliente ? infoHolder.saidacliente : "N/A"
                    }
                    options={[
                      { label: "SUBTERRANEO", value: "SUBTERRANEO" },
                      { label: "AEREO", value: "AEREO" },
                      { label: "N/A", value: "N/A" },
                    ]}
                    handleChange={(value) => {
                      setChanges({ ...changes, saidacliente: value });
                      setInfo({
                        ...infoHolder,
                        saidacliente: value,
                      });
                    }}
                  />
                  <TextInput
                    label={"Amperagem"}
                    editable={editor}
                    value={infoHolder.amperagem ? infoHolder.amperagem : ""}
                    handleChange={(value) => {
                      setChanges({ ...changes, amperagem: value });
                      setInfo({
                        ...infoHolder,
                        amperagem: value,
                      });
                    }}
                  />
                  <TextInput
                    label={"Tipo da telha"}
                    editable={editor}
                    value={infoHolder.tipotelha ? infoHolder.tipotelha : ""}
                    handleChange={(value) => {
                      setChanges({ ...changes, tipotelha: value });
                      setInfo({ ...infoHolder, tipotelha: value });
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
                    label={"RESPONSÁVEL INSTALAÇÃO DO PADRÃO"}
                    editable={editor}
                    value={
                      infoHolder.respinstalacaopadrao
                        ? infoHolder.respinstalacaopadrao
                        : "NÃO SE APLICA"
                    }
                    options={[
                      { label: "AMPERE", value: "AMPERE" },
                      { label: "CLIENTE", value: "CLIENTE" },
                      { label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
                    ]}
                    handleChange={(value) => {
                      setChanges({ ...changes, respinstalacaopadrao: value });
                      setInfo({
                        ...infoHolder,
                        respinstalacaopadrao: value,
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
                          infoHolder.aumentodecarga === "SIM" ? true : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            aumentodecarga: e.target.checked ? "SIM" : "NÃO",
                            acstatus:
                              e.target.checked &&
                              infoHolder.acstatus != "REALIZADO"
                                ? "PÊNDENCIA"
                                : undefined,
                          });
                          setInfo({
                            ...infoHolder,
                            aumentodecarga: e.target.checked ? "SIM" : "NÃO",
                            acstatus:
                              e.target.checked &&
                              infoHolder.acstatus != "REALIZADO"
                                ? "PÊNDENCIA"
                                : undefined,
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
                  {infoHolder.aumentodecarga == "SIM" && (
                    <div className="flex flex-col w-[350px] items-center">
                      <span className="uppercase font-bold font-raleway text-center text-sm">
                        STATUS AUMENTO DE CARGA
                      </span>
                      <div className="flex">
                        <input
                          disabled={!editor}
                          checked={
                            infoHolder.acstatus === "REALIZADO" ? true : false
                          }
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              acstatus: e.target.checked
                                ? "REALIZADO"
                                : "PENDÊNCIA",
                            });
                            setInfo({
                              ...infoHolder,
                              acstatus: e.target.checked
                                ? "REALIZADO"
                                : "PENDÊNCIA",
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
                      infoHolder.nmodulos != undefined &&
                      infoHolder.nmodulos != "-"
                        ? infoHolder.nmodulos
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, nmodulos: Number(value) });
                      setInfo({ ...infoHolder, nmodulos: Number(value) });
                    }}
                  />
                  <NumberInput
                    unit={"W"}
                    label={"POTÊNCIA DOS MÓDULOS"}
                    editable={editor}
                    value={
                      infoHolder.potmodulos != undefined &&
                      infoHolder.potmodulos != "-"
                        ? infoHolder.potmodulos
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, potmodulos: Number(value) });
                      setInfo({ ...infoHolder, potmodulos: Number(value) });
                    }}
                  />
                  <NumberInput
                    unit="kWp"
                    label={"POTÊNCIA PICO"}
                    editable={editor}
                    value={
                      infoHolder.potpico != undefined &&
                      infoHolder.potpico != "-"
                        ? infoHolder.potpico
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, potpico: Number(value) });
                      setInfo({ ...infoHolder, potpico: Number(value) });
                    }}
                  />
                  <SelectInput
                    label={"TOPOLOGIA"}
                    value={
                      infoHolder.topologia
                        ? infoHolder.topologia
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
                      setChanges({ ...changes, topologia: value });
                      setInfo({ ...infoHolder, topologia: value });
                    }}
                  />
                  <TextInput
                    label={"QTDE E POTÊNCIA DO(S) INVERSOR(ES)"}
                    editable={editor}
                    value={
                      infoHolder.qtdepotinversor
                        ? infoHolder.qtdepotinversor
                        : ""
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, qtdepotinversor: value });
                      setInfo({ ...infoHolder, qtdepotinversor: value });
                    }}
                  />
                  <NumberInput
                    tag={"R$"}
                    label={"VALOR DO PROJETO"}
                    editable={editor}
                    value={
                      infoHolder.valorprojeto != undefined &&
                      infoHolder.valorprojeto != "-"
                        ? infoHolder.valorprojeto
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, valorprojeto: Number(value) });
                      setInfo({ ...infoHolder, valorprojeto: Number(value) });
                    }}
                  />
                  <SelectInput
                    label={"INICIAR PROJETO"}
                    value={
                      infoHolder.iniciarprojeto
                        ? infoHolder.iniciarprojeto
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
                      setChanges({ ...changes, iniciarprojeto: value });
                      setInfo({ ...infoHolder, iniciarprojeto: value });
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
                      infoHolder.projetista
                        ? infoHolder.projetista
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
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
                      setChanges({ ...changes, projetista: value });
                      setInfo({ ...infoHolder, projetista: value });
                    }}
                  />
                  <DateInput
                    label={"Data de assinatura da documentação"}
                    editable={editor}
                    value={
                      infoHolder.documentacaoassinada != undefined &&
                      infoHolder.documentacaoassinada != "-"
                        ? new Date(infoHolder.documentacaoassinada)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, documentacaoassinada: value });
                      setInfo({ ...infoHolder, documentacaoassinada: value });
                    }}
                  />
                  <DateInput
                    label={"Parecer de acesso"}
                    editable={editor}
                    value={
                      infoHolder.pareceracesso != undefined &&
                      infoHolder.pareceracesso != "-"
                        ? new Date(infoHolder.pareceracesso)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, pareceracesso: value });
                      setInfo({ ...infoHolder, pareceracesso: value });
                    }}
                  />
                  <SelectInput
                    label={"Status do parecer de acesso"}
                    value={
                      infoHolder.statusparecerdeacesso
                        ? infoHolder.statusparecerdeacesso
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
                        label: "PARECER DE ACESSO COM OBRAS",
                        value: "PARECER DE ACESSO COM OBRAS",
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
                      setChanges({ ...changes, statusparecerdeacesso: value });
                      setInfo({ ...infoHolder, statusparecerdeacesso: value });
                    }}
                  />
                  {infoHolder.statusparecerdeacesso ==
                    "PARECER DE ACESSO COM OBRAS" && (
                    <NumberInput
                      label={"QUANTOS DIAS DE OBRA?"}
                      value={
                        infoHolder.qtdeDiasObraDeRede != undefined
                          ? infoHolder.qtdeDiasObraDeRede
                          : 0
                      }
                      editable={editor}
                      handleChange={(value) => {
                        setChanges({
                          ...changes,
                          qtdeDiasObraDeRede: Number(value),
                        });
                        setInfo({
                          ...infoHolder,
                          qtdeDiasObraDeRede: Number(value),
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
                          infoHolder.diagramaunifilar === "Ok" ? true : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            diagramaunifilar: e.target.checked
                              ? "Ok"
                              : undefined,
                          });
                          setInfo({
                            ...infoHolder,
                            diagramaunifilar: e.target.checked
                              ? "Ok"
                              : undefined,
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
                          infoHolder.desenhotelhado === "OK" ? true : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            desenhotelhado: e.target.checked ? "OK" : undefined,
                          });
                          setInfo({
                            ...infoHolder,
                            desenhotelhado: e.target.checked ? "OK" : undefined,
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
                      infoHolder.mapademicro != undefined &&
                      infoHolder.mapademicro != "-"
                        ? infoHolder.mapademicro
                        : "NÃO DEFINIDO"
                    }
                    options={[
                      { label: "OK", value: "OK" },
                      { label: `N\A`, value: `N\A` },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                  />
                  <DateInput
                    label={"DATA DO PEDIDO DE VISTORIA"}
                    editable={editor}
                    value={
                      infoHolder.pedidovistoria != undefined &&
                      infoHolder.pedidovistoria != "-"
                        ? new Date(infoHolder.pedidovistoria)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, pedidovistoria: value });
                      setInfo({ ...infoHolder, pedidovistoria: value });
                    }}
                  />
                  <SelectInput
                    label={"STATUS DA VISTORIA"}
                    value={
                      infoHolder.statusvistoria
                        ? infoHolder.statusvistoria
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
                      setChanges({ ...changes, statusvistoria: value });
                      setInfo({ ...infoHolder, statusvistoria: value });
                    }}
                  />
                  <DateInput
                    label={"DATA TROCA DO MEDIDOR"}
                    editable={editor}
                    value={
                      infoHolder.trocamedidor != undefined &&
                      infoHolder.trocamedidor != "-"
                        ? new Date(infoHolder.trocamedidor)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, trocamedidor: value });
                      setInfo({ ...infoHolder, trocamedidor: value });
                    }}
                  />
                  <SelectInput
                    label={"STATUS DA TROCA DO MEDIDOR"}
                    value={
                      infoHolder.statustrocamedidor
                        ? infoHolder.statustrocamedidor
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
                      setChanges({ ...changes, statustrocamedidor: value });
                      setInfo({ ...infoHolder, statustrocamedidor: value });
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
                            infoHolder.parecerReprovado === "SIM" ? true : false
                          }
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              parecerReprovado: e.target.checked
                                ? "SIM"
                                : undefined,
                            });
                            setInfo({
                              ...infoHolder,
                              parecerReprovado: e.target.checked
                                ? "SIM"
                                : undefined,
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
                    {infoHolder.parecerReprovado == "SIM" && (
                      <NumberInput
                        label={"QTDE DE REPROVAS"}
                        value={
                          infoHolder.qtdeReprovasParecer
                            ? infoHolder.qtdeReprovasParecer
                            : 0
                        }
                        editable={editor}
                        handleChange={(value) => {
                          setChanges({
                            ...changes,
                            qtdeReprovasParecer: Number(value),
                          });
                          setInfo({
                            ...infoHolder,
                            qtdeReprovasParecer: Number(value),
                          });
                        }}
                      />
                    )}
                    {infoHolder.parecerReprovado == "SIM" && (
                      <div className="flex flex-col grow items-center">
                        <span className="uppercase font-bold font-raleway text-center text-sm">
                          MOTIVO DA REPROVA
                        </span>
                        <input
                          className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
                          value={
                            infoHolder.motivoReprovaParecer
                              ? infoHolder.motivoReprovaParecer
                              : ""
                          }
                          readOnly={!editor}
                          placeholder={"Informação a preencher..."}
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              motivoReprovaParecer: e.target.value,
                            });
                            setInfo({
                              ...infoHolder,
                              motivoReprovaParecer: e.target.value,
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
                            infoHolder.vistoriaReprovada === "SIM"
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              vistoriaReprovada: e.target.checked
                                ? "SIM"
                                : undefined,
                            });
                            setInfo({
                              ...infoHolder,
                              vistoriaReprovada: e.target.checked
                                ? "SIM"
                                : undefined,
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
                    {infoHolder.vistoriaReprovada == "SIM" && (
                      <NumberInput
                        label={"QTDE DE REPROVAS"}
                        value={
                          infoHolder.qtdeReprovasVistoria
                            ? infoHolder.qtdeReprovasVistoria
                            : 0
                        }
                        editable={editor}
                        handleChange={(value) => {
                          setChanges({
                            ...changes,
                            qtdeReprovasVistoria: Number(value),
                          });
                          setInfo({
                            ...infoHolder,
                            qtdeReprovasVistoria: Number(value),
                          });
                        }}
                      />
                    )}
                    {infoHolder.vistoriaReprovada == "SIM" && (
                      <div className="flex flex-col grow items-center">
                        <span className="uppercase font-bold font-raleway text-center text-sm">
                          MOTIVO DA REPROVA
                        </span>
                        <input
                          className={`text-xs w-full text-center uppercase text-gray-600 outline-none`}
                          value={
                            infoHolder.motivoReprovaVistoria
                              ? infoHolder.motivoReprovaVistoria
                              : ""
                          }
                          readOnly={!editor}
                          placeholder={"Informação a preencher..."}
                          onChange={(e) => {
                            setChanges({
                              ...changes,
                              motivoReprovaVistoria: e.target.value,
                            });
                            setInfo({
                              ...infoHolder,
                              motivoReprovaVistoria: e.target.value,
                            });
                          }}
                          type="text"
                        />
                      </div>
                    )}
                    {infoHolder.vistoriaReprovada == "SIM" && (
                      <div className="flex flex-col w-[350px] items-center">
                        <span className="uppercase font-bold font-raleway text-center text-sm">
                          EQUIPE DE CAMPO NECESSÁRIA
                        </span>
                        <div className="flex">
                          <input
                            disabled={!editor}
                            checked={
                              infoHolder.equipeDeCampoNecessaria === "SIM"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setChanges({
                                ...changes,
                                equipeDeCampoNecessaria: e.target.checked
                                  ? "SIM"
                                  : "NÃO",
                              });
                              setInfo({
                                ...infoHolder,
                                equipeDeCampoNecessaria: e.target.checked
                                  ? "SIM"
                                  : "NÃO",
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
                          infoHolder.projetoconcluido === "SIM" ? true : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            projetoconcluido: e.target.checked ? "SIM" : "NÃO",
                          });
                          setInfo({
                            ...infoHolder,
                            projetoconcluido: e.target.checked ? "SIM" : "NÃO",
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
                  {infoHolder.equipeDeCampoNecessaria == "SIM" && (
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
                    value={infoHolder.laudo ? infoHolder.laudo : "NÃO DEFINIDO"}
                    editable={editor}
                    options={[
                      { label: "EM ESTUDO", value: "EM ESTUDO" },
                      { label: "EMITIDO", value: "EMITIDO" },
                      { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    ]}
                    handleChange={(value) => {
                      setChanges({ ...changes, laudo: value });
                      setInfo({ ...infoHolder, laudo: value });
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
                          infoHolder.solicitacaoobra === "SOLICITADA"
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            solicitacaoobra: e.target.checked
                              ? "SOLICITADA"
                              : undefined,
                          });
                          setInfo({
                            ...infoHolder,
                            solicitacaoobra: e.target.checked
                              ? "SOLICITADA"
                              : undefined,
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
                      infoHolder.entradanaobra != undefined &&
                      infoHolder.entradanaobra != "-"
                        ? new Date(infoHolder.entradanaobra)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, entradanaobra: value });
                      setInfo({ ...infoHolder, entradanaobra: value });
                    }}
                  />
                  <DateInput
                    label={"SAIDA DE OBRA"}
                    editable={editor}
                    value={
                      infoHolder.saidadeobra != undefined &&
                      infoHolder.saidadeobra != "-"
                        ? new Date(infoHolder.saidadeobra)
                            .toISOString()
                            .slice(0, 10)
                        : 0
                    }
                    handleChange={(value) => {
                      setChanges({ ...changes, saidadeobra: value });
                      setInfo({ ...infoHolder, saidadeobra: value });
                    }}
                  />
                  <SelectInput
                    label={"EQUIPE RESPONSÁVEL"}
                    editable={editor}
                    value={
                      infoHolder.equipeexec != undefined &&
                      infoHolder.equipeexec != "-"
                        ? infoHolder.equipeexec == "TERCEIROS" ||
                          infoHolder.equipeexec == "TERCERIZADOS" ||
                          infoHolder.equipeexec == "OUTROS"
                          ? "OUTROS"
                          : infoHolder.equipeexec
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
                      setChanges({ ...changes, equipeexec: value });
                      setInfo({ ...infoHolder, equipeexec: value });
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
                          infoHolder.checklistobra === "SIM" ? true : false
                        }
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            checklistobra: e.target.checked ? "SIM" : undefined,
                          });
                          setInfo({
                            ...infoHolder,
                            checklistobra: e.target.checked ? "SIM" : undefined,
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
                        checked={infoHolder.trafo === "SIM" ? true : false}
                        onChange={(e) => {
                          setChanges({
                            ...changes,
                            trafo: e.target.checked ? "SIM" : undefined,
                          });
                          setInfo({
                            ...infoHolder,
                            trafo: e.target.checked ? "SIM" : undefined,
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
                      infoHolder.statusobra
                        ? infoHolder.statusobra
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
                      setChanges({ ...changes, statusobra: value });
                      setInfo({ ...infoHolder, statusobra: value });
                    }}
                  />
                  <div className="flex flex-col w-[450px] items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      OBSERVAÇÕES
                    </span>
                    <textarea
                      readOnly={!editor}
                      value={infoHolder.obsobra ? infoHolder.obsobra : ""}
                      placeholder={"Observações da obra aqui..."}
                      onChange={(e) => {
                        setChanges({ ...changes, obsobra: e.target.value });
                        setInfo({ ...infoHolder, obsobra: e.target.value });
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
