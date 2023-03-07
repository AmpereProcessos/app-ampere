import React from "react";
import { tiposDeEstruturas } from "../../utils/constants";
import DateInput from "../DateInput";
import NumberInput from "../NumberInput";
import SelectInput from "../SelectInput";

function InfoEstruturaBlock({
  comercialEdition,
  technicalEdition,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  project,
  showPaymentInfo = true,
}) {
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        ESTRUTURA PERSONALIZADA
      </span>
      <div className="flex gap-2 justify-center flex-wrap">
        <div>
          <input
            disabled={!comercialEdition && !technicalEdition}
            checked={
              infoHolder.estruturaPersonalizada?.aplicavel === "SIM"
                ? true
                : false
            }
            onChange={(e) => {
              setChanges({
                ...changes,
                "estruturaPersonalizada.aplicavel": e.target.checked
                  ? "SIM"
                  : "NÃO",
                "estruturaPersonalizada.status": e.target.checked
                  ? project?.estruturaPersonalizada.status != "PRONTA"
                    ? "PENDÊNCIA"
                    : project?.estruturaPersonalizada.status
                  : "N/A",
              });
              setInfo({
                ...infoHolder,
                estruturaPersonalizada: {
                  ...infoHolder.estruturaPersonalizada,
                  aplicavel: e.target.checked ? "SIM" : "NÃO",
                  status: e.target.checked
                    ? project?.estruturaPersonalizada.status != "PRONTA"
                      ? "PENDÊNCIA"
                      : project?.estruturaPersonalizada.status
                    : "N/A",
                },
              });
            }}
            type="checkbox"
            name="visitaTecnica"
            id="visitaTecnica"
          />
          <label className="ml-2" htmlFor="visitaTecnica">
            APLICÁVEL
          </label>
        </div>
        <SelectInput
          label={"Tipo da estrutura"}
          editable={comercialEdition || technicalEdition}
          value={
            infoHolder.estruturaPersonalizada?.tipo
              ? infoHolder.estruturaPersonalizada?.tipo
              : "N/A"
          }
          options={tiposDeEstruturas.map((tipo) => tipo)}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "estruturaPersonalizada.tipo": value,
            });
            setInfo({
              ...infoHolder,
              estruturaPersonalizada: {
                ...infoHolder.estruturaPersonalizada,
                tipo: value,
              },
            });
          }}
        />
        {showPaymentInfo && (
          <>
            <SelectInput
              label={"PAGAMENTO DA ESTRUTURA"}
              editable={comercialEdition}
              value={
                infoHolder.estruturaPersonalizada?.respPagamento
                  ? infoHolder.estruturaPersonalizada?.respPagamento
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
                  "estruturaPersonalizada.respPagamento": value,
                });
                setInfo({
                  ...infoHolder,
                  estruturaPersonalizada: {
                    ...infoHolder.estruturaPersonalizada,
                    respPagamento: value,
                  },
                });
              }}
            />
            <NumberInput
              tag={"R$"}
              label={"Valor da estrutura"}
              editable={comercialEdition}
              value={
                infoHolder.estruturaPersonalizada?.valor == "-" ||
                infoHolder.estruturaPersonalizada?.valor == undefined
                  ? 0
                  : infoHolder.estruturaPersonalizada?.valor
              }
              handleChange={(value) => {
                setChanges({
                  ...changes,
                  "estruturaPersonalizada.valor": Number(value),
                });
                setInfo({
                  ...infoHolder,
                  estruturaPersonalizada: {
                    ...infoHolder.estruturaPersonalizada,
                    valor: Number(value),
                  },
                });
              }}
            />
          </>
        )}
        <SelectInput
          label={"STATUS DA ENTREGA DA ESTRUTURA"}
          editable={comercialEdition}
          value={
            infoHolder.estruturaPersonalizada.statusEntrega
              ? infoHolder.estruturaPersonalizada?.statusEntrega
              : "NÃO DEFINIDO"
          }
          options={[
            {
              label: "AGUARDANDO COMPRA",
              value: "AGUARDANDO COMPRA",
            },
            {
              label: "EM ROTA",
              value: "EM ROTA",
            },
            {
              label: "ENTREGUE",
              value: "ENTREGUE",
            },
            {
              label: "CANCELADO",
              value: "CANCELADO",
            },
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "estruturaPersonalizada.statusEntrega": value,
            });
            setInfo({
              ...infoHolder,
              estruturaPersonalizada: {
                ...infoHolder.estruturaPersonalizada,
                statusEntrega: value,
              },
            });
          }}
        />
        <DateInput
          label={"DATA DE ENTREGA DA ESTRUTURA"}
          editable={comercialEdition}
          value={
            infoHolder.estruturaPersonalizada?.dataEntrega != undefined &&
            infoHolder.estruturaPersonalizada.dataEntrega != "-"
              ? new Date(infoHolder.estruturaPersonalizada.dataEntrega)
                  .toISOString()
                  .slice(0, 10)
              : null
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "estruturaPersonalizada.dataEntrega": isNaN(value)
                ? new Date(value).toISOString()
                : null,
            });
            setInfo({
              ...infoHolder,
              estruturaPersonalizada: {
                ...infoHolder.estruturaPersonalizada,
                dataEntrega: isNaN(value)
                  ? new Date(value).toISOString()
                  : null,
              },
            });
          }}
        />
        {infoHolder.estruturaPersonalizada?.aplicavel == "SIM" && (
          <SelectInput
            label={"STATUS da estrutura personalizada"}
            editable={technicalEdition}
            value={
              infoHolder.estruturaPersonalizada.aplicavel
                ? infoHolder.estruturaPersonalizada.status
                  ? infoHolder.estruturaPersonalizada.status
                  : "N/A"
                : "N/A"
            }
            options={[
              { label: "PRONTA", value: "PRONTA" },
              { label: "PENDÊNCIA", value: "PENDÊNCIA" },
              { label: "N/A", value: "N/A" },
            ]}
            handleChange={(value) => {
              setChanges({
                ...changes,
                "estruturaPersonalizada.status": value,
              });
              setInfo({
                ...infoHolder,
                estruturaPersonalizada: {
                  ...infoHolder.estruturaPersonalizada,
                  status: value,
                },
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

export default InfoEstruturaBlock;
