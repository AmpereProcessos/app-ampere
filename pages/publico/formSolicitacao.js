import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../utils/whitelogo.png";
import TextInput from "../../components/TextInput";
import SelectInput from "../../components/SelectInput";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
import axios from "axios";
import FormSolicitacaoUm from "../../components/FormSolicitacaoUm";
import FormSolicitacaoDois from "../../components/FormSolicitacaoDois";
import FormSolicitacaoTres from "../../components/FormSolicitacaoTres";
import FormSolicitacaoQuatro from "../../components/FormSolicitacaoQuatro";
import FormSolicitacaoCinco from "../../components/FormSolicitacaoCinco";
import NumberInput from "../../components/NumberInput";
import FormSolicitacaoSeis from "../../components/FormSolicitacaoSeis";
import FormSolicitacaoSete from "../../components/FormSolicitacaoSete";
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
  const [estagio, setEstagio] = useState(7);
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
  });
  const [idemContrato, setIdemContrato] = useState("NÂO");
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
          <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
            <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
              DADOS FINANCEIROS E NEGOCIAÇÃO
            </span>
            <div className="flex justify-center">
              <SelectInput
                label={"IDEM CONTRATO?"}
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
                valor={idemContrato}
                handleChange={(value) => {}}
              />
            </div>
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
                  setDados({ ...dados, contatoPagador: value })
                }
              />
              <TextInput
                label={"CPF/CNPJ PARA NF"}
                editable={true}
                value={dados.cpf_cnpjNF}
                handleChange={(value) =>
                  setDados({ ...dados, cpf_cnpjNF: value })
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
                editable={true}
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
                ]}
              />
              {}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormularioSolicitacao;
