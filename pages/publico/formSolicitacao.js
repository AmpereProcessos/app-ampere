import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../utils/whitelogo.png";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import NumberInput from "../../components/NumberInput";
import {
  cidadesAtendidas,
  tiposDeServico,
  vendedores,
} from "../../utils/constants";
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
import VisualizacaoForm from "../../components/VisualizacaoForm";
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
  const [estagio, setEstagio] = useState(9);
  const [dados, setDados] = useState({
    nomeVendedor: "NÃO DEFINIDO",
    telefoneVendedor: "",
    tipoDeServico: "NÃO DEFINIDO",
    nomeDoContrato: "",
    telefone: "",
    cpf_cnpj: "",
    rg: "",
    dataDeNascimento: null,
    cep: "",
    cidade: "NÃO DEFINIDO",
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
    tipoDoTitular: "NÃO DEFINIDO",
    tipoDaLigacao: "NÃO DEFINIDO",
    tipoDaInstalacao: "NÃO DEFINIDO",
    cepInstalacao: "",
    enderecoInstalacao: "",
    numeroResInstalacao: null,
    numeroInstalacao: null,
    bairroInstalacao: "",
    cidadeInstalacao: "NÃO DEFINIDO",
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
    caixaConjugada: "NÃO DEFINIDO",
    tipoDePadrao: "NÃO DEFINIDO",
    aumentoDisjuntor: "NÃO",
    respTrocaPadrao: "NÃO SE APLICA",
    formaPagamentoPadrao: "NÃO HAVERA TROCA PADRÃO",
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
          <SelectInput
            label={"TIPO DE SERVIÇO"}
            editable={true}
            value={dados.tipoDeServico}
            handleChange={(value) =>
              setDados({ ...dados, tipoDeServico: value })
            }
            options={tiposDeServico.map((tipo) => tipo)}
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
            voltar={() => setEstagio(estagio - 1)}
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 2 && (
          <FormSolicitacaoTres
            voltar={() => setEstagio(estagio - 1)}
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 3 && (
          <FormSolicitacaoQuatro
            voltar={() => setEstagio(estagio - 1)}
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 4 && (
          <FormSolicitacaoCinco
            voltar={() => setEstagio(estagio - 1)}
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 5 && (
          <FormSolicitacaoSeis
            voltar={() => setEstagio(estagio - 1)}
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 6 && (
          <FormSolicitacaoSete
            voltar={() => setEstagio(estagio - 1)}
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 7 && (
          <FormSolicitacaoOito
            voltar={() => setEstagio(estagio - 1)}
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 8 && (
          <FormSolicitacaoNove
            voltar={() => setEstagio(estagio - 1)}
            avancar={() => setEstagio(estagio + 1)}
            dados={dados}
            setDados={setDados}
          />
        )}
        {estagio == 9 && (
          <VisualizacaoForm
            dados={dados}
            setDados={setDados}
            voltar={() => setEstagio(estagio - 1)}
          />
        )}
      </div>
    </div>
  );
}

export default FormularioSolicitacao;
