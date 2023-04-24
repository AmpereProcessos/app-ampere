import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingPage from "../../components/utils/LoadingPage";
import { HiIdentification } from "react-icons/hi";
import { BsBank, BsFolderFill } from "react-icons/bs";
import { FaSolarPanel } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { BsCheck2All } from "react-icons/bs";
function CadastrosFenesc() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });
  const [registers, setRegisters] = useState();
  const [filteredRegisters, setFilteredRegisters] = useState();

  async function getRegisters() {
    const { data } = await axios.get("/api/auxiliares/cadastroFenesc");
    setRegisters(data);
    setFilteredRegisters(data);
  }
  async function setEfetivado(id, obj) {
    await axios.put("/api/auxiliares/cadastroFenesc", {
      id: id,
      changes: {
        efetivado: obj.efetivado ? !obj.efetivado : true,
      },
    });
    getRegisters();
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes("PPS")) {
      if (!registers) {
        getRegisters();
      }
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  return (
    <div className="flex flex-col p-6 grow">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap justify-center items-center gap-2 font-['Roboto']">
            <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
              CADASTROS FENESC
            </p>
            <p className="font-bold text-[#fead61]">
              ({filteredRegisters?.length})
            </p>
          </div>
        </div>
      </div>
      <div className="flex  grow gap-3 mt-4 flex-wrap">
        {filteredRegisters ? (
          filteredRegisters.map((register) => (
            <div
              key={register._id}
              className="w-[450px] rounded-md flex flex-col border border-gray-300 shadow-sm h-[230px] p-3"
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-lg font-medium">
                  PROJETO{" "}
                  <strong className="text-[#15599a]">
                    #{register.codigoSVB}
                  </strong>
                </h1>
                {register.efetivado ? (
                  <BsCheck2All
                    style={{ fontSize: "25px", color: "rgb(34,197,94)" }}
                  />
                ) : (
                  <IoMdCheckmark
                    onClick={() => setEfetivado(register._id, register)}
                    style={{ fontSize: "20px", cursor: "pointer" }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <HiIdentification
                    style={{ color: "rgb(55,65,81)", fontSize: "25px" }}
                  />
                  <h1 className="text-gray-700 font-medium">
                    {register.cpfCnpj}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col w-full justify-between">
                <div className="flex gap-3 items-center justify-center">
                  <h1 className="text-sm text-gray-500">FINANCIAMENTO</h1>
                  <BsBank style={{ color: "#fead61" }} />
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col items-start">
                    <h1 className="text-gray-600 font-medium text-xs">
                      GERENTE
                    </h1>
                    <h1 className="text-sm font-medium">
                      {register.nomeGerente}
                    </h1>
                  </div>
                  <div className="flex flex-col items-end">
                    <h1 className="text-gray-600 font-medium text-xs">
                      CONTATO
                    </h1>
                    <h1 className="text-sm font-medium">
                      {register.telefoneGerente}
                    </h1>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col items-start">
                    <h1 className="text-gray-600 font-medium text-xs">VALOR</h1>
                    <h1 className="text-sm font-medium">
                      R$
                      {register.valorFinanciado.toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="flex flex-col items-end">
                    <h1 className="text-gray-600 font-medium text-xs">
                      PARCELAS
                    </h1>
                    <h1 className="text-sm font-medium">
                      x{register.qtdeParcelas}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full justify-between">
                <div className="flex gap-3 items-center justify-center">
                  <h1 className="text-sm text-gray-500">
                    SISTEMA FOTOVOLTAICO
                  </h1>
                  <FaSolarPanel style={{ color: "rgb(34,197,94)" }} />
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col items-start">
                    <h1 className="text-gray-600 font-medium text-xs">VALOR</h1>
                    <h1 className="text-sm font-medium">
                      R$
                      {Number(register.valorProjeto).toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                      })}
                    </h1>
                  </div>
                  <div className="flex flex-col items-end">
                    <h1 className="text-gray-600 font-medium text-xs">
                      POTÊNCIA
                    </h1>
                    <h1 className="text-sm font-medium">
                      {register.potPico}kWp
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <div className="flex gap-3 items-center justify-center">
                  <a
                    href={register.proposta.link}
                    className="text-sm text-blue-300 font-medium"
                  >
                    PROPOSTA
                  </a>
                  <BsFolderFill style={{ color: "rgb(30,64,175)" }} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="grow flex items-center justify-center">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default CadastrosFenesc;
