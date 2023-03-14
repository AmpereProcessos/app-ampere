import Link from "next/link";
import React from "react";
import NumberInput from "../NumberInput";
import SelectInput from "../SelectInput";

function InfoMaterialBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
}) {
  console.log(infoHolder);
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        MATERIAL
      </span>
      <div className="flex gap-2 justify-center flex-wrap">
        {infoHolder.material?.formularioId && (
          <Link
            href={`/almoxarifado/pdfFormulario/${infoHolder.material.formularioId}?backTo=adm`}
          >
            <p className="cursor-pointer bg-[#15599a] text-white items-center justify-center p-2 rounded font-bold">
              VER SOLICITAÇÃO
            </p>
          </Link>
        )}
        <SelectInput
          label={"Separação do material"}
          value={
            infoHolder.material?.statusSeparacao
              ? infoHolder.material?.statusSeparacao
              : "NÃO DEFINIDO"
          }
          editable={editor}
          options={[
            {
              label: "INICIAR SEPARAÇÃO",
              value: "INICIAR SEPARAÇÃO",
            },
            {
              label: "SEPARADO",
              value: "SEPARADO",
            },
            {
              label: "NÃO DEFINIDO",
              value: "NÃO DEFINIDO",
            },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "material.statusSeparacao": value,
            });
            setInfo({
              ...infoHolder,
              material: {
                ...infoHolder.material,
                statusSeparacao: value,
              },
            });
          }}
        />
        <NumberInput
          tag={"R$"}
          label={"Previsão de custos em insumos"}
          editable={editor}
          value={
            infoHolder.material?.previsaoCustos != undefined &&
            infoHolder.material?.previsaoCustos != "#VALUE!"
              ? infoHolder.material?.previsaoCustos.toFixed(2)
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "material.previsaoCustos": Number(value),
            });
            setInfo({
              ...infoHolder,
              material: {
                ...infoHolder.material,
                previsaoCustos: Number(value),
              },
            });
          }}
        />
        <NumberInput
          tag={"R$"}
          label={"Custos em insumos"}
          editable={editor}
          value={
            infoHolder.material?.efetivoCustos != undefined &&
            infoHolder.material?.efetivoCustos != "#VALUE!"
              ? infoHolder.material?.efetivoCustos
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "material.efetivoCustos": Number(value),
            });
            setInfo({
              ...infoHolder,
              material: {
                ...infoHolder.material,
                efetivoCustos: Number(value),
              },
            });
          }}
        />
      </div>
    </div>
  );
}

export default InfoMaterialBlock;
