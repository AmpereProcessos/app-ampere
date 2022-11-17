import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalSolicitacaoVendas from "../../components/ModalSolicitacaoVendas";

function FormulariosVendedor({ setCredentials, credentials }) {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalSolicitacao, setModalSolicitacao] = useState({});
  function getProjects(credenciais) {
    axios
      .post("/api/solicitacoes/byVendedor", {
        vendedor: credenciais.vendedor,
      })
      .then((res) => {
        setForms(res.data);
        setFilteredForms(res.data);
      });
  }
  function handleUpdates(id) {
    getProjects(credentials);
    let changedObj = forms.filter((project) => project._id == id);
    setModalSolicitacao(changedObj[0]);
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Vendas")) {
        router.push("/");
      } else {
        getProjects(storedCredentials);
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Vendas")) {
          router.push("/");
        } else {
          getProjects(credentials);
        }
      }
    }
  }, []);
  function getCardColor(statusAprovacao) {
    if (statusAprovacao == true) {
      return "bg-green-100";
    } else if (statusAprovacao == false) {
      return "bg-red-100";
    } else {
      return "bg-[#fff]";
    }
  }
  console.log(modalSolicitacao);
  return (
    <div className="p-6 flex flex-col grow bg-[#fff]">
      <div className="flex border-b border-gray-200">
        <h1 className="text-[#15599a] font-bold text-xl">SEUS FORMULÁRIOS</h1>
      </div>
      <div className="flex flex-wrap justify-around mt-4 gap-3">
        {filteredForms.map((solicitacao) => (
          <div
            key={solicitacao._id}
            onClick={() => {
              setModalIsOpen(true);
              setModalSolicitacao(solicitacao);
            }}
            className={`flex flex-col ${getCardColor(
              solicitacao.aprovacao
            )} w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
          >
            <div className="flex justify-center">
              <h1 className="text-xs text-[#15599a] font-bold">
                {solicitacao.nomeDoContrato}
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xxs">VENDEDOR</span>
                <p className="text-xs text-gray-600">
                  {solicitacao.nomeVendedor && solicitacao.nomeVendedor}
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
      {modalIsOpen && (
        <ModalSolicitacaoVendas
          editable={modalSolicitacao.aprovacao == false}
          info={modalSolicitacao}
          setModalIsOpen={setModalIsOpen}
          handleUpdates={handleUpdates}
        />
      )}
    </div>
  );
}

export default FormulariosVendedor;
