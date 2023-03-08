import dayjs from "dayjs";
import React from "react";
import DateInput from "../DateInput";
import NumberInput from "../NumberInput";
import SelectInput from "../SelectInput";

function InfoContratoBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  showPaymentInfo = false,
  minimalInfo = false,
}) {
  console.log(changes);
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        CONTRATO
      </span>
      <div className="flex gap-2 justify-center flex-wrap">
        {!minimalInfo && (
          <div className="flex flex-col w-[350px] items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              RELATÓRIO DE COMISSIONAMENTO
            </span>
            <div className="flex">
              <input
                disabled={!editor}
                checked={infoHolder.comissionamento?.comercial ? true : false}
                onChange={(e) => {
                  setChanges({
                    ...changes,
                    "comissionamento.comercial": e.target.checked,
                  });
                  setInfo({
                    ...infoHolder,
                    comissionamento: {
                      ...infoHolder.comissionamento,
                      comercial: e.target.checked,
                    },
                  });
                }}
                type="checkbox"
                name="comissionamentoComercial"
                id="comissionamentoComercial"
              />
              <label className="ml-2" htmlFor="comissionamentoComercial">
                OK
              </label>
            </div>
          </div>
        )}
        <SelectInput
          label={"STATUS DO CONTRATO"}
          editable={editor}
          value={
            infoHolder.contrato?.status
              ? infoHolder.contrato?.status
              : "NÃO DEFINIDO"
          }
          options={[
            {
              label: "AGUARDANDO SOLICITAÇÃO",
              value: "AGUARDANDO SOLICITAÇÃO",
            },
            { label: "ASSINADO", value: "ASSINADO" },
            { label: "NÃO ASSINADO", value: "NÃO ASSINADO" },
            {
              label: "RECISÃO DE CONTRATO",
              value: "RECISÃO DE CONTRATO",
            },
            { label: "SOLICITADO", value: "SOLICITADO" },
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "contrato.status": value,
            });
            setInfo({
              ...infoHolder,
              contrato: {
                ...infoHolder.contrato,
                status: value,
              },
            });
          }}
        />
        {!minimalInfo && (
          <DateInput
            label={"Data de solicitação"}
            editable={editor}
            value={
              infoHolder.contrato.dataSolicitacao != undefined &&
              infoHolder.contrato.dataSolicitacao != "-"
                ? new Date(infoHolder.contrato.dataSolicitacao)
                    .toISOString()
                    .slice(0, 10)
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                "contrato.dataSolicitacao": dayjs(value).isValid()
                  ? new Date(value).toISOString()
                  : null,
              });
              setInfo({
                ...infoHolder,
                contrato: {
                  ...infoHolder.contrato,
                  dataSolicitacao: dayjs(value).isValid()
                    ? new Date(value).toISOString()
                    : null,
                },
              });
            }}
          />
        )}
        {!minimalInfo && (
          <DateInput
            label={"Data de liberação p/ assinatura"}
            editable={editor}
            value={
              infoHolder.contrato?.dataLiberacao != undefined &&
              infoHolder.contrato?.dataLiberacao != "-"
                ? new Date(infoHolder.contrato.dataLiberacao)
                    .toISOString()
                    .slice(0, 10)
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                "contrato.dataLiberacao": dayjs(value).isValid()
                  ? new Date(value).toISOString()
                  : null,
              });
              setInfo({
                ...infoHolder,
                contrato: {
                  ...infoHolder.contrato,
                  dataLiberacao: dayjs(value).isValid()
                    ? new Date(value).toISOString()
                    : null,
                },
              });
            }}
          />
        )}
        <DateInput
          label={"Data de assinatura"}
          editable={editor}
          value={
            infoHolder.contrato?.dataAssinatura != undefined &&
            infoHolder.contrato?.dataAssinatura != "-"
              ? new Date(infoHolder.contrato.dataAssinatura)
                  .toISOString()
                  .slice(0, 10)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "contrato.dataAssinatura": dayjs(value).isValid()
                ? new Date(value).toISOString()
                : null,
            });
            setInfo({
              ...infoHolder,
              contrato: {
                ...infoHolder.contrato,
                dataAssinatura: dayjs(value).isValid()
                  ? new Date(value).toISOString()
                  : null,
              },
            });
          }}
        />
        {!minimalInfo && (
          <SelectInput
            label={"FORMA DE ASSINATURA"}
            value={
              infoHolder.contrato?.formaAssinatura
                ? infoHolder.contrato?.formaAssinatura
                : "NÃO DEFINIDO"
            }
            editable={editor}
            options={[
              {
                label: "FISICO",
                value: "FISICO",
              },
              {
                label: "DIGITAL",
                value: "DIGITAL",
              },
              {
                label: "NÃO DEFINIDO",
                value: "NÃO DEFINIDO",
              },
            ]}
            handleChange={(value) => {
              setChanges({
                ...changes,
                "contrato.formaAssinatura": value,
              });
              setInfo({
                ...infoHolder,
                contrato: {
                  ...infoHolder.contrato,
                  formaAssinatura: value,
                },
              });
            }}
          />
        )}
        {showPaymentInfo && (
          <NumberInput
            label={"PORCENTAGEM DE COMISSÃO"}
            editable={editor}
            value={
              infoHolder.contrato.comissaoVendedor
                ? infoHolder.contrato.comissaoVendedor
                : null
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                "contrato.comissaoVendedor": Number(value),
              });
              setInfo({
                ...infoHolder,
                contrato: {
                  ...infoHolder.contrato,
                  comissaoVendedor: Number(value),
                },
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

export default InfoContratoBlock;
