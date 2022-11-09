import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
import connectToDatabase from "../../utils/projectsDb";
import axios from "axios";
import ModalCronograma from "../../components/ModalCronograma";

const Calendar = ({ arr }) => {
  const [eventos, setEventos] = useState(arr);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEvento, setModalEvento] = useState({});
  /*function getEventos() {
    axios.get("/api/cronograma").then((res) => setEventos(res.data));
  }*/
  function handleResize(e) {
    console.log("RESIZE");
    console.log(e);
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
  console.log(modalEvento);
  return (
    <div className="p-6 grow">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
        <h1 className="text-xl text-[#15599a] font-bold">
          CRONOGRAMA DE OBRAS
        </h1>
        <button
          onClick={() => setCalendarVisible(true)}
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
          locale={"BR"}
          plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
          dayHeaderFormat={{ weekday: "narrow" }}
          titleFormat={{ year: "numeric", month: "narrow" }}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "title",
            center: "",
            end: "today prev,next",
          }}
          events={arr}
          editable
          selectable
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
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("dados");
  var arr = await collection
    .aggregate([
      {
        $match: {
          "obra.entrada": { $gte: "2022-11-01T00:00:00.000Z" },
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
          "obra.entrada": 1,
        },
      },
    ])
    .toArray();
  arr = arr?.map((evento) => {
    return {
      title: evento.nomeDoContrato,
      date: new Date(new Date(evento.obra.entrada).setHours(28)).toISOString(),
      id: evento._id.toString(),
      qtde: evento.qtde,
      equipe: evento.obra.equipeResp,
      cidade: evento.cidade,
      logradouro: evento.logradouro,
      bairro: evento.bairro,
      numeroResidencia: evento.numeroResidencia,
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
