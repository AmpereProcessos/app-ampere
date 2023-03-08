import React from "react";
import NumberInput from "../NumberInput";
import SelectInput from "../SelectInput";
import TextInput from "../TextInput";

function InfoDadosConcessionariaBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
}) {
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        DADOS CONCESSIONÁRIA
      </span>
      <div className="flex gap-2 justify-center flex-wrap">
        <TextInput
          label={"Titular do projeto"}
          editable={editor}
          value={
            infoHolder.dadosCemig?.titularProjeto
              ? infoHolder.dadosCemig?.titularProjeto
              : ""
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "dadosCemig.titularProjeto": value,
            });
            setInfo({
              ...infoHolder,
              dadosCemig: {
                ...infoHolder.dadosCemig,
                titularProjeto: value,
              },
            });
          }}
        />
        <TextInput
          label={"Número da instalação"}
          value={
            infoHolder.dadosCemig?.numeroInstalacao
              ? infoHolder.dadosCemig?.numeroInstalacao
              : ""
          }
          editable={editor}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "dadosCemig.numeroInstalacao": value,
            });
            setInfo({
              ...infoHolder,
              dadosCemig: {
                ...infoHolder.dadosCemig,
                numeroInstalacao: value,
              },
            });
          }}
        />
        <SelectInput
          label={"DISTRIBUIÇÃO DE CRÉDITOS"}
          value={
            infoHolder.dadosCemig?.distCreditos
              ? infoHolder.dadosCemig?.distCreditos
              : "NÃO DEFINIDO"
          }
          editable={editor}
          options={[
            { label: "SIM", value: "SIM" },
            { label: "NÃO", value: "NÃO" },
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "dadosCemig.distCreditos": value,
            });
            setInfo({
              ...infoHolder,
              dadosCemig: {
                ...infoHolder.dadosCemig,
                distCreditos: value,
              },
            });
          }}
        />
        {infoHolder.dadosCemig?.distCreditos == "SIM" && (
          <NumberInput
            label={"QTDE DE DISTRIBUIÇÕES"}
            editable={editor}
            value={
              infoHolder.dadosCemig?.qtdeDistCreditos != undefined &&
              infoHolder.dadosCemig?.qtdeDistCreditos != "-"
                ? infoHolder.dadosCemig?.qtdeDistCreditos
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                "dadosCemig.qtdeDistCreditos": Number(value),
              });
              setInfo({
                ...infoHolder,
                dadosCemig: {
                  ...infoHolder.dadosCemig,
                  qtdeDistCreditos: Number(value),
                },
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

export default InfoDadosConcessionariaBlock;
