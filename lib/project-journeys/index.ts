import { formatDateAsLocale } from "@/utils/methods/formatting";
import type { TProjectJourneyStageWorkflow } from "@/utils/schemas/project-journey";
import type { TProject } from "@/utils/schemas/projects";
import dayjs from "dayjs";
import { formatPhoneAsWhatsappId } from "../whatsapp/utils";

export const UFV_SYSTEM_PROJECT_JOURNEY_WORKFLOW_STAGES_LEGACY_CONFIG = [
	{
		ordem: 1,
		titulo: "BOAS VINDAS !",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 2,
		titulo: "ASSINATURA DAS DOCUMENTAÇÕES",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 3,
		titulo: "RESPOSTA DA CONCESSIONÁRIA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 4,
		titulo: "COMPRA DO KIT",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 5,
		titulo: "NF FATURADA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 6,
		titulo: "PREVISÃO DE ENTREGA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 7,
		titulo: "ENTREGA DO KIT",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 8,
		titulo: "INSTALAÇÃO AGENDADA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 9,
		titulo: "INSTALAÇÃO REALIZADA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 10,
		titulo: "VISTORIA REALIZADA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 11,
		titulo: "SISTEMA OPERANTE",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 12,
		titulo: "ENTREGA TÉCNICA",
		versao: "LEGADO" as const,
		concluido: false,
	},
	{
		ordem: 13,
		titulo: "JORNADA CONCLUÍDA",
		versao: "LEGADO" as const,
		concluido: false,
	},
];
export const UFV_SYSTEM_PROJECT_JOURNEY_WORKFLOW_STAGES_CONFIG: (TProjectJourneyStageWorkflow & { payload: (project: TProject) => any })[] = [
	{
		ordem: 1,
		titulo: "BOAS VINDAS !",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_boas_vindas",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "CONTRATO_ASSINADO",
		},
		payload: (project) => {
			return {
				content: `Olá, ${project.nomeDoContrato}. Sou a Ana Julia do pós-venda da Ampère Energias 😊
Que bom ter você com a gente aqui na Ampère! 🤩⚡

Estou à disposição para te acompanhar em cada passo do seu projeto solar. Se precisar de algo, é só me chamar. 😁🤝
Estamos na 1° etapa da construção do seu projeto. Vamos seguir juntos para garantir que tudo saia perfeito! 🚀☀️

Nessa etapa vamos organizar todas as documentações do seu projeto para enviar e homologar as informações no sistema da concessionária de energia. Após a resposta dela, entro em contato com você novamente para te informar!

*Agora é só aguardar* e obrigada por confiar no nosso trabalho!! 💙`,
				data: {
					messaging_product: "whatsapp",
					to: "553496626855", //formatPhoneAsWhatsappId(project.telefone as string),
					type: "template",
					template: {
						name: "jornada_boas_vindas",
						language: {
							code: "pt_BR",
						},
						components: [
							{
								type: "body",
								parameters: [
									{
										type: "text",
										parameter_name: "nome_cliente",
										text: project.nomeDoContrato,
									},
								],
							},
						],
					},
				},
			};
		},
	},
	{
		ordem: 2,
		titulo: "APROVAÇÃO DO PARECER DE ACESSO",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_aprovacao_parecer",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "HOMOLOGACAO_ACESSO_LIBERADO",
		},
		payload: (project) => {
			return {
				content: `Boa notícia, ${project.nomeDoContrato}.

Seu projeto foi aprovado pela concessionária de energia (CEMIG/Equatorial).
Agora seguimos para a compra dos equipamentos.

Importante: Em alguns casos, o setor financeiro pode entrar em contato para alinhamentos finais através deste número (34) 9.8406-5016.

Após o pagamento, iremos realizar a compra dos seus equipamentos e assim que estivermos com a previsão da entrega, volto a falar com você por aqui.

Obrigada por escolher a Ampère Energias! 💙`,
				data: {
					messaging_product: "whatsapp",
					to: "553496626855", //formatPhoneAsWhatsappId(project.telefone as string),
					type: "template",
					template: {
						name: "jornada_aprovacao_parecer",
						language: {
							code: "pt_BR",
						},
						components: [
							{
								type: "body",
								parameters: [
									{
										type: "text",
										parameter_name: "nome_cliente",
										text: project.nomeDoContrato,
									},
								],
							},
						],
					},
				},
			};
		},
	},
	{
		ordem: 3,
		titulo: "CONFIRMAÇÃO DO PAGAMENTO",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_confirmacao_pagamento",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "PAGAMENTO_EFETIVADO",
		},
		payload: (project) => {
			return {
				content: `Olá, ${project.nomeDoContrato}!

Passando aqui só para confirmar a efetivação do seu pagamento. ✅

Agora iremos realizar a compra dos seus equipamentos e assim que estivermos com a previsão da entrega, volto a falar com você por aqui.

Agora é só aguardar e obrigada por confiar no nosso trabalho!! 💙`,
				data: {
					messaging_product: "whatsapp",
					to: "553496626855", //formatPhoneAsWhatsappId(project.telefone as string),
					type: "template",
					template: {
						name: "jornada_confirmacao_pagamento",
						language: {
							code: "pt_BR",
						},
						components: [
							{
								type: "body",
								parameters: [
									{
										type: "text",
										parameter_name: "nome_cliente",
										text: project.nomeDoContrato,
									},
								],
							},
						],
					},
				},
			};
		},
	},
	{
		ordem: 5,
		titulo: "PREVISÃO DE ENTREGA",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_previsao_entrega",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "ENTREGA_PREVISTA",
		},
		payload: (project) => {
			return {
				content: `Olá, ${project.nomeDoContrato}!

Passando para te avisar que a entrega do seu sistema solar está confirmada e será realizada dia ${formatDateAsLocale(project.compra.previsaoEntrega)}.

Podemos confirmar ?`,
				data: {
					messaging_product: "whatsapp",
					to: "553496626855", //formatPhoneAsWhatsappId(project.telefone as string),
					type: "template",
					template: {
						name: "jornada_previsao_entrega",
						language: {
							code: "pt_BR",
						},
						components: [
							{
								type: "body",
								parameters: [
									{
										type: "text",
										parameter_name: "nome_cliente",
										text: project.nomeDoContrato,
									},
									{
										type: "text",
										parameter_name: "data_previsao_entrega",
										text: formatDateAsLocale(project.compra.previsaoEntrega),
									},
								],
							},
						],
					},
				},
			};
		},
	},
	{
		ordem: 6,
		titulo: "CONFIRMAÇÃO DA ENTREGA",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_confirmacao_entrega",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "ENTREGA_REALIZADA",
		},
		payload: (project) => {
			return {
				content: `Olá, ${project.nomeDoContrato}!

Seus equipamentos foram entregues com sucesso!
Agora, estamos organizando o agendamento da instalação.

Prazo estimado para instalação é de 2 a 3 semanas após a entrega.

Assim que a nossa equipe definir a data da sua instalação, venho aqui novamente te avisar com antecedência para você se organizar e receber nossos técnicos de montagem.

Agora é só aguardar e fique tranquilo que entraremos em contato o mais breve !`,
				data: {
					messaging_product: "whatsapp",
					to: "553496626855", //formatPhoneAsWhatsappId(project.telefone as string),
					type: "template",
					template: {
						name: "jornada_confirmacao_entrega",
						language: {
							code: "pt_BR",
						},
						components: [
							{
								type: "body",
								parameters: [
									{
										type: "text",
										parameter_name: "nome_cliente",
										text: project.nomeDoContrato,
									},
								],
							},
						],
					},
				},
			};
		},
	},
	// {
	// 	ordem: 7,
	// 	titulo: "CONFIRMAÇÃO DA ENTREGA (EXTERNO)",
	// 	versao: "WORKFLOW",
	// 	acoes: [
	// 		{
	// 			tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
	// 			metadados: {
	// 				whatsappTemplateId: "jornada_confirmacao_entrega_externo",
	// 				whatsappMessageId: null,
	// 			},
	// 		},
	// 	],
	// 	concluido: false,
	// 	gatilho: {
	// 		tipo: "NATIVO",
	// 		evento: "ENTREGA_REALIZADA",
	// 	},
	// 	payload: (project) => {
	// 		return {
	// 			content:
	// 				"<p>Olá, <strong>{{nome_cliente}}!</strong> </p><p>Seus equipamentos foram entregues com sucesso!</p><p>Agora, estamos organizando o agendamento da instalação.</p><p>Prazo estimado para instalação é de 2 a 3 semanas após a entrega.<br><br>Assim que a nossa equipe definir a data da sua instalação, venho aqui novamente te avisar com antecedência para você se organizar e receber nossos técnicos de montagem.</p><p><br><strong><em>Agora é só aguardar</em></strong> e fique&nbsp;tranquilo que entraremos em contato o mais breve !</p>",
	// 			data: {
	// 				messaging_product: "whatsapp",
	// 				to: "553496626855",  //formatPhoneAsWhatsappId(project.telefone as string),
	// 				type: "template",
	// 				template: {
	// 					name: "jornada_confirmacao_entrega",
	// 					language: {
	// 						code: "pt_BR",
	// 					},
	// 					components: [
	// 						{
	// 							type: "body",
	// 							parameters: [
	// 								{
	// 									type: "text",
	// 									parameter_name: "nome_cliente",
	// 									text: project.nomeDoContrato,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 			},
	// 		};
	// 	},
	// },
	{
		ordem: 8,
		titulo: "AGENDAMENTO DA INSTALAÇÃO",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_agendamento_montagem",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "EXECUCAO_AGENDADA",
		},
		payload: (project) => {
			return {
				content: `Olá, ${project.nomeDoContrato}!

Sua instalação foi agendada para ${formatDateAsLocale(project.obra.agendamentoEntrada)}.

A equipe chegará ao local no horário combinado.

Em caso de imprevistos como problemas técnicos ou climáticos, poderemos precisar reagendar. Se chover no dia agendado, remarcaremos para outra data.

Podemos confirmar?`,
				data: {
					messaging_product: "whatsapp",
					to: "553496626855", //formatPhoneAsWhatsappId(project.telefone as string),
					type: "template",
					template: {
						name: "jornada_agendamento_montagem",
						language: {
							code: "pt_BR",
						},
						components: [
							{
								type: "body",
								parameters: [
									{
										type: "text",
										parameter_name: "nome_cliente",
										text: project.nomeDoContrato,
									},
									{
										type: "text",
										parameter_name: "data",
										text: formatDateAsLocale(project.obra.agendamentoEntrada),
									},
								],
							},
						],
					},
				},
			};
		},
	},
	{
		ordem: 9,
		titulo: "SOLICITAÇÃO DE VISTORIA",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_solicitacao_vistoria",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "VISTORIA_SOLICITADA",
		},
		payload: (project) => {
			return {
				content: `Olá, ${project.nomeDoContrato}!

A instalação do seu sistema solar foi concluída com sucesso!

Em breve, ele será vistoriado e liberado para operação pela concessionária.

Agora é só aguardar e aguardar a CEMIG ir até o local da instalação para trocar o medidor do seu padrão!
A CEMIG tem até dia ${formatDateAsLocale(dayjs(project.homologacao.vistoria.dataSolicitacao).add(7, "days").toDate())} para realizar a vistoria e trocar seu medidor.

*Aviso importante:* É essencial que alguém esteja no local no momento da vistoria.

Assim que for realizada, por favor, nos avise para darmos sequência no seu projeto.

Obrigada por escolher a Ampère Energias! 💙`,
				data: {
					messaging_product: "whatsapp",
					to: "553496626855", //formatPhoneAsWhatsappId(project.telefone as string),
					type: "template",
					template: {
						name: "jornada_solicitacao_vistoria",
						language: {
							code: "pt_BR",
						},
						components: [
							{
								type: "body",
								parameters: [
									{
										type: "text",
										parameter_name: "nome_cliente",
										text: project.nomeDoContrato,
									},
									{
										type: "text",
										parameter_name: "previsao_vistoria",
										text: formatDateAsLocale(dayjs(project.homologacao.vistoria.dataSolicitacao).add(7, "days").toDate()),
									},
								],
							},
						],
					},
				},
			};
		},
	},
	{
		ordem: 10,
		titulo: "CONFIRMAÇÃO DA VISTORIA",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_aprovacao_vistoria",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "VISTORIA_REALIZADA",
		},
		payload: (project) => {
			return {
				content: `Olá, ${project.nomeDoContrato}!

Agora que seu medidor foi substituído, vamos realizar os testes finais:

1) Envie uma foto do disjuntor do sistema solar (geralmente está em uma caixa branca com nosso adesivo, ou dentro do seu quadro de disjuntores).
2) Depois, envie um vídeo de até 20 segundos do seu medidor de energia no padrão.

Com isso, conseguimos garantir que seu sistema solar está funcionando como o esperado!!

Fico no aguardo da sua resposta!! (da foto ou do vídeo)`,
				data: {
					messaging_product: "whatsapp",
					to: "553496626855", //formatPhoneAsWhatsappId(project.telefone as string),
					type: "template",
					template: {
						name: "jornada_aprovacao_vistoria",
						language: {
							code: "pt_BR",
						},
						components: [
							{
								type: "body",
								parameters: [
									{
										type: "text",
										parameter_name: "nome_cliente",
										text: project.nomeDoContrato,
									},
								],
							},
						],
					},
				},
			};
		},
	},
	{
		ordem: 11,
		titulo: "SISTEMA OPERANTE",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_sistema_operante",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "ENERGIA_INJETADA",
		},
		payload: (project) => {
			return {
				content: `Olá, ${project.nomeDoContrato}!

Seu sistema está ligado e gerando energia!

Para acompanhar a geração você precisa do aplicativo de acompanhamento. Abaixo estão instruções de como instalá-lo.

INSTRUÇÕES PARA BAIXAR APLICATIVO

Para BAIXAR O APLICATIVO basta acessar um dos links abaixo (dependendo do modelo do seu telefone).

Para dispositivos Android:
${"https://apps.apple.com/br/app/s-miles-enduser/id1544760866"}

Para dispositivos IOS:
${"https://apps.apple.com/br/app/s-miles-enduser/id1544760866"}

Observação: Todas as letras do login e senha são minúsculas.

Obrigada por escolher a Ampère Energias! 💙`,
				data: {
					messaging_product: "whatsapp",
					to: "553496626855", //formatPhoneAsWhatsappId(project.telefone as string),
					type: "template",
					template: {
						name: "jornada_sistema_operante",
						language: {
							code: "pt_BR",
						},
						components: [
							{
								type: "body",
								parameters: [
									{
										type: "text",
										parameter_name: "nome_cliente",
										text: project.nomeDoContrato,
									},
									{
										type: "text",
										parameter_name: "link_android", // TODO: get link for the inverter
										text: "https://apps.apple.com/br/app/s-miles-enduser/id1544760866",
									},
									{
										type: "text",
										parameter_name: "link_ios", // TODO: get link for the inverter
										text: "https://apps.apple.com/br/app/s-miles-enduser/id1544760866",
									},
								],
							},
						],
					},
				},
			};
		},
	},
	{
		ordem: 12,
		titulo: "JORNADA CONCLUÍDA",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_conclusao",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "JORNADA_CONCLUIDA",
		},
		payload: (project) => {
			return {
				content: `Olá, ${project.nomeDoContrato}!

Temos uma excelente notícia para você: Seu projeto de energia solar está oficialmente concluído e em pleno funcionamento! ☀️🚀

Parabéns por essa importante conquista!

Gostaríamos de expressar nossa sincera gratidão por ter confiado na Ampère Energias para realizar este sonho.
Foi um prazer e uma honra ser a sua parceira neste projeto.
Nossa missão é oferecer a melhor experiência, e esperamos ter superado suas expectativas em todas as etapas.

Sua opinião é a nossa energia! 💙

Baseado na sua experiência, de 0 a 10, qual a probabilidade de você recomendar a Ampère Energias para um amigo ou familiar?`,
				data: {
					messaging_product: "whatsapp",
					to: "553496626855", //formatPhoneAsWhatsappId(project.telefone as string),
					type: "template",
					template: {
						name: "jornada_conclusao",
						language: {
							code: "pt_BR",
						},
						components: [
							{
								type: "body",
								parameters: [
									{
										type: "text",
										parameter_name: "nome_cliente",
										text: project.nomeDoContrato,
									},
								],
							},
						],
					},
				},
			};
		},
	},
];

