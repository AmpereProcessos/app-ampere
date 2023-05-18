import React, { useEffect, useState } from "react";
import FormSolicitacaoDadosContrato from "./FormSolicitacaoDadosContrato";
import FormSolicitacaoDadosContato from "./FormSolicitacaoDadosContato";
import FormSolicitacaoDadosEstrutura from "./FormSolicitacaoDadosEstrutura";
import FormSolicitacaoDadosPagamento from "./FormSolicitacaoDadosPagamento";
import FormSolicitacaoDocumentacaoONGRID from "./FormSolicitacaoDocumentacaoONGRID";
import FormSolicitacaoEnderecoInstalacao from "./FormSolicitacaoEnderecoInstalacao";
import FormSolicitacaoEquipamentosONGRID from "./FormSolicitacaoEquipamentosONGRID";
import VisualizacaoFormBombaSolar from "./VisualizacaoFormBolhaSolar";
import FormSolicitacaoPagamentoOeM from "./FormSolicitacaoPagamentoOeM";
import FormSolicitacaoDocumentacaoOeM from "./FormSolicitacaoDocumentacaoOeM";
import VisualizacaoForm from "./VisualizacaoForm";
import FormSolicitacaoDistribuicoesCredito from "./FormSolicitacaoDistribuicoesCredito";
function SolicitacaoOeM({
  cliente,
  links,
  formVisitaId,
  tipoDeServico,
  nomeVendedor,
  telefoneVendedor,
}) {
  const [estagio, setEstagio] = useState(4);
  const [dados, setDados] = useState({
    nomeVendedor: nomeVendedor,
    nomeDoProjeto: cliente ? cliente : null,
    telefoneVendedor: telefoneVendedor,
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
    // tipoDaLigacao: "NÃO DEFINIDO",
    tipoDaInstalacao: "NÃO DEFINIDO",
    cepInstalacao: "",
    enderecoInstalacao: "",
    numeroResInstalacao: null,
    numeroInstalacao: null,
    bairroInstalacao: "",
    cidadeInstalacao: "NÃO DEFINIDO",
    ufInstalacao: "",
    pontoDeReferenciaInstalacao: "",
    // loginCemigAtende: "",
    // senhaCemigAtende: "",
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
    possuiOeM: "SIM",
    planoOeM: "NÃO SE APLICA",
    // clienteSegurado: "NÃO DEFINIDO",
    // tempoSegurado: "NÃO SE APLICA",
    // formaPagamentoOeMOuSeguro: "NÃO SE APLICA",
    // valorOeMOuSeguro: null,
    // aumentoDeCarga: "NÃO DEFINIDO",
    // caixaConjugada: "NÃO DEFINIDO",
    // tipoDePadrao: "NÃO DEFINIDO",
    // aumentoDisjuntor: "NÃO",
    // respTrocaPadrao: "NÃO SE APLICA",
    // formaPagamentoPadrao: "NÃO HAVERA TROCA PADRÃO",
    // valorPadrao: null,
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
    // possuiDistribuicao: "NÃO",
    // distribuicoes: [],
  });
  console.log(dados);
  useEffect(() => {
    setDados({
      ...dados,
      nomeVendedor: nomeVendedor,
      telefoneVendedor: telefoneVendedor,
      tipoDeServico: tipoDeServico,
    });
  }, [nomeVendedor, telefoneVendedor, tipoDeServico]);
  return (
    <>
      {estagio == 0 && (
        <FormSolicitacaoDadosContrato
          avancar={() => setEstagio(estagio + 1)}
          dados={dados}
          setDados={setDados}
        />
      )}
      {estagio == 1 && (
        <FormSolicitacaoDadosContato
          avancar={() => setEstagio(estagio + 1)}
          dados={dados}
          setDados={setDados}
        />
      )}
      {estagio == 2 && (
        <FormSolicitacaoEnderecoInstalacao
          voltar={() => setEstagio(estagio - 1)}
          avancar={() => setEstagio(estagio + 1)}
          dados={dados}
          setDados={setDados}
        />
      )}
      {estagio == 3 && (
        <FormSolicitacaoEquipamentosONGRID
          voltar={() => setEstagio(estagio - 1)}
          avancar={() => setEstagio(estagio + 1)}
          dados={dados}
          setDados={setDados}
        />
      )}
      {estagio == 4 && (
        <FormSolicitacaoDadosEstrutura
          voltar={() => setEstagio(estagio - 1)}
          avancar={() => setEstagio(estagio + 1)}
          dados={dados}
          setDados={setDados}
        />
      )}
      {estagio == 5 && (
        <FormSolicitacaoPagamentoOeM
          voltar={() => setEstagio(estagio - 1)}
          avancar={() => setEstagio(estagio + 1)}
          dados={dados}
          setDados={setDados}
        />
      )}
      {estagio == 6 && (
        <FormSolicitacaoDistribuicoesCredito
          dados={dados}
          setDados={setDados}
          avancar={() => setEstagio(estagio + 1)}
          voltar={() => setEstagio(estagio - 1)}
          prevLinks={links ? links : []}
        />
      )}
      {estagio == 7 && (
        <FormSolicitacaoDocumentacaoOeM
          dados={dados}
          setDados={setDados}
          avancar={() => setEstagio(estagio + 1)}
          voltar={() => setEstagio(estagio - 1)}
          prevLinks={links ? links : []}
        />
      )}
      {estagio == 8 && (
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

export default SolicitacaoOeM;
