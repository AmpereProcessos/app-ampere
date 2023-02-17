import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import LogoSemTexto from "../utils/logoBrancoSemTexto.png";
import Logo from "../utils/logoBranco.png";

function EstagioDois({ next }) {
  const router = useRouter();
  const [errMessage, setErrMessage] = useState({
    message: "",
    incorrectFields: [],
  });
  function getResult() {
    router.push(`/publico/calculadora-solar/resultado/${valorFatura}`);
  }
  const [cellPhoneMask, setCellPhoneMask] = useState("(99) 99999-9999");
  function checkFields() {
    if (name.clientName.trim().length == 0) {
      setErrMessage({
        ...errMessage,
        message:
          "Oops. Alguns campos foram preenchidos incorretamente. Por favor, preencha novamente.",
        incorrectFields: [...errMessage.incorrectFields, "Nome"],
      });
    } else if (
      email.clientEmail.trim().length == 0 ||
      phone.clientPhone.trim().length < 14
    ) {
      setErrMessage({ ...errMessage, incorrectFields: [] });
      let emailIncompleted =
        email.clientEmail.trim().length == 0 ? "Email" : null;
      let phoneIncompleted =
        phone.clientPhone.trim().length < 14 ? "Telefone" : null;
      setErrMessage({
        ...errMessage,
        message:
          "Oops. Alguns campos foram preenchidos incorretamente. Por favor, preencha novamente.",
        incorrectFields: [
          ...errMessage.incorrectFields,
          emailIncompleted,
          phoneIncompleted,
        ],
      });
    } else {
      /* axios
        .post(
          "https://api.rd.services/platform/conversions?api_key=HFekNkuFPSSvfcCZLYNmoJYzFHxsCTiKtHiA",
          {
            event_type: "CONVERSION",
            event_family: "CDP",
            payload: {
              conversion_identifier: `${valorFatura}`,
              name: `${name.clientName} - R$${valorFatura}`,
              state: "Minas Gerais",
              city: city.clientCity,
              email: email.clientEmail,
              traffic_source: "Site da Ampère",
              cf_fatura: `${valorFatura}`,
            },
          }
        )
        .then((res) => console.log("DEU CERTO")); */
      getResult();
    }
  }
  return (
    <>
      <div className="w-full flex-1 gap-3 flex flex-col justify-center items-center flex-grow self-stretch text-left font-normal text-[rgba(79,88,96,1)]">
        <div className="gap-1 flex flex-col justify-center items-center w-[300px] lg:w-[350px]">
          <div className="w-full flex items-start self-stretch">
            <div>
              <p className="m-0 w-[300px] lg:w-[350px] text-[15px] leading-[1.2]">
                Selecione seu estado
              </p>
            </div>
          </div>
          <div className="w-full">
            <input
              type={"text"}
              className="flex-1 bg-white outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]"
            />
          </div>
        </div>
        <div className="gap-1 flex flex-col justify-center items-center w-[300px] lg:w-[350px]">
          <div className="w-full flex items-start self-stretch">
            <div>
              <p className="m-0 w-[300px] lg:w-[350px] text-[15px] leading-[1.2]">
                Selecione sua cidade
              </p>
            </div>
          </div>
          <div className="w-full">
            <input className="flex-1 bg-white outline-none rounded-lg p-2 text-center h-[47px] w-[300px] lg:w-[350px]" />
          </div>
        </div>
      </div>
      <div className="w-full gap-4 flex flex-col justify-center items-center self-stretch text-white text-center font-black h-[100px]">
        <div className="w-full">
          <div className="flex-1 flex flex-col justify-center items-center flex-grow rounded-lg p-3 cursor-pointer bg-[rgba(21,89,154,1)] hover:bg-[rgba(254,173,97,1)] hover:text-black">
            <p
              onClick={() => next()}
              className="w-full m-0 text-[19px] leading-[1.2] cursor-pointer"
            >
              Próximo
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EstagioDois;
