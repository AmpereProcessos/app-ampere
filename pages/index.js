import React from "react";
import Link from "next/link";
import Header from "../components/Header";
import { AiFillHome } from "react-icons/ai";

import { routes } from "../utils/constants";
console.log(routes);
function Home() {
  return (
    <div className="bg-[#1D7ED7] flex flex-col w-screen max-w-full xl:min-h-[100vh] min-h-[100vh]">
      <Header
        title={"Home"}
        color="#073b4c"
        icon={<AiFillHome style={{ color: "white", fontSize: "25px" }} />}
      />
      <div className="flex gap-4 justify-around mt-24 flex-wrap px-12">
        {routes.map((route) => (
          <Link href={`/${route.toLowerCase()}`}>
            <div className="h-[200px] shadow-md cursor-pointer flex items-center justify-center bg-white w-[200px] rounded">
              <p className="text-lg text-gray-600 font-bold uppercase">
                {route}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
