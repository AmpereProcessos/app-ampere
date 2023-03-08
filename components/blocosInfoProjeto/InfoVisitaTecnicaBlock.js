import React from "react";
import NumberInput from "../NumberInput";
import TextInput from "../TextInput";
import { IoMdAdd } from "react-icons/io";
function InfoVisitaTecnicaBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  infoVisita,
}) {
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        VISITA TÉCNICA
      </span>
      <div className="flex gap-2 justify-around flex-wrap">
        <div className="flex items-center w-[350px] justify-center">
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
      {infoVisita?.suprimentos && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col mx-12 mt-2 gap-2">
            <div className="grid grid-cols-6 w-full">
              <p className="text-md text-[#fead61] font-bold text-center">
                INSUMO
              </p>
              <p className="text-md text-[#fead61] font-bold text-center">
                TIPO
              </p>
              <p className="text-md text-[#fead61] font-bold text-center">
                QUANTIDADE
              </p>
              <p className="text-md text-[#fead61] font-bold text-center">
                UNIDADE
              </p>
              <p className="text-md text-[#fead61] font-bold text-center col-span-2">
                AÇÃO
              </p>
            </div>
            {infoVisita.suprimentos?.map((suprimento, index) => (
              <div key={index} className="grid grid-cols-6 w-full">
                <p className="text-xs text-gray-600 font-bold text-center">
                  {suprimento.insumo}
                </p>
                <p className="text-xs text-gray-600 font-bold text-center">
                  {suprimento.tipo}
                </p>
                <p className="text-xs text-gray-600 font-bold text-center">
                  {suprimento.qtde}
                </p>
                <p className="text-xs text-gray-600 font-bold text-center">
                  {suprimento.medida}
                </p>
                <div className="flex items-center justify-center gap-1 col-span-2">
                  <button
                    onClick={() => {
                      setChanges({
                        ...changes,
                        "compra.kitInfo": infoHolder.compra?.kitInfo
                          ? infoHolder.compra?.kitInfo +
                            `/${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`
                          : `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`,
                      });
                      setInfo({
                        ...infoHolder,
                        compra: {
                          ...infoHolder.compra,
                          kitInfo: infoHolder.compra?.kitInfo
                            ? infoHolder.compra?.kitInfo +
                              `/${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`
                            : `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`,
                        },
                      });
                    }}
                    className="flex items-center gap-1 text-xs p-1 rounded border border-[#fead61] text-[#fead61] hover:bg-[#fead61] hover:text-black font-bold"
                  >
                    <IoMdAdd />
                    <p>KIT</p>
                  </button>
                  <button
                    onClick={() => {
                      setChanges({
                        ...changes,
                        "material.materialFaltante": infoHolder.material
                          ?.materialFaltante
                          ? infoHolder.material?.materialFaltante +
                            `/${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`
                          : `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`,
                      });
                      setInfo({
                        ...infoHolder,
                        material: {
                          ...infoHolder.material,
                          materialFaltante: infoHolder.material
                            ?.materialFaltante
                            ? infoHolder.material?.materialFaltante +
                              `/${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`
                            : `${suprimento.qtde}-${suprimento.insumo} ${suprimento.tipo}`,
                        },
                      });
                    }}
                    className="flex items-center gap-1 text-xs p-1 rounded border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white font-bold"
                  >
                    <IoMdAdd />
                    <p>FALTANTE</p>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col w-full self-center mt-2 items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              OBSERVAÇÕES P/SUPRIMENTOS
            </span>
            <textarea
              value={infoVisita.obsSuprimentos}
              readOnly={true}
              placeholder={"Observações p/ suprimentos aqui..."}
              className="w-full text-center h-[100px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoVisitaTecnicaBlock;
