import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCity, FaUserAlt, FaUsers } from "react-icons/fa";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { TbExternalLink } from "react-icons/tb";
function FormAlmoxarifadoCard({
  form,
  handleOpenModal,
  getForms,
  index,
  forms,
  setFilteredForms,
  inViewRef,
}) {
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [formInfo, setFormInfo] = useState(form);
  async function fetchSaidaDeObra(e, id) {
    e.stopPropagation();
    try {
      let { data } = await axios.get(`/api/projects/fetchDoc/${id}`);
      let projectPai = data[0];
      if (projectPai.obra?.saida) {
        setFormInfo({ ...formInfo, saidaDeObra: projectPai.obra.saida });
        await axios.put("/api/almoxarifado/formularios", {
          id: form._id,
          data: {
            saidaDeObra: projectPai.obra.saida,
          },
        });
        var previousForms = [...forms];
        previousForms[index].saidaDeObra == projectPai.obra.saida;
        setFilteredForms((prev) => previousForms);
        // getForms();
      } else {
        setMsg({
          text: "Saída de obra não preenchida.",
          color: "text-red-500",
        });
      }
    } catch (error) {
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
  useEffect(() => {
    setFormInfo(form);
  }, [form]);
  if (inViewRef) {
    return (
      <div
        ref={inViewRef}
        onClick={() => {
          handleOpenModal(formInfo);
        }}
        className={`flex flex-col w-full lg:w-[450px] cursor-pointer justify-between shdadow-lg border border-gray-200 p-3 hover:bg-blue-100 ${getCardColor(
          formInfo.efetivado
        )}`}
      >
        <div className="flex items-center justify-between font-medium mb-1">
          <p className="text-xs text-gray-700">
            {formInfo.nomeDoContrato
              ? formInfo.nomeDoContrato
              : formInfo.nomeTerceiro}
          </p>
          <p className="text-xs text-[#15599a]">
            #{formInfo.codigoProjeto ? formInfo.codigoProjeto : "-"}
          </p>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs justify-start">
            <FaCity color="rgb(59,130,246)" size={"20px"} />
            <p>{form.cidade ? form.cidade : "-"}</p>
          </div>
          <div className="flex items-center gap-2 text-xs justify-end">
            <p>{form.equipeResp}</p>
            <FaUsers color="rgb(245,158,11)" size={"20px"} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-xxs">RESPONSÁVEL</span>
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <FaUserAlt />
              <p className="">{formInfo.responsavel && formInfo.responsavel}</p>
            </div>
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
              <div className="flex items-center justify-end gap-2">
                <p className="text-xs text-gray-600">
                  {dayjs(formInfo.saidaDeObra)
                    .add(3, "hour")
                    .format("DD/MM/YYYY")}
                </p>
                <BsFillCalendarCheckFill />
              </div>
            ) : formInfo.efetivado && form.idPai ? (
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
  } else
    return (
      <div
        onClick={() => {
          handleOpenModal(formInfo);
        }}
        className={`flex flex-col w-full lg:w-[450px] cursor-pointer justify-between shdadow-lg border border-gray-200 p-3 hover:bg-blue-100 ${getCardColor(
          formInfo.efetivado
        )}`}
      >
        <div className="flex items-center justify-between font-medium mb-1">
          <p className="text-xs text-gray-700">
            {formInfo.nomeDoContrato
              ? formInfo.nomeDoContrato
              : formInfo.nomeTerceiro}
          </p>
          <p className="text-xs text-[#15599a]">
            #{formInfo.codigoProjeto ? formInfo.codigoProjeto : "-"}
          </p>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs justify-start">
            <FaCity color="rgb(59,130,246)" size={"20px"} />
            <p>{form.cidade ? form.cidade : "-"}</p>
          </div>
          <div className="flex items-center gap-2 text-xs justify-end">
            <p>{form.equipeResp}</p>
            <FaUsers color="rgb(245,158,11)" size={"20px"} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-xxs">RESPONSÁVEL</span>
            <div className="flex items-center gap-1 text-gray-500">
              <FaUserAlt size={"17px"} />
              <p className="text-xs">
                {formInfo.responsavel && formInfo.responsavel}
              </p>
            </div>
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
              <div className="flex items-center justify-end gap-2 text-gray-500">
                <p className="text-xs">
                  {dayjs(formInfo.saidaDeObra)
                    .add(3, "hour")
                    .format("DD/MM/YYYY")}
                </p>
                <BsFillCalendarCheckFill size={"17px"} />
              </div>
            ) : formInfo.efetivado && form.idPai ? (
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
        <div className="flex items-center justify-center w-full gap-2">
          <p className="text-xs text-gray-500 italic">ABERTO EM:</p>
          <p className="text-xs text-gray-500 italic">
            {form.abertura
              ? dayjs(form.abertura).format("DD/MM/YYYY HH:mm")
              : ""}
          </p>
        </div>
      </div>
    );
}

export default FormAlmoxarifadoCard;
