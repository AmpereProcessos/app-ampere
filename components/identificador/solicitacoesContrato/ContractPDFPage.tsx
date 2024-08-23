import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useContractRequestById } from '@/utils/methods/query/contract-requests'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import OwnerSignature from '@/utils/images/signature-diogo.jpg'
import React, { useState } from 'react'
import Image from 'next/image'
import WhiteLogo from '@/utils/svgs/logo-texto-azul-vertical.svg'
import { formatToMoney } from '@/utils/constants'
// @ts-ignore
import numeroPorExtenso from 'numero-por-extenso'
import TextInput from '@/components/inputs/Text'
dayjs.locale(ptBr)

type ContractPDFPageProps = {
  id: string
}
function ContractPDFPage({ id }: ContractPDFPageProps) {
  const { data: request, isLoading, isError, isSuccess } = useContractRequestById({ id })
  const [paymentFormText, setPaymentFormText] = useState('pago à vista após a assinatura')
  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorComponent msg={'Erro ao buscar informações da solicitação de contrato.'} />
  if (isSuccess && request)
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="w-full print:hidden">
          <TextInput
            label="TEXTO DO MÉTODO DE PAGAMENTO"
            placeholder="Preencha aqui o texto da forma de pagamento..."
            value={paymentFormText}
            handleChange={(value) => setPaymentFormText(value)}
            width="100%"
          />
        </div>
        <div className="flex h-[30.5cm] w-[21cm] flex-col font-[Arial] leading-relaxed tracking-wider">
          <div className="flex w-full items-center justify-end px-12">
            <div className="relative h-[60px] w-[60px]">
              <Image src={WhiteLogo} fill={true} alt="LOGO" />
            </div>
          </div>
          <div className="w-full px-12">
            <div className="h-[2px] w-full rounded bg-blue-500 "></div>
          </div>
          <div className="flex w-full grow flex-col gap-4 p-4 px-12">
            <h1 className="w-full text-center font-extrabold underline underline-offset-2">
              CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MANUTENÇÃO PREVENTIVA
            </h1>
            <h1 className="text-justify text-[0.9rem] font-medium">
              <strong className="font-extrabold underline underline-offset-2">CONTRATANTE:</strong>{' '}
              <strong>{request?.nomeDoContrato.toUpperCase()}</strong>, titular do RG <strong>{request.rg.toUpperCase()}</strong>, inscrito no CPF/MF
              n.º <strong>{request.cpf_cnpj}</strong>, com telefones <strong>{request.telefone}</strong>, com endereço na{' '}
              <strong>
                {request.enderecoCobranca.toUpperCase()}, Nº {request.numeroResCobranca.toUpperCase()}, BAIRRO {request.bairro.toUpperCase()}, CEP{' '}
                {request.cep}
              </strong>
              , no município de{' '}
              <strong>
                {request.cidade?.toUpperCase()}/{request.uf?.toUpperCase()}
              </strong>{' '}
              com endereço eletrônico <strong>{request.email}</strong>.
            </h1>
            <h1 className="text-justify text-[0.9rem] font-medium">
              <strong className="font-extrabold underline underline-offset-2">CONTRATADA:</strong>{' '}
              <strong>AMPÈRE ENGENHARIA E CONSULTORIA ELÉTRICA LTDA</strong>, com nome fantasia de AMPÈRE ENERGIAS, inscrita no CNPJ/MF n.º
              27.901.968/0001-45, com sede na Avenida Nove, n.º 233, Centro, CEP 38.300-150, município de Ituiutaba/MG, por seu representante legal,
              Diogo Paulino Carvalho, brasileiro, solteiro, titular do RG MG-14372057 e do CPF/MF 072.427.186-43, integrada à{' '}
              <strong className="font-extrabold underline underline-offset-2">DAP CONSULTORIA INTEGRADA LTDA</strong>, pessoa jurídica de direito
              privado, inscrita no CNPJ/MF sob nº 43.830.044/0001-51, com sede na Avenida Nove, 233, sala 02, Centro, Ituiutaba/MG, CEP 38.300-150.
            </h1>
            <div className="flex w-full flex-col gap-1.5">
              <h1 className="text-justify text-[0.9rem] font-medium">
                <strong className="font-extrabold underline underline-offset-2">{'CLÁUSULA PRIMEIRA – DO OBJETO E FORMA DE EXECUÇÃO'}</strong>
              </h1>
              <h1 className="text-justify text-[0.9rem] font-medium">
                Constitui objeto deste contrato a execução de 1 (uma) manutenção preventiva abrangendo os seguintes itens:
              </h1>
              <ul className="list-disc pl-4">
                <li className="text-justify text-[0.9rem] font-medium">
                  Verificação e análise dos circuitos e proteções para identificação de possíveis defeitos compreendendo desde transformadores
                  dedicados ao sistema fotovoltaico, chaves seccionadoras, fusíveis, DPS CC e CA e disjuntores;
                </li>
                <li className="text-justify text-[0.9rem] font-medium">Limpeza dos módulos fotovoltaicos do sistema em questão;</li>
                <li className="text-justify text-[0.9rem] font-medium">Reaperto de conexões dos cabos do sistema;</li>
                <li className="text-justify text-[0.9rem] font-medium">
                  Análise e conferência das grandezas mostradas pelo inversor através de equipamentos de medição apropriados;
                </li>
                <li className="text-justify text-[0.9rem] font-medium">1 (uma) distribuição de crédito;</li>
              </ul>
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <h1 className="text-justify text-[0.9rem] font-medium">
                <strong className="font-extrabold underline underline-offset-2">{'CLÁUSULA SEGUNDA – DOS PRAZOS'}</strong>
              </h1>
              <h1 className="text-justify text-[0.9rem] font-medium">
                O contrato será executado em até 30 dias após o pagamento da entrada. O prazo poderá ser prorrogado em casos de condições climáticas
                adversas, como chuvas ou calamidades, bem como pela indisponibilidade do imóvel devido a obras ou adequações necessárias. Caso uma das
                partes descumpra as obrigações contratuais, será aplicada multa diária de 0,5% do valor total do contrato, limitada a 10%, com juros
                de 1% ao mês até a quitação.
              </h1>
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <h1 className="text-justify text-[0.9rem] font-medium">
                <strong className="font-extrabold underline underline-offset-2">{'CLÁUSULA TERCEIRA – DO PREÇO E FORMAS DE PAGAMENTO'}</strong>
              </h1>
              <h1 className="text-justify text-[0.9rem] font-medium">
                O valor total do contrato é de{' '}
                <strong>
                  {formatToMoney(request.valorContrato || 0)} (
                  {numeroPorExtenso.porExtenso(request.valorContrato || 0, numeroPorExtenso.estilo.monetario)})
                </strong>
                , {paymentFormText}. Esse valor cobre mão de obra, ferramentas necessarias à execução do serviço, impostos e contribuições sociais. No
                entanto, o preço não inclui adequações em telhados, estruturas, redes elétricas ou melhorias no padrão de energia, nem materiais
                elétricos ou mecânicos que possam ser necessários durante os reparos. Esses custos adicionais serão de responsabilidade do
                contratante.
              </h1>
            </div>
          </div>
          <div className="flex w-full items-center justify-end p-4 px-12">
            <div className="relative h-[45px] w-[120px]">
              <Image src={OwnerSignature} fill={true} alt="Assinatura Representante Ampère Energias" />
            </div>
            <h1 className="text-gray-500">1</h1>
          </div>
        </div>
        <div className="flex h-[30.5cm] w-[21cm] flex-col font-[Arial] leading-relaxed tracking-wider">
          <div className="flex w-full items-center justify-end px-12">
            <div className="relative h-[60px] w-[60px]">
              <Image src={WhiteLogo} fill={true} alt="LOGO" />
            </div>
          </div>
          <div className="w-full px-12">
            <div className="h-[2px] w-full rounded bg-blue-500 "></div>
          </div>
          <div className="flex w-full grow flex-col gap-4 p-4 px-12">
            <div className="flex w-full flex-col gap-1.5">
              <h1 className="text-justify text-[0.9rem] font-medium">
                <strong className="font-extrabold underline underline-offset-2">{'CLÁUSULA QUARTA – DAS OBRIGAÇÕES DA CONTRATADA'}</strong>
              </h1>
              <h1 className="text-justify text-[0.9rem] font-medium">
                A contratada deve seguir todas as normas de Segurança e Medicina do Trabalho, fornecendo os equipamentos de segurança necessários a
                seus funcionários. Também deve garantir a qualidade dos serviços prestados. A responsabilidade pelos encargos trabalhistas e
                previdenciários de seus funcionários será exclusivamente da contratada.
              </h1>
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <h1 className="text-justify text-[0.9rem] font-medium">
                <strong className="font-extrabold underline underline-offset-2">{'CLÁUSULA QUINTA – DAS OBRIGAÇÕES DO CONTRATANTE'}</strong>
              </h1>
              <h1 className="text-justify text-[0.9rem] font-medium">
                O contratante deve permitir o acesso ao imóvel, realizar os pagamentos conforme acordado, e assumir a responsabilidade por eventuais
                danos no telhado ou na estrutura durante e após a manutenção, exceto em casos de negligência da contratada. Também é responsável pelas
                informações fornecidas sobre a estrutura do imóvel, isentando a contratada de futuros danos à estrutura física ou elétrica.
              </h1>
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <h1 className="text-justify text-[0.9rem] font-medium">
                <strong className="font-extrabold underline underline-offset-2">{'CLÁUSULA SEXTA – DA RESCISÃO E MULTAS'}</strong>
              </h1>
              <h1 className="text-justify text-[0.9rem] font-medium">
                O contrato será encerrado após a entrega dos serviços. O contratante pode desistir dentro de 10 dias após a assinatura, sujeito a
                multa. Após esse prazo, o contratante responderá por perdas e danos. Em caso de falecimento do contratante, o contrato se encerra,
                exceto em situações previamente acordadas. A contratada pode rescindir o contrato caso o contratante descumpra suas obrigações.
              </h1>
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <h1 className="text-justify text-[0.9rem] font-medium">
                <strong className="font-extrabold underline underline-offset-2">{'CLÁUSULA SÉTIMA – DAS DISPOSIÇÕES GERAIS'}</strong>
              </h1>
              <h1 className="text-justify text-[0.9rem] font-medium">
                Em caso de cobrança administrativa ou judicial, o contratante deverá pagar 10% do valor do contrato em honorários advocatícios.
                Nenhuma das partes será responsabilizada por descumprimento contratual decorrente de força maior ou caso fortuito, conforme o artigo
                393 do Código Civil Brasileiro.
              </h1>
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <h1 className="text-justify text-[0.9rem] font-medium">
                <strong className="font-extrabold underline underline-offset-2">{'CLÁUSULA OITAVA – DA ELEIÇÃO DE FORO'}</strong>
              </h1>
              <h1 className="text-justify text-[0.9rem] font-medium">
                As partes elegem o foro da Comarca de Ituiutaba para resolver qualquer conflito decorrente deste contrato, excluindo qualquer outro. O
                contrato, com 2 páginas, é assinado em duas vias iguais pelas partes e duas testemunhas, para efeitos legais.
              </h1>
            </div>
            <h1 className="mt-4 text-justify text-[0.9rem] font-medium">
              Ituiutaba/MG, <strong className="font-extrabold">{dayjs().format('DD [de] MMMM [de] YYYY')}</strong>.
            </h1>
            <div className="flex min-h-[100px] w-full items-end gap-6">
              <div className="flex w-1/2 flex-col gap-2">
                <div className="h-[1px] w-full bg-black"></div>
                <h1 className="text-center text-[0.9rem] font-extrabold leading-none">{request.nomeDoContrato.toUpperCase()}</h1>
                <h1 className="text-center text-[0.9rem] font-bold leading-none">{request.cpf_cnpj}</h1>
              </div>
              <div className="flex w-1/2 flex-col gap-2">
                <div className="flex w-full items-center justify-center">
                  <div className="relative h-[45px] w-[120px]">
                    <Image src={OwnerSignature} fill={true} alt="Assinatura Representante Ampère Energias" />
                  </div>
                </div>
                <div className="h-[1px] w-full bg-black"></div>
                <h1 className="text-center text-[0.9rem] font-extrabold leading-none">AMPERE ENERGIAS</h1>
                <h1 className="text-center text-[0.9rem] font-bold leading-none">27.901.968/0001-45</h1>
              </div>
            </div>
            <div className="flex min-h-[100px] w-full items-end gap-6">
              <div className="flex w-1/2 flex-col gap-2">
                <div className="h-[1px] w-full bg-black"></div>
                <h1 className="text-center text-[0.9rem] font-extrabold leading-none">TESTEMUNHA 01:</h1>
                <div className="flex w-full items-center gap-1">
                  <h1 className="text-center text-[0.9rem] font-bold leading-none">CPF:</h1>
                </div>
              </div>
              <div className="flex w-1/2 flex-col gap-2">
                <div className="h-[1px] w-full bg-black"></div>
                <h1 className="text-center text-[0.9rem] font-extrabold leading-none">TESTEMUNHA 02:</h1>
                <div className="flex w-full items-center gap-1">
                  <h1 className="text-center text-[0.9rem] font-bold leading-none">CPF:</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end p-4 px-12">
            <h1 className="text-gray-500">2</h1>
          </div>
        </div>
      </div>
    )

  return <></>
}

export default ContractPDFPage
