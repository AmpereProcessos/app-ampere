import React, { useContext } from "react";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import SelectInput from "./SelectInput";
import { AppContext } from "../context/AppContext";
function InfoSistemaBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
}) {
  const { credentials } = useContext(AppContext);
  return (
    <div className="flex flex-col border border-[#15599a] pb-2 shadow-lg">
      <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
        SISTEMA
      </span>
      <div className="flex justify-center items-center py-2">
        <SelectInput
          label={"TOPOLOGIA"}
          value={
            infoHolder.sistema?.topologia
              ? infoHolder.sistema?.topologia
              : "NÃO DEFINIDO"
          }
          editable={editor}
          options={[
            { label: "INVERSOR", value: "INVERSOR" },
            { label: "MICRO", value: "MICRO" },
            { label: "OUTROS SERV.", value: "OUTROS SERV." },
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "sistema.topologia": value,
            });
            setInfo({
              ...infoHolder,
              sistema: {
                ...infoHolder.sistema,
                topologia: value,
              },
            });
          }}
        />
        {credentials.visualizacao == undefined && (
          <NumberInput
            tag={"R$"}
            label={"VALOR DO PROJETO"}
            editable={editor}
            value={
              infoHolder.sistema?.valorProjeto != undefined &&
              infoHolder.sistema?.valorProjeto != "-"
                ? infoHolder.sistema?.valorProjeto
                : 0
            }
            handleChange={(value) => {
              setChanges({
                ...changes,
                "sistema.valorProjeto": Number(value),
              });
              setInfo({
                ...infoHolder,
                sistema: {
                  ...infoHolder.sistema,
                  valorProjeto: Number(value),
                },
              });
            }}
          />
        )}
        <SelectInput
          label={"INICIAR PROJETO"}
          value={
            infoHolder.projeto?.iniciar
              ? infoHolder.projeto?.iniciar
              : "NÃO DEFINIDO"
          }
          editable={editor}
          options={[
            { label: "SIM", value: "SIM" },
            {
              label: "CONTRATO CANCELADO",
              value: "CONTRATO CANCELADO",
            },
            { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
          ]}
          handleChange={(value) => {
            setChanges({
              ...changes,
              "projeto.iniciar": value,
            });
            setInfo({
              ...infoHolder,
              projeto: {
                ...infoHolder.projeto,
                iniciar: value,
              },
            });
          }}
        />
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        <TextInput
          label={"QTDE E POTÊNCIA DO(S) INVERSOR(ES)"}
          editable={editor}
          value={
            infoHolder.sistema?.inversor ? infoHolder.sistema?.inversor : ""
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "sistema.inversor": value,
            });
            setInfo({
              ...infoHolder,
              sistema: {
                ...infoHolder.sistema,
                inversor: value,
              },
            });
          }}
        />
        <NumberInput
          label={"NÚMERO DE MÓDULOS"}
          editable={editor}
          value={
            infoHolder.sistema?.qtdeModulos != undefined &&
            infoHolder.sistema?.qtdeModulos != "-"
              ? infoHolder.sistema?.qtdeModulos
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "sistema.qtdeModulos": Number(value),
              "sistema.potPico":
                Number(infoHolder.sistema?.potModulos * value) / 1000,
            });
            setInfo({
              ...infoHolder,
              sistema: {
                ...infoHolder.sistema,
                qtdeModulos: Number(value),
                potPico: Number(infoHolder.sistema?.potModulos * value) / 1000,
              },
            });
          }}
        />
        <TextInput
          unit={"W"}
          label={"POTÊNCIA DOS MÓDULOS"}
          editable={editor}
          value={
            infoHolder.sistema?.potModulos != undefined &&
            infoHolder.sistema?.potModulos != "-"
              ? infoHolder.sistema?.potModulos
              : ""
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "sistema.potModulos": value,
              "sistema.potPico":
                Number(value * infoHolder.sistema?.qtdeModulos) / 1000,
            });
            setInfo({
              ...infoHolder,
              sistema: {
                ...infoHolder.sistema,
                potModulos: value,
                potPico: Number(value * infoHolder.sistema?.qtdeModulos) / 1000,
              },
            });
          }}
        />
        <NumberInput
          unit={"kWp"}
          label={"POTÊNCIA PICO"}
          editable={editor}
          value={
            infoHolder.sistema?.potPico != undefined &&
            infoHolder.sistema?.potPico != "-"
              ? infoHolder.sistema?.potPico
              : 0
          }
          handleChange={(value) => {
            setChanges({
              ...changes,
              "sistema.potPico": Number(value),
            });
            setInfo({
              ...infoHolder,
              sistema: {
                ...infoHolder.sistema,
                potPico: Number(value),
              },
            });
          }}
        />
      </div>
      {infoHolder.tipoDeServico == "SISTEMA FOTOVOLTAICO (OFF GRID)" && (
        <>
          <div className="flex flex-col lg:grid lg:grid-cols-4 items-center py-2 border-t border-gray-200 mt-2">
            <div
              className={`flex ${
                infoHolder.sistema.tipoControlador == "INTEGRADO AO INVERSOR" &&
                "col-span-4"
              } justify-center items-center w-full`}
            >
              <SelectInput
                label={"TIPO DO CONTROLADOR"}
                editable={true}
                value={
                  infoHolder.sistema.tipoControlador
                    ? infoHolder.sistema.tipoControlador
                    : "NÃO DEFINIDO"
                }
                options={[
                  {
                    label: "INTEGRADO AO INVERSOR",
                    value: "INTEGRADO AO INVERSOR",
                  },
                  {
                    label: "COMPRO EM SEPARADO",
                    value: "SEPARADO",
                  },
                  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                ]}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.tipoControlador": value,
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      tipoControlador: value,
                    },
                  });
                }}
              />
            </div>
            {infoHolder.sistema.tipoControlador != "INTEGRADO AO INVERSOR" && (
              <>
                <div className="flex justify-center items-center w-full">
                  <TextInput
                    label={"MARCA DO CONTROLADOR"}
                    editable={true}
                    value={infoHolder.sistema?.marcaControlador}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "sistema.marcaControlador": value,
                      });
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          marcaControlador: value,
                        },
                      });
                    }}
                  />
                </div>
                <div className="flex justify-center items-center w-full">
                  <NumberInput
                    label={"QTDE DE CONTROLADORES"}
                    editable={true}
                    value={infoHolder.sistema?.qtdeControlador}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "sistema.qtdeControlador": Number(value),
                      });
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          qtdeControlador: Number(value),
                        },
                      });
                    }}
                  />
                </div>
                <div className="flex justify-center items-center w-full">
                  <NumberInput
                    label={"CORRENTE DE CARGA (em A)"}
                    editable={true}
                    value={infoHolder.sistema.correnteControlador}
                    handleChange={(value) => {
                      setChanges({
                        ...changes,
                        "sistema.correnteControlador": Number(value),
                      });
                      setInfo({
                        ...infoHolder,
                        sistema: {
                          ...infoHolder.sistema,
                          correnteControlador: Number(value),
                        },
                      });
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-4 items-center py-2 border-t border-gray-200">
            <div className="flex justify-center items-center w-full">
              <TextInput
                label={"MARCA DA BATERIA"}
                editable={true}
                value={infoHolder.sistema.marcaBateria}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.marcaBateria": value,
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      marcaBateria: value,
                    },
                  });
                }}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <NumberInput
                label={"QTDE DE BATERIAS"}
                editable={true}
                value={infoHolder.sistema.qtdeBateria}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.qtdeBateria": Number(value),
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      qtdeBateria: Number(value),
                    },
                  });
                }}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <SelectInput
                label={"TIPO DA BATERIA"}
                editable={true}
                value={
                  infoHolder.sistema.tipoBateria
                    ? infoHolder.sistema.tipoBateria
                    : "NÃO DEFINIDO"
                }
                options={[
                  { label: "LÍTIO", value: "LÍTIO" },
                  { label: "ESTACIONÁRIA", value: "ESTACIONÁRIA" },
                  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                ]}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.tipoBateria": value,
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      tipoBateria: value,
                    },
                  });
                }}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <NumberInput
                label={"CAPACIDADE (em Ah)"}
                editable={true}
                value={infoHolder.sistema.capacidadeBateria}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.capacidadeBateria": Number(value),
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      capacidadeBateria: Number(value),
                    },
                  });
                }}
              />
            </div>
          </div>
        </>
      )}
      {infoHolder.tipoDeServico == "BOMBA SOLAR" && (
        <>
          <div className="flex flex-col lg:grid lg:grid-cols-3 items-center mt-2 py-2 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <TextInput
                label={"MARCA BOMBA"}
                editable={editor}
                value={infoHolder.sistema.marcaBomba}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.marcaBomba": Number(value),
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      marcaBomba: Number(value),
                    },
                  });
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <NumberInput
                label={"QTDE BOMBA"}
                editable={editor}
                value={infoHolder.sistema.qtdeBomba}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.qtdeBomba": Number(value),
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      qtdeBomba: Number(value),
                    },
                  });
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <NumberInput
                label={"POTÊNCIA BOMBA"}
                editable={editor}
                value={infoHolder.sistema.potBomba}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.potBomba": Number(value),
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      potBomba: Number(value),
                    },
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-4 items-center py-2 border-t border-gray-200">
            <div className="flex justify-center items-center w-full">
              <TextInput
                label={"MARCA DA BATERIA"}
                editable={editor}
                value={infoHolder.sistema.marcaBateria}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.marcaBateria": value,
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      marcaBateria: value,
                    },
                  });
                }}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <NumberInput
                label={"QTDE DE BATERIAS"}
                editable={true}
                value={infoHolder.sistema.qtdeBateria}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.qtdeBateria": Number(value),
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      qtdeBateria: Number(value),
                    },
                  });
                }}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <SelectInput
                label={"TIPO DA BATERIA"}
                editable={true}
                value={
                  infoHolder.sistema.tipoBateria
                    ? infoHolder.sistema.tipoBateria
                    : "NÃO DEFINIDO"
                }
                options={[
                  { label: "LÍTIO", value: "LÍTIO" },
                  { label: "ESTACIONÁRIA", value: "ESTACIONÁRIA" },
                  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                ]}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.tipoBateria": value,
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      tipoBateria: value,
                    },
                  });
                }}
              />
            </div>
            <div className="flex justify-center items-center w-full">
              <NumberInput
                label={"CAPACIDADE (em Ah)"}
                editable={true}
                value={infoHolder.sistema.capacidadeBateria}
                handleChange={(value) => {
                  setChanges({
                    ...changes,
                    "sistema.capacidadeBateria": Number(value),
                  });
                  setInfo({
                    ...infoHolder,
                    sistema: {
                      ...infoHolder.sistema,
                      capacidadeBateria: Number(value),
                    },
                  });
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InfoSistemaBlock;
