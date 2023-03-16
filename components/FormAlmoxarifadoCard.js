import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import { TbExternalLink } from "react-icons/tb";
function FormAlmoxarifadoCard({ form, handleOpenModal, getForms }) {
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [formInfo, setFormInfo] = useState(form);
  async function fetchSaidaDeObra(e, id) {
    e.stopPropagation();
    try {
      let { data } = await axios.get(`/api/projects/fetchDoc/${id}`);
      let projectPai = data[0];
      console.log(projectPai);
      if (projectPai.obra?.saida) {
        setFormInfo({ ...formInfo, saidaDeObra: projectPai.obra.saida });
        await axios.put("/api/almoxarifado/formularios", {
          id: form._id,
          data: {
            saidaDeObra: projectPai.obra.saida,
          },
        });
        getForms();
      } else {
        setMsg({
          text: "Saída de obra não preenchida.",
          color: "text-red-500",
        });
      }
    } catch (error) {
      console.log(error);
      setMsg({ text: "Um erro ocorreu.", color: "text-red-500" });
    }
  }
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
    <div
      onClick={() => {
        handleOpenModal(formInfo);
      }}
      className={`w-[250px] lg:w-[450px] ${getCardColor(
        formInfo.efetivado
      )} cursor-pointer border border-gray-200 p-3 hover:bg-blue-100`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-700">{formInfo.nomeDoContrato}</p>
        <p className="text-xs text-[#15599a]">#{formInfo.codigoProjeto}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col gap-1 items-start">
          <span className="text-xxs">RESPONSÁVEL</span>
          <p className="text-xs text-gray-600">
            {formInfo.responsavel && formInfo.responsavel}
          </p>
        </div>
        {form.efetivado && (
          <div className="flex items-center">
            <Link href={`/almoxarifado/pdfFormulario/${form._id}`}>
              <a
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded h-[30px] font-bold text-[#fead61] border border-[#fead61] hover:text-black hover:bg-[#fead61]"
              >
                <TbExternalLink />
              </a>
            </Link>
          </div>
        )}
        <div className="flex flex-col gap-1 items-end">
          <span className="text-xxs">SAÍDA DE OBRA</span>
          {msg.text ? (
            <p className={`text-xs italic ${msg.color}`}>{msg.text}</p>
          ) : formInfo.saidaDeObra ? (
            <p className="text-xs text-gray-600">
              {dayjs(formInfo.saidaDeObra).add(3, "hour").format("DD/MM/YYYY")}
            </p>
          ) : formInfo.efetivado ? (
            <div
              onClick={(e) => fetchSaidaDeObra(e, form.idPai)}
              className="flex items-center cursor-pointer border border-black text-black hover:bg-black hover:text-white font-bold p-1 rounded transition duration-300 ease-in-out hover:scale-105"
            >
              <p className="text-xs">BUSCAR DATA</p>
              {/* {icon} */}
            </div>
          ) : (
            <p className="text-xs text-gray-600">-</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormAlmoxarifadoCard;
