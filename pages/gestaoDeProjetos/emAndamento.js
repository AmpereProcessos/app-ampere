import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectList from "../../components/ProjectList";
import ProjectModal from "../../components/ProjectModal";
import connectToDatabase from "../../utils/projectsDb";
function InProgress({ setCredentials, credentials, assContrato, data }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalProject, setModalProject] = useState({
    estagio: "",
    projeto: {},
  });
  console.log(data);
  useEffect(() => {
    var storedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (storedCredentials) {
      setCredentials(storedCredentials);
    } else {
      if (!credentials.nome) {
        router.push("/auth/authHome");
      }
    }
  }, []);
  return (
    <>
      <div className="flex bg-gray-100 grow p-6 w-full">
        <ol className="border-l-2 border-[#15599a]">
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex text-white text-xxs items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                ASSINATURA DO CONTRATO
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6 flex flex-col gap-3">
              <p className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">
                15 projetos nesse estágio
              </p>
              <button
                type="button"
                className="w-fit px-4 py-1.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                COMPRA DO KIT
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6 flex flex-col gap-3">
              <p className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">
                15 projetos nesse estágio
              </p>
              <button
                type="button"
                className="w-fit px-4 py-1.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                ENTREGA DO KIT
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6 flex flex-col gap-3">
              <p className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">
                15 projetos nesse estágio
              </p>
              <button
                type="button"
                className="w-fit px-4 py-1.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                ASSINATURA DA DOCUMENTAÇÃO
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6 flex flex-col gap-3">
              <p className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">
                15 projetos nesse estágio
              </p>
              <button
                type="button"
                className="w-fit px-4 py-1.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                LIBERAÇÃO DA CONCESSIONÁRIA
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6 flex flex-col gap-3">
              <p className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">
                15 projetos nesse estágio
              </p>
              <button
                type="button"
                className="w-fit px-4 py-1.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                AGENDAMENTO DA OBRA
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6 flex flex-col gap-3">
              <p className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">
                15 projetos nesse estágio
              </p>
              <button
                type="button"
                className="w-fit px-4 py-1.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                TÉRMINO DA OBRA
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6 flex flex-col gap-3">
              <p className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">
                15 projetos nesse estágio
              </p>
              <button
                type="button"
                className="w-fit px-4 py-1.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                VISTORIA DA CONCESSIONÁRIA
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6 flex flex-col gap-3">
              <p className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">
                15 projetos nesse estágio
              </p>
              <button
                type="button"
                className="w-fit px-4 py-1.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                LIGAMENTO DA USINA
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6 flex flex-col gap-3">
              <p className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">
                15 projetos nesse estágio
              </p>
              <button
                type="button"
                className="w-fit px-4 py-1.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
          <li>
            <div className="flex flex-start items-center">
              <div className="bg-blue-600 w-4 h-4 flex items-center justify-center rounded-full -ml-2 mr-3 -mt-2"></div>
              <h4 className="text-gray-800 font-semibold text-xl -mt-2">
                ENTREGA TÉCNICA
              </h4>
            </div>
            <div className="ml-6 mb-6 pb-6 flex flex-col gap-3">
              <p className="text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">
                15 projetos nesse estágio
              </p>
              <button
                type="button"
                className="w-fit px-4 py-1.5 bg-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:font-bold"
              >
                Ver projetos
              </button>
            </div>
          </li>
        </ol>
        <div className="sticky top-[10%] left-[60%] h-[600px] w-[500px] bg-[#fff] rounded-sm border border-gray-200 shadow-lg p-3">
          <h1 className="font-bold text-center text-[#15599a] text-xl">
            PROJETOS
          </h1>
        </div>
        {modalIsOpen && (
          <ProjectModal
            closeModal={() => setModalIsOpen(false)}
            estagio={modalProject.estagio}
            project={modalProject.projeto}
          />
        )}
      </div>
    </>
  );
}

