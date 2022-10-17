import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRef, useState } from "react";
import connectToEventsDatabase from "../../utils/eventsDb";
import axios from "axios";

const Calendar = ({ arr }) => {
  const [eventos, setEventos] = useState(arr);
  console.log(arr);
  function handleResize(e) {
    // pegar novos dados em e.event._instance.range.(start e end)
    axios
      .post("/api/cronograma/update", {
        id: e.event._def.extendedProps._id,
        title: e.event._def.title,
        start: new Date(e.event._instance.range.start).toLocaleDateString(),
        end: new Date(e.event._instance.range.end).toLocaleDateString(),
      })
      .then((res) => console.log(res.data));
  }
  function handleDragDrop(e) {
    console.log("DROP");
    // testar diferença entre e.oldEvent._instance.range.end com e.event._instance.range.end
    console.log(e);
  }
  return (
    <div className="p-6 grow overflow-y-auto overscroll-y-auto">
      <div>
        <p className="cursor-pointer w-40 p-2 text-white rounded bg-[#15599a]">
          ADICIONAR OBRA
        </p>
      </div>
      <FullCalendar
        buttonText={{ today: "HOJE", month: "MÊS", week: "SEMANA", day: "DIA" }}
        plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
        titleFormat={{ year: "numeric", month: "long" }}
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
        height={650}
      />
    </div>
  );
};

export default Calendar;
export async function getServerSideProps(context) {
  const db = await connectToEventsDatabase(process.env.DB_KEY);
  const collection = db.collection("info");
  let arr = await collection.find({}).toArray();
  console.log(arr);
  arr = JSON.parse(JSON.stringify(arr));
  return {
    props: { arr }, // will be passed to the page component as props
  };
}
