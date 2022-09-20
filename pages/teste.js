import axios from "axios";
import React, { useRef, useState } from "react";
import { UiFileInputButton } from "../components/UiFileInputButton";
function Teste() {
  const [formHolder, setFormHolder] = useState({
    config: {},
    formData: undefined,
  });
  const [message, setMessage] = useState("");
  const onChange = async (formData) => {
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
      },
    };
    setFormHolder({ config: config, formData: formData });
  };
  async function handleSend() {
    const response = await axios.post(
      "/api/teste",
      formHolder.formData,
      formHolder.config
    );
    setMessage(response.data);
  }
  return (
    <div className="flex flex-col items-center justify-center bg-[#15599a] min-h-screen w-screen max-w-screen">
      <div className="flex flex-col items-center bg-[#fff] w-[400px] min-h-[400px] shadow-lg rounded">
        <h1 className="text-center font-bold text-[#15559]">FORMULÁRIO</h1>
        <div className="flex items-center mt-12 flex-col">
          <span>FOTO 1</span>
          <UiFileInputButton
            label="Adicione aqui o arquivo"
            uploadFileName="theFiles"
            onChange={onChange}
            formData={formHolder.formData}
          />
        </div>
        <div className="flex items-center mt-12 flex-col">
          <span>FOTO 2</span>
          <UiFileInputButton
            label={"Adicione aqui o arquivo"}
            uploadFileName="theFiles"
            onChange={onChange}
            formData={formHolder.formData}
          />
        </div>
        <button
          className="bg-[#15599a] text-center rounded-lg p-2 mt-6 text-white"
          onClick={handleSend}
        >
          Enviar
        </button>
      </div>
      {message && <p className="text-center text-green-400">{message}</p>}
    </div>
  );
}

export default Teste;
