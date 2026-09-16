import type { Dispatch, SetStateAction } from "react";

import type { TProjectUpdateLogDTO } from "@/utils/schemas/project-updates-logs";
import type { TProjectDTO } from "@/utils/schemas/projects";
import UpdateLogsBlock from "../identificador/registrosAlteracoesProjeto/UpdateLogsBlock";
import System from "../identificador/registrosAlteracoesProjeto/secao/System";
import CheckboxInput from "../inputs/Checkbox";
import NumberInput from "../inputs/Number";
import SelectInput from "../inputs/Select";
import TextInput from "../inputs/Text";

import { SystemTopologiesTypes } from "@/utils/select-options";
import { Cpu, ShoppingCart } from "lucide-react";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import ProjectProductsSpreadsheet, { sortProjectProducts } from "./Utils/ProjectProductsSpreadsheet";
import ProjectServicesSpreadsheet from "./Utils/ProjectServicesSpreadsheet";
import type { TProductItem, TServiceItem } from "@/utils/schemas/crm/kits.schema";

type InfoSistemaBlockProps = {
  editor: boolean;
  infoHolder: TProjectDTO;
  setInfo: Dispatch<SetStateAction<TProjectDTO>>;
  changes: { [key: string]: any };
  setChanges: Dispatch<SetStateAction<{ [key: string]: any }>>;
  updateLogs: TProjectUpdateLogDTO[];
  showPaymentInfo: boolean;
};
function InfoSistemaBlock({
  editor,
  infoHolder,
  setInfo,
  changes,
  setChanges,
  updateLogs = [],
  showPaymentInfo = false,
}: InfoSistemaBlockProps) {
  function applyProdutos(updater: (current: TProductItem[]) => TProductItem[]) {
    setInfo((prev) => {
      const produtos = sortProjectProducts(updater(prev.produtos ?? []));
      setChanges((changesPrev) => ({ ...changesPrev, produtos }));
      return { ...prev, produtos };
    });
  }

  function applyServicos(updater: (current: TServiceItem[]) => TServiceItem[]) {
    setInfo((prev) => {
      const servicos = updater(prev.servicos ?? []);
      setChanges((changesPrev) => ({ ...changesPrev, servicos }));
      return { ...prev, servicos };
    });
  }
  return (
    <div className="flex flex-col rounded-md border border-primary pb-2 shadow-lg gap-6">
      <div className="flex items-center gap-2 bg-primary/20 px-2 py-2 rounded w-full justify-center">
        <Cpu className="h-4 w-4 min-h-4 min-w-4" />
        <h1 className="text-xs tracking-tight font-medium text-start w-fit">
          INFORMAÇÕES SOBRE O SISTEMA
        </h1>
      </div>
      <UpdateLogsBlock logs={updateLogs} SectionElement={<System logs={updateLogs} />} />
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        {showPaymentInfo ? (
          <div className="w-full lg:w-1/2">
            <NumberInput
              label={"VALOR DO PROJETO"}
              placeholder="Preencha aqui o valor do projeto..."
              editable={editor}
              value={infoHolder.sistema?.valorProjeto || 0}
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  "sistema.valorProjeto": value,
                }));
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    valorProjeto: value,
                  },
                }));
              }}
              width="100%"
            />
          </div>
        ) : null}
        <div className="w-full lg:w-1/2">
          <NumberInput
            label={"POTÊNCIA PICO DO PROJETO"}
            placeholder="Preencha aqui a potência pico do projeto..."
            editable={editor}
            value={infoHolder.sistema?.potPico || 0}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "sistema.potPico": value,
              }));
              setInfo((prev) => ({
                ...prev,
                sistema: {
                  ...prev.sistema,
                  potPico: value,
                },
              }));
            }}
            width="100%"
          />
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <SelectInput
            label={"TOPOLOGIA"}
            value={infoHolder.sistema?.topologia}
            selectedItemLabel="NÃO DEFINIDO"
            editable={editor}
            options={SystemTopologiesTypes}
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "sistema.topologia": value,
              }));
              setInfo((prev) => ({
                ...prev,
                sistema: {
                  ...prev.sistema,
                  topologia: value,
                },
              }));
            }}
            onReset={() => {
              setChanges((prev) => ({
                ...prev,
                "sistema.topologia": undefined,
              }));
              setInfo((prev) => ({
                ...prev,
                sistema: {
                  ...prev.sistema,
                  topologia: undefined,
                },
              }));
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={"QTDE E POTÊNCIA DO(S) INVERSOR(ES)"}
            editable={editor}
            value={infoHolder.sistema?.inversor || ""}
            placeholder="Preencha a quantidade e a potência do inversor..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "sistema.inversor": value,
              }));
              setInfo((prev) => ({
                ...prev,
                sistema: {
                  ...prev.sistema,
                  inversor: value,
                },
              }));
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label={"NÚMERO DE MÓDULOS"}
            editable={editor}
            value={infoHolder.sistema?.qtdeModulos || 0}
            placeholder="Preencha o número de módulos"
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "sistema.qtdeModulos": value,
              }));
              setInfo((prev) => ({
                ...prev,
                sistema: {
                  ...prev.sistema,
                  qtdeModulos: value,
                },
              }));
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <TextInput
            label={"POTÊNCIA DOS MÓDULOS"}
            editable={editor}
            value={infoHolder.sistema?.potModulos?.toString() || ""}
            placeholder="Preencha a potência dos módulos..."
            handleChange={(value) => {
              setChanges((prev) => ({
                ...prev,
                "sistema.potModulos": value,
              }));
              setInfo((prev) => ({
                ...prev,
                sistema: { ...prev.sistema, potModulos: value },
              }));
            }}
            width="100%"
          />
        </div>
      </div>

      {infoHolder.tipoDeServico === "SISTEMA FOTOVOLTAICO (OFF GRID)" && (
        <>
          <h1 className="mt-2 w-full text-center font-black text-[#fead41]">SISTEMA OFF GRID</h1>
          <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
            <div className="w-full lg:w-1/4">
              <SelectInput
                label={"TIPO DO CONTROLADOR"}
                editable={true}
                value={
                  infoHolder.sistema.tipoControlador
                    ? infoHolder.sistema.tipoControlador
                    : "NÃO DEFINIDO"
                }
                selectedItemLabel="NÃO DEFINIDO"
                options={[
                  {
                    id: 1,
                    label: "INTEGRADO AO INVERSOR",
                    value: "INTEGRADO AO INVERSOR",
                  },
                  { id: 2, label: "COMPRO EM SEPARADO", value: "SEPARADO" },
                ]}
                handleChange={(value) => {
                  setChanges((prev) => ({
                    ...prev,
                    "sistema.tipoControlador": value,
                  }));
                  setInfo((prev) => ({
                    ...prev,
                    sistema: {
                      ...prev.sistema,
                      tipoControlador: value,
                    },
                  }));
                }}
                onReset={() => {
                  setChanges((prev) => ({
                    ...prev,
                    "sistema.tipoControlador": "",
                  }));
                  setInfo((prev) => ({
                    ...prev,
                    sistema: {
                      ...prev.sistema,
                      tipoControlador: "",
                    },
                  }));
                }}
                width="100%"
              />
            </div>
            {infoHolder.sistema.tipoControlador !== "INTEGRADO AO INVERSOR" ? (
              <>
                <div className="w-full lg:w-1/4">
                  <TextInput
                    label={"MARCA DO CONTROLADOR"}
                    value={infoHolder.sistema?.marcaControlador}
                    placeholder="Preencha aqui a marca do controlador..."
                    handleChange={(value) => {
                      setChanges((prev) => ({
                        ...prev,
                        "sistema.marcaControlador": value,
                      }));
                      setInfo((prev) => ({
                        ...prev,
                        sistema: {
                          ...prev.sistema,
                          marcaControlador: value,
                        },
                      }));
                    }}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <NumberInput
                    label={"QTDE DE CONTROLADORES"}
                    editable={true}
                    value={infoHolder.sistema?.qtdeControlador || null}
                    placeholder="Preencha a quantidade de controladores..."
                    handleChange={(value) => {
                      setChanges((prev) => ({
                        ...prev,
                        "sistema.qtdeControlador": Number(value),
                      }));
                      setInfo((prev) => ({
                        ...prev,
                        sistema: {
                          ...prev.sistema,
                          qtdeControlador: Number(value),
                        },
                      }));
                    }}
                    width="100%"
                  />
                </div>
                <div className="w-full lg:w-1/4">
                  <NumberInput
                    label={"CORRENTE DE CARGA (A)"}
                    editable={true}
                    value={infoHolder.sistema.correnteControlador || null}
                    placeholder="Preencha aqui a corrente de carga do controlador..."
                    handleChange={(value) => {
                      setChanges((prev) => ({
                        ...prev,
                        "sistema.correnteControlador": Number(value),
                      }));
                      setInfo((prev) => ({
                        ...prev,
                        sistema: {
                          ...prev.sistema,
                          correnteControlador: Number(value),
                        },
                      }));
                    }}
                    width="100%"
                  />
                </div>
              </>
            ) : null}
          </div>
        </>
      )}
      {infoHolder.tipoDeServico === "BOMBA SOLAR" && (
        <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <TextInput
              label={"MARCA DA BOMBA"}
              editable={editor}
              value={infoHolder.sistema.marcaBomba}
              placeholder="Preencha aqui a marca da bomba..."
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  "sistema.marcaBomba": value,
                }));
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    marcaBomba: value,
                  },
                }));
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <NumberInput
              label={"QTDE DE BOMBAS"}
              editable={editor}
              value={infoHolder.sistema.qtdeBomba || null}
              placeholder="Preencha aqui a quantidade de bombas..."
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  "sistema.qtdeBomba": value,
                }));
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    qtdeBomba: value,
                  },
                }));
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/3">
            <NumberInput
              label={"POTÊNCIA DA BOMBA"}
              editable={editor}
              value={infoHolder.sistema.potBomba || null}
              placeholder="Preencha aqui a potência da(s) bomba(s)..."
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  "sistema.potBomba": value,
                }));
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    potBomba: value,
                  },
                }));
              }}
              width="100%"
            />
          </div>
        </div>
      )}
      {infoHolder.tipoDeServico === "BOMBA SOLAR" ||
      infoHolder.tipoDeServico === "SISTEMA FOTOVOLTAICO (OFF GRID)" ? (
        <div className="mt-2 flex w-full flex-col items-center justify-center gap-2 px-2 lg:flex-row">
          <div className="w-full lg:w-1/4">
            <TextInput
              label={"MARCA DA BATERIA"}
              editable={true}
              value={infoHolder.sistema.marcaBateria}
              placeholder="Preencha aqui a marca da bateria..."
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  "sistema.marcaBateria": value,
                }));
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    marcaBateria: value,
                  },
                }));
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label={"QTDE DE BATERIAS"}
              editable={true}
              value={infoHolder.sistema.qtdeBateria || null}
              placeholder="Preencha aqui a quantidade de baterias..."
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
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <SelectInput
              label={"TIPO DA BATERIA"}
              editable={true}
              value={infoHolder.sistema.tipoBateria}
              selectedItemLabel="NÃO DEFINIDO"
              options={[
                { id: 1, label: "LÍTIO", value: "LÍTIO" },
                { id: 2, label: "ESTACIONÁRIA", value: "ESTACIONÁRIA" },
              ]}
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  "sistema.tipoBateria": value,
                }));
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    tipoBateria: value,
                  },
                }));
              }}
              onReset={() => {
                setChanges((prev) => ({
                  ...prev,
                  "sistema.tipoBateria": "NÃO DEFINIDO",
                }));
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    tipoBateria: "NÃO DEFINIDO",
                  },
                }));
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label={"CAPACIDADE (Ah)"}
              editable={true}
              value={infoHolder.sistema.capacidadeBateria || null}
              placeholder="Preencha aqui"
              handleChange={(value) => {
                setChanges((prev) => ({
                  ...prev,
                  "sistema.capacidadeBateria": Number(value),
                }));
                setInfo((prev) => ({
                  ...prev,
                  sistema: {
                    ...prev.sistema,
                    capacidadeBateria: Number(value),
                  },
                }));
              }}
              width="100%"
            />
          </div>
        </div>
      ) : null}
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
          <ShoppingCart className="h-4 w-4 min-h-4 min-w-4" />
          <h1 className="text-xs tracking-tight font-medium text-start w-fit">PRODUTOS</h1>
        </div>
        <ProjectProductsSpreadsheet
          products={infoHolder.produtos ?? []}
          editable={editor}
          onAdd={(product) => applyProdutos((current) => [...current, product])}
          onUpdate={(index, changes) =>
            applyProdutos((current) => current.map((item, i) => (i === index ? { ...item, ...changes } : item)))
          }
          onRemove={(index) => applyProdutos((current) => current.filter((_, i) => i !== index))}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
          <MdOutlineMiscellaneousServices className="h-4 w-4 min-h-4 min-w-4" />
          <h1 className="text-xs tracking-tight font-medium text-start w-fit">SERVIÇOS</h1>
        </div>
        <ProjectServicesSpreadsheet
          services={infoHolder.servicos ?? []}
          editable={editor}
          onAdd={(service) => applyServicos((current) => [...current, service])}
          onUpdate={(index, changes) =>
            applyServicos((current) => current.map((item, i) => (i === index ? { ...item, ...changes } : item)))
          }
          onRemove={(index) => applyServicos((current) => current.filter((_, i) => i !== index))}
        />
        <div className="my-4 flex w-full items-center justify-center self-center">
          <CheckboxInput
            labelFalse="INICIAR PROJETO"
            labelTrue="INICIAR PROJETO"
            checked={!!infoHolder.homologacao.dataLiberacao}
            handleChange={(value) => {
              setInfo((prev) => ({
                ...prev,
                homologacao: {
                  ...prev.homologacao,
                  dataLiberacao: value ? new Date().toISOString() : null,
                },
              }));
              setChanges((prev) => ({
                ...prev,
                "homologacao.dataLiberacao": value ? new Date().toISOString() : null,
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default InfoSistemaBlock;
