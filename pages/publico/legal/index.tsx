import Image from "next/image";
import React from "react";
import Logo from "../../../utils/images/logo-sem-texto.png";

export default function LegalPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex items-center gap-4">
						<Image src={Logo} alt="Logo Ampere" width={50} height={50} />
						<h1 className="text-3xl font-bold text-gray-900">Termos de Uso e Política de Privacidade</h1>
					</div>
				</div>
			</header>

			{/* Content */}
			<main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="bg-white shadow-md rounded-lg p-8 space-y-8">
					{/* Última Atualização */}
					<div className="text-sm text-gray-600 border-b pb-4">
						<p>
							<strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
						</p>
					</div>

					{/* Introdução */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
						<p className="text-gray-700 leading-relaxed">
							Este documento estabelece os Termos de Uso e a Política de Privacidade do sistema de gestão de projetos fotovoltaicos da Ampere, uma plataforma
							de uso interno destinada à gestão e acompanhamento de projetos de energia solar. Ao acessar ou utilizar este sistema, você concorda com os
							termos aqui estabelecidos.
						</p>
					</section>

					{/* Termos de Uso */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 border-t pt-6">2. Termos de Uso</h2>

						<div className="space-y-4">
							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">2.1. Uso do Sistema</h3>
								<p className="text-gray-700 leading-relaxed">
									Este sistema é de uso exclusivo dos colaboradores e parceiros autorizados da Ampere. O acesso é concedido mediante credenciais individuais e
									intransferíveis. O usuário compromete-se a manter sigilo de suas credenciais de acesso e a não compartilhá-las com terceiros.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">2.2. Responsabilidades do Usuário</h3>
								<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
									<li>Utilizar o sistema exclusivamente para fins profissionais relacionados às atividades da empresa;</li>
									<li>Manter a confidencialidade das informações de clientes e projetos;</li>
									<li>Não utilizar o sistema para atividades ilícitas ou não autorizadas;</li>
									<li>Notificar imediatamente a administração sobre qualquer uso não autorizado de sua conta;</li>
									<li>Garantir a precisão e veracidade das informações inseridas no sistema.</li>
								</ul>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">2.3. Propriedade Intelectual</h3>
								<p className="text-gray-700 leading-relaxed">
									Todos os direitos de propriedade intelectual relacionados ao sistema, incluindo mas não se limitando a código-fonte, design, funcionalidades
									e conteúdo, pertencem exclusivamente à Ampere. É proibida a cópia, reprodução ou distribuição do sistema.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">2.4. Suspensão e Cancelamento</h3>
								<p className="text-gray-700 leading-relaxed">
									A Ampere reserva-se o direito de suspender ou cancelar o acesso de qualquer usuário que viole estes termos, sem aviso prévio. O acesso será
									automaticamente revogado em caso de desligamento do colaborador.
								</p>
							</div>
						</div>
					</section>

					{/* Política de Privacidade */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 border-t pt-6">3. Política de Privacidade</h2>

						<div className="space-y-4">
							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">3.1. Dados Coletados</h3>
								<p className="text-gray-700 leading-relaxed mb-2">O sistema coleta e processa os seguintes tipos de dados:</p>
								<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
									<li>
										<strong>Dados de Usuários:</strong> Nome, e-mail, telefone, cargo, departamento e credenciais de acesso;
									</li>
									<li>
										<strong>Dados de Clientes:</strong> Nome, CPF/CNPJ, endereço, telefone, e-mail e informações de consumo energético;
									</li>
									<li>
										<strong>Dados de Projetos:</strong> Especificações técnicas, propostas comerciais, contratos, documentos de homologação;
									</li>
									<li>
										<strong>Dados de Uso:</strong> Logs de acesso, ações realizadas, timestamps e endereços IP;
									</li>
									<li>
										<strong>Dados Financeiros:</strong> Informações de faturamento, comissionamento e pagamentos relacionados aos projetos.
									</li>
								</ul>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">3.2. Finalidade do Tratamento de Dados</h3>
								<p className="text-gray-700 leading-relaxed mb-2">Os dados são coletados e tratados para as seguintes finalidades:</p>
								<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
									<li>Gestão e acompanhamento de projetos fotovoltaicos;</li>
									<li>Comunicação com clientes e fornecedores;</li>
									<li>Elaboração de propostas comerciais e contratos;</li>
									<li>Controle financeiro e comissionamento;</li>
									<li>Cumprimento de obrigações legais e regulatórias;</li>
									<li>Melhoria contínua dos processos internos;</li>
									<li>Auditoria e segurança da informação.</li>
								</ul>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">3.3. Base Legal (LGPD)</h3>
								<p className="text-gray-700 leading-relaxed">
									O tratamento de dados pessoais realizado através deste sistema está fundamentado nas seguintes bases legais previstas na Lei Geral de
									Proteção de Dados (Lei nº 13.709/2018):
								</p>
								<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
									<li>
										<strong>Execução de contrato:</strong> Para cumprimento de contratos de prestação de serviços;
									</li>
									<li>
										<strong>Legítimo interesse:</strong> Para gestão interna de projetos e atividades comerciais;
									</li>
									<li>
										<strong>Obrigação legal:</strong> Para cumprimento de obrigações fiscais, trabalhistas e regulatórias;
									</li>
									<li>
										<strong>Consentimento:</strong> Quando aplicável, mediante autorização expressa do titular dos dados.
									</li>
								</ul>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">3.4. Compartilhamento de Dados</h3>
								<p className="text-gray-700 leading-relaxed">Os dados pessoais podem ser compartilhados com:</p>
								<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
									<li>Fornecedores e parceiros comerciais necessários para execução dos projetos;</li>
									<li>Concessionárias de energia para fins de homologação;</li>
									<li>Órgãos reguladores e autoridades governamentais, quando legalmente exigido;</li>
									<li>Prestadores de serviços de TI e armazenamento em nuvem, sob acordos de confidencialidade;</li>
									<li>Instituições financeiras para processamento de pagamentos e financiamentos.</li>
								</ul>
								<p className="text-gray-700 leading-relaxed mt-2">
									<strong>Importante:</strong> Nenhum dado é compartilhado para fins publicitários ou vendido a terceiros.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">3.5. Segurança da Informação</h3>
								<p className="text-gray-700 leading-relaxed">
									Implementamos medidas técnicas e organizacionais de segurança para proteger os dados contra acessos não autorizados, perda, destruição ou
									alteração, incluindo:
								</p>
								<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
									<li>Criptografia de dados em trânsito (SSL/TLS);</li>
									<li>Controle de acesso baseado em perfis e permissões;</li>
									<li>Autenticação de usuários;</li>
									<li>Monitoramento e logs de atividades;</li>
									<li>Backups regulares e planos de recuperação de desastres;</li>
									<li>Treinamento de colaboradores em proteção de dados.</li>
								</ul>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">3.6. Retenção de Dados</h3>
								<p className="text-gray-700 leading-relaxed">
									Os dados pessoais são mantidos pelo período necessário para cumprimento das finalidades para as quais foram coletados, respeitando os prazos
									legais de retenção:
								</p>
								<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
									<li>Dados de projetos: Durante a vigência do contrato e por até 5 anos após conclusão;</li>
									<li>Dados fiscais e contábeis: Conforme legislação tributária vigente (5 anos);</li>
									<li>Dados de colaboradores: Durante o vínculo empregatício e conforme legislação trabalhista;</li>
									<li>Logs de acesso: Por até 12 meses para fins de segurança e auditoria.</li>
								</ul>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">3.7. Direitos dos Titulares</h3>
								<p className="text-gray-700 leading-relaxed mb-2">De acordo com a LGPD, os titulares de dados pessoais têm direito a:</p>
								<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
									<li>Confirmação da existência de tratamento de dados;</li>
									<li>Acesso aos dados pessoais;</li>
									<li>Correção de dados incompletos, inexatos ou desatualizados;</li>
									<li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
									<li>Portabilidade dos dados a outro fornecedor;</li>
									<li>Informação sobre compartilhamento de dados;</li>
									<li>Revogação do consentimento, quando aplicável.</li>
								</ul>
								<p className="text-gray-700 leading-relaxed mt-2">
									Para exercer seus direitos, entre em contato através do e-mail: <strong>processos@ampereenergias.com.br</strong>
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">3.8. Cookies e Tecnologias Similares</h3>
								<p className="text-gray-700 leading-relaxed">
									O sistema utiliza cookies essenciais para autenticação e funcionamento adequado da plataforma. Não utilizamos cookies de rastreamento ou
									publicidade. Os cookies de sessão são automaticamente excluídos ao encerrar o navegador.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">3.9. Transferência Internacional de Dados</h3>
								<p className="text-gray-700 leading-relaxed">
									Alguns dados podem ser armazenados em servidores localizados fora do Brasil, em provedores de cloud computing que atendem padrões
									internacionais de segurança e proteção de dados. Todas as transferências são realizadas com garantias adequadas de proteção conforme LGPD.
								</p>
							</div>
						</div>
					</section>

					{/* Integração WhatsApp */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 border-t pt-6">4. Integração com WhatsApp Business API</h2>
						<div className="space-y-4">
							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">4.1. Finalidade</h3>
								<p className="text-gray-700 leading-relaxed">
									O sistema integra-se com a WhatsApp Business API para envio de notificações, atualizações de projetos e comunicação com clientes relacionada
									ao andamento de suas instalações fotovoltaicas.
								</p>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">4.2. Dados Processados</h3>
								<p className="text-gray-700 leading-relaxed">Através da integração WhatsApp, processamos:</p>
								<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
									<li>Números de telefone de clientes e colaboradores;</li>
									<li>Mensagens relacionadas a projetos e atendimentos;</li>
									<li>Status de entrega e leitura de mensagens;</li>
									<li>Metadados de comunicação (horários, status).</li>
								</ul>
							</div>

							<div>
								<h3 className="text-xl font-semibold text-gray-800 mb-2">4.3. Conformidade com Meta</h3>
								<p className="text-gray-700 leading-relaxed">
									A utilização da WhatsApp Business API está em conformidade com os termos de serviço da Meta e regulamentações de proteção de dados. As
									comunicações são restritas a:
								</p>
								<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
									<li>Notificações transacionais sobre projetos em andamento;</li>
									<li>Atualizações de status e agendamentos;</li>
									<li>Atendimento ao cliente e suporte técnico;</li>
									<li>Confirmações e lembretes de compromissos.</li>
								</ul>
							</div>
						</div>
					</section>

					{/* Alterações */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 border-t pt-6">5. Alterações nos Termos</h2>
						<p className="text-gray-700 leading-relaxed">
							A Ampere reserva-se o direito de modificar estes Termos de Uso e Política de Privacidade a qualquer momento. As alterações entrarão em vigor
							imediatamente após sua publicação no sistema. Os usuários serão notificados sobre mudanças substanciais e recomenda-se a revisão periódica
							deste documento.
						</p>
					</section>

					{/* Legislação Aplicável */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 border-t pt-6">6. Legislação Aplicável</h2>
						<p className="text-gray-700 leading-relaxed">Estes termos são regidos pela legislação brasileira, especialmente:</p>
						<ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-4">
							<li>Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018);</li>
							<li>Marco Civil da Internet (Lei nº 12.965/2014);</li>
							<li>Código de Defesa do Consumidor (Lei nº 8.078/1990);</li>
							<li>Código Civil Brasileiro (Lei nº 10.406/2002).</li>
						</ul>
					</section>

					{/* Contato */}
					<section>
						<h2 className="text-2xl font-bold text-gray-900 mb-4 border-t pt-6">7. Contato</h2>
						<div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
							<p className="text-gray-700 leading-relaxed mb-2">
								<strong>Encarregado de Dados (DPO):</strong>
							</p>
							<ul className="text-gray-700 space-y-1">
								<li>
									<strong>E-mail:</strong> processos@ampereenergias.com.br
								</li>
							</ul>
							<p className="text-gray-700 leading-relaxed mt-4">
								Para dúvidas, solicitações de exercício de direitos ou reportar incidentes de segurança, entre em contato através dos canais acima.
								Responderemos em até 15 dias úteis.
							</p>
						</div>
					</section>

					{/* Aceitação */}
					<section className="border-t pt-6">
						<div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
							<p className="text-gray-700 leading-relaxed">
								<strong>Aceitação:</strong> Ao utilizar este sistema, você declara ter lido, compreendido e concordado com os Termos de Uso e Política de
								Privacidade aqui estabelecidos.
							</p>
						</div>
					</section>
				</div>

				{/* Footer */}
				<footer className="mt-8 text-center text-sm text-gray-600 pb-8">
					<p>© {new Date().getFullYear()} Ampere Energia. Todos os direitos reservados.</p>
					<p className="mt-2">Sistema de Gestão de Projetos Fotovoltaicos - Uso Interno</p>
				</footer>
			</main>
		</div>
	);
}
