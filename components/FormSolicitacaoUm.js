import React, { useState } from "react";
import TextInput from "./TextInput";
import DateInput from "./DateInput";
import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";
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
function FormSolicitacaoUm({ dados, setDados }) {
  const [message, setMessage] = useState("");
  async function findCPF(field) {
    axios
      .get(`https://viacep.com.br/ws/${dados.cep.replace("-", "")}/json/`)
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
  function validarCamposObrigatorios() {
    if (dados.nomeDoContrato.trim().length < 10) {
      setMessage("Por favor, preencha um nome ou razão social válido.");
      return false;
    }
    if (dados.telefone.trim().length < 8) {
      setMessage("Por favor, preencha um telefone válido.");
      return false;
    }
    if (dados.cpf_cnpj.trim().length < 12) {
      setMessage("Por favor, preencha um CPF/CNPJ válido.");
      return false;
    }
    if (dados.dataDeNascimento == null) {
      setMessage("Por favor, preencha uma data de nascimento.");
      return false;
    }
    if (dados.enderecoCobranca.trim().length < 7) {
      setMessage("Por favor, preencha um endereço de cobrança válido.");
      return false;
    }
    if (dados.numeroResCobranca == undefined || dados.numeroResCobranca == 0) {
      setMessage("Por favor, preencha um numéro de residência válido.");
      return false;
    }
    if (dados.bairro.trim().length < 5) {
      setMessage("Por favor, preencha um bairro válido.");
      return false;
    }
    if (dados.codigoSVB == undefined || dados.codigoSVB == 0) {
      setMessage("Por favor, preencha um numéro de residência válido.");
      return false;
    }
    if (dados.email.trim().length < 5) {
      setMessage("Por favor, preencha um email válido.");
      return false;
    }
    if (dados.profissao.trim().length < 3) {
      setMessage("Por favor, preencha um email válido.");
      return false;
    }
    if (
      dados.possuiDeficiencia == "SIM" &&
      dados.qualDeficiencia.trim().length < 3
    ) {
      setMessage("Por favor, preencha a deficiência.");
      return false;
    }
    if (
      dados.canalVenda == "INDICAÇÃO DE AMIGO" &&
      dados.nomeIndicador.trim().length < 3
    ) {
      setMessage("Por favor, preencha o nome do indicador.");
      return false;
    }
    return true;
  }
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        DADOS PARA CONTRATO
      </span>
      <div className="flex gap-2 justify-around flex-wrap">
        <TextInput
          label={"Nome/Razão Social"}
          value={dados.nomeDoContrato}
          editable={true}
          handleChange={(value) =>
            setDados({ ...dados, nomeDoContrato: value })
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
            setDados({ ...dados, enderecoCobranca: value })
          }
        />
        <NumberInput
          label={"Nº"}
          value={dados.numeroResCobranca}
          editable={true}
          handleChange={(value) =>
            setDados({ ...dados, numeroResCobranca: value })
          }
        />
        <TextInput
          label={"BAIRRO"}
          editable={true}
          value={dados.bairro}
          handleChange={(value) => setDados({ ...dados, bairro: value })}
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
          handleChange={(value) => setDados({ ...dados, codigoSVB: value })}
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
          editable={true}
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
          handleChange={(value) => setDados({ ...dados, ondeTrabalha: value })}
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
          onChange={(e) =>
            setDados({ ...dados, comoChegouAoCliente: e.target.value })
          }
          className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
        />
      </div>
      <div className="flex w-full justify-center mt-2">
        <button className="w-fit text-center p-2 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold ">
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default FormSolicitacaoUm;
