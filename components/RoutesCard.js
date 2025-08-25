import React from 'react'
import { TiDelete } from 'react-icons/ti'
function RoutesCard({ routes, changeRoutes, icon }) {
  return (
    <>
      {routes?.map((route, index) => (
        <div key={route} className="bg-background flex items-center gap-x-2 rounded-lg p-2 font-bold text-[#15599a] uppercase">
          {route}
          <button onClick={() => changeRoutes(index, route)}>{icon}</button>
        </div>
      ))}
    </>
  )
}

export default RoutesCard
