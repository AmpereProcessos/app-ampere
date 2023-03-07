import React, { useState } from "react";
import TextInput from "./TextInput";
import SelectFloatingInput from "./SelectFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";
function FormSolicitacaoOeMeSeguro({ avancar, setDados, dados, voltar }) {
  const [message, setMessage] = useState("");

  function validarCamposObrigatorios() {
    if (
      dados.tipoDeServico == "OPERAÇÃO E MANUTENÇÃO" &&
      dados.possuiOeM != "SIM"
    ) {
      setMessage("Por favor, preencha informações sobre o plano de O&M.");
      return false;
    }
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
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 p-2">
        <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
          O&M
        </h1>
        <div className="flex items-center col-span-3 justify-center flex-wrap gap-2">
          <SelectFloatingInput
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
              <SelectFloatingInput
                label={"QUAL PLANO DE O&M?"}
                editable={true}
                options={[
                  {
                    label: "MANUTENÇÃO SIMPLES",
                    value: "MANUTENÇÃO SIMPLES",
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
                    label: "NÃO SE APLICA",
                    value: "NÃO SE APLICA",
                  },
                ]}
                value={dados.planoOeM}
                handleChange={(value) =>
                  setDados({ ...dados, planoOeM: value })
                }
              />
            </>
          )}
        </div>
        <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
          SEGURO
        </h1>
        <div className="flex items-center justify-center gap-2 col-span-3 flex-wrap">
          <SelectFloatingInput
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
              <SelectFloatingInput
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
          <>
            <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
              PAGAMENTO
            </h1>
            <div className="flex items-center justify-center gap-2 col-span-3 flex-wrap">
              <SelectFloatingInput
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
              <NumberFloatingInput
                label={"VALOR O&M+SEGURO (se não incluso)"}
                editable={true}
                value={dados.valorOeMOuSeguro}
                handleChange={(value) =>
                  setDados({ ...dados, valorOeMOuSeguro: Number(value) })
                }
              />
            </div>
          </>
        )}
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

export default FormSolicitacaoOeMeSeguro;
