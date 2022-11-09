import React, { useState } from "react";
import NumberInput from "./NumberInput";
import axios from "axios";
function NPSCard({ project, credentials }) {
  const [nps, setNps] = useState(project.nps);
  const [obsNps, setObsNps] = useState(project.jornada.obsNps);
  const [msg, setMsg] = useState({
    text: "",
    color: "",
  });
  console.log(project.qtde, nps);
  async function handleChanges() {
    let { data } = await axios.post("/api/changes", {
      usuario: credentials.nome,
      mudancas: { nps: nps },
      projetoMudado: project._id,
    });
    axios
      .post(`/api/projects/update/${project._id}`, {
        nps: nps,
        "jornada.dataNps": new Date().toJSON(),
        "jornada.obsNps": obsNps,
      })
      .then((res) => {
        setMsg({ text: "Alterações feitas", color: "text-green-500" });
      });
  }
  return (
    <div className="w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-700">{project.nomeDoContrato}</p>
        <p className="text-xs text-[#15599a]">#{project.qtde}</p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xxs">CIDADE</span>
          <p className="text-xs text-gray-600">
            {project.cidade ? project.cidade : "-"}
          </p>
        </div>
        <div className="hidden lg:block">
          <span className="text-xxs">VENDEDOR</span>
          <p className="text-xs text-gray-600">
            {project.vendedor.nome ? project.vendedor.nome : "-"}
          </p>
        </div>
        <div>
          <span className="text-xxs">TELEFONE</span>
          <p className="text-xs text-center text-gray-600">
            {project.telefone ? project.telefone : "-"}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center mt-2">
        <h1 className="text-sm text-gray-500 font-bold">OBSERVAÇÕES</h1>
        <textarea
          value={obsNps}
          onChange={(e) => setObsNps(e.target.value)}
          className="bg-gray-100 resize-none w-full outline-none p-2 text-center"
        />
      </div>
      <div className="flex items-center justify-between mt-2 px-2">
        <div>
          <div className="flex flex-col items-center">
            <span className="uppercase font-bold font-raleway text-center text-sm">
              NPS
            </span>
            <div className="flex items-center justify-center">
              <input
                className="text-xs w-fit text-center uppercase rounded text-gray-600 outline-none"
                type="number"
                min={0}
                max={10}
                step={1}
                value={nps}
                onChange={(e) => {
                  setNps(Math.ceil(e.target.value));
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs text-gray-700 font-bold">DATA DE COLETA</p>
          <p className="text-xs text-gray-500">
            {project.jornada.dataNps
              ? new Date(project.jornada.dataNps).toLocaleDateString()
              : "-"}
          </p>
        </div>
        <div>
          <button
            onClick={handleChanges}
            className="text-xs bg-[#fead41] font-bold hover:text-white hover:bg-[#15599a] p-2 rounded"
          >
            SALVAR
          </button>
        </div>
      </div>
      {msg.text && (
        <p className={`${msg.color} italic text-center text-xs`}>{msg.text}</p>
      )}
    </div>
  );
}

export default NPSCard;
