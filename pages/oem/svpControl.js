import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import LoadingPage from "../../components/utils/LoadingPage";

function SvpControl() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [projects, setProjects] = useState([]);
  function getProjects() {
    axios.get("/api/o&m/svpControl").then((res) => {
      console.log(res.data);
      setProjects(res.data);
    });
  }
  useEffect(() => {
    if (session?.user.accessibleRoutes.includes("O&M")) {
      getProjects();
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow">
        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
              CLIENTES SVP
            </p>
          </div>
          <div className="flex flex-col gap-y-2">
            {projects?.map((project) => (
              <div
                key={project._id}
                className="flex justify-between w-full p-2 border border-gray-200 shadow-lg"
              >
                <h1 className="text-[#15599a] font-bold">
                  ({project.qtde}) {project.nomeDoContrato}
                </h1>
                <h1>{project.email}</h1>
                <h1>{project.telefone}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default SvpControl;
