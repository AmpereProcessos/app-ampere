import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";

function FormSolicitacaoCinco({ avancar, setDados, dados }) {
  const [message, setMessage] = useState("");
  function validarCamposObrigatorios() {
    if (dados.tipoEstrutura == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha o tipo da estrutura");
      return false;
    }
    if (dados.estruturaAmpere == "NÃO DEFINIDO") {
      setMessage(
        "Por favor, preencha se estrutura é uma das estruturas Ampère."
      );
      return false;
    }
    if (
      dados.responsavelEstrutura != "NÃO SE APLICA" &&
      dados.formaPagamentoEstrutura == "NÃO DEFINIDO"
    ) {
      setMessage("Por favor, preencha uma forma de pagamento válida.");
      return false;
    }
    if (
      dados.responsavelEstrutura != "NÃO SE APLICA" &&
      (dados.valorEstrutura == null || dados.valorEstrutura == 0)
    ) {
      setMessage("Por favor, preencha o valor da estrutura");
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
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        ESTRUTURA DE MONTAGEM
      </span>
      <div className="flex gap-2 justify-around flex-wrap">
        <SelectInput
          label={"TIPO DA ESTRUTURA"}
          editable={true}
          options={[
            {
              label: "TELHADO",
              value: "TELHADO",
            },
            {
              label: "CARPORT",
              value: "CARPORT",
            },
            {
              label: "SOLO",
              value: "SOLO",
            },
            {
              label: "ESTRUTURA PERSONALIZADA",
              value: "ESTRUTURA PERSONALIZADA",
            },
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
          value={dados.tipoEstrutura}
          handleChange={(value) => setDados({ ...dados, tipoEstrutura: value })}
        />
        <SelectInput
          label={"ESTRUTURA AMPÈRE"}
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
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
          value={dados.estruturaAmpere}
          handleChange={(value) =>
            setDados({ ...dados, estruturaAmpere: value })
          }
        />
        <SelectInput
          label={"RESPONSÁVEL PELA ESTRUTURA"}
          editable={true}
          options={[
            {
              label: "AMPERE",
              value: "AMPERE",
            },
            {
              label: "CLIENTE",
              value: "CLIENTE",
            },
            {
              label: "NÃO SE APLICA",
              value: "NÃO SE APLICA",
            },
          ]}
          value={dados.responsavelEstrutura}
          handleChange={(value) =>
            setDados({ ...dados, responsavelEstrutura: value })
          }
        />
        {dados.responsavelEstrutura != "NÃO SE APLICA" && (
          <>
            <SelectInput
              label={"FORMA DE PAGAMENTO"}
              editable={true}
              options={[
                {
                  label: "INCLUSO NO FINANCIAMENTO",
                  value: "INCLUSO NO FINANCIAMENTO",
                },
                {
                  label: "DIRETO PRO FORNECEDOR",
                  value: "DIRETO PRO FORNECEDOR",
                },
                {
                  label: "A VISTA PARA AMPÈRE",
                  value: "A VISTA PARA AMPÈRE",
                },
                {
                  label: "NÃO SE APLICA",
                  value: "NÃO SE APLICA",
                },
                {
                  label: "NÃO DEFINIDO",
                  value: "NÃO DEFINIDO",
                },
              ]}
              value={dados.formaPagamentoEstrutura}
              handleChange={(value) =>
                setDados({ ...dados, formaPagamentoEstrutura: value })
              }
            />
            <NumberInput
              label={"VALOR DA ESTRUTURA"}
              editable={true}
              value={dados.valorEstrutura}
              handleChange={(value) =>
                setDados({ ...dados, valorEstrutura: Number(value) })
              }
            />
          </>
        )}
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

export default FormSolicitacaoCinco;
