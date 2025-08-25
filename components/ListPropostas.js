import React, { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import axios from 'axios'
import CardProposta from './CardProposta'
function ListPropostas({ proposes, title, listId, fetchProposes }) {
  const [filteredPropostas, setFilteredPropostas] = useState(proposes)
  const [searchPropostas, setSearch] = useState('')
  async function handleDrop(proposeId, stageId) {
    try {
      let { data } = await axios.put('/api/o&m/updatePropose', {
        id: proposeId,
        changes: { estagio: stageId },
      })
      console.log('DATA', data)
      fetchProposes()
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }
  const [, dropRef] = useDrop({
    accept: 'CARD',

    hover(item, monitor) {},
    drop(item, monitor) {
      handleDrop(item.id, listId)
    },
  })
  function handleSearchFilter(value) {
    setSearch(value)
    if (value != '' || value != ' ') {
      let newArr = proposes.filter((propose) => propose.nomeCliente.toUpperCase().includes(value.toUpperCase()))
      console.log(newArr)
      setFilteredPropostas(newArr)
    } else {
      setFilteredPropostas(proposes)
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
    var totalSum = 0
    for (var i = 0; i < proposes.length; i++) {
      let n = Number(proposes[i].qtdeModulos)
      totalSum = totalSum + n
    }
    return totalSum
  }
  function getListCumulativePeakPot() {
    var totalSum = 0
    for (var i = 0; i < proposes.length; i++) {
      let qty = Number(proposes[i].qtdeModulos)
      let pot = Number(proposes[i].potModulos)
      if (isNaN(proposes[i].potModulos || proposes[i].qtdeModulos)) {
        totalSum = totalSum
      } else {
        totalSum = totalSum + pot * qty
      }
    }
    return (totalSum / 1000).toFixed(2)
  }
  useEffect(() => {
    setFilteredPropostas(proposes)
  }, [proposes])

  return (
    <div
      ref={dropRef}
      id={listId}
      className="bg-background border-primary/20 flex h-full max-h-[550px] w-[400px] min-w-[400px] grow flex-col items-center rounded border px-1 py-2 pt-2 shadow-lg"
    >
      <div className="h-fit w-full border-b border-blue-300 pb-2 text-center text-xl font-bold">
        <h1>{title}</h1>
        <div className="flex justify-center gap-x-2">
          <p className="text-primary/60 text-xs">{filteredPropostas.length} proposta(s)</p>
          <p className="text-primary/60 text-xs">{getListCumulativeModules()} módulos</p>
          <p className="text-primary/60 text-xs">{getListCumulativePeakPot()} kWp</p>
        </div>
        <input
          value={searchPropostas}
          onChange={(e) => handleSearchFilter(e.target.value)}
          className={'text-primary/80 border-primary/20 mt-2 w-full border p-1 text-center text-sm font-semibold outline-hidden'}
          placeholder={'Digite aqui o nome da proposta...'}
        />
      </div>
      <div className="overscroll-y scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-primary/20 flex w-full flex-col overflow-y-auto px-2 py-2">
        {filteredPropostas && filteredPropostas?.map((propose) => <CardProposta fetchProposes={fetchProposes} key={propose._id} propose={propose} />)}
      </div>
    </div>
  )
}

export default ListPropostas
