import React from "react";
import Link from "next/link";
import Header from "../components/Header";
import { AiFillHome } from "react-icons/ai";

const routes = [
  {
    title: "Projetos",
    url: "projetos",
  },
  {
    title: "Obras",
    url: "obras",
  },
  {
    title: "Suprimentos",
    url: "suprimentos",
  },
  {
    title: "O&M",
    url: "o&m",
  },
  {
    title: "Marketing",
    url: "marketing",
  },
  {
    title: "Vendas",
    url: "vendas",
  },
  {
    title: "Pós-Venda",
    url: "pos-venda",
  },
  {
    title: "PPS",
    url: "pps",
  },
  {
    title: "InsideSales",
    url: "insidesales",
  },
  {
    title: "Financeiro",
    url: "financeiro",
  },
  {
    title: "ADM",
    url: "adm",
  },
  {
    title: "RH",
    url: "rh",
  },
];

function Home() {
  return (
    <div className="bg-[#1D7ED7] flex flex-col w-screen max-w-full xl:min-h-[100vh] min-h-[100vh]">
      <Header
        title={"Home"}
        color="#073b4c"
        icon={<AiFillHome style={{ color: "white", fontSize: "25px" }} />}
        url={"/"}
      />
      <div className="flex gap-4 justify-around mt-24 flex-wrap px-12">
        {routes.map((route) => (
          <Link key={route.url} href={`/${route.url}`}>
            <div className="h-[200px] shadow-md cursor-pointer flex items-center justify-center bg-white w-[200px] rounded">
              <p className="text-lg text-gray-600 font-bold uppercase">
                {route.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
