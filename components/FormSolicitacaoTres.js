import React, { useState } from "react";
import TextInput from "./TextInput";
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
function FormSolicitacaoTres({ avancar, setDados, dados, voltar }) {
  const [message, setMessage] = useState("");
  async function findCPF(field) {
    axios
      .get(
        `https://viacep.com.br/ws/${dados.cepInstalacao.replace("-", "")}/json/`
      )
      .then((res) => {
        if (res.data.erro) {
          return;
        } else {
          setDados({
            ...dados,
            bairroInstalacao: res.data.bairro,
            enderecoInstalacao: res.data.logradouro,
            ufInstalacao: res.data.uf,
          });
        }
      });
  }
  function validarCamposObrigatorios() {
    if (dados.nomeTitularProjeto.trim().length < 5) {
      setMessage("Por favor, preencha um nome do titular válido.");
      return false;
    }
    if (dados.enderecoInstalacao.trim().length < 7) {
      setMessage("Por favor, preencha um endereço válido");
      return false;
    }
    if (dados.bairroInstalacao.trim().length < 7) {
      setMessage("Por favor, preencha um bairro válido");
      return false;
    }
    if (dados.numeroResInstalacao == null) {
      setMessage("Por favor, preencha o número da residência.");
      return false;
    }
    if (
      dados.numeroInstalacao == null ||
      dados.numeroInstalacao.trim().length < 7
    ) {
      setMessage("Por favor, preencha um número de instalação válido.");
      return false;
    }
    if (
      dados.tipoDaInstalacao == "RURAL" &&
      dados.longitude.trim().length < 6
    ) {
      setMessage("Por favor, preencha uma longitude válida.");
      return false;
    }
    if (dados.tipoDaInstalacao == "RURAL" && dados.latitude.trim().length < 6) {
      setMessage("Por favor, preencha uma latitude válida.");
      return false;
    }
    if (dados.potPico == null) {
      setMessage("Por favor, preencha uma potência pico válida.");
      return false;
    }
    setMessage("");
    return true;
  }
  function proximaEtapa() {
    if (validarCamposObrigatorios()) {
      avancar();
    }
  }
  console.log(dados.numeroInstalacao);
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        DADOS PARA ENTRADA NA CEMIG
      </span>
      <div className="flex gap-2 justify-around flex-wrap">
        <TextInput
          label={"NOME DO TITULAR DO PROJETO"}
          value={dados.nomeTitularProjeto}
          editable={true}
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
          handleChange={(value) => setDados({ ...dados, tipoDoTitular: value })}
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
          handleChange={(value) => setDados({ ...dados, tipoDaLigacao: value })}
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
          editable={true}
          label={"CEP INSTALAÇÃO"}
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
          handleChange={(value) => setDados({ ...dados, ufInstalacao: value })}
        />
        <TextInput
          label={"PONTO DE REFERÊNCIA"}
          editable={true}
          value={dados.pontoDeReferenciaInstalacao}
          handleChange={(value) =>
            setDados({ ...dados, pontoDeReferenciaInstalacao: value })
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
          value={dados.latitude}
          editable={true}
          handleChange={(value) => setDados({ ...dados, latitude: value })}
        />
        <TextInput
          label={"LONGITUDE"}
          editable={true}
          value={dados.longitude}
          handleChange={(value) => setDados({ ...dados, longitude: value })}
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
      {message && <p className="text-red-400 italic text-center">{message}</p>}
      <div className="flex w-full justify-center gap-2 flex-wrap mt-2">
        <button
          onClick={voltar}
          className="bg-[#15599a] rounded p-2 font-bold text-white"
        >
          VOLTAR
        </button>
        <button
          onClick={proximaEtapa}
          className="w-fit text-center p-2 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold "
        >
          PRÓXIMA ETAPA
        </button>
      </div>
    </div>
  );
}

export default FormSolicitacaoTres;
