import axios from "axios";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import ModalOS from "../../components/ModalOS";
import { AppContext } from "../../context/AppContext";

function OSDaEquipe() {
  const { credentials } = useContext(AppContext);
  const [ordensDeServico, setOrdensDeServico] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalOS, setModalOS] = useState({});
  function getOSs() {
    axios
      .get(`/api/ordensDeServico/porEquipe?equipe=${credentials.equipe}`)
      .then((res) => {
        console.log(res.data);
        setOrdensDeServico(res.data);
      });
  }
  function handleOpenModal(os) {
    setModalIsOpen(true);
    setModalOS(os);
  }
  useEffect(() => {
    getOSs();
  }, []);
  return (
    <div className="p-6 grow bg-[#fff]">
      <div className="flex flex-col">
        <div className="flex flex-col items-center pb-2 border-b border-gray-200">
          <h1 className="text-center font-bold text-[#15599a]">MINHAS OSs</h1>
        </div>
        {ordensDeServico.length > 0 ? (
          <div className="flex  justify-around gap-3 mt-4 flex-wrap">
            {ordensDeServico.map((item, i) => (
              <div
                key={i}
                onClick={() => handleOpenModal(item)}
                className="w-[250px] lg:w-[450px]  cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-700">{item.nomeDoContrato}</p>
                  <p className="text-xs text-[#15599a]">#{item.qtde}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-col items-center">
                    <span className="text-xxs text-center">CATEGORIA</span>
                    <p className="text-xs text-gray-600 text-center">
                      {item.categoria ? item.categoria : "-"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xxs text-center">SERVIÇO</span>
                    <p className="text-xs text-gray-600 text-center">
                      {item.servicoExecutado ? item.servicoExecutado : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center italic text-gray-500 text-xs mt-4">
            SEM ORDENS DE SERVIÇO ATIVAS PARA SUA EQUIPE...
          </p>
        )}
      </div>
      {modalIsOpen && (
        <ModalOS info={modalOS} setModalIsOpen={setModalIsOpen} />
      )}
    </div>
  );
}

export default OSDaEquipe;
