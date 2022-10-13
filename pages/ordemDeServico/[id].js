import React, { useState } from "react";
import Link from "next/link";
import connectToDatabase from "../../utils/projectsDb";
import ServiceOrderPDF from "../../components/OrdemServicoPDF";
import { ObjectId } from "mongodb";
import TextInput from "../../components/TextInput";
import DateInput from "../../components/DateInput";
import SelectInput from "../../components/SelectInput";
import NumberInput from "../../components/NumberInput";
function OSInfo({ info }) {
  const [pdfVisible, setPdfVisible] = useState(false);
  const [osInfo, setosInfo] = useState(info);
  const [openingDate, setOpeningDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [modeloModulo, setModeloModulo] = useState("");
  const [urgency, setUrgency] = useState("NÃO DEFINIDO");
  return (
    <>
      {pdfVisible ? (
        <>
          <ServiceOrderPDF
            info={osInfo}
            openingDate={openingDate}
            urgency={urgency}
            modeloModulo={modeloModulo}
          />
        </>
      ) : (
        <div className="flex flex-col p-6 grow bg-[#fff]">
          <div>
            <Link href={"/obras"}>
              <button className="self-start p-2 rounded font-bold bg-[#fead61] hover:bg-[#15599a] hover:text-white">
                VOLTAR
              </button>
            </Link>
            <h1 className="self-center text-center font-bold uppercase text-2xl mb-2 text-[#15599a] font-raleway">
              GERAÇÃO DE OS
            </h1>
          </div>
          <div className="flex flex-col justify-center flex-wrap p-3 border border-gray-200 shadow-lg">
            <h1 className="text-center font-bold font-raleway text-[#15599a]">
              INFORMAÇÕES DO CLIENTE
            </h1>
            <div className="flex flex-wrap justify-center">
              <TextInput
                label={"NOME"}
                value={osInfo.nomedocontrato}
                editable={false}
              />
              <TextInput
                label={"LOGRADOURO"}
                value={osInfo.logradouro}
                editable={true}
                handleChange={(value) =>
                  setosInfo({ ...osInfo, logradouro: value })
                }
              />
              <TextInput
                label={"BAIRRO"}
                editable={true}
                value={osInfo.bairro}
                handleChange={(value) =>
                  setosInfo({ ...osInfo, bairro: value })
                }
              />
              <TextInput
                label={"NÚMERO"}
                editable={true}
                value={osInfo.numerores}
                handleChange={(value) =>
                  setosInfo({ ...osInfo, numerores: value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col p-3 border border-gray-200 mt-2 shadow-lg">
            <h1 className="text-center font-bold font-raleway text-[#15599a]">
              INFORMAÇÕES Da INSTALAÇÃO
            </h1>
            <div className="flex flex-wrap justify-center">
              <TextInput
                label={"TOPOLOGIA"}
                value={osInfo.topologia ? osInfo.topologia : ""}
                editable={true}
                handleChange={(value) =>
                  setosInfo({ ...osInfo, topologia: value })
                }
              />
              <TextInput
                label={"QTDE E POT INVERSOR"}
                value={osInfo.qtdepotinversor ? osInfo.qtdepotinversor : ""}
                editable={true}
                handleChange={(value) =>
                  setosInfo({ ...osInfo, qtdepotinversor: value })
                }
              />
              <NumberInput
                label={"Nº DE MÓDULOS"}
                value={osInfo.nmodulos ? osInfo.nmodulos : 0}
                editable={true}
                handleChange={(value) =>
                  setosInfo({ ...osInfo, nmodulos: value })
                }
              />
              <TextInput
                label={"MODELO DOS MÓDULOS"}
                value={modeloModulo}
                editable={true}
                handleChange={(value) => setModeloModulo(value)}
              />
              <TextInput
                label={"QTDE CABO"}
                value={osInfo.qtdecabo}
                editable={true}
                handleChange={(value) =>
                  setosInfo({ ...osInfo, qtdecabo: value })
                }
              />
              <TextInput
                label={"TIPO TELHA"}
                editable={true}
                value={osInfo.tipotelha}
                handleChange={(value) =>
                  setosInfo({ ...osInfo, tipotelha: value })
                }
              />
              <TextInput
                label={"TIPO ESTRUTURA"}
                editable={true}
                value={osInfo.tipoestrutura}
                handleChange={(value) =>
                  setosInfo({ ...osInfo, tipoestrutura: value })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-2 p-3 border border-gray-200 mt-2 shadow-lg">
            <div className="flex flex-col w-[450px] self-center mt-2 items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                OBSERVAÇÕES
              </span>
              <textarea
                readOnly={false}
                value={osInfo.obsobra ? osInfo.obsobra : ""}
                placeholder={"Observações da obra aqui..."}
                className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                onChange={(e) =>
                  setosInfo({ ...osInfo, obsobra: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col w-[450px] self-center mt-2 items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                KIT SOLAR
              </span>
              <textarea
                readOnly={false}
                value={osInfo.estruturafaltando ? osInfo.estruturafaltando : ""}
                placeholder={"Observações do kit solar aqui..."}
                className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                onChange={(e) =>
                  setosInfo({ ...osInfo, estruturafaltando: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-2 p-3 border border-gray-200 mt-2 shadow-lg">
            <DateInput
              label={"Data de criação da OS"}
              value={openingDate}
              editable={true}
              handleChange={(value) => setOpeningDate(value)}
            />
            <SelectInput
              label={"GRAU DE URGÊNCIA"}
              value={urgency}
              editable={true}
              options={[
                { label: "EMERGÊNCIA", value: "EMERGÊNCIA" },
                { label: "URGENTE", value: "URGENTE" },
                { label: "POUCO URGENTE", value: "POUCO URGENTE" },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
              handleChange={(value) => setUrgency(value)}
            />
          </div>
          <div
            onClick={() => setPdfVisible(true)}
            className="flex justify-center items-center p-2 bg-[#fead61] hover:bg-[#15599a] hover:text-white"
          >
            VER OS
          </div>
        </div>
      )}
    </>
  );
}
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;

  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("data");
  let os = await collection.findOne({
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(os));
  // Pass data to the page via props
  return { props: { info } };
}

export default OSInfo;
