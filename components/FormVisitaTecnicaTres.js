import React from "react";
import SelectInput from "./SelectInput";

function FormVisitaTecnicaTres() {
  return (
    <div className="w-full flex flex-col border border-[#15599a] p-4 shadow-lg bg-[#fff]">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        ESTRUTURA DE MONTAGEM
      </span>
      <div className="flex gap-2 items-center justify-around flex-wrap mt-2">
        <SelectInput />
      </div>
    </div>
  );
}

export default FormVisitaTecnicaTres;
