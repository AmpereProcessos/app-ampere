import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ModalCallSuprimentos from "../../components/ModalCallSuprimentos";
import { AppContext } from "../../context/AppContext";

function ChamadosSuprimentos() {
  const router = useRouter();
  const { credentials } = useContext(AppContext);

  // Data
  const [modalAberta, setModalAberta] = useState(false);
  const [modalChamado, setModalChamado] = useState({});
  const [chamadosAbertos, setChamadosAbertos] = useState({
    geral: undefined,
    filtrados: undefined,
  });
  const [chamadosFechados, setChamadosFechados] = useState({
    geral: undefined,
    filtrados: undefined,
  });
  // Fetch Functions
  function getChamados() {
    axios.get("/api/calls/suprimentos/mainData").then((res) => {
      setChamadosAbertos({
        geral: res.data.abertos,
        filtrados: res.data.abertos,
      });
      setChamadosFechados({
        geral: res.data.fechados,
        filtrados: res.data.fechados,
      });
    });
  }
  // Utils functions
  function handleAbrirModal(info) {
    setModalChamado(info);
    setModalAberta(true);
  }
  useEffect(() => {
    if (credentials.accessibleRoutes.includes("Suprimentos")) {
      getChamados();
    } else {
      router.push("/");
    }
  }, []);
  console.log(chamadosAbertos);
  return (
    <div className="flex flex-col gap-y-2 bg-gray-100 grow p-6 w-full">
      <div className="flex gap-2 items-center justify-center shadow-lg border border-gray-200 p-3 bg-[#fff]">
        <h1 className="text-center font-bold text-[#15599a] text-xl">
          CHAMADOS DE SUPRIMENTOS
        </h1>
        <button className="border border-[#fead61] text-[#fead61] hover:text-black hover:bg-[#fead61] font-bold p-2 rounded">
          BUSCAR CHAMADOS
        </button>
      </div>
      <div className="flex flex-col bg-[#fff] border border-gray-200 shadow-lg">
        <div className="flex flex-col items-center border-b border-gray-200 pb-2">
          <h1 className="text-center text-[#15599a] font-bold text-lg py-2">
            CHAMADOS ABERTOS
          </h1>
        </div>
        <div className="flex justify-around flex-wrap gap-2 w-full h-[600px] p-4 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {chamadosAbertos.filtrados ? (
            chamadosAbertos.filtrados.length > 0 ? (
              chamadosAbertos.filtrados.map((chamado) => (
                <div
                  key={chamado._id}
                  onClick={() => handleAbrirModal(chamado)}
                  className={`w-[420px] h-[160px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
                >
                  <div className="flex justify-between gap-3 items-center w-full">
                    <h1 className="uppercase text-base font-bold">
                      <strong className="text-[#15599a]">
                        {chamado.codigoProjeto}
                      </strong>{" "}
                      {chamado.nomeDoContrato}
                    </h1>
                    <p
                      className={`text-xs text-center font-bold border-2 border-yellow-500 text-yellow-500 p-1 rounded-lg`}
                    >
                      {chamado.status}
                    </p>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="text-gray-500 font-bold text-xs">
                      FORNECEDOR
                    </p>
                    <p className="text-[#fead61] font-bold text-xs">
                      {chamado.fornecedor}
                    </p>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="text-gray-500 font-bold text-xs">AVARIAS</p>
                    <p className="text-red-500 font-bold text-xs">
                      {chamado.avarias ? "SIM" : "NÃO"}
                    </p>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="text-gray-500 font-bold text-xs">
                      MATERIAL FALTANDO
                    </p>
                    <p className="text-red-500 font-bold text-xs">
                      {chamado.entregaFaltando ? "SIM" : "NÃO"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center italic text-gray-700">
                SEM CHAMADOS ABERTOS
              </p>
            )
          ) : (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col mt-4 bg-[#fff] border border-gray-200 shadow-lg">
        <div className="flex flex-col items-center border-b border-gray-200 pb-2">
          <h1 className="text-center text-[#15599a] font-bold text-lg py-2">
            CHAMADOS FECHADOS
          </h1>
        </div>
        <div className="flex justify-around flex-wrap gap-2 w-full h-[600px] p-4 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {chamadosFechados.filtrados ? (
            chamadosFechados.filtrados.length > 0 ? (
              chamadosFechados.filtrados.map((chamado) => (
                <div
                  onClick={() => handleAbrirModal(chamado)}
                  key={chamado._id}
                  className={`w-[420px] h-[160px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
                >
                  <div className="flex justify-between gap-3 items-center w-full">
                    <h1 className="uppercase text-base font-bold">
                      <strong className="text-[#15599a]">
                        {chamado.codigoProjeto}
                      </strong>{" "}
                      {chamado.nomeDoContrato}
                    </h1>
                    <p
                      className={`text-xs text-center font-bold border-2 border-green-500 text-green-500 p-1 rounded-lg`}
                    >
                      {chamado.status}
                    </p>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="text-gray-500 font-bold text-xs">
                      FORNECEDOR
                    </p>
                    <p className="text-[#15599a] font-bold text-xs">
                      {chamado.fornecedor}
                    </p>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="text-gray-500 font-bold text-xs">
                      DATA DE ENTREGA
                    </p>
                    <p className="text-[#15599a] font-bold text-xs">
                      {chamado.dataEntrega
                        ? dayjs(chamado.dataEntrega).format("DD/MM/YYYY")
                        : "-"}
                    </p>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="text-gray-500 font-bold text-xs">AVARIAS</p>
                    <p className="text-red-500 font-bold text-xs">
                      {chamado.avarias ? "SIM" : "NÃO"}
                    </p>
                  </div>
                  <div className="flex justify-between mt-3">
                    <p className="text-gray-500 font-bold text-xs">
                      MATERIAL FALTANDO
                    </p>
                    <p className="text-red-500 font-bold text-xs">
                      {chamado.entregaFaltando ? "SIM" : "NÃO"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center italic text-gray-700">
                SEM CHAMADOS FINALIZADOS
              </p>
            )
          ) : (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
      {modalAberta && (
        <ModalCallSuprimentos
          info={modalChamado}
          setModalIsOpen={() => setModalAberta(false)}
          getCalls={getChamados}
        />
      )}
    </div>
  );
}

export default ChamadosSuprimentos;
