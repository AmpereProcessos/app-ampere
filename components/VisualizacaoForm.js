import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";
import { FiDelete } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { cidadesAtendidas, vendedores } from "../utils/constants";
import axios from "axios";
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
function VisualizacaoForm({ dados, voltar, setDados }) {
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  function criarSolicitacao() {
    axios
      .post("/api/solicitacoes/contrato", dados)
      .then((res) => {
        setMsg({ text: "Solicitação enviada!", color: "text-gree-500" });
        setTimeout(() => {
          location.reload();
        }, 2800);
      })
      .catch((err) =>
        setMsg({
          text: "Um erro ocorreu, tente novamente!",
          color: "text-green-500",
        })
      );
  }
  return (
    <>
      <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
        <h1 className="text-center font-bold text-[#fead61] mt-1 text-xl">
          REVISÃO DAS INFORMAÇÕES
        </h1>
      </div>
      <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
        <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
          DADOS PARA CONTRATO
        </span>
        <div className="flex gap-2 justify-around flex-wrap">
          <TextInput
            label={"Nome/Razão Social"}
            editable={true}
            value={dados.nomeDoContrato}
            handleChange={(value) =>
              setDados({ ...dados, nomeDoContrato: value.toUpperCase() })
            }
          />
          <TextInput
            label={"Telefone"}
            editable={true}
            value={dados.telefone}
            handleChange={(value) =>
              setDados({ ...dados, telefone: phoneMask(value) })
            }
          />
          <TextInput
            label={"CPF/CNPJ"}
            editable={true}
            value={dados.cpf_cnpj}
            handleChange={(value) =>
              setDados({ ...dados, cpf_cnpj: formatCnpjCpf(value) })
            }
          />
          <TextInput
            label={"RG"}
            editable={true}
            value={dados.rg}
            handleChange={(value) => setDados({ ...dados, rg: value })}
          />
          <DateInput
            label={"DATA DE NASCIMENTO"}
            editable={true}
            value={
              dados.dataDeNascimento
                ? new Date(dados.dataDeNascimento).toISOString().slice(0, 10)
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
            editable={true}
            value={dados.cep}
            handleChange={(value) =>
              setDados({ ...dados, cep: formatCEP(value) })
            }
          />
          <button
            onClick={() => findCPF("enderecoCobranca")}
            className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
          >
            <AiOutlineSearch />
          </button>
          <SelectInput
            label={"CIDADE"}
            editable={true}
            value={dados.cidade}
            options={cidadesAtendidas.map((cidade) => {
              return { label: cidade, value: cidade };
            })}
            handleChange={(value) => setDados({ ...dados, cidade: value })}
          />
          <TextInput
            label={"UF"}
            editable={true}
            value={dados.uf}
            handleChange={(value) => setDados({ ...dados, uf: value })}
          />
          <TextInput
            label={"ENDEREÇO DE COBRANÇA"}
            editable={true}
            value={dados.enderecoCobranca}
            handleChange={(value) =>
              setDados({ ...dados, enderecoCobranca: value.toUpperCase() })
            }
          />
          <NumberInput
            label={"Nº"}
            editable={true}
            value={dados.numeroResCobranca}
            handleChange={(value) =>
              setDados({ ...dados, numeroResCobranca: Number(value) })
            }
          />
          <TextInput
            label={"BAIRRO"}
            editable={true}
            value={dados.bairro}
            handleChange={(value) =>
              setDados({ ...dados, bairro: value.toUpperCase() })
            }
          />
          <TextInput
            label={"PONTO DE REFERÊNCIA"}
            editable={true}
            value={dados.pontoDeReferencia}
            handleChange={(value) =>
              setDados({ ...dados, pontoDeReferencia: value })
            }
          />
          <SelectInput
            label={"SEGMENTO"}
            editable={true}
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
            handleChange={(value) => setDados({ ...dados, segmento: value })}
          />
          <SelectInput
            label={"FORMA DE ASSINATURA"}
            editable={true}
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
            editable={true}
            value={dados.codigoSVB}
            handleChange={(value) =>
              setDados({ ...dados, codigoSVB: Number(value) })
            }
          />
          <SelectInput
            label={"ESTADO CIVIL"}
            editable={true}
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
            handleChange={(value) => setDados({ ...dados, estadoCivil: value })}
          />
          <TextInput
            label={"EMAIL"}
            editable={true}
            value={dados.email}
            handleChange={(value) => setDados({ ...dados, email: value })}
          />
          <TextInput
            label={"PROFISSÃO"}
            editable={true}
            value={dados.profissao}
            handleChange={(value) => setDados({ ...dados, profissao: value })}
          />
          <TextInput
            label={"ONDE TRABALHA"}
            editable={true}
            value={dados.ondeTrabalha}
            handleChange={(value) =>
              setDados({ ...dados, ondeTrabalha: value })
            }
          />
          <SelectInput
            label={"POSSUI ALGUMA DEFICIÊNCIA"}
            editable={true}
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
                editable={true}
                value={dados.qualDeficiencia}
                handleChange={(value) =>
                  setDados({ ...dados, qualDeficiencia: value })
                }
              />
            </>
          )}
          <SelectInput
            label={"CANAL DE VENDA"}
            editable={true}
            value={dados.canalVenda}
            handleChange={(value) => setDados({ ...dados, canalVenda: value })}
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
                editable={true}
                value={dados.nomeIndicador}
                handleChange={(value) =>
                  setDados({ ...dados, nomeIndicador: value })
                }
              />
              <TextInput
                label={"TELEFONE INDICADOR"}
                editable={true}
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
            editable={true}
            value={dados.nomeContatoJornadaUm}
            handleChange={(value) =>
              setDados({ ...dados, nomeContatoJornadaUm: value })
            }
          />
          <TextInput
            label={"TELEFONE DO CONTATO 1"}
            editable={true}
            value={dados.telefoneContatoUm}
            handleChange={(value) =>
              setDados({ ...dados, telefoneContatoUm: phoneMask(value) })
            }
          />
          <TextInput
            label={"NOME DO CONTATO 2"}
            editable={true}
            value={dados.nomeContatoJornadaDois}
            handleChange={(value) =>
              setDados({ ...dados, nomeContatoJornadaDois: value })
            }
          />
          <TextInput
            label={"TELEFONE DO CONTATO 2"}
            editable={true}
            value={dados.telefoneContatoDois}
            handleChange={(value) =>
              setDados({ ...dados, telefoneContatoDois: phoneMask(value) })
            }
          />
          <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              CUIDADOS PARA CONTATO COM O CLIENTE
            </span>
            <textarea
              placeholder={
                "Descreva aqui cuidados em relação ao contato do cliente durante a jornada. Melhores horários para contato, texto ou aúdio, etc..."
              }
              value={dados.cuidadosContatoJornada}
              className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
              onChange={(e) =>
                setDados({ ...dados, cuidadosContatoJornada: e.target.value })
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
            editable={true}
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
            editable={true}
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
            editable={true}
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
            editable={true}
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
            editable={true}
            value={dados.cepInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, cepInstalacao: formatCEP(value) })
            }
          />
          <button
            onClick={() => findCPF("enderecoInstalacao")}
            className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
          >
            <AiOutlineSearch />
          </button>
          <TextInput
            label={"ENDEREÇO DE INSTALAÇÃO"}
            editable={true}
            value={dados.enderecoInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, enderecoInstalacao: value })
            }
          />
          <NumberInput
            label={"Nº"}
            editable={true}
            value={dados.numeroResInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, numeroResInstalacao: value })
            }
          />
          <NumberInput
            label={"Nº DA INSTALAÇÃO"}
            editable={true}
            value={dados.numeroInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, numeroInstalacao: value })
            }
          />
          <TextInput
            label={"BAIRRO"}
            editable={true}
            value={dados.bairroInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, bairroInstalacao: value })
            }
          />
          <SelectInput
            label={"CIDADE"}
            editable={true}
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
            editable={true}
            value={dados.ufInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, ufInstalacao: value })
            }
          />
          <TextInput
            label={"PONTO DE REFERÊNCIA"}
            editable={true}
            value={dados.pontoDeReferenciaInstalacao}
            handleChange={(value) =>
              setDados({ ...dados, pontoDeReferenciaInstalacao: value })
            }
          />
          <TextInput
            label={"LOGIN(CEMIG ATENDE)"}
            normalCase={true}
            editable={true}
            value={dados.loginCemigAtende}
            handleChange={(value) =>
              setDados({ ...dados, loginCemigAtende: value })
            }
          />
          <TextInput
            label={"SENHA(CEMIG ATENDE)"}
            normalCase={true}
            editable={true}
            value={dados.senhaCemigAtende}
            handleChange={(value) =>
              setDados({ ...dados, senhaCemigAtende: value })
            }
          />
          <TextInput
            label={"LATITUDE"}
            editable={true}
            value={dados.latitude}
            handleChange={(value) => setDados({ ...dados, latitude: value })}
          />
          <TextInput
            label={"LONGITUDE"}
            editable={true}
            value={dados.longitude}
            handleChange={(value) => setDados({ ...dados, longitude: value })}
          />
          <NumberInput
            label={"POTÊNIA PICO"}
            editable={true}
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
            editable={true}
            value={dados.geracaoPrevista}
            handleChange={(value) =>
              setDados({ ...dados, geracaoPrevista: value })
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
            editable={true}
            value={dados.topologia}
            handleChange={(value) => setDados({ ...dados, topologia: value })}
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
                editable={true}
                value={dados.marcaInversor}
                handleChange={(value) =>
                  setDados({ ...dados, marcaInversor: value })
                }
              />
              <NumberInput
                label={"QTDE INVERSOR/MICRO"}
                editable={true}
                value={dados.qtdeInversor}
                handleChange={(value) =>
                  setDados({ ...dados, qtdeInversor: Number(value) })
                }
              />
              <NumberInput
                label={"POTÊNCIA INVERSOR/MICRO"}
                editable={true}
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
              editable={true}
              value={dados.marcaOtimizador ? dados.marcaOtimizador : ""}
              handleChange={(value) =>
                setDados({ ...dados, marcaOtimizador: value })
              }
            />
            <NumberInput
              label={"QTDE DO OTIMIZADOR"}
              editable={true}
              value={dados.qtdeOtimizador ? dados.qtdeOtimizador : null}
              handleChange={(value) =>
                setDados({ ...dados, qtdeOtimizador: Number(value) })
              }
            />
            <NumberInput
              label={"POTÊNCIA DO OTIMIZADOR"}
              editable={true}
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
            editable={true}
            value={dados.marcaModulos}
            handleChange={(value) =>
              setDados({ ...dados, marcaModulos: value })
            }
          />
          <NumberInput
            label={"Nº DE MÓDULOS"}
            editable={true}
            value={dados.qtdeModulos}
            handleChange={(value) =>
              setDados({ ...dados, qtdeModulos: Number(value) })
            }
          />
          <NumberInput
            label={"POTÊNCIA DOS MÓDULOS"}
            editable={true}
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
            editable={true}
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
            editable={true}
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
            editable={true}
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
                editable={true}
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
                editable={true}
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
            editable={true}
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
            handleChange={(value) => setDados({ ...dados, possuiOeM: value })}
          />
          {dados.possuiOeM == "SIM" && (
            <>
              <SelectInput
                label={"QUAL PLANO DE O&M?"}
                editable={true}
                options={[
                  {
                    label: "MANUTENÇÃO SIMLES",
                    value: "MANUTENÇÃO SIMLES",
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
                    label: "NÃO SE ALICA",
                    value: "NÃO SE ALICA",
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
            editable={true}
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
                editable={true}
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
              editable={true}
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
              label={"VALOR O&M+SEGURO"}
              editable={true}
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
            editable={true}
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
            valor={dados.aumentoDeCarga}
            handleChange={(value) =>
              setDados({ ...dados, aumentoDeCarga: value })
            }
          />
        </div>
        {dados.aumentoDeCarga == "SIM" && (
          <div className="flex gap-2 justify-around flex-wrap mt-2">
            <SelectInput
              label={"TIPO DO PADRÃO"}
              editable={true}
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
              editable={true}
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
              editable={true}
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
              editable={true}
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
              editable={true}
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
            editable={true}
            value={dados.nomePagador}
            handleChange={(value) => setDados({ ...dados, nomePagador: value })}
          />
          <TextInput
            label={"CONTATO DO PAGADOR"}
            editable={true}
            value={dados.contatoPagador}
            handleChange={(value) =>
              setDados({ ...dados, contatoPagador: phoneMask(value) })
            }
          />
          <TextInput
            label={"CPF/CNPJ PARA NF"}
            editable={true}
            value={dados.cpf_cnpjNF}
            handleChange={(value) =>
              setDados({ ...dados, cpf_cnpjNF: formatCnpjCpf(value) })
            }
          />
        </div>
        <div className="flex gap-2 justify-around flex-wrap mt-2">
          <SelectInput
            label={"NECESSIDADE DE INSCRIÇÃO RURAL NA N.F?"}
            editable={true}
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
              editable={true}
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
            editable={true}
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
            ]}
            value={dados.localEntrega}
            handleChange={(value) =>
              setDados({ ...dados, localEntrega: value })
            }
          />
          <SelectInput
            label={"END. ENTREGA IGUAL COBRANÇA?"}
            editable={true}
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
            ]}
          />
          <SelectInput
            label={"HÁ RESTRIÇÕES PARA ENTREGA?"}
            editable={true}
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
            label={"VALOR DO CONTRATO FOTOVOLTAICO(SEM CUSTOS ADICIONAIS)"}
            editable={true}
            tag={"R$"}
            value={dados.valorContrato}
            handleChange={(value) =>
              setDados({ ...dados, valorContrato: Number(value) })
            }
          />
          <SelectInput
            label={"ORIGEM DO RECURSO"}
            editable={true}
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
                label: "MISTO",
                value: "MISTO",
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
                editable={true}
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
                valor={dados.credor}
                handleChange={(value) => setDados({ ...dados, credor: value })}
              />
              <TextInput
                label={"NOME DO GERENTE"}
                editable={true}
                value={dados.nomeGerente}
                handleChange={(value) =>
                  setDados({ ...dados, nomeGerente: value })
                }
              />
              <TextInput
                label={"CONTATO DO GERENTE"}
                editable={true}
                value={dados.contatoGerente}
                handleChange={(value) =>
                  setDados({ ...dados, contatoGerente: phoneMask(value) })
                }
              />
            </>
          )}
          <NumberInput
            label={"SE CARTÃO OU CHEQUE, QUANTAS PARCELAS?"}
            editable={true}
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
            editable={true}
            value={dados.valorParcela}
            tag={"R$"}
            handleChange={(value) =>
              setDados({ ...dados, valorParcela: Number(value) })
            }
          />
          <SelectInput
            label={"NECESSIDADE N.F ADIANTADA"}
            editable={true}
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
            editable={true}
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
            editable={true}
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
            editable={true}
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
                  <div key={index} className="flex justify-around flex-wrap">
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
      {msg.text && (
        <p className={`text-sm text-center font-bold ${msg.color}`}>
          {msg.text}
        </p>
      )}
      <div className="flex justify-center flex-wrap gap-2">
        <button
          onClick={voltar}
          className="bg-[#15599a] rounded p-2 font-bold text-white"
        >
          VOLTAR
        </button>
        <button
          onClick={criarSolicitacao}
          className="bg-[#fead61] rounded p-2 font-bold"
        >
          CRIAR SOLICITAÇÃO
        </button>
      </div>
    </>
  );
}

export default VisualizacaoForm;
