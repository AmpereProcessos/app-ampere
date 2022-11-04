import React, { useState } from "react";
import TextInput from "./TextInput";
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
function FormSolicitacaoDois({ dados, setDados, avancar }) {
  const [message, setMessage] = useState("");
  function validarCamposObrigatorios() {
    if (dados.nomeContatoJornadaUm.trim().length < 6) {
      setMessage("Por favor, preencha o nome do contato primário");
      return false;
    }
    if (dados.telefoneContatoUm.trim().length < 9) {
      setMessage("Por favor, preencha o telefone do contato primário");
      return false;
    }
    if (dados.nomeContatoJornadaDois.trim().length < 6) {
      setMessage("Por favor, preencha o nome do contato secundário");
      return false;
    }
    if (dados.telefoneContatoDois.trim().length < 9) {
      setMessage("Por favor, preencha o telefone do contato secundário");
      return false;
    }
    return true;
  }
  function proximaEtapa() {
    if (validarCamposObrigatorios()) {
      avancar();
    }
  }
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        DADOS PARA CONTRATO
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
            setDados({ ...dados, telefoneContatoUm: phoneMask(value) })
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
            setDados({ ...dados, telefoneContatoDois: phoneMask(value) })
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
            onChange={(e) =>
              setDados({
                ...dados,
                cuidadosContatoJornada: e.target.value,
              })
            }
            className="w-full text-center h-[80px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
          />
        </div>
      </div>
      {message && <p className="text-red-400 italic text-center">{message}</p>}
      <div className="flex w-full justify-center mt-2">
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

export default FormSolicitacaoDois;
