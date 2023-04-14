import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import ModalControlAlmoxarifado from "../../components/ModalControlAlmoxarifado";
import ModalNovoItemAlmoxarifado from "../../components/ModalNovoItemAlmoxarifado";
import { AiOutlineSearch } from "react-icons/ai";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
import Link from "next/link";
import FilterButton from "../../components/utils/Buttons/FilterButton";
function Estoque() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [materiais, setMateriais] = useState();
  const [materiaisFiltrados, setMateriaisFiltrados] = useState();
  const [modalAberta, setModalAberta] = useState(false);
  const [modalNovoItem, setModalNovoItem] = useState(false);
  const [modalMaterial, setModalMaterial] = useState({});
  const [filtros, setFiltros] = useState({
    filtroPesquisa: "",
    filtroQtde: null,
  });
  function getMateriais() {
    axios.get("/api/almoxarifado/materiais").then((res) => {
      setMateriaisFiltrados(res.data);
      setMateriais(res.data);
    });
  }
  function handleFilters() {
    var newArr;
    if (filtros.filtroPesquisa.trim().length > 0) {
      if (!newArr) newArr = materiais;
      console.log(filtros.filtroPesquisa.length);
      newArr = newArr.filter((material) =>
        material.nome
          .toUpperCase()
          .includes(filtros.filtroPesquisa.toUpperCase())
      );
    }
    if (filtros.filtroQtde && filtros.filtroQtde >= 0) {
      if (!newArr) newArr = materiais;
      newArr = newArr.filter(
        (material) => material.qtde < Number(filtros.filtroQtde)
      );
    }
    console.log(newArr);
    if (!newArr) {
      setMateriaisFiltrados(materiais);
      return materiais;
    } else {
      setMateriaisFiltrados(newArr);
      return newArr;
    }
  }
  function handleSearchFilter(value) {
    setFiltros((prev) => ({ ...prev, filtroPesquisa: value }));
    var filtered = handleFilters();
    if (value.trim().length > 0) {
      let newArr = filtered.filter((item) =>
        item.nome.toUpperCase().includes(value.toUpperCase())
      );
      setMateriaisFiltrados(newArr);
    } else {
      setMateriaisFiltrados(materiais);
    }
  }
  function handleUpdates(id) {
    getMateriais();
    let changedObj = materiais.filter((project) => project._id == id);
    setModalMaterial(changedObj[0]);
  }
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleFilters();
    }
  }
  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("Obras") ||
      session?.user.accessibleRoutes.includes("Almoxarifado")
    ) {
      if (!materiais) getMateriais();
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  console.log(materiais);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow flex flex-col">
        <div className="flex flex-col items-center border-b border-gray-200 pb-2">
          <h1 className="text-[#fead61] font-raleway font-bold text-xl">
            ESTOQUE ({materiaisFiltrados?.length})
          </h1>
          <div className="flex justify-center gap-2 flex-wrap">
            <Link href="/almoxarifado/pdfRelatorioEstoque">
              <button className="p-2 rounded border border-[#fead61] text-[#fead61] font-medium">
                RELATÓRIO
              </button>
            </Link>
            <input
              type={"text"}
              placeholder="Digite o nome do produto..."
              value={filtros.filtroPesquisa}
              className={
                "outline-none p-1.5 rounded border border-gray-200 placeholder:italic min-w-[250px]"
              }
              onChange={(e) => handleSearchFilter(e.target.value)}
            />
            <input
              type={"number"}
              placeholder="Quantidade abaixo de:"
              value={filtros.filtroQtde ? filtros.filtroQtde.toString() : null}
              className={
                "outline-none p-1.5 rounded border border-gray-200 placeholder:italic min-w-[190px]"
              }
              onChange={(e) =>
                setFiltros({ ...filtros, filtroQtde: Number(e.target.value) })
              }
            />
            <FilterButton
              text={"FILTRAR"}
              icon={<AiOutlineSearch />}
              handleClick={() => handleFilters()}
            />
            {/* <button
              onClick={handleFilters}
              className="flex bg-[#fead61] hover:text-white hover:bg-[#15599a] font-bold rounded py-2 px-2 items-center gap-x-2"
            >
              <p>Filtrar</p>
              <AiOutlineSearch />
            </button> */}
          </div>
        </div>
        <div className="flex justify-around gap-3 mt-4 flex-wrap w-full grow">
          {materiaisFiltrados ? (
            materiaisFiltrados.map((material) => (
              <div
                onClick={() => {
                  setModalAberta(true);
                  setModalMaterial(material);
                }}
                key={material._id}
                className="w-[250px] max-h-[80px] lg:w-[250px] hover:bg-blue-100 bg-[#fff] cursor-pointer border border-gray-200 p-3 hover:bg-blue-100flex flex-col"
              >
                <div className="flex items-center justify-center">
                  <p className="text-xs text-gray-700 text-center">
                    {material.nome}
                  </p>
                </div>
                <div className="flex items-center justify-around mt-2">
                  <p className="text-xs text-gray-700 text-center">
                    {material.qtde}
                  </p>
                  <p className="text-xs text-gray-700 text-center">
                    {material.preco
                      ? `R$${material.preco.toFixed(2).replace(".", ",")}`
                      : "-"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <LoadingPage />
          )}
        </div>
        <div
          onClick={() => setModalNovoItem(true)}
          className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
        >
          <p className="uppercase font-bold text-sm">NOVO ITEM</p>
        </div>
        {modalAberta && (
          <ModalControlAlmoxarifado
            credentials={session?.user}
            setModalAberta={setModalAberta}
            info={modalMaterial}
            handleUpdates={handleUpdates}
          />
        )}
        {modalNovoItem && (
          <ModalNovoItemAlmoxarifado setModalAberta={setModalNovoItem} />
        )}
      </div>
    );
  }
}

export default Estoque;
