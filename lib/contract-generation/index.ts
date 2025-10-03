import { formatDecimalPlaces, formatToMoney } from "@/utils/constants";
import { formatWithoutDiacritics } from "@/utils/methods/formatting";
import axios from "axios";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import createHttpError from "http-errors";
// @ts-ignore
import numeroPorExtenso from "numero-por-extenso";
dayjs.locale(ptBr);

const CONTRACT_GENERATION_API_BASE_URL = "https://contract-generation-api-496303969093.southamerica-east1.run.app";
export type TGetContractModelDataParams = {
	customer: {
		name: string;
		phone: string;
		email: string;
		maritalStatus: string;
		documents: {
			cpfCnpj: string;
			rg: string;
		};
		location: {
			address: string;
			number: string;
			complement: string;
			neighborhood: string;
			cep: string;
			city: string;
			state: string;
		};
	};
	system: {
		topology: "INVERSOR" | "MICRO-INVERSOR";
		totalPower: number;
		installationLocation: {
			address: string;
			number: string;
			complement: string;
			neighborhood: string;
			cep: string;
			city: string;
			state: string;
		};
		equipments: {
			type: "MÓDULO" | "INVERSOR";
			quantity: number;
			model: string;
			power: number;
			warranty: number;
		}[];
	};
	additionalServices: {
		serviceEntranceAdequacy: boolean;
		structureAdequacy: boolean;
		operationAndMaintenance: boolean;
	};
	payment: {
		value: number;
		resourceSource: "OWN" | "BANK FINANCING";
		negotiation: "100%" | "80-20";
	};
};

