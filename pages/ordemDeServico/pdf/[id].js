import React, { useState } from "react";
import Link from "next/link";
import connectToDatabase from "../../../utils/projectsDb";
import ServiceOrderPDF from "../../../components/OrdemServicoPDF";
import PadraoOS from "../../../components/PadraoOS";
import PreventivaOSPDF from "../../../components/PreventivaOS";
import Logo from "../../../utils/whitelogo.png";
import Image from "next/image";
import { ObjectId } from "mongodb";
import EstruturaOSPDF from "../../../components/EstruturaOS";
function OSInfo({ info, index }) {
  const [pdfVisible, setPdfVisible] = useState(false);
  const [osInfo, setosInfo] = useState(info);
  const [urgency, setUrgency] = useState("NÃO DEFINIDO");
  return (
    <>
      {osInfo.ordensDeServico[index].categoria == "PADRÃO" && (
        <PadraoOS
          info={osInfo}
          observacoesOS={osInfo.ordensDeServico[index].observacoes}
          servicoExecutado={osInfo.ordensDeServico[index].servicoExecutado}
        />
      )}
      {osInfo.ordensDeServico[index].categoria == "MONTAGEM" && (
        <ServiceOrderPDF
          info={osInfo}
          openingDate={osInfo.ordensDeServico[index].dataDeAbertura}
          urgency={osInfo.ordensDeServico[index].grauDeUrgencia}
          realizarCobranca={osInfo.ordensDeServico[index].realizarCobranca}
          valorCobranca={osInfo.ordensDeServico[index].valorCobranca}
          servicoExecutado={osInfo.ordensDeServico[index].servicoExecutado}
        />
      )}
      {osInfo.ordensDeServico[index].categoria == "MANUTENÇÃO PREVENTIVA" && (
        <PreventivaOSPDF
          info={osInfo}
          openingDate={osInfo.ordensDeServico[index].dataDeAbertura}
          urgencia={osInfo.ordensDeServico[index].grauDeUrgencia}
          servicoExecutado={osInfo.ordensDeServico[index].servicoExecutado}
          senhaDoWifi={osInfo.ordensDeServico[index].senhaDoWifi}
          pontoDeAgua={osInfo.ordensDeServico[index].pontoDeAgua}
          trafo={osInfo.ordensDeServico[index].trafo}
          configurar={osInfo.ordensDeServico[index].configurar}
          modeloInversor={osInfo.ordensDeServico[index].inversor}
        />
      )}
      {osInfo.ordensDeServico[index].categoria == "ESTRUTURA" && (
        <EstruturaOSPDF
          info={osInfo}
          observacoesOS={osInfo.ordensDeServico[index].observacoes}
          servicoExecutado={osInfo.ordensDeServico[index].servicoExecutado}
        />
      )}
      {/*<ServiceOrderPDF
        info={osInfo}
        openingDate={osInfo.ordensDeServico[index].dataDeAbertura}
        urgency={osInfo.ordensDeServico[index].grauDeUrgencia}
        realizarCobranca={osInfo.ordensDeServico[index].realizarCobranca}
        valorCobranca={osInfo.ordensDeServico[index].valorCobranca}
        servicoExecutado={osInfo.ordensDeServico[index].servicoExecutado}
  />*/}
    </>
  );
}
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const id = query.id;
  const index = query.index;
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("dados");
  let os = await collection.findOne({
    _id: ObjectId(id),
  });
  let info = JSON.parse(JSON.stringify(os));
  // Pass data to the page via props
  return { props: { info, index: index } };
}

