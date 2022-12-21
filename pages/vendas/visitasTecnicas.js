import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext, AppProvider } from "../../context/AppContext";
import Link from "next/link";
import ModalVisitaTecnicaVendedor from "../../components/ModalVisitaTecnicaVendedor";
function VisitasTecnicas({ setCredentials }) {
  const { credentials } = useContext(AppContext);
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalForm, setModalForm] = useState({});
  function getForms() {
    axios
      .post("/api/solicitacoes/byVendedor", {
        vendedor: credentials.vendedor,
        tipo: "VISITA",
      })
      .then((res) => {
        setForms(res.data);
        setFilteredForms(res.data);
      });
  }
  useEffect(() => {
    setCredentials(credentials);
    getForms();
  }, []);
  return (
    <div className="p-6 flex flex-col grow bg-[#fff]">
      <div className="flex border-b border-gray-200">
        <h1 className="text-[#15599a] font-bold text-xl">
          SEUS FORMULÁRIOS DE VISITA TÉCNICA
        </h1>
      </div>
      <div className="flex flex-wrap justify-around mt-4 gap-3">
        {filteredForms.map((solicitacao) => (
          <div
            onClick={() => {
              setModalForm(solicitacao);
              setModalIsOpen(true);
            }}
            key={solicitacao._id}
            className={`flex flex-col w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
          >
            <div className="flex justify-center">
              <h1 className="text-xs text-[#15599a] font-bold">
                {solicitacao.nomeDoCliente ? solicitacao.nomeDoCliente : "-"}
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">VENDEDOR</span>
                <p className="text-xs text-gray-600">
                  {solicitacao.nomeVendedor ? solicitacao.nomeVendedor : "-"}
                </p>
              </div>
              <div>
                <span className="text-xxs">CIDADE</span>
                <p className="text-xs text-gray-600">
                  {solicitacao.cidade ? solicitacao.cidade : "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href="/publico/formVisitaTecnica">
        <a className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150">
          <p className="uppercase font-bold text-sm">SOLICITAR VISITA</p>
        </a>
      </Link>
      {modalIsOpen && (
        <ModalVisitaTecnicaVendedor
          info={modalForm}
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default VisitasTecnicas;
