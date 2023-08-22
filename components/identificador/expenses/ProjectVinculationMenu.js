import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaLink } from "react-icons/fa";
import SelectInput from "../../inputs/Select";
import { useClients } from "../../../utils/methods/query/clients";
import { toast } from "react-hot-toast";

function ProjectVinculationMenu({ linkClient, unlinkClient }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  // Getting clients and formatted clients
  const { data: clients = [] } = useClients(true);
  const clientsOptions = clients.map((client) => ({
    id: client._id,
    label: `(${client.qtde}) ${client.nomeDoContrato}`,
    value: client,
  }));
  const [selectedClient, setSelectedClient] = useState();
  function handleVinculation() {
    if (!selectedClient) {
      toast.error(
        "Nenhum projeto selecionado foi selecionado. Selecione algum para vincular."
      );
      return;
    }
    linkClient(selectedClient);
  }
  return (
    <div className="w-full flex flex-col">
      <div
        onClick={() => setMenuIsOpen((prev) => !prev)}
        className="w-fit self-center cursor-pointer flex items-center gap-2 justify-center text-blue-500 hover:text-blue-600 hover:scale-105 duration-300 ease-in-out"
      >
        <h1 className="font-medium">VINCULE UM PROJETO</h1>
        <FaLink />
      </div>
      <AnimatePresence>
        {menuIsOpen ? (
          <motion.div
            initial={{ opacity: 0.5, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex items-end border border-gray-200 shadow-sm p-3 mt-2 gap-2"
          >
            <div className="grow">
              <SelectInput
                label={"PROJETO AMPÈRE"}
                selectedItemLabel={"NÃO DEFINIDO"}
                value={selectedClient}
                options={clientsOptions}
                handleChange={(value) => setSelectedClient(value)}
                onReset={() => {
                  setSelectedClient(null);
                  unlinkClient();
                }}
                width={"100%"}
              />
            </div>
            <button
              onClick={handleVinculation}
              className="border p-3 rounded-md w-fit border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 duration-300 ease-in-out font-medium h-[46px]"
            >
              VINCULAR
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default ProjectVinculationMenu;
