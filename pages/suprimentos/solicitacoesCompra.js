import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingPage from "../../components/utils/LoadingPage";
import { FaUserAlt } from "react-icons/fa";
import {
  BsCalendarCheckFill,
  BsFillCartFill,
  BsFillTelephoneFill,
} from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import axios from "axios";
import dayjs from "dayjs";
import PurchaseSolicitationModal from "../../components/PurchaseSolicitationModal";

function SolicitacoesCompra() {
  const router = useRouter();
  const [solicitations, setSolicitations] = useState();
  const [modal, setModal] = useState({
    info: null,
    isOpen: false,
  });
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  function handleOpenModal(solicitation) {
    setModal({ info: solicitation, isOpen: true });
  }
  async function getSolicitation() {
    const { data } = await axios.get("/api/solicitacoes/compra");
    setSolicitations(data);
  }

  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("Suprimentos") ||
      session?.user.accessibleRoutes.includes("ADM")
    ) {
      if (!solicitations) getSolicitation();
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  console.log(solicitations);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow">
        <div className="flex flex-col justify-between border-b border-gray-200 p-1">
          <p className="font-bold uppercase text-start text-2xl text-[#15599a] font-['Roboto']">
            SOLICITAÇÕES DE COMPRA
          </p>
        </div>
        {solicitations ? (
          <div className="flex justify-around mt-4 flex-wrap gap-4">
            {solicitations.map((solicitation, index) => (
              <div
                key={index}
                onClick={() => handleOpenModal(solicitation)}
                className="flex flex-col hover:scale-[1.02] duration-300 ease-in-out cursor-pointer hover:bg-blue-50 gap-4 border border-gray-300 shadow-lg w-[450px] p-3 rounded-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaUserAlt style={{ color: "#16B010" }} />
                    <h1 className="text-gray-700 font-medium">
                      {solicitation.requisitante}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsFillTelephoneFill style={{ color: "#FEAD41" }} />
                    <h1 className="text-gray-700 font-medium">
                      {solicitation.telefone}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <h1 className="text-start text-gray-500 text-xs font-medium">
                      SOLICITAÇÃO
                    </h1>
                    <div className="flex items-center gap-2">
                      <AiOutlineCalendar style={{ color: "#15599a" }} />
                      <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                        {solicitation.dataSolicitacao
                          ? dayjs(solicitation.dataSolicitacao).format(
                              "DD/MM/YY HH:mm"
                            )
                          : null}
                      </h1>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <h1 className="text-end text-gray-500 text-xs font-medium">
                      PRAZO
                    </h1>
                    <div className="flex items-center justify-end gap-2">
                      <BsCalendarCheckFill style={{ color: "#ef233c" }} />
                      <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                        {solicitation.prazo
                          ? dayjs(solicitation.prazo).format("DD/MM/YY HH:mm")
                          : "NÃO DEFINIDO"}
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-center gap-2">
                    <BsFillCartFill />
                    <h1 className="text-center text-gray-500 text-xs font-medium">
                      ITENS
                    </h1>
                  </div>
                  {solicitation.itens.map((item, index) => (
                    <div
                      key={index}
                      className="w-full flex justify-between items-center"
                    >
                      <p className="text-gray-700 text-sm font-light">
                        {item.nome}
                      </p>
                      <p className="text-gray-700 text-sm font-light">
                        x{item.qtde}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <LoadingPage />
        )}
        {modal.isOpen && modal.info ? (
          <PurchaseSolicitationModal
            info={modal.info}
            isOpen={modal.isOpen}
            closeModal={() => setModal({ info: null, isOpen: false })}
          />
        ) : null}
      </div>
    );
  }
}

export default SolicitacoesCompra;
