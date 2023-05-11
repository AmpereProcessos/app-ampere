import React, { useEffect, useState } from "react";
import ModalNovaOperacao from "../../components/ModalNovaOperacao";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import { TbActivity } from "react-icons/tb";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsCalendarCheckFill } from "react-icons/bs";
import dayjs from "dayjs";
import { FaProjectDiagram } from "react-icons/fa";

function Operacoes() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  const [operations, setOperations] = useState();
  const [newOperationModalIsOpen, setNewOperationModalIsOpen] = useState(false);

  async function getOperations() {
    try {
      const { data } = await axios.get("/api/operacoes");
      console.log(data);
      setOperations(data);
    } catch (error) {
      alert(
        "Houve um erro no carregamento das operações. Por favor, tente novamente mais tarde."
      );
    }
  }

  useEffect(() => {
    if (session?.user) {
      if (!operations) {
        getOperations();
      }
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  return (
    <div className="p-6 grow">
      <div className="flex flex-col border-b border-gray-200 p-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
            <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
              OPERAÇÕES E OUTROS PROJETOS
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-around flex-wrap grow py-2">
        {operations?.map((operation, index) => (
          <div
            key={index}
            className="w-[450px] h-[250px] shadow-lg border border-gray-200 flex flex-col p-3"
          >
            <h1 className="w-full text-center text-lg font-medium">
              {operation.nome}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start">
                <h1 className="text-start text-gray-500 text-xs font-medium">
                  INÍCIO
                </h1>
                <div className="flex items-center gap-2">
                  <AiOutlineCalendar
                    style={{ color: "#15599a", fontSize: "20px" }}
                  />
                  <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                    {operation.dataInicio
                      ? dayjs(operation.dataInicio).format("DD/MM/YY")
                      : null}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <h1 className="text-end text-gray-500 text-xs font-medium">
                  PREVISÃO DE CONCLUSÃO
                </h1>
                <div className="flex items-center justify-end gap-2">
                  {operation.previsaoConclusao ? (
                    <>
                      <BsCalendarCheckFill
                        style={{ color: "rgb(249,115,22)" }}
                      />
                      <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                        {dayjs(operation.previsaoConclusao).format(
                          "DD/MM/YY HH:mm"
                        )}
                      </h1>
                    </>
                  ) : (
                    <h1 className="text-gray-700 font-medium text-xs lg:text-base">
                      NÃO DEFINIDO
                    </h1>
                  )}
                </div>
              </div>
            </div>
            <h1 className="w-full text-center mt-3 font-medium text-sm">
              ATIVIDADES
            </h1>
            {operation.atividades.map((activity, subIndex) => (
              <div
                key={subIndex}
                className="w-full flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <TbActivity />
                  <p className="text-xs text-gray-500">{activity.nome}</p>
                </div>
                {activity.subAtividades ? (
                  <div className="flex items-center gap-2">
                    <FaProjectDiagram style={{ color: "#fead61" }} />
                    <p className="text-xs text-gray-500">
                      + {activity.subAtividades.length}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        onClick={() => setNewOperationModalIsOpen(true)}
        className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
      >
        <p className="uppercase font-bold text-sm">NOVA OPERAÇÃO</p>
      </div>

      {newOperationModalIsOpen ? (
        <ModalNovaOperacao
          isOpen={newOperationModalIsOpen}
          setModalIsOpen={setNewOperationModalIsOpen}
        />
      ) : null}
    </div>
  );
}

export default Operacoes;
