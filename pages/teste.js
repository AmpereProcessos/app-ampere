import axios from "axios";
import React, { useRef, useState } from "react";
import { storage } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { UiFileInputButton } from "../components/UiFileInputButton";
function Teste() {
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  const [imageUpload, setImageUpload] = useState(null);

  async function uploadImage() {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `formSolicitacao/NOME TESTE/${v4()}`);
    uploadBytes(imageRef, imageUpload)
      .then((res) => {
        console.log(res);
        setMsg({ text: "Imagem enviado", color: "text-green-500" });
        getDownloadURL(ref(storage, res.metadata.fullPath)).then((url) =>
          console.log(url)
        );
      })
      .catch((err) =>
        setMsg({
          text: "Um erro ocorreu, por favor tente novamente.",
          color: "text-red-500",
        })
      );
  }
  return (
    <div className="flex flex-col items-center justify-center bg-[#15599a] grow p-6">
      <h1 className="text-center font-bold text-[#15559]">FORMULÁRIO</h1>
      <div className="flex flex-col items-center bg-[#fff] w-[400px] min-h-[400px] shadow-lg rounded">
        <div class="relative border-dotted h-fit p-2 rounded-lg border-2 border-blue-700 bg-gray-100 flex justify-center items-center mt-2">
          <div class="absolute">
            {imageUpload ? (
              <div class="flex flex-col items-center">
                <i class="fa fa-folder-open fa-4x text-blue-700"></i>
                <span class="block text-gray-400 font-normal text-center">
                  {imageUpload.name}
                </span>
              </div>
            ) : (
              <div class="flex flex-col items-center">
                <i class="fa fa-folder-open fa-4x text-blue-700"></i>
                <span class="block text-gray-400 font-normal">
                  Adicione o arquivo aqui
                </span>
              </div>
            )}
          </div>
          <input
            onChange={(e) => setImageUpload(e.target.files[0])}
            className="h-full w-full opacity-0"
            type="file"
          />
        </div>

        {msg.text && <p className={`text-center ${msg.color}`}>{msg.text}</p>}
        <button
          className="bg-[#15599a] text-center rounded-lg p-2 mt-6 text-white"
          onClick={uploadImage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Teste;
