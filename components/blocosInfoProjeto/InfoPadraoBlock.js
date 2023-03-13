import React from "react";
import NumberInput from "../NumberInput";
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";

function InfoPadraoBlock({
  comercialEdition,
  technicalEdition,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  showPaymentInfo = true,
  showPaymentOnly = false,
}) {
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        PADRÃO
      </span>
      <div className="flex gap-2 w-full justify-center flex-wrap pb-2">
        {!showPaymentOnly ? (
          <SelectInput
            label={"AUMENTO DE CARGA"}
            editable={comercialEdition}
            value={
              infoHolder.projeto.aumentoDeCarga
                ? infoHolder.projeto.aumentoDeCarga
                : "NÃO DEFINIDO"
            }
            options={[
              { label: "SIM", value: "SIM" },
              { label: "NÃO", value: "NÃO" },
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            ]}
            handleChange={(value) => {
              setChanges({
                ...changes,
                "projeto.aumentoDeCarga": value,
                "projeto.acStatus":
                  value == "SIM" && infoHolder.acStatus != "REALIZADO"
                    ? "PENDÊNCIA"
                    : undefined,
              });
              setInfo({
                ...infoHolder,
                projeto: {
                  ...infoHolder.projeto,
                  aumentoDeCarga: value,
                  acStatus:
                    value == "SIM" && infoHolder.acStatus != "REALIZADO"
                      ? "PENDÊNCIA"
                      : undefined,
                },
              });
            }}
          />
        ) : null}

        {infoHolder.projeto.aumentoDeCarga == "SIM" && !showPaymentOnly ? (
          <SelectInput
            label={"STATUS AUMENTO DE CARGA"}
            editable={technicalEdition}
            value={
              infoHolder.projeto.acStatus
                ? infoHolder.projeto.acStatus
                : "NÃO DEFINIDO"
            }
            options={[
              {
                label: "PENDÊNCIA",
                value: "PENDÊNCIA",
              },
              {
                label: "REALIZADO",
                value: "REALIZADO",
              },
              {
                label: "SOLICITADO COM G.D",
                value: "SOLICITADO COM G.D",
              },
            ]}
            handleChange={(value) => {
              setChanges({
                ...changes,
                "projeto.acStatus": value,
              });
              setInfo({
                ...infoHolder,
                projeto: {
                  ...infoHolder.projeto,
                  acStatus: value,
                },
              });
            }}
          />
        ) : null}
        {showPaymentInfo ? (
          <>
            <SelectInput
              label={"PAGAMENTO DO PADRÃO"}
              editable={comercialEdition}
              value={
                infoHolder.padrao?.respPagamento ==
                  "NÃO HAVERA TROCA DE PADRÃO" ||
                infoHolder.padrao?.respPagamento == undefined
                  ? "NÃO HAVERA TROCA PADRÃO"
                  : infoHolder.padrao?.respPagamento
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
                setChanges({
                  ...changes,
                  "padrao.respPagamento": value,
                });
                setInfo({
                  ...infoHolder,
                  padrao: { ...infoHolder.padrao, respPagamento: value },
                });
              }}
            />
            <NumberInput
              tag={"R$"}
              label={"Valor do padrão"}
              editable={comercialEdition}
              value={infoHolder.padrao.valor ? infoHolder.padrao.valor : 0}
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  "padrao.valor": Number(value),
                });
                setInfo({
                  ...infoHolder,
                  padrao: { ...infoHolder.padrao, valor: Number(value) },
                });
              }}
            />
          </>
        ) : null}

        <SelectInput
          label={"RESPONSÁVEL INSTALAÇÃO DO PADRÃO"}
          editable={comercialEdition || technicalEdition}
          value={
            infoHolder.padrao?.respInstalacao
              ? infoHolder.padrao?.respInstalacao
              : "NÃO SE APLICA"
          }
          options={[
            { label: "AMPERE", value: "AMPERE" },
            { label: "CLIENTE", value: "CLIENTE" },
            { label: "NÃO SE APLICA", value: "NÃO SE APLICA" },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "padrao.respInstalacao": value,
            });
            setInfo({
              ...infoHolder,
              padrao: { ...infoHolder.padrao, respInstalacao: value },
            });
          }}
        />
        {!showPaymentOnly ? (
          <TextInput
            label={"Amperagem"}
            editable={technicalEdition}
            value={
              infoHolder.visitaTecnica?.amperagem
                ? infoHolder.visitaTecnica.amperagem
                : ""
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                "visitaTecnica.amperagem": value,
              });
              setInfo({
                ...infoHolder,
                visitaTecnica: {
                  ...infoHolder.visitaTecnica,
                  amperagem: value,
                },
              });
            }}
          />
        ) : null}
      </div>
      {!showPaymentOnly ? (
        <div className="flex gap-2 justify-center flex-wrap pt-2 border-t border-gray-200">
          <SelectInput
            label={"TIPO DO PADRÃO"}
            editable={technicalEdition}
            value={
              infoHolder.padrao.tipo != undefined
                ? infoHolder.padrao.tipo
                : "N/A"
            }
            options={[
              {
                label: "CONTRA A REDE",
                value: "CONTRA A REDE",
              },
              {
                label: "A FAVOR DA REDE",
                value: "A FAVOR DA REDE",
              },
              {
                label: "CONSTRUIR",
                value: "CONSTRUIR",
              },
              {
                label: "SUBESTAÇÃO",
                value: "SUBESTAÇÃO",
              },
              {
                label: "REFORMA DE PADRÃO",
                value: "REFORMA DE PADRÃO",
              },
              {
                label: "N/A",
                value: "N/A",
              },
            ]}
            handleChange={(value) => {
              setChanges({
                ...changes,
                "padrao.tipo": value,
              });
              setInfo({
                ...infoHolder,
                padrao: { ...infoHolder.padrao, tipo: value },
              });
            }}
          />
          <SelectInput
            label={"TIPO DE ENTRADA"}
            value={
              infoHolder.padrao.tipoEntrada
                ? infoHolder.padrao.tipoEntrada
                : "NÃO DEFINIDO"
            }
            editable={technicalEdition}
            options={[
              {
                label: "AÉREA",
                value: "AÉREA",
              },
              {
                label: "SUBTERRÂNEO",
                value: "SUBTERRÂNEO",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
            ]}
            handleChange={(value) => {
              setChanges({ ...changes, "padrao.tipoEntrada": value });
              setInfo({
                ...infoHolder,
                padrao: {
                  ...infoHolder.padrao,
                  tipoEntrada: value,
                },
              });
            }}
          />
          <SelectInput
            label={"Saída do cliente"}
            editable={technicalEdition}
            value={
              infoHolder.visitaTecnica.saidaDoCliente
                ? infoHolder.visitaTecnica.saidaDoCliente
                : "N/A"
            }
            options={[
              { label: "SUBTERRANEO", value: "SUBTERRANEO" },
              { label: "AEREO", value: "AEREO" },
              { label: "N/A", value: "N/A" },
            ]}
            handleChange={(value) => {
              setChanges({
                ...changes,
                "visitaTecnica.saidaDoCliente": value,
              });
              setInfo({
                ...infoHolder,
                visitaTecnica: {
                  ...infoHolder.visitaTecnica,
                  saidaDoCliente: value,
                },
              });
            }}
          />
          <div className="flex flex-col w-[350px] items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              CAIXA CONJUGADA
            </span>
            <div className="flex">
              <input
                disabled={!comercialEdition}
                checked={
                  infoHolder.padrao.caixaConjugada == "SIM" ? true : false
                }
                onChange={(e) => {
                  setChanges({
                    ...changes,
                    "padrao.caixaConjugada": e.target.checked ? "SIM" : "NÃO",
                  });
                  setInfo({
                    ...infoHolder,
                    padrao: {
                      ...infoHolder.padrao,
                      caixaConjugada: e.target.checked ? "SIM" : "NÃO",
                    },
                  });
                }}
                type="checkbox"
                name="caixaConjugada"
                id="caixaConjugada"
              />
              <label className="ml-2" htmlFor="caixaConjugada">
                SIM ?
              </label>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default InfoPadraoBlock;
