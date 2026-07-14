import { easeBackInOut } from "d3-ease";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import CheckboxInput from "@/components/inputs/Checkbox";
import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import TextInput from "@/components/inputs/Text";

import { Button } from "@/components/ui/button";
import { useEquipments } from "@/utils/methods/query/crm/equipments";
import { renderProductCategoryIcon } from "@/utils/methods/rendering";
import type { TInverter, TModule } from "@/utils/schemas/crm/kits.schema";
import type {
  TEquipment,
  TTechnicalAnalysis,
  TTechnicalAnalysisDTO,
} from "@/utils/schemas/technical-analysis";
import { ProductItemCategories } from "@/utils/select-options";
import { Box, CpuIcon, Plus } from "lucide-react";
import { AiFillCloseCircle, AiFillEdit } from "react-icons/ai";
import { FaIndustry, FaSolarPanel } from "react-icons/fa";
import { ImPower } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { TbWaveSine } from "react-icons/tb";
import PreviousEquipmentMenu from "./PreviousEquipmentMenu";
const variants = {
  hidden: {
    opacity: 0.2,
    scale: 0.95, // Scale down slightly
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Adjust the color and alpha as needed
    transition: {
      duration: 0.5,
      ease: easeBackInOut, // Use an easing function
    },
  },
  visible: {
    opacity: 1,
    scale: 1, // Scale down slightly
    backgroundColor: "rgba(255, 255, 255, 1)", // Normal background color
    transition: {
      duration: 0.5,
      ease: easeBackInOut, // Use an easing function
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05, // Scale down slightly
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Fading background color
    transition: {
      duration: 0.01,
      ease: easeBackInOut, // Use an easing function
    },
  },
};

type EquipmentBlockProps = {
  infoHolder: TTechnicalAnalysisDTO;
  setInfoHolder: React.Dispatch<React.SetStateAction<TTechnicalAnalysisDTO>>;
  changes: object;
  setChanges: React.Dispatch<React.SetStateAction<object>>;
};
function EquipmentBlock({ infoHolder, setInfoHolder, changes, setChanges }: EquipmentBlockProps) {
  const [editEnabled, setEditEnabled] = useState<boolean>(false);
  const [previousEquipmentMenuIsOpen, setPreviousEquipmentMenuIsOpen] = useState<boolean>(
    infoHolder.equipamentosAnteriores?.length > 0,
  );
  // Functionality for equipments control
  const [equipmentsType, setEquipmentsType] = useState<"modules" | "inverters" | "personalized">(
    "modules",
  );
  function removeEquipment(index: number) {
    const currenTEquipmentList = [...infoHolder.equipamentos];
    currenTEquipmentList.splice(index, 1);
    setInfoHolder((prev) => ({ ...prev, equipamentos: currenTEquipmentList }));
    setChanges((prev) => ({ ...prev, equipamentos: currenTEquipmentList }));
  }

  function addModuleToEquipments(data: TModule) {
    const newEquipmentsList = [
      ...infoHolder.equipamentos,
      { ...data, categoria: "MÓDULO" as const },
    ];
    setInfoHolder((prev) => ({ ...prev, equipamentos: newEquipmentsList }));
    setChanges((prev) => ({ ...prev, equipamentos: newEquipmentsList }));
  }
  function addInverterToEquipments(data: TInverter) {
    const newEquipmentsList = [
      ...infoHolder.equipamentos,
      { ...data, categoria: "INVERSOR" as const },
    ];
    setInfoHolder((prev) => ({ ...prev, equipamentos: newEquipmentsList }));
    setChanges((prev) => ({ ...prev, equipamentos: newEquipmentsList }));
  }
  function addPersonalizedProductToEquipments(data: TEquipment) {
    const newEquipmentsList = [...infoHolder.equipamentos, data];
    setInfoHolder((prev) => ({ ...prev, equipamentos: newEquipmentsList }));
    setChanges((prev) => ({ ...prev, equipamentos: newEquipmentsList }));
  }
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="bg-primary/80 flex w-full items-center justify-center gap-2 rounded-md p-2">
        <h1 className="font-bold text-white">EQUIPAMENTOS</h1>
        <button type="button" onClick={() => setEditEnabled((prev) => !prev)}>
          {!editEnabled ? <AiFillEdit color="white" /> : <AiFillCloseCircle color="#ff1736" />}
        </button>
      </div>
      <AnimatePresence>
        {editEnabled ? (
          <motion.div
            key={"editor"}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-2 flex w-full flex-col gap-2"
          >
            <div className="w-full flex items-center justify-center gap-2 flex-wrap">
              <Button
                variant={equipmentsType === "modules" ? "default" : "ghost"}
                size={"fit"}
                className="flex items-center gap-2 px-2 py-1 text-xs"
                onClick={() => setEquipmentsType("modules")}
              >
                <FaSolarPanel className="w-4 h-4 min-w-4 min-h-4" />
                MÓDULOS
              </Button>
              <Button
                variant={equipmentsType === "inverters" ? "default" : "ghost"}
                size={"fit"}
                className="flex items-center gap-2 px-2 py-1 text-xs"
                onClick={() => setEquipmentsType("inverters")}
              >
                <CpuIcon className="w-4 h-4 min-w-4 min-h-4" />
                INVERSORES
              </Button>
              <Button
                variant={equipmentsType === "personalized" ? "default" : "ghost"}
                size={"fit"}
                className="flex items-center gap-2 px-2 py-1 text-xs"
                onClick={() => setEquipmentsType("personalized")}
              >
                <Box className="w-4 h-4 min-w-4 min-h-4" />
                PERSONALIZADO
              </Button>
            </div>
            {equipmentsType === "modules" ? (
              <ModulesBlock addModuleToEquipments={addModuleToEquipments} />
            ) : null}
            {equipmentsType === "inverters" ? (
              <InvertersBlock addInverterToEquipments={addInverterToEquipments} />
            ) : null}
            {equipmentsType === "personalized" ? (
              <PersonalizedProductsBlock
                addPersonalizedProductToEquipments={addPersonalizedProductToEquipments}
              />
            ) : null}
          </motion.div>
        ) : null}
        <div className="mt-4 flex w-full flex-col flex-wrap justify-around gap-4 lg:flex-row">
          {infoHolder.equipamentos.length > 0 ? (
            infoHolder.equipamentos.map((equipment, index) => (
              <div
                key={`${equipment.id}-${index.toString()}`}
                className="border-border mt-1 flex w-full flex-col rounded-md border p-2 lg:w-[350px]"
              >
                <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
                  <div className="flex items-center gap-1">
                    <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full border border-black p-1 text-[15px]">
                      {renderProductCategoryIcon(equipment.categoria, 18)}
                    </div>
                    <p className="text-[0.6rem] leading-none font-medium tracking-tight lg:text-xs">
                      <strong className="text-[#FF9B50]">{equipment.qtde}</strong> x{" "}
                      {equipment.modelo}
                    </p>
                  </div>
                  <button
                    onClick={() => removeEquipment(index)}
                    type="button"
                    className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
                  >
                    <MdDelete color="red" size={15} />
                  </button>
                </div>
                <div className="flex w-full items-center justify-end gap-2 pl-2">
                  <div className="flex items-center gap-1">
                    <FaIndustry size={15} />
                    <p className="text-foreground text-[0.6rem] font-light">
                      {equipment.fabricante}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <ImPower size={15} />
                    <p className="text-foreground text-[0.6rem] font-light">
                      {equipment.potencia} W
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-foreground w-full text-center text-sm font-medium tracking-tight">
              Nenhum equipamento adicionado à lista.
            </p>
          )}
        </div>
      </AnimatePresence>
      <div className="my-2 flex w-full items-center justify-center">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="AMPLIAÇÃO DE SISTEMA"
            labelTrue="AMPLIAÇÃO DE SISTEMA"
            checked={previousEquipmentMenuIsOpen}
            handleChange={(value) => setPreviousEquipmentMenuIsOpen(value)}
          />
        </div>
      </div>
      {previousEquipmentMenuIsOpen ? (
        <PreviousEquipmentMenu
          infoHolder={infoHolder as TTechnicalAnalysis}
          setInfoHolder={setInfoHolder as React.Dispatch<React.SetStateAction<TTechnicalAnalysis>>}
        />
      ) : null}
    </div>
  );
}

export default EquipmentBlock;

type ModulesBlockProps = {
  addModuleToEquipments: (data: TModule) => void;
};
function ModulesBlock({ addModuleToEquipments }: ModulesBlockProps) {
  const { data: modules } = useEquipments({ category: "MÓDULO" });
  const [moduleHolder, setModuleHolder] = useState<TModule>({
    id: "",
    fabricante: "",
    modelo: "",
    qtde: 1,
    potencia: 0,
    garantia: 10,
  });
  function updateModule(changes: Partial<TModule>) {
    setModuleHolder((prev) => ({ ...prev, ...changes }));
  }

  function validateAndAddModuleToEquipments(info: TModule) {
    if (!info.id && !info.fabricante && !info.modelo) {
      return toast.error("Módulo inválido. Por favor, tente novamente.");
    }
    if (info.qtde <= 0) {
      return toast.error("Por favor, preencha um quantidade de módulos válida.");
    }

    return addModuleToEquipments(info);
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-col lg:flex-row items-center gap-2">
        <div className="w-full lg:w-2/4">
          <SelectInput
            label="MÓDULO"
            value={moduleHolder.id}
            handleChange={(selectedId) => {
              const equivalentModule = modules?.find((module) => module._id === selectedId);
              if (equivalentModule) {
                return updateModule({
                  id: equivalentModule._id,
                  fabricante: equivalentModule.fabricante,
                  modelo: equivalentModule.modelo,
                  potencia: equivalentModule.potencia ?? 0,
                });
              }
              return updateModule({
                id: "",
                fabricante: "",
                modelo: "",
                potencia: 0,
                qtde: 1,
                garantia: 10,
              });
            }}
            onReset={() =>
              updateModule({
                id: "",
                fabricante: "",
                modelo: "",
                potencia: 0,
                qtde: 1,
                garantia: 10,
              })
            }
            options={
              modules?.map((module) => ({
                id: module._id,
                label: `${module.fabricante} - ${module.modelo}`,
                value: module._id,
              })) || []
            }
            selectedItemLabel="NÃO DEFINIDO"
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="QTDE"
            value={moduleHolder.qtde}
            handleChange={(value) => updateModule({ qtde: value })}
            placeholder="Preencha a quantidade de módulos..."
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="GARANTIA"
            value={moduleHolder.garantia}
            handleChange={(value) => updateModule({ garantia: value })}
            placeholder="Preencha a garantia dos módulos..."
            width="100%"
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-end">
        <Button
          variant={"ghost"}
          onClick={() => validateAndAddModuleToEquipments(moduleHolder)}
          size={"fit"}
          className="flex items-center gap-2 px-2 py-1 text-xs"
        >
          <Plus className="w-4 h-4 min-w-4 min-h-4" />
          ADICIONAR MÓDULO
        </Button>
      </div>
    </div>
  );
}
type InvertersBlockProps = {
  addInverterToEquipments: (data: TInverter) => void;
};
function InvertersBlock({ addInverterToEquipments }: InvertersBlockProps) {
  const { data: inverters } = useEquipments({ category: "INVERSOR" });
  const [inverterHolder, setInverterHolder] = useState<TInverter>({
    id: "",
    fabricante: "",
    modelo: "",
    qtde: 1,
    potencia: 0,
    garantia: 10,
  });
  function updateInverter(changes: Partial<TInverter>) {
    setInverterHolder((prev) => ({ ...prev, ...changes }));
  }

  function validateAndAddInverterToEquipments(info: TInverter) {
    if (!info.id && !info.fabricante && !info.modelo) {
      return toast.error("Inversor inválido. Por favor, tente novamente.");
    }
    if (info.qtde <= 0) {
      return toast.error("Por favor, preencha um quantidade de inversores válida.");
    }

    return addInverterToEquipments(info);
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-col lg:flex-row items-center gap-2">
        <div className="w-full lg:w-2/4">
          <SelectInput
            label="INVERSOR"
            value={inverterHolder.id}
            handleChange={(selectedId) => {
              const equivalentInverter = inverters?.find((inverter) => inverter._id === selectedId);
              if (equivalentInverter) {
                return updateInverter({
                  id: equivalentInverter._id,
                  fabricante: equivalentInverter.fabricante,
                  modelo: equivalentInverter.modelo,
                  potencia: equivalentInverter.potencia ?? 0,
                });
              }
              return updateInverter({
                id: "",
                fabricante: "",
                modelo: "",
                potencia: 0,
                qtde: 1,
                garantia: 10,
              });
            }}
            onReset={() =>
              updateInverter({
                id: "",
                fabricante: "",
                modelo: "",
                potencia: 0,
                qtde: 1,
                garantia: 10,
              })
            }
            options={
              inverters?.map((inverter) => ({
                id: inverter._id,
                label: `${inverter.fabricante} - ${inverter.modelo}`,
                value: inverter._id,
              })) || []
            }
            selectedItemLabel="NÃO DEFINIDO"
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="QTDE"
            value={inverterHolder.qtde}
            handleChange={(value) => updateInverter({ qtde: value })}
            placeholder="Preencha a quantidade de inversores..."
            width="100%"
          />
        </div>
        <div className="w-full lg:w-1/4">
          <NumberInput
            label="GARANTIA"
            value={inverterHolder.garantia}
            handleChange={(value) => updateInverter({ garantia: value })}
            placeholder="Preencha a garantia dos inversores..."
            width="100%"
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-end">
        <Button
          variant={"ghost"}
          onClick={() => validateAndAddInverterToEquipments(inverterHolder)}
          size={"fit"}
          className="flex items-center gap-2 px-2 py-1 text-xs"
        >
          <Plus className="w-4 h-4 min-w-4 min-h-4" />
          ADICIONAR INVERSOR
        </Button>
      </div>
    </div>
  );
}
type PersonalizedProductsBlockProps = {
  addPersonalizedProductToEquipments: (data: TEquipment) => void;
};
function PersonalizedProductsBlock({
  addPersonalizedProductToEquipments,
}: PersonalizedProductsBlockProps) {
  const [personalizedProductHolder, setPersonalizedProductHolder] = useState<TEquipment>({
    id: null,
    categoria: "OUTROS",
    fabricante: "",
    modelo: "",
    qtde: 1,
    potencia: 0,
  });
  function updatePersonalizedProduct(changes: Partial<TEquipment>) {
    setPersonalizedProductHolder((prev) => ({ ...prev, ...changes }));
  }

  function validateAndAddPersonalizedProductToEquipments(info: TEquipment) {
    if (!info.id && !info.fabricante && !info.modelo) {
      return toast.error("Produto personalizado inválido. Por favor, tente novamente.");
    }
    if (info.qtde <= 0) {
      return toast.error("Por favor, preencha um quantidade de produto personalizado válida.");
    }

    return addPersonalizedProductToEquipments(info);
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-col lg:flex-row items-center gap-2">
        <div className="w-full lg:w-[30%]">
          <SelectInput
            label="CATEGORIA"
            selectedItemLabel="NÃO DEFINIDO"
            options={ProductItemCategories}
            value={personalizedProductHolder.categoria}
            handleChange={(value) => updatePersonalizedProduct({ categoria: value })}
            onReset={() => {
              updatePersonalizedProduct({ categoria: "OUTROS" });
            }}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-[40%]">
          <TextInput
            label="FABRICANTE"
            placeholder="FABRICANTE"
            value={personalizedProductHolder.fabricante}
            handleChange={(value) => updatePersonalizedProduct({ fabricante: value })}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-[40%]">
          <TextInput
            label="MODELO"
            placeholder="MODELO"
            value={personalizedProductHolder.modelo}
            handleChange={(value) => updatePersonalizedProduct({ modelo: value })}
            width="100%"
          />
        </div>
        <div className="w-full lg:w-[15%]">
          <NumberInput
            label="POTÊNCIA"
            value={personalizedProductHolder.potencia || null}
            handleChange={(value) => updatePersonalizedProduct({ potencia: value })}
            placeholder="POTÊNCIA"
            width="100%"
          />
        </div>
        <div className="w-full lg:w-[15%]">
          <NumberInput
            label="QTDE"
            value={personalizedProductHolder.qtde}
            handleChange={(value) => updatePersonalizedProduct({ qtde: value })}
            placeholder="QTDE"
            width="100%"
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-end">
        <Button
          variant={"ghost"}
          onClick={() => validateAndAddPersonalizedProductToEquipments(personalizedProductHolder)}
          size={"fit"}
          className="flex items-center gap-2 px-2 py-1 text-xs"
        >
          <Plus className="w-4 h-4 min-w-4 min-h-4" />
          ADICIONAR PRODUTO PERSONALIZADO
        </Button>
      </div>
    </div>
  );
}
