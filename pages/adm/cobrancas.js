import axios from "axios";
import React, { useEffect, useState } from "react";
import OSCard from "../../components/OSCard";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
function Cobrancas({ credentials, setCredentials }) {
  const [oss, setOss] = useState([]);
  const [filteredOSS, setFilteredOSS] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    after: null,
    before: null,
  });
  const router = useRouter();
  function getOSsToReceive() {
    axios.get("/api/ordensDeServico/realizarCobranca").then((res) => {
      setFilteredOSS(res.data);
      setOss(res.data);
    });
  }
  function filterOSS() {
    var newArr;
    if (dateFilter.after != null && dateFilter.before != null) {
      if (!newArr) newArr = oss;
      newArr = newArr.filter((project) =>
        project.ordensDeServico.some(
          (os) =>
            os.dataDeFechamento >= dateFilter.after &&
            os.dataDeFechamento <= dateFilter.before
        )
      );
    }
    if (!newArr) setFilteredOSS(oss);
    else {
      setFilteredOSS(newArr);
    }
  }
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (storedCredentials.accessibleRoutes.includes("ADM")) {
        getOSsToReceive();
      } else {
        router.push("/");
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (credentials.accessibleRoutes.includes("ADM")) {
          getOSsToReceive();
        } else {
          router.push("/");
        }
      }
    }
  }, []);
  console.log(oss);
  return (
    <div className="p-6 grow">
      <div className="flex justify-around flex-wrap items-center">
        <h1 className="col-span-2 font-bold text-lg text-[#fead61]">
          COBRANÇAS DE ORDENS DE SERVIÇO
        </h1>
        <div className="col-span-4 flex flex-wrap items-center justify-center gap-x-4">
          <div className="flex gap-x-2">
            <div className="flex flex-col w-fit items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                Fechamento Depois de:
              </span>
              <input
                className="text-xs w-full text-center uppercase text-gray-600 outline-none"
                type="date"
                value={
                  dateFilter.after &&
                  new Date(dateFilter.after).toISOString().slice(0, 10)
                }
                onChange={(e) =>
                  setDateFilter({
                    ...dateFilter,
                    after: isNaN(e.target.value)
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
              />
            </div>
            <div className="flex flex-col w-fit items-center">
              <span className="uppercase font-bold font-raleway text-center text-sm">
                Fechamento Antes de:
              </span>
              <input
                className="text-xs w-full text-center uppercase text-gray-600 outline-none"
                type="date"
                value={
                  dateFilter.before &&
                  new Date(dateFilter.before).toISOString().slice(0, 10)
                }
                onChange={(e) =>
                  setDateFilter({
                    ...dateFilter,
                    before: isNaN(e.target.value)
                      ? new Date(e.target.value).toISOString()
                      : null,
                  })
                }
              />
            </div>
          </div>
          <button
            onClick={filterOSS}
            className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
          >
            <p>Filtrar</p>
            <AiOutlineSearch />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 mt-3 px-4">
        {filteredOSS.map((os) => {
          if (os.ordensDeServico.some((os) => os.cobrancaRealizada == false)) {
            return <OSCard reload={getOSsToReceive} key={os._id} info={os} />;
          }
        })}
      </div>
    </div>
  );
}

export default Cobrancas;
