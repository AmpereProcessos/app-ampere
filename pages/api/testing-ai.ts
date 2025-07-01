import { TProject } from "@/utils/schemas/projects";
import connectToDatabase from "@/utils/services/mongodb/projects";
import axios from "axios";
import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer } from "docx";
import type { NextApiRequest, NextApiResponse } from "next";

const contractData = {
	contratanteTexto: "**CONTRATANTE: CENTRO DE FORMAÇÃO DE CONDUTORES PILOTAR LTDA**",
	contratanteDados: {
		nome: "CENTRO DE FORMAÇÃO DE CONDUTORES PILOTAR LTDA",
		cpfCnpj: "10.681.060/0001-70",
		email: "hudson.bp10@gmail.com",
		representadoPor: {
			nome: "HUDSON ELIAS MARQUES DA SILVEIRA",
			estadoCivil: "NÃO INFORMADO",
			profissao: "SÓCIO",
			rg: "MG-11.566.763",
			cpfCnpj: "067.979.236-89",
			telefone: "(34) 99991-5572",
		},
	},
	contratadaTexto: "**CONTRATADA: AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA**",
	contratadaDados: {
		nome: "AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA",
		cpfCnpj: "27.901.968/0001-45",
		email: "NÃO INFORMADO",
		representadoPor: {
			nome: "DIOGO PAULINO CARVALHO",
			estadoCivil: "SOLTEIRO",
			profissao: "EMPRESÁRIO",
			rg: "MG-14372057",
			cpfCnpj: "072.427.186-43",
			telefone: "NÃO INFORMADO",
		},
		logoUrl: null,
		assinaturaUrl: null,
	},
	clausulas: [
		"**CLÁUSULA PRIMEIRA – DO OBJETO E FORMA DE EXECUÇÃO**\nConstitui objeto deste contrato o fornecimento de projeto, mão-de-obra, materiais e instalação de sistema de geração de energia fotovoltaica com potência instalada de 5,85 kWp.\n\n1.1.1.1. O objeto contratado será executado nas seguintes especificações: haverá interligação com rede de baixa tensão da concessionária de energia elétrica local instalada na RUA FRANCISCO REIS GOULART,Nº626, BAIRRO CENTRO,CEP38320-000, no Município de SANTA VITORIA/MG.\n\n1.2. O sistema contratado é composto por:\nA) Fornecimento dos materiais necessários para a instalação do sistema, e seu perfeito e cabal funcionamento, a saber:\nA.1. Módulos fotovoltaicos\nSerão fornecidos 10 (DEZ) módulos modelos HELIUS 585Wp.\nA.2. Micro inversor de frequência\nSerão fornecidos 3 (TREZ) micro inversores modelo HOYMILES 2kW.\nA.3. Sistemas de proteção\nA.3.1. Quadro de proteção para os circuitos de corrente contínua, contendo:\nA.3.2. DPS (Dispositivo de Proteção Contra Surtos) adequados para operação em corrente alternada;\nA.3.2.1. Fusíveis adequados para operação em corrente contínua;\nA.3.2.2. Disjuntor termomagnético.\nParágrafo único – os modelos estipulados no item A.1 e A.2, em caso de indisponibilidade com o fornecedor habitual, poderão ser substituídos por marcas diversas, mantendo-se, contudo, qualificações técnicas que sejam equivalentes a mesma qualidade com equivalência de preço, podendo variar para mais ou para menos.\nA.4. Cabos e Conexões\nA.4.1. Serão utilizados cabos de cobre com isolação adequada para o sistema fotovoltaico e nos pontos sobre o telhado e expostos ao sol com proteção contra raios UV;\nA.5. Sistema de fixação dos módulos nos telhados:\nA.5.1. Os suportes para fixação dos módulos são confeccionados em perfis metálicos, conforme demanda específica do CONTRATANTE indicada no projeto e em termo de visita técnica in loco.\nB) O projeto elétrico do sistema fotovoltaico será elaborado e executado conforme as normas da concessionária de energia elétrica local e a Resolução Normativa ANEEL N° 1000 (REN 1000) que estabelece as condições de acesso e define critérios técnicos e operacionais, requisitos de projeto, informações, dados e a implementação da conexão para Acessantes novos e já existentes;\nC) A CONTRATANTE fornecerá todos os documentos necessários a fim de que a CONTRATADA possa acompanhar solicitação em nome daquela perante a concessionária de energia elétrica, para liberar início de operação do sistema de geração fotovoltaica por parte da CONTRATADA;\nD) Todos os quadros e inversores receberão adesivos com a marca da CONTRATADA e informações da empresa para facilitar a identificação e o contato, sempre que necessário, com a prestadora dos serviços respectivos (A CONTRATADA). Todo o material remanescente, não empregado na execução do objeto, será devolvido para a CONTRATADA.",
		"**CLÁUSULA SEGUNDA – DOS PRAZOS**\nO prazo para a CONTRATADA elaborar o projeto é de 30 (trinta) dias, findo o qual referido documento será submetido à análise da concessionária de energia local.\n1. Somente após aprovação de projeto pela concessionária de energia local, cujo prazo é impróprio, é que será iniciada a prestação de serviços de instalação, o qual acontecerá em até 60 (sessenta) dias, uma vez que presente todo o equipamento necessário.\n2. Poderão atrasar a prestação de serviços fatos relativos a intempéries, chuvas, inundações e calamidades na proporção dos dias em que a equipe foi impedida de trabalhar, ainda que parcialmente;\n3. Na eventualidade de não cumprimento dos prazos por parte dos fornecedores, ou, ainda, comprometimento no desembaraço dos equipamentos junto a estação aduaneira, portos, dentro ou fora do território nacional, também justifica a dilação de prazo para a entrega do sistema, na proporção dos dias em que a equipe foi impedida de trabalhar ainda que parcialmente;\n4. Na eventualidade do CONTRATANTE demorar em disponibilizar o imóvel para a instalação dos equipamentos, pendente de obras e adequações necessárias (termo de visita técnica in loco), por igual, justifica-se o não cumprimento de prazo para a entrega do sistema, na proporção dos dias em que as obras se deem;",
	],
	dataTexto: "Ituiutaba/MG, 27 de Maio de 2025.",
	assinaturas: {
		contratante: {
			nome: "CENTRO DE FORMAÇÃO DE CONDUTORES PILOTAR LTDA",
			cpfCnpj: "**10.681.060/0001-70**",
			assinaturaUrl: null,
		},
		contratada: {
			nome: "AMPERE ENGENHARIA E CONSULTORIA ELETRICA LTDA-ME",
			cpfCnpj: "**27.901.968/0001-45**",
			assinaturaUrl: null,
		},
		testemunha1: {
			nome: "",
			cpfCnpj: "",
			assinaturaUrl: null,
		},
		testemunha2: {
			nome: "",
			cpfCnpj: "",
			assinaturaUrl: null,
		},
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const projectsDb = await connectToDatabase();

	const projectsCollection = projectsDb.collection<TProject>("dados");

	const aggregated = await projectsCollection
		.aggregate([
			{
				$match: {
					"contrato.status": "ASSINADO",
					tipoDeServico: "SISTEMA FOTOVOLTAICO",
				},
			},
			{
				$group: {
					_id: "$cidade",
					contagem: {
						$count: {},
					},
				},
			},
			{
				$sort: {
					contagem: -1,
				},
			},
		])
		.toArray();

	return res.json(aggregated);
}