export function getContractModelData({ customer, system, additionalServices, payment }: TGetContractModelDataParams) {
	const MARITAL_STATUS_MAP = {
		"CASADO(A)": "casado(a)",
		"SOLTEIRO(A)": "solteiro(a)",
		"UNIÃO ESTÁVEL": "em união estável",
		"DIVORCIADO(A)": "divorciado(a)",
		"VIUVO(A)": "viúvo(a)",
	};
	const companyText =
		"**CONTRATADA: AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA**, com nome fantasia de AMPÈRE ENERGIAS, inscrita no CNPJ/MF n.º **27.901.968/0001-45**, com sede na **Rua 28**, **n.º 1842**, **Centro**, **CEP 38300-082**, município de **Ituiutaba/MG**, por seu representante legal, Diogo Paulino Carvalho, brasileiro, solteiro, empresário, titular do RG **MG-14372057** e do CPF/MF **072.427.186-43**, residente e domiciliada na **Rua Vinte e Quatro**, n.º **75**, **Bairro Centro**, **CEP 38.300-078**, **Ituiutaba/MG**, integrada à **DAP CONSULTORIA INTEGRADA LTDA**, nome fantasia **IZAIRA SERVIÇOS**, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob nº **43.830.044/0001-51**, com sede na **Rua 28**, **n.º 1842**, **Centro**, **CEP 38300-082**, município de **Ituiutaba/MG**. \n\n";
	const customerText = `**CONTRATANTE: ${customer.name}**, brasileiro (a), ${MARITAL_STATUS_MAP[customer.maritalStatus as keyof typeof MARITAL_STATUS_MAP] || "estado civil não definido"}, titular do RG **${customer.documents.rg}**, inscrito(a) no CPF/MF n.º **${customer.documents.cpfCnpj}**, com telefone **${customer.phone}**, com endereço em **${customer.location.address}**, **Nº${customer.location.number || "N/A"}** , **BAIRRO ${customer.location.neighborhood}**, **CEP ${customer.location.cep}**, no município de **${customer.location.city} ${customer.location.state}**, com endereço eletrônico **${customer.email}**. \n\n`;

	const modules = system.equipments?.filter((r) => r.type === "MÓDULO") || [];
	const inverters = system.equipments?.filter((r) => r.type === "INVERSOR") || [];
	const modulesText = modules.map((r) => `- ${r.quantity} módulos ${r.model} ${r.power}W`).join("\n");
	const invertersText = inverters
		.map((r) => `- ${r.quantity} ${system.topology === "INVERSOR" ? "inversores" : "micro-inversores"} ${r.model} ${r.power}W`)
		.join("\n");
	const modulesMinWarranty = modules.reduce((acc, r) => acc + r.warranty, 0);
	const invertersMinWarranty = inverters.reduce((acc, r) => acc + r.warranty, 0);

	const firstContractSection =
		"**CLÁUSULA PRIMEIRA -- DO OBJETO E FORMA DE EXECUÇÃO**\n\n" +
		`Constitui objeto deste contrato o fornecimento de projeto, mão-de-obra, materiais e instalação de sistema de geração de energia fotovoltaica com potência instalada de **${formatDecimalPlaces(system.totalPower || 0)}kWp**.\n\n` +
		"1.1.1.1. O objeto contratado será executado nas seguintes especificações: haverá interligação com rede de baixa tensão da concessionária de energia elétrica local instalada na \n\n" +
		`**${system.installationLocation.address},Nº${system.installationLocation.number}, BAIRRO ${system.installationLocation.neighborhood},CEP ${system.installationLocation.cep}**, no Município de **${system.installationLocation.city}/${system.installationLocation.state}.**\n\n` +
		"1.2. O sistema contratado é composto por:\n\n" +
		"A) Fornecimento dos materiais necessários para a instalação do sistema, e seu perfeito e cabal funcionamento, a saber:\n\n" +
		"   **A.1. Módulos fotovoltaicos**\n" +
		`       Serão fornecidos: \n ${modulesText}.\n` +
		"   **A.2. Inversores de frequência**\n" +
		`       Serão fornecidos: \n ${invertersText}.\n` +
		"   **A.3. Sistemas de proteção**\n" +
		"       A.3.1. Quadro de proteção para os circuitos de corrente contínua, contendo:\n\n" +
		"       A.3.2. DPS (Dispositivo de Proteção Contra Surtos) adequados para operação em corrente alternada;\n\n" +
		"           A.3.2.1. Fusíveis adequados para operação em corrente contínua;\n\n" +
		"           A.3.2.2. Disjuntor termomagnético.\n\n" +
		"Parágrafo único -- os modelos estipulados no item A.1 e A.2, em caso de indisponibilidade com o fornecedor habitual, poderão ser substituídos por marcas diversas, mantendo-se, contudo, qualificações técnicas que sejam equivalentes a mesma qualidade com equivalência de preço, podendo variar para mais ou para menos.\n\n" +
		"   **A.4. Cabos e Conexões**\n\n" +
		"       A.4.1. Serão utilizados cabos de cobre com isolação adequada para o sistema fotovoltaico e nos pontos sobre o telhado e expostos ao sol com proteção contra raios UV;\n\n" +
		"   **A.5. Sistema de fixação dos módulos nos telhados**\n\n" +
		"       A.5.1. Os suportes para fixação dos módulos são confeccionados em perfis metálicos, conforme demanda específica do **CONTRATANTE** indicada no projeto e em termo de visita técnica *in loco.*\n\n" +
		"B) O projeto elétrico do sistema fotovoltaico será elaborado e executado conforme " +
		"**as normas da concessionária de energia elétrica local** e a Resolução Normativa ANEEL N° 1000 (REN 1000) que estabelece as condições de acesso e define critérios " +
		"técnicos e operacionais, requisitos de projeto, informações, dados e a implementação da conexão para Acessantes novos e já existentes;\n\n" +
		"C) **A CONTRATANTE** fornecerá todos os documentos necessários a fim de que a **CONTRATADA** possa acompanhar solicitação em nome daquela perante a concessionária de energia elétrica, para liberar início de operação do sistema de geração fotovoltaica por parte da **CONTRATADA;**\n\n" +
		"D) Todos os quadros e inversores receberão adesivos com a marca da **CONTRATADA** e informações da empresa para facilitar a identificação e o contato, sempre que necessário, com a prestadora dos serviços respectivos (**A CONTRATADA**). Todo o material remanescente, não empregado na execução do objeto, será devolvido para a CONTRATADA.";

	const secondContractSection =
		"**CLÁUSULA SEGUNDA -- DOS PRAZOS**\n\n" +
		"O prazo para a CONTRATADA **elaborar** o projeto é de **30 (trinta) dias**, " +
		"findo o qual referido documento será submetido à análise da concessionária de energia local.\n\n" +
		"1. Somente após aprovação de projeto pela concessionária de energia local, cujo prazo é impróprio, " +
		"é que será iniciada a prestação de serviços de instalação, o qual acontecerá em até 60 (sessenta) dias, " +
		"uma vez que presente todo o equipamento necessário.\n\n" +
		"2. Poderão atrasar a prestação de serviços fatos relativos a intempéries, chuvas, inundações e calamidades " +
		"na proporção dos dias em que a equipe foi impedida de trabalhar, ainda que parcialmente;\n\n" +
		"3. Na eventualidade de não cumprimento dos prazos por parte dos fornecedores, ou, ainda, comprometimento no desembaraço dos equipamentos " +
		"junto a estação aduaneira, portos, dentro ou fora do território nacional, também justifica a dilação de prazo para a entrega do sistema, " +
		"na proporção dos dias em que a equipe foi impedida de trabalhar ainda que parcialmente;\n\n" +
		"4. Na eventualidade do **CONTRATANTE** demorar em disponibilizar o imóvel para a instalação dos equipamentos, " +
		"pendente de obras e adequações necessárias (termo de visita técnica *in loco)*, por igual, justifica-se o não cumprimento de prazo para a entrega do sistema, " +
		"na proporção dos dias em que as obras se deem;";

	const paymentFormText =
		payment.negotiation === "100%"
			? "     1.1 Será pago em parcela única 100% do valor do contrato após a CONTRATADA apresentar projeto a concessionaria de energia elétrica local e obter desta a aprovação do documento."
			: "     1.1 A primeira parcela será paga 80%% do valor do contrato após a CONTRATADA apresentar projeto a concessionaria de energia elétrica local e obter desta a aprovação do documento.\n\n" +
				"     1.2 A segunda parcela será paga 20% do valor do contrato após a CONTRATADA finalizar a instalação do equipamento fotovoltaico.";

	const paymentNonIncludedText =
		"**3. O VALOR CONTRATADO NÃO ABRANGE**: \n\n" +
		"- A adequação/readequação de telhados, madeiramentos, ferragens de sustentação do telhado, vigas, calhas, rufos, instalação ou troca de materiais de rede elétrica existente;\n\n" +
		`${!additionalServices.serviceEntranceAdequacy ? "- A melhoria e adequação no padrão de energia;\n\n" : ""}` +
		`${!additionalServices.structureAdequacy ? "- O fornecimento de estruturas de inclinação ou construção de barracões ou estruturas avulsas para instalações dos módulos fotovoltaico;\n\n" : ""}` +
		"- A execução e custeio de quaisquer obras diversas da natureza dos serviços prestados pela **CONTRATADA**;\n\n" +
		"Cabe ao **CONTRATANTE** a execução e custeio de quaisquer obras diversas da natureza dos serviços prestados pela **CONTRATADA**, " +
		"caso verificada a necessidade pela concessionária de energia ou equipe técnica destinada a instalação do sistema fotovoltaico, especificada em termo de visita técnica e, ainda, aquelas que, porventura, durante a execução do objeto, forem necessárias.\n\n";

	const thirdContractSection =
		"**CLÁUSULA TERCEIRA -- DO PREÇO E FORMAS DE PAGAMENTO**\n\n" +
		`A CONTRATANTE pagará a CONTRATADA o valor total de ${formatToMoney(payment.value)} (${numeroPorExtenso.porExtenso(payment.value, numeroPorExtenso.estilo.monetario)}), o qual será pago da seguinte forma:\n\n` +
		`1. **A CONTRATANTE realizará o pagamento ${payment.negotiation} do valor total do contrato via ${payment.resourceSource === "OWN" ? "capital próprio" : "financiamento bancário"}.**\n\n` +
		paymentFormText +
		"Pagamento deverá ser a vista, via pix, boleto ou transferência." +
		"Após o pagamento o CONTRATANTE deverá enviar comprovante para a CONTRATADA.\n\n" +
		"2. O preço acima ajustado compreende além da remuneração da mão-de-obra, o fornecimento pela **CONTRATADA**, dos materiais, equipamentos e ferramentas necessárias à perfeita execução dos serviços de instalação do sistema fotovoltaico, " +
		"incluídos também no valor supracitado, todos os custos e remunerações diretas e indiretas, impostos, contribuições trabalhistas, previdenciárias e sociais, de qualquer natureza, obrigações fiscais e seguros, inclusive encargos sociais. " +
		"Compreende, por fim, os objetos necessários para instalação, sem ônus para o **CONTRATANTE,** com exceção das disposições inseridas no item seguinte,\n\n" +
		paymentNonIncludedText +
		'4. Para todos os efeitos legais e jurídicos, utilizar-se a o valor total constante no "caput" desta cláusula;';

	const fourthContractSection =
		"**CLÁUSULA QUARTA -- REAJUSTE**\n\n" +
		"O preço total deste contrato **poderá ser reajustado** caso o CONTRATANTE, devidamente notificado para realizar o pagamento de entrada " +
		"(por boleto, transferência ou PIX), atrase sua efetivação.\n\n" +
		"**Parágrafo primeiro** -- Poderá, ainda, haver repactuação contratual em caso de total imprevisão que sobreleve desproporcionalmente o custo " +
		"da prestação de serviços de modo que, comparada às condições iniciais do contrato, tornem a execução deste extremamente onerosa à **CONTRATADA.**\n\n" +
		"**Parágrafo segundo --** Considerando prazo impróprio para emissão de parecer da concessionária de energia elétrica local, a CONTRATADA congelará " +
		"preço do contrato em até 30 (trinta) dias a contar da data de assinatura deste em relação ao kit fotovoltaico. Após esse prazo, o contrato poderá sofrer " +
		"alterações com relação aos preços dos equipamentos de acordo com mercado. EM CASO DE RESCISÃO do contrato por parte da CONTRATANTE, esta deverá realizar " +
		"pagamento de 6% (seis por cento) no valor total do contrato.";

	const fifthContractSection =
		"**CLÁUSULA QUINTA -- DAS OBRIGAÇÕES DA CONTRATADA**\n\nConstituem obrigações da CONTRATADA:\n\n1. Cumprir rigorosamente todas as normas técnicas que se referem à Segurança e Medicina do Trabalho, correndo por conta da **CONTRATADA** o fornecimento de luvas, capacetes, calçados adequados e demais equipamentos de segurança a seus funcionários;\n\n2. Cuidar pelo perfeito cumprimento das disposições contidas neste instrumento, especialmente no que tange ao controle de qualidade dos serviços e/ou produtos adquiridos e processos utilizados na sua aplicação;\n\n**Parágrafo primeiro** -- Será de responsabilidade exclusiva da **CONTRATADA** os encargos e direitos trabalhistas e/ou previdenciários relacionados a eventuais contratos firmados e funcionários para execução do objeto contratado;";

	const sixthContractSection =
		"**CLÁUSULA SEXTA -- DAS OBRIGAÇÕES DO CONTRATANTE**\n\nConstituem obrigações da CONTRATANTE:\n\n1. Permitir acesso livre às dependências dos imóveis que se darão as obras;\n\n2. Efetuar os pagamentos conforme cláusula segunda;\n\n3. Fornecer as informações necessárias para elaboração do projeto de geração fotovoltaica;\n\n4. Indicar e liberar local adequado para instalação dos inversores e quadros de proteção;\n\n5. Realizar as obras internas no que diz respeito às suas instalações físicas e/ou elétricas quando for constatado pela equipe técnica que tais obras sejam necessárias para a correta instalação e funcionamento do sistema gerador, ou quando exigidas pela concessionária de energia elétrica local, de acordo com exigência em parecer desta, declarando-se ciente que o prazo para execução somente poderá iniciar a partir da conclusão das obras e liberação definitiva por parte da concessionária de energia;\n\n6. Estar em completa **regularidade fiscal** perante a concessionário de energia, livre e desembaraçada de qualquer débito que impeça prosseguir com o objeto contratual, sabendo que o contrário poderá gerar atrasos na execução;\n\n7. É da **CONTRATANTE a exclusiva responsabilidade** por qualquer evento danoso que venha a ocorrer no telhado ou nas estruturas dos imóveis após a execução dos serviços contratados, vez que a instalação é realizada em estrutura ou imóvel já existente, como residências, barracões ou quaisquer tipos de estrutura não projetada e executada, salvo nos casos de efetiva comprovação de negligência, imperícia ou imprudência da **CONTRATADA**;\n\n8. Ainda, é de inteira responsabilidade da **CONTRATANTE** a garantia de informações prestadas à **CONTRATADA** quanto à estruturação do imóvel que receberá a instalação do sistema fotovoltaico, cujo peso é de aproximadamente **20** **(vinte) quilos** por metro quadrado, distribuído e multiplicado por toda a área ocupada, isentando a **CONTRATADA** de eventuais danos futuros à estrutura do imóvel, seja física ou elétrica.\n\n9. Considerando que a CONTRATADA não é fornecedora de equipamentos apenas trabalha como intermediadora na compra dos mesmos, caso qualquer uma das partes venha a desistir deste contrato, ou em caso de parecer da concessionaria seja negado, o equipamento é de propriedade e responsabilidade do CONTRATANTE.\n\n10. Todo o material para o projeto citado na clausula primeira, é faturado do distribuidor direto para o CONTRATANTE, e será enviado para o endereço de instalação, sendo de inteira responsabilidade do CONTRATANTE armazenar e zelar afim de evitar danos ou roubo.\n\n**Parágrafo único --** Caso **o CONTRATANTE** deseje monitorar remotamente seu sistema fotovoltaico, é de obrigação deste deixar um ponto de internet de conexão Wi- fi de até 5 metros de distância do local de instalação dos equipamentos com a conexão em funcionamento quando da execução do serviço, caso no momento da instalação for constatado pela CONTRATADA que o modem seja incompatível com os comunicadores do sistema solar, será de responsabilidade do CONTRATANTE realizar as adequações para que a CONTRATADA reconfigure o sistema. **Todavia, caso o cliente altere a senha, *modem* ou roteador** e isso implique em perda de conexão, fazendo com que a CONTRATADA retorne após a instalação, a fim de restabelecer a comunicação do monitoramento do sistema fotovoltaico, **será cobrado taxa extra, a qual será estabelecida levando em consideração o endereço da instalação e tempo para o serviço.**\n\n11. Responder perante a concessionária CEMIG por eventuais medidas que esta atribuir à usina e seu titular.";

	const seventhContractSection = `**CLÁUSULA SÉTIMA -- DAS GARANTIAS DOS SERVIÇOS, MATERIAIS E EQUIPAMENTOS**\n\n1. **Micro Inversores de frequência:** ${invertersMinWarranty} anos contra defeitos de fabricação a partir da data da instalação;\n\n2. **Módulos solares:** ${modulesMinWarranty} anos contra defeitos de fabricação e de 30 (TRINTA) anos de garantia de geração com no mínimo 80% (oitenta por cento) da sua eficiência, contados a partir da data da instalação (considerar a perda de eficiência de 0,8% a.a.);\n\n3. Em caso de o CONTRATANTE não optar pelo serviço de acompanhamento e manutenção do sistema pela CONTRATADA a CONTRATADA não assumirá nenhuma responsabilidade quanto a acompanhamento de performance ou qualquer prejuízo que venha a ocorrer devido esse fato.\n\n4. A **CONTRATADA** oferece 12 (doze) meses de garantia dos serviços de instalação, o qual não se estende às peças e equipamentos, observado o item 7.7.\n\n5. A garantia da prestação de serviços do sistema fotovoltaico apenas terá validade se o cliente realizar manutenção preventiva nos equipamentos com a CONTRATADA ou empresa autorizada por esta documentalmente.\n\n6. Caso outra empresa ou profissional realize qualquer tipo de manutenção preventiva, corretiva ou preditiva ou faça alguma alteração no projeto e/ou instalação o **CONTRATANTE perderá a garantia dos serviços** e equipamentos diretamente com a **CONTRATADA**, ficando apenas com a garantia diretamente com o fabricante ou distribuidor dos equipamentos.\n\n7. As garantias prestadas nas cláusulas 7.1 e 7.2 referem àquelas prestadas pelo fabricante.\n\n**7.8 DA DISPONIBILIDADE ELÉTRICA APROVADA PELA CONCESSIONÁRIA:** O **CONTRATANTE** declara CIÊNCIA ACERCA DAS CONDIÇÕES APRESENTADAS EM PARECER DA **CEMIG** e demais alternativas. De forma independente deste parecer, opta o CONTRATANTE pela aquisição integral dos equipamentos descritos na cláusula primeira, item A, estando ainda ciente das medidas tomadas pela concessionária mencionadas nas cláusulas 6, 7 e 8 do parecer de acesso, pelas quais é responsável.`;

	const eighthContractSection =
		"**CLÁUSULA OITAVA -- DA RESCISÃO E MULTAS**\n\nO presente contrato se extinguirá definitivamente após entrega do objeto contratado, permanecendo, contudo, obrigações da **CONTRATADA** quanto às garantias, desde que de acordo com as cláusulas constante na cláusula sexta, e quanto ao acompanhamento de performance, caso este seja manifestado e autorizado pelo **CONTRATANTE** documentalmente.\n\n1. A parte **CONTRATANTE** poderá exercer desistência do contrato no prazo de até 10 (dez) dias após assinatura deste, estando ciente que, neste caso, incidirá multa de 6% sobre o valor total do mesmo.\n\n2. O CONTRATANTE responderá por perdas e danos à parte CONTRATADA no caso de desistência após prazo citado na cláusula primeira, incidindo multa no valor constante na mesma.\n\n   1. Em caso de morte da parte CONTRATANTE, a CONTRATADA cessará a prestação de serviço, exceto nos casos de:\n\n   2. prever situações de acordo com cada fase.\n\n3. O contrato poderá ser resilido unilateralmente pela **CONTRATADA,** em caso de franco descumprimento de obrigações da parte **CONTRATANTE.**\n\n4. Caso a **CONTRATADA** venha sem motivo aparente decidir pela rescisão deste contrato deverá ser aplicada a multa de 6% do valor total do contrato.\n\n**Parágrafo único --** Caso o parecer da concessionária de energia elétrica local condicionar o acesso à realização de obras na rede de distribuição de energia elétrica, e tais obras forem por conta do **CONTRATANTE,** e este desistir de realizar tais obras, inviabilizando a continuidade do contrato, poderá rescindi-lo mediante pagamento de multa de 6% (seis por cento) sobre o valor total do contrato a título de indenização em favor da **CONTRATADA** pelos custos com a execução de todo o projeto até aquele momento;";

	const ninthContractSection =
		"**CLAÚSULA NONA -- PROTEÇÃO DE DADOS**\n\n1. A CONTRATADA manterá todas as informações da CONTRATANTE salvas em servidor físico e/ou servidores remotos, guardando o mais completo e absoluto sigilo sobre as informações e dados da CONTRATANTE a que tiver acesso em razão da presente prestação de serviços, utilizando-as apenas quando estritamente necessário para a prestação dos serviços acordados em contrato, em conformidade com a Lei Geral da Proteção dos Dados - LGPD (Lei 13.709 -- 14/08/2018), dentre os casos que seguem:\n\na) Mediante o fornecimento de consentimento pelo titular, para fins de aprovação de financiamento por instituição bancária devidamente credenciada, assim como em caso de aquisição de equipamentos com fornecedores, a fim de permitir a regular consecução dos serviços delineados no presente contrato;\n\nb) Para o cumprimento de obrigação legal ou regulatória;\n\nc) Para atender ordem judicial;\n\nd) Pela administração pública, para o tratamento e uso compartilhado de dados necessários à execução de políticas públicas previstas em leis e regulamentos ou respaldadas em contratos, convênios ou instrumentos congêneres;\n\ne) Para a realização de estudos por órgão de pesquisa, garantida, sempre que possível, a anonimização dos dados pessoais;\n\nf) Para a proteção da vida ou da incolumidade física do titular ou de terceiros;\n\ng) Para a tutela da saúde, exclusivamente, em procedimento realizado por profissionais de saúde, serviços de saúde ou autoridade sanitária;\n\nh) Para a proteção do crédito, quando disposto na legislação pertinente (inclusive o disposto na Lei 9.613/98 e Resolução 1445/13 do CFC);\n\ni) Para fins de cadastro em aplicativos das concessionárias de energia, quando necessário a realização de processos administrativos para concessão de autorização para implementação do plano de produção de energia elétrica fotovoltaica;\n\nj) - Transferência a terceiro, respeitados os requisitos de tratamento de dados dispostos na LGPD.\n\n   1. - A CONTRATANTE tem direito ao acesso às informações sobre o tratamento de seus dados, que serão disponibilizadas de forma clara, adequada e ostensiva, mediante solicitação.\n\n   2. -- A CONTRATADA não será responsável perante a CONTRATANTE quando proceder com o desenvolvimento em cumprimento às premissas da LGPD e após à entrega, seja constatado que uma prática de mercado amplamente adotada teria violado a LGPD, a partir de entendimentos judiciais ou administrativos até o presente momento inexistentes.\n\n   3. - A CONTRATADA se comprometa a atender as autoridades fiscais, inclusive quando das eventuais verificações nas dependências da CONTRATANTE, todavia, não será responsabilidade da CONTRATADA responder por eventuais contingências e/ou multas aplicadas sobre fatos ou atos praticados pela CONTRATANTE, ou apresentar obrigatoriamente, soluções com defesa sobre autuações.\n\n4. -- O CONTRANTE neste ato declara ciência de que a CONTRATADA não poderá ser responsabilizada por eventual tratamento inadequado dos dados do CONTRATANTE por parte das instituições financeiras ou fornecedores de equipamentos, uma vez que necessário para o regular cumprimento do contrato e a consecução dos serviços os quais dispõem-se a realizar.";

	const tenthContractSection =
		"**CLÁUSULA DÉCIMA-- DAS DISPOSIÇÕES GERAIS**\n\n**10.1**. Tendo em vista que o objeto do presente contrato utiliza fonte natural de energia -- sol -- está ciente a parte CONTRATANTE que a produção de energia elétrica condiciona-se à disponibilidade e incidência solar sobre as placas fotovoltaicas.\n\n2. Este contrato de prestação de serviços não garante que o **CONTRATANTE** deixará de pagar ou reduza suas contas de energia para o custo mínimo de disponibilidade perante a concessionária de energia elétrica local, uma vez que isso dependerá exclusivamente do quanto de energia o **CONTRATANTE** consumir nos locais em que o sistema fotovoltaico for instalado.\n\n3. Em caso de necessidade de cobrança administrativa ou judicial, o **CONTRATANTE** ficará obrigado ao pagamento de honorários advocatícios em 10% (dez por cento) sobre o valor do contrato.\n\n4. Nenhuma das partes será responsável pelo descumprimento das obrigações contraídas neste contrato quando este for ocasionado em consequência de força maior ou caso fortuito, conforme disposto no art. 393 do Código Civil Brasileiro";

	const eleventhContractSection =
		"**CLÁUSULA DÉCIMA PRIMEIRA -- DA ELEIÇÃO DE FORO**\n\nAs partes elegem o foro da Comarca de Ituiutaba/MG, com exclusão de qualquer outro, por mais privilegiado que o seja, para dirimir quaisquer conflitos eventualmente originados a partir deste Contrato.\n\nAssim, por estarem livremente ajustados com as disposições contidas neste instrumento, o qual segue com 12 (doze) páginas assinam-no em 02 (duas) vias de igual forma e teor, para um só efeito legal na presença de 02 (duas) testemunhas, que também assinam, para produção de efeitos legais.";

	return {
		contratanteTexto: customerText,
		contratanteDados: {
			nome: customer.name,
			cpfCnpj: customer.documents.cpfCnpj,
			email: customer.email,
			representadoPor: {
				nome: "",
				estadoCivil: "",
				profissao: "",
				rg: "",
				cpfCnpj: "",
			},
		},
		contratadaTexto: companyText,
		contratadaDados: {
			nome: "AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA",
			cpfCnpj: "27.901.968/0001-45",
			email: "NÃO INFORMADO",
		},
		clausulas: [
			firstContractSection,
			secondContractSection,
			thirdContractSection,
			fourthContractSection,
			fifthContractSection,
			sixthContractSection,
			seventhContractSection,
			eighthContractSection,
			ninthContractSection,
			tenthContractSection,
			eleventhContractSection,
		],
		dataTexto: `Ituiutaba/MG, ${dayjs().format("DD [de] MMMM [de] YYYY")}`,
		assinaturas: {
			contratada: {
				nome: "AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA",
				cpfCnpj: "27.901.968/0001-45",
				assinaturaUrl: "",
			},
			contratante: {
				nome: customer.name,
				cpfCnpj: customer.documents.cpfCnpj,
				assinaturaUrl: "",
			},
			testemunha1: {
				nome: "",
				cpfCnpj: "",
				assinaturaUrl: "",
			},
			testemunha2: {
				nome: "",
				cpfCnpj: "",
				assinaturaUrl: "",
			},
		},
	};
}

