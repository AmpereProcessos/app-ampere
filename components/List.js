import React from 'react'
import Card from './Card'
import { useDrop } from 'react-dnd'
import axios from 'axios'
function List({ proposes, title, listId, fetchProposes }) {
  function handleDrop(proposeId, stageId) {
    axios
      .put('/api/o&m/updatePropose', {
        id: proposeId,
        listId: stageId,
      })
      .then((res) => fetchProposes())
  }
  const [, dropRef] = useDrop({
    accept: 'CARD',

    hover(item, monitor) {},
    drop(item, monitor) {
      handleDrop(item.id, listId)
    },
  })
  function getListCumulativePrice() {
    var totalSum = 0
    for (var i = 0; i < proposes.length; i++) {
      if (proposes[i]?.currentPlanOption == 0) {
        totalSum = totalSum
      }
      if (proposes[i]?.currentPlanOption == 1) {
        totalSum = totalSum + (proposes[i].price * proposes[i].modulesQty + 1.5 * 2 * proposes[i].distance)
      }
      if (proposes[i]?.currentPlanOption == 2) {
        totalSum = totalSum + (1.3 * proposes[i].price * proposes[i].modulesQty + 1.5 * 2 * proposes[i].distance)
      }
      if (proposes[i]?.currentPlanOption == 3) {
        totalSum = totalSum + (1.95 * proposes[i].price * proposes[i].modulesQty + 1.5 * 2 * proposes[i].distance)
      }
    }
    return totalSum.toFixed(2).replace('.', ',')
  }
  function getListCumulativeModules() {
    var totalSum = 0
    for (var i = 0; i < proposes.length; i++) {
      let n = Number(proposes[i].modulesQty)
      totalSum = totalSum + n
    }
    return totalSum
  }
  function getListCumulativePeakPot() {
    var totalSum = 0
    for (var i = 0; i < proposes.length; i++) {
      let qty = Number(proposes[i].modulesQty)
      let pot = Number(proposes[i].modulesPot)
      if (isNaN(proposes[i].modulesPot || proposes[i].modulesQty)) {
        totalSum = totalSum
      } else {
        totalSum = totalSum + pot * qty
      }
    }
    return (totalSum / 1000).toFixed(2)
  }
  return (
    <div
      ref={dropRef}
      id={listId}
      className="bg-background flex h-full max-h-[150px] grow flex-col items-center overflow-y-auto overscroll-y-auto rounded px-1 py-2 pt-2 shadow-2xl lg:max-h-[550px]"
    >
      <div className="h-fit w-full border-b border-blue-300 pb-2 text-center text-xl font-bold">
        <h1>{title}</h1>
        <div className="flex justify-center gap-x-2">
          <p className="text-primary/60 text-xs">R$ {getListCumulativePrice()}</p>
          <p className="text-primary/60 text-xs">{getListCumulativeModules()} módulos</p>
          <p className="text-primary/60 text-xs">{getListCumulativePeakPot()} kWp</p>
        </div>
      </div>
      {proposes?.map((propose) => (
        <Card fetchProposes={fetchProposes} key={propose._id} propose={propose} />
      ))}
    </div>
  )
}

export default List
