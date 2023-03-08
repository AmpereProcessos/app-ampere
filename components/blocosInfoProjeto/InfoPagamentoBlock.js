import React from "react";
import { credores } from "../../utils/constants";
import NumberInput from "../NumberInput";
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";
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
const phoneMask = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};
function InfoPagamentoBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  showADMOnly = false,
}) {
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        PAGAMENTO
      </span>
      <div className="flex gap-2 justify-center flex-wrap">
        {showADMOnly && (
          <div className="w-[350px]">
            <input
              disabled={!editor}
              checked={infoHolder.pagamento?.cobrancaFeita ? true : false}
              onChange={(e) => {
                setChanges({
                  ...changes,
                  "pagamento.cobrancaFeita": e.target.checked,
                });
                setInfo({
                  ...infoHolder,
                  pagamento: {
                    ...infoHolder.pagamento,
                    cobrancaFeita: e.target.checked,
                  },
                });
              }}
              type="checkbox"
              name="cobrancaFeita"
              id="cobrancaFeita"
            />
            <label className="ml-2" htmlFor="cobrancaFeita">
              COBRANÇA REALIZADA ?
            </label>
          </div>
        )}

        {/**
                   * <SelectInput
                    label={"STATUS PAGAMENTO"}
                    value={
                      infoHolder.pagamento.status
                        ? infoHolder.pagamento.status
                        : "NÃO DEFINIDO"
                    }
                    editable={editor}
                    options={[
                      {
                        label: "AGUARDANDO PAGAMENTO",
                        value: "AGUARDANDO PAGAMENTO",
                      },
                      {
                        label: "PAGO",
                        value: "PAGO",
                      },
                      {
                        label: "RESCISÃO",
                        value: "RESCISÃO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "pagamento.status": value,
                      });
                      setInfo({
                        ...infoHolder,
                        pagamento: {
                          ...infoHolder.pagamento,
                          status: value,
                        },
                      });
                    }}
                  />
                  */}
        <SelectInput
          label={"FORMA DE PAGAMENTO"}
          value={
            infoHolder.pagamento?.forma
              ? infoHolder.pagamento?.forma
              : "NÃO DEFINIDO"
          }
          editable={editor}
          options={[
            {
              label: "CAPITAL PROPRIO",
              value: "CAPITAL PROPRIO",
            },
            {
              label: "FINANCIAMENTO",
              value: "FINANCIAMENTO",
            },
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "pagamento.forma": value,
            });
            setInfo({
              ...infoHolder,
              pagamento: {
                ...infoHolder.pagamento,
                forma: value,
              },
            });
          }}
        />
        <SelectInput
          label={"EMPRESA A FATURAR"}
          value={
            infoHolder.faturamento?.empresaFaturamento != undefined &&
            infoHolder.faturamento?.empresaFaturamento != "-"
              ? infoHolder.faturamento?.empresaFaturamento
              : "NÃO DEFINIDO"
          }
          editable={editor}
          options={[
            { label: "AMPERE ENERGIAS", value: "AMPERE ENERGIAS" },
            {
              label: "ANALISE DO FINANCEIRO",
              value: "ANALISE DO FINANCEIRO",
            },
            { label: "IZAIRA SERVIÇOS", value: "IZAIRA SERVIÇOS" },
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "faturamento.empresaFaturamento": value,
            });
            setInfo({
              ...infoHolder,
              faturamento: {
                ...infoHolder.faturamento,
                empresaFaturamento: value,
              },
            });
          }}
        />
        <TextInput
          label={"CNPJ PARA FATURAMENTO"}
          editable={editor}
          value={
            infoHolder.faturamento?.cnpjFaturamento
              ? infoHolder.faturamento.cnpjFaturamento
              : ""
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "faturamento.cnpjFaturamento": formatCnpjCpf(value),
            });
            setInfo({
              ...infoHolder,
              faturamento: {
                ...infoHolder.faturamento,
                cnpjFaturamento: formatCnpjCpf(value),
              },
            });
          }}
        />

        {infoHolder.pagamento?.forma == "FINANCIAMENTO" && (
          <SelectInput
            label={"CREDOR"}
            value={
              infoHolder.pagamento.credor != undefined &&
              infoHolder.pagamento.credor != "-----" &&
              infoHolder.pagamento.credor != "QUAL CREDOR?"
                ? infoHolder.pagamento.credor
                : "NÃO DEFINIDO"
            }
            editable={editor}
            options={credores.map((credor) => credor)}
            handleChange={(value) => {
              setChanges({
                ...changes,
                "pagamento.credor": value,
              });
              setInfo({
                ...infoHolder,
                pagamento: {
                  ...infoHolder.pagamento,
                  credor: value,
                },
              });
            }}
          />
        )}
        <TextInput
          label={"Pagador"}
          editable={editor}
          value={
            infoHolder.pagamento?.pagador ? infoHolder.pagamento.pagador : ""
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "pagamento.pagador": value,
            });
            setInfo({
              ...infoHolder,
              pagamento: {
                ...infoHolder.pagamento,
                pagador: value,
              },
            });
          }}
        />
        <TextInput
          label={"Contato pagador"}
          editable={editor}
          value={
            infoHolder.pagamento?.contatoPagador
              ? infoHolder.pagamento?.contatoPagador
              : ""
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "pagamento.contatoPagador": value,
            });
            setInfo({
              ...infoHolder,
              pagamento: {
                ...infoHolder.pagamento,
                contatoPagador: value,
              },
            });
          }}
        />
      </div>
    </div>
  );
}

export default InfoPagamentoBlock;
