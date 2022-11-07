import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../utils/whitelogo.png";
import TextInput from "../../components/TextInput";
import DateInput from "../../components/DateInput";
import SelectInput from "../../components/SelectInput";
import NumberInput from "../../components/NumberInput";
import { AiOutlineSearch } from "react-icons/ai";
import { cidadesAtendidas, vendedores } from "../../utils/constants";
import axios from "axios";
import FormSolicitacaoUm from "../../components/FormSolicitacaoUm";
import FormSolicitacaoDois from "../../components/FormSolicitacaoDois";
import FormSolicitacaoTres from "../../components/FormSolicitacaoTres";
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
  const [estagio, setEstagio] = useState(3);
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
                      setDados({ ...dados, qtdeInversor: value })
                    }
                  />
                  <NumberInput
                    label={"POTÊNCIA INVERSOR/MICRO"}
                    unit={"W"}
                    editable={true}
                    value={dados.potInversor}
                    handleChange={(value) =>
                      setDados({ ...dados, potInversor: value })
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
                <NumberInput label={"QTDE DO OTIMIZADOR"} editable={true} />
                <NumberInput
                  label={"POTÊNCIA DO OTIMIZADOR"}
                  unit={"W"}
                  editable={true}
                />
              </div>
            )}
            <div className="flex gap-2 justify-around flex-wrap mt-2 pt-2 border-t border-gray-200 mx-2">
              <TextInput label={"MARCA DOS MÓDULOS"} editable={true} />
              <NumberInput label={"Nº DE MÓDULOS"} editable={true} />
              <NumberInput
                label={"POTÊNCIA DOS MÓDULOS"}
                unit={"W"}
                editable={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormularioSolicitacao;
