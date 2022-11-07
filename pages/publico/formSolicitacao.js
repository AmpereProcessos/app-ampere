import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../utils/whitelogo.png";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import NumberInput from "../../components/NumberInput";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
import axios from "axios";
import { FiDelete } from "react-icons/fi";
import FormSolicitacaoUm from "../../components/FormSolicitacaoUm";
import FormSolicitacaoDois from "../../components/FormSolicitacaoDois";
import FormSolicitacaoTres from "../../components/FormSolicitacaoTres";
import FormSolicitacaoQuatro from "../../components/FormSolicitacaoQuatro";
import FormSolicitacaoCinco from "../../components/FormSolicitacaoCinco";
import FormSolicitacaoSeis from "../../components/FormSolicitacaoSeis";
import FormSolicitacaoSete from "../../components/FormSolicitacaoSete";
import FormSolicitacaoOito from "../../components/FormSolicitacaoOito";
import FormSolicitacaoNove from "../../components/FormSolicitacaoNove";
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
function FormularioSolicitacao() {
  const [estagio, setEstagio] = useState(0);
  const [dados, setDados] = useState({
    nomeVendedor: "NÃO DEFINIDO",
    telefoneVendedor: "",
    nomeDoContrato: "",
    telefone: "",
    cpf_cnpj: "",
    rg: "",
    dataDeNascimento: null,
    cep: "",
    cidade: cidadesAtendidas[0],
    uf: "",
    enderecoCobranca: "",
    numeroResCobranca: null,
    bairro: "",
    pontoDeReferencia: "",
    segmento: "RESIDENCIAL",
    formaAssinatura: "FISICO",
    codigoSVB: null,
    estadoCivil: "NÃO DEFINIDO",
    email: "",
    profissao: "",
    ondeTrabalha: "",
    possuiDeficiencia: "NÃO",
    qualDeficiencia: "",
    canalVenda: "NÃO DEFINIDO",
    nomeIndicador: "",
    telefoneIndicador: "",
    comoChegouAoCliente: "",
    nomeContatoJornadaUm: "",
    telefoneContatoUm: "",
    nomeContatoJornadaDois: "",
    telefoneContatoDois: "",
    cuidadosContatoJornada: "",
    nomeTitularProjeto: "",
    tipoDoTitular: "PESSOA FISICA",
    tipoDaLigacao: "EXISTENTE",
    tipoDaInstalacao: "URBANO",
    cepInstalacao: "",
    enderecoInstalacao: "",
    numeroResInstalacao: null,
    numeroInstalacao: null,
    bairroInstalacao: "",
    cidadeInstalacao: cidadesAtendidas[0],
    ufInstalacao: "",
    pontoDeReferenciaInstalacao: "",
    loginCemigAtende: "",
    senhaCemigAtende: "",
    latitude: "",
    longitude: "",
    potPico: null,
    geracaoPrevista: null,
    topologia: "NÃO DEFINIDO",
    marcaInversor: "",
    qtdeInversor: null,
    potInversor: null,
    marcaModulos: "",
    qtdeModulos: null,
    potModulos: null,
    tipoEstrutura: "NÃO DEFINIDO",
    estruturaAmpere: "NÃO DEFINIDO",
    responsavelEstrutura: "NÃO SE APLICA",
    formaPagamentoEstrutura: "NÃO DEFINIDO",
    valorEstrutura: null,
    possuiOeM: "NÃO DEFINIDO",
    planoOeM: "NÃO SE APLICA",
    clienteSegurado: "NÃO DEFINIDO",
    tempoSegurado: "NÃO SE APLICA",
    formaPagamentoOeMOuSeguro: "NÃO SE APLICA",
    valorOeMOuSeguro: null,
    aumentoDeCarga: "NÃO DEFINIDO",
    tipoDePadrao: "NÃO DEFINIDO",
    aumentoDisjuntor: "NÃO",
    respTrocaPadrao: "NÃO SE APLICA",
    formaPagamentoPadrao: "NÃO SE APLICA",
    valorPadrao: null,
    nomePagador: "",
    contatoPagador: "",
    necessidaInscricaoRural: "NÃO",
    inscriçãoRural: "",
    cpf_cnpjNF: "",
    localEntrega: "NÃO DEFINIDO",
    entregaIgualCobranca: "NÃO",
    restricoesEntrega: "NÃO DEFINIDO",
    valorContrato: null,
    origemRecurso: "NÃO DEFINIDO",
    numParcelas: 0,
    valorParcela: 0,
    credor: "NÃO DEFINIDO",
    nomeGerente: "",
    contatoGerente: "",
    necessidadeNFAdiantada: "NÃO",
    necessidadeCodigoFiname: "NÃO",
    formaDePagamento: "NÃO DEFINIDO",
    descricaoNegociacao: "",
    possuiDistribuicao: "NÃO",
    distribuicoes: [],
  });
  async function findCPF(field) {
    axios
      .get(
        `https://viacep.com.br/ws/${dados.cepInstalacao.replace("-", "")}/json/`
      )
      .then((res) => {
        console.log(res.data);
        setDados({
          ...dados,
          bairro: res.data.bairro,
          [field]: res.data.logradouro,
          uf: res.data.uf,
        });
      });
  }
  function criarSolicitacao() {
    axios
      .post("/api/solicitacoes/contrato", dados)
      .then((res) => console.log(res.data));
  }
  console.log(dados.distribuicoes);
  return (
    <div className="p-6 bg-gray-100 min-h-[100vh] flex flex-col">
      <div className="flex self-center items-center h-[100px] w-[100px]">
        <Image src={Logo} />
      </div>
      <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-xl">
        Formulário de Solicitacão
      </h1>
      <div className="flex flex-col items-center gap-y-5">
        <div className="w-full flex flex-wrap justify-around border border-[#15599a] p-2 shadow-lg bg-[#fff]">
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
          <TextInput
            label={"Telefone"}
            editable={true}
            value={dados.telefoneVendedor}
            handleChange={(value) =>
              setDados({ ...dados, telefoneVendedor: phoneMask(value) })
            }
          />
        </div>
        {estagio == 0 && (
          <FormSolicitacaoUm
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 1 && (
          <FormSolicitacaoDois
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 2 && (
          <FormSolicitacaoTres
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 3 && (
          <FormSolicitacaoQuatro
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 4 && (
          <FormSolicitacaoCinco
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 5 && (
          <FormSolicitacaoSeis
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 6 && (
          <FormSolicitacaoSete
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 7 && (
          <FormSolicitacaoOito
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 8 && (
          <FormSolicitacaoNove
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 9 && (
          <button
            onClick={criarSolicitacao}
            className="bg-[#fead61] rounded p-2"
          >
            CRIAR SOLICITAÇÃO
          </button>
        )}
      </div>
    </div>
  );
}

export default FormularioSolicitacao;
