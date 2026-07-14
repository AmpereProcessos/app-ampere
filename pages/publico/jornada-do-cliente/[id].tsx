import JourneyItem from "@/components/identificador/jornada-do-cliente/JourneyItem";
import IndicationsBlock from "@/components/identificador/posvenda/IndicationsBlock";
import SatisfactionSurvey from "@/components/identificador/posvenda/SatisfactionSurvey";
import TextInput from "@/components/inputs/Text";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { formatToPhone } from "@/utils/constants";
import type { TProject, TProjectDTO } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import { type Collection, type Db, ObjectId } from "mongodb";
import type { GetServerSidePropsContext } from "next";
import Image from "next/image";
import React, { useState } from "react";
import { BsCalendar, BsCalendarCheckFill, BsPatchCheckFill } from "react-icons/bs";
import { FaCalendar, FaSign, FaSignature, FaTruck } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { ImPriceTag } from "react-icons/im";
import { IoMdPower } from "react-icons/io";
import { MdFeedback } from "react-icons/md";
import Logo from "../../../utils/images/logo-sem-texto.png";

type TPoints = {
  sale: number | null;
  delivery: number | null;
  execution: number | null;
  afterSales: number | null;
};

function getAvarege(points: TPoints) {
  const filtered = Object.values(points).filter((v) => !!v);
  if (filtered.length < 4) return null;
  const sum =
    filtered.reduce((acc, current) => {
      const accNumber = acc || 0;
      const currentNumber = current || 0;
      return accNumber + currentNumber;
    }, 0) || 0;
  return sum / filtered.length;
}

