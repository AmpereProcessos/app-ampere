import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import ModalNovoLead from "../../components/ModalNovoLead";
import SelectInput from "../../components/SelectInput";
import axios from "axios";
import dayjs from "dayjs";
import LeadCard from "../../components/LeadCard";
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
          ACOMPANHAMENTO DE OPORTUNIDADES ({leads.length})
        </h1>
      </div>
      <div className="flex flex-wrap justify-around mt-4 gap-3">
        {leads.map((lead) => (
          <LeadCard key={lead._id} lead={lead} getLeads={getLeads} />
        ))}
      </div>
      <div
        onClick={() => setModalNovoLead(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
      >
        <p className="uppercase font-bold text-sm">NOVO LEAD</p>
      </div>
      {modalNovoLead && (
        <ModalNovoLead setModalIsOpen={setModalNovoLead} getLeads={getLeads} />
      )}
    </div>
  );
}

export default InsideSales;
