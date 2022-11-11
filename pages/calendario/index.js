import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState } from "react";
import axios from "axios";
import connectToDataBase from "../../utils/projectsDb";
import ModalCronograma from "../../components/ModalCronograma";
import Select from "react-select";
import { cidadesAtendidas } from "../../utils/constants";
import * as dayJS from "dayjs";
const cidadesCores = [
  {
    nome: "ITUIUTABA",
    cor: "#15599a",
  },
  {
    nome: "SANTA VITÓRIA",
    cor: "green",
  },
  {
    nome: "UBERLÂNDIA",
    cor: "#fead61",
  },
  {
    nome: "IPIAÇU",
    cor: "#e6253e",
  },
];
function getColor(cidade) {
  let cid = cidadesCores.filter((x) => x.nome == cidade);
  if (cid.length > 0) {
    return cid[0].cor;
  } else {
    return "#1005ed";
  }
}
const Calendar = ({ arr }) => {
  const [eventos, setEventos] = useState(arr);
  const [calendarVisible, setCalendarVisible] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEvento, setModalEvento] = useState({});
  const [filters, setFilters] = useState({
    cidadeFilter: [],
  });
  function handleResize(e) {
    console.log("RESIZE");
    var id = e.event._def.publicId;
    var inicio = new Date(e.event._instance.range.start).toISOString();
    var fim = new Date(
      dayJS(e.event._instance.range.end).subtract(1, "day").$d
    ).toISOString();
    var index = e.event._def.extendedProps.index;
    console.log(index);
    axios
      .post(`/api/projects/update/${id}`, {
        [`ordensDeServico.${index}.inicioServico`]: inicio,
        [`ordensDeServico.${index}.fimServico`]: fim,
      })
      .then((res) => console.log(res));
  }
  function handleDragDrop(e) {
    console.log("DROP");
    var id = e.event._def.publicId;
    var inicio = new Date(e.event._instance.range.start).toISOString();
    var fim = new Date(
      dayJS(e.event._instance.range.end).subtract(1, "day").$d
    ).toISOString();
    var index = e.event._def.extendedProps.index;
    console.log(index);
    axios
      .post(`/api/projects/update/${id}`, {
        [`ordensDeServico.${index}.inicioServico`]: inicio,
        [`ordensDeServico.${index}.fimServico`]: fim,
      })
      .then((res) => console.log(res));
  }
  function handleClick(e) {
    console.log("CLICK");
    console.log(e);
    setModalEvento({
      nomeDoContrato: e.event._def.title,
      id: e.event._def.publicId,
      data: new Date(e.event._instance.range.start).toISOString(),
      ...e.event._def.extendedProps,
    });
    setModalIsOpen(true);
  }
  function handleFilter() {
    var newArr;
    if (filters.cidadeFilter.length > 0) {
      if (!newArr) newArr = arr;
      newArr = newArr.filter((evento) =>
        filters.cidadeFilter.includes(evento.cidade)
      );
    }
    if (!newArr) {
      setEventos(arr);
      setCalendarVisible(true);
    } else {
      setEventos(newArr);
      setCalendarVisible(true);
    }
  }
  console.log(arr);
  return (
    <div className="p-6 grow">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
        <h1 className="text-xl text-[#15599a] font-bold">
          CRONOGRAMA DE OBRAS
        </h1>
        <div className="flex items-center gap-x-2 z-10">
          <Select
            isMulti={true}
            placeholder="CIDADE"
            options={cidadesAtendidas.map((cidade) => {
              return { label: cidade, value: cidade };
            })}
            onChange={(e) =>
              setFilters({
                ...filters,
                cidadeFilter: e.map((x) => x.value),
              })
            }
          />
        </div>
        <button
          onClick={() => handleFilter()}
          className="bg-[#fead61] p-2 rounded font-bold hover:bg-[#15599a] hover:text-white"
        >
          VER CALENDÁRIO
        </button>
      </div>
      {calendarVisible && (
        <FullCalendar
          buttonText={{
            today: "HOJE",
            month: "MÊS",
            week: "SEMANA",
            day: "DIA",
          }}
          eventBackgroundColor={true}
          locale={"pt-br"}
          plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
          dayHeaderFormat={{ weekday: "narrow" }}
          titleFormat={{ year: "numeric", month: "long" }}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "title",
            center: "",
            end: "today prev,next",
          }}
          events={arr}
          editable
          selectable
          defaultAllDay={true}
          handleWindowResize={true}
          eventResize={(e) => handleResize(e)}
          eventDrop={(e) => handleDragDrop(e)}
          eventClick={(e) => handleClick(e)}
          height={650}
        />
      )}
      {modalIsOpen && (
        <ModalCronograma info={modalEvento} setModalIsOpen={setModalIsOpen} />
      )}
    </div>
  );
};

export default Calendar;

export async function getServerSideProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const db = await connectToDataBase(process.env.DB_KEY);
  const collection = db.collection("dados");
  var arr = await collection
    .aggregate([
      {
        $match: {
          "ordensDeServico.agendar": true,
        },
      },
      {
        $project: {
          qtde: 1,
          nomeDoContrato: 1,
          cidade: 1,
          logradouro: 1,
          bairro: 1,
          numeroResidencia: 1,
          ordensDeServico: 1,
          "sistema.qtdeModulos": 1,
          "sistema.potModulos": 1,
          "sistema.topologia": 1,
        },
      },
    ])
    .toArray();
  let eventos = [];
  arr.forEach((item) =>
    item.ordensDeServico.forEach((x, index) => {
      if (x.agendar) {
        eventos.push({
          id: item._id,
          index: index,
          qtde: item.qtde,
          nomeDoContrato: item.nomeDoContrato,
          categoria: x.categoria,
          servicoExecutado: x.servicoExecutado,
          cidade: item.cidade ? item.cidade : "-",
          bairro: item.bairro ? item.bairro : "-",
          logradouro: item.logradouro ? item.logradouro : "-",
          numeroResidencia: item.numeroResidencia ? item.numeroResidencia : "-",
          qtdeModulos: item.sistema.qtdeModulos
            ? item.sistema.qtdeModulos
            : "-",
          potModulos: item.sistema.potModulos ? item.sistema.potModulos : "-",
          topologia: item.sistema.topologia ? item.sistema.topologia : "-",
          ...x,
        });
      }
    })
  );
  eventos = eventos?.map((evento) => {
    return {
      title: evento.nomeDoContrato,
      index: evento.index,
      categoria: evento.categoria,
      servicoExecutado: evento.servicoExecutado,
      start: dayJS(evento.inicioServico).add(3, "hours").format("YYYY-MM-DD"),
      end: dayJS(evento.fimServico).add(1, "days").format("YYYY-MM-DD"),
      id: evento.id.toString(),
      qtde: evento.qtde,
      equipe: evento.equipe ? evento.equipe : "-",
      cidade: evento.cidade ? evento.cidade : "-",
      logradouro: evento.logradouro ? evento.logradouro : "-",
      bairro: evento.bairro ? evento.bairro : "-",
      numeroResidencia: evento.numeroResidencia ? evento.numeroResidencia : "-",
      qtdeModulos: evento.qtdeModulos ? evento.qtdeModulos : "-",
      topologia: evento.topologia ? evento.topologia : "-",
      backgroundColor: getColor(evento.cidade),
    };
  });

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      arr: eventos,
    },
  };
}
