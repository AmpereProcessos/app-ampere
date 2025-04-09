import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "../../../utils/images/logo-texto-azul-vertical.png";
import connectToDatabase from "../../../utils/services/mongodb/projects";
import { type Collection, ObjectId } from "mongodb";
import type { GetServerSidePropsContext } from "next";
import type { TServiceOrder, TServiceOrderWithProjectDTO } from "@/utils/schemas/service-order";
import ErrorComponent from "@/components/utils/ErrorComponent";
import { formatToCPForCNPJ } from "@/utils/methods/formatting";

type TermPDFProps = {
	serviceOrderJSON: string;
	error: string | null | undefined;
};
function TermPDF({ serviceOrderJSON, error }: TermPDFProps) {
	if (error) return <ErrorComponent msg={error} />;
	const serviceOrder: TServiceOrderWithProjectDTO = JSON.parse(serviceOrderJSON);
	return (
		<div className="h-[29.7cm] w-[21cm] p-4">
			<Link href="/oem">
				<div className="flex justify-center">
					<Image height={60} width={60} src={Logo} alt="Logo" />
				</div>
			</Link>
			<h1 className="mt-6 text-center font-bold">TERMO DE REALIZAÇÃO DE MANUTENÇÃO PREVENTIVA</h1>
			<div className="mt-8 px-4">
				<p className="text-center font-raleway">
					Eu, {serviceOrder.favorecido.nome}, inscrito sob o número de CPF/CNPJ{" "}
					<strong>{serviceOrder.projetoDados?.cpf_cnpj ? formatToCPForCNPJ(serviceOrder.projetoDados?.cpf_cnpj.toString()) : "-"}</strong>, declaro que a equipe técnica da empresa{" "}
					<strong>AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA</strong>, inscrita sob o CNPJ nº 27.901.968/0001-45, realizou no dia ____/____/_____ à manutenção preventiva, prevista em
					contrato, do sistema fotovoltaico instalado na{" "}
					<strong>
						{serviceOrder.localizacao.endereco ? serviceOrder.localizacao.endereco : "-"}, Nº{" "}
						{serviceOrder.localizacao.numeroOuIdentificador ? serviceOrder.localizacao.numeroOuIdentificador : "-"},{" "}
						{serviceOrder.localizacao.bairro ? serviceOrder.localizacao.bairro : "-"}
					</strong>{" "}
					, no município de <strong>{serviceOrder.localizacao.cidade ? serviceOrder.localizacao.cidade : "-"}</strong>.
				</p>
				<p className="mt-12">Por ser verdade assino este termo</p>
				<p className="mt-6 text-end">Ituiutaba, ____/____/_____</p>
				<div className="mt-32 flex flex-col">
					<hr className="border-t-2 border-black" />
					<p className="mt-4 text-center font-raleway font-bold">TÉCNICO</p>
				</div>
				<div className="mt-32 flex flex-col">
					<hr className="border-t-2 border-black" />
					<p className="mt-4 text-center font-raleway font-bold">CLIENTE</p>
				</div>
				<div className="mt-72">
					<p className="text-center font-raleway">Avenida Nove, 233 - Centro, Ituiutaba-MG</p>
					<p className="text-center">ampereenergiascomercial@gmail.com</p>
				</div>
			</div>
		</div>
	);
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
	async function getServiceOrderById({
		collection,
		id,
	}: {
		collection: Collection<TServiceOrder>;
		id: string;
	}) {
		try {
			const addFields = { projectIdAsObjectId: { $toObjectId: "$projeto.id" } };
			const lookup = { from: "dados", localField: "projectIdAsObjectId", foreignField: "_id", as: "projetoDados" };
			const serviceOrderArr = await collection
				.aggregate([
					{ $match: { _id: new ObjectId(id) } },
					{ $addFields: addFields },
					{ $lookup: lookup },
					{
						$project: {
							status: 1,
							categoria: 1,
							favorecido: 1,
							projeto: 1,
							etiquetas: 1,
							descricao: 1,
							localizacao: 1,
							responsavel: 1,
							urgencia: 1,
							anotacoes: 1,
							detalhes: 1,
							autor: 1,
							cobranca: 1,
							pagamento: 1,
							observacoes: 1,
							equipamentos: 1,
							agendamento: 1,
							periodo: 1,
							calendarioId: 1,
							googleCalendarId: 1,
							googleCalendarEventId: 1,
							dataEfetivacao: 1,
							dataInsercao: 1,
							"projetoDados._id": 1,
							"projetoDados.nomeDoContrato": 1,
							"projetoDados.cpf_cnpj": 1,
							"projetoDados.tipoDeServico": 1,
							"projetoDados.cep": 1,
							"projetoDados.uf": 1,
							"projetoDados.cidade": 1,
							"projetoDados.bairro": 1,
							"projetoDados.logradouro": 1,
							"projetoDados.numeroResidencia": 1,
							"projetoDados.produtos": 1,
							"projetoDados.servicos": 1,
							"projetoDados.compra.kitInfo": 1,
							"projetoDados.material.materialFaltante": 1,
							"projetoDados.obra.entrada": 1,
							"projetoDados.obra.saida": 1,
							"projetoDados.obra.statusDaObra": 1,
							"projetoDados.obra.equipeResp": 1,
							"projetoDados.obra.observacoes": 1,
							"projetoDados.obra.pendencias": 1,
							"projetoDados.idVisitaTecnica": 1,
						},
					},
				])
				.toArray();
			const serviceOrder = serviceOrderArr.map((p) => ({ ...p, projetoDados: p.projetoDados[0] }))[0];

			return (serviceOrder || null) as TServiceOrderWithProjectDTO | null;
		} catch (error) {
			throw error;
		}
	}
	// Fetch data from external API
	const { query } = context;
	const { id } = query;
	if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
		return {
			props: {
				error: "ID INVÁLIDO",
			},
		};
	}
	const db = await connectToDatabase();
	const serviceOrdersCollection = db.collection<TServiceOrder>("ordensDeServico");
	const serviceOrder = await getServiceOrderById({
		collection: serviceOrdersCollection,
		id,
	});
	if (!serviceOrder) {
		return {
			props: {
				error: "ORDEM DE SERVIÇO NÃO ENCONTRADA",
			},
		};
	}
	const serviceOrderJSON = JSON.stringify(serviceOrder);
	// Pass data to the page via props
	return { props: { serviceOrderJSON } };
}
export default TermPDF;
