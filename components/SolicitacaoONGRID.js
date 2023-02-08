import React, { useState } from "react";
import FormSolicitacaoUm from "./FormSolicitacaoUm";
import FormSolicitacaoDois from "./FormSolicitacaoDois";
import FormSolicitacaoTres from "./FormSolicitacaoTres";
import FormSolicitacaoQuatro from "./FormSolicitacaoQuatro";
import FormSolicitacaoCinco from "./FormSolicitacaoCinco";
import FormSolicitacaoSeis from "./FormSolicitacaoSeis";
import FormSolicitacaoSete from "./FormSolicitacaoSete";
import FormSolicitacaoOito from "./FormSolicitacaoOito";
import FormSolicitacaoNove from "./FormSolicitacaoNove";
import FormSolicitacaoDez from "./FormSolicitacaoDez";
import VisualizacaoForm from "./VisualizacaoForm";
function SolicitacaoONGRID({ cliente, links, formVisitaId, tipoDeServico }) {
  const [estagio, setEstagio] = useState(0);
  const [dados, setDados] = useState({
    nomeVendedor: "NÃO DEFINIDO",
    nomeDoProjeto: cliente ? cliente : null,
    telefoneVendedor: "",
    tipoDeServico: tipoDeServico,
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
  console.log("TO AQUI");
  console.log(dados);
  return (
    <>
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
        <FormSolicitacaoDez
          dados={dados}
          setDados={setDados}
          avancar={() => setEstagio(estagio + 1)}
          voltar={() => setEstagio(estagio - 1)}
          prevLinks={links ? links : []}
        />
      )}
      {estagio == 10 && (
        <VisualizacaoForm
          dados={dados}
          setDados={setDados}
          linksVisita={links ? links : undefined}
          formVisitaId={formVisitaId ? formVisitaId : undefined}
          voltar={() => setEstagio(estagio - 1)}
        />
      )}
    </>
  );
}

export default SolicitacaoONGRID;
