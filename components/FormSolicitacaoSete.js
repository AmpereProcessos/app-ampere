import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";
function FormSolicitacaoSete({ avancar, setDados, dados, voltar }) {
  const [message, setMessage] = useState("");
  function validarCamposObrigatorios() {
    if (dados.aumentoDeCarga == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha se há aumento de carga.");
      return false;
    }
    if (dados.aumentoDeCarga == "SIM") {
      if (dados.caixaConjugada == "NÃO DEFINIDO") {
        setMessage("Por favor, preencha se há caixa conjugada.");
        return false;
      }
      if (dados.tipoDePadrao == "NÃO DEFINIDO") {
        setMessage("Por favor, preencha o tipo de padrão.");
        return false;
      }
      if (dados.respTrocaPadrao == "NÃO SE APLICA") {
        setMessage("Por favor, preencha o responsável pela troca do padrão.");
        return false;
      }
      if (dados.formaPagamentoPadrao == "NÃO SE APLICA") {
        setMessage("Por favor, preencha a forma de pagamento do padrão.");
        return false;
      }
      if (dados.valorPadrao == null) {
        setMessage("Por favor, preencha o valor do padrão.");
        return false;
      }
      setMessage("");
      return true;
    } else {
      setMessage("");
      return true;
    }
  }
  function proximaEtapa() {
    if (validarCamposObrigatorios()) {
      avancar();
    }
  }
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        AUMENTO DE CARGA
      </span>
      <div className="flex justify-center">
        <SelectInput
          label={"HAVERÁ TROCA DE PADRÃO?"}
          editable={true}
          options={[
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
            {
              label: "NÃO",
              value: "NÃO",
            },
            {
              label: "SIM",
              value: "SIM",
            },
          ]}
          value={dados.aumentoDeCarga}
          handleChange={(value) =>
            setDados({ ...dados, aumentoDeCarga: value })
          }
        />
      </div>
      {dados.aumentoDeCarga == "SIM" && (
        <div className="flex gap-2 justify-around flex-wrap mt-2">
          <SelectInput
            label={"CAIXA CONJUGADA?"}
            editable={true}
            options={[
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
              {
                label: "NÃO",
                value: "NÃO",
              },
              {
                label: "SIM",
                value: "SIM",
              },
            ]}
            value={dados.caixaConjugada}
            handleChange={(value) =>
              setDados({ ...dados, caixaConjugada: value })
            }
          />
          <SelectInput
            label={"TIPO DO PADRÃO"}
            editable={true}
            value={dados.tipoDePadrao}
            handleChange={(value) =>
              setDados({ ...dados, tipoDePadrao: value })
            }
            options={[
              {
                label: "MONO 40A",
                value: "MONO 40A",
              },
              {
                label: "MONO 63A",
                value: "MONO 63A",
              },
              {
                label: "BIFASICO 63A",
                value: "BIFASICO 63A",
              },
              {
                label: "BIFASICO 100A",
                value: "BIFASICO 100A",
              },
              {
                label: "BIFASICO 125A",
                value: "BIFASICO 125A",
              },
              {
                label: "BIFASICO 150A",
                value: "BIFASICO 150A",
              },
              {
                label: "BIFASICO 200A",
                value: "BIFASICO 200A",
              },
              {
                label: "TRIFASICO 63A",
                value: "TRIFASICO 63A",
              },
              {
                label: "TRIFASICO 100A",
                value: "TRIFASICO 100A",
              },
              {
                label: "TRIFASICO 125A",
                value: "TRIFASICO 125A",
              },
              {
                label: "TRIFASICO 150A",
                value: "TRIFASICO 150A",
              },
              {
                label: "TRIFASICO 200A",
                value: "TRIFASICO 200A",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
            ]}
          />
          <SelectInput
            label={"HAVERÁ AUMENTO DO DISJUNTOR?"}
            editable={true}
            value={dados.aumentoDisjuntor}
            handleChange={(value) =>
              setDados({ ...dados, aumentoDisjuntor: value })
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
            label={"RESPONSÁVEL PELA TROCA"}
            editable={true}
            value={dados.respTrocaPadrao}
            handleChange={(value) =>
              setDados({ ...dados, respTrocaPadrao: value })
            }
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
          />
          <SelectInput
            label={"PAGAMENTO DO PADRÃO"}
            editable={true}
            value={
              dados.formaPagamentoPadrao
                ? dados.formaPagamentoPadrao
                : "NÃO HAVERA TROCA PADRÃO"
            }
            options={[
              {
                label: "CLIENTE IRÁ COMPRAR EM SEPARADO",
                value: "CLIENTE IRÁ COMPRAR EM SEPARADO",
              },
              {
                label: "CLIENTE PAGAR POR FORA",
                value: "CLIENTE PAGAR POR FORA",
              },
              {
                label: "INCLUSO NO CONTRATO",
                value: "INCLUSO NO CONTRATO",
              },
              {
                label: "NÃO HAVERA TROCA PADRÃO",
                value: "NÃO HAVERA TROCA PADRÃO",
              },
            ]}
            handleChange={(value) => {
              setDados({ ...dados, formaPagamentoPadrao: value });
            }}
          />
          <NumberInput
            label={"VALOR DO PADRÃO"}
            editable={true}
            value={dados.valorPadrao}
            handleChange={(value) =>
              setDados({ ...dados, valorPadrao: Number(value) })
            }
          />
        </div>
      )}
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

export default FormSolicitacaoSete;
