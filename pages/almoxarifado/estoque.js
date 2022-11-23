import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ModalControlAlmoxarifado from "../../components/ModalControlAlmoxarifado";
function Estoque({ credentials, setCredentials }) {
  const [materiais, setMateriais] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMaterial, setModalMaterial] = useState({});
  function getMateriais() {
    axios
      .get("/api/almoxarifado/materiais")
      .then((res) => setMateriais(res.data));
  }
  const router = useRouter();
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
      if (!storedCredentials.accessibleRoutes.includes("Obras")) {
        router.push("/");
      } else {
        getMateriais();
      }
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      } else {
        if (!credentials.accessibleRoutes.includes("Obras")) {
          router.push("/");
        } else {
          getMateriais();
        }
      }
    }
  }, []);
  function handleUpdates(id) {
    getMateriais();
    let changedObj = materiais.filter((project) => project._id == id);
    setModalMaterial(changedObj[0]);
  }
  console.log(materiais);
  return (
    <div className="p-6 grow">
      <div className="border-b border-gray-200 pb-2">
        <h1 className="text-[#fead61] font-raleway font-bold text-xl">
          ESTOQUE
        </h1>
      </div>
      <div className="flex justify-around gap-3 mt-4 flex-wrap">
        {materiais.map((material) => (
          <div
            onClick={() => {
              setModalIsOpen(true);
              setModalMaterial(material);
            }}
            key={material._id}
            className="w-[250px] lg:w-[250px] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100"
          >
            <div className="flex items-center justify-center">
              <p className="text-xs text-gray-700 text-center">
                {material.nome}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-xs text-gray-700 text-center">
                {material.qtde}
              </p>
            </div>
          </div>
        ))}
      </div>
      {modalIsOpen && (
        <ModalControlAlmoxarifado
          credentials={credentials}
          setModalIsOpen={setModalIsOpen}
          info={modalMaterial}
          handleUpdates={handleUpdates}
        />
      )}
    </div>
  );
}

export default Estoque;
