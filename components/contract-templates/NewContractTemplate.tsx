import type { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/utils/methods/handlers";
import { createContractTemplate } from "@/utils/methods/mutation/contract-templates";
import { useContractTemplateVariables } from "@/utils/methods/query/contract-templates-variables";
import type { TMutationCallbacks } from "@/utils/methods/shared";
import { useContractTemplateState } from "@/utils/state/contract-template";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import TextInput from "../inputs/Text";
import TextareaInput from "../inputs/TextareaInput";
import { Button } from "../ui/button";
import ResponsiveDialogDrawer from "../utils/ResponsiveDialogDrawer";
import ContractTemplateEditor from "./blocks/TemplateEditor";
import ContractTemplatePreview from "./blocks/TemplatePreview";

type NewContractTemplateProps = {
	session: TAuthSession;
	closeMenu: () => void;
	callbacks?: TMutationCallbacks;
};

function NewContractTemplate({ session, closeMenu, callbacks }: NewContractTemplateProps) {
	const [mode, setMode] = useState<"editor" | "preview">("editor");
	const { state, updateTemplate, redefineState, resetState } = useContractTemplateState({
		initialState: {
			template: {
				titulo: "",
				descricao: "",
				conteudo: `<p><strong>CONTRATADA: <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df97" data-label="NOME DA EMPRESA">NOME DA EMPRESA</span></strong>, com nome fantasia de AMPÈRE ENERGIAS, inscrita no CNPJ/MF n.º <strong><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df98" data-label="CNPJ DA EMPRESA">CNPJ DA EMPRESA</span></strong>, com sede na <strong>Rua 28</strong>, <strong>n.º 1842</strong>, <strong>Centro</strong>, <strong>CEP 38300-082</strong>, município de <strong>Ituiutaba/MG</strong>, por seu representante legal, Diogo Paulino Carvalho, brasileiro, solteiro, empresário, titular do RG <strong>MG-14372057</strong> e do CPF/MF <strong>072.427.186-43</strong>, residente e domiciliada na <strong>Rua Vinte e Quatro</strong>, n.º <strong>75</strong>, <strong>Bairro Centro</strong>, <strong>CEP 38.300-078</strong>, <strong>Ituiutaba/MG</strong>, integrada à <strong>DAP CONSULTORIA INTEGRADA LTDA</strong>, nome fantasia <strong>IZAIRA SERVIÇOS</strong>, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob nº <strong>43.830.044/0001-51</strong>, com sede na <strong>Rua 28</strong>, <strong>n.º 1842</strong>, <strong>Centro</strong>, <strong>CEP 38300-082</strong>, município de <strong>Ituiutaba/MG</strong>.</p>

<p><strong>CONTRATANTE: <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df77" data-label="NOME DO CLIENTE">NOME DO CLIENTE</span></strong>, brasileiro (a), <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df7a" data-label="ESTADO CIVIL">ESTADO CIVIL</span>, titular do RG <strong><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df7c" data-label="RG">RG</span></strong>, inscrito(a) no CPF/MF n.º <strong><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df7b" data-label="CPF/CNPJ">CPF/CNPJ</span></strong>, com telefone <strong><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df78" data-label="TELEFONE DO CLIENTE">TELEFONE DO CLIENTE</span></strong>, com endereço em <strong><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df7d" data-label="ENDEREÇO">ENDEREÇO</span></strong>, <strong>Nº<span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df7e" data-label="NÚMERO DO ENDEREÇO">NÚMERO DO ENDEREÇO</span></strong>, <strong>BAIRRO <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df80" data-label="BAIRRO">BAIRRO</span></strong>, <strong>CEP <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df81" data-label="CEP">CEP</span></strong>, no município de <strong><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df82" data-label="CIDADE">CIDADE</span> <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df83" data-label="ESTADO">ESTADO</span></strong>, com endereço eletrônico <strong><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df79" data-label="EMAIL DO CLIENTE">EMAIL DO CLIENTE</span></strong>.</p>

<h2><strong>CLÁUSULA PRIMEIRA -- DO OBJETO E FORMA DE EXECUÇÃO</strong></h2>

<p>Constitui objeto deste contrato o fornecimento de projeto, mão-de-obra, materiais e instalação de sistema de geração de energia fotovoltaica com potência instalada de <strong><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df85" data-label="POTÊNCIA TOTAL">POTÊNCIA TOTAL</span>kWp</strong>.</p>

<p>1.1.1.1. O objeto contratado será executado nas seguintes especificações: haverá interligação com rede de baixa tensão da concessionária de energia elétrica local instalada na</p>

<p><strong><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df86" data-label="ENDEREÇO DE INSTALAÇÃO">ENDEREÇO DE INSTALAÇÃO</span>,Nº<span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df87" data-label="NÚMERO (INSTALAÇÃO)">NÚMERO (INSTALAÇÃO)</span>, BAIRRO <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df88" data-label="BAIRRO (INSTALAÇÃO)">BAIRRO (INSTALAÇÃO)</span>,CEP <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df89" data-label="CEP (INSTALAÇÃO)">CEP (INSTALAÇÃO)</span></strong>, no Município de <strong><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df8a" data-label="CIDADE (INSTALAÇÃO)">CIDADE (INSTALAÇÃO)</span>/<span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df8b" data-label="ESTADO (INSTALAÇÃO)">ESTADO (INSTALAÇÃO)</span>.</strong></p>

<p>1.2. O sistema contratado é composto por:</p>

<p>A) Fornecimento dos materiais necessários para a instalação do sistema, e seu perfeito e cabal funcionamento, a saber:</p>

<p><strong>A.1. Módulos fotovoltaicos</strong></p>

<p>Serão fornecidos:</p>

<p><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df8c" data-label="LISTA DE MÓDULOS">LISTA DE MÓDULOS</span>.</p>

<p><strong>A.2. Inversores de frequência</strong></p>

<p>Serão fornecidos:</p>

<p><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df8d" data-label="LISTA DE INVERSORES">LISTA DE INVERSORES</span>.</p>

<p><strong>A.3. Sistemas de proteção</strong></p>

<p>A.3.1. Quadro de proteção para os circuitos de corrente contínua, contendo:</p>

<p>A.3.2. DPS (Dispositivo de Proteção Contra Surtos) adequados para operação em corrente alternada;</p>

<p>A.3.2.1. Fusíveis adequados para operação em corrente contínua;</p>

<p>A.3.2.2. Disjuntor termomagnético.</p>

<p>Parágrafo único -- os modelos estipulados no item A.1 e A.2, em caso de indisponibilidade com o fornecedor habitual, poderão ser substituídos por marcas diversas, mantendo-se, contudo, qualificações técnicas que sejam equivalentes a mesma qualidade com equivalência de preço, podendo variar para mais ou para menos.</p>

<p><strong>A.4. Cabos e Conexões</strong></p>

<p>A.4.1. Serão utilizados cabos de cobre com isolação adequada para o sistema fotovoltaico e nos pontos sobre o telhado e expostos ao sol com proteção contra raios UV;</p>

<p><strong>A.5. Sistema de fixação dos módulos nos telhados</strong></p>

<p>A.5.1. Os suportes para fixação dos módulos são confeccionados em perfis metálicos, conforme demanda específica do <strong>CONTRATANTE</strong> indicada no projeto e em termo de visita técnica <em>in loco.</em></p>

<p>B) O projeto elétrico do sistema fotovoltaico será elaborado e executado conforme <strong>as normas da concessionária de energia elétrica local</strong> e a Resolução Normativa ANEEL N° 1000 (REN 1000) que estabelece as condições de acesso e define critérios técnicos e operacionais, requisitos de projeto, informações, dados e a implementação da conexão para Acessantes novos e já existentes;</p>

<p>C) <strong>A CONTRATANTE</strong> fornecerá todos os documentos necessários a fim de que a <strong>CONTRATADA</strong> possa acompanhar solicitação em nome daquela perante a concessionária de energia elétrica, para liberar início de operação do sistema de geração fotovoltaica por parte da <strong>CONTRATADA;</strong></p>

<p>D) Todos os quadros e inversores receberão adesivos com a marca da <strong>CONTRATADA</strong> e informações da empresa para facilitar a identificação e o contato, sempre que necessário, com a prestadora dos serviços respectivos (<strong>A CONTRATADA</strong>). Todo o material remanescente, não empregado na execução do objeto, será devolvido para a CONTRATADA.</p>

<h2><strong>CLÁUSULA SEGUNDA -- DOS PRAZOS</strong></h2>

<p>O prazo para a CONTRATADA <strong>elaborar</strong> o projeto é de <strong>30 (trinta) dias</strong>, findo o qual referido documento será submetido à análise da concessionária de energia local.</p>

<p>1. Somente após aprovação de projeto pela concessionária de energia local, cujo prazo é impróprio, é que será iniciada a prestação de serviços de instalação, o qual acontecerá em até 60 (sessenta) dias, uma vez que presente todo o equipamento necessário.</p>

<p>2. Poderão atrasar a prestação de serviços fatos relativos a intempéries, chuvas, inundações e calamidades na proporção dos dias em que a equipe foi impedida de trabalhar, ainda que parcialmente;</p>

<p>3. Na eventualidade de não cumprimento dos prazos por parte dos fornecedores, ou, ainda, comprometimento no desembaraço dos equipamentos junto a estação aduaneira, portos, dentro ou fora do território nacional, também justifica a dilação de prazo para a entrega do sistema, na proporção dos dias em que a equipe foi impedida de trabalhar ainda que parcialmente;</p>

<p>4. Na eventualidade do <strong>CONTRATANTE</strong> demorar em disponibilizar o imóvel para a instalação dos equipamentos, pendente de obras e adequações necessárias (termo de visita técnica <em>in loco)</em>, por igual, justifica-se o não cumprimento de prazo para a entrega do sistema, na proporção dos dias em que as obras se deem;</p>

<h2><strong>CLÁUSULA TERCEIRA -- DO PREÇO E FORMAS DE PAGAMENTO</strong></h2>

<p>A CONTRATANTE pagará a CONTRATADA o valor total de <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df90" data-label="VALOR TOTAL">VALOR TOTAL</span> (<span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df91" data-label="VALOR POR EXTENSO">VALOR POR EXTENSO</span>), o qual será pago da seguinte forma:</p>

<p>1. <strong>A CONTRATANTE realizará o pagamento <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df93" data-label="FORMA DE NEGOCIAÇÃO">FORMA DE NEGOCIAÇÃO</span> do valor total do contrato via <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df92" data-label="ORIGEM DO RECURSO">ORIGEM DO RECURSO</span>.</strong></p>

<p>1.1 Será pago em parcela única 100% do valor do contrato após a CONTRATADA apresentar projeto a concessionaria de energia elétrica local e obter desta a aprovação do documento.</p>

<p>Pagamento deverá ser a vista, via pix, boleto ou transferência. Após o pagamento o CONTRATANTE deverá enviar comprovante para a CONTRATADA.</p>

<p>2. O preço acima ajustado compreende além da remuneração da mão-de-obra, o fornecimento pela <strong>CONTRATADA</strong>, dos materiais, equipamentos e ferramentas necessárias à perfeita execução dos serviços de instalação do sistema fotovoltaico, incluídos também no valor supracitado, todos os custos e remunerações diretas e indiretas, impostos, contribuições trabalhistas, previdenciárias e sociais, de qualquer natureza, obrigações fiscais e seguros, inclusive encargos sociais. Compreende, por fim, os objetos necessários para instalação, sem ônus para o <strong>CONTRATANTE,</strong> com exceção das disposições inseridas no item seguinte,</p>

<p><strong>3. O VALOR CONTRATADO NÃO ABRANGE</strong>:</p>

<p>- A adequação/readequação de telhados, madeiramentos, ferragens de sustentação do telhado, vigas, calhas, rufos, instalação ou troca de materiais de rede elétrica existente;</p>

<p><span data-type="variable" class="variable-tag" data-id="68dec6c5e3a025351eb1df9c" data-label="ISENÇÃO DA ADEQUAÇÃO DE PADRÃO">ISENÇÃO DA ADEQUAÇÃO DE PADRÃO</span></p>

<p><span data-type="variable" class="variable-tag" data-id="68dec748e3a025351eb1df9d" data-label="ISENÇÃO DA ADEQUAÇÃO DE ESTRUTURA">ISENÇÃO DA ADEQUAÇÃO DE ESTRUTURA</span></p>

<p>- A execução e custeio de quaisquer obras diversas da natureza dos serviços prestados pela <strong>CONTRATADA</strong>;</p>

<p>Cabe ao <strong>CONTRATANTE</strong> a execução e custeio de quaisquer obras diversas da natureza dos serviços prestados pela <strong>CONTRATADA</strong>, caso verificada a necessidade pela concessionária de energia ou equipe técnica destinada a instalação do sistema fotovoltaico, especificada em termo de visita técnica e, ainda, aquelas que, porventura, durante a execução do objeto, forem necessárias.</p>

<p>4. Para todos os efeitos legais e jurídicos, utilizar-se a o valor total constante no "caput" desta cláusula;</p>

<h2><strong>CLÁUSULA QUARTA -- REAJUSTE</strong></h2>

<p>O preço total deste contrato <strong>poderá ser reajustado</strong> caso o CONTRATANTE, devidamente notificado para realizar o pagamento de entrada (por boleto, transferência ou PIX), atrase sua efetivação.</p>

<p><strong>Parágrafo primeiro</strong> -- Poderá, ainda, haver repactuação contratual em caso de total imprevisão que sobreleve desproporcionalmente o custo da prestação de serviços de modo que, comparada às condições iniciais do contrato, tornem a execução deste extremamente onerosa à <strong>CONTRATADA.</strong></p>

<p><strong>Parágrafo segundo --</strong> Considerando prazo impróprio para emissão de parecer da concessionária de energia elétrica local, a CONTRATADA congelará preço do contrato em até 30 (trinta) dias a contar da data de assinatura deste em relação ao kit fotovoltaico. Após esse prazo, o contrato poderá sofrer alterações com relação aos preços dos equipamentos de acordo com mercado. EM CASO DE RESCISÃO do contrato por parte da CONTRATANTE, esta deverá realizar pagamento de 6% (seis por cento) no valor total do contrato.</p>

<h2><strong>CLÁUSULA QUINTA -- DAS OBRIGAÇÕES DA CONTRATADA</strong></h2>

<p>Constituem obrigações da CONTRATADA:</p>

<p>1. Cumprir rigorosamente todas as normas técnicas que se referem à Segurança e Medicina do Trabalho, correndo por conta da <strong>CONTRATADA</strong> o fornecimento de luvas, capacetes, calçados adequados e demais equipamentos de segurança a seus funcionários;</p>

<p>2. Cuidar pelo perfeito cumprimento das disposições contidas neste instrumento, especialmente no que tange ao controle de qualidade dos serviços e/ou produtos adquiridos e processos utilizados na sua aplicação;</p>

<p><strong>Parágrafo primeiro</strong> -- Será de responsabilidade exclusiva da <strong>CONTRATADA</strong> os encargos e direitos trabalhistas e/ou previdenciários relacionados a eventuais contratos firmados e funcionários para execução do objeto contratado;</p>

<h2><strong>CLÁUSULA SEXTA -- DAS OBRIGAÇÕES DO CONTRATANTE</strong></h2>

<p>Constituem obrigações da CONTRATANTE:</p>

<p>1. Permitir acesso livre às dependências dos imóveis que se darão as obras;</p>

<p>2. Efetuar os pagamentos conforme cláusula segunda;</p>

<p>3. Fornecer as informações necessárias para elaboração do projeto de geração fotovoltaica;</p>

<p>4. Indicar e liberar local adequado para instalação dos inversores e quadros de proteção;</p>

<p>5. Realizar as obras internas no que diz respeito às suas instalações físicas e/ou elétricas quando for constatado pela equipe técnica que tais obras sejam necessárias para a correta instalação e funcionamento do sistema gerador, ou quando exigidas pela concessionária de energia elétrica local, de acordo com exigência em parecer desta, declarando-se ciente que o prazo para execução somente poderá iniciar a partir da conclusão das obras e liberação definitiva por parte da concessionária de energia;</p>

<p>6. Estar em completa <strong>regularidade fiscal</strong> perante a concessionário de energia, livre e desembaraçada de qualquer débito que impeça prosseguir com o objeto contratual, sabendo que o contrário poderá gerar atrasos na execução;</p>

<p>7. É da <strong>CONTRATANTE a exclusiva responsabilidade</strong> por qualquer evento danoso que venha a ocorrer no telhado ou nas estruturas dos imóveis após a execução dos serviços contratados, vez que a instalação é realizada em estrutura ou imóvel já existente, como residências, barracões ou quaisquer tipos de estrutura não projetada e executada, salvo nos casos de efetiva comprovação de negligência, imperícia ou imprudência da <strong>CONTRATADA</strong>;</p>

<p>8. Ainda, é de inteira responsabilidade da <strong>CONTRATANTE</strong> a garantia de informações prestadas à <strong>CONTRATADA</strong> quanto à estruturação do imóvel que receberá a instalação do sistema fotovoltaico, cujo peso é de aproximadamente <strong>20</strong> <strong>(vinte) quilos</strong> por metro quadrado, distribuído e multiplicado por toda a área ocupada, isentando a <strong>CONTRATADA</strong> de eventuais danos futuros à estrutura do imóvel, seja física ou elétrica.</p>

<p>9. Considerando que a CONTRATADA não é fornecedora de equipamentos apenas trabalha como intermediadora na compra dos mesmos, caso qualquer uma das partes venha a desistir deste contrato, ou em caso de parecer da concessionaria seja negado, o equipamento é de propriedade e responsabilidade do CONTRATANTE.</p>

<p>10. Todo o material para o projeto citado na clausula primeira, é faturado do distribuidor direto para o CONTRATANTE, e será enviado para o endereço de instalação, sendo de inteira responsabilidade do CONTRATANTE armazenar e zelar afim de evitar danos ou roubo.</p>

<p><strong>Parágrafo único --</strong> Caso <strong>o CONTRATANTE</strong> deseje monitorar remotamente seu sistema fotovoltaico, é de obrigação deste deixar um ponto de internet de conexão Wi- fi de até 5 metros de distância do local de instalação dos equipamentos com a conexão em funcionamento quando da execução do serviço, caso no momento da instalação for constatado pela CONTRATADA que o modem seja incompatível com os comunicadores do sistema solar, será de responsabilidade do CONTRATANTE realizar as adequações para que a CONTRATADA reconfigure o sistema. <strong>Todavia, caso o cliente altere a senha, <em>modem</em> ou roteador</strong> e isso implique em perda de conexão, fazendo com que a CONTRATADA retorne após a instalação, a fim de restabelecer a comunicação do monitoramento do sistema fotovoltaico, <strong>será cobrado taxa extra, a qual será estabelecida levando em consideração o endereço da instalação e tempo para o serviço.</strong></p>

<p>11. Responder perante a concessionária CEMIG por eventuais medidas que esta atribuir à usina e seu titular.</p>

<h2><strong>CLÁUSULA SÉTIMA -- DAS GARANTIAS DOS SERVIÇOS, MATERIAIS E EQUIPAMENTOS</strong></h2>

<p>1. <strong>Micro Inversores de frequência:</strong> <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df8f" data-label="GARANTIA DOS INVERSORES">GARANTIA DOS INVERSORES</span> anos contra defeitos de fabricação a partir da data da instalação;</p>

<p>2. <strong>Módulos solares:</strong> <span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df8e" data-label="GARANTIA DOS MÓDULOS">GARANTIA DOS MÓDULOS</span> anos contra defeitos de fabricação e de 30 (TRINTA) anos de garantia de geração com no mínimo 80% (oitenta por cento) da sua eficiência, contados a partir da data da instalação (considerar a perda de eficiência de 0,8% a.a.);</p>

<p>3. Em caso de o CONTRATANTE não optar pelo serviço de acompanhamento e manutenção do sistema pela CONTRATADA a CONTRATADA não assumirá nenhuma responsabilidade quanto a acompanhamento de performance ou qualquer prejuízo que venha a ocorrer devido esse fato.</p>

<p>4. A <strong>CONTRATADA</strong> oferece 12 (doze) meses de garantia dos serviços de instalação, o qual não se estende às peças e equipamentos, observado o item 7.7.</p>

<p>5. A garantia da prestação de serviços do sistema fotovoltaico apenas terá validade se o cliente realizar manutenção preventiva nos equipamentos com a CONTRATADA ou empresa autorizada por esta documentalmente.</p>

<p>6. Caso outra empresa ou profissional realize qualquer tipo de manutenção preventiva, corretiva ou preditiva ou faça alguma alteração no projeto e/ou instalação o <strong>CONTRATANTE perderá a garantia dos serviços</strong> e equipamentos diretamente com a <strong>CONTRATADA</strong>, ficando apenas com a garantia diretamente com o fabricante ou distribuidor dos equipamentos.</p>

<p>7. As garantias prestadas nas cláusulas 7.1 e 7.2 referem àquelas prestadas pelo fabricante.</p>

<p><strong>7.8 DA DISPONIBILIDADE ELÉTRICA APROVADA PELA CONCESSIONÁRIA:</strong> O <strong>CONTRATANTE</strong> declara CIÊNCIA ACERCA DAS CONDIÇÕES APRESENTADAS EM PARECER DA <strong>CEMIG</strong> e demais alternativas. De forma independente deste parecer, opta o CONTRATANTE pela aquisição integral dos equipamentos descritos na cláusula primeira, item A, estando ainda ciente das medidas tomadas pela concessionária mencionadas nas cláusulas 6, 7 e 8 do parecer de acesso, pelas quais é responsável.</p>

<h2><strong>CLÁUSULA OITAVA -- DA RESCISÃO E MULTAS</strong></h2>

<p>O presente contrato se extinguirá definitivamente após entrega do objeto contratado, permanecendo, contudo, obrigações da <strong>CONTRATADA</strong> quanto às garantias, desde que de acordo com as cláusulas constante na cláusula sexta, e quanto ao acompanhamento de performance, caso este seja manifestado e autorizado pelo <strong>CONTRATANTE</strong> documentalmente.</p>

<p>1. A parte <strong>CONTRATANTE</strong> poderá exercer desistência do contrato no prazo de até 10 (dez) dias após assinatura deste, estando ciente que, neste caso, incidirá multa de 6% sobre o valor total do mesmo.</p>

<p>2. O CONTRATANTE responderá por perdas e danos à parte CONTRATADA no caso de desistência após prazo citado na cláusula primeira, incidindo multa no valor constante na mesma.</p>

<p>1. Em caso de morte da parte CONTRATANTE, a CONTRATADA cessará a prestação de serviço, exceto nos casos de:</p>

<p>2. prever situações de acordo com cada fase.</p>

<p>3. O contrato poderá ser resilido unilateralmente pela <strong>CONTRATADA,</strong> em caso de franco descumprimento de obrigações da parte <strong>CONTRATANTE.</strong></p>

<p>4. Caso a <strong>CONTRATADA</strong> venha sem motivo aparente decidir pela rescisão deste contrato deverá ser aplicada a multa de 6% do valor total do contrato.</p>

<p><strong>Parágrafo único --</strong> Caso o parecer da concessionária de energia elétrica local condicionar o acesso à realização de obras na rede de distribuição de energia elétrica, e tais obras forem por conta do <strong>CONTRATANTE,</strong> e este desistir de realizar tais obras, inviabilizando a continuidade do contrato, poderá rescindi-lo mediante pagamento de multa de 6% (seis por cento) sobre o valor total do contrato a título de indenização em favor da <strong>CONTRATADA</strong> pelos custos com a execução de todo o projeto até aquele momento;</p>

<h2><strong>CLAÚSULA NONA -- PROTEÇÃO DE DADOS</strong></h2>

<p>1. A CONTRATADA manterá todas as informações da CONTRATANTE salvas em servidor físico e/ou servidores remotos, guardando o mais completo e absoluto sigilo sobre as informações e dados da CONTRATANTE a que tiver acesso em razão da presente prestação de serviços, utilizando-as apenas quando estritamente necessário para a prestação dos serviços acordados em contrato, em conformidade com a Lei Geral da Proteção dos Dados - LGPD (Lei 13.709 -- 14/08/2018), dentre os casos que seguem:</p>

<p>a) Mediante o fornecimento de consentimento pelo titular, para fins de aprovação de financiamento por instituição bancária devidamente credenciada, assim como em caso de aquisição de equipamentos com fornecedores, a fim de permitir a regular consecução dos serviços delineados no presente contrato;</p>

<p>b) Para o cumprimento de obrigação legal ou regulatória;</p>

<p>c) Para atender ordem judicial;</p>

<p>d) Pela administração pública, para o tratamento e uso compartilhado de dados necessários à execução de políticas públicas previstas em leis e regulamentos ou respaldadas em contratos, convênios ou instrumentos congêneres;</p>

<p>e) Para a realização de estudos por órgão de pesquisa, garantida, sempre que possível, a anonimização dos dados pessoais;</p>

<p>f) Para a proteção da vida ou da incolumidade física do titular ou de terceiros;</p>

<p>g) Para a tutela da saúde, exclusivamente, em procedimento realizado por profissionais de saúde, serviços de saúde ou autoridade sanitária;</p>

<p>h) Para a proteção do crédito, quando disposto na legislação pertinente (inclusive o disposto na Lei 9.613/98 e Resolução 1445/13 do CFC);</p>

<p>i) Para fins de cadastro em aplicativos das concessionárias de energia, quando necessário a realização de processos administrativos para concessão de autorização para implementação do plano de produção de energia elétrica fotovoltaica;</p>

<p>j) - Transferência a terceiro, respeitados os requisitos de tratamento de dados dispostos na LGPD.</p>

<p>1. - A CONTRATANTE tem direito ao acesso às informações sobre o tratamento de seus dados, que serão disponibilizadas de forma clara, adequada e ostensiva, mediante solicitação.</p>

<p>2. -- A CONTRATADA não será responsável perante a CONTRATANTE quando proceder com o desenvolvimento em cumprimento às premissas da LGPD e após à entrega, seja constatado que uma prática de mercado amplamente adotada teria violado a LGPD, a partir de entendimentos judiciais ou administrativos até o presente momento inexistentes.</p>

<p>3. - A CONTRATADA se comprometa a atender as autoridades fiscais, inclusive quando das eventuais verificações nas dependências da CONTRATANTE, todavia, não será responsabilidade da CONTRATADA responder por eventuais contingências e/ou multas aplicadas sobre fatos ou atos praticados pela CONTRATANTE, ou apresentar obrigatoriamente, soluções com defesa sobre autuações.</p>

<p>4. -- O CONTRANTE neste ato declara ciência de que a CONTRATADA não poderá ser responsabilizada por eventual tratamento inadequado dos dados do CONTRATANTE por parte das instituições financeiras ou fornecedores de equipamentos, uma vez que necessário para o regular cumprimento do contrato e a consecução dos serviços os quais dispõem-se a realizar.</p>

<h2><strong>CLÁUSULA DÉCIMA-- DAS DISPOSIÇÕES GERAIS</strong></h2>

<p><strong>10.1</strong>. Tendo em vista que o objeto do presente contrato utiliza fonte natural de energia -- sol -- está ciente a parte CONTRATANTE que a produção de energia elétrica condiciona-se à disponibilidade e incidência solar sobre as placas fotovoltaicas.</p>

<p>2. Este contrato de prestação de serviços não garante que o <strong>CONTRATANTE</strong> deixará de pagar ou reduza suas contas de energia para o custo mínimo de disponibilidade perante a concessionária de energia elétrica local, uma vez que isso dependerá exclusivamente do quanto de energia o <strong>CONTRATANTE</strong> consumir nos locais em que o sistema fotovoltaico for instalado.</p>

<p>3. Em caso de necessidade de cobrança administrativa ou judicial, o <strong>CONTRATANTE</strong> ficará obrigado ao pagamento de honorários advocatícios em 10% (dez por cento) sobre o valor do contrato.</p>

<p>4. Nenhuma das partes será responsável pelo descumprimento das obrigações contraídas neste contrato quando este for ocasionado em consequência de força maior ou caso fortuito, conforme disposto no art. 393 do Código Civil Brasileiro</p>

<h2><strong>CLÁUSULA DÉCIMA PRIMEIRA -- DA ELEIÇÃO DE FORO</strong></h2>

<p>As partes elegem o foro da Comarca de Ituiutaba/MG, com exclusão de qualquer outro, por mais privilegiado que o seja, para dirimir quaisquer conflitos eventualmente originados a partir deste Contrato.</p>

<p>Assim, por estarem livremente ajustados com as disposições contidas neste instrumento, o qual segue com 12 (doze) páginas assinam-no em 02 (duas) vias de igual forma e teor, para um só efeito legal na presença de 02 (duas) testemunhas, que também assinam, para produção de efeitos legais.</p>

<p><span data-type="variable" class="variable-tag" data-id="68debe9ee3a025351eb1df9a" data-label="DATA DO CONTRATO">DATA DO CONTRATO</span></p>
`,
			},
		},
	});
	const { data: contractVariables } = useContractTemplateVariables();
	const { mutate: handleCreateContractTemplate, isPending } = useMutation({
		mutationKey: ["create-contract-template"],
		mutationFn: createContractTemplate,
		onMutate: async () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: async (data) => {
			if (callbacks?.onSuccess) callbacks.onSuccess();
			resetState();
			return toast.success(data.message);
		},
		onSettled: async () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			if (callbacks?.onError) callbacks.onError();
			return toast.error(getErrorMessage(error));
		},
	});
	console.log("[DEBUG] Contract Template State", state);
	return (
		<ResponsiveDialogDrawer
			menuTitle="NOVO TEMPLATE DE CONTRATO"
			menuDescription="Preencha os campos abaixo para criar um novo template de contrato."
			menuActionButtonText="CRIAR TEMPLATE DE CONTRATO"
			menuCancelButtonText="CANCELAR"
			actionFunction={() => {
				return handleCreateContractTemplate({
					template: state.template,
				});
			}}
			actionIsPending={isPending}
			stateIsLoading={false}
			closeMenu={closeMenu}
			dialogVariant="lg"
		>
			<TextInput
				label="TÍTULO"
				value={state.template.titulo}
				placeholder="Preencha o título do template de contrato"
				handleChange={(value) => updateTemplate({ titulo: value })}
				width="100%"
			/>
			<TextareaInput
				label="DESCRIÇÃO"
				value={state.template.descricao}
				placeholder="Preencha a descrição do template de contrato"
				handleChange={(value) => updateTemplate({ descricao: value })}
			/>
			<div className="w-full flex items-center justify-center gap-2">
				<Button variant={mode === "editor" ? "default" : "ghost"} size="sm" onClick={() => setMode("editor")}>
					EDITOR
				</Button>
				<Button variant={mode === "preview" ? "default" : "ghost"} size="sm" onClick={() => setMode("preview")}>
					PREVIEW
				</Button>
			</div>
			{mode === "editor" && (
				<ContractTemplateEditor
					content={state.template.conteudo}
					contentChangeCallback={(value) => updateTemplate({ conteudo: value })}
					contractVariables={contractVariables ?? []}
				/>
			)}
			{mode === "preview" && <ContractTemplatePreview templateContent={state.template.conteudo} />}
		</ResponsiveDialogDrawer>
	);
}

export default NewContractTemplate;
