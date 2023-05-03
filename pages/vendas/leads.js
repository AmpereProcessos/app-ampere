import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FetchDataButton from "../../components/utils/Buttons/FetchDataButton";
import { MdDateRange } from "react-icons/md";
import { BsDownload } from "react-icons/bs";
import dayjs from "dayjs";
import LeadCard from "../../components/LeadCard";
import ListLeads from "../../components/ListLeads";

var dateFilterParam = new Date();
dateFilterParam.setMonth(dateFilterParam.getMonth() - 6);
function SellerLeads() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [leads, setLeads] = useState();
  const [fetchDateFilter, setFetchDateFilter] = useState({
    after: new Date(dateFilterParam).toISOString(),
    before: new Date(dayjs().hour(22).$d).toISOString(),
  });

  async function getSellerLeads() {
    try {
      const { data } = await axios.post("/api/insideSales", {
        match: {
          vendedor: session?.user.vendedor,
          dataDeAquisicao: {
            $gte: new Date(fetchDateFilter.after).toISOString(),
            $lt: fetchDateFilter.before,
          },
        },
      });
      let obj = {
        inPresentation: data.filter(
          (p) => p.estagioFunil == 1 || !p.estagioFunil
        ),
        inFollowUp: data.filter((p) => p.estagioFunil == 2),
        closed: data.filter((p) => p.estagioFunil == 3),
      };
      setLeads(obj);
    } catch (error) {
      alert("Erro ao buscar leads.");
    }
  }
  useEffect(() => {
    if (session?.user?.visualizacao == "VENDEDOR") {
      if (!leads) {
        getSellerLeads();
      }
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  return (
    <div className="p-6 flex flex-col grow bg-[#fff]">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center justify-between w-full">
          <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
            MEUS LEADS
          </p>
          <div className="flex items-end gap-2">
            <div className="flex flex-col">
              <span className="font-['Roboto'] text-xs ">
                ADQUIRIDOS ENTRE:
              </span>
              <div className="flex items-center justify-center flex-wrap gap-2">
                <input
                  value={dayjs(fetchDateFilter.after)
                    .add(4, "hours")
                    .format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setFetchDateFilter({
                      ...fetchDateFilter,
                      after:
                        dayjs(e.target.value).$d != "Invalid Date"
                          ? new Date(e.target.value).toISOString()
                          : dateFilterParam,
                    })
                  }
                  type="date"
                  className="border border-gray-200 outline-none py-1 px-2"
                />
                <p>&</p>
                <input
                  value={dayjs(fetchDateFilter.before).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    setFetchDateFilter({
                      ...fetchDateFilter,
                      before:
                        dayjs(e.target.value).$d != "Invalid Date"
                          ? dayjs(e.target.value)
                              .add("20", "hour")
                              .toISOString()
                          : new Date().toISOString(),
                    })
                  }
                  type="date"
                  className="border border-gray-200 outline-none py-1 px-2"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <FetchDataButton
                text={"BUSCAR"}
                icon={<MdDateRange />}
                handleClick={getSellerLeads}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex py-2 gap-4 mt-5  shadow-lg w-full max-w-full overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
        <ListLeads
          title={"Em atendimento"}
          listId={1}
          fetchLeads={getSellerLeads}
          leads={leads?.inPresentation ? leads.inPresentation : []}
        />
        <ListLeads
          title={"Em acompanhamento"}
          listId={2}
          fetchLeads={getSellerLeads}
          leads={leads?.inFollowUp ? leads.inFollowUp : []}
        />
        <ListLeads
          title={"Venda fechada"}
          listId={3}
          fetchLeads={getSellerLeads}
          leads={leads?.closed ? leads.closed : []}
        />
      </div>
    </div>
  );
}

export default SellerLeads;
