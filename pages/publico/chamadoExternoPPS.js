import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../utils/whitelogoHD.png";
import { vendedores } from "../../utils/constants";
function ChamadoExternoPPS() {
  const [dados, setDados] = useState({
    vendedor: "NÃO DEFINIDO",
    referenteAProjeto: "NÃO DEFINIDO",
  });
  const [stage, setStage] = useState(0);
  return (
    <section className="min-h-[100vh] flex justify-center bg-[#155a9ab7]">
      <div className="flex flex-col bg-[#fff] p-4 rounded min-w-[450px]">
        <div className="flex self-center items-center h-[100px] w-[100px]">
          <Image src={Logo} />
        </div>
        <h1 className="text-[#fead61] font-bold text-center">
          ABERTURA DE CHAMADO
        </h1>
        <div className="flex items-center flex-col mt-2 w-full">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            VENDEDOR
          </span>
          <select
            value={dados.vendedor}
            onChange={(e) => setDados({ ...dados, vendedor: e.target.value })}
            className="outline-none p-2 text-sm border border-gray-200 w-full text-center"
          >
            {vendedores.map((vendedor) => (
              <option key={vendedor.nome} value={vendedor.nome}>
                {vendedor.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="items-center flex flex-col mt-2">
          <span className="uppercase font-bold font-raleway text-center text-sm">
            CHAMADO REFERENTE A ALGUM PROJETO?
          </span>
          <select
            value={dados.referenteAProjeto}
            onChange={(e) =>
              setDados({ ...dados, referenteAProjeto: e.target.value })
            }
            className="outline-none p-2 text-sm border border-gray-200 w-full text-center"
          >
            <option value={"SIM"}>SIM</option>
            <option value={"NÃO"}>NÃO</option>
            <option value={"NÃO DEFINIDO"}>NÃO DEFINIDO</option>
          </select>
        </div>
        {dados.referenteAProjeto == "SIM" && (
          <div className="flex flex-col items-center mt-2">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              CÓDIGO DO PROJETO
            </span>
            <input
              type="number"
              className="w-full p-2 border border-gray-200 outline-none text-center"
            />
          </div>
        )}
        {dados.referenteAProjeto != "NÃO DEFINIDO" && (
          <div className="flex flex-col items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm"></span>
          </div>
        )}
      </div>
    </section>
  );
}

export default ChamadoExternoPPS;
