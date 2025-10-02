import type { TGetContractModelDataParams } from "@/lib/contract-generation";
import { processTemplate } from "@/lib/contract-generation/template-processor";
import dynamic from "next/dynamic";
import { useState } from "react";

const ContractTemplateEditor = dynamic(() => import("@/components/contract-templates/ContractTemplateEditor"), { ssr: false });

function TestComponent() {
	const [templateContent, setTemplateContent] = useState<string>(`
<h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>

<p>Entre as partes:</p>

<p><strong>CONTRATANTE:</strong> <span data-type="variable" data-id="customer.name" data-label="NOME DO CLIENTE">{{customer.name}}</span>, inscrito no CPF/CNPJ <span data-type="variable" data-id="customer.documents.cpfCnpj" data-label="CPF/CNPJ">{{customer.documents.cpfCnpj}}</span>, residente em <span data-type="variable" data-id="customer.location.address" data-label="ENDEREÇO">{{customer.location.address}}</span>, nº <span data-type="variable" data-id="customer.location.number" data-label="NÚMERO DO ENDEREÇO">{{customer.location.number}}</span>, <span data-type="variable" data-id="customer.location.neighborhood" data-label="BAIRRO">{{customer.location.neighborhood}}</span>, <span data-type="variable" data-id="customer.location.city" data-label="CIDADE">{{customer.location.city}}</span>/<span data-type="variable" data-id="customer.location.state" data-label="ESTADO">{{customer.location.state}}</span>.</p>

<p><strong>CONTRATADA:</strong> AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA, CNPJ 27.901.968/0001-45</p>

<h2>CLÁUSULA PRIMEIRA - DO OBJETO</h2>

<p>Constitui objeto deste contrato o fornecimento de projeto, mão-de-obra, materiais e instalação de sistema de geração de energia fotovoltaica com potência instalada de <span data-type="variable" data-id="system.totalPower" data-label="POTÊNCIA TOTAL">{{system.totalPower}}</span>kWp.</p>

<p>O sistema será instalado no endereço: <span data-type="variable" data-id="system.installationLocation.address" data-label="ENDEREÇO DE INSTALAÇÃO">{{system.installationLocation.address}}</span>, nº <span data-type="variable" data-id="system.installationLocation.number" data-label="NÚMERO (INSTALAÇÃO)">{{system.installationLocation.number}}</span>, <span data-type="variable" data-id="system.installationLocation.city" data-label="CIDADE (INSTALAÇÃO)">{{system.installationLocation.city}}</span>/<span data-type="variable" data-id="system.installationLocation.state" data-label="ESTADO (INSTALAÇÃO)">{{system.installationLocation.state}}</span>.</p>

<h3>Equipamentos:</h3>

<p><strong>Módulos Fotovoltaicos:</strong></p>
<p><span data-type="variable" data-id="system.equipments.modules" data-label="LISTA DE MÓDULOS">{{system.equipments.modules}}</span></p>

<p><strong>Inversores:</strong></p>
<p><span data-type="variable" data-id="system.equipments.inverters" data-label="LISTA DE INVERSORES">{{system.equipments.inverters}}</span></p>

<h2>CLÁUSULA SEGUNDA - DO VALOR</h2>

<p>O valor total do contrato é de <span data-type="variable" data-id="payment.value" data-label="VALOR TOTAL">{{payment.value}}</span> (<span data-type="variable" data-id="payment.valueInWords" data-label="VALOR POR EXTENSO">{{payment.valueInWords}}</span>).</p>

<p>Forma de pagamento: <span data-type="variable" data-id="payment.negotiation" data-label="FORMA DE NEGOCIAÇÃO">{{payment.negotiation}}</span> via <span data-type="variable" data-id="payment.resourceSource" data-label="ORIGEM DO RECURSO">{{payment.resourceSource}}</span>.</p>

<p>Data: <span data-type="variable" data-id="contract.date" data-label="DATA DO CONTRATO">{{contract.date}}</span></p>
	`);

	const [processedContract, setProcessedContract] = useState<string>("");

	const handleSave = (content: string) => {
		setTemplateContent(content);
		alert("Template salvo com sucesso!");
		console.log("Template HTML:", content);
	};

	const handlePreview = () => {
		// Sample data for testing
		const sampleData: TGetContractModelDataParams = {
			customer: {
				name: "João da Silva",
				phone: "(34) 99999-9999",
				email: "joao@example.com",
				maritalStatus: "CASADO(A)",
				documents: {
					cpfCnpj: "123.456.789-00",
					rg: "MG-12.345.678",
				},
				location: {
					address: "Rua das Flores",
					number: "123",
					complement: "Apto 45",
					neighborhood: "Centro",
					cep: "38300-000",
					city: "Ituiutaba",
					state: "MG",
				},
			},
			system: {
				topology: "INVERSOR",
				totalPower: 5.4,
				installationLocation: {
					address: "Rua das Flores",
					number: "123",
					complement: "",
					neighborhood: "Centro",
					cep: "38300-000",
					city: "Ituiutaba",
					state: "MG",
				},
				equipments: [
					{
						type: "MÓDULO",
						quantity: 12,
						model: "Canadian Solar 450W",
						power: 450,
						warranty: 25,
					},
					{
						type: "INVERSOR",
						quantity: 1,
						model: "Growatt 5000",
						power: 5000,
						warranty: 10,
					},
				],
			},
			additionalServices: {
				serviceEntranceAdequacy: true,
				structureAdequacy: false,
				operationAndMaintenance: true,
			},
			payment: {
				value: 28000,
				resourceSource: "OWN",
				negotiation: "80-20",
			},
		};

		const processed = processTemplate(templateContent, sampleData);
		setProcessedContract(processed);
	};

	return (
		<div className="flex flex-col gap-3 container mx-auto p-3">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold mb-2">Editor de Template de Contrato</h1>
				<p className="text-primary/60 mb-4">
					Defina variáveis como: <code className="bg-blue-100 text-blue-800 border border-blue-500 px-2 py-1 rounded">{"{{variável aqui}}"}</code> ou
					clique em INSERIR VARIÁVEL
				</p>
			</div>
			<ContractTemplateEditor initialContent={templateContent} onChange={setTemplateContent} onSave={handleSave} />
		</div>
	);
}

export default dynamic(() => Promise.resolve(TestComponent), { ssr: false });