export default InProgress;
export async function getServerSideProps(context) {
  const db = await connectToDatabase(process.env.DB_KEY);
  const collection = db.collection("dados");
  let arr = await collection
    .aggregate([
      {
        $match: {
          "contrato.status": { $ne: "RECISÃO DE CONTRATO" },
        },
      },
      {
        $project: {
          qtde: 1,
          nomeDoContrato: 1,
          "contrato.status": 1,
          "compra.dataPedido": 1,
          "compra.statusLiberacao": 1,
          "compra.statusEntrega": 1,
          "projeto.dataAssDocumentacao": 1,
          "projeto.statusDoParecerDeAcesso": 1,
          "obra.statusDaObra": 1,
          vistoria: 1,
          "conferencias.usinaLigada": 1,
          "jornada.entregaTecnica": 1,
        },
      },
    ])
    .toArray();
  // let aguardandoPagamento = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         "compra.statusLiberacao": "AGUARDANDO PAGAMENTO",
  //       },
  //     },
  //   ])
  //   .toArray();
  // let suprimentos = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         "compra.statusEntrega": {
  //           $in: [
  //             "EM ROTA",
  //             "AGUARDANDO COMPRA",
  //             "",
  //             null,
  //             undefined,
  //             " ",
  //             "NÃO DEFINIDO",
  //           ],
  //         },
  //         "contrato.status": "ASSINADO",
  //       },
  //     },
  //   ])
  //   .toArray();
  // let projetos = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         "projeto.projetoConcluido": { $ne: "SIM" },
  //         $or: [
  //           { "compra.statusLiberacao": "PAGO" },
  //           { "projeto.iniciar": "SIM" },
  //         ],
  //       },
  //     },
  //   ])
  //   .toArray();
  // let obras = await collection
  //   .aggregate([
  //     {
  //       $match: {
  //         "obra.statusDaObra": {
  //           $in: [
  //             "AGENDADA",
  //             "AGUARDANDO AGENDAMENTO",
  //             "EM ANDAMENTO",
  //             "CASA EM CONSTRUÇÃO",
  //             null,
  //             undefined,
  //             "",
  //             " ",
  //             "NÃO DEFINIDO",
  //           ],
  //         },
  //         "contrato.status": "ASSINADO",
  //       },
  //     },
  //   ])
  //   .toArray();
  let assContrato = arr.filter(
    (x) =>
      x.contrato.status == "SOLICITADO" || x.contrato.status == "NÃO ASSINADO"
  );
  let compraDoKit = arr.filter(
    (x) => x.compra.statusLiberacao == "REALIZAR COMPRA"
  );
  let entregaDoKit = arr.filter((x) => x.compra?.statusEntrega == "EM ROTA");
  let assDocumentacoes = arr.filter(
    (x) =>
      x.statusDoParecerDeAcesso == "AGUARDANDO ASSINATURA" ||
      x.statusDoParecerDeAcesso == "AGUARDANDO FORMULÁRIOS"
  );
  let libConc = arr.filter((x) => x.parecer?.statusDoParecerDeAcesso == "PARE");
  let agendamentoObra = arr.filter((x) =>
    ["AGUARDANDO AGENDAMENTO", "CASA EM CONSTRUÇÃO"].includes(
      x.obra.statusDaObra
    )
  );
  let terminoObra = arr.filter((x) =>
    ["AGENDADA", "EM ANDAMENTO"].includes(x.obra.statusDaObra)
  );
  let vistoriaConcessionaria = arr.filter(
    (x) =>
      x.obra.statusDaObra == "CONCLUIDA" &&
      (x.vistoria.status == "AGUARDANDO CONCESSIONARIA" ||
        x.vistoria.status == "AGUARDANDO OBRA DE REDE")
  );
  let ligamentoUsina = arr.filter(
    (x) => x.conferencias?.usinaLigada.status == "NÃO REALIZADO"
  );
  let entregaTecnica = arr.filter((x) => x.jornada?.entregaTecnica != true);

  assContrato = JSON.parse(JSON.stringify(assContrato));
  compraDoKit = JSON.parse(JSON.stringify(compraDoKit));
  entregaDoKit = JSON.parse(JSON.stringify(entregaDoKit));
  assDocumentacoes = JSON.parse(JSON.stringify(assDocumentacoes));
  libConc = JSON.parse(JSON.stringify(libConc));
  agendamentoObra = JSON.parse(JSON.stringify(agendamentoObra));
  terminoObra = JSON.parse(JSON.stringify(terminoObra));
  vistoriaConcessionaria = JSON.parse(JSON.stringify(vistoriaConcessionaria));
  ligamentoUsina = JSON.parse(JSON.stringify(ligamentoUsina));
  entregaTecnica = JSON.parse(JSON.stringify(entregaTecnica));
  // comercial = JSON.parse(JSON.stringify(comercial));
  // suprimentos = JSON.parse(JSON.stringify(suprimentos));
  // aguardandoPagamento = JSON.parse(JSON.stringify(aguardandoPagamento));
  // projetos = JSON.parse(JSON.stringify(projetos));
  // obras = JSON.parse(JSON.stringify(obras));
  return {
    props: {
      data: {
        assContrato,
        compraDoKit,
        entregaDoKit,
        assDocumentacoes,
        libConc,
        agendamentoObra,
        terminoObra,
        vistoriaConcessionaria,
        ligamentoUsina,
        entregaTecnica,
      },
    }, // will be passed to the page component as props
  };
}
