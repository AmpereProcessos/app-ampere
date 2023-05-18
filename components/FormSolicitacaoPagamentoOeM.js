import React, { useState } from "react";
import SelectFloatingInput from "./SelectFloatingInput";
import TextFloatingInput from "./TextFloatingInput";
import NumberFloatingInput from "./NumberFloatingInput";
import { credores } from "../utils/constants";

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

function FormSolicitacaoPagamentoOeM({ dados, setDados, avancar, voltar }) {
  const [message, setMessage] = useState("");
  const [idemContrato, setIdemContrato] = useState("NÂO");
  function getIdemContrato() {
    setIdemContrato("SIM");
    setDados({
      ...dados,
      nomePagador: dados.nomeDoContrato,
      contatoPagador: dados.telefone,
      cpf_cnpjNF: dados.cpf_cnpj,
    });
  }
  function validateCamposObrigatorios() {
    if (!dados.planoOeM || dados.planoOeM == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha o plano de operação e manutenção.");
      return false;
    }
    if (dados.nomePagador?.trim().length < 5) {
      setMessage("Por favor, preencha o nome do pagador.");
      return false;
    }
    if (dados.contatoPagador?.trim().length < 8) {
      setMessage("Por favor, preencha o contato do pagador.");
      return false;
    }
    if (!dados.valorContrato || dados.valorContrato == 0) {
      setMessage("Por favor, preencha um valor válido pro contrato.");
      return false;
    }
    if (!dados.origemRecurso || dados.origemRecurso == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha a origem do recurso");
      return false;
    }
    if (!dados.formaDePagamento || dados.formaDePagamento == "NÃO DEFINIDO") {
      setMessage("Por favor, preencha a forma de pagamento.");
      return false;
    }
    setMessage("");
    return true;
  }
  function proximaEtapa() {
    if (validateCamposObrigatorios()) {
      avancar();
    }
  }
  return (
    <div className="w-full flex flex-col border border-[#15599a] pb-2 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        DADOS DO OEM E PAGAMENTO
      </span>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 mt-2 p-2">
        <div className="flex justify-center items-center col-span-3">
          <SelectFloatingInput
            label={"PLANO/SERVIÇO"}
            editable={true}
            value={dados.planoOeM}
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
            handleChange={(value) => setDados({ ...dados, planoOeM: value })}
          />
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 mt-2 p-2 col-span-3">
          <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
            DADOS DO PAGADOR
          </h1>
          <div className="flex items-center justify-center col-span-3 mt-2">
            <SelectFloatingInput
              width={"450px"}
              label={"IDEM CONTRATO?"}
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
              value={idemContrato}
              handleChange={(value) => {
                if (value == "SIM") {
                  getIdemContrato();
                } else setIdemContrato(value);
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={"450px"}
              label={"NOME DO PAGADOR"}
              editable={true}
              value={dados.nomePagador}
              handleChange={(value) =>
                setDados({ ...dados, nomePagador: value })
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={"450px"}
              label={"CONTATO DO PAGADOR"}
              editable={true}
              value={dados.contatoPagador}
              handleChange={(value) =>
                setDados({ ...dados, contatoPagador: phoneMask(value) })
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <TextFloatingInput
              width={"450px"}
              label={"CPF/CNPJ PARA NF (em caso de emissão)"}
              editable={true}
              value={dados.cpf_cnpjNF}
              handleChange={(value) =>
                setDados({ ...dados, cpf_cnpjNF: formatCnpjCpf(value) })
              }
            />
          </div>
        </div>
        <h1 className="text-[#fead61] col-span-3 text-center font-bold py-2">
          DADOS DO PAGAMENTO
        </h1>
        <div className="flex items-center justify-center col-span-3 gap-2 flex-wrap">
          <NumberFloatingInput
            width={"450px"}
            label={"VALOR DO CONTRATO(SEM CUSTOS ADICIONAIS)"}
            editable={true}
            tag={"R$"}
            value={dados.valorContrato}
            handleChange={(value) =>
              setDados({ ...dados, valorContrato: Number(value) })
            }
          />
          <SelectFloatingInput
            width={"450px"}
            label={"ORIGEM DO RECURSO"}
            editable={true}
            value={dados.origemRecurso}
            handleChange={(value) =>
              setDados({ ...dados, origemRecurso: value })
            }
            options={[
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
              {
                label: "FINANCIAMENTO",
                value: "FINANCIAMENTO",
              },
              {
                label: "CAPITAL PRÓPRIO",
                value: "CAPITAL PRÓPRIO",
              },
            ]}
          />
        </div>
        {dados.origemRecurso == "FINANCIAMENTO" && (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 mt-2 col-span-3">
            <div className="flex items-center justify-center">
              <SelectFloatingInput
                width={"450px"}
                label={"CREDOR"}
                editable={true}
                options={credores.map((credor) => credor)}
                value={dados.credor}
                handleChange={(value) => setDados({ ...dados, credor: value })}
              />
            </div>
            <div className="flex items-center justify-center">
              <TextFloatingInput
                width={"450px"}
                label={"NOME DO GERENTE"}
                editable={true}
                value={dados.nomeGerente}
                handleChange={(value) =>
                  setDados({ ...dados, nomeGerente: value })
                }
              />
            </div>
            <div className="flex items-center justify-center">
              <TextFloatingInput
                width={"450px"}
                label={"CONTATO DO GERENTE"}
                editable={true}
                value={dados.contatoGerente}
                handleChange={(value) =>
                  setDados({ ...dados, contatoGerente: phoneMask(value) })
                }
              />
            </div>
          </div>
        )}
        <div className="flex items-center justify-center col-span-3 gap-2 flex-wrap">
          <NumberFloatingInput
            width={"450px"}
            label={"SE CARTÃO OU CHEQUE, QUANTAS PARCELAS?"}
            editable={true}
            value={dados.numParcelas}
            handleChange={(value) =>
              setDados({
                ...dados,
                numParcelas: Number(value),
                valorParcela: dados.valorContrato / Number(value),
              })
            }
          />
          <NumberFloatingInput
            width={"450px"}
            label={"VALOR DA PARCELA"}
            editable={true}
            value={dados.valorParcela}
            tag={"R$"}
            handleChange={(value) =>
              setDados({ ...dados, valorParcela: Number(value) })
            }
          />
        </div>
        <div className="flex items-center justify-center col-span-3">
          <SelectFloatingInput
            width={"450px"}
            label={"FORMA DE PAGAMENTO"}
            editable={true}
            options={
              dados.tipoDeServico == "SISTEMA FOTOVOLTAICO (OFF GRID)" ||
              dados.tipoDeServico == "OPERAÇÃO E MANUTENÇÃO"
                ? [
                    {
                      label:
                        "70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO",
                      value:
                        "70% A VISTA NA ENTRADA + 30% NA FINALIZAÇÃO DA INSTALAÇÃO",
                    },
                    {
                      label: "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                      value: "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                    },
                    {
                      label: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                      value: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]
                : [
                    {
                      label:
                        "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR",
                      value:
                        "70% A VISTA NA ENTRADA + 15% NA FINALIZAÇÃO DA INSTALAÇÃO E 15% APÓS TROCA DO MEDIDOR",
                    },
                    {
                      label: "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                      value: "100% A VISTA ATRAVÉS DE FINANCIAMENTO BANCÁRIO",
                    },
                    {
                      label: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                      value: "NEGOCIAÇÃO DIFERENTE (DESCREVE ABAIXO)",
                    },
                    {
                      label: "NÃO DEFINIDO",
                      value: "NÃO DEFINIDO",
                    },
                  ]
            }
            value={dados.formaDePagamento}
            handleChange={(value) =>
              setDados({ ...dados, formaDePagamento: value })
            }
          />
        </div>
      </div>
      <div className="flex flex-col w-full px-2 self-center mt-2 items-center">
        <span className="uppercase font-bold font-raleway text-center text-sm">
          DESCRIÇÃO DA NEGOCIAÇÃO
        </span>
        <textarea
          placeholder={"Descreva aqui a negociação"}
          value={dados.descricaoNegociacao}
          onChange={(e) =>
            setDados({
              ...dados,
              descricaoNegociacao: e.target.value,
            })
          }
          className="block p-2.5 w-full h-[80px] outline-none resize-none text-center text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

export default FormSolicitacaoPagamentoOeM;
