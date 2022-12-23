import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import ModalNovoLead from "../../components/ModalNovoLead";
import axios from "axios";
import dayjs from "dayjs";
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
          <div
            onClick={() => {
              handleOpenModal(lead._id);
            }}
            key={lead._id}
            className={`grid grid-cols-6 lg:grid-cols-9 gap-2  w-full cursor-pointer border border-gray-200 p-3 hover:bg-blue-100 items-center`}
          >
            <p className="text-sm text-[#15599a] font-bold text-center">
              #{lead.codigosvb} - {lead.nome?.toUpperCase()}
            </p>
            <div className="hidden lg:flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-xs">
                RESPONSÁVEL
              </p>
              <p className="text-gray-600 text-center text-xs">
                {lead.responsavel}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-xs">
                TELEFONE
              </p>
              <p className="text-gray-600 text-center text-xs">
                {lead.telefone}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-xs">
                CIDADE
              </p>
              <p className="text-gray-600 text-center text-xs">
                {lead.cidade ? lead.cidade : "-"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-xs">
                DATA DE AQUISIÇÃO
              </p>
              <p className="text-gray-600 text-center text-xs">
                {lead.dataDeAquisicao
                  ? dayjs(lead.dataDeAquisicao).format("DD/MM/YYYY")
                  : "-"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-xs">
                DATA DE ENVIO
              </p>
              <p className="text-gray-600 text-center text-xs">
                {lead.dataDeEnvio
                  ? dayjs(lead.dataDeEnvio).format("DD/MM/YYYY")
                  : "-"}
              </p>
            </div>
            <div className="hidden lg:flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-xs">
                TEMPO P/ENVIO
              </p>
              <p className="text-gray-600 text-center text-xs">
                {lead.dataDeAquisicao && lead.dataDeEnvio
                  ? dayjs(lead.dataDeEnvio).diff(
                      dayjs(lead.dataDeAquisicao),
                      "day"
                    )
                  : "-"}
              </p>
            </div>
            <div className="hidden lg:flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-xs">
                CANAL
              </p>
              <p className="text-gray-600 text-center uppercase text-xs">
                {lead.canal ? lead.canal : "-"}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-600 text-center font-bold text-xs">
                CONSUMO
              </p>
              <p className="text-gray-600 text-center text-xs">
                {lead.consumo
                  ? lead.consumo.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "-"}
              </p>
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
