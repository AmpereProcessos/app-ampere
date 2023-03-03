import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalFormSolicitacao from "../../components/ModalFormSolicitacao";
import TagTipoDeServico from "../../components/TagTipoDeServico";
import { useRouter } from "next/router";
import Select from "react-select";
import { tiposDeServico, vendedores } from "../../utils/constants";
import { BsPatchCheckFill } from "react-icons/bs";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/utils/LoadingPage";
function FormulariosSolicitacao() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [filteredSolicitacoes, setFilteredSolicitacoes] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalSolicitacao, setModalSolicitacao] = useState({});

  const [filters, setFilters] = useState({
    nomeDoContratoFilter: "",
    pendenteFilter: false,
    confeccaoFilter: false,
    vendedorFilter: [],
    tipoDeServicoFilter: [],
  });

  function getFormularios() {
    axios.get("/api/solicitacoes/contrato").then((res) => {
      setSolicitacoes(res.data);
      setFilteredSolicitacoes(res.data);
    });
  }
  function handleFilter() {
    var newArr;
    if (filters.pendenteFilter) {
      if (!newArr) newArr = solicitacoes;
      newArr = newArr.filter(
        (solicitacao) => solicitacao.aprovacao == undefined
      );
    }
    if (filters.confeccaoFilter) {
      if (!newArr) newArr = solicitacoes;
      newArr = newArr.filter(
        (solicitacao) =>
          solicitacao.aprovacao == true && !solicitacao.confeccionado
      );
    }
    if (filters.vendedorFilter.length > 0) {
      if (!newArr) newArr = solicitacoes;
      newArr = newArr.filter((solicitacao) =>
        filters.vendedorFilter.includes(solicitacao.nomeVendedor)
      );
    }
    if (filters.tipoDeServicoFilter.length > 0) {
      if (!newArr) newArr = solicitacoes;
      newArr = newArr.filter((solicitacao) =>
        filters.tipoDeServicoFilter.includes(solicitacao.tipoDeServico)
      );
    }
    if (filters.nomeDoContratoFilter.trim().length > 0) {
      if (!newArr) newArr = solicitacoes;
      newArr = newArr.filter((solicitacao) =>
        solicitacao.nomeDoContrato
          .toUpperCase()
          .includes(filters.nomeDoContratoFilter.toUpperCase())
      );
    }
    if (!newArr) setFilteredSolicitacoes(solicitacoes);
    else {
      setFilteredSolicitacoes(newArr);
    }
  }
  function handleOpenModal(id) {
    axios.get(`/api/solicitacoes/getContrato/${id}`).then((res) => {
      setModalSolicitacao(res.data[0]);
      setModalIsOpen(true);
    });
  }
  function getCardColor(statusAprovacao) {
    if (statusAprovacao == true) {
      return "bg-green-100";
    } else if (statusAprovacao == false) {
      return "bg-red-100";
    } else {
      return "bg-[#fff]";
    }
  }
  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("PPS") ||
      session?.user.accessibleRoutes.includes("ADM")
    ) {
      getFormularios();
    } else {
      if (session?.user) return router.push("/");
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow flex flex-col">
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold uppercase text-2xl text-[#15599a] font-raleway">
            FORMULÁRIOS DE CONTRATO ({filteredSolicitacoes.length})
          </p>
          <div className="flex flex-wrap justify-between gap-2">
            <input
              value={filters.nomeDoContratoFilter}
              onChange={(e) =>
                setFilters({ ...filters, nomeDoContratoFilter: e.target.value })
              }
              placeholder="NOME DO CONTRATO..."
              className="outline-none border border-gray-200 p-2 text-sm h-[36px]"
            />
            <Select
              placeholder="VENDEDOR"
              isMulti={true}
              options={vendedores.map((vendedor) => {
                return { label: vendedor.nome, value: vendedor.nome };
              })}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  vendedorFilter: e.map((x) => x.value),
                })
              }
            />
            <Select
              placeholder="TIPO DE SERVIÇO"
              isMulti={true}
              options={tiposDeServico.map((tipoDeServico) => {
                return {
                  label: tipoDeServico.label,
                  value: tipoDeServico.value,
                };
              })}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tipoDeServicoFilter: e.map((x) => x.value),
                })
              }
            />
            <div
              onClick={() =>
                setFilters({
                  ...filters,
                  pendenteFilter: !filters.pendenteFilter,
                })
              }
              className={`${
                filters.pendenteFilter ? "bg-[#15599a]" : "bg-blue-300"
              } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
            >
              APROVAÇÃO PENDENTE
            </div>
            <div
              onClick={() =>
                setFilters({
                  ...filters,
                  confeccaoFilter: !filters.confeccaoFilter,
                })
              }
              className={`${
                filters.confeccaoFilter ? "bg-[#15599a]" : "bg-blue-300"
              } rounded h-[36px] flex justify-center cursor-pointer items-center font-bold px-2 text-white`}
            >
              PARA CONFECCIONAR
            </div>
            <button
              onClick={handleFilter}
              className="bg-[#fead61] h-[36px] hover:bg-[#15599a] hover:text-white font-bold p-2 rounded"
            >
              FILTRAR
            </button>
          </div>
        </div>
        <div className="flex  justify-around gap-3 mt-4 flex-wrap">
          {filteredSolicitacoes.map((solicitacao) => (
            <div
              key={solicitacao._id}
              onClick={() => {
                handleOpenModal(solicitacao._id);
              }}
              className={`flex flex-col ${getCardColor(
                solicitacao.aprovacao
              )} w-[250px] lg:w-[450px] cursor-pointer border border-gray-200 hover:bg-blue-100`}
            >
              <TagTipoDeServico tipoDeServico={solicitacao.tipoDeServico} />
              <div className="flex flex-col p-2">
                <div className="flex justify-between">
                  <h1 className="text-xs text-[#15599a] font-bold">
                    {solicitacao.nomeDoContrato}
                  </h1>
                  {solicitacao.confeccionado && (
                    <BsPatchCheckFill
                      style={{
                        fontSize: "20px",
                        color: "rgb(21 128 61)",
                        marginLeft: "10px",
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xxs">VENDEDOR</span>
                    <p className="text-xs text-gray-600">
                      {solicitacao.nomeVendedor && solicitacao.nomeVendedor}
                    </p>
                  </div>
                  <div>
                    <span className="text-xxs">CIDADE</span>
                    <p className="text-xs text-gray-600">
                      {solicitacao.cidade ? solicitacao.cidade : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {modalIsOpen && (
          <ModalFormSolicitacao
            editor={
              session?.user.accessibleRoutes.includes("PPS") ? true : false
            }
            financeiroEditor={
              session?.user.accessibleRoutes.includes("ADM") ? true : false
            }
            solicitacao={modalSolicitacao}
            setModalIsOpen={setModalIsOpen}
            getFormularios={getFormularios}
          />
        )}
      </div>
    );
  }
}

export default FormulariosSolicitacao;
