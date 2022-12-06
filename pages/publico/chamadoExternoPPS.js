import React, { useState } from "react";
import Image from "next/image";
import Logo from "../../utils/whitelogoHD.png";
import { vendedores } from "../../utils/constants";
import SelectInput from "../../components/SelectInput";
import NumberInput from "../../components/NumberInput";
import ChamadosExternoPPSInfo from "../../components/ChamadoPPSInfo";
function ChamadoExternoPPS() {
  const [dados, setDados] = useState({
    vendedor: "NÃO DEFINIDO",
    referenteAProjeto: "NÃO DEFINIDO",
    codigoDoProjeto: 0,
    tipoDeSolicitacao: "NÃO DEFINIDO",
    nomeDoCliente: "",
    telefone: "",
    cidade: "NÃO DEFINIDO",
    observacoes: "",
  });
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  const [stage, setStage] = useState(0);
  function nextStage() {
    if (validateFields()) {
      setStage((prevState) => prevState + 1);
    }
  }
  function validateFields() {
    if (dados.vendedor == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o vendedor.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.referenteAProjeto == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha se o chamado se refere a algum projeto SVB.",
        color: "text-red-500",
      });
      return false;
    }
    if (dados.referenteAProjeto == "SIM" && dados.codigoDoProjeto == 0) {
      setMsg({
        text: "Por favor, preencha o código do projeto em questão.",
        color: "text-red-500",
      });
      return false;
    }

    if (dados.tipoDeSolicitacao == "NÃO DEFINIDO") {
      setMsg({
        text: "Por favor, preencha o tipo de solicitação.",
        color: "text-red-500",
      });
      return false;
    }
    return true;
  }
  return (
    <section className="p-2 bg-gray-100 min-h-[100vh] flex flex-col">
      <div className="flex self-center items-center h-[100px] w-[100px]">
        <Image src={Logo} />
      </div>
      <h1 className="text-[#fead61] font-bold text-center">
        ABERTURA DE CHAMADO
      </h1>
      {stage == 0 && (
        <div className="mt-12 w-full self-center lg:w-[75%] min-h-[350px] gap-2 flex flex-col items-center flex-wrap  border border-[#15599a] shadow-lg bg-[#fff]">
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
                        label: "PROPOSTA COMERCIAL",
                        value: "PROPOSTA COMERCIAL",
                      },
                      {
                        label: "ANÁLISE DE CRÉDITO",
                        value: "ANÁLISE DE CRÉDITO",
                      },
                      {
                        label: "OUTROS",
                        value: "OUTROS",
                      },
                      {
                        label: "NÃO DEFINIDO",
                        value: "NÃO DEFINIDO",
                      },
                    ]
                  : [
                      {
                        label: "PROPOSTA COMERCIAL",
                        value: "PROPOSTA COMERCIAL",
                      },
                      {
                        label: "OUTROS",
                        value: "OUTROS",
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
          <div className="flex flex-col items-center justify-end mt-2 grow gap-2">
            {msg.text && (
              <p className={`text-center italic text-sm ${msg.color}`}>
                {msg.text}
              </p>
            )}
            <button
              onClick={() => nextStage()}
              className="p-2 rounded bg-[#fead61] h-fit hover:bg-[#15599a] hover:text-white font-bold"
            >
              PRÓXIMA ETAPA
            </button>
          </div>
        </div>
      )}
      {stage == 1 && (
        <ChamadosExternoPPSInfo
          dados={dados}
          setDados={setDados}
          setStage={setStage}
        />
      )}
    </section>
  );
}

export default ChamadoExternoPPS;
