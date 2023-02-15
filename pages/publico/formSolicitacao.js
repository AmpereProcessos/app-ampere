import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../utils/whitelogo.png";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import {
  cidadesAtendidas,
  tiposDeServico,
  vendedores,
} from "../../utils/constants";
import connectToSolicitacoesDatabase from "../../utils/solicitacoesDb";
import { ObjectId } from "mongodb";
import SolicitacaoONGRID from "../../components/SolicitacaoONGRID";
import SolicitacaoOFFGRID from "../../components/SolicitacaoOFFGRID";
import SolicitacaoBombaSolar from "../../components/SolicitacaoBombaSolar";
import SolicitacaoOutrosServicos from "../../components/SolicitacaoOutrosServicos";
import SolicitacaoOeM from "../../components/SolicitacaoOeM";
const phoneMask = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};
function FormularioSolicitacao({ cliente, links, formVisitaId }) {
  // const [estagio, setEstagio] = useState(0);
  // const [info, setInfo] = useState({
  //   nomeVendedor: "NÃO DEFINIDO",
  //   nomeDoProjeto: cliente ? cliente : null,
  //   telefoneVendedor: "",
  //   tipoDeServico: "NÃO DEFINIDO",
  //   nomeDoContrato: "",
  //   telefone: "",
  //   cpf_cnpj: "",
  //   rg: "",
  //   dataDeNascimento: null,
  //   cep: "",
  //   cidade: "NÃO DEFINIDO",
  //   uf: "",
  //   enderecoCobranca: "",
  //   numeroResCobranca: null,
  //   bairro: "",
  //   pontoDeReferencia: "",
  //   segmento: "RESIDENCIAL",
  //   formaAssinatura: "FISICO",
  //   codigoSVB: null,
  //   estadoCivil: "NÃO DEFINIDO",
  //   email: "",
  //   profissao: "",
  //   ondeTrabalha: "",
  //   possuiDeficiencia: "NÃO",
  //   qualDeficiencia: "",
  //   canalVenda: "NÃO DEFINIDO",
  //   nomeIndicador: "",
  //   telefoneIndicador: "",
  //   comoChegouAoCliente: "",
  //   nomeContatoJornadaUm: "",
  //   telefoneContatoUm: "",
  //   nomeContatoJornadaDois: "",
  //   telefoneContatoDois: "",
  //   cuiinfoContatoJornada: "",
  //   nomeTitularProjeto: "",
  //   tipoDoTitular: "NÃO DEFINIDO",
  //   tipoDaLigacao: "NÃO DEFINIDO",
  //   tipoDaInstalacao: "NÃO DEFINIDO",
  //   cepInstalacao: "",
  //   enderecoInstalacao: "",
  //   numeroResInstalacao: null,
  //   numeroInstalacao: null,
  //   bairroInstalacao: "",
  //   cidadeInstalacao: "NÃO DEFINIDO",
  //   ufInstalacao: "",
  //   pontoDeReferenciaInstalacao: "",
  //   loginCemigAtende: "",
  //   senhaCemigAtende: "",
  //   latitude: "",
  //   longitude: "",
  //   potPico: null,
  //   geracaoPrevista: null,
  //   topologia: "NÃO DEFINIDO",
  //   marcaInversor: "",
  //   qtdeInversor: null,
  //   potInversor: null,
  //   marcaModulos: "",
  //   qtdeModulos: null,
  //   potModulos: null,
  //   tipoEstrutura: "NÃO DEFINIDO",
  //   estruturaAmpere: "NÃO DEFINIDO",
  //   responsavelEstrutura: "NÃO SE APLICA",
  //   formaPagamentoEstrutura: "NÃO DEFINIDO",
  //   valorEstrutura: null,
  //   possuiOeM: "NÃO DEFINIDO",
  //   planoOeM: "NÃO SE APLICA",
  //   clienteSegurado: "NÃO DEFINIDO",
  //   tempoSegurado: "NÃO SE APLICA",
  //   formaPagamentoOeMOuSeguro: "NÃO SE APLICA",
  //   valorOeMOuSeguro: null,
  //   aumentoDeCarga: "NÃO DEFINIDO",
  //   caixaConjugada: "NÃO DEFINIDO",
  //   tipoDePadrao: "NÃO DEFINIDO",
  //   aumentoDisjuntor: "NÃO",
  //   respTrocaPadrao: "NÃO SE APLICA",
  //   formaPagamentoPadrao: "NÃO HAVERA TROCA PADRÃO",
  //   valorPadrao: null,
  //   nomePagador: "",
  //   contatoPagador: "",
  //   necessidaInscricaoRural: "NÃO",
  //   inscriçãoRural: "",
  //   cpf_cnpjNF: "",
  //   localEntrega: "NÃO DEFINIDO",
  //   entregaIgualCobranca: "NÃO",
  //   restricoesEntrega: "NÃO DEFINIDO",
  //   valorContrato: 0,
  //   origemRecurso: "NÃO DEFINIDO",
  //   numParcelas: 0,
  //   valorParcela: 0,
  //   credor: "NÃO DEFINIDO",
  //   nomeGerente: "",
  //   contatoGerente: "",
  //   necessidadeNFAdiantada: "NÃO",
  //   necessidadeCodigoFiname: "NÃO",
  //   formaDePagamento: "NÃO DEFINIDO",
  //   descricaoNegociacao: "",
  //   possuiDistribuicao: "NÃO",
  //   distribuicoes: [],
  // });
  const [info, setInfo] = useState({
    nomeVendedor: "NÃO DEFINIDO",
    telefoneVendedor: "",
    tipoDeServico: "NÃO DEFINIDO",
  });
  return (
    <div className="p-6 bg-[#fff] min-h-[100vh] flex flex-col">
      <div className="flex self-center items-center h-[100px] w-[100px]">
        <Image src={Logo} />
      </div>
      <h1 className="text-center uppercase font-raleway text-[#15599a] font-bold text-2xl">
        Formulário de Solicitacão
      </h1>
      <div className="flex flex-col items-center gap-y-5">
        <div className="w-full flex flex-wrap justify-around border border-[#15599a] p-2 shadow-lg bg-[#fff]">
          <SelectInput
            label={"Vendedor"}
            value={info.nomeVendedor}
            editable={true}
            options={vendedores.map((vendedor) => {
              return { label: vendedor.nome, value: vendedor.nome };
            })}
            handleChange={(value) => setInfo({ ...info, nomeVendedor: value })}
          />
          <TextInput
            label={"Telefone"}
            editable={true}
            value={info.telefoneVendedor}
            handleChange={(value) =>
              setInfo({ ...info, telefoneVendedor: phoneMask(value) })
            }
          />
          <SelectInput
            label={"TIPO DE SERVIÇO"}
            editable={true}
            value={info.tipoDeServico}
            handleChange={(value) => setInfo({ ...info, tipoDeServico: value })}
            options={tiposDeServico.map((tipo) => tipo)}
          />
        </div>
        {info.tipoDeServico == "SISTEMA FOTOVOLTAICO" && (
          <SolicitacaoONGRID
            nomeVendedor={info.nomeVendedor}
            telefoneVendedor={info.telefoneVendedor}
            cliente={cliente}
            links={links}
            formVisitaId={formVisitaId}
            tipoDeServico={info.tipoDeServico}
          />
        )}
        {info.tipoDeServico == "SISTEMA FOTOVOLTAICO (OFF GRID)" && (
          <SolicitacaoOFFGRID
            nomeVendedor={info.nomeVendedor}
            telefoneVendedor={info.telefoneVendedor}
            cliente={cliente}
            links={links}
            formVisitaId={formVisitaId}
            tipoDeServico={info.tipoDeServico}
          />
        )}
        {info.tipoDeServico == "BOMBA SOLAR" && (
          <SolicitacaoBombaSolar
            nomeVendedor={info.nomeVendedor}
            telefoneVendedor={info.telefoneVendedor}
            cliente={cliente}
            links={links}
            formVisitaId={formVisitaId}
            tipoDeServico={info.tipoDeServico}
          />
        )}
        {info.tipoDeServico == "OPERAÇÃO E MANUTENÇÃO" && (
          <SolicitacaoOeM
            nomeVendedor={info.nomeVendedor}
            telefoneVendedor={info.telefoneVendedor}
            cliente={cliente}
            links={links}
            formVisitaId={formVisitaId}
            tipoDeServico={info.tipoDeServico}
          />
        )}
        {![
          "SISTEMA FOTOVOLTAICO",
          "SISTEMA FOTOVOLTAICO (OFF GRID)",
          "OPERAÇÃO E MANUTENÇÃO",
          "BOMBA SOLAR",
        ].includes(info.tipoDeServico) && (
          <SolicitacaoOutrosServicos
            nomeVendedor={info.nomeVendedor}
            telefoneVendedor={info.telefoneVendedor}
            cliente={cliente}
            links={links}
            formVisitaId={formVisitaId}
            tipoDeServico={info.tipoDeServico}
          />
        )}
      </div>
    </div>
  );
}

export default FormularioSolicitacao;

export async function getServerSideProps(ctx) {
  const cliente = ctx.query.cliente;
  const formId = ctx.query.id;
  // The next line will only be logged on the server and never on the browser console even if we make
  // client-side navigation.
  // This confirms that `getServerSideProps` is guaranteed to run on the server and never on the client (or browser).
  if (cliente && formId) {
    const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
    const collection = db.collection("visitaTecnica");
    let obj = await collection.findOne(
      {
        _id: ObjectId(formId),
      },
      {
        $project: {
          links: 1,
        },
      }
    );
    return {
      props: {
        cliente,
        links: obj.links,
        formVisitaId: formId,
      },
    };
  } else
    return {
      props: {},
    };
}