type TGetContractViaHtml = {
	content: string;
	date: string;
	personalization: {
		fontFamily?: string;
		marginTop?: number;
		marginBottom?: number;
		marginLeft?: number;
		marginRight?: number;
		spacingBetweenLines?: number;
		indentationOnFirstLine?: number;
	};
	signatures: {
		contractor: {
			name: string;
			identifier: string;
		};
		company: {
			name: string;
			identifier: string;
		};
		firstWitness: {
			name: string;
			identifier: string;
		};
		secondWitness: {
			name: string;
			identifier: string;
		};
	};
	returnType: "pdf" | "docx";
};

export async function getContractViaHtml({ content, date, personalization, signatures, returnType = "docx" }: TGetContractViaHtml) {
	try {
		const url = `${CONTRACT_GENERATION_API_BASE_URL}/${returnType === "docx" ? "docx-generate-contract-via-html" : "pdf-generate-contract-via-html"}`;

		const response = await axios.post(
			url,
			{
				content,
				date: date,
				personalization,
				signatures,
			},
			{
				headers: {
					"x-api-key": process.env.SECRET_INTERNAL_COMMUNICATION_API_TOKEN,
				},
				responseType: "arraybuffer", // <- ESSENCIAL!
			},
		);
		const disposition = response.headers["content-disposition"];
		let filename = `CONTRATO ${formatWithoutDiacritics(signatures.contractor.name)}.pdf`;
		if (disposition || disposition.includes("filename=")) {
			filename = disposition.split("filename=")[1].replace(/"/g, "");
		}
		return {
			buffer: response.data,
			filename,
		};
	} catch (error) {
		console.log("ERROR", error);
		throw new createHttpError.InternalServerError("Oops, algo deu errado ao gerar o contrato.");
	}
}
