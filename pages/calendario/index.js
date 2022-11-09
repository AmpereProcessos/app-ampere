import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const Calendar = ({ arr }) => {
  const [eventos, setEventos] = useState([]);
  function getEventos() {
    axios.get("/api/cronograma").then((res) => setEventos(res.data));
  }
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
  }
  useEffect(() => {
    getEventos();
  }, []);
  return (
    <div>
      TEste
      {/**     <FullCalendar
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
      events={eventos}
      editable
      selectable
      handleWindowResize={true}
      eventResize={(e) => handleResize(e)}
      eventDrop={(e) => handleDragDrop(e)}
      eventClick={(e) => handleClick(e)}
      height={650}
    />*/}
    </div>
  );
};

export default Calendar;
