import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState } from "react";
import axios from "axios";
import ModalCronograma from "../../components/ModalCronograma";
import connectToDatabase from "../../utils/projectsDb";
import Select from "react-select";
import { cidadesAtendidas } from "../../utils/constants";
import * as dayJS from "dayjs";
const Calendar = ({ arr }) => {
  const [eventos, setEventos] = useState(arr);
  const [calendarVisible, setCalendarVisible] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEvento, setModalEvento] = useState({});
  const [filters, setFilters] = useState({
    cidadeFilter: [],
  });
  /*function getEventos() {
    axios.get("/api/cronograma").then((res) => setEventos(res.data));
  }*/
  function handleResize(e) {
    console.log("RESIZE");
    /*console.log(
      "INICIO",
      new Date(e.event._instance.range.start).toISOString()
    );
    console.log(
      "FIM",
      new Date(
        dayJS(e.event._instance.range.end).subtract(1, "day").$d
      ).toISOString()
    );*/
    var id = e.event._def.publicId;
    var inicio = new Date(e.event._instance.range.start).toISOString();

    var fim = new Date(
      dayJS(e.event._instance.range.end).subtract(1, "day").$d
    ).toISOString();
    axios
      .post(`/api/projects/update/${id}`, {
        "agendamentoObra.inicio": inicio,
        "agendamentoObra.fim": fim,
      })
      .then((res) => console.log(res));
    // pegar novos dados em e.event._instance.range.(start e end)
    /*axios
      .post("/api/cronograma/update", {
        id: e.event._def.extendedProps._id,
        title: e.event._def.title,
        start: new Date(e.event._instance.range.start).toLocaleDateString(),
        end: new Date(e.event._instance.range.end).toLocaleDateString(),
      })
      .then((res) => console.log(res.data));*/
  }
  function handleDragDrop(e) {
    console.log("DROP");
    // testar diferença entre e.oldEvent._instance.range.end com e.event._instance.range.end
    console.log(e);
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
  console.log(
    dayJS("2022-11-08T00:00:00.000Z").add(3, "hours").format("YYYY-MM-DD")
  );
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
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("dados");
  var arr = await collection
    .aggregate([
      {
        $match: {
          "agendamentoObra.inicio": { $gte: "2022-11-01T00:00:00.000Z" },
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
          "obra.equipeResp": 1,
          agendamentoObra: 1,
          "sistema.qtdeModulos": 1,
          "sistema.topologia": 1,
        },
      },
    ])
    .toArray();
  arr = arr?.map((evento) => {
    return {
      title: evento.nomeDoContrato,
      start: dayJS(evento.agendamentoObra.inicio)
        .add(3, "hours")
        .format("YYYY-MM-DD"),
      end: dayJS(evento.agendamentoObra.fim)
        .add(2, "days")
        .format("YYYY-MM-DD"),
      id: evento._id.toString(),
      qtde: evento.qtde,
      equipe: evento.obra.equipeResp,
      cidade: evento.cidade,
      logradouro: evento.logradouro,
      bairro: evento.bairro,
      numeroResidencia: evento.numeroResidencia,
      qtdeModulos: evento.sistema.qtdeModulos,
      topologia: evento.sistema.topologia,
    };
  });

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      arr,
    },
  };
}
