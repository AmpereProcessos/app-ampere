import React, { useState } from "react";
import TextInput from "../../../components/TextInput";
import DateInput from "../../../components/DateInput";
import NumberInput from "../../../components/NumberInput";
import SelectInput from "../../../components/SelectInput";
import connectToSolicitacoesDatabase from "../../../utils/solicitacoesDb";
import { AiOutlineSearch } from "react-icons/ai";
import {
  cidadesAtendidas,
  credores,
  customersAcquisitionChannels,
  tiposDePadrao,
  tiposDeServico,
  vendedores,
} from "../../../utils/constants";
import { ObjectId } from "mongodb";
import CheckboxInput from "../../../components/CheckboxInput";
function Formulario({ info }) {
  const [dados, setDados] = useState(info);
  function getJoinedInfo({ marca, qtde, pot }) {
    let splitMarca = marca.split("/");
    let splitQtde = qtde.split("/");
    let splitPot = pot.split("/");

    let holder = [];
    for (let i = 0; i < splitMarca.length; i++) {
      let str = `${splitQtde[i]}x${splitMarca[i]}(${splitPot[i]}W)`;
      holder.push(str);
    }
    return holder.join(" - ");
  }
  function getSummedValues({ qtde, pot }) {
    let splitQtde = qtde.split("/");
    let splitPot = pot.split("/");
    let totalPot = 0;
    for (let i = 0; i < splitQtde.length; i++) {
      totalPot = totalPot + (splitQtde[i] * splitPot[i]) / 1000;
    }
    let summedModules = splitQtde.reduce(
      (partialSum, a) => Number(partialSum) + Number(a),
      0
    );
    return { totalPot, summedModules };
  }
  return (
    <div className="flex flex-col h-full overflow-y-auto overscroll-y-auto py-2">
      <div className="flex flex-col gap-y-2 h-full">
        <>
          <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
            <h1 className="text-center font-bold text-[#fead61] mt-1 text-xl">
              FORMULÁRIO DE SOLICITAÇÃO DE CONTRATO
            </h1>
            <h1 className="text-center font-bold my-1 text-green-500">
              SERVIÇO: {dados.tipoDeServico}
            </h1>
          </div>
          <div className="w-full flex justify-around border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
            <div className="text-center">
              <p className="text-[#15599a] font-bold">VENDEDOR</p>
              <p className="text-sm">
                {dados.nomeVendedor ? dados.nomeVendedor : "-"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[#15599a] font-bold">CONTATO VENDEDOR</p>
              <p className="text-sm">
                {dados.telefoneVendedor ? dados.telefoneVendedor : "-"}
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
            <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
              DADOS PARA CONTRATO
            </span>
            <div className="flex gap-2 justify-around flex-wrap">
              <TextInput
                label={"Nome/Razão Social"}
                editable={false}
                value={dados.nomeDoContrato}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    nomeDoContrato: value.toUpperCase(),
                  })
                }
              />
              <SelectInput
                label={"Vendedor"}
                value={dados.nomeVendedor}
                editable={false}
                options={vendedores.map((vendedor) => {
                  return { label: vendedor.nome, value: vendedor.nome };
                })}
                handleChange={(value) =>
                  setDados({ ...dados, nomeVendedor: value })
                }
              />
              <CheckboxInput
                title={"JÁ É CLIENTE AMPÈRE ?"}
                labelTrue={"SIM"}
                labelFalse={"NÃO"}
                checked={dados.clienteAmpere == "SIM"}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    clienteAmpere: value ? "SIM" : "NÃO",
                  })
                }
              />
              <SelectInput
                label={"TIPO DE SERVIÇO"}
                editable={false}
                value={
                  dados.tipoDeServico ? dados.tipoDeServico : "NÃO DEFINIDO"
                }
                options={tiposDeServico.map((tipo) => tipo)}
                handleChange={(value) =>
                  setDados({ ...dados, tipoDeServico: value })
                }
              />
              <TextInput
                label={"Telefone"}
                editable={false}
                value={dados.telefone}
                handleChange={(value) =>
                  setDados({ ...dados, telefone: phoneMask(value) })
                }
              />
              <TextInput
                label={"CPF/CNPJ"}
                editable={false}
                value={dados.cpf_cnpj}
                handleChange={(value) =>
                  setDados({ ...dados, cpf_cnpj: formatCnpjCpf(value) })
                }
              />
              <TextInput
                label={"RG"}
                editable={false}
                value={dados.rg}
                handleChange={(value) => setDados({ ...dados, rg: value })}
              />
              <DateInput
                label={"DATA DE NASCIMENTO"}
                editable={false}
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
                editable={false}
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
                editable={false}
                value={dados.cidade}
                options={cidadesAtendidas.map((cidade) => {
                  return { label: cidade, value: cidade };
                })}
                handleChange={(value) => setDados({ ...dados, cidade: value })}
              />
              <TextInput
                label={"UF"}
                editable={false}
                value={dados.uf}
                handleChange={(value) => setDados({ ...dados, uf: value })}
              />
              <TextInput
                label={"ENDEREÇO DE COBRANÇA"}
                editable={false}
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
                editable={false}
                value={dados.numeroResCobranca}
                handleChange={(value) =>
                  setDados({ ...dados, numeroResCobranca: Number(value) })
                }
              />
              <TextInput
                label={"BAIRRO"}
                editable={false}
                value={dados.bairro}
                handleChange={(value) =>
                  setDados({ ...dados, bairro: value.toUpperCase() })
                }
              />
              <TextInput
                label={"PONTO DE REFERÊNCIA"}
                editable={false}
                value={dados.pontoDeReferencia}
                handleChange={(value) =>
                  setDados({ ...dados, pontoDeReferencia: value })
                }
              />
              <SelectInput
                label={"SEGMENTO"}
                editable={false}
                value={dados.segmento}
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
                editable={false}
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
              <TextInput
                label={"CÓDIGO SVB/CRM"}
                editable={false}
                value={dados.codigoSVB}
                handleChange={(value) =>
                  setDados({ ...dados, codigoSVB: value })
                }
              />
              <SelectInput
                label={"ESTADO CIVIL"}
                editable={false}
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
                normalCase={true}
                editable={false}
                value={dados.email}
                handleChange={(value) => setDados({ ...dados, email: value })}
              />
              <TextInput
                label={"PROFISSÃO"}
                editable={false}
                value={dados.profissao}
                handleChange={(value) =>
                  setDados({ ...dados, profissao: value })
                }
              />
              <TextInput
                label={"ONDE TRABALHA"}
                editable={false}
                value={dados.ondeTrabalha}
                handleChange={(value) =>
                  setDados({ ...dados, ondeTrabalha: value })
                }
              />
              <SelectInput
                label={"POSSUI ALGUMA DEFICIÊNCIA"}
                editable={false}
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
                  <TextInput
                    label={"SE SIM, QUAL ?"}
                    editable={false}
                    value={dados.qualDeficiencia}
                    handleChange={(value) =>
                      setDados({ ...dados, qualDeficiencia: value })
                    }
                  />
                </>
              )}
              <SelectInput
                label={"CANAL DE VENDA"}
                editable={false}
                value={dados.canalVenda}
                handleChange={(value) =>
                  setDados({ ...dados, canalVenda: value })
                }
                options={customersAcquisitionChannels.map((value) => value)}
              />
              {dados.canalVenda == "INDICAÇÃO DE AMIGO" && (
                <>
                  <TextInput
                    label={"NOME INDICADOR"}
                    editable={false}
                    value={dados.nomeIndicador}
                    handleChange={(value) =>
                      setDados({ ...dados, nomeIndicador: value })
                    }
                  />
                  <TextInput
                    label={"TELEFONE INDICADOR"}
                    editable={false}
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
                readOnly={!false}
                placeholder={"Descrição aqui.."}
                value={dados.comoChegouAoCliente}
                className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                onChange={(e) =>
                  setDados({
                    ...dados,
                    comoChegouAoCliente: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                OBSERVAÇÃO COMERCIAL
              </span>
              <textarea
                readOnly={!false}
                placeholder={"Observações comerciais aqui.."}
                value={dados.obsComercial ? dados.obsComercial : ""}
                onChange={(e) =>
                  setDados({
                    ...dados,
                    obsComercial: e.target.value.toUpperCase(),
                  })
                }
                className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
              />
            </div>
            {["SISTEMA FOTOVOLTAICO (OFF GRID)", "BOMBA SOLAR"].includes(
              dados.tipoDeServico
            ) && (
              <div className="flex items-center justify-center mt-2">
                <SelectInput
                  label={"TIPO DE VENDA"}
                  value={dados.tipoVenda ? dados.tipoVenda : "NÃO DEFINIDO"}
                  editable={true}
                  handleChange={(value) =>
                    setDados({ ...dados, tipoVenda: value })
                  }
                  options={[
                    {
                      label: "SOMENTE MATERIAL",
                      value: "SOMENTE MATERIAL",
                    },
                    {
                      label: "MATERIAL+INSTALAÇÃO",
                      value: "MATERIAL+INSTALAÇÃO",
                    },
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  ]}
                />
              </div>
            )}
          </div>
          <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
            <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
              DADOS PARA CONTATO
            </span>
            <div className="flex gap-2 justify-around flex-wrap">
              <TextInput
                label={"NOME DO CONTATO 1"}
                value={dados.nomeContatoJornadaUm}
                handleChange={(value) =>
                  setDados({ ...dados, nomeContatoJornadaUm: value })
                }
              />
              <TextInput
                label={"TELEFONE DO CONTATO 1"}
                value={dados.telefoneContatoUm}
                handleChange={(value) =>
                  setDados({
                    ...dados,
                    telefoneContatoUm: phoneMask(value),
                  })
                }
              />
              <TextInput
                label={"NOME DO CONTATO 2"}
                value={dados.nomeContatoJornadaDois}
                handleChange={(value) =>
                  setDados({ ...dados, nomeContatoJornadaDois: value })
                }
              />
              <TextInput
                label={"TELEFONE DO CONTATO 2"}
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
                  readOnly={true}
                  placeholder={
                    "Descreva aqui cuidados em relação ao contato do cliente durante a jornada. Melhores horários para contato, texto ou aúdio, etc..."
                  }
                  value={dados.cuidadosContatoJornada}
                  className={`w-full text-center ${
                    dados.cuidadosContatoJornada.length > 150
                      ? "h-[150px]"
                      : "h-[80px]"
                  } bg-gray-200 resize-none p-2 outline-none border border-gray-600`}
                />
              </div>
            </div>
          </div>
          {dados.clienteAmpere != "SIM" ? (
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                DADOS DA INSTALAÇÃO
              </span>
              <div className="flex gap-2 justify-around flex-wrap">
                <TextInput
                  label={"NOME DO TITULAR DO PROJETO"}
                  editable={false}
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
                  editable={false}
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
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                />
                <SelectInput
                  label={"TIPO DA LIGAÇÃO"}
                  editable={false}
                  value={
                    dados.tipoDaLigacao ? dados.tipoDaLigacao : "NÃO DEFINIDO"
                  }
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
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                />
                <SelectInput
                  label={"TIPO DA INSTALAÇÃO"}
                  editable={false}
                  value={
                    dados.tipoDaInstalacao
                      ? dados.tipoDaInstalacao
                      : "NÃO DEFINIDO"
                  }
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
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                />
                <TextInput
                  label={"CEP INSTALAÇÃO"}
                  editable={false}
                  value={dados.cepInstalacao}
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      cepInstalacao: formatCEP(value),
                    })
                  }
                />

                <TextInput
                  label={"ENDEREÇO DE INSTALAÇÃO"}
                  editable={false}
                  value={dados.enderecoInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, enderecoInstalacao: value })
                  }
                />
                <NumberInput
                  label={"Nº"}
                  editable={false}
                  value={dados.numeroResInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, numeroResInstalacao: value })
                  }
                />
                <NumberInput
                  label={"Nº DA INSTALAÇÃO"}
                  editable={false}
                  value={dados.numeroInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, numeroInstalacao: value })
                  }
                />
                <TextInput
                  label={"BAIRRO"}
                  editable={false}
                  value={dados.bairroInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, bairroInstalacao: value })
                  }
                />
                <SelectInput
                  label={"CIDADE"}
                  editable={false}
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
                  editable={false}
                  value={dados.ufInstalacao}
                  handleChange={(value) =>
                    setDados({ ...dados, ufInstalacao: value })
                  }
                />
                <TextInput
                  label={"PONTO DE REFERÊNCIA"}
                  editable={false}
                  value={dados.pontoDeReferenciaInstalacao}
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      pontoDeReferenciaInstalacao: value,
                    })
                  }
                />
                <TextInput
                  label={"LOGIN(CEMIG ATENDE)"}
                  editable={false}
                  value={dados.loginCemigAtende}
                  handleChange={(value) =>
                    setDados({ ...dados, loginCemigAtende: value })
                  }
                />
                <TextInput
                  label={"SENHA(CEMIG ATENDE)"}
                  editable={false}
                  value={dados.senhaCemigAtende}
                  handleChange={(value) =>
                    setDados({ ...dados, senhaCemigAtende: value })
                  }
                />
                <TextInput
                  label={"LATITUDE"}
                  editable={false}
                  value={dados.latitude}
                  handleChange={(value) =>
                    setDados({ ...dados, latitude: value })
                  }
                />
                <TextInput
                  label={"LONGITUDE"}
                  editable={false}
                  value={dados.longitude}
                  handleChange={(value) =>
                    setDados({ ...dados, longitude: value })
                  }
                />
                <NumberInput
                  label={"POTÊNIA PICO"}
                  editable={false}
                  value={
                    dados.potPico
                      ? dados.potPico
                      : getSummedValues({
                          qtde: dados.qtdeModulos
                            ? dados.qtdeModulos.toString()
                            : "0",
                          pot: dados.potModulos
                            ? dados.potModulos.toString()
                            : "0",
                        }).totalPot
                  }
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
                  editable={false}
                  value={
                    dados.geracaoPrevista
                      ? dados.geracaoPrevista
                      : getSummedValues({
                          qtde: dados.qtdeModulos
                            ? dados.qtdeModulos.toString()
                            : "0",
                          pot: dados.potModulos
                            ? dados.potModulos.toString()
                            : "0",
                        }).totalPot * 126
                  }
                  handleChange={(value) =>
                    setDados({ ...dados, geracaoPrevista: value })
                  }
                />
              </div>
              {dados.tipoDeServico == "MONTAGEM E DESMONTAGEM" ? (
                <div className="flex flex-col border-t border-gray-200 pt-2">
                  <div className="flex items-center justify-center col-span-3">
                    <SelectInput
                      label={"HAVERÁ MUDANÇA DE LOCAL"}
                      editable={true}
                      value={
                        dados.mudancaLocal ? dados.mudancaLocal : "NÃO DEFINIDO"
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
                      handleChange={(value) => {
                        if (value == "NÃO") {
                          setDados({
                            ...dados,
                            mudancaLocal: value.toUpperCase(),
                            tipoDaLigacao: "NÃO DEFINIDO",
                            tipoDaInstalacaoRemontagem: "NÃO DEFINIDO",
                            cepInstalacaoRemontagem: "",
                            enderecoInstalacaoRemontagem: "",
                            numeroInstalacaoRemontagem: "",
                            numeroResInstalacaoRemontagem: "",
                            bairroInstalacaoRemontagem: "",
                            cidadeInstalacaoRemontagem: "",
                            ufInstalacaoRemontagem: "",
                            latitudeRemontagem: "",
                            longitudeRemontagem: "",
                            pontoDeReferenciaInstalacaoRemontagem: "",
                          });
                        } else {
                          setDados({
                            ...dados,
                            mudancaLocal: value.toUpperCase(),
                          });
                        }
                      }}
                    />
                  </div>
                  {dados.mudancaLocal == "SIM" ? (
                    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 p-2">
                      <div className="flex items-center justify-center">
                        <SelectInput
                          label={"TIPO DA LIGAÇÃO (NOVO LOCAL)"}
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
                            {
                              label: "NÃO DEFINIDO",
                              value: "NÃO DEFINIDO",
                            },
                          ]}
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <SelectInput
                          label={"TIPO DA INSTALAÇÃO (NOVO LOCAL)"}
                          editable={true}
                          value={
                            dados.tipoDaInstalacaoRemontagem
                              ? dados.tipoDaInstalacaoRemontagem
                              : "NÃO DEFINIDO"
                          }
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              tipoDaInstalacaoRemontagem: value,
                            })
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
                            {
                              label: "NÃO DEFINIDO",
                              value: "NÃO DEFINIDO",
                            },
                          ]}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-x-2 flex-wrap">
                        <TextInput
                          editable={true}
                          label={"CEP INSTALAÇÃO (NOVO LOCAL)"}
                          value={dados.cepInstalacaoRemontagem}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              cepInstalacaoRemontagem: formatCEP(value),
                            })
                          }
                        />
                        <button
                          onClick={() =>
                            findCPFRemontagem("enderecoInstalacao")
                          }
                          className="flex items-center p-1 h-[30px] bg-[#fead61] rounded"
                        >
                          <AiOutlineSearch />
                        </button>
                      </div>
                      <div className="flex items-center justify-center">
                        <TextInput
                          label={"ENDEREÇO DE INSTALAÇÃO (NOVO LOCAL)"}
                          editable={true}
                          value={dados.enderecoInstalacaoRemontagem}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              enderecoInstalacaoRemontagem: value.toUpperCase(),
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <TextInput
                          label={"Nº (NOVO LOCAL)"}
                          editable={true}
                          value={dados.numeroResInstalacaoRemontagem}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              numeroResInstalacaoRemontagem: value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <NumberInput
                          label={"Nº DA INSTALAÇÃO (NOVO LOCAL)"}
                          editable={true}
                          value={dados.numeroInstalacaoRemontagem}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              numeroInstalacaoRemontagem: value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <TextInput
                          label={"BAIRRO (NOVO LOCAL)"}
                          editable={true}
                          value={dados.bairroInstalacaoRemontagem}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              bairroInstalacaoRemontagem: value.toUpperCase(),
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <SelectInput
                          label={"CIDADE (NOVO LOCAL)"}
                          editable={true}
                          value={dados.cidadeInstalacaoRemontagem}
                          options={[
                            {
                              label: "NÃO DEFINIDO",
                              value: "NÃO DEFINIDO",
                            },
                            ...cidadesAtendidas.map((cidade) => {
                              return { label: cidade, value: cidade };
                            }),
                          ]}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              cidadeInstalacaoRemontagem: value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <TextInput
                          label={"UF (NOVO LOCAL)"}
                          editable={true}
                          value={dados.ufInstalacaoRemontagem}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              ufInstalacaoRemontagem: value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <TextInput
                          label={"PONTO DE REFERÊNCIA (NOVO LOCAL)"}
                          editable={true}
                          value={dados.pontoDeReferenciaInstalacaoRemontagem}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              pontoDeReferenciaInstalacaoRemontagem: value,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 flex-wrap col-span-3">
                        <TextInput
                          label={"LATITUDE (NOVO LOCAL)"}
                          value={dados.latitudeRemontagem}
                          editable={true}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              latitudeRemontagem: value,
                            })
                          }
                        />
                        <TextInput
                          label={"LONGITUDE (NOVO LOCAL)"}
                          editable={true}
                          value={dados.longitudeRemontagem}
                          handleChange={(value) =>
                            setDados({
                              ...dados,
                              longitudeRemontagem: value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {![
            "TROCA DE PADRÃO",
            "REFORMA DE PADRÃO",
            "SUBESTAÇÃO DE ENERGIA",
          ].includes(dados.tipoDeServico) && (
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                DADOS DO SISTEMA
              </span>
              {dados.tipoDeServico == "AUMENTO DE SISTEMA FOTOVOLTAICO" ? (
                <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2  mt-1">
                  DADOS DO SISTEMA (AUMENTO)
                </span>
              ) : null}
              <div className="flex justify-center">
                <SelectInput
                  label={"TOPOLOGIA"}
                  editable={false}
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
                <SelectInput
                  label={"TIPO DO KIT"}
                  value={dados.tipoDoKit ? dados.tipoDoKit : "NÃO DEFINIDO"}
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
                      label: "NÃO SE APLICA",
                      value: "NÃO SE APLICA",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]}
                  handleChange={(value) => {
                    setDados({ ...dados, tipoDoKit: value });
                  }}
                />
              </div>
              <div className="flex gap-2 justify-around flex-wrap mt-2 py-2 border-t border-gray-200">
                <TextInput
                  label={
                    dados.tipoDeServico != "BOMBA SOLAR"
                      ? "MARCA DO INVERSOR/MICRO"
                      : " MARCA DO DRIVER"
                  }
                  editable={false}
                  value={dados.marcaInversor}
                  handleChange={(value) =>
                    setDados({ ...dados, marcaInversor: value })
                  }
                />
                <TextInput
                  label={
                    dados.tipoDeServico != "BOMBA SOLAR"
                      ? "QTDE INVERSOR/MICRO"
                      : "QTDE DRIVERS"
                  }
                  editable={false}
                  value={dados.qtdeInversor}
                  handleChange={(value) =>
                    setDados({ ...dados, qtdeInversor: value })
                  }
                />
                <TextInput
                  label={
                    dados.tipoDeServico != "BOMBA SOLAR"
                      ? "POTÊNCIA INVERSOR/MICRO"
                      : "POTÊNCIA DRIVER"
                  }
                  editable={false}
                  unit={"W"}
                  value={dados.potInversor}
                  handleChange={(value) =>
                    setDados({ ...dados, potInversor: value })
                  }
                />
              </div>
              <div className="flex flex-col text-sm lg:text-base  items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">
                  {dados.tipoDeServico != "BOMBA SOLAR"
                    ? "INFORMAÇÃO MICRO/INVERSOR"
                    : "INFORMAÇÃO DRIVERS"}
                </span>
                <p className="text-xs w-full text-center  text-gray-600 outline-none">
                  {getJoinedInfo({
                    marca: dados.marcaInversor
                      ? dados.marcaInversor?.toString().toUpperCase()
                      : "",
                    qtde: dados.qtdeInversor
                      ? dados.qtdeInversor?.toString()
                      : "",
                    pot: dados.potInversor ? dados.potInversor?.toString() : "",
                  })}
                </p>
              </div>
              {dados.topologia == "OTIMIZADOR" && (
                <div className="flex gap-2 justify-around flex-wrap mt-2">
                  <TextInput
                    label={"MARCA DO OTIMIZADOR"}
                    editable={false}
                    value={dados.marcaOtimizador ? dados.marcaOtimizador : ""}
                    handleChange={(value) =>
                      setDados({ ...dados, marcaOtimizador: value })
                    }
                  />
                  <NumberInput
                    label={"QTDE DO OTIMIZADOR"}
                    editable={false}
                    value={dados.qtdeOtimizador ? dados.qtdeOtimizador : null}
                    handleChange={(value) =>
                      setDados({ ...dados, qtdeOtimizador: Number(value) })
                    }
                  />
                  <NumberInput
                    label={"POTÊNCIA DO OTIMIZADOR"}
                    editable={false}
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
                  editable={false}
                  value={dados.marcaModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, marcaModulos: value })
                  }
                />
                <TextInput
                  label={"Nº DE MÓDULOS"}
                  editable={false}
                  value={dados.qtdeModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, qtdeModulos: value })
                  }
                />
                <TextInput
                  label={"POTÊNCIA DOS MÓDULOS"}
                  editable={false}
                  unit={"W"}
                  value={dados.potModulos}
                  handleChange={(value) =>
                    setDados({ ...dados, potModulos: value })
                  }
                />
              </div>
              <div className="flex flex-col text-sm lg:text-base  items-center">
                <span className="uppercase font-bold font-raleway text-center text-sm">
                  INFORMAÇÃO MÓDULOS
                </span>
                <p className="text-xs w-full text-center  text-gray-600 outline-none">
                  {getJoinedInfo({
                    marca: dados.marcaModulos
                      ? dados.marcaModulos.toString().toUpperCase()
                      : "",
                    qtde: dados.qtdeModulos ? dados.qtdeModulos.toString() : "",
                    pot: dados.potModulos ? dados.potModulos.toString() : "",
                  })}
                </p>
              </div>
              {dados.tipoDeServico == "SISTEMA FOTOVOLTAICO (OFF GRID)" && (
                <>
                  <div className="flex flex-col lg:grid lg:grid-cols-4 items-center py-2 border-t border-gray-200 mt-2">
                    <div className="flex justify-center items-center w-full">
                      <TextInput
                        label={"MARCA DO CONTROLADOR"}
                        editable={false}
                        value={dados.marcaControlador}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            marcaControlador: value.toUpperCase(),
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <NumberInput
                        label={"QTDE DE CONTROLADORES"}
                        editable={false}
                        value={dados.qtdeControlador}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            qtdeControlador: Number(value),
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <SelectInput
                        label={"TIPO DO CONTROLADOR"}
                        editable={false}
                        value={
                          dados.tipoControlador
                            ? dados.tipoControlador
                            : "NÃO DEFINIDO"
                        }
                        options={[
                          {
                            label: "INTEGRADO AO INVERSOR",
                            value: "INTEGRADO AO INVERSOR",
                          },
                          {
                            label: "COMPRO EM SEPARADO",
                            value: "SEPARADO",
                          },
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, tipoControlador: value })
                        }
                      />
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <NumberInput
                        label={"CORRENTE DE CARGA (em A)"}
                        editable={false}
                        value={dados.correnteControlador}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            correnteControlador: Number(value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col lg:grid lg:grid-cols-4 items-center py-2 border-t border-gray-200">
                    <div className="flex justify-center items-center w-full">
                      <TextInput
                        label={"MARCA DA BATERIA"}
                        editable={false}
                        value={dados.marcaBateria}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            marcaBateria: value.toUpperCase(),
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <NumberInput
                        label={"QTDE DE BATERIAS"}
                        editable={false}
                        value={dados.qtdeBateria}
                        handleChange={(value) =>
                          setDados({ ...dados, qtdeBateria: Number(value) })
                        }
                      />
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <SelectInput
                        label={"TIPO DA BATERIA"}
                        editable={false}
                        value={
                          dados.tipoBateria ? dados.tipoBateria : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "LÍTIO", value: "LÍTIO" },
                          { label: "ESTACIONÁRIA", value: "ESTACIONÁRIA" },
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, tipoBateria: value })
                        }
                      />
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <NumberInput
                        label={"CAPACIDADE (em Ah)"}
                        editable={false}
                        value={dados.capacidadeBateria}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            capacidadeBateria: Number(value),
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
              {dados.tipoDeServico == "BOMBA SOLAR" && (
                <>
                  <div className="flex flex-col lg:grid lg:grid-cols-3 items-center mt-2 py-2 border-t border-gray-200">
                    <div className="flex items-center justify-center">
                      <TextInput
                        label={"MARCA BOMBA"}
                        editable={false}
                        value={dados.marcaBomba}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            marcaBomba: value.toUpperCase(),
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <NumberInput
                        label={"QTDE BOMBA"}
                        editable={false}
                        value={dados.qtdeBomba}
                        handleChange={(value) =>
                          setDados({ ...dados, qtdeBomba: Number(value) })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <NumberInput
                        label={"POTÊNCIA BOMBA"}
                        editable={false}
                        value={dados.potBomba}
                        handleChange={(value) =>
                          setDados({ ...dados, potBomba: Number(value) })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col lg:grid lg:grid-cols-4 items-center py-2 border-t border-gray-200">
                    <div className="flex justify-center items-center w-full">
                      <TextInput
                        label={"MARCA DA BATERIA"}
                        editable={false}
                        value={dados.marcaBateria}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            marcaBateria: value.toUpperCase(),
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <NumberInput
                        label={"QTDE DE BATERIAS"}
                        editable={false}
                        value={dados.qtdeBateria}
                        handleChange={(value) =>
                          setDados({ ...dados, qtdeBateria: Number(value) })
                        }
                      />
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <SelectInput
                        label={"TIPO DA BATERIA"}
                        editable={false}
                        value={
                          dados.tipoBateria ? dados.tipoBateria : "NÃO DEFINIDO"
                        }
                        options={[
                          { label: "LÍTIO", value: "LÍTIO" },
                          { label: "ESTACIONÁRIA", value: "ESTACIONÁRIA" },
                          { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                        ]}
                        handleChange={(value) =>
                          setDados({ ...dados, tipoBateria: value })
                        }
                      />
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <NumberInput
                        label={"CAPACIDADE (em Ah)"}
                        editable={false}
                        value={dados.capacidadeBateria}
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            capacidadeBateria: Number(value),
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
              {dados.clienteAmpere != "SIM" &&
              dados.tipoDeServico == "AUMENTO DE SISTEMA FOTOVOLTAICO" ? (
                <>
                  <span className="text-sm text-center font-bold text-[#fead61] uppercase py-2 border-t border-blue-500 mt-1">
                    DADOS DO SISTEMA (ANTERIOR)
                  </span>
                  <div className="flex justify-center">
                    <SelectInput
                      label={"TOPOLOGIA (ANTERIOR)"}
                      editable={false}
                      value={dados.topologiaAnterior}
                      handleChange={(value) =>
                        setDados({ ...dados, topologiaAnterior: value })
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
                  <div className="flex gap-2 justify-around flex-wrap mt-2 py-2 border-t border-gray-200">
                    <TextInput
                      label={
                        dados.tipoDeServico != "BOMBA SOLAR"
                          ? "MARCA DO INVERSOR/MICRO (ANTERIOR)"
                          : " MARCA DO DRIVER (ANTERIOR)"
                      }
                      editable={false}
                      value={dados.marcaInversorAnterior}
                      handleChange={(value) =>
                        setDados({ ...dados, marcaInversorAnterior: value })
                      }
                    />
                    <TextInput
                      label={
                        dados.tipoDeServico != "BOMBA SOLAR"
                          ? "QTDE INVERSOR/MICRO (ANTERIOR)"
                          : "QTDE DRIVERS (ANTERIOR)"
                      }
                      editable={false}
                      value={dados.qtdeInversorAnterior}
                      handleChange={(value) =>
                        setDados({ ...dados, qtdeInversorAnterior: value })
                      }
                    />
                    <TextInput
                      label={
                        dados.tipoDeServico != "BOMBA SOLAR"
                          ? "POTÊNCIA INVERSOR/MICRO (ANTERIOR)"
                          : "POTÊNCIA DRIVER (ANTERIOR)"
                      }
                      editable={false}
                      unit={"W"}
                      value={dados.potInversorAnterior}
                      handleChange={(value) =>
                        setDados({ ...dados, potInversorAnterior: value })
                      }
                    />
                  </div>
                  <div className="flex flex-col text-sm lg:text-base  items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      {dados.tipoDeServico != "BOMBA SOLAR"
                        ? "INFORMAÇÃO MICRO/INVERSOR (ANTERIOR)"
                        : "INFORMAÇÃO DRIVERS (ANTERIOR)"}
                    </span>
                    <p className="text-xs w-full text-center  text-gray-600 outline-none">
                      {getJoinedInfo({
                        marca: dados.marcaInversorAnterior
                          ? dados.marcaInversorAnterior
                              ?.toString()
                              .toUpperCase()
                          : "",
                        qtde: dados.qtdeInversorAnterior
                          ? dados.qtdeInversorAnterior?.toString()
                          : "",
                        pot: dados.potInversorAnterior
                          ? dados.potInversorAnterior?.toString()
                          : "",
                      })}
                    </p>
                  </div>
                  {dados.topologiaAnterior == "OTIMIZADOR" && (
                    <div className="flex gap-2 justify-around flex-wrap mt-2">
                      <TextInput
                        label={"MARCA DO OTIMIZADOR (ANTERIOR)"}
                        editable={false}
                        value={
                          dados.marcaOtimizadorAnterior
                            ? dados.marcaOtimizadorAnterior
                            : ""
                        }
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            marcaOtimizadorAnterior: value,
                          })
                        }
                      />
                      <NumberInput
                        label={"QTDE DO OTIMIZADOR (ANTERIOR)"}
                        editable={false}
                        value={
                          dados.qtdeOtimizadorAnterior
                            ? dados.qtdeOtimizadorAnterior
                            : null
                        }
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            qtdeOtimizadorAnterior: Number(value),
                          })
                        }
                      />
                      <NumberInput
                        label={"POTÊNCIA DO OTIMIZADOR (ANTERIOR)"}
                        editable={false}
                        unit={"W"}
                        value={
                          dados.potOtimizadorAnterior
                            ? dados.potOtimizadorAnterior
                            : null
                        }
                        handleChange={(value) =>
                          setDados({
                            ...dados,
                            potOtimizadorAnterior: Number(value),
                          })
                        }
                      />
                    </div>
                  )}
                  <div className="flex gap-2 justify-around flex-wrap mt-2 pt-2 border-t border-gray-200 mx-2">
                    <TextInput
                      label={"MARCA DOS MÓDULOS (ANTERIOR)"}
                      editable={false}
                      value={dados.marcaModulosAnterior}
                      handleChange={(value) =>
                        setDados({ ...dados, marcaModulosAnterior: value })
                      }
                    />
                    <TextInput
                      label={"Nº DE MÓDULOS (ANTERIOR)"}
                      editable={false}
                      value={dados.qtdeModulosAnterior}
                      handleChange={(value) =>
                        setDados({ ...dados, qtdeModulosAnterior: value })
                      }
                    />
                    <TextInput
                      label={"POTÊNCIA DOS MÓDULOS (ANTERIOR)"}
                      editable={false}
                      unit={"W"}
                      value={dados.potModulosAnterior}
                      handleChange={(value) =>
                        setDados({ ...dados, potModulosAnterior: value })
                      }
                    />
                  </div>
                  <div className="flex flex-col text-sm lg:text-base  items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      INFORMAÇÃO MÓDULOS (ANTERIOR)
                    </span>
                    <p className="text-xs w-full text-center  text-gray-600 outline-none">
                      {getJoinedInfo({
                        marca: dados.marcaModulosAnterior
                          ? dados.marcaModulosAnterior.toString().toUpperCase()
                          : "",
                        qtde: dados.qtdeModulosAnterior
                          ? dados.qtdeModulosAnterior.toString()
                          : "",
                        pot: dados.potModulosAnterior
                          ? dados.potModulosAnterior.toString()
                          : "",
                      })}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          )}

          <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
            <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
              ESTRUTURA DE MONTAGEM
            </span>
            <div className="flex gap-2 justify-around flex-wrap">
              <SelectInput
                label={"TIPO DA ESTRUTURA"}
                editable={false}
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
              {dados.tipoDeServico == "MONTAGEM E DESMONTAGEM" ? (
                <SelectInput
                  width={"450px"}
                  label={"TIPO DA ESTRUTURA (REMONTAGEM)"}
                  editable={false}
                  options={[
                    {
                      label: "MESMA ESTRUTURA",
                      value: "MESMA ESTRUTURA",
                    },
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
                  value={
                    dados.tipoEstruturaRemontagem
                      ? dados.tipoEstruturaRemontagem
                      : "NÃO DEFINIDO"
                  }
                  handleChange={(value) =>
                    setDados({ ...dados, tipoEstruturaRemontagem: value })
                  }
                />
              ) : null}
              <SelectInput
                label={"MATERIAL DA ESTRUTURA"}
                editable={false}
                options={[
                  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                  { label: "MADEIRA", value: "MADEIRA" },
                  { label: "FERRO", value: "FERRO" },
                ]}
                value={
                  dados.materialEstrutura
                    ? dados.materialEstrutura
                    : "NÃO DEFINIDO"
                }
                handleChange={(value) =>
                  setDados({ ...dados, materialEstrutura: value })
                }
              />
              {dados.tipoDeServico == "MONTAGEM E DESMONTAGEM" ? (
                <SelectInput
                  label={"MATERIAL DA ESTRUTURA (REMONTAGEM)"}
                  width={"450px"}
                  editable={false}
                  options={[
                    { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                    { label: "MESMO MATERIAL", value: "MESMO MATERIAL" },
                    { label: "MADEIRA", value: "MADEIRA" },
                    { label: "FERRO", value: "FERRO" },
                  ]}
                  value={
                    dados.materialEstruturaRemontagem
                      ? dados.materialEstruturaRemontagem
                      : "NÃO DEFINIDO"
                  }
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      materialEstruturaRemontagem: value,
                    })
                  }
                />
              ) : null}
              <SelectInput
                label={
                  "SERÁ NECESSÁRIO QUALQUER ADEQUAÇÃO OU CONSTRUÇÃO DE ESTRUTURA?"
                }
                editable={false}
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
                editable={false}
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
                    editable={false}
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
                      setDados({
                        ...dados,
                        formaPagamentoEstrutura: value,
                      })
                    }
                  />
                  <NumberInput
                    label={"VALOR DA ESTRUTURA"}
                    editable={false}
                    value={dados.valorEstrutura}
                    handleChange={(value) =>
                      setDados({
                        ...dados,
                        valorEstrutura: Number(value),
                      })
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
                editable={false}
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
                    editable={false}
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
                editable={false}
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
                value={
                  dados.clienteSegurado ? dados.clienteSegurado : "NÃO DEFINIDO"
                }
                handleChange={(value) =>
                  setDados({ ...dados, clienteSegurado: value })
                }
              />
              {dados.clienteSegurado == "SIM" && (
                <>
                  <SelectInput
                    label={"TEMPO SEGURADO"}
                    editable={false}
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
                  editable={false}
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
                    setDados({
                      ...dados,
                      formaPagamentoOeMOuSeguro: value,
                    })
                  }
                />
                <NumberInput
                  label={"VALOR O&M+SEGURO (se não incluso)"}
                  editable={false}
                  value={dados.valorOeMOuSeguro}
                  handleChange={(value) =>
                    setDados({
                      ...dados,
                      valorOeMOuSeguro: Number(value),
                    })
                  }
                />
              </div>
            )}
          </div>
          {![
            "OPERAÇÃO E MANUTENÇÃO",
            "BOMBA SOLAR",
            "SISTEMA FOTOVOLTAICO (OFF GRID)",
          ].includes(dados.tipoDeServico) ? (
            <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
              <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                AUMENTO DE CARGA
              </span>
              <div className="flex justify-center">
                <SelectInput
                  label={"HAVERÁ TROCA DE PADRÃO?"}
                  editable={false}
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
                    label={"CAIXA CONJUGADA?"}
                    editable={false}
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
                    value={dados.caixaConjugada}
                    handleChange={(value) =>
                      setDados({ ...dados, caixaConjugada: value })
                    }
                  />
                  <SelectInput
                    editable={false}
                    label={"TIPO DO PADRÃO"}
                    value={dados.tipoDePadrao}
                    handleChange={(value) =>
                      setDados({ ...dados, tipoDePadrao: value })
                    }
                    options={tiposDePadrao}
                  />
                  <SelectInput
                    editable={false}
                    label={"HAVERÁ AUMENTO DO DISJUNTOR?"}
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
                    editable={false}
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
                    editable={false}
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
                    editable={false}
                    value={dados.valorPadrao}
                    handleChange={(value) =>
                      setDados({ ...dados, valorPadrao: Number(value) })
                    }
                  />
                </div>
              )}
            </div>
          ) : null}

          <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
            <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
              DADOS FINANCEIROS E NEGOCIAÇÃO
            </span>
            <div className="flex gap-2 justify-around flex-wrap mt-2">
              <TextInput
                label={"NOME DO PAGADOR"}
                editable={false}
                value={dados.nomePagador}
                handleChange={(value) =>
                  setDados({ ...dados, nomePagador: value })
                }
              />
              <TextInput
                label={"CONTATO DO PAGADOR"}
                editable={false}
                value={dados.contatoPagador}
                handleChange={(value) =>
                  setDados({ ...dados, contatoPagador: phoneMask(value) })
                }
              />
              <TextInput
                label={"CPF/CNPJ PARA NF"}
                editable={false}
                value={dados.cpf_cnpjNF}
                handleChange={(value) =>
                  setDados({ ...dados, cpf_cnpjNF: formatCnpjCpf(value) })
                }
              />
            </div>
            <div className="flex gap-2 justify-around flex-wrap mt-2">
              <SelectInput
                label={"NECESSIDADE DE INSCRIÇÃO RURAL NA N.F?"}
                editable={false}
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
                  editable={false}
                  value={dados.inscriçãoRural}
                  handleChange={(value) =>
                    setDados({ ...dados, inscriçãoRural: value })
                  }
                />
              )}
            </div>
            {dados.tipoDeServico != "MONTAGEM E DESMONTAGEM" ? (
              <div className="flex gap-2 justify-around flex-wrap mt-2">
                <SelectInput
                  label={"LOCAL DE ENTREGA"}
                  editable={false}
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
                  editable={false}
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
                  editable={false}
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
            ) : null}

            <div className="flex gap-2 justify-around flex-wrap mt-2">
              <NumberInput
                label={"VALOR DO CONTRATO FOTOVOLTAICO(SEM CUSTOS ADICIONAIS)"}
                editable={false}
                tag={"R$"}
                value={dados.valorContrato}
                handleChange={(value) =>
                  setDados({ ...dados, valorContrato: Number(value) })
                }
              />
              <SelectInput
                label={"ORIGEM DO RECURSO"}
                editable={false}
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
                    value={dados.credor}
                    editable={false}
                    options={credores.map((credor) => credor)}
                    handleChange={(value) =>
                      setDados({ ...dados, credor: value })
                    }
                  />
                  <TextInput
                    label={"NOME DO GERENTE"}
                    editable={false}
                    value={dados.nomeGerente}
                    handleChange={(value) =>
                      setDados({ ...dados, nomeGerente: value })
                    }
                  />
                  <TextInput
                    label={"CONTATO DO GERENTE"}
                    editable={false}
                    value={dados.contatoGerente}
                    handleChange={(value) =>
                      setDados({
                        ...dados,
                        contatoGerente: phoneMask(value),
                      })
                    }
                  />
                </>
              )}
              <NumberInput
                label={"SE CARTÃO OU CHEQUE, QUANTAS PARCELAS?"}
                editable={false}
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
                value={dados.valorParcela}
                editable={false}
                tag={"R$"}
                handleChange={(value) =>
                  setDados({ ...dados, valorParcela: Number(value) })
                }
              />
              <SelectInput
                label={"NECESSIDADE N.F ADIANTADA"}
                value={dados.necessidadeNFAdiantada}
                editable={false}
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
                value={dados.necessidadeCodigoFiname}
                editable={false}
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
                editable={false}
                options={
                  dados.tipoDeServico == "SISTEMA FOTOVOLTAICO (OFF GRID)"
                    ? [
                        {
                          label:
                            "70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO",
                          value:
                            "70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO",
                        },
                        {
                          label:
                            "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                          value:
                            "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                        },
                        {
                          label: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                          value: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                        },
                        {
                          label: "NÃO DEFINIDO",
                          value: "NÃO DEFINIDO",
                        },
                      ]
                    : [
                        {
                          label:
                            "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR",
                          value:
                            "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR",
                        },
                        {
                          label:
                            "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                          value:
                            "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                        },
                        {
                          label: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                          value: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                        },
                        {
                          label: "NÃO DEFINIDO",
                          value: "NÃO DEFINIDO",
                        },
                      ]
                }
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
                readOnly={true}
                placeholder={"Descreva aqui a negociação"}
                value={dados.descricaoNegociacao}
                className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                onChange={(e) =>
                  setDados({
                    ...dados,
                    descricaoNegociacao: e.target.value.toUpperCase(),
                  })
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
        </>
      </div>
    </div>
  );
}
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;
  const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
  const collection = db.collection("contrato");
  let os = await collection.findOne({
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(os));
  // Pass data to the page via props
  return { props: { info } };
}
export default Formulario;
