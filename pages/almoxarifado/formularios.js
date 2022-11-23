import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ModalNovoFormAlmoxarifado from "../../components/ModalNovoFormAlmoxarifado";
import ModalFormAlmoxarifado from "../../components/ModalFormAlmoxarifado";
function Formularios({ credentials, setCredentials }) {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalForm, setModalForm] = useState({});
  function getForms() {
    axios
      .get("/api/almoxarifado/formularios")
      .then((res) => setForms(res.data));
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Almoxarifado")) {
        router.push("/");
      } else {
        getForms();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Almoxarifado")) {
          router.push("/");
        } else {
          getForms();
        }
      }
    }
  }, []);
  function getCardColor(status) {
    if (status == true) {
      return "bg-green-100";
    } else if (status == false) {
      return "bg-red-100";
    } else {
      return "bg-[#fff]";
    }
  }
  return (
    <div className="p-6 grow">
      <div className="border-b border-gray-200 pb-2">
        <h1 className="text-[#fead61] font-raleway font-bold text-xl">
          FORMULÁRIOS
        </h1>
      </div>
      <div
        onClick={() => setCreateModalIsOpen(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
      >
        <p className="uppercase font-bold text-sm">Novo Formulário</p>
      </div>
      <div className="flex  justify-around gap-3 mt-4 flex-wrap">
        {forms.map((form) => (
          <div
            key={form._id}
            onClick={() => {
              setModalForm(form);
              setModalIsOpen(true);
            }}
            className={`w-[250px] lg:w-[450px] ${getCardColor(
              form.efetivado
            )} cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">{form.nomeDoContrato}</p>
              <p className="text-xs text-[#15599a]">#{form.codigoProjeto}</p>
            </div>
            <div className="flex items-center justify-center">
              <div>
                <span className="text-xxs">RESPONSÁVEL</span>
                <p className="text-xs text-gray-600">
                  {form.responsavel && form.responsavel}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalFormAlmoxarifado
          info={modalForm}
          setModalIsOpen={setModalIsOpen}
          getForms={getForms}
        />
      )}
      {createModalIsOpen && (
        <ModalNovoFormAlmoxarifado
          getForms={getForms}
          setModalIsOpen={setCreateModalIsOpen}
        />
      )}
    </div>
  );
}

export default Formularios;
