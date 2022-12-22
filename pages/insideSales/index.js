import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import ModalNovoLead from "../../components/ModalNovoLead";
import axios from "axios";
function InsideSales() {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const { credentials, setCredentials } = useContext(AppContext);
  const [modalNovoLead, setModalNovoLead] = useState(false);

  function getLeads() {
    axios
      .post("/api/insideSales", { responsavel: "DEVISSON LIMA" })
      .then((res) => setLeads(res.data));
  }
  useEffect(() => {
    if (credentials.accessibleRoutes.includes("InsideSales")) {
      getLeads();
    } else {
      router.push("/");
    }
  }, []);
  console.log(leads);
  return (
    <div className="flex flex-col p-6 grow">
      <div className="flex border-b border-gray-200 pb-2">
        <h1 className="font-bold uppercase text-2xl text-[#15599a] font-raleway text-center">
          ACOMPANHAMENTO DE OPORTUNIDADES
        </h1>
      </div>
      <div className="flex flex-wrap justify-around mt-4 gap-3">
        {leads.map((lead) => (
          <div
            onClick={() => {
              handleOpenModal(lead._id);
            }}
            key={lead._id}
            className={`w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700 font-bold">
                {lead.nome?.toUpperCase()}
              </p>
              <p className="text-xs text-[#15599a] font-bold">
                #{lead.codigosvb}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="hidden lg:flex lg:flex-col">
                <span className="text-xxs">RESPONSÁVEL</span>
                <p className={`text-xs text-green-600`}>
                  {lead.responsavel ? lead.responsavel : "-"}
                </p>
              </div>
              <div className="text-end">
                <span className="text-xxs text-end">TELEFONE</span>
                <p className="text-xs text-center text-gray-600">
                  {lead.telefone ? lead.telefone : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        onClick={() => setModalNovoLead(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
      >
        <p className="uppercase font-bold text-sm">NOVO LEAD</p>
      </div>
      {modalNovoLead && <ModalNovoLead setModalIsOpen={setModalNovoLead} />}
    </div>
  );
}

export default InsideSales;
