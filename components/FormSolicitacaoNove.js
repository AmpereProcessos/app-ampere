import React, { useState } from "react";
import TextFloatingInput from "./TextFloatingInput";
import SelectFloatingInput from "./SelectFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";
import { FiDelete } from "react-icons/fi";
function FormSolicitacaoNove({ dados, setDados, avancar, voltar }) {
  const [message, setMessage] = useState("");
  const [dadosDistribuicao, setDadosDistribuicao] = useState({
    numInstalacao: "",
    excedente: null,
  });
  function adicionarDistribuicao() {
    setDados({
      ...dados,
      distribuicoes: [
        ...dados.distribuicoes,
        {
          numInstalacao: dadosDistribuicao.numInstalacao,
          excedente: dadosDistribuicao.excedente,
        },
      ],
    });
    setDadosDistribuicao({ numInstalacao: "", excedente: 0 });
  }
  function validarCamposObrigatorios() {
    if (dados.possuiDistribuicao == "SIM") {
      if (dados.distribuicoes.length <= 0) {
        setMessage("Por favor, especifique a distribuição.");
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
        DISTRIBUIÇÃO DE CRÉDITOS
      </span>
      <div className="flex justify-center mt-2">
        <SelectFloatingInput
          label={"POSSUI DISTRIBUIÇÕES DE CRÉDITOS?"}
          value={dados.possuiDistribuicao}
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
          handleChange={(value) =>
            setDados({ ...dados, possuiDistribuicao: value })
          }
        />
      </div>
      {dados.possuiDistribuicao == "SIM" && (
        <>
          <div className="flex flex-col gap-2 mt-2">
            <h1 className="text-center font-bold font-raleway">
              ADICIONAR DISTRIBUIÇÃO:
            </h1>
            <div className="flex flex-col lg:flex-row items-center justify-around">
              <TextFloatingInput
                label={"Nº DA INSTALAÇÃO"}
                editable={true}
                value={dadosDistribuicao.numInstalacao}
                handleChange={(value) =>
                  setDadosDistribuicao({
                    ...dadosDistribuicao,
                    numInstalacao: value,
                  })
                }
              />
              <NumberFloatingInput
                label={"% EXCEDENTE"}
                editable={true}
                value={dadosDistribuicao.excedente}
                handleChange={(value) =>
                  setDadosDistribuicao({
                    ...dadosDistribuicao,
                    excedente: Number(value),
                  })
                }
                unit={"%"}
              />
              <button
                onClick={adicionarDistribuicao}
                className="p-1 rounded bg-[#fead61] hover:bg-[#15599a] hover:text-white font-bold"
              >
                ADICIONAR
              </button>
            </div>
          </div>
          {dados.distribuicoes.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              {dados.distribuicoes.map((distribuicao, index) => (
                <div key={index} className="flex justify-around flex-wrap">
                  <p className="text-sm font-bold text-gray-600">
                    INSTALAÇÃO Nº{distribuicao.numInstalacao}
                  </p>
                  <p className="text-sm font-bold text-gray-600">
                    {distribuicao.excedente}%
                  </p>
                  <button
                    onClick={() => {
                      let distribuicoes = dados.distribuicoes;
                      distribuicoes.splice(index, 1);
                      setDados({ ...dados, distribuicoes: distribuicoes });
                    }}
                    className="bg-red-500 p-1 rounded"
                  >
                    <FiDelete />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
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

export default FormSolicitacaoNove;
