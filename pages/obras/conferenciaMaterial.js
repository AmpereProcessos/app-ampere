import axios from "axios";
import React, { useEffect, useState } from "react";
import MaterialCard from "../../components/MaterialCard";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function ConferenciaMaterial() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  function getProjects() {
    axios.get("/api/gestaoDeObras/material").then((res) => {
      setProjects(res.data);
      setFilteredProjects(res.data);
    });
  }
  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("Obras") ||
      session?.user.accessibleRoutes.includes("Marketing") ||
      session?.user.accessibleRoutes.includes("Suprimentos")
    ) {
      getProjects(session.user);
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);

  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow bg-[#fff]">
        <div className="flex w-full items-center border-b border-gray-200 mb-2">
          <h1 className="text-[#fead61] font-bold text-xl pb-2">
            CONFERÊNCIA DE MATERIAL
          </h1>
        </div>
        <div className="flex gap-y-2 flex-col w-full flex-wrap">
          {filteredProjects.map((project) => (
            <MaterialCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    );
  }
}

export default ConferenciaMaterial;
