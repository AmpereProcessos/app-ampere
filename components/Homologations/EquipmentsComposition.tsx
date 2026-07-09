import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import Inverters from "../../utils/jsons/pvinverters.json";
import Modules from "../../utils/jsons/pvmodules.json";

import { FaIndustry, FaSolarPanel } from "react-icons/fa";
import { ImPower } from "react-icons/im";
import { MdDelete } from "react-icons/md";

import {
  getInverterPeakPowerByProducts,
  getModulesPeakPotByProducts,
} from "@/utils/methods/extracting";
import { renderProductCategoryIcon } from "@/utils/methods/rendering";
import type { TInverter, TModule, TProductItem } from "@/utils/schemas/crm/kits.schema";
import type { THomologationEquipment } from "@/utils/schemas/partial/homologation";
import type { TProjectDTOWithHomologation } from "@/utils/schemas/projects";
import { Plus, Zap } from "lucide-react";
import NumberInput from "../inputs/Number";
import SelectInput from "../inputs/Select";
import TextInput from "../inputs/Text";
import { Button } from "../ui/button";
type EquipmentsCompositionProps = {
  infoHolder: TProjectDTOWithHomologation;
  setInfoHolder: React.Dispatch<React.SetStateAction<TProjectDTOWithHomologation>>;
  changes: { [key: string]: any };
  setChanges: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
};
function EquipmentsComposition({
  infoHolder,
  setInfoHolder,
  changes,
  setChanges,
}: EquipmentsCompositionProps) {
  const [inverterHolder, setInverterHolder] = useState<TInverter>({
    id: "",
    fabricante: "",
    modelo: "",
    qtde: 1,
    garantia: 10,
    potencia: 0,
  });
  const [moduleHolder, setModuleHolder] = useState<TModule>({
    id: "",
    fabricante: "",
    modelo: "",
    qtde: 1,
    potencia: 0,
    garantia: 10,
  });
  const [personalizedEquipmentHolder, setPersonalizedEquipmentHolder] =
    useState<THomologationEquipment>({
      categoria: "MÓDULO",
      fabricante: "",
      modelo: "",
      qtde: 1,
      potencia: 0,
    });

  function addInverterToEquipments() {
    if (!inverterHolder.id && !inverterHolder.fabricante && !inverterHolder.modelo) {
      return toast.error("Inversor inválido. Por favor, tente novamente.");
    }
    if (inverterHolder.qtde <= 0) {
      return toast.error("Por favor, preencha um quantidade de inversores válida.");
    }
    const productInfo: THomologationEquipment = {
      categoria: "INVERSOR",
      fabricante: inverterHolder.fabricante,
      modelo: inverterHolder.modelo,
      qtde: inverterHolder.qtde,
      potencia: inverterHolder.potencia,
    };
    const newProductsArr = [...infoHolder.homologacao.equipamentos, productInfo].sort((a, b) =>
      a.categoria.localeCompare(b.categoria),
    );
    setInfoHolder((prev) => ({
      ...prev,
      homologacao: { ...prev.homologacao, equipamentos: newProductsArr },
    }));
    setChanges((prev) => ({ ...prev, "homologacao.equipamentos": newProductsArr }));
    setInverterHolder({
      id: "",
      fabricante: "",
      modelo: "",
      qtde: 1,
      garantia: 10,
      potencia: 0,
    });
  }
  function addModuleToEquipments() {
    if (!moduleHolder.id && !moduleHolder.fabricante && !moduleHolder.modelo) {
      return toast.error("Módulo inválido. Por favor, tente novamente.");
    }
    if (moduleHolder.qtde <= 0) {
      return toast.error("Por favor, preencha um quantidade de módulos válida.");
    }

    const productInfo: THomologationEquipment = {
      categoria: "MÓDULO",
      fabricante: moduleHolder.fabricante,
      modelo: moduleHolder.modelo,
      qtde: moduleHolder.qtde,
      potencia: moduleHolder.potencia,
    };

    const newProductsArr = [...infoHolder.homologacao.equipamentos, productInfo].sort((a, b) =>
      a.categoria.localeCompare(b.categoria),
    );

    setInfoHolder((prev) => ({
      ...prev,
      homologacao: {
        ...prev.homologacao,
        equipamentos: newProductsArr,
      },
    }));
    setChanges((prev) => ({ ...prev, "homologacao.equipamentos": newProductsArr }));
    setModuleHolder({
      id: "",
      fabricante: "",
      modelo: "",
      qtde: 1,
      potencia: 0,
      garantia: 10,
    });
  }
  function addPersonalizedEquipment() {
    if (personalizedEquipmentHolder.fabricante.trim().length < 3)
      return toast.error("Fabricante do produto não específicado.");
    if (personalizedEquipmentHolder.modelo.trim().length < 3)
      return toast.error("Modelo do produto não específicado.");
    if (personalizedEquipmentHolder.qtde <= 0)
      return toast.error("Quantidade do produto inválida.");

    const productInfo: THomologationEquipment = {
      categoria: personalizedEquipmentHolder.categoria,
      fabricante: personalizedEquipmentHolder.fabricante,
      modelo: personalizedEquipmentHolder.modelo,
      qtde: personalizedEquipmentHolder.qtde,
      potencia: personalizedEquipmentHolder.potencia,
    };
    const newProductsArr = [...infoHolder.homologacao.equipamentos, productInfo].sort((a, b) =>
      a.categoria.localeCompare(b.categoria),
    );
    setInfoHolder((prev) => ({
      ...prev,
      homologacao: { ...prev.homologacao, equipamentos: newProductsArr },
    }));
    setChanges((prev) => ({ ...prev, "homologacao.equipamentos": newProductsArr }));
    setPersonalizedEquipmentHolder({
      categoria: "MÓDULO",
      fabricante: "",
      modelo: "",
      qtde: 1,
      potencia: 0,
    });
    return;
  }
  function removeEquipment(index: number) {
    const currentProductList = [...infoHolder.homologacao.equipamentos].filter(
      (_, i) => i !== index,
    );
    setInfoHolder((prev) => ({
      ...prev,
      homologacao: { ...prev.homologacao, equipamentos: currentProductList },
    }));
    setChanges((prev) => ({ ...prev, "homologacao.equipamentos": currentProductList }));
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2 bg-primary/20 px-2 py-1 rounded w-fit">
        <Zap className="h-4 w-4 min-h-4 min-w-4" />
        <h1 className="text-xs tracking-tight font-medium text-start w-fit">EQUIPAMENTOS</h1>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-3/4">
            <SelectInput
              label="INVERSOR"
              value={
                inverterHolder.id
                  ? Inverters.filter((inverter) => inverter.id === inverterHolder.id)[0]
                  : null
              }
              handleChange={(value) =>
                setInverterHolder((prev) => ({
                  ...prev,
                  id: value.id,
                  fabricante: value.fabricante,
                  modelo: value.modelo,
                  potencia: value.potenciaNominal,
                }))
              }
              onReset={() =>
                setInverterHolder({
                  id: "",
                  fabricante: "",
                  modelo: "",
                  qtde: 1,
                  garantia: 10,
                  potencia: 0,
                })
              }
              selectedItemLabel="NÃO DEFINIDO"
              options={Inverters.map((inverter) => {
                return {
                  id: inverter.id,
                  label: `${inverter.fabricante} - ${inverter.modelo}`,
                  value: inverter,
                };
              })}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label="QTDE"
              value={inverterHolder.qtde}
              handleChange={(value) =>
                setInverterHolder((prev) => ({
                  ...prev,
                  qtde: Number(value),
                }))
              }
              placeholder="QTDE"
              width="100%"
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button
            variant={"ghost"}
            onClick={() => addInverterToEquipments()}
            size={"fit"}
            className="flex items-center gap-2 px-2 py-1 text-xs"
          >
            <Plus className="h-4 w-4" />
            ADICIONAR INVERSOR
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-3/4">
            <SelectInput
              label="MÓDULO"
              value={
                moduleHolder.id
                  ? Modules.filter((module) => module.id === moduleHolder.id)[0]
                  : null
              }
              handleChange={(value) =>
                setModuleHolder((prev) => ({
                  ...prev,
                  id: value.id,
                  fabricante: value.fabricante,
                  modelo: value.modelo,
                  potencia: value.potencia,
                }))
              }
              onReset={() =>
                setModuleHolder({
                  id: "",
                  fabricante: "",
                  modelo: "",
                  qtde: 1,
                  potencia: 0,
                  garantia: 10,
                })
              }
              selectedItemLabel="NÃO DEFINIDO"
              options={Modules.map((module) => {
                return {
                  id: module.id,
                  label: `${module.fabricante} - ${module.modelo}`,
                  value: module,
                };
              })}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <NumberInput
              label="QTDE"
              value={moduleHolder.qtde}
              handleChange={(value) =>
                setModuleHolder((prev) => ({
                  ...prev,
                  qtde: Number(value),
                }))
              }
              placeholder="QTDE"
              width="100%"
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button
            variant={"ghost"}
            onClick={() => addModuleToEquipments()}
            size={"fit"}
            className="flex items-center gap-2 px-2 py-1 text-xs"
          >
            <Plus className="h-4 w-4" />
            ADICIONAR MÓDULO
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
          <div className="w-full lg:w-[20%]">
            <SelectInput
              label="CATEGORIA"
              selectedItemLabel="NÃO DEFINIDO"
              options={[
                { id: 1, label: "INVERSOR", value: "INVERSOR" },
                { id: 2, label: "MÓDULO", value: "MÓDULO" },
              ]}
              value={personalizedEquipmentHolder.categoria}
              handleChange={(value) =>
                setPersonalizedEquipmentHolder((prev) => ({
                  ...prev,
                  categoria: value,
                }))
              }
              onReset={() => {
                setPersonalizedEquipmentHolder((prev) => ({
                  ...prev,
                  categoria: "MÓDULO",
                }));
              }}
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[30%]">
            <TextInput
              label="FABRICANTE"
              placeholder="FABRICANTE"
              value={personalizedEquipmentHolder.fabricante}
              handleChange={(value) =>
                setPersonalizedEquipmentHolder((prev) => ({
                  ...prev,
                  fabricante: value,
                }))
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[30%]">
            <TextInput
              label="MODELO"
              placeholder="MODELO"
              value={personalizedEquipmentHolder.modelo}
              handleChange={(value) =>
                setPersonalizedEquipmentHolder((prev) => ({
                  ...prev,
                  modelo: value,
                }))
              }
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[10%]">
            <NumberInput
              label="POTÊNCIA"
              value={personalizedEquipmentHolder.potencia || null}
              handleChange={(value) =>
                setPersonalizedEquipmentHolder((prev) => ({
                  ...prev,
                  potencia: Number(value),
                }))
              }
              placeholder="POTÊNCIA"
              width="100%"
            />
          </div>
          <div className="w-full lg:w-[10%]">
            <NumberInput
              label="QTDE"
              value={personalizedEquipmentHolder.qtde}
              handleChange={(value) =>
                setPersonalizedEquipmentHolder((prev) => ({
                  ...prev,
                  qtde: Number(value),
                }))
              }
              placeholder="QTDE"
              width="100%"
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button
            variant={"ghost"}
            onClick={() => addPersonalizedEquipment()}
            size={"fit"}
            className="flex items-center gap-2 px-2 py-1 text-xs"
          >
            <Plus className="h-4 w-4" />
            ADICIONAR PRODUTO PERSONALIZADO
          </Button>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="font-raleway mb-2 text-start leading-none font-bold tracking-tight">
          EQUIPAMENTOS A SEREM HOMOLOGADOS
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-[#15599a] px-2 py-1 text-white">
            <FaSolarPanel />
            <p className="text-xs font-medium tracking-tight">
              {getModulesPeakPotByProducts(infoHolder.homologacao.equipamentos as TProductItem[])}{" "}
              kWp EM MÓDULOS
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-[#fead41] px-2 py-1 text-white">
            <ImPower />
            <p className="tracking-tigh text-xs font-medium">
              {getInverterPeakPowerByProducts(
                infoHolder.homologacao.equipamentos as TProductItem[],
              )}{" "}
              kWp EM INVERSORES
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-around gap-2">
        {infoHolder.homologacao.equipamentos.length > 0 ? (
          infoHolder.homologacao.equipamentos.map((product, index) => (
            <div
              key={`${product.categoria}-${product.modelo}-${index}`}
              className="border-border flex w-full flex-col rounded-md border p-2 lg:w-[450px]"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1">
                    {renderProductCategoryIcon(product.categoria, 15)}
                  </div>
                  <p className="text-xs leading-none font-medium tracking-tight lg:text-sm">
                    <strong className="text-[#FF9B50]">{product.qtde}</strong> x {product.modelo}
                  </p>
                </div>

                <button
                  onClick={() => removeEquipment(index)}
                  type="button"
                  className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                >
                  <MdDelete style={{ color: "red" }} size={15} />
                </button>
              </div>

              <div className="mt-1 flex w-full items-center justify-end gap-2 pl-2">
                <div className="flex items-center gap-1">
                  <FaIndustry size={12} />
                  <p className="text-foreground text-[0.7rem] font-light lg:text-xs">
                    {product.fabricante}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <ImPower size={12} />
                  <p className="text-foreground text-[0.7rem] font-light lg:text-xs">
                    {product.potencia} W
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-foreground text-center font-light">Nenhum produto adicionado</div>
        )}
      </div>
    </div>
  );
}

export default EquipmentsComposition;
