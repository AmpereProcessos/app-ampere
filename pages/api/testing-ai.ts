import axios from "axios";
import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer } from "docx";
import type { NextApiRequest, NextApiResponse } from "next";

class ContractGenerator {
	defaultFont: string;
	defaultSize: number;
	constructor() {
		this.defaultFont = "Times New Roman";
		this.defaultSize = 26; // 13pt in half-points (docx uses half-points)
	}

	/**
	 * Parse markdown text and return segments with formatting
	 * @param {string} text - Text with markdown formatting
	 * @returns {Array} Array of objects with text and formatting properties
	 */
	parseMarkdownText(text: string) {
		const segments = [];

		// Pattern to match markdown formatting
		const pattern = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_|[^*_]+)/g;
		const parts = text.match(pattern) || [];

		for (const part of parts) {
			if (!part.trim()) continue;

			let isBold = false;
			let isItalic = false;
			let isUnderline = false;
			let cleanText = part;

			// Check for bold italic (***text***)
			if (part.startsWith("***") && part.endsWith("***") && part.length > 6) {
				isBold = true;
				isItalic = true;
				cleanText = part.slice(3, -3);
			}
			// Check for bold (**text**)
			else if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
				isBold = true;
				cleanText = part.slice(2, -2);
			}
			// Check for italic (*text*)
			else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
				isItalic = true;
				cleanText = part.slice(1, -1);
			}
			// Check for underline (__text__)
			else if (part.startsWith("__") && part.endsWith("__") && part.length > 4) {
				isUnderline = true;
				cleanText = part.slice(2, -2);
			}
			// Check for underline (_text_)
			else if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
				isUnderline = true;
				cleanText = part.slice(1, -1);
			}

			if (cleanText) {
				segments.push({
					text: cleanText,
					bold: isBold,
					italics: isItalic,
					underline: isUnderline ? {} : undefined,
				});
			}
		}

		return segments;
	}

	/**
	 * Create a paragraph with markdown formatting
	 * @param {string} text - Text with markdown
	 * @param {string} alignment - Paragraph alignment
	 * @returns {Paragraph} Docx paragraph object
	 */
	createMarkdownParagraph(
		text: string,
		alignment: "left" | "start" | "center" | "end" | "both" | "mediumKashida" | "distribute" | "numTab" | "highKashida" | "lowKashida" | "thaiDistribute" | "right",
	) {
		const segments = this.parseMarkdownText(text);

		if (segments.length === 0) {
			return new Paragraph({
				alignment: alignment || AlignmentType.LEFT,
			});
		}

		const textRuns = segments.map(
			(segment) =>
				new TextRun({
					text: segment.text,
					font: this.defaultFont,
					size: this.defaultSize,
					bold: segment.bold,
					italics: segment.italics,
					underline: segment.underline,
				}),
		);

		return new Paragraph({
			children: textRuns,
			alignment: alignment,
		});
	}

	/**
	 * Create a simple paragraph
	 * @param {string} text - Plain text
	 * @param {string} alignment - Paragraph alignment
	 * @param {boolean} bold - Bold formatting
	 * @returns {Paragraph} Docx paragraph object
	 */
	createSimpleParagraph(text: string, alignment = AlignmentType.CENTER, bold = false) {
		return new Paragraph({
			children: [
				new TextRun({
					text: text,
					font: this.defaultFont,
					size: this.defaultSize,
					bold: bold,
				}),
			],
			alignment: alignment,
		});
	}

	/**
	 * Create an empty paragraph (blank line)
	 * @returns {Paragraph} Empty paragraph
	 */
	createEmptyParagraph() {
		return new Paragraph({
			children: [new TextRun({ text: "" })],
		});
	}

	/**
	 * Process template by replacing placeholders
	 * @param {string} templatePath - Path to template document
	 * @param {Object} data - Contract data
	 * @returns {Document} Modified document
	 */
	// async processTemplate(templatePath, data) {
	// 	// Note: This is simplified as docx library doesn't directly support
	// 	// loading and modifying existing documents like python-docx
	// 	// You would need additional libraries like 'docx-templates' or 'pizzip'
	// 	// For now, we'll create a new document
	// 	console.log("Note: Template processing would require additional libraries like docx-templates");
	// 	return new Document({
	// 		sections: [
	// 			{
	// 				properties: {},
	// 				children: [],
	// 			},
	// 		],
	// 	});
	// }

	/**
	 * Generate complete contract document
	 * @param {Object} contractData - Contract data from JSON
	 * @param {string} templatePath - Optional template path
	 * @returns {Document} Generated document
	 */
	async generateContract(contractData: any, templatePath = null) {
		const paragraphs = [];

		// Add contratante text with markdown support
		if (contractData.contratanteTexto) {
			paragraphs.push(this.createMarkdownParagraph(contractData.contratanteTexto, AlignmentType.LEFT));
		}

		// Add contratada text with markdown support
		if (contractData.contratadaTexto) {
			paragraphs.push(this.createMarkdownParagraph(contractData.contratadaTexto, AlignmentType.LEFT));
		}

		// Add each clausula with markdown support
		if (contractData.clausulas) {
			for (const clausula of contractData.clausulas) {
				// Split by paragraphs and process each
				const paragraphTexts = clausula.split("\n");

				for (const paragraphText of paragraphTexts) {
					if (paragraphText.trim()) {
						// Handle single newlines within paragraphs
						const lines = paragraphText.split("\n") as string[];
						const combinedText = lines
							.map((line) => line.trim())
							.filter((line) => line)
							.join(" ");

						paragraphs.push(this.createMarkdownParagraph(combinedText, AlignmentType.JUSTIFIED));
					}
				}
			}
		}

		// Add blank line before date
		paragraphs.push(this.createEmptyParagraph());

		// Add date text
		if (contractData.dataTexto) {
			paragraphs.push(this.createMarkdownParagraph(contractData.dataTexto, AlignmentType.CENTER));
		}

		// Add blank line after date
		paragraphs.push(this.createEmptyParagraph());
		paragraphs.push(this.createEmptyParagraph());

		// Add signatures
		if (contractData.assinaturas) {
			const assinaturas = contractData.assinaturas;

			// Contratante signature
			if (assinaturas.contratante) {
				paragraphs.push(this.createSimpleParagraph("______________________________________"));
				paragraphs.push(this.createMarkdownParagraph(assinaturas.contratante.nome, AlignmentType.CENTER));
				paragraphs.push(this.createMarkdownParagraph(`CPF/CNPJ: ${assinaturas.contratante.cpfCnpj}`, AlignmentType.CENTER));
				paragraphs.push(this.createEmptyParagraph());
			}

			// Contratada signature
			if (assinaturas.contratada) {
				paragraphs.push(this.createSimpleParagraph("______________________________________"));
				paragraphs.push(this.createMarkdownParagraph(assinaturas.contratada.nome, AlignmentType.CENTER));
				paragraphs.push(this.createMarkdownParagraph(`CPF/CNPJ: ${assinaturas.contratada.cpfCnpj}`, AlignmentType.CENTER));
				paragraphs.push(this.createEmptyParagraph());
			}

			// Testemunha 1
			if (assinaturas.testemunha1) {
				paragraphs.push(this.createSimpleParagraph("______________________________________"));
				paragraphs.push(this.createMarkdownParagraph(`TESTEMUNHA 1: ${assinaturas.testemunha1.nome}`, AlignmentType.CENTER));
				paragraphs.push(this.createMarkdownParagraph(`CPF/CNPJ: ${assinaturas.testemunha1.cpfCnpj}`, AlignmentType.CENTER));
			}

			// Testemunha 2
			if (assinaturas.testemunha2) {
				paragraphs.push(this.createSimpleParagraph("______________________________________"));
				paragraphs.push(this.createMarkdownParagraph(`TESTEMUNHA 2: ${assinaturas.testemunha2.nome}`, AlignmentType.CENTER));
				paragraphs.push(this.createMarkdownParagraph(`CPF/CNPJ: ${assinaturas.testemunha2.cpfCnpj}`, AlignmentType.CENTER));
			}
		}

		// Create document
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: paragraphs,
				},
			],
		});

		return doc;
	}
}

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
	const contractGenerator = new ContractGenerator();
	const contract = await contractGenerator.generateContract(contractData);
	// Generate the DOCX file as a buffer
	const buffer = await Packer.toBuffer(contract);

	// Set headers for file download
	res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
	res.setHeader("Content-Disposition", "attachment; filename=contract.docx");
	res.status(200).send(buffer);
}
