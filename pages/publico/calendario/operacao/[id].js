import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useState } from 'react'
import axios from 'axios'
import connectToDataBase from '../../../../utils/services/mongodb/operations'
import { ObjectId } from 'mongodb'
import dayjs from 'dayjs'
import Image from 'next/image'
import Logo from '../../../../utils/images/logo-texto-azul.png'
import { useEffect } from 'react'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from 'react-icons/io'
import ReportLine from '../../../../components/ReportLine'

const colors = [
  {
    cor: '#15599a',
  },
  {
    cor: '#20e83e',
  },
  {
    cor: '#fead61',
  },
  {
    cor: '#1cd9c9',
  },
  { cor: '#b515e6' },
  { cor: '#ba0627' },
  { cor: '#8c7103' },
]
function getColor(cidade) {
  let cid = cidadesCores.filter((x) => x.nome == cidade)
  if (cid.length > 0) {
    return cid[0].cor
  } else {
    return '#ab3580'
  }
}
const Calendar = ({ operation }) => {
  const [events, setEvents] = useState([operation])
  const [view, setView] = useState('GERAL')
  const [reports, setReports] = useState()
  const [showReportHistory, setShowReportHistory] = useState(false)

  function handleFilter(newView) {
    setView(newView)
    if (newView == 'GERAL') {
      setEvents([operation])
    }
    if (newView == 'ATIVIDADES') {
      let activities = operation.atividades
      activities = activities.map((activity, index) => {
        return {
          ...activity,
          title: activity.nome,
          start: dayjs(activity.dataInicio).add(1, 'days').format('YYYY-MM-DD'),
          end: activity.dataConclusao
            ? dayjs(activity.dataConclusao).add(1.5, 'days').format('YYYY-MM-DD')
            : dayjs(activity.previsaoConclusao).add(1.5, 'days').format('YYYY-MM-DD'),
          backgroundColor: colors[index].cor,
          borderColor: colors[index].cor,
        }
      })
      setEvents(activities)
    }
    if (newView == 'SUBATIVIDADES') {
      let subactivities = []
      operation.atividades.forEach((activity, index) => {
        let subs = activity.subAtividades.map((x) => {
          return {
            ...x,
            title: x.nome,
            start: dayjs(x.dataInicio).add(1, 'days').format('YYYY-MM-DD'),
            end: x.dataConclusao
              ? dayjs(x.dataConclusao).add(1.5, 'days').format('YYYY-MM-DD')
              : dayjs(x.previsaoConclusao).add(1.5, 'days').format('YYYY-MM-DD'),
            backgroundColor: colors[index].cor,
            borderColor: colors[index].cor,
          }
        })
        subactivities = subactivities.concat(subs)
      })
      setEvents(subactivities)
    }
  }
  async function fetchOperationReports() {
    try {
      const { data } = await axios.get(`/api/operacoes/relatorios?id=${operation._id}`)
      setReports(data)
    } catch (error) {
      alert('Houve um erro ao buscar relatórios da operação.')
    }
  }
  useEffect(() => {
    fetchOperationReports()
  }, [])
  console.log(reports)
  return (
    <div className="p-6 grow">
      <div className="flex flex-col w-full border-b border-gray-200 pb-2 mb-2">
        <div className="flex flex-col lg:flex-row items-center z-0 justify-between">
          <div className="relative w-[200px] h-[65px] ml-2">
            <Image src={Logo} alt="USUÁRIO" title="CONFIGURAÇÕES" fill={true} layout={'fill'} onClick={() => setConfigDropDown((prev) => !prev)} />
          </div>
          <h1 className="text-xl text-[#15599a] font-bold">CRONOGRAMA DE OBRAS</h1>
          <div className="flex flex-col lg:flex-row items-center gap-2 z-10 mt-2">
            <button
              onClick={() => handleFilter('GERAL')}
              className={`${
                view == 'GERAL'
                  ? 'bg-[#15599a] border border-[#15599a] text-white hover:bg-white hover:text-[#15599a]'
                  : 'bg-white border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white'
              } p-2 rounded font-bold`}
            >
              VISUALIZAÇÃO GERAL
            </button>
            <button
              onClick={() => handleFilter('ATIVIDADES')}
              className={`${
                view == 'ATIVIDADES'
                  ? 'bg-[#15599a] border border-[#15599a] text-white hover:bg-white hover:text-[#15599a]'
                  : 'bg-white border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white'
              } p-2 rounded font-bold`}
            >
              VISUALIZAÇÃO DAS ATIVIDADES
            </button>
            <button
              onClick={() => handleFilter('SUBATIVIDADES')}
              className={`${
                view == 'SUBATIVIDADES'
                  ? 'bg-[#15599a] border border-[#15599a] text-white hover:bg-white hover:text-[#15599a]'
                  : 'bg-white border border-[#15599a] text-[#15599a] hover:bg-[#15599a] hover:text-white'
              } p-2 rounded font-bold`}
            >
              VISUALIZAÇÃO DAS SUBATIVIDADES
            </button>
          </div>
        </div>{' '}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full p-1 bg-[#15599a] my-2">
            <p className="text-white font-medium text-center">HISTÓRICO DE RELATÓRIOS</p>
            {showReportHistory ? (
              <div className="text-white hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropupCircle style={{ fontSize: '25px' }} onClick={() => setShowReportHistory(false)} />
              </div>
            ) : (
              <div className="text-white hover:text-blue-400 cursor-pointer">
                <IoMdArrowDropdownCircle style={{ fontSize: '25px' }} onClick={() => setShowReportHistory(true)} />
              </div>
            )}
          </div>
          {showReportHistory ? (
            reports ? (
              reports.length > 0 ? (
                reports.map((report, index) => <ReportLine report={report} key={index} count={reports.length - index} />)
              ) : (
                <p className="py-4 text-center w-full animate-pulse text-gray-600 font-medium">Sem relatórios vinculados a essa operação.</p>
              )
            ) : (
              <p className="py-4 text-center w-full animate-pulse text-gray-600 font-medium">Buscando...</p>
            )
          ) : null}
        </div>
      </div>

      <FullCalendar
        buttonText={{
          today: 'HOJE',
          month: 'MÊS',
          week: 'SEMANA',
          day: 'DIA',
        }}
        eventBackgroundColor={true}
        locale={'pt-br'}
        plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
        dayHeaderFormat={{ weekday: 'narrow' }}
        titleFormat={{ year: 'numeric', month: 'numeric' }}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'title',
          center: '',
          end: 'prev,next',
        }}
        events={events}
        editable={false}
        selectable
        defaultAllDay={true}
        handleWindowResize={true}
        height={650}
        themeSystem="litera"
      />
    </div>
  )
}

