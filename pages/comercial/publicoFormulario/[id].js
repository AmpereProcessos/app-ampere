import React, { useState } from "react";
import connectToSolicitacoesDatabase from "../../../utils/services/mongodb/requests";
import { ObjectId } from "mongodb";
import GeneralInformationBlock from "../../../components/identificador/solicitacoesContrato/blocos/GeneralInformationBlock";
import ContactInformationBlock from "../../../components/identificador/solicitacoesContrato/blocos/ContactInformationBlock";
import ElectricalInstallationInformationBlock from "../../../components/identificador/solicitacoesContrato/blocos/ElectricalInstallationInformationBlock";
import SystemInformationBlock from "../../../components/identificador/solicitacoesContrato/blocos/SystemInformationBlock";
import StructureInformationBlock from "../../../components/identificador/solicitacoesContrato/blocos/StructureInformationBlock";
import OeMInformationBlock from "../../../components/identificador/solicitacoesContrato/blocos/OeMInformationBlock";
import InsuranceInformationBlock from "../../../components/identificador/solicitacoesContrato/blocos/InsuranceInformationBlock";
import EnergyPAInformationBlock from "../../../components/identificador/solicitacoesContrato/blocos/EnergyPAInformationBlock";
import PaymentInformationBlock from "../../../components/identificador/solicitacoesContrato/blocos/PaymentInformationBlock";
import ElectricalInstallationDependentsInformationBlock from "../../../components/identificador/solicitacoesContrato/blocos/ElectricalInstallationDependentsInformationBlock";
function Formulario({ info }) {
	const [infoHolder, setInfoHolder] = useState(info);
	return (
		<div className="flex h-full flex-col gap-y-2">
			<div className="flex w-full items-center justify-center rounded-bl rounded-br bg-blue-800 p-2">
				<h1 className="w-full text-center font-bold tracking-tight text-white">FORMULÁRIO DE SOLICITAÇÃO DE CONTRATO</h1>
				<p className="text-center text-xs">{infoHolder.tipoDeServico}</p>
			</div>
			<div className="flex w-full flex-col gap-y-2 px-4">
				<GeneralInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={false} />
				<ContactInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={false} />
				<ElectricalInstallationInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={false} />
				<SystemInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={false} />
				<StructureInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={false} />
				<EnergyPAInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={false} />
				<OeMInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={false} />
				<InsuranceInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={false} />
				<PaymentInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={false} />
				<ElectricalInstallationDependentsInformationBlock infoHolder={infoHolder} setInfoHolder={setInfoHolder} userHasEditPermission={false} />
			</div>
		</div>
	);
}
export async function getServerSideProps({ query }) {
	// Fetch data from external API
	const id = query.id;
	const db = await connectToSolicitacoesDatabase(process.env.DB_KEY);
	const collection = db.collection("contrato");
	let os = await collection.findOne({
		_id: ObjectId(id),
	});
	let info = JSON.parse(JSON.stringify(os));
	// Pass data to the page via props
	return { props: { info } };
}
export default Formulario;
