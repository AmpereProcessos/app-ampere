import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalFormSolicitacao from "../../components/ModalFormSolicitacao";
import { useRouter } from "next/router";
function FormulariosSolicitacao({ credentials, setCredentials }) {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalSolicitacao, setModalSolicitacao] = useState({});
  const [filteredSolicitacoes, setFilteredSolicitacoes] = useState([]);
  const router = useRouter();
  function getFormularios() {
    axios.get("/api/solicitacoes/contrato").then((res) => {
      setSolicitacoes(res.data);
      setFilteredSolicitacoes(res.data);
    });
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("PPS")) {
        router.push("/");
      } else getFormularios();
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("PPS")) {
          router.push("/");
        } else getFormularios();
      }
    }
  }, []);
  console.log(solicitacoes);
  return (
    <div className="p-6 grow flex flex-col">
      <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
        FORMULÁRIOS DE CONTRATO
      </p>
      <div className="flex  justify-around gap-3 mt-4 flex-wrap">
        {solicitacoes.map((solicitacao) => (
          <div
            key={solicitacao._id}
            onClick={() => {
              setModalIsOpen(true);
              setModalSolicitacao(solicitacao);
            }}
            className="flex flex-col w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
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
        <ModalFormSolicitacao
          solicitacao={modalSolicitacao}
          setModalIsOpen={setModalIsOpen}
        />
      )}
    </div>
  );
}

export default FormulariosSolicitacao;