type ClientJourneyProps = {
  projectJSON: string;
  error: string | null | undefined;
};
function ClientJourney({ projectJSON, error }: ClientJourneyProps) {
  const [points, setPoints] = useState<TPoints>({
    sale: null,
    delivery: null,
    execution: null,
    afterSales: null,
  });
  const [indications, setIndications] = useState([{ nome: "", telefone: "" }]);
  const avg = getAvarege(points);
  console.log(avg);
  if (error) return <ErrorComponent msg={error} />;
  const project: TProjectDTO = JSON.parse(projectJSON);
  return <></>;
  // return (
  // 	<div className="flex h-full w-full items-center justify-center bg-[#15599a] p-3">
  // 		<div key="1" className="bg-background flex flex-col items-center rounded-lg px-4 py-12 text-gray-900 shadow-md sm:px-6 lg:px-8">
  // 			{/* <section className="mx-auto max-w-5xl space-y-12"> */}
  // 			<div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
  // 				<h1 className="text-center text-3xl font-black md:text-5xl">SUA JORNADA DO CLIENTE</h1>
  // 				<Image src={Logo} alt="Logo" width={60} height={60} />
  // 			</div>
  // 			<p className="text-foreground mt-2 text-center text-lg font-medium tracking-tight md:text-xl">ACOMPANHE O PROCESSO DO SEU PROJETO CONOSCO</p>
  // 			<h2 className="mt-4 text-center text-3xl font-black text-[#15599a] md:text-4xl">{project.nomeDoContrato}</h2>

  // 			{!project.nps && (!!project.jornada.dataEntregaTecnicaRemota || !!project.jornada.jornadaConcluida) ? (
  // 				<SatisfactionSurvey projectId={project._id} />
  // 			) : null}
  // 			{project.nps && (!!project.jornada.dataEntregaTecnicaRemota || !!project.jornada.jornadaConcluida) ? (
  // 				<IndicationsBlock projectId={project._id} projectName={project.nomeDoContrato} />
  // 			) : null}
  // 			<div className="grid grid-cols-1 gap-6">
  // 				<JourneyItem
  // 					active={!!project.jornada.boasVindas}
  // 					title="Boas vindas"
  // 					description="A assinatura do contrato, o início da sua jornada como cliente Ampère Energias."
  // 					index={1}
  // 					date={project.contrato.dataAssinatura}
  // 					icon={IoMdPower}
  // 				/>

  // 				<JourneyItem
  // 					active={!!project.jornada.assDocumentacoes}
  // 					title="Assinatura das documentações"
  // 					description="A assinatura das documentações de homologação junto à sua concessionária."
  // 					index={2}
  // 					date={project.homologacao.documentacao.dataAssinatura}
  // 					icon={FaSignature}
  // 				/>

  // 				<JourneyItem
  // 					active={!!project.jornada.respConcessionaria}
  // 					title="Liberação do parecer de acesso"
  // 					description="Resposta da concessionária acerca da aprovação de acesso (instalação de sistema solar) a rede elétrica."
  // 					index={3}
  // 					date={project.homologacao.acesso.dataResposta}
  // 					icon={MdFeedback}
  // 				/>

  // 				<JourneyItem
  // 					active={!!project.jornada.compraDoKit}
  // 					title="Compra dos equipamentos"
  // 					description="A compra dos equipamentos necessários para execução do seu projeto."
  // 					index={4}
  // 					date={project.compra.dataPedido}
  // 					icon={ImPriceTag}
  // 				/>

  // 				<JourneyItem
  // 					active={!!project.jornada.prevChegada}
  // 					title="Previsão de entrega"
  // 					description="Informe da previsão de entrega dos equipamentos, fornecida pelo fornecedor parceiro."
  // 					index={5}
  // 					date={project.compra.previsaoEntrega}
  // 					icon={FaTruck}
  // 				/>

  // 				<JourneyItem
  // 					active={!!project.jornada.entregaDoKit}
  // 					title="Entrega dos equipamentos"
  // 					description="Entrega dos equipamentos no local de instalação."
  // 					index={6}
  // 					date={project.compra.dataEntrega}
  // 					icon={FaTruck}
  // 				/>

  // 				<JourneyItem
  // 					active={!!project.jornada.instalacaoRealizada}
  // 					title="Execução do serviço"
  // 					description="Finalização do serviço (montagem do sistema fotovoltaico, por exemplo)."
  // 					index={8}
  // 					date={project.obra.saida}
  // 					icon={BsCalendarCheckFill}
  // 				/>

  // 				<JourneyItem
  // 					active={!!project.jornada.vistoriaConcessionaria}
  // 					title="Vistoria da concessionária"
  // 					description="Realização da vistoria técnica e troca de medidor pela concessionária."
  // 					index={9}
  // 					date={project.homologacao.vistoria.dataEfetivacao}
  // 					icon={BsCalendarCheckFill}
  // 				/>

  // 				<JourneyItem
  // 					active={!!project.jornada.jornadaConcluida}
  // 					title="Conclusão da jornada"
  // 					description="Entrega final do seu projeto Ampère Energias."
  // 					index={10}
  // 					date={project.jornada.dataConclusao || project.jornada.dataEntregaTecnicaRemota}
  // 					icon={BsPatchCheckFill}
  // 				/>
  // 			</div>

  // 			{/* <div className="flex justify-center">
  //           <div className="w-full max-w-3xl">
  //             <div className="relative flex h-[200px] items-center">
  //               <div className="absolute inset-0 flex items-center">
  //                 <div className="w-full border-t-2 border-orange-500 dark:border-orange-400" />
  //               </div>
  //               <div className="z-10 flex-1">
  //                 <div className="h-6 w-6 rounded-full bg-orange-500 dark:bg-orange-400" />
  //               </div>
  //               <div className="z-10 flex-1">
  //                 <div className="h-6 w-6 rounded-full bg-green-500 dark:bg-green-400" />
  //               </div>
  //               <div className="z-10 flex-1">
  //                 <div className="h-6 w-6 rounded-full bg-purple-500 dark:bg-purple-400" />
  //               </div>
  //               <div className="z-10 flex-1">
  //                 <div className="h-6 w-6 rounded-full bg-blue-500 dark:bg-blue-400" />
  //               </div>
  //             </div>
  //           </div>
  //          </div> */}
  // 			{/* </section> */}
  // 		</div>
  // 	</div>
  // );
}

export default ClientJourney;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { id } = query;

  // Validating if ID provided in query is a valid ID
  if (!id || typeof id !== "string" || !ObjectId.isValid(id))
    return {
      props: {
        error: "Oops, o ID solicitado é inválido.",
      },
    };

  const db: Db = await connectToDatabase();
  const projectsCollection: Collection<TProject> = db.collection("dados");
  const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
  if (!project)
    return {
      props: {
        error: "Oops, nenhum projeto foi encontrado.",
      },
    };
  return {
    props: {
      projectJSON: JSON.stringify({ ...project }),
    },
  };
}
