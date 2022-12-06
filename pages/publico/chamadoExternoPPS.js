import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../utils/whitelogoHD.png";
import { vendedores } from "../../utils/constants";
import SelectInput from "../../components/SelectInput";
import NumberInput from "../../components/NumberInput";
function ChamadoExternoPPS() {
  const [dados, setDados] = useState({
    vendedor: "NÃO DEFINIDO",
    referenteAProjeto: "NÃO DEFINIDO",
    codigoDoProjeto: 0,
    tipoDeSolicitacao: "NÃO DEFINIDO",
  });
  const [stage, setStage] = useState(0);
  console.log("aaaa");
  return (
    <section className="p-6 bg-gray-100 min-h-[100vh] flex flex-col">
      <div className="flex self-center items-center h-[100px] w-[100px]">
        <Image src={Logo} />
      </div>
      <h1 className="text-[#fead61] font-bold text-center">
        ABERTURA DE CHAMADO
      </h1>
      {stage == 0 && (
        <div className="mt-12 w-full self-center lg:w-[75%] min-h-[275px] gap-2 flex flex-col items-center flex-wrap  border border-[#15599a] p-12 shadow-lg bg-[#fff]">
          <SelectInput
            label={"VENDEDOR"}
            editable={true}
            value={dados.vendedor}
            options={vendedores.map((vendedor) => {
              return {
                label: vendedor.nome,
                value: vendedor.nome,
              };
            })}
            handleChange={(value) => setDados({ ...dados, vendedor: value })}
          />
          <SelectInput
            label={"CHAMADO REFERENTE A ALGUM PROJETO?"}
            value={dados.referenteAProjeto}
            editable={true}
            handleChange={(value) =>
              setDados({ ...dados, referenteAProjeto: value })
            }
            options={[
              { label: "SIM", value: "SIM" },
              { label: "NÃO", value: "NÃO" },
              { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
            ]}
          />
          {dados.referenteAProjeto != "NÃO DEFINIDO" && (
            <SelectInput
              label={"TIPO DE SOLICITAÇÃO"}
              value={dados.tipoDeSolicitacao}
              editable={true}
              options={
                dados.referenteAProjeto == "SIM"
                  ? [
                      {
                        label: "PROPOSTA COMERCIAL SIMPLES(CADASTRO)",
                        value: "PROPOSTA COMERCIAL SIMPLES(CADASTRO)",
                      },
                      {
                        label: "ANÁLISE DE CRÉDITO",
                        value: "ANÁLISE DE CRÉDITO",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]
                  : [
                      {
                        label: "PROPOSTA COMERCIAL SIMPLES(CADASTRO)",
                        value: "PROPOSTA COMERCIAL SIMPLES(CADASTRO)",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]
              }
              handleChange={(value) =>
                setDados({ ...dados, tipoDeSolicitacao: value })
              }
            />
          )}
          {dados.referenteAProjeto == "SIM" && (
            <div>
              <NumberInput
                label={"CÓDIGO DO PROPOSTA"}
                value={dados.codigoDoProjeto}
                editable={true}
                handleChange={(value) =>
                  setDados({ ...dados, codigoDoProjeto: Number(value) })
                }
              />
            </div>
          )}
        </div>
      )}
      {stage == 1 && <div></div>}
      <div className="flex justify-center mt-2 grow justify-self-end">
        <button className="p-2 rounded bg-[#fead61] h-fit hover:bg-[#15599a] hover:text-white font-bold">
          PRÓXIMA ETAPA
        </button>
      </div>
    </section>
  );
}

export default ChamadoExternoPPS;
