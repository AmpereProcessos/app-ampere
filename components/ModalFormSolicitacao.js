import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";
import { AiOutlineSearch } from "react-icons/ai";
import {
  cidadesAtendidas,
  tiposDeServico,
  vendedores,
} from "../utils/constants";
import { VscChromeClose } from "react-icons/vsc";
import { FaSave } from "react-icons/fa";
import { useRouter } from "next/router";
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
const validation = {
  nomeDoContrato: {
    test(value) {
      return value.trim().length < 10;
    },
    msg: "Por favor, preencha um nome válido",
  },
  nomeDoProjeto: {
    test(value) {
      return value.trim().length < 2;
    },
    msg: "Por favor, preencha um nome válido",
  },
  "vendedor.nome": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha o vendedor do projeto",
  },
  codigoSVB: {
    test(value) {
      return value == 0;
    },
    msg: "Por favor, preencha um código SVB válido",
  },
  cpf_cnpj: {
    test(value) {
      return value.toString().length < 10;
    },
    msg: "Por favor, preencha um CPF/CNPJ válido",
  },
  telefone: {
    test(value) {
      return value.toString().length < 9;
    },
    msg: "Por favor, preencha um Telefone válido",
  },
  linkDrive: {
    test(value) {
      return value.trim().length < 5;
    },
    msg: "Por favor, preencha o link da pasta no Drive do cliente",
  },
  "estruturaPersonaliza.tipo": {
    test(value) {
      return value == "N/A";
    },
    msg: "Por favor, preencha um tipo de estrutura válido",
  },
  "contrato.status": {
    test(value) {
      return value != "AGUARDANDO SOLICITAÇÃO" && value != "SOLICITADO";
    },
    msg: "Por favor, preencha um status válido de contrato",
  },
  "pagamento.forma": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha uma forma de pagamento",
  },
  "pagamento.pagador": {
    test(value) {
      return value.trim().length < 3;
    },
    msg: "Por favor, preencha o nome do pagador.",
  },
  "pagamento.contatoPagador": {
    test(value) {
      return value.trim().length < 9;
    },
    msg: "Por favor, preencha o contato do pagador.",
  },
  "compra.localEntrega": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha o local de entrega",
  },
  "compra.tipoDoKit": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha o tipo do kit",
  },
  "dadosCemig.titularProjeto": {
    test(value) {
      return value.trim().length < 5;
    },
    msg: "Por favor, digite o titular do projeto",
  },
  "dadosCemig.distCreditos": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha sobre a necessidade de dist. de créditos",
  },
  "sistema.qtdeModulos": {
    test(value) {
      return value == 0;
    },
    msg: "Por favor, preencha a quantidade de módulos",
  },
  "sistema.potModulos": {
    test(value) {
      return value == 0;
    },
    msg: "Por favor, preencha a potência dos módulos",
  },
  "sistema.topologia": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha uma topologia válida",
  },
  "sistema.inversor": {
    test(value) {
      return value.trim().length < 5;
    },
    msg: "Por favor, preencha informacoes sobre os micro/inversor",
  },
  "material.previsaoCustos": {
    test(value) {
      return value == 0;
    },
    msg: "Por favor, preencha um valor válido de previsão de custos de insumo",
  },
  "obra.laudo": {
    test(value) {
      return value == "NÃO DEFINIDO";
    },
    msg: "Por favor, preencha o status do laudo",
  },
};
function ModalFormSolicitacao({ solicitacao, setModalIsOpen }) {
  const router = useRouter();
  const [dados, setDados] = useState(solicitacao);
  const [msg, setMessage] = useState({ text: "", color: "" });
  const [creationMsg, setCreationMsg] = useState({ text: "", color: "" });
  const [dadosDistribuicao, setDadosDistribuicao] = useState({
    numInstalacao: "",
    excedente: null,
  });

  function adicionarDistribuicao() {
    setDados({
      ...dados,
      distribuicoes: [
        ...dados.distribuicoes,
        {
          numInstalacao: dadosDistribuicao.numInstalacao,
          excedente: dadosDistribuicao.excedente,
        },
      ],
    });
    setDadosDistribuicao({ numInstalacao: "", excedente: 0 });
  }
  function saveChanges() {
    axios.put("/api/solicitacoes/contrato", dados).then((res) => {
      setMessage({ text: "Alterações feitas", color: "text-green-500" });
    });
  }
  async function rejectSolicitacao() {
    axios
      .put("/api/solicitacoes/contrato", {
        _id: solicitacao._id,
        aprovacao: false,
      })
      .then((res) =>
        setCreationMsg({
          text: "Solicitação rejeitada!",
          color: "text-red-500",
        })
      );
  }
  async function addProject() {
    await axios.put("/api/solicitacoes/contrato", {
      _id: solicitacao._id,
      aprovacao: true,
    });
    axios.post("/api/projects/add", insertObj).then((res) => {
      setCreationMsg({ text: "Projeto adicionado!", color: "text-green-500" });
    });
  }
  var insertObj = {
    nomeDoContrato: dados.nomeDoContrato,
    nomeDoProjeto: dados.nomeDoProjeto ? dados.nomeDoProjeto : "",
    cpf_cnpj: dados.cpf_cnpj,
    telefone: dados.telefone,
    cidade: dados.cidadeInstalacao,
    uf: dados.ufInstalacao,
    vendedor: {
      nome: dados.nomeVendedor,
      codigo: vendedores.filter(
        (vendedor) => vendedor.nome == dados.nomeVendedor
      )[0].cod,
    },
    linkDrive: dados.linkDrive ? dados.linkDrive : "",
    regional: dados.regional ? dados.regional : "NÃO DEFINIDO",
    tipoDeServico: dados.tipoDeServico
      ? dados.tipoDeServico
      : "SISTEMA FOTOVOLTAICO",
    codigoSVB: dados.codigoSVB,
    segmento: dados.segmento,
    obsComercial: dados.obsComercial ? dados.obsComercial : "",
    visitaTecnica: {
      status: "PENDÊNCIA",
      tecnico: "",
      saidaDoCliente: "",
      amperagem: dados.tipoDePadrao,
      tipoDaTelha: "",
    },
    padrao: {
      tipo: "NÃO DEFINIDO",
      respPagamento: dados.formaPagamentoPadrao,
      respInstalacao: dados.respTrocaPadrao,
      valor: dados.valorPadrao,
    },
    estruturaPersonalizada: {
      aplicavel: dados.estruturaAmpere == "NÃO" ? "SIM" : "NÃO",
      tipo: dados.tipoEstrutura,
      respPagamento: dados.responsavelEstrutura,
      valor: dados.valorEstrutura,
      status: dados.estruturaAmpere == "NÃO" ? "PENDÊNCIA" : "N/A",
    },
    contrato: {
      status: "AGUARDANDO SOLICITAÇÃO",
      dataSolicitacao: null, // formatar como data
      dataLiberacao: null, // formatar como data
      dataAssinatura: null, // formatar como data
      formaAssinatura: dados.formaAssinatura,
    },
    pagamento: {
      status: "NÃO DEFINIDO",
      forma: dados.origemRecurso,
      credor: dados.credor,
      pagador: dados.nomePagador,
      contatoPagador: dados.contatoPagador,
      retorno: 0,
      cobrancaFeita: false,
    },
    faturamento: {
      previsaoFaturamento: 0, // adicionar empresa e cnpj de faturamento
      cnpjFaturamento: 0,
      empresaFaturamento: "NÃO DEFINIDO",
    },
    compra: {
      statusLiberacao: "NÃO DEFINIDO",
      dataLiberacao: undefined, // formatar como data
      tipoDoKit: dados.tipoDoKit ? dados.tipoDoKit : "NÃO DEFINIDO",
      valorDoKit: 0,
      kitInfo: "",
      fornecedor: "NÃO DEFINIDO",
      dataPedido: undefined, // formatar como data
      dataPagamento: undefined,
      previsaoEntrega: undefined, // formatar como data
      localEntrega:
        dados.localEntrega == "MESMO DO PROJETO"
          ? dados.localEntrega
          : "DIFERENTE DO PROJETO",
      informacoes: "",
      previsaoNotaFiscal: undefined,
      rastreio: "",
      statusEntrega: "NÃO DEFINIDO",
    },
    dadosCemig: {
      titularProjeto: dados.nomeTitularProjeto,
      numeroInstalacao: dados.numeroInstalacao,
      distCreditos: dados.possuiDistribuicao,
      qtdeDistCreditos:
        dados.distribuicoes.length != 0 ? dados.distribuicoes.length : 0,
    },
    sistema: {
      qtdeModulos: dados.qtdeModulos,
      potModulos: dados.potModulos,
      potPico: dados.potPico,
      topologia: dados.topologia,
      inversor: `${dados.qtdeInversor} - ${dados.potInversor}`,
      valorProjeto: dados.valorContrato,
    },
    projeto: {
      iniciar: "NÃO DEFINIDO",
      projetista: {
        nome: "NÃO DEFINIDO",
        codigo: undefined,
      },
      dataLiberacaoDocumentacao: undefined, // formatar como data
      dataAssDocumentacao: undefined, // formatar como data
      diagramaUnifilar: undefined,
      desenhoTelhado: undefined,
      mapaDeMicro: undefined,
      aumentoDeCarga:
        dados.aumentoDeCarga == "SIM" ? dados.aumentoDeCarga : "NÃO",
      acStatus: dados.aumentoDeCarga == "SIM" ? "PENDÊNCIA" : "NÃO DEFINIDO",
      projetoConcluido: "NÃO",
      relatorioComissionamento: undefined,
    },
    parecer: {
      statusDoParecerDeAcesso: "NÃO DEFINIDO",
      dataParecerDeAcesso: undefined, // formatar como data
      parecerReprovado: "NÃO",
      qtdeReprovas: 0,
      motivoReprova: undefined,
    },
    vistoria: {
      dataPedido: undefined, // formatar como data
      status: "NÃO DEFINIDO",
      vistoriaReprovada: "NÃO",
      qtdeReprovas: 0,
      motivoReprova: undefined,
    },
    medidor: {
      data: undefined, // formatar como data
      status: "NÃO DEFINIDO",
    },
    obra: {
      laudo: dados.laudo ? dados.laudo : "NÃO DEFINIDO",
      observacoes: "", // possibilidade de substituir \n por /, e quebrar textp em pontos
      statusSolicitacao: "NÃO SOLICITADA",
      entrada: undefined, // formatar como data
      saida: undefined, // formatar como data.
      statusDaObra: "NÃO DEFINIDO",
      equipeResp: "NÃO DEFINIDO",
      checklist: undefined,
      trafo: "NÃO",
      fotosInstalacao: undefined,
    },
    material: {
      statusSeparacao: "NÃO DEFINIDO",
      previsaoCustos: dados.previsaoCustos, // toFixed(2)
      efetivoCustos: 0,
      notaFiscal: undefined,
      materialFaltante: "",
    },
    manutencaoPreventiva: { status: "NÃO REALIZADO", data: null },
    relatorios: {
      envioUm: { status: "NÃO REALIZADO", data: null },
      envioDois: { status: "NÃO REALIZADO", data: null },
      envioTres: { status: "NÃO REALIZADO", data: null },
      envioQuatro: { status: "NÃO REALIZADO", data: null },
    },
    conferencias: {
      usinaLigada: { status: "NÃO REALIZADO", data: null },
      monitoramentoFeito: { status: "NÃO REALIZADO", data: null },
      energiaInjetada: { status: "NÃO REALIZADO", data: null },
    },
    app: {
      data: undefined,
      login: "",
      senha: "",
    },
    dataNascimento: dados.dataDeNascimento,
    email: dados.email,
    logradouro: dados.enderecoInstalacao,
    numeroResidencia: dados.numeroResInstalacao,
    bairro: dados.bairroInstalacao,
    cep: dados.cepInstalacao,
    canalVenda: dados.canalVenda,
    indicacao: {
      quemIndicou: dados.nomeIndicador ? dados.nomeIndicador : null, //add
      contato: dados.telefoneIndicador ? dados.telefoneIndicador : null, //add
    },
    ondeTrabalha: dados.ondeTrabalha,
    jornada: {
      dataUltimoContato: undefined,
      boasVindas: false,
      assDocumentacoes: false,
      compraDoKit: false,
      nfFaturada: false,
      prevChegada: false,
      respConcessionaria: false,
      entregaDoKit: false,
      instalacaoAgendada: false,
      vistoriaConcessionaria: false,
      sistemaLigado: false,
      jornadaConcluida: false,
      dataNps: undefined,
    },
    nps: undefined,
  };
  function validateCreation() {
    var holder;
    Object.entries(insertObj).forEach((entry) => {
      if (typeof entry[1] == "object") {
        let tag = entry[0];
        Object.keys(entry[1]).forEach((x) => {
          if (validation[`${tag}.${x}`] != undefined) {
            if (validation[`${tag}.${x}`].test(insertObj[tag][x]) == true) {
              holder = true;
              setCreationMsg({
                text: validation[`${tag}.${x}`].msg,
                color: "text-red-500",
              });
            }
          } else return;
        });
      } else {
        let tag = entry[0];
        if (validation[tag] != undefined) {
          if (validation[tag].test(insertObj[tag]) == true) {
            holder = true;
            setCreationMsg({
              text: validation[tag].msg,
              color: "text-red-500",
            });
          }
        }
      }
    });
    if (holder == undefined) {
      setCreationMsg({ text: "", color: "" });
      addProject();
    }
  }
  console.log(dados);
  return (
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between px-2 text-lg pb-2 border-b border-gray-200">
              <h1 className="text-[#15599a] pl-6  font-bold">
                {dados.nomeDoContrato}
              </h1>
              <button
                onClick={() =>
                  router.push(`/comercial/publicoFormulario/${dados._id}`)
                }
                className="p-2 text-sm bg-[#fead61] font-bold rounded"
              >
                Visualização para PDF
              </button>
              <div className="flex items-center gap-x-2">
                {msg.text && (
                  <p className={`italic ${msg.color}`}>{msg.text}</p>
                )}
                <button
                  onClick={saveChanges}
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
                        setDados({
                          ...dados,
                          nomeDoContrato: value.toUpperCase(),
                        })
                      }
                    />
                    <SelectInput
                      label={"Vendedor"}
                      value={dados.nomeVendedor}
                      editable={true}
                      options={vendedores.map((vendedor) => {
                        return { label: vendedor.nome, value: vendedor.nome };
                      })}
                      handleChange={(value) =>
                        setDados({ ...dados, nomeVendedor: value })
                      }
                    />
                    <SelectInput
                      label={"TIPO DE SERVIÇO"}
                      editable={true}
                      value={
                        dados.tipoDeServico
                          ? dados.tipoDeServico
                          : "NÃO DEFINIDO"
                      }
                      options={tiposDeServico.map((tipo) => tipo)}
                      handleChange={(value) =>
                        setDados({ ...dados, tipoDeServico: value })
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
                      handleChange={(value) =>
                        setDados({ ...dados, rg: value })
                      }
                    />
                    <DateInput
                      label={"DATA DE NASCIMENTO"}
                      editable={true}
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
                      handleChange={(value) =>
                        setDados({ ...dados, cidade: value })
                      }
                    />
                    <TextInput
                      label={"UF"}
                      editable={true}
                      value={dados.uf}
                      handleChange={(value) =>
                        setDados({ ...dados, uf: value })
                      }
                    />
                    <TextInput
                      label={"ENDEREÇO DE COBRANÇA"}
                      editable={true}
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
                      handleChange={(value) =>
                        setDados({ ...dados, segmento: value })
                      }
                    />
                    <SelectInput
                      label={"FORMA DE ASSINATURA"}
                      editable={true}
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
                      editable={true}
                      value={dados.email}
                      handleChange={(value) =>
                        setDados({ ...dados, email: value })
                      }
                    />
                    <TextInput
                      label={"PROFISSÃO"}
                      editable={true}
                      value={dados.profissao}
                      handleChange={(value) =>
                        setDados({ ...dados, profissao: value })
                      }
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
                    />
                  </div>
                  <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
                    <span className="uppercase font-bold font-raleway text-center text-sm">
                      OBS COMERCIAL
                    </span>
                    <textarea
                      placeholder={"Observações comerciais aqui.."}
                      value={dados.obsComercial ? dados.obsComercial : ""}
                      onChange={(e) =>
                        setDados({ ...dados, obsComercial: e.target.value })
                      }
                      className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
                  <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
                    DADOS ADICIONAIS PARA ENTRADA NA GESTÃO
                  </span>
                  <div className="flex gap-2 justify-around flex-wrap">
                    <TextInput
                      label={"Nome do Projeto"}
                      value={dados.nomeDoProjeto ? dados.nomeDoProjeto : ""}
                      editable={true}
                      handleChange={(value) => {
                        setDados({ ...dados, nomeDoProjeto: value });
                      }}
                    />
                    <SelectInput
                      label={"Regional"}
                      editable={true}
                      value={dados.regional ? dados.regional : "NÃO DEFINIDO"}
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
                        setDados({ ...dados, regional: value });
                      }}
                    />
                    <TextInput
                      label={"LINK PASTA DO DRIVE"}
                      editable={true}
                      value={dados.linkDrive ? dados.linkDrive : ""}
                      handleChange={(value) => {
                        setDados({ ...dados, linkDrive: value });
                      }}
                    />
                    <SelectInput
                      label={"TIPO DE SERVIÇO"}
                      editable={true}
                      options={tiposDeServico.map((tipo) => {
                        return { label: tipo.label, value: tipo.value };
                      })}
                      value={
                        dados.tipoDeServico
                          ? dados.tipoDeServico
                          : "SISTEMA FOTOVOLTAICO"
                      }
                      handleChange={(value) =>
                        setDados({ ...dados, tipoDeServico: value })
                      }
                    />
                    <NumberInput
                      tag={"R$"}
                      label={"Previsão de custos em insumos"}
                      editable={true}
                      value={dados.previsaoCustos ? dados.previsaoCustos : 0}
                      handleChange={(value) => {
                        setDados({ ...dados, previsaoCustos: Number(value) });
                      }}
                    />
                    <SelectInput
                      label={"TIPO DO KIT"}
                      value={dados.tipoDoKit ? dados.tipoDoKit : "NÃO DEFINIDO"}
                      editable={true}
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
                        setDados({ ...dados, tipoDoKit: value });
                      }}
                    />
                    <SelectInput
                      label={"Laudo"}
                      value={dados.laudo ? dados.laudo : "NÃO DEFINIDO"}
                      editable={true}
                      options={[
                        { label: "EM ESTUDO", value: "EM ESTUDO" },
                        { label: "EMITIDO", value: "EMITIDO" },
                        { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                      ]}
                      handleChange={(value) => {
                        setDados({ ...dados, laudo: value });
                      }}
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
                        setDados({
                          ...dados,
                          telefoneContatoUm: phoneMask(value),
                        })
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
                        placeholder={
                          "Descreva aqui cuidados em relação ao contato do cliente durante a jornada. Melhores horários para contato, texto ou aúdio, etc..."
                        }
                        value={dados.cuidadosContatoJornada}
                        className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
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
                        setDados({
                          ...dados,
                          pontoDeReferenciaInstalacao: value,
                        })
                      }
                    />
                    <TextInput
                      label={"LOGIN(CEMIG ATENDE)"}
                      editable={true}
                      value={dados.loginCemigAtende}
                      handleChange={(value) =>
                        setDados({ ...dados, loginCemigAtende: value })
                      }
                    />
                    <TextInput
                      label={"SENHA(CEMIG ATENDE)"}
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
                      handleChange={(value) =>
                        setDados({ ...dados, latitude: value })
                      }
                    />
                    <TextInput
                      label={"LONGITUDE"}
                      editable={true}
                      value={dados.longitude}
                      handleChange={(value) =>
                        setDados({ ...dados, longitude: value })
                      }
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
                        value={
                          dados.marcaOtimizador ? dados.marcaOtimizador : ""
                        }
                        handleChange={(value) =>
                          setDados({ ...dados, marcaOtimizador: value })
                        }
                      />
                      <NumberInput
                        label={"QTDE DO OTIMIZADOR"}
                        editable={true}
                        value={
                          dados.qtdeOtimizador ? dados.qtdeOtimizador : null
                        }
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
                            setDados({
                              ...dados,
                              formaPagamentoEstrutura: value,
                            })
                          }
                        />
                        <NumberInput
                          label={"VALOR DA ESTRUTURA"}
                          editable={true}
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
                      handleChange={(value) =>
                        setDados({ ...dados, possuiOeM: value })
                      }
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
                  {(dados.possuiOeM == "SIM" ||
                    dados.clienteSegurado == "SIM") && (
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
                          setDados({
                            ...dados,
                            formaPagamentoOeMOuSeguro: value,
                          })
                        }
                      />
                      <NumberInput
                        label={"VALOR O&M+SEGURO"}
                        editable={true}
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
                        editable={true}
                        label={"TIPO DO PADRÃO"}
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
                        editable={true}
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
                      handleChange={(value) =>
                        setDados({ ...dados, nomePagador: value })
                      }
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
                      label={
                        "VALOR DO CONTRATO FOTOVOLTAICO(SEM CUSTOS ADICIONAIS)"
                      }
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
                          handleChange={(value) =>
                            setDados({ ...dados, credor: value })
                          }
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
                      value={dados.valorParcela}
                      editable={true}
                      tag={"R$"}
                      handleChange={(value) =>
                        setDados({ ...dados, valorParcela: Number(value) })
                      }
                    />
                    <SelectInput
                      label={"NECESSIDADE N.F ADIANTADA"}
                      value={dados.necessidadeNFAdiantada}
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
                      ]}
                      handleChange={(value) =>
                        setDados({ ...dados, necessidadeNFAdiantada: value })
                      }
                    />
                    <SelectInput
                      label={"NECESSIDADE CÓDIGO FINAME?"}
                      value={dados.necessidadeCodigoFiname}
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
                      <div className="flex flex-col gap-2 mt-2">
                        <h1 className="text-center font-bold font-raleway">
                          ADICIONAR DISTRIBUIÇÃO:
                        </h1>
                        <div className="flex flex-col lg:flex-row items-center justify-around">
                          <div className="flex flex-col items-center">
                            <span className="uppercase font-bold font-raleway text-center text-sm">
                              Nº DA INSTALAÇÃO
                            </span>
                            <input
                              className={`text-xs text-center text-gray-600 outline-none`}
                              value={dadosDistribuicao.numInstalacao}
                              placeholder={"INFORMAÇÃO A PREENCHER..."}
                              onChange={(e) =>
                                setDadosDistribuicao({
                                  ...dadosDistribuicao,
                                  numInstalacao: e.target.value,
                                })
                              }
                              type="text"
                            />
                          </div>
                          <NumberInput
                            label={"% EXCEDENTE"}
                            editable={true}
                            value={dadosDistribuicao.excedente}
                            handleChange={(value) =>
                              setDadosDistribuicao({
                                ...dadosDistribuicao,
                                excedente: Number(value),
                              })
                            }
                            unit={"%"}
                          />
                          <button
                            onClick={adicionarDistribuicao}
                            className="p-1 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold"
                          >
                            ADICIONAR
                          </button>
                        </div>
                      </div>
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
                {creationMsg.text && (
                  <p className={`text-center italic ${creationMsg.color}`}>
                    {creationMsg.text}
                  </p>
                )}
                {!dados.aprovacao && (
                  <div className="flex items-center justify-around w-full">
                    <div className="w-full flex justify-center">
                      <button
                        onClick={validateCreation}
                        className="p-2 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold"
                      >
                        ADICIONAR PROJETO
                      </button>
                    </div>
                    <div className="w-full flex justify-center">
                      <button
                        onClick={rejectSolicitacao}
                        className="p-2 rounded bg-red-300 hover:bg-red-500 text-white font-bold"
                      >
                        REJEITAR SOLICITAÇÃO
                      </button>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalFormSolicitacao;