const test = [
	{
		ordem: 1,
		titulo: "BOAS VINDAS !",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_boas_vindas",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "CONTRATO_ASSINADO",
		},
	},
	{
		ordem: 2,
		titulo: "APROVAÇÃO DO PARECER DE ACESSO",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_aprovacao_parecer",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "HOMOLOGACAO_ACESSO_LIBERADO",
		},
	},
	{
		ordem: 3,
		titulo: "CONFIRMAÇÃO DO PAGAMENTO",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_confirmacao_pagamento",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "PAGAMENTO_EFETIVADO",
		},
	},
	{
		ordem: 5,
		titulo: "PREVISÃO DE ENTREGA",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_previsao_entrega",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "ENTREGA_PREVISTA",
		},
	},
	{
		ordem: 6,
		titulo: "CONFIRMAÇÃO DA ENTREGA",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_confirmacao_entrega",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "ENTREGA_REALIZADA",
		},
	},
	// {
	// 	ordem: 7,
	// 	titulo: "CONFIRMAÇÃO DA ENTREGA (EXTERNO)",
	// 	versao: "WORKFLOW",
	// 	acoes: [
	// 		{
	// 			tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
	// 			metadados: {
	// 				whatsappTemplateId: "jornada_confirmacao_entrega_externo",
	// 				whatsappMessageId: null,
	// 			},
	// 		},
	// 	],
	// 	concluido: false,
	// 	gatilho: {
	// 		tipo: "NATIVO",
	// 		evento: "ENTREGA_REALIZADA",
	// 	},
	// 	payload: (project) => {
	// 		return {
	// 			content:
	// 				"<p>Olá, <strong>{{nome_cliente}}!</strong> </p><p>Seus equipamentos foram entregues com sucesso!</p><p>Agora, estamos organizando o agendamento da instalação.</p><p>Prazo estimado para instalação é de 2 a 3 semanas após a entrega.<br><br>Assim que a nossa equipe definir a data da sua instalação, venho aqui novamente te avisar com antecedência para você se organizar e receber nossos técnicos de montagem.</p><p><br><strong><em>Agora é só aguardar</em></strong> e fique&nbsp;tranquilo que entraremos em contato o mais breve !</p>",
	// 			data: {
	// 				messaging_product: "whatsapp",
	// 				to: "553496626855",  //formatPhoneAsWhatsappId(project.telefone as string),
	// 				type: "template",
	// 				template: {
	// 					name: "jornada_confirmacao_entrega",
	// 					language: {
	// 						code: "pt_BR",
	// 					},
	// 					components: [
	// 						{
	// 							type: "body",
	// 							parameters: [
	// 								{
	// 									type: "text",
	// 									parameter_name: "nome_cliente",
	// 									text: project.nomeDoContrato,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 			},
	// 		};
	// 	},
	// },
	{
		ordem: 8,
		titulo: "AGENDAMENTO DA INSTALAÇÃO",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_agendamento_montagem",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "EXECUCAO_AGENDADA",
		},
	},
	{
		ordem: 9,
		titulo: "SOLICITAÇÃO DE VISTORIA",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_solicitacao_vistoria",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "VISTORIA_SOLICITADA",
		},
	},
	{
		ordem: 10,
		titulo: "CONFIRMAÇÃO DA VISTORIA",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_aprovacao_vistoria",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "VISTORIA_REALIZADA",
		},
	},
	{
		ordem: 11,
		titulo: "SISTEMA OPERANTE",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_sistema_operante",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "ENERGIA_INJETADA",
		},
	},
	{
		ordem: 12,
		titulo: "JORNADA CONCLUÍDA",
		versao: "WORKFLOW",
		acoes: [
			{
				tipo: "ENVIAR_MENSAGEM_TEMPLATE_WHATSAPP",
				metadados: {
					whatsappTemplateId: "jornada_conclusao",
					whatsappMessageId: null,
				},
			},
		],
		concluido: false,
		gatilho: {
			tipo: "NATIVO",
			evento: "JORNADA_CONCLUIDA",
		},
	},
];
