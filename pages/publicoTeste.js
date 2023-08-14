import React, { useState } from "react";

import DateFloatingInput from "../components/DateFloatingInput";
import SelectInput from "../components/inputs/Select";
import { useClients } from "../utils/methods/query/clients";
function Teste() {
  const { data } = useClients(true);
  const [holder, setHolder] = useState();
  console.log(holder);
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-12">
      <h1 className="text-center font-bold text-xl mb-6">teste</h1>
      <SelectInput
        label={"LISTA"}
        selectedItemLabel={"NÃO DEFINIDO"}
        options={
          data
            ? data.map((x) => ({
                label: x.nomeDoContrato,
                value: x.nomeDoContrato,
              }))
            : []
        }
      />
    </div>
  );
}

export default Teste;
