import ErrorComponent from '@/components/utils/ErrorComponent'
import { formatDateAsLocale } from '@/utils/methods/formatting'
import { formatLocation } from '@/utils/methods/formatting'
import Avatar from '@/components/utils/Avatar'
import { BsCalendarCheck } from 'react-icons/bs'
import LoadingPage from '@/components/utils/LoadingPage'
import { BsCalendarPlus } from 'react-icons/bs'
import { cn } from '@/lib/utils'
import { FaPhone } from 'react-icons/fa'
import { useIGreenTechnicalAnalysis } from '@/utils/methods/query/igreen/technical-analysis'
import type { TAuthSession } from '@/lib/authentication/types'
import { useSession } from '@/components/providers/SessionProvider'
import type { TIGreenTechnicalAnalysis } from '../api/integracao/igreen/technical-analysis'
import { formatNameAsInitials } from '@/utils/methods/formatting'
import { FaUser } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'

export default function IGreenTechnicalAnalysis() {
  const { session, status } = useSession({ required: true })
  if (status !== 'authenticated') return <LoadingPage />

  return <IGreenTechnicalAnalysisPage session={session} />
}

type IGreenTechnicalAnalysisPageProps = {
  session: TAuthSession
}
function IGreenTechnicalAnalysisPage({ session }: IGreenTechnicalAnalysisPageProps) {
  const { data: technicalAnalysis, isLoading, isError, isSuccess, error } = useIGreenTechnicalAnalysis()

  return (
    <div className="flex w-full max-w-full grow flex-col overflow-x-hidden bg-[#f8f9fa] p-6">
      <div className="flex w-full flex-col gap-2 border-b border-black pb-2">
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex items-center gap-1">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-black leading-none tracking-tight md:text-2xl">CONTROLE DE ANÁLISES TÉCNICAS (IGREEN)</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-2 py-2">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao buscar análises técnicas.'} /> : null}
        {isSuccess && technicalAnalysis
          ? technicalAnalysis.map((analysisInfo) => <TechnicalAnalysisCard key={analysisInfo.id} analysis={analysisInfo} />)
          : null}
      </div>
    </div>
  )
}

type TechnicalAnalysisCardProps = {
  analysis: TIGreenTechnicalAnalysis[number]
}
function TechnicalAnalysisCard({ analysis }: TechnicalAnalysisCardProps) {
  function getTechnicalAnalysisStatusTag(technicalAnalysis: TIGreenTechnicalAnalysis[number]) {
    if (technicalAnalysis.status === 'CONCLUÍDO' && technicalAnalysis.dataEfetivacao)
      return <h1 className={cn('min-w-fit rounded-lg bg-green-500 px-2 py-0.5 text-[0.5rem] text-white')}>{analysis.status}</h1>

    const currentDate = new Date()
    if (technicalAnalysis.dataPrevisaoEfetivacao && technicalAnalysis.dataPrevisaoEfetivacao < currentDate)
      return <h1 className={cn('min-w-fit rounded-lg bg-orange-500 px-2 py-0.5 text-[0.5rem] text-white')}>EM ATRASO</h1>

    if (status === 'EM ANDAMENTO') return <h1 className={cn('min-w-fit rounded-lg bg-blue-500 px-2 py-0.5 text-[0.5rem] text-white')}>{status}</h1>

    return <h1 className={cn('min-w-fit rounded-lg bg-gray-500 px-2 py-0.5 text-[0.5rem] text-white')}>{status}</h1>
  }
  return (
    <div className="flex w-full flex-col gap-1 rounded border border-primary bg-[#fff] p-2 shadow-sm dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold leading-none tracking-tight">{analysis.titulo}</p>
          {getTechnicalAnalysisStatusTag(analysis)}
        </div>
        <div className="flex w-full items-center justify-between gap-1 lg:w-fit">
          <p className="block text-[0.65rem] font-medium text-primary/80 lg:hidden">ANALISTAS</p>
          <div className="flex -space-x-1 overflow-hidden">
            {analysis.analistas.map((analyst) => (
              <Avatar
                key={analyst.id}
                url={analyst.usuario.avatar}
                width={20}
                height={20}
                fallback={formatNameAsInitials(analyst.usuario.nome || '')}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
          <div className="flex items-center gap-1">
            <FaUser width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{analysis.cliente.nome}</h1>
          </div>
          <div className="flex items-center gap-1">
            <FaPhone width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">{analysis.cliente.telefonePrimario}</h1>
          </div>
          <div className="flex items-center gap-1">
            <FaLocationDot width={10} height={10} />
            <h1 className="py-0.5 text-center text-[0.6rem] font-medium italic text-primary/80">
              {formatLocation({
                location: {
                  uf: analysis.localizacaoUf || '',
                  cidade: analysis.localizacaoCidade || '',
                  cep: analysis.localizacaoCep,
                  bairro: analysis.localizacaoBairro,
                  endereco: analysis.localizacaoLogradouro,
                  numeroOuIdentificador: analysis.localizacaoNumero,
                  complemento: analysis.localizacaoComplemento,
                  latitude: analysis.localizacaoLatitude,
                  longitude: analysis.localizacaoLongitude,
                },
                includeCity: true,
                includeUf: true,
              })}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <BsCalendarPlus />
            <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(analysis.dataInsercao, true)}</p>
          </div>
          {analysis.dataEfetivacao ? (
            <div className="flex items-center gap-1">
              <BsCalendarCheck color="#22c55e" />
              <p className="text-[0.65rem] font-medium text-primary/80">{formatDateAsLocale(analysis.dataEfetivacao, true)}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <Avatar
              key={analysis.autor.id}
              url={analysis.autor.avatar}
              width={20}
              height={20}
              fallback={formatNameAsInitials(analysis.autor.nome || '')}
            />
            <p className="text-[0.65rem] font-medium text-primary/80">{analysis.autor.nome}</p>
          </div>
        </div>
        <Link href={`https://sistema-igreen.vercel.app/dashboard/analises-tecnicas/id/${analysis.id}`}>
          <button type="button" className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[0.6rem] text-secondary">
            <SquareArrowOutUpRight width={10} height={10} />
            <p>IR À PÁGINA</p>
          </button>
        </Link>
      </div>
    </div>
  )
}
