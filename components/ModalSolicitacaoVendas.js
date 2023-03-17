import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";
import { AiOutlineSearch } from "react-icons/ai";
import { VscChromeClose } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import {
  cidadesAtendidas,
  tiposDeServico,
  vendedores,
} from "../utils/constants";
import axios from "axios";
import SaveButton from "./utils/Buttons/SaveButton";
const phoneMask = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
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
function formatCEP(cep) {
  cep = cep
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
  return cep;
}
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
function ModalSolicitacaoVendas({
  info,
  editable,
  setModalIsOpen,
  handleUpdates,
}) {
  const [dados, setDados] = useState(info);
  const [msg, setMessage] = useState({ text: "", color: "" });
  function saveChanges() {
    axios
      .put("/api/solicitacoes/contrato", { ...dados, aprovacao: null })
      .then((res) => {
        setMessage({ text: "Alterações feitas", color: "text-green-500" });
        handleUpdates(info._id);
      });
  }
  return (
    <div style={OVERLAY_STYLES}>
      <div style={MODAL_STYLES}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
            <h1 className="text-[#15599a] pl-6  font-bold">
              {dados.nomeDoContrato}
            </h1>
            <div className="flex items-center gap-x-2">
              {msg.text && <p className={`italic ${msg.color}`}>{msg.text}</p>}
              {editable && (
                <SaveButton
                  text={"Salvar alterações"}
                  icon={<FaSave />}
                  handleClick={saveChanges}
                />
              )}
              <button>
                <VscChromeClose
                  onClick={() => setModalIsOpen(false)}
                  style={{ color: "red" }}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 h-full overflow-y-auto overscroll-y-auto">
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                DADOS PARA CONTRATO
              </span>
              <div className="flex gap-2 justify-around flex-wrap">
                <TextInput
                  label={"Nome/Razão Social"}
                  editable={editable}
                  value={dados.nomeDoContrato}
                  handleChange={(value) =>
                    setDados({ ...dados, nomeDoContrato: value.toUpperCase() })
                  }
                />
                <TextInput
                  label={"Telefone"}
                  editable={editable}
                  value={dados.telefone}
                  handleChange={(value) =>
                    setDados({ ...dados, telefone: phoneMask(value) })
                  }
                />
                <TextInput
                  label={"CPF/CNPJ"}
                  editable={editable}
                  value={dados.cpf_cnpj}
                  handleChange={(value) =>
                    setDados({ ...dados, cpf_cnpj: formatCnpjCpf(value) })
                  }
                />
                <TextInput
                  label={"RG"}
                  editable={editable}
                  value={dados.rg}
                  handleChange={(value) => setDados({ ...dados, rg: value })}
                />
                <DateInput
                  label={"DATA DE NASCIMENTO"}
                  editable={editable}
                  value={
                    dados.dataDeNascimento
                      ? new Date(dados.dataDeNascimento)
                          .toISOString()
                          .slice(0, 10)
                      : null
                  }
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      dataDeNascimento: new Date(value).toISOString(),
                    })
                  }
                />
                <TextInput
                  label={"CEP"}
                  editable={editable}
                  value={dados.cep}
                  handleChange={(value) =>
                    setDados({ ...dados, cep: formatCEP(value) })
                  }
                />
                {editable && (
                  <button
                    onClick={() => findCPF("enderecoCobranca")}
                    className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
                  >
                    <AiOutlineSearch />
                  </button>
                )}
                <SelectInput
                  label={"CIDADE"}
                  editable={editable}
                  value={dados.cidade}
                  options={cidadesAtendidas.map((cidade) => {
                    return { label: cidade, value: cidade };
                  })}
                  handleChange={(value) =>
                    setDados({ ...dados, cidade: value })
                  }
                />
                <TextInput
                  label={"UF"}
                  editable={editable}
                  value={dados.uf}
                  handleChange={(value) => setDados({ ...dados, uf: value })}
                />
                <TextInput
                  label={"ENDEREÇO DE COBRANÇA"}
                  editable={editable}
                  value={dados.enderecoCobranca}
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      enderecoCobranca: value.toUpperCase(),
                    })
                  }
                />
                <NumberInput
                  label={"Nº"}
                  editable={editable}
                  value={dados.numeroResCobranca}
                  handleChange={(value) =>
                    setDados({ ...dados, numeroResCobranca: Number(value) })
                  }
                />
                <TextInput
                  label={"BAIRRO"}
                  editable={editable}
                  value={dados.bairro}
                  handleChange={(value) =>
                    setDados({ ...dados, bairro: value.toUpperCase() })
                  }
                />
                <TextInput
                  label={"PONTO DE REFERÊNCIA"}
                  editable={editable}
                  value={dados.pontoDeReferencia}
                  handleChange={(value) =>
                    setDados({ ...dados, pontoDeReferencia: value })
                  }
                />
                <SelectInput
                  label={"SEGMENTO"}
                  value={dados.segmento}
                  editable={editable}
                  options={[
                    {
                      value: "RESIDENCIAL",
                      label: "RESIDENCIAL",
                    },
                    {
                      value: "COMERCIAL",
                      label: "COMERCIAL",
                    },
                    {
                      value: "INDUSTRIAL",
                      label: "INDUSTRIAL",
                    },
                    {
                      value: "RURAL",
                      label: "RURAL",
                    },
                  ]}
                  handleChange={(value) =>
                    setDados({ ...dados, segmento: value })
                  }
                />
                <SelectInput
                  label={"FORMA DE ASSINATURA"}
                  editable={editable}
                  value={dados.formaAssinatura}
                  options={[
                    {
                      value: "DIGITAL",
                      label: "DIGITAL",
                    },
                    {
                      value: "FISICO",
                      label: "FISICO",
                    },
                  ]}
                  handleChange={(value) =>
                    setDados({ ...dados, formaAssinatura: value })
                  }
                />
                <NumberInput
                  label={"NºPROJETO SVB"}
                  editable={editable}
                  value={dados.codigoSVB}
                  handleChange={(value) =>
                    setDados({ ...dados, codigoSVB: Number(value) })
                  }
                />
                <SelectInput
                  label={"ESTADO CIVIL"}
                  editable={editable}
                  options={[
                    {
                      label: "CASADO(A)",
                      value: "CASADO(A)",
                    },
                    {
                      label: "SOLTEIRO(A)",
                      value: "SOLTEIRO(A)",
                    },
                    {
                      label: "UNIÃO ESTÁVEL",
                      value: "UNIÃO ESTÁVEL",
                    },
                    {
                      label: "DIVORCIADO(A)",
                      value: "DIVORCIADO(A)",
                    },
                    {
                      label: "VIUVO(A)",
                      value: "VIUVO(A)",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  value={dados.estadoCivil}
                  handleChange={(value) =>
                    setDados({ ...dados, estadoCivil: value })
                  }
                />
                <TextInput
                  label={"EMAIL"}
                  editable={editable}
                  value={dados.email}
                  handleChange={(value) => setDados({ ...dados, email: value })}
                />
                <TextInput
                  label={"PROFISSÃO"}
                  editable={editable}
                  value={dados.profissao}
                  handleChange={(value) =>
                    setDados({ ...dados, profissao: value })
                  }
                />
                <TextInput
                  label={"ONDE TRABALHA"}
                  editable={editable}
                  value={dados.ondeTrabalha}
                  handleChange={(value) =>
                    setDados({ ...dados, ondeTrabalha: value })
                  }
                />
                <SelectInput
                  label={"POSSUI ALGUMA DEFICIÊNCIA"}
                  editable={editable}
                  value={dados.possuiDeficiencia}
                  handleChange={(value) =>
                    setDados({ ...dados, possuiDeficiencia: value })
                  }
                  options={[
                    {
                      label: "SIM",
                      value: "SIM",
                    },
                    {
                      label: "NÃO",
                      value: "NÃO",
                    },
                  ]}
                />
                {dados.possuiDeficiencia == "SIM" && (
                  <>
                    {" "}
                    <TextInput
                      label={"SE SIM, QUAL ?"}
                      editable={editable}
                      value={dados.qualDeficiencia}
                      handleChange={(value) =>
                        setDados({ ...dados, qualDeficiencia: value })
                      }
                    />
                  </>
                )}
                <SelectInput
                  label={"CANAL DE VENDA"}
                  editable={editable}
                  value={dados.canalVenda}
                  handleChange={(value) =>
                    setDados({ ...dados, canalVenda: value })
                  }
                  options={[
                    {
                      label: "NETWORK",
                      value: "NETWORK",
                    },
                    {
                      label: "INSIDE SALES",
                      value: "INSIDE SALES",
                    },
                    {
                      label: "INDICAÇÃO DE AMIGO",
                      value: "INDICAÇÃO DE AMIGO",
                    },
                    {
                      label: "PORTA A PORTA",
                      value: "PORTA A PORTA",
                    },
                    {
                      label: "TELEVENDAS",
                      value: "TELEVENDAS",
                    },
                    {
                      label: "EVENTO",
                      value: "EVENTO",
                    },
                    {
                      label: "PASSIVO",
                      value: "PASSIVO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                />
                {dados.canalVenda == "INDICAÇÃO DE AMIGO" && (
                  <>
                    <TextInput
                      label={"NOME INDICADOR"}
                      editable={editable}
                      value={dados.nomeIndicador}
                      handleChange={(value) =>
                        setDados({ ...dados, nomeIndicador: value })
                      }
                    />
                    <TextInput
                      label={"TELEFONE INDICADOR"}
                      editable={editable}
                      value={dados.telefoneIndicador}
                      handleChange={(value) =>
                        setDados({ ...dados, telefoneIndicador: value })
                      }
                    />
                  </>
                )}
              </div>
              <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">
                  COMO VOCÊ CHEGOU A ESSE CLIENTE?
                </span>
                <textarea
                  readOnly={!editable}
                  placeholder={"Descrição aqui.."}
                  value={dados.comoChegouAoCliente}
                  className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                  onChange={(e) =>
                    setDados({ ...dados, comoChegouAoCliente: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                DADOS PARA CONTATO
              </span>
              <div className="flex gap-2 justify-around flex-wrap">
                <TextInput
                  label={"NOME DO CONTATO 1"}
                  editable={editable}
                  value={dados.nomeContatoJornadaUm}
                  handleChange={(value) =>
                    setDados({ ...dados, nomeContatoJornadaUm: value })
                  }
                />
                <TextInput
                  label={"TELEFONE DO CONTATO 1"}
                  editable={editable}
                  value={dados.telefoneContatoUm}
                  handleChange={(value) =>
                    setDados({ ...dados, telefoneContatoUm: phoneMask(value) })
                  }
                />
                <TextInput
                  label={"NOME DO CONTATO 2"}
                  editable={editable}
                  value={dados.nomeContatoJornadaDois}
                  handleChange={(value) =>
                    setDados({ ...dados, nomeContatoJornadaDois: value })
                  }
                />
                <TextInput
                  label={"TELEFONE DO CONTATO 2"}
                  editable={editable}
                  value={dados.telefoneContatoDois}
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      telefoneContatoDois: phoneMask(value),
                    })
                  }
                />
                <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    CUIDADOS PARA CONTATO COM O CLIENTE
                  </span>
                  <textarea
                    readOnly={!editable}
                    placeholder={
                      "Descreva aqui cuidados em relação ao contato do cliente durante a jornada. Melhores horários para contato, texto ou aúdio, etc..."
                    }
                    value={dados.cuidadosContatoJornada}
                    className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        cuidadosContatoJornada: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                DADOS PARA ENTRADA NA CEMIG
              </span>
              <div className="flex gap-2 justify-around flex-wrap">
                <TextInput
                  label={"NOME DO TITULAR DO PROJETO"}
                  editable={editable}
                  value={dados.nomeTitularProjeto}
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      nomeTitularProjeto: value.toUpperCase(),
                    })
                  }
                />
                <SelectInput
                  label={"TIPO DO TITULAR"}
                  editable={editable}
                  value={dados.tipoDoTitular}
                  handleChange={(value) =>
                    setDados({ ...dados, tipoDoTitular: value })
                  }
                  options={[
                    {
                      label: "PESSOA FISICA",
                      value: "PESSOA FISICA",
                    },
                    {
                      label: "PESSOA JURIDICA",
                      value: "PESSOA JURIDICA",
                    },
                  ]}
                />
                <SelectInput
                  label={"TIPO DA LIGAÇÃO"}
                  editable={editable}
                  value={dados.tipoDaLigacao}
                  handleChange={(value) =>
                    setDados({ ...dados, tipoDaLigacao: value })
                  }
                  options={[
                    {
                      label: "NOVA",
                      value: "NOVA",
                    },
                    {
                      label: "EXISTENTE",
                      value: "EXISTENTE",
                    },
                  ]}
                />
                <SelectInput
                  label={"TIPO DA INSTALAÇÃO"}
                  editable={editable}
                  value={dados.tipoDaInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, tipoDaInstalacao: value })
                  }
                  options={[
                    {
                      label: "RURAL",
                      value: "RURAL",
                    },
                    {
                      label: "URBANO",
                      value: "URBANO",
                    },
                  ]}
                />
                <TextInput
                  label={"CEP INSTALAÇÃO"}
                  editable={editable}
                  value={dados.cepInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, cepInstalacao: formatCEP(value) })
                  }
                />
                {editable && (
                  <button
                    onClick={() => findCPF("enderecoInstalacao")}
                    className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
                  >
                    <AiOutlineSearch />
                  </button>
                )}

                <TextInput
                  label={"ENDEREÇO DE INSTALAÇÃO"}
                  editable={editable}
                  value={dados.enderecoInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, enderecoInstalacao: value })
                  }
                />
                <NumberInput
                  label={"Nº"}
                  editable={editable}
                  value={dados.numeroResInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, numeroResInstalacao: value })
                  }
                />
                <NumberInput
                  label={"Nº DA INSTALAÇÃO"}
                  editable={editable}
                  value={dados.numeroInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, numeroInstalacao: value })
                  }
                />
                <TextInput
                  label={"BAIRRO"}
                  editable={editable}
                  value={dados.bairroInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, bairroInstalacao: value })
                  }
                />
                <SelectInput
                  label={"CIDADE"}
                  editable={editable}
                  value={dados.cidadeInstalacao}
                  options={cidadesAtendidas.map((cidade) => {
                    return { label: cidade, value: cidade };
                  })}
                  handleChange={(value) =>
                    setDados({ ...dados, cidadeInstalacao: value })
                  }
                />
                <TextInput
                  label={"UF"}
                  editable={editable}
                  value={dados.ufInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, ufInstalacao: value })
                  }
                />
                <TextInput
                  label={"PONTO DE REFERÊNCIA"}
                  editable={editable}
                  value={dados.pontoDeReferenciaInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, pontoDeReferenciaInstalacao: value })
                  }
                />
                <TextInput
                  label={"LOGIN(CEMIG ATENDE)"}
                  normalCase={true}
                  editable={editable}
                  value={dados.loginCemigAtende}
                  handleChange={(value) =>
                    setDados({ ...dados, loginCemigAtende: value })
                  }
                />
                <TextInput
                  label={"SENHA(CEMIG ATENDE)"}
                  normalCase={true}
                  editable={editable}
                  value={dados.senhaCemigAtende}
                  handleChange={(value) =>
                    setDados({ ...dados, senhaCemigAtende: value })
                  }
                />
                <TextInput
                  label={"LATITUDE"}
                  editable={editable}
                  value={dados.latitude}
                  handleChange={(value) =>
                    setDados({ ...dados, latitude: value })
                  }
                />
                <TextInput
                  label={"LONGITUDE"}
                  editable={editable}
                  value={dados.longitude}
                  handleChange={(value) =>
                    setDados({ ...dados, longitude: value })
                  }
                />
                <NumberInput
                  label={"POTÊNIA PICO"}
                  editable={editable}
                  value={dados.potPico}
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      potPico: Number(value),
                      geracaoPrevista: Number(value) * 126,
                    })
                  }
                />
                <NumberInput
                  label={"GERAÇÃO PREVISTA"}
                  editable={editable}
                  value={Number(dados.geracaoPrevista).toFixed(2)}
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      geracaoPrevista: Number(value).toFixed(2),
                    })
                  }
                />
              </div>
            </div>
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                DADOS DO SISTEMA
              </span>
              <div className="flex justify-center">
                <SelectInput
                  label={"TOPOLOGIA"}
                  editable={editable}
                  value={dados.topologia}
                  handleChange={(value) =>
                    setDados({ ...dados, topologia: value })
                  }
                  options={[
                    {
                      label: "MICRO-INVERSOR",
                      value: "MICRO",
                    },
                    {
                      label: "INVERSOR",
                      value: "INVERSOR",
                    },
                    {
                      label: "OTIMIZADOR",
                      value: "OTIMIZADOR",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                />
              </div>
              <div className="flex gap-2 justify-around flex-wrap">
                {dados.topologia != "NÃO DEFINIDO" && (
                  <>
                    <TextInput
                      label={"MARCA DO INVERSOR/MICRO"}
                      editable={editable}
                      value={dados.marcaInversor}
                      handleChange={(value) =>
                        setDados({ ...dados, marcaInversor: value })
                      }
                    />
                    <NumberInput
                      label={"QTDE INVERSOR/MICRO"}
                      editable={editable}
                      value={dados.qtdeInversor}
                      handleChange={(value) =>
                        setDados({ ...dados, qtdeInversor: Number(value) })
                      }
                    />
                    <NumberInput
                      label={"POTÊNCIA INVERSOR/MICRO"}
                      editable={editable}
                      unit={"W"}
                      value={dados.potInversor}
                      handleChange={(value) =>
                        setDados({ ...dados, potInversor: Number(value) })
                      }
                    />
                  </>
                )}
              </div>
              {dados.topologia == "OTIMIZADOR" && (
                <div className="flex gap-2 justify-around flex-wrap mt-2">
                  <TextInput
                    label={"MARCA DO OTIMIZADOR"}
                    editable={editable}
                    value={dados.marcaOtimizador ? dados.marcaOtimizador : ""}
                    handleChange={(value) =>
                      setDados({ ...dados, marcaOtimizador: value })
                    }
                  />
                  <NumberInput
                    label={"QTDE DO OTIMIZADOR"}
                    editable={editable}
                    value={dados.qtdeOtimizador ? dados.qtdeOtimizador : null}
                    handleChange={(value) =>
                      setDados({ ...dados, qtdeOtimizador: Number(value) })
                    }
                  />
                  <NumberInput
                    label={"POTÊNCIA DO OTIMIZADOR"}
                    editable={editable}
                    unit={"W"}
                    value={dados.potOtimizador ? dados.potOtimizador : null}
                    handleChange={(value) =>
                      setDados({ ...dados, potOtimizador: Number(value) })
                    }
                  />
                </div>
              )}
              <div className="flex gap-2 justify-around flex-wrap mt-2 pt-2 border-t border-gray-200 mx-2">
                <TextInput
                  label={"MARCA DOS MÓDULOS"}
                  editable={editable}
                  value={dados.marcaModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, marcaModulos: value })
                  }
                />
                <NumberInput
                  label={"Nº DE MÓDULOS"}
                  editable={editable}
                  value={dados.qtdeModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, qtdeModulos: Number(value) })
                  }
                />
                <NumberInput
                  label={"POTÊNCIA DOS MÓDULOS"}
                  editable={editable}
                  unit={"W"}
                  value={dados.potModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, potModulos: Number(value) })
                  }
                />
              </div>
            </div>
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                ESTRUTURA DE MONTAGEM
              </span>
              <div className="flex gap-2 justify-around flex-wrap">
                <SelectInput
                  label={"TIPO DA ESTRUTURA"}
                  editable={editable}
                  options={[
                    {
                      label: "TELHADO",
                      value: "TELHADO",
                    },
                    {
                      label: "CARPORT",
                      value: "CARPORT",
                    },
                    {
                      label: "SOLO",
                      value: "SOLO",
                    },
                    {
                      label: "ESTRUTURA PERSONALIZADA",
                      value: "ESTRUTURA PERSONALIZADA",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  value={dados.tipoEstrutura}
                  handleChange={(value) =>
                    setDados({ ...dados, tipoEstrutura: value })
                  }
                />
                <SelectInput
                  label={"ESTRUTURA AMPÈRE"}
                  editable={editable}
                  options={[
                    {
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      label: "SIM",
                      value: "SIM",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  value={dados.estruturaAmpere}
                  handleChange={(value) =>
                    setDados({ ...dados, estruturaAmpere: value })
                  }
                />
                <SelectInput
                  label={"RESPONSÁVEL PELA ESTRUTURA"}
                  editable={editable}
                  options={[
                    {
                      label: "AMPERE",
                      value: "AMPERE",
                    },
                    {
                      label: "CLIENTE",
                      value: "CLIENTE",
                    },
                    {
                      label: "NÃO SE APLICA",
                      value: "NÃO SE APLICA",
                    },
                  ]}
                  value={dados.responsavelEstrutura}
                  handleChange={(value) =>
                    setDados({ ...dados, responsavelEstrutura: value })
                  }
                />
                {dados.responsavelEstrutura != "NÃO SE APLICA" && (
                  <>
                    <SelectInput
                      label={"FORMA DE PAGAMENTO"}
                      editable={editable}
                      options={[
                        {
                          label: "INCLUSO NO FINANCIAMENTO",
                          value: "INCLUSO NO FINANCIAMENTO",
                        },
                        {
                          label: "DIRETO PRO FORNECEDOR",
                          value: "DIRETO PRO FORNECEDOR",
                        },
                        {
                          label: "A VISTA PARA AMPÈRE",
                          value: "A VISTA PARA AMPÈRE",
                        },
                        {
                          label: "NÃO SE APLICA",
                          value: "NÃO SE APLICA",
                        },
                        {
                          label: "NÃO DEFINIDO",
                          value: "NÃO DEFINIDO",
                        },
                      ]}
                      value={dados.formaPagamentoEstrutura}
                      handleChange={(value) =>
                        setDados({ ...dados, formaPagamentoEstrutura: value })
                      }
                    />
                    <NumberInput
                      label={"VALOR DA ESTRUTURA"}
                      editable={editable}
                      value={dados.valorEstrutura}
                      handleChange={(value) =>
                        setDados({ ...dados, valorEstrutura: Number(value) })
                      }
                    />
                  </>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                O&M E SEGURO
              </span>
              <div className="flex gap-2 justify-around flex-wrap">
                <SelectInput
                  label={"KIT COM O&M ?"}
                  editable={editable}
                  options={[
                    {
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      label: "SIM",
                      value: "SIM",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  value={dados.possuiOeM}
                  handleChange={(value) =>
                    setDados({ ...dados, possuiOeM: value })
                  }
                />
                {dados.possuiOeM == "SIM" && (
                  <>
                    <SelectInput
                      label={"QUAL PLANO DE O&M?"}
                      editable={editable}
                      options={[
                        {
                          label: "MANUTENÇÃO SIMPLES",
                          value: "MANUTENÇÃO SIMPLES",
                        },
                        {
                          label: "PLANO SOL",
                          value: "PLANO SOL",
                        },
                        {
                          label: "PLANO SOL +",
                          value: "PLANO SOL +",
                        },
                        {
                          label: "NÃO SE APLICA",
                          value: "NÃO SE APLICA",
                        },
                      ]}
                      value={dados.planoOeM}
                      handleChange={(value) =>
                        setDados({ ...dados, planoOeM: value })
                      }
                    />
                  </>
                )}
              </div>
              <div className="flex gap-2 justify-around flex-wrap mt-2">
                <SelectInput
                  label={"CLIENTE SEGURADO?"}
                  editable={editable}
                  options={[
                    {
                      label: "SIM",
                      value: "SIM",
                    },
                    {
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  value={dados.clienteSegurado}
                  handleChange={(value) =>
                    setDados({ ...dados, clienteSegurado: value })
                  }
                />
                {dados.clienteSegurado == "SIM" && (
                  <>
                    <SelectInput
                      label={"TEMPO SEGURADO"}
                      editable={editable}
                      options={[
                        {
                          label: "1 ANO",
                          value: "1 ANO",
                        },
                        {
                          label: "2 ANOS",
                          value: "2 ANOS",
                        },
                        {
                          label: "3 ANOS",
                          value: "3 ANOS",
                        },
                        {
                          label: "4 ANOS",
                          value: "4 ANOS",
                        },
                        {
                          label: "5 ANOS",
                          value: "5 ANOS",
                        },
                        {
                          label: "NÃO SE APLICA",
                          value: "NÃO SE APLICA",
                        },
                      ]}
                      value={dados.tempoSegurado}
                      handleChange={(value) =>
                        setDados({ ...dados, tempoSegurado: value })
                      }
                    />
                  </>
                )}
              </div>
              {(dados.possuiOeM == "SIM" || dados.clienteSegurado == "SIM") && (
                <div className="flex gap-2 justify-around flex-wrap mt-2">
                  <SelectInput
                    label={"FORMA de PAGAMENTO"}
                    editable={editable}
                    options={[
                      {
                        label: "INCLUSO NO FINANCIAMENTO",
                        value: "INCLUSO NO FINANCIAMENTO",
                      },
                      {
                        label: "DIRETO PRO FORNECEDOR",
                        value: "DIRETO PRO FORNECEDOR",
                      },
                      {
                        label: "A VISTA PARA AMPÈRE",
                        value: "A VISTA PARA AMPÈRE",
                      },
                      {
                        label: "NÃO SE APLICA",
                        value: "NÃO SE APLICA",
                      },
                    ]}
                    value={dados.formaPagamentoOeMOuSeguro}
                    handleChange={(value) =>
                      setDados({ ...dados, formaPagamentoOeMOuSeguro: value })
                    }
                  />
                  <NumberInput
                    label={"VALOR O&M+SEGURO (se não incluso)"}
                    editable={editable}
                    value={dados.valorOeMOuSeguro}
                    handleChange={(value) =>
                      setDados({ ...dados, valorOeMOuSeguro: Number(value) })
                    }
                  />
                </div>
              )}
            </div>
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                AUMENTO DE CARGA
              </span>
              <div className="flex justify-center">
                <SelectInput
                  label={"HAVERÁ TROCA DE PADRÃO?"}
                  editable={editable}
                  options={[
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                    {
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      label: "SIM",
                      value: "SIM",
                    },
                  ]}
                  value={dados.aumentoDeCarga}
                  handleChange={(value) =>
                    setDados({ ...dados, aumentoDeCarga: value })
                  }
                />
              </div>
              {dados.aumentoDeCarga == "SIM" && (
                <div className="flex gap-2 justify-around flex-wrap mt-2">
                  <SelectInput
                    label={"TIPO DO PADRÃO"}
                    editable={editable}
                    value={dados.tipoDePadrao}
                    handleChange={(value) =>
                      setDados({ ...dados, tipoDePadrao: value })
                    }
                    options={[
                      {
                        label: "MONO 40A",
                        value: "MONO 40A",
                      },
                      {
                        label: "MONO 63A",
                        value: "MONO 63A",
                      },
                      {
                        label: "BIFASICO 63A",
                        value: "BIFASICO 63A",
                      },
                      {
                        label: "BIFASICO 100A",
                        value: "BIFASICO 100A",
                      },
                      {
                        label: "BIFASICO 125A",
                        value: "BIFASICO 125A",
                      },
                      {
                        label: "BIFASICO 150A",
                        value: "BIFASICO 150A",
                      },
                      {
                        label: "BIFASICO 200A",
                        value: "BIFASICO 200A",
                      },
                      {
                        label: "TRIFASICO 63A",
                        value: "TRIFASICO 63A",
                      },
                      {
                        label: "TRIFASICO 100A",
                        value: "TRIFASICO 100A",
                      },
                      {
                        label: "TRIFASICO 125A",
                        value: "TRIFASICO 125A",
                      },
                      {
                        label: "TRIFASICO 150A",
                        value: "TRIFASICO 150A",
                      },
                      {
                        label: "TRIFASICO 200A",
                        value: "TRIFASICO 200A",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                  />
                  <SelectInput
                    label={"HAVERÁ AUMENTO DO DISJUNTOR?"}
                    editable={editable}
                    value={dados.aumentoDisjuntor}
                    handleChange={(value) =>
                      setDados({ ...dados, aumentoDisjuntor: value })
                    }
                    options={[
                      {
                        label: "SIM",
                        value: "SIM",
                      },
                      {
                        label: "NÃO",
                        value: "NÃO",
                      },
                    ]}
                  />
                  <SelectInput
                    label={"RESPONSÁVEL PELA TROCA"}
                    editable={editable}
                    value={dados.respTrocaPadrao}
                    handleChange={(value) =>
                      setDados({ ...dados, respTrocaPadrao: value })
                    }
                    options={[
                      {
                        label: "AMPERE",
                        value: "AMPERE",
                      },
                      {
                        label: "CLIENTE",
                        value: "CLIENTE",
                      },
                      {
                        label: "NÃO SE APLICA",
                        value: "NÃO SE APLICA",
                      },
                    ]}
                  />
                  <SelectInput
                    label={"PAGAMENTO DO PADRÃO"}
                    editable={editable}
                    value={
                      dados.formaPagamentoPadrao
                        ? dados.formaPagamentoPadrao
                        : "NÃO HAVERA TROCA PADRÃO"
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
                      setDados({ ...dados, formaPagamentoPadrao: value });
                    }}
                  />
                  <NumberInput
                    label={"VALOR DO PADRÃO"}
                    editable={editable}
                    value={dados.valorPadrao}
                    handleChange={(value) =>
                      setDados({ ...dados, valorPadrao: Number(value) })
                    }
                  />
                </div>
              )}
            </div>
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                DADOS FINANCEIROS E NEGOCIAÇÃO
              </span>
              <div className="flex gap-2 justify-around flex-wrap mt-2">
                <TextInput
                  label={"NOME DO PAGADOR"}
                  editable={editable}
                  value={dados.nomePagador}
                  handleChange={(value) =>
                    setDados({ ...dados, nomePagador: value })
                  }
                />
                <TextInput
                  label={"CONTATO DO PAGADOR"}
                  editable={editable}
                  value={dados.contatoPagador}
                  handleChange={(value) =>
                    setDados({ ...dados, contatoPagador: phoneMask(value) })
                  }
                />
                <TextInput
                  label={"CPF/CNPJ PARA NF"}
                  editable={editable}
                  value={dados.cpf_cnpjNF}
                  handleChange={(value) =>
                    setDados({ ...dados, cpf_cnpjNF: formatCnpjCpf(value) })
                  }
                />
              </div>
              <div className="flex gap-2 justify-around flex-wrap mt-2">
                <SelectInput
                  label={"NECESSIDADE DE INSCRIÇÃO RURAL NA N.F?"}
                  editable={editable}
                  value={dados.necessidaInscricaoRural}
                  handleChange={(value) =>
                    setDados({ ...dados, necessidaInscricaoRural: value })
                  }
                  options={[
                    {
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      label: "SIM",
                      value: "SIM",
                    },
                  ]}
                />
                {dados.necessidaInscricaoRural == "SIM" && (
                  <TextInput
                    label={"INSCRIÇÃO RURAL"}
                    editable={editable}
                    value={dados.inscriçãoRural}
                    handleChange={(value) =>
                      setDados({ ...dados, inscriçãoRural: value })
                    }
                  />
                )}
              </div>
              <div className="flex gap-2 justify-around flex-wrap mt-2">
                <SelectInput
                  label={"LOCAL DE ENTREGA"}
                  editable={editable}
                  options={[
                    {
                      label: "MESMO DO PROJETO",
                      value: "MESMO DO PROJETO",
                    },
                    {
                      label:
                        "LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)",
                      value:
                        "LOCAL DIFERENTE DA INSTALAÇÃO (DESCRITO NAS OBSERVAÇÕES)",
                    },
                    {
                      label:
                        "ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)",
                      value:
                        "ENTREGAR NA AMPÈRE(SOMENTE COM AUTORIZAÇÃO DO GERENTE COMERCIAL)",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  value={dados.localEntrega}
                  handleChange={(value) =>
                    setDados({ ...dados, localEntrega: value })
                  }
                />
                <SelectInput
                  label={"END. ENTREGA IGUAL COBRANÇA?"}
                  editable={editable}
                  value={dados.entregaIgualCobranca}
                  handleChange={(value) =>
                    setDados({ ...dados, entregaIgualCobranca: value })
                  }
                  options={[
                    {
                      label: "SIM",
                      value: "SIM",
                    },
                    {
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                />
                <SelectInput
                  label={"HÁ RESTRIÇÕES PARA ENTREGA?"}
                  editable={editable}
                  value={dados.restricoesEntrega}
                  handleChange={(value) =>
                    setDados({ ...dados, restricoesEntrega: value })
                  }
                  options={[
                    {
                      label: "SOMENTE HORARIO COMERCIAL",
                      value: "SOMENTE HORARIO COMERCIAL",
                    },
                    {
                      label: "NÃO HÁ RESTRIÇÕES",
                      value: "NÃO HÁ RESTRIÇÕES",
                    },
                    {
                      label: "CASA EM CONSTRUÇÃO",
                      value: "CASA EM CONSTRUÇÃO",
                    },
                    {
                      label: "NÃO PODE RECEBER EM HORARIO COMERCIAL",
                      value: "NÃO PODE RECEBER EM HORARIO COMERCIAL",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                />
              </div>
              <div className="flex gap-2 justify-around flex-wrap mt-2">
                <NumberInput
                  label={
                    "VALOR DO CONTRATO FOTOVOLTAICO(SEM CUSTOS ADICIONAIS)"
                  }
                  editable={editable}
                  tag={"R$"}
                  value={dados.valorContrato}
                  handleChange={(value) =>
                    setDados({ ...dados, valorContrato: Number(value) })
                  }
                />
                <SelectInput
                  label={"ORIGEM DO RECURSO"}
                  editable={editable}
                  value={dados.origemRecurso}
                  handleChange={(value) =>
                    setDados({ ...dados, origemRecurso: value })
                  }
                  options={[
                    {
                      label: "FINANCIAMENTO",
                      value: "FINANCIAMENTO",
                    },
                    {
                      label: "CAPITAL PRÓPRIO",
                      value: "CAPITAL PRÓPRIO",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                />
                {dados.origemRecurso == "FINANCIAMENTO" && (
                  <>
                    <SelectInput
                      label={"CREDOR"}
                      editable={editable}
                      options={[
                        {
                          label: "NÃO DEFINIDO",
                          value: "NÃO DEFINIDO",
                        },
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
                      ]}
                      value={dados.credor}
                      handleChange={(value) =>
                        setDados({ ...dados, credor: value })
                      }
                    />
                    <TextInput
                      label={"NOME DO GERENTE"}
                      editable={editable}
                      value={dados.nomeGerente}
                      handleChange={(value) =>
                        setDados({ ...dados, nomeGerente: value })
                      }
                    />
                    <TextInput
                      label={"CONTATO DO GERENTE"}
                      editable={editable}
                      value={dados.contatoGerente}
                      handleChange={(value) =>
                        setDados({ ...dados, contatoGerente: phoneMask(value) })
                      }
                    />
                  </>
                )}
                <NumberInput
                  label={"SE CARTÃO OU CHEQUE, QUANTAS PARCELAS?"}
                  editable={editable}
                  value={dados.numParcelas}
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      numParcelas: Number(value),
                      valorParcela: dados.valorContrato / Number(value),
                    })
                  }
                />
                <NumberInput
                  label={"VALOR DA PARCELA"}
                  editable={editable}
                  value={dados.valorParcela}
                  tag={"R$"}
                  handleChange={(value) =>
                    setDados({ ...dados, valorParcela: Number(value) })
                  }
                />
                <SelectInput
                  label={"NECESSIDADE N.F ADIANTADA"}
                  editable={editable}
                  value={dados.necessidadeNFAdiantada}
                  options={[
                    {
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      label: "SIM",
                      value: "SIM",
                    },
                  ]}
                  handleChange={(value) =>
                    setDados({ ...dados, necessidadeNFAdiantada: value })
                  }
                />
                <SelectInput
                  label={"NECESSIDADE CÓDIGO FINAME?"}
                  editable={editable}
                  value={dados.necessidadeCodigoFiname}
                  options={[
                    {
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      label: "SIM",
                      value: "SIM",
                    },
                  ]}
                  handleChange={(value) =>
                    setDados({ ...dados, necessidadeCodigoFiname: value })
                  }
                />
                <SelectInput
                  label={"FORMA DE PAGAMENTO"}
                  editable={editable}
                  options={[
                    {
                      label:
                        "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR",
                      value:
                        "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR",
                    },
                    {
                      label: "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                      value: "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                    },
                    {
                      label: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                      value: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  value={dados.formaDePagamento}
                  handleChange={(value) =>
                    setDados({ ...dados, formaDePagamento: value })
                  }
                />
              </div>
              <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">
                  DESCRIÇÃO DA NEGOCIAÇÃO
                </span>
                <textarea
                  readOnly={!editable}
                  placeholder={"Descreva aqui a negociação"}
                  value={dados.descricaoNegociacao}
                  className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                  onChange={(e) =>
                    setDados({ ...dados, descricaoNegociacao: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                DISTRIBUIÇÃO DE CRÉDITOS
              </span>
              <div className="flex justify-center mt-2">
                <SelectInput
                  label={"POSSUI DISTRIBUIÇÕES DE CRÉDITOS?"}
                  editable={editable}
                  value={dados.possuiDistribuicao}
                  options={[
                    {
                      label: "NÃO",
                      value: "NÃO",
                    },
                    {
                      label: "SIM",
                      value: "SIM",
                    },
                  ]}
                  handleChange={(value) =>
                    setDados({ ...dados, possuiDistribuicao: value })
                  }
                />
              </div>
              {dados.possuiDistribuicao == "SIM" && (
                <>
                  {dados.distribuicoes.length > 0 && (
                    <div className="flex flex-col gap-2 mt-4">
                      {dados.distribuicoes.map((distribuicao, index) => (
                        <div
                          key={index}
                          className="flex justify-around flex-wrap"
                        >
                          <p className="text-sm font-bold text-gray-600 ">
                            INSTALAÇÃO Nº{distribuicao.numInstalacao}
                          </p>
                          <p className="text-sm font-bold text-gray-600">
                            {distribuicao.excedente}%
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                DOCUMENTOS NECESSÁRIOS
              </span>
              <div className="flex gap-2 justify-around flex-wrap mt-2">
                <div className="w-fit">
                  <input
                    checked={dados.contaDeEnergia ? true : false}
                    disabled={true}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        contaDeEnergia: e.target.checked,
                      })
                    }
                    type="checkbox"
                    name="contaDeEnergia"
                    id="contaDeEnergia"
                  />
                  <label className="ml-2" htmlFor="contaDeEnergia">
                    CONTA DE ENERGIA
                  </label>
                </div>
                <div className="w-fit">
                  <input
                    checked={dados.propostaComercial ? true : false}
                    disabled={true}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        propostaComercial: e.target.checked,
                      })
                    }
                    type="checkbox"
                    name="propostaComercial"
                    id="propostaComercial"
                  />
                  <label className="ml-2" htmlFor="propostaComercial">
                    PROPOSTA COMERCIAL ATUALIZADA
                  </label>
                </div>
                <div className="w-fit">
                  <input
                    checked={dados.visitaTecnicaFeita ? true : false}
                    disabled={true}
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        visitaTecnicaFeita: e.target.checked,
                      })
                    }
                    type="checkbox"
                    name="visitaTecnicaFeita"
                    id="visitaTecnicaFeita"
                  />
                  <label className="ml-2" htmlFor="visitaTecnicaFeita">
                    VISITA TÉCNICA
                  </label>
                </div>
                {dados.tipoDaInstalacao == "RURAL" && (
                  <>
                    <div className="w-fit">
                      <input
                        checked={dados.car ? true : false}
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            car: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="car"
                        id="car"
                      />
                      <label className="ml-2" htmlFor="car">
                        CAR
                      </label>
                    </div>
                    <div className="w-fit">
                      <input
                        checked={dados.matricula ? true : false}
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            matricula: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="matricula"
                        id="matricula"
                      />
                      <label className="ml-2" htmlFor="matricula">
                        MATRÍCULA
                      </label>
                    </div>
                    <div className="w-fit">
                      <input
                        checked={
                          dados.comprovanteEnderecoCorrespondente ? true : false
                        }
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            comprovanteEnderecoCorrespondente: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="comprovanteEnderecoCorrespondente"
                        id="comprovanteEnderecoCorrespondente"
                      />
                      <label
                        className="ml-2"
                        htmlFor="comprovanteEnderecoCorrespondente"
                      >
                        COMPROVANTE ENDEREÇO CORRESPONDENTE
                      </label>
                    </div>
                    <div className="w-fit">
                      <input
                        checked={dados.ramoDeAtividade ? true : false}
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            ramoDeAtividade: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="ramoDeAtividade"
                        id="ramoDeAtividade"
                      />
                      <label className="ml-2" htmlFor="ramoDeAtividade">
                        RAMO DE ATIVIDADE
                      </label>
                    </div>
                  </>
                )}
                {dados.tipoDaInstalacao == "URBANO" && (
                  <>
                    <div className="w-fit">
                      <input
                        checked={dados.iptu ? true : false}
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            iptu: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="iptu"
                        id="iptu"
                      />
                      <label className="ml-2" htmlFor="iptu">
                        IPTU
                      </label>
                    </div>
                  </>
                )}
                {dados.tipoDoTitular == "PESSOA FISICA" && (
                  <>
                    <div className="w-fit">
                      <input
                        checked={dados.documentoComFoto ? true : false}
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            documentoComFoto: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="documentoComFoto"
                        id="documentoComFoto"
                      />
                      <label className="ml-2" htmlFor="documentoComFoto">
                        DOCUMENTO COM FOTO
                      </label>
                    </div>
                  </>
                )}
                {dados.tipoDoTitular == "PESSOA JURIDICA" && (
                  <>
                    <div className="w-fit">
                      <input
                        checked={dados.contratoSocial ? true : false}
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            contratoSocial: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="contratoSocial"
                        id="contratoSocial"
                      />
                      <label className="ml-2" htmlFor="contratoSocial">
                        CONTRATO SOCIAL
                      </label>
                    </div>
                    <div className="w-fit">
                      <input
                        checked={dados.cartaoCnpj ? true : false}
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            cartaoCnpj: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="cartaoCnpj"
                        id="cartaoCnpj"
                      />
                      <label className="ml-2" htmlFor="cartaoCnpj">
                        CARTÃO CNPJ
                      </label>
                    </div>
                    <div className="w-fit">
                      <input
                        checked={
                          dados.comprovanteEnderecoRepresentante ? true : false
                        }
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            comprovanteEnderecoRepresentante: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="comprovanteEnderecoRepresentante"
                        id="comprovanteEnderecoRepresentante"
                      />
                      <label
                        className="ml-2"
                        htmlFor="comprovanteEnderecoRepresentante"
                      >
                        COMPROVANTE DE ENDEREÇO - REPRESENTANTE LEGAL
                      </label>
                    </div>
                    <div className="w-fit">
                      <input
                        checked={dados.documentoComFotoSocios ? true : false}
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            documentoComFotoSocios: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="documentoComFotoSocios"
                        id="documentoComFotoSocios"
                      />
                      <label className="ml-2" htmlFor="documentoComFotoSocios">
                        DOCUMENTO COM FOTOS DE TODOS OS SÓCIOS
                      </label>
                    </div>
                  </>
                )}
                {(dados.aumentoDeCarga == "SIM" ||
                  dados.tipoDaLigacao == "NOVA") && (
                  <>
                    <div className="w-fit">
                      <input
                        checked={dados.relacaoDeCargas ? true : false}
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            relacaoDeCargas: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="relacaoDeCargas"
                        id="relacaoDeCargas"
                      />
                      <label className="ml-2" htmlFor="relacaoDeCargas">
                        RELAÇÃO DE CARGAS
                      </label>
                    </div>
                  </>
                )}
                {dados.possuiDistribuicao == "SIM" && (
                  <>
                    <div className="w-fit">
                      <input
                        checked={dados.faturasRecebedoras ? true : false}
                        disabled={true}
                        onChange={(e) =>
                          setDados({
                            ...dados,
                            faturasRecebedoras: e.target.checked,
                          })
                        }
                        type="checkbox"
                        name="faturasRecebedoras"
                        id="faturasRecebedoras"
                      />
                      <label className="ml-2" htmlFor="faturasRecebedoras">
                        FATURAS DAS RECEBEDORAS
                      </label>
                    </div>
                  </>
                )}
              </div>
              <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
                <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
                  <span className="uppercase font-bold font-raleway text-center text-sm">
                    COMENTÁRIOS AO VENDEDOR
                  </span>
                  <textarea
                    readOnly={true}
                    placeholder={"Comentários aqui.."}
                    value={dados.comentariosAoVendedor}
                    className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                    onChange={(e) =>
                      setDados({
                        ...dados,
                        comentariosAoVendedor: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalSolicitacaoVendas;