export default OSInfo;
{
  /**
        <div className="flex flex-col p-6 grow bg-[#fff]">
          <div>
            <Link href={"/"}>
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
                value={osInfo.nomeDoContrato}
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
                value={osInfo.numeroResidencia}
                handleChange={(value) =>
                  setosInfo({ ...osInfo, numeroResidencia: value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col p-3 border border-gray-200 mt-2 shadow-lg">
            <h1 className="text-center font-bold font-raleway text-[#15599a]">
              INFORMAÇÕES DA INSTALAÇÃO
            </h1>
            <div className="flex flex-wrap justify-center">
              <TextInput
                label={"TOPOLOGIA"}
                value={osInfo.sistema.topologia ? osInfo.sistema.topologia : ""}
                editable={true}
                handleChange={(value) =>
                  setosInfo({
                    ...osInfo,
                    sistema: {
                      ...osInfo.sistema,
                      topologia: value,
                    },
                  })
                }
              />
              <TextInput
                label={"QTDE E POT INVERSOR"}
                value={osInfo.sistema.inversor ? osInfo.sistema.inversor : ""}
                editable={true}
                handleChange={(value) =>
                  setosInfo({
                    ...osInfo,
                    sistema: {
                      ...osInfo.sistema,
                      inversor: value,
                    },
                  })
                }
              />
              <NumberInput
                label={"Nº DE MÓDULOS"}
                value={
                  osInfo.sistema.qtdeModulos ? osInfo.sistema.qtdeModulos : 0
                }
                editable={true}
                handleChange={(value) =>
                  setosInfo({
                    ...osInfo,
                    sistema: {
                      ...osInfo.sistema,
                      qtdeModulos: value,
                    },
                  })
                }
              />
              <NumberInput
                label={"POTÊNCIA DOS MÓDULOS"}
                value={
                  osInfo.sistema.potModulos ? osInfo.sistema.potModulos : "-"
                }
                handleChange={(value) =>
                  setosInfo({
                    ...osInfo,
                    sistema: {
                      ...osInfo.sistema,
                      potModulos: value,
                    },
                  })
                }
              />
              <TextInput
                label={"TIPO TELHA"}
                editable={true}
                value={
                  osInfo.visitaTecnica.tipoDaTelha
                    ? osInfo.visitaTecnica.tipoDaTelha
                    : "-"
                }
                handleChange={(value) =>
                  setosInfo({
                    ...osInfo,
                    visitaTecnica: {
                      ...osInfo.visitaTecnica,
                      tipoDaTelha: value,
                    },
                  })
                }
              />
              <TextInput
                label={"TIPO ESTRUTURA"}
                editable={true}
                value={
                  osInfo.estruturaPersonalizada.tipo
                    ? osInfo.estruturaPersonalizada.tipo
                    : "-"
                }
                handleChange={(value) =>
                  setosInfo({
                    ...osInfo,
                    estruturaPersonalizada: {
                      ...osInfo.estruturaPersonalizada,
                      tipo: value,
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-2 p-3 border border-gray-200 mt-2 shadow-lg">
            <div className="flex flex-col w-[450px] self-center mt-2 items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                OBSERVAÇÕES DA OS
              </span>
              <textarea
                readOnly={false}
                value={osInfo.obra.observacoes ? osInfo.obra.observacoes : ""}
                placeholder={"Observações da obra aqui..."}
                className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                onChange={(e) =>
                  setosInfo({
                    ...osInfo,
                    obra: {
                      ...osInfo.obra,
                      observacoes: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex flex-col w-[450px] self-center mt-2 items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                MATERIAL A LEVAR
              </span>
              <textarea
                readOnly={false}
                className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                placeholder={"Informações de material a levar..."}
                value={
                  osInfo.material.materialFaltante
                    ? osInfo.material.materialFaltante
                    : ""
                }
                onChange={(e) =>
                  setosInfo({
                    ...osInfo,
                    material: {
                      ...osInfo.material,
                      materialFaltante: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex flex-col w-[450px] self-center mt-2 items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                KIT SOLAR
              </span>
              <textarea
                readOnly={false}
                value={osInfo.compra?.kitInfo}
                placeholder={"Informações do kit solar"}
                className="w-full text-center h-[150px] bg-gray-200 resize-none p-2 outline-none border border-gray-600"
                onChange={(e) =>
                  setosInfo({
                    ...osInfo,
                    compra: {
                      ...osInfo.compra,
                      kitInfo: e.target.value,
                    },
                  })
                }
              />
            </div>
            <TextInput
              label={"SERVIÇO A SER EXECUTADO"}
              value={osInfo.ordensDeServico[index].servicoExecutado}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-x-2 p-3 border border-gray-200 mt-2 shadow-lg">
            <DateInput
              label={"Data de criação da OS"}
              value={new Date(osInfo.ordensDeServico[index].dataDeAbertura)
                .toISOString()
                .slice(0, 10)}
              editable={false}
            />
            <SelectInput
              label={"GRAU DE URGÊNCIA"}
              value={osInfo.ordensDeServico[index].grauDeUrgencia}
              editable={false}
              options={[
                { label: "EMERGÊNCIA", value: "EMERGÊNCIA" },
                { label: "URGENTE", value: "URGENTE" },
                { label: "POUCO URGENTE", value: "POUCO URGENTE" },
                { label: "NÃO DEFINIDO", value: "NÃO DEFINIDO" },
              ]}
            />
          </div>
          <div
            onClick={() => setPdfVisible(true)}
            className="flex justify-center items-center p-2 bg-[#fead61] hover:bg-[#15599a] hover:text-white"
          >
            VER OS
          </div>
        </div>
*/
}
