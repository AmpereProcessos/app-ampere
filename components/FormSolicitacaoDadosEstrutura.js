import React, { useState } from "react";
import SelectFloatingInput from "./SelectFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";

function FormSolicitacaoDadosEstrutura({ avancar, setDados, dados, voltar }) {
  const [message, setMessage] = useState("");
  function validarCamposObrigatorios() {
    if (dados.tipoEstrutura == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha o tipo da estrutura");
      return false;
    }

    if (
      dados.tipoDeServico == "OPERAÇÃO E MANUTENÇÃO" &&
      (!dados.materialEstrutura || dados.materialEstrutura == "NÃO DEFINIDO")
    ) {
      setMessage("Por favor, preencha sobre o material da estrutura.");
      return false;
    }
    if (dados.tipoDeServico != "OPERAÇÃO E MANUTENÇÃO") {
      if (dados.estruturaAmpere == "NÃO DEFINIDO") {
        setMessage(
          "Por favor, preencha sobre a necessidade de adequações ou construção de estrutura."
        );
        return false;
      }
      if (
        dados.estruturaAmpere == "SIM" &&
        dados.responsavelEstrutura == "NÃO SE APLICA"
      ) {
        setMessage("Por favor, preencha o responsável pela estrutura.");
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
        dados.responsavelEstrutura != "AMPERE" &&
        dados.estruturaAmpere == "SIM" &&
        (dados.valorEstrutura == null || dados.valorEstrutura == 0)
      ) {
        setMessage("Por favor, preencha o valor da estrutura");
        return false;
      }
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
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 p-2">
        <div className="flex items-center justify-center col-span-3">
          <SelectFloatingInput
            width={"450px"}
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
            handleChange={(value) =>
              setDados({ ...dados, tipoEstrutura: value })
            }
          />
        </div>
        {dados.tipoDeServico != "OPERAÇÃO E MANUTENÇÃO" ? (
          <div className="flex items-center justify-center col-span-3">
            <SelectFloatingInput
              label={"ADEQUAÇÃO OU CONSTRUÇÃO DE ESTRUTURA ?"}
              width={"450px"}
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
          </div>
        ) : null}

        <div className="flex items-center justify-center col-span-3">
          <SelectFloatingInput
            label={"MATERIAL DA ESTRUTURA"}
            width={"450px"}
            editable={true}
            options={[
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              { label: "MADEIRA", value: "MADEIRA" },
              { label: "FERRO", value: "FERRO" },
            ]}
            value={
              dados.materialEstrutura ? dados.materialEstrutura : "NÃO DEFINIDO"
            }
            handleChange={(value) =>
              setDados({ ...dados, materialEstrutura: value })
            }
          />
        </div>
        {dados.tipoDeServico != "OPERAÇÃO E MANUTENÇÃO" ? (
          <div className="flex items-center justify-center col-span-3">
            <SelectFloatingInput
              width={"450px"}
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
          </div>
        ) : null}

        {dados.responsavelEstrutura != "NÃO SE APLICA" && (
          <>
            <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
              PAGAMENTO DA ESTRUTURA
            </h1>
            <div className="flex items-center justify-center col-span-3 gap-2 flex-wrap">
              <SelectFloatingInput
                width={"450px"}
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
              <NumberFloatingInput
                width={"450px"}
                label={"VALOR DA ESTRUTURA"}
                editable={true}
                value={dados.valorEstrutura}
                handleChange={(value) =>
                  setDados({ ...dados, valorEstrutura: Number(value) })
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

export default FormSolicitacaoDadosEstrutura;
