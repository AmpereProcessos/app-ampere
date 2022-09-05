import React from "react";
import { TiDelete } from "react-icons/ti";
function RoutesCard({ routes, changeRoutes, icon }) {
  return (
    <>
      {routes?.map((route, index) => (
        <div
          key={route}
          className="flex items-center gap-x-2 bg-white rounded-lg text-[#15599a] font-bold uppercase p-2"
        >
          {route}
          <button onClick={() => changeRoutes(index, route)}>{icon}</button>
        </div>
      ))}
    </>
  );
}

export default RoutesCard;
