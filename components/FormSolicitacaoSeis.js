import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";
function FormSolicitacaoSeis({ avancar, setDados, dados }) {
  const [message, setMessage] = useState("");
  function validarCamposObrigatorios() {
    if (dados.possuiOeM == "SIM" && dados.planoOeM == "NÃO SE APLICA") {
      setMessage("Por favor, selecione uma opção de plano de O&M.");
      return false;
    }
    if (
      dados.clienteSegurado == "SIM" &&
      dados.tempoSegurado == "NÃO SE APLICA"
    ) {
      setMessage("Por favor, selecione um tempo de seguro.");
      return false;
    }
    if (
      (dados.possuiOeM == "SIM" || dados.clienteSegurado == "SIM") &&
      dados.formaPagamentoOeMOuSeguro == "NÃO SE APLICA"
    ) {
      setMessage("Por favor, preencha uma opção válida de forma de pagamento");
      return false;
    }
    if (
      (dados.possuiOeM == "SIM" || dados.clienteSegurado == "SIM") &&
      (dados.valorOeMOuSeguro == null || dados.valorOeMOuSeguro == 0)
    ) {
      setMessage("Por favor, preencha o valor do O&M+Seguro");
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
        O&M E SEGURO
      </span>
      <div className="flex gap-2 justify-around flex-wrap">
        <SelectInput
          label={"KIT COM O&M ?"}
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
          value={dados.possuiOeM}
          handleChange={(value) => setDados({ ...dados, possuiOeM: value })}
        />
        {dados.possuiOeM == "SIM" && (
          <>
            <SelectInput
              label={"QUAL PLANO DE O&M?"}
              editable={true}
              options={[
                {
                  label: "MANUTENÇÃO SIMLES",
                  value: "MANUTENÇÃO SIMLES",
                },
                {
                  label: "PLANO SOL",
                  value: "PLANO SOL",
                },
                {
                  label: "PLANO SOL +",
                  value: "PLANO SOL +",
                },
                {
                  label: "NÃO SE ALICA",
                  value: "NÃO SE ALICA",
                },
              ]}
              value={dados.planoOeM}
              handleChange={(value) => setDados({ ...dados, planoOeM: value })}
            />
          </>
        )}
      </div>
      <div className="flex gap-2 justify-around flex-wrap mt-2">
        <SelectInput
          label={"CLIENTE SEGURADO?"}
          editable={true}
          options={[
            {
              label: "SIM",
              value: "SIM",
            },
            {
              label: "NÃO",
              value: "NÃO",
            },
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
          value={dados.clienteSegurado}
          handleChange={(value) =>
            setDados({ ...dados, clienteSegurado: value })
          }
        />
        {dados.clienteSegurado == "SIM" && (
          <>
            <SelectInput
              label={"TEMPO SEGURADO"}
              editable={true}
              options={[
                {
                  label: "1 ANO",
                  value: "1 ANO",
                },
                {
                  label: "2 ANOS",
                  value: "2 ANOS",
                },
                {
                  label: "3 ANOS",
                  value: "3 ANOS",
                },
                {
                  label: "4 ANOS",
                  value: "4 ANOS",
                },
                {
                  label: "5 ANOS",
                  value: "5 ANOS",
                },
                {
                  label: "NÃO SE APLICA",
                  value: "NÃO SE APLICA",
                },
              ]}
              value={dados.tempoSegurado}
              handleChange={(value) =>
                setDados({ ...dados, tempoSegurado: value })
              }
            />
          </>
        )}
      </div>
      {(dados.possuiOeM == "SIM" || dados.clienteSegurado == "SIM") && (
        <div className="flex gap-2 justify-around flex-wrap mt-2">
          <SelectInput
            label={"FORMA de PAGAMENTO"}
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
            ]}
            value={dados.formaPagamentoOeMOuSeguro}
            handleChange={(value) =>
              setDados({ ...dados, formaPagamentoOeMOuSeguro: value })
            }
          />
          <NumberInput
            label={"VALOR O&M+SEGURO"}
            editable={true}
            value={dados.valorOeMOuSeguro}
            handleChange={(value) =>
              setDados({ ...dados, valorOeMOuSeguro: Number(value) })
            }
          />
        </div>
      )}
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

export default FormSolicitacaoSeis;
