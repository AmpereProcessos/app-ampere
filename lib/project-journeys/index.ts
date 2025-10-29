import { formatDateAsLocale } from "@/utils/methods/formatting";
import type { TProjectJourneyStageWorkflow } from "@/utils/schemas/project-journey";
import type { TProject } from "@/utils/schemas/projects";
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
				content:
					"<p>Olá, {{nome_cliente}}. Sou a Ana Julia do pós-venda da Ampère Energias 😊</p><p><strong><em>Que bom ter você com a gente aqui na Ampère!</em></strong> 🤩⚡</p><p><br>Estou à disposição para te acompanhar em cada passo do seu projeto solar. Se precisar de algo, é só me chamar. 😁🤝<br><br><strong><em>Estamos na 1° etapa da construção do seu projeto.</em></strong> Vamos seguir juntos para garantir que tudo saia perfeito! 🚀☀️<br><br>Nessa etapa vamos organizar todas as documentações do seu projeto para enviar e homologar as informações no sistema da concessionária de energia. Após a resposta dela, entro em contato com você novamente para te informar!<br><br><strong>*Agora é só aguardar*</strong> e obrigada por confiar no nosso trabalho!! 💙</p>",
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
				content:
					"<p>Boa notícia, <strong>{{nome_cliente}}</strong> </p><p> </p><p> Seu projeto foi <strong><em>aprovado</em></strong> pela concessionária de energia (CEMIG/Equatorial).<br>Agora seguimos para a compra dos equipamentos.<br></p><p><strong><em>Importante:</em> </strong>Em alguns casos, o setor financeiro pode entrar em contato para alinhamentos finais através deste número <strong><em>(34) 9.8406-5016</em></strong>.</p><p> <strong><em>Após o pagamento</em></strong>, iremos realizar a compra dos seus equipamentos e assim que estivermos a previsão da entrega, volto a falar com você por aqui. </p><p><br>Obrigada por escolher a Ampère Energias! 💙</p>",
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
				content:
					"<p>Olá, <strong>{{nome_cliente}}</strong><br><br>Passando aqui só para confirmar a efetivação do seu pagamento. ✅<br><br>Agora iremos realizar a <strong><em>compra dos seus equipamentos</em></strong> e assim que estivermos a previsão da entrega, volto a falar com você por aqui.<br><br><strong><em>Agora é só aguardar</em></strong>e obrigada por confiar no nosso trabalho!! 💙</p>",
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
				content:
					"<p>Olá, <strong>{{nome_cliente}}</strong>!<br><br>Passando para te avisar que a entrega do seu sistema solar está confirmada e será realizada dia {{data_previsao_entrega}}</p><p><br>Podemos confirmar ?</p>",
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
				content:
					"<p>Olá, <strong>{{nome_cliente}}!</strong> </p><p>Seus equipamentos foram entregues com sucesso!</p><p>Agora, estamos organizando o agendamento da instalação.</p><p>Prazo estimado para instalação é de 2 a 3 semanas após a entrega.<br><br>Assim que a nossa equipe definir a data da sua instalação, venho aqui novamente te avisar com antecedência para você se organizar e receber nossos técnicos de montagem.</p><p><br><strong><em>Agora é só aguardar</em></strong> e fique tranquilo que entraremos em contato o mais breve !</p>",
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
				content:
					"<p>Olá, <strong>{{nome_cliente}}</strong>!<br><br>Sua instalação foi agendada para <strong>{{data}}</strong>.</p><p>A equipe chegará ao local no horário combinado.</p><p>Em caso de imprevistos como problemas técnicos ou climáticos, poderemos precisar reagendar. <strong><em>Se chover no dia agendado, remarcaremos para outra data.</em></strong><br></p><p><strong>Podemos confirmar?</strong></p>",
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
				content:
					"<p>Olá, <strong>{{nome_cliente}}!</strong> <br></p><p>A <strong><em>instalação</em></strong> do seu sistema solar foi <strong><em>concluída com sucesso!</em></strong><br><br>Em breve, ele será <strong><em>vistoriado e liberado</em></strong> para operação pela concessionária.<br><strong><em>Agora é só aguardar</em></strong> e aguardar a CEMIG ir até o local da instalação para trocar o medidor do seu padrão!<br>A CEMIG tem até dia <strong>{{previsao_vistoria}}</strong> para realizar a vistoria e trocar seu medidor.<br><br><strong>*Aviso importante:*</strong> É essencial que alguém esteja no local no momento da vistoria.<br><br>Assim que for realizada, <strong><em>por favor, nos avise</em></strong> para darmos sequência no seu projeto.<br><br>Obrigada por escolher a Ampère Energias! 💙</p>",
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
				content:
					"<p>Olá, <strong>{{nome_cliente}}!</strong> <br> </p><p> Agora que seu medidor foi substituído, vamos realizar os testes finais:<br><strong><em>1)</em></strong><em> </em><strong><em>Envie uma foto do disjuntor do sistema solar</em></strong> (geralmente está em uma caixa branca com nosso adesivo, ou dentro do seu quadro de disjuntores).<br><strong><em>2)</em></strong><em> Depois, </em><strong><em>envie um vídeo de até 20 segundos do seu medidor</em></strong> de energia no padrão.<br><br>Com isso, conseguimos garantir que seu sistema solar está tudo funcionando como o esperado!!<br><br><strong>Fico no aguardo da sua resposta!!</strong> (da foto do vídeo)</p>",
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
				content:
					"<p>Olá, <strong>{{nome_cliente}}!</strong><br><br>Seu sistema está ligado e gerando energia !<br>Para acompanhar a geração você precisa do aplicativo de acompanhamento. Abaixo estão instruções de como instalá-lo.<br><br><strong><em>INSTRUÇÕES PARA BAIXAR APLICATIVO</em></strong><br>Para BAIXAR O APLICATIVO basta acessar um dos links abaixos (dependendo do modelo do seu telefone).<br><br>Para dispositivos&amp;amp;nbsp;<strong><em>Android:</em></strong><br><strong>{{link_android}}</strong><br><br>Para dispositivos&amp;amp;nbsp;<strong><em>IOS:</em></strong><br><strong>{{link_ios}}</strong><br><br>Observação: Todas as letras do login e senha são minúsculas.<br><br>Obrigada por escolher a Ampère Energias!&amp;amp;nbsp; 💙</p>",
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
				content:
					"<p>Olá, <strong>{{nome_cliente}}</strong>!</p><p>Temos uma excelente notícia para você: <strong>Seu projeto de energia solar está oficialmente concluído e em pleno funcionamento!</strong> ☀️🚀<br><strong>Parabéns por essa importante conquista!</strong><br></p><p>Gostaríamos de expressar nossa sincera gratidão por ter <strong>confiado na Ampère Energias</strong> para realizar este sonho.<br>Foi um prazer e uma honra ser a sua parceira neste projeto. <br>Nossa missão é oferecer a melhor experiência, e esperamos ter superado suas expectativas em todas as etapas.<br></p><p><strong>Sua Opinião é a Nossa Energia! </strong>💙</p><p>Baseado na sua experiência, <strong>de 0 a 10</strong>, qual a probabilidade de você recomendar a Ampère Energias para um amigo ou familiar?</p>",
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
