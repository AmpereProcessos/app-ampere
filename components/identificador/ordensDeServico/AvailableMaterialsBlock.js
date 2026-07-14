import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { BsSuitDiamondFill } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineAddCircle } from "react-icons/md";
import { VscChromeClose } from "react-icons/vsc";
import NumberInput from "../../inputs/Number";
import TextInput from "../../inputs/Text";

function AvailableMaterialsBlock({ osInfo, setOsInfo, useKitInformation }) {
  const [equipmentHolder, setEquipmentHolder] = useState({ qtde: null, descricao: null });
  const [addMenuIsOpen, setAddMenuIsOpen] = useState(false);
  function addMaterial() {
    if (!equipmentHolder.qtde || equipmentHolder.qtde < 0) {
      toast.error("Preencha uma quantidade válida.");
      return;
    }
    if (!equipmentHolder.descricao || equipmentHolder.descricao?.trim().length == 0) {
      toast.error("Preencha uma descrição válida.");
    }
    const currentMaterials = osInfo.equipamentos.disponivel
      ? [...osInfo.equipamentos.disponivel]
      : [];
    currentMaterials.push({ qtde: equipmentHolder.qtde, descricao: equipmentHolder.descricao });
    return setOsInfo((prev) => ({
      ...prev,
      equipamentos: { ...prev.equipamentos, disponivel: currentMaterials },
    }));
  }
  function removeMaterial(index) {
    const currentMaterials = [...osInfo.equipamentos.disponivel];
    currentMaterials.splice(index, 1);
    return setOsInfo((prev) => ({
      ...prev,
      equipamentos: { ...prev.equipamentos, disponivel: currentMaterials },
    }));
  }
  return (
    <div className="flex h-full max-h-[300px] min-h-[300px] w-full flex-col rounded-lg border border-cyan-500 p-3">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-center font-sans font-bold text-primary">MATERIAIS DISPONÍVEIS</h1>
        {addMenuIsOpen ? (
          <button
            onClick={() => setAddMenuIsOpen(false)}
            type="button"
            className="flex items-center justify-center rounded-lg p-1 duration-300 ease-linear hover:scale-105 hover:bg-red-200"
          >
            <VscChromeClose style={{ color: "red" }} />
          </button>
        ) : (
          <button
            onClick={() => setAddMenuIsOpen(true)}
            className="flex items-center justify-center text-green-500"
          >
            <MdOutlineAddCircle style={{ fontSize: "25px" }} />
          </button>
        )}
      </div>
      {useKitInformation ? (
        <button
          onClick={useKitInformation}
          className="text-foreground w-fit self-center rounded p-1 text-xs font-medium duration-300 ease-in-out hover:bg-blue-50 hover:text-cyan-500"
        >
          USAR MATERIAIS DO KIT
        </button>
      ) : null}

      {addMenuIsOpen ? (
        <div className="flex w-full items-center gap-1">
          <div className="w-[70%]">
            <TextInput
              showLabel={false}
              placeholder={"Descrição do item..."}
              value={equipmentHolder.descricao}
              handleChange={(value) =>
                setEquipmentHolder((prev) => ({ ...prev, descricao: value }))
              }
              width={"100%"}
            />
          </div>
          <div className="w-[20%]">
            <NumberInput
              showLabel={false}
              placeholder={"Quantidade do item..."}
              value={equipmentHolder.qtde}
              handleChange={(value) => setEquipmentHolder((prev) => ({ ...prev, qtde: value }))}
              width={"100%"}
            />
          </div>
          <div className="flex w-[10%] items-center justify-center">
            <button
              onClick={() => addMaterial()}
              className="flex items-center justify-center text-green-500"
            >
              <IoIosAdd />
            </button>
          </div>
        </div>
      ) : null}
      <div className="overscroll-y scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/20 mt-2 flex w-full grow flex-col overflow-y-auto px-2">
        {osInfo.equipamentos.disponivel && osInfo.equipamentos.disponivel.length > 0 ? (
          osInfo.equipamentos.disponivel.map((equip, index) => (
            <div key={index} className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <BsSuitDiamondFill />
                <p className="text-foreground text-xs tracking-tight">
                  {equip.qtde ? `${equip.qtde}x ` : ""}
                  {equip.descricao}
                </p>
              </div>
              <button
                onClick={() => removeMaterial(index)}
                className="flex items-center justify-center text-sm text-red-300 hover:text-red-500"
              >
                <AiFillDelete />
              </button>
            </div>
          ))
        ) : (
          <div className="flex grow items-center justify-center">
            <p className="text-foreground text-center text-sm italic">
              Nenhum material na lista de disponíveis....
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AvailableMaterialsBlock;
