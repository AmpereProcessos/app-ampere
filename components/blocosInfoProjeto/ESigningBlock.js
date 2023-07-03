import React, { useState } from "react";
import { FaFileSignature } from "react-icons/fa";
import SelectFoatingInput from "../SelectFloatingInput";
import { IoIosSend } from "react-icons/io";
import { getMetadata, ref } from "firebase/storage";
import { storage } from "../../utils/firebase";
import axios from "axios";
function ESigningBlock({
  projectId,
  contractName,
  email,
  phone_number,
  documentation,
  contractLinks,
}) {
  const [showMenu, setShowMenu] = useState();
  const [toSignFile, setToSignFile] = useState();
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  console.log(toSignFile);
  async function send() {
    if (!toSignFile) {
      setMsg({
        text: "Por favor, escolha o arquivo a ser enviado.",
        color: "text-red-500",
      });
      return;
    }
    if (!email) {
      setMsg({
        text: "Nenhum um email vinculado ao projeto. Por favor, atualize o projeto pra dar prosseguimento.",
        color: "text-red-500",
      });
      return;
    }
    if (!phone_number) {
      setMsg({
        text: "Nenhum um telefone vinculado ao projeto. Por favor, atualize o projeto pra dar prosseguimento.",
        color: "text-red-500",
      });
      return;
    }
    if (!documentation) {
      setMsg({
        text: "Nenhum um telefone vinculado ao projeto. Por favor, atualize o projeto pra dar prosseguimento.",
        color: "text-red-500",
      });
      return;
    }
    let fileRef = ref(storage, toSignFile);
    const metadata = await getMetadata(fileRef);
    const md = metadata;

    const filePath = fileRef.fullPath;

    const { data } = await axios.post(
      `/api/utils/sendDigitalSigning?filePath=${encodeURIComponent(filePath)}`,
      { projectId, contractName, email, phone_number, documentation }
    );
    console.log("RESPOSTA", data);
    setMsg({ text: "Deu certo!", color: "text-green-500" });
  }
  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-center font-bold text-[#15599a] uppercase py-2">
          ASSINATURA DIGITAL
        </span>
        <div
          onClick={() => setShowMenu((prev) => !prev)}
          className={`${
            showMenu
              ? "bg-[#15599a] text-white hover:bg-transparent hover:text-[#15599a]"
              : "text-[#15559a] bg-transparent hover:bg-[#15599a] hover:text-white"
          } p-2 rounded-full border border-[#15599a] text-xs hover:scale-110 duration-300 ease-in-out cursor-pointer`}
        >
          <FaFileSignature />
        </div>
      </div>
      {showMenu ? (
        <div className="w-full flex flex-col mt-2 items-center">
          {contractLinks ? (
            <>
              <SelectFoatingInput
                label={"ARQUIVO PARA ASSINATURA"}
                editable={true}
                value={toSignFile ? toSignFile : "NÃO DEFINIDO"}
                options={[
                  ...contractLinks.map((fileObj) => {
                    return {
                      label: fileObj.title,
                      value: fileObj.link,
                    };
                  }),
                  { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
                ]}
                handleChange={(value) => setToSignFile(value)}
              />
              <button
                onClick={send}
                className="bg-blue-200 hover:text-white hover:bg-blue-600 p-1 rounded-lg mt-2 flex items-center gap-1"
              >
                <p className="text-xs font-medium">ENVIAR</p>
                <IoIosSend style={{ fontSize: "15px", marginTop: "1px" }} />
              </button>
              {msg.text ? (
                <p className={`text-sm text-center ${msg.color} `}>
                  {msg.text}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-gray-500 italic text-center">
              Nenhum arquivo anexado na categoria de{" "}
              <strong className="text-[#fead61]">contratos</strong> . Por favor,
              anexe um arquivo para desbloquear o menu de E-Signing
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default ESigningBlock;
