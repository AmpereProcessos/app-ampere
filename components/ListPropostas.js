import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import CardProposta from "./CardProposta";
function ListPropostas({ proposes, title, listId, fetchProposes }) {
  const [filteredPropostas, setFilteredPropostas] = useState(proposes);
  const [searchPropostas, setSearch] = useState("");
  async function handleDrop(proposeId, stageId) {
    try {
      let { data } = await axios.put("/api/o&m/updatePropose", {
        id: proposeId,
        changes: { estagio: stageId },
      });
      console.log("DATA", data);
      fetchProposes();
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }
  const [, dropRef] = useDrop({
    accept: "CARD",

    hover(item, monitor) {},
    drop(item, monitor) {
      handleDrop(item.id, listId);
    },
  });
  function handleSearchFilter(value) {
    setSearch(value);
    if (value != "" || value != " ") {
      let newArr = proposes.filter((propose) =>
        propose.clientName.toUpperCase().includes(value.toUpperCase())
      );
      console.log(newArr);
      setFilteredPropostas(newArr);
    } else {
      setFilteredPropostas(proposes);
    }
  }
  // function getListCumulativePrice() {
  //   var totalSum = 0;
  //   for (var i = 0; i < proposes.length; i++) {
  //     if (proposes[i]?.currentPlanOption == 0) {
  //       totalSum = totalSum;
  //     }
  //     if (proposes[i]?.currentPlanOption == 1) {
  //       totalSum =
  //         totalSum +
  //         (proposes[i].price * proposes[i].qtdeModulos +
  //           1.5 * 2 * proposes[i].distance);
  //     }
  //     if (proposes[i]?.currentPlanOption == 2) {
  //       totalSum =
  //         totalSum +
  //         (1.3 * proposes[i].price * proposes[i].qtdeModulos +
  //           1.5 * 2 * proposes[i].distance);
  //     }
  //     if (proposes[i]?.currentPlanOption == 3) {
  //       totalSum =
  //         totalSum +
  //         (1.95 * proposes[i].price * proposes[i].qtdeModulos +
  //           1.5 * 2 * proposes[i].distance);
  //     }
  //   }
  //   return totalSum.toFixed(2).replace(".", ",");
  // }
  function getListCumulativeModules() {
    var totalSum = 0;
    for (var i = 0; i < proposes.length; i++) {
      let n = Number(proposes[i].qtdeModulos);
      totalSum = totalSum + n;
    }
    return totalSum;
  }
  function getListCumulativePeakPot() {
    var totalSum = 0;
    for (var i = 0; i < proposes.length; i++) {
      let qty = Number(proposes[i].qtdeModulos);
      let pot = Number(proposes[i].potModulos);
      if (isNaN(proposes[i].potModulos || proposes[i].qtdeModulos)) {
        totalSum = totalSum;
      } else {
        totalSum = totalSum + pot * qty;
      }
    }
    return (totalSum / 1000).toFixed(2);
  }
  useEffect(() => {
    setFilteredPropostas(proposes);
  }, [proposes]);

  return (
    <div
      ref={dropRef}
      id={listId}
      className="flex flex-col min-w-[400px] w-[400px] max-h-[550px] py-2 items-center pt-2 px-1 grow bg-white h-full rounded border border-gray-200 shadow-lg"
    >
      <div className="border-b pb-2 h-fit w-full text-center border-blue-300 text-xl font-bold">
        <h1>{title}</h1>
        <div className="flex justify-center gap-x-2">
          {/* <p className="text-xs text-gray-500">R$ {getListCumulativePrice()}</p> */}
          <p className="text-xs text-gray-500">
            {getListCumulativeModules()} módulos
          </p>
          <p className="text-xs text-gray-500">
            {getListCumulativePeakPot()} kWp
          </p>
        </div>
        <input
          value={searchPropostas}
          onChange={(e) => handleSearchFilter(e.target.value)}
          className={
            "outline-none border border-gray-200 p-1 w-full mt-2 text-sm text-gray-600 text-center font-semibold"
          }
          placeholder={"Digite aqui o nome da proposta..."}
        />
      </div>
      <div className="flex flex-col overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2 py-2 w-full">
        {filteredPropostas &&
          filteredPropostas?.map((propose) => (
            <CardProposta
              fetchProposes={fetchProposes}
              key={propose._id}
              propose={propose}
            />
          ))}
      </div>
    </div>
  );
}

export default ListPropostas;
