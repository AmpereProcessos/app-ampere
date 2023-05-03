import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FetchDataButton from "../../components/utils/Buttons/FetchDataButton";
import { MdDateRange } from "react-icons/md";
import { BsDownload } from "react-icons/bs";
import dayjs from "dayjs";
import LeadCard from "../../components/LeadCard";

var dateFilterParam = new Date();
dateFilterParam.setMonth(dateFilterParam.getMonth() - 3);
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

      setLeads(data);
    } catch (error) {
      alert("Erro ao buscar leads.");
    }
  }
  useEffect(() => {
    if (!leads) {
      getSellerLeads();
    }
  }, [session]);
  console.log(leads);
  return (
    <div className="p-6 flex flex-col grow bg-[#fff]">
      <div className="flex flex-col items-center justify-between border-b border-gray-200 p-1">
        <div className="flex items-center justify-between w-full">
          <p className="font-bold uppercase text-center text-2xl text-[#15599a]">
            MEUS LEADS
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-['Roboto'] text-xs h-[38px]">
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
                      ? dayjs(e.target.value).add("20", "hour").toISOString()
                      : new Date().toISOString(),
                })
              }
              type="date"
              className="border border-gray-200 outline-none py-1 px-2"
            />
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
      <div className="flex flex-wrap justify-around mt-4 gap-3">
        {leads?.map((lead) => (
          <LeadCard key={lead._id} lead={lead} getLeads={getSellerLeads} />
        ))}
      </div>
    </div>
  );
}

export default SellerLeads;
