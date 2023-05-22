import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useState } from "react";
import axios from "axios";
import connectToDataBase from "../../../utils/operacoesDb";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

const colors = [
  {
    cor: "#15599a",
  },
  {
    cor: "#20e83e",
  },
  {
    cor: "#fead61",
  },
  {
    cor: "#1cd9c9",
  },
  { cor: "#b515e6" },
  { cor: "#ba0627" },
  { cor: "#8c7103" },
];
function getColor(cidade) {
  let cid = cidadesCores.filter((x) => x.nome == cidade);
  if (cid.length > 0) {
    return cid[0].cor;
  } else {
    return "#ab3580";
  }
}
const Calendar = ({ operation }) => {
  const [events, setEvents] = useState([operation]);
  const [view, setView] = useState("GERAL");

  function handleFilter(newView) {
    setView(newView);
    if (newView == "GERAL") {
      setEvents([operation]);
    }
    if (newView == "ATIVIDADES") {
      let activities = operation.atividades;
      activities = activities.map((activity, index) => {
        return {
          ...activity,
          title: activity.nome,
          start: dayjs(activity.dataInicio).add(1, "days").format("YYYY-MM-DD"),
          end: activity.dataConclusao
            ? dayjs(activity.dataConclusao)
                .add(1.5, "days")
                .format("YYYY-MM-DD")
            : dayjs(activity.previsaoConclusao)
                .add(1.5, "days")
                .format("YYYY-MM-DD"),
          backgroundColor: colors[index].cor,
        };
      });
      setEvents(activities);
    }
    if (newView == "SUBATIVIDADES") {
      let subactivities = [];
      operation.atividades.forEach((activity, index) => {
        let subs = activity.subAtividades.map((x) => {
          return {
            ...x,
            title: x.nome,
            start: dayjs(x.dataInicio).add(1, "days").format("YYYY-MM-DD"),
            end: x.dataConclusao
              ? dayjs(x.dataConclusao).add(1.5, "days").format("YYYY-MM-DD")
              : dayjs(x.previsaoConclusao)
                  .add(1.5, "days")
                  .format("YYYY-MM-DD"),
            backgroundColor: colors[index].cor,
          };
        });
        subactivities = subactivities.concat(subs);
      });
      setEvents(subactivities);
    }
  }
  console.log(operation);
  return (
    <div className="p-6 grow">
      <div className="flex items-center z-0 justify-between border-b border-gray-200 pb-2 mb-2">
        <h1 className="text-xl text-[#15599a] font-bold">
          CRONOGRAMA DE OBRAS
        </h1>
        <div className="flex items-center gap-x-2 z-10">
          <button
            onClick={() => handleFilter("GERAL")}
            className={`${
              view == "GERAL"
                ? "bg-[#15599a] text-white hover:bg-[#fead61] hover:text-black"
                : "bg-[#fead61] text-black hover:bg-[#15599a] hover:text-white"
            } p-2 rounded font-bold`}
          >
            VISUALIZAÇÃO GERAL
          </button>
          <button
            onClick={() => handleFilter("ATIVIDADES")}
            className={`${
              view == "ATIVIDADES"
                ? "bg-[#15599a] text-white hover:bg-[#fead61] hover:text-black"
                : "bg-[#fead61] text-black hover:bg-[#15599a] hover:text-white"
            } p-2 rounded font-bold`}
          >
            VISUALIZAÇÃO DAS ATIVIDADES
          </button>
          <button
            onClick={() => handleFilter("SUBATIVIDADES")}
            className={`${
              view == "SUBATIVIDADES"
                ? "bg-[#15599a] text-white hover:bg-[#fead61] hover:text-black"
                : "bg-[#fead61] text-black hover:bg-[#15599a] hover:text-white"
            } p-2 rounded font-bold`}
          >
            VISUALIZAÇÃO DAS SUBATIVIDADES
          </button>
        </div>
      </div>
      {/* <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
        <div className={"flex items-center gap-x-2"}>
          <div className={`bg-[#15599a] w-[10px] h-[10px] rounded`}></div>
          <li className="list-none">ITUIUTABA</li>
        </div>
        <div className={"flex items-center gap-x-2"}>
          <div className={`bg-[#20e83e] w-[10px] h-[10px] rounded`}></div>
          <li className="list-none">SANTA VITÓRIA</li>
        </div>
        <div className={"flex items-center gap-x-2"}>
          <div className={`bg-[#fead61] w-[10px] h-[10px] rounded`}></div>
          <li className="list-none">UBERLÂNDIA</li>
        </div>
        <div className={"flex items-center gap-x-2"}>
          <div className={`bg-[#1cd9c9] w-[10px] h-[10px] rounded`}></div>
          <li className="list-none">IPIAÇU</li>
        </div>
        <div className={"flex items-center gap-x-2"}>
          <div className={`bg-[#b515e6] w-[10px] h-[10px] rounded`}></div>
          <li className="list-none">CAMPINA VERDE</li>
        </div>
        <div className={"flex items-center gap-x-2"}>
          <div className={`bg-[#ba0627] w-[10px] h-[10px] rounded`}></div>
          <li className="list-none">CAPINÓPOLIS</li>
        </div>
        <div className={"flex items-center gap-x-2"}>
          <div className={`bg-[#8c7103] w-[10px] h-[10px] rounded`}></div>
          <li className="list-none">GURINHATÃ</li>
        </div>
        <div className={"flex items-center gap-x-2"}>
          <div className={`bg-[#ab3580] w-[10px] h-[10px] rounded`}></div>
          <li className="list-none">OUTROS</li>
        </div>
      </div> */}
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
        events={events}
        editable={false}
        selectable
        defaultAllDay={true}
        handleWindowResize={true}
        height={650}
      />
    </div>
  );
};

export default Calendar;

export async function getServerSideProps({ query }) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const db = await connectToDataBase(process.env.DB_KEY);
  const collection = db.collection("dados");
  const { id } = query;

  var operation = await collection.findOne({ _id: ObjectId(id) });
  operation = {
    ...operation,
    title: operation.nome,
    start: operation.dataInicio,
    end: operation.dataConclusao
      ? dayjs(operation.dataConclusao).add(1, "days").format("YYYY-MM-DD")
      : dayjs(operation.previsaoConclusao).add(1, "days").format("YYYY-MM-DD"),
  };
  operation = JSON.parse(JSON.stringify(operation));
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
  };
}
