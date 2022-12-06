import React from "react";
import TextInput from "./TextInput";
const phoneMask = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};
function ChamadosExternoPPSInfo({ tipo, dados, setDados }) {
  return (
    <div className="mt-12 w-full self-center lg:w-[75%] min-h-[275px] gap-2 flex flex-col items-center flex-wrap  border border-[#15599a] p-12 shadow-lg bg-[#fff]">
      <TextInput label={"NOME COMPLETO"} value={dados.nomeDoCliente} />
      <TextInput
        label={"TELEFONE"}
        value={dados.tefefone}
        handleChange={(value) =>
          setDados({ ...dados, telefone: phoneMask(value) })
        }
      />
    </div>
  );
}

export default ChamadosExternoPPSInfo;
