import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

import TextInput from "../../../inputs/Text";
import SelectInput from "../../../inputs/Select";
import MultipleSelectInput from "../../../inputs/MultipleSelect";
import LoadingPage from "../../../utils/LoadingPage";
import OpenCallCard from "./OpenCallCard";
import ModalCallPPS, { responsibles } from "../../../ModalCallPPS";

import { useOpenPPSCalls, usePPSCall } from "../../../../utils/methods/query/ppsCalls";
import { ppsCallStatus } from "../../../../utils/select-options";

function OpenCalls() {
  const { data: calls, isLoading, isFetched, filters, setFilters } = useOpenPPSCalls();

  const [modalCallIsOpen, setModalCallIsOpen] = useState(false);
  const [modalCallId, setModalCallId] = useState();
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  async function handleOpenModal(id) {
    setModalCallId(id);
    setModalCallIsOpen(true);
  }
  return (
    <div className="bg-background border-border flex h-[1200px] w-full flex-col border p-4 shadow-xl lg:h-[720px]">
      <div className="border-border flex flex-col items-center justify-between border-b p-1">
        <div className="flex w-full items-center justify-between">
          <div className="font-Raleway flex flex-wrap items-center justify-center gap-2">
            <p className="text-center text-xl font-bold text-[#15599a] uppercase">
              Chamados abertos
            </p>
            <p className="font-bold text-[#fead61]">({isFetched ? calls.length : "..."})</p>
          </div>
          {filterMenuVisible ? (
            <div className="text-foreground cursor-pointer hover:text-blue-400">
              <IoMdArrowDropupCircle
                style={{ fontSize: "25px" }}
                onClick={() => setFilterMenuVisible(false)}
              />
            </div>
          ) : (
            <div className="text-foreground cursor-pointer hover:text-blue-400">
              <IoMdArrowDropdownCircle
                style={{ fontSize: "25px" }}
                onClick={() => setFilterMenuVisible(true)}
              />
            </div>
          )}
        </div>
        <AnimatePresence>
          {filterMenuVisible ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 flex w-full flex-col gap-y-2"
            >
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 lg:flex-row">
                <TextInput
                  label="NOME DO VENDEDOR"
                  placeholder={"Digite aqui o nome do vendedor..."}
                  value={filters.sellerName}
                  handleChange={(value) => setFilters((prev) => ({ ...prev, sellerName: value }))}
                />
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    label="STATUS DO CHAMADO"
                    selectedItemLabel={"TODOS OS STATUS"}
                    options={ppsCallStatus}
                    selected={filters.status}
                    handleChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                    onReset={(value) => setFilters((prev) => ({ ...prev, status: [] }))}
                    width={"100%"}
                  />
                </div>
                <div className="w-full lg:w-[250px]">
                  <MultipleSelectInput
                    label="RESPONSÁVEL"
                    selectedItemLabel={"TODOS OS RESPONSÁVEIS"}
                    options={responsibles.map((resp, index) => ({
                      id: index + 1,
                      label: resp.apelido,
                      value: resp.apelido,
                    }))}
                    selected={filters.responsible}
                    handleChange={(value) =>
                      setFilters((prev) => ({ ...prev, responsible: value }))
                    }
                    onReset={() => setFilters((prev) => ({ ...prev, responsible: [] }))}
                    width={"100%"}
                  />
                </div>
                {/* <FilterButton text={'FILTRAR'} icon={<AiOutlineSearch />} handleClick={filterOpenCalls} /> */}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="overscroll-y scrollbar-thin scrollbar-track-primary/20 scrollbar-thumb-primary/20 mt-2 flex grow flex-wrap justify-around gap-2 overflow-y-auto px-2">
        {isLoading ? <LoadingPage /> : null}
        {isFetched ? (
          calls?.length > 0 ? (
            calls.map((call) => (
              <OpenCallCard
                key={call._id}
                call={call}
                handleOpenModal={(call) => handleOpenModal(call._id)}
              />
            ))
          ) : (
            <div className="flex w-full grow flex-col items-center justify-center">
              <p className="text-lg font-black text-[#fead41]">EBA !!!</p>
              <p className="text-md text-foreground font-medium italic">
                Não há chamados em aberto...
              </p>
            </div>
          )
        ) : null}
      </div>
      {modalCallIsOpen && (
        <ModalCallPPS
          callId={modalCallId}
          modalIsOpen={modalCallIsOpen}
          closeModal={() => setModalCallIsOpen(false)}
        />
      )}
    </div>
  );
}

export default OpenCalls;
