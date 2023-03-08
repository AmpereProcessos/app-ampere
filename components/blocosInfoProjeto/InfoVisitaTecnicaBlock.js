import React from "react";
import NumberInput from "../NumberInput";
import TextInput from "../TextInput";

function InfoVisitaTecnicaBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
}) {
  console.log(changes);
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        VISITA TÉCNICA
      </span>
      <div className="flex gap-2 justify-around flex-wrap">
        <div>
          <input
            disabled={!editor}
            checked={
              infoHolder.visitaTecnica?.status === "REALIZADA" ? true : false
            }
            onChange={(e) => {
              setChanges({
                ...changes,
                "visitaTecnica.status": e.target.checked
                  ? "REALIZADA"
                  : "PENDÊNCIA",
              });
              setInfo({
                ...infoHolder,
                visitaTecnica: {
                  ...infoHolder.visitaTecnica,
                  status: e.target.checked ? "REALIZADA" : "PENDÊNCIA",
                },
              });
            }}
            type="checkbox"
            name="visitaTecnica"
            id="visitaTecnica"
          />
          <label className="ml-2" htmlFor="visitaTecnica">
            REALIZADA ?
          </label>
        </div>
        <TextInput
          label={"TÉCNICO RESPONSÁVEL"}
          editable={editor}
          value={
            infoHolder.visitaTecnica?.tecnico
              ? infoHolder.visitaTecnica?.tecnico
              : ""
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "visitaTecnica.tecnico": value,
            });
            setInfo({
              ...infoHolder,
              visitaTecnica: {
                ...infoHolder.visitaTecnica,
                tecnico: value,
              },
            });
          }}
        />
        <TextInput
          label={"Tipo da telha"}
          editable={editor}
          value={
            infoHolder.visitaTecnica?.tipoDaTelha
              ? infoHolder.visitaTecnica?.tipoDaTelha
              : ""
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "visitaTecnica.tipoDaTelha": value,
            });
            setInfo({
              ...infoHolder,
              visitaTecnica: {
                ...infoHolder.visitaTecnica,
                tipoDaTelha: value,
              },
            });
          }}
        />
      </div>
    </div>
  );
}

export default InfoVisitaTecnicaBlock;