export default Calendar

export async function getServerSideProps({ query }) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const db = await connectToDataBase(process.env.DB_KEY)
  const collection = db.collection('dados')
  const { id } = query

  var operation = await collection.findOne({ _id: ObjectId(id) })
  operation = {
    ...operation,
    title: operation.nome,
    start: operation.dataInicio,
    end: operation.dataConclusao
      ? dayjs(operation.dataConclusao).add(1, 'days').format('YYYY-MM-DD')
      : dayjs(operation.previsaoConclusao).add(1, 'days').format('YYYY-MM-DD'),
  }
  operation = JSON.parse(JSON.stringify(operation))
  // let eventos = [];
  // arr.forEach((item) =>
  //   item.ordensDeServico.forEach((x, index) => {
  //     if (x.agendar) {
  //       eventos.push({
  //         id: item._id,
  //         index: index,
  //         qtde: item.qtde,
  //         nomeDoContrato: item.nomeDoContrato,
  //         categoria: x.categoria,
  //         servicoExecutado: x.servicoExecutado,
  //         cidade: item.cidade ? item.cidade : "-",
  //         bairro: item.bairro ? item.bairro : "-",
  //         logradouro: item.logradouro ? item.logradouro : "-",
  //         numeroResidencia: item.numeroResidencia ? item.numeroResidencia : "-",
  //         qtdeModulos: item.sistema.qtdeModulos
  //           ? item.sistema.qtdeModulos
  //           : "-",
  //         potModulos: item.sistema.potModulos ? item.sistema.potModulos : "-",
  //         topologia: item.sistema.topologia ? item.sistema.topologia : "-",
  //         ...x,
  //       });
  //     }
  //   })
  // );
  // eventos = eventos?.map((evento) => {
  //   return {
  //     title: evento.nomeDoContrato,
  //     index: evento.index,
  //     categoria: evento.categoria,
  //     servicoExecutado: evento.servicoExecutado,
  //     start: dayJS(evento.inicioServico).add(3, "hours").format("YYYY-MM-DD"),
  //     end: dayJS(evento.fimServico).add(1, "days").format("YYYY-MM-DD"),
  //     id: evento.id.toString(),
  //     qtde: evento.qtde,
  //     equipe: evento.equipe ? evento.equipe : "-",
  //     cidade: evento.cidade ? evento.cidade : "-",
  //     logradouro: evento.logradouro ? evento.logradouro : "-",
  //     bairro: evento.bairro ? evento.bairro : "-",
  //     numeroResidencia: evento.numeroResidencia ? evento.numeroResidencia : "-",
  //     qtdeModulos: evento.qtdeModulos ? evento.qtdeModulos : "-",
  //     topologia: evento.topologia ? evento.topologia : "-",
  //     backgroundColor: getColor(evento.cidade),
  //   };
  // });

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      operation: operation,
    },
  }
}
