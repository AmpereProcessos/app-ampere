import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import CotacaoCard from "../../components/CotacaoCard";
import ModalNovaCotacao from "../../components/ModalNovaCotacao";
import LoadingPage from "../../components/utils/LoadingPage";
import { AppContext } from "../../context/AppContext";
import xlsx from "json-as-xlsx";
function Cotacoes() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/authHome");
    },
  });

  const [quotations, setQuotations] = useState();
  const [newQuotationModalOpen, setNewQuotationModalOpen] = useState(false);
  function convertToXLSX() {
    let contentArr = quotations.map((quotation) => {
      return {
        fornecedor: quotation.fornecedor,
        codigo: (Math.random() * 100000000).toFixed(0),
        nomeDoKit: quotation.nomeDoKit,
        valorDoKit: quotation.valorDoKit,
        habilitado: quotation.habilitado ? 1 : 0,
        carport: quotation.carport ? 1 : 0,
        ceramico: quotation.ceramico ? 1 : 0,
        fibrocimento: quotation.fibrocimento ? 1 : 0,
        laje: quotation.laje ? 1 : 0,
        shingle: quotation.shingle ? 1 : 0,
        metalico: quotation.metalico ? 1 : 0,
        zipado: quotation.zipado ? 1 : 0,
        solo: quotation.solo ? 1 : 0,
        semEstrutura: quotation.inclusoEstrutura ? 0 : 1,
        inclusoEstrutura: quotation.inclusoEstrutura ? 1 : 0,
        inclusoTransformador: quotation.inclusoTransformador ? 1 : 0,
        moduloFabricante: quotation.marcaModulo,
        moduloModelo: quotation.modeloModulo,
        moduloQtde: quotation.qtdeModulo,
        marcaInversor1: quotation.inversores[0].marca,
        modeloInversor1: quotation.inversores[0].modelo,
        qtdeInversor1: quotation.inversores[0].qtde,
        marcaInversor2: quotation.inversores[1]
          ? quotation.inversores[1].marca
          : "",
        modeloInversor2: quotation.inversores[1]
          ? quotation.inversores[1].modelo
          : "",
        qtdeInversor2: quotation.inversores[1]
          ? quotation.inversores[1].qtde
          : "",
        marcaInversor3: quotation.inversores[2]
          ? quotation.inversores[2].marca
          : "",
        modeloInversor3: quotation.inversores[2]
          ? quotation.inversores[2].modelo
          : "",
        qtdeInversor3: quotation.inversores[2]
          ? quotation.inversores[2].qtde
          : "",
        marcaOtimizador: "",
        modeloOtimizador: "",
        qtdeOtimizador: "",
        topologia: quotation.topologia,
        excluir: 0,
        potenciaModulo: quotation.potenciaModulo,
        potenciaInversor1: quotation.inversores[0].potencia,
        qtdeFasesInversor1: quotation.inversores[0].qtdeFases,
        tensaoSaidaInversor1: quotation.inversores[0].tensaoSaida,
      };
    });
    let convertData = [
      {
        sheet: "Planilha 1",
        columns: [
          { label: "Fornecedor", value: "fornecedor" },
          { label: "Código", value: "codigo" },
          { label: "Nome", value: "nomeDoKit" },
          { label: "Custo (R$)", value: "valorDoKit" },
          { label: "Habilitado?", value: "habilitado" },
          { label: "Carport?", value: "carport" },
          { label: "Cerâmico?", value: "ceramico" },
          { label: "Fibrocimento?", value: "fibrocimento" },
          { label: "Laje?", value: "laje" },
          { label: "Shingle?", value: "shingle" },
          { label: "Metálico?", value: "metalico" },
          { label: "Zipado?", value: "zipado" },
          { label: "Solo?", value: "solo" },
          { label: "Sem estrutura?", value: "semEstrutura" },
          { label: "Inclui estrutura?", value: "inclusoEstrutura" },
          { label: "Inclui transformador?", value: "inclusoTransformador" },
          { label: "Módulo fabricante", value: "moduloFabricante" },
          { label: "Módulo modelo", value: "moduloModelo" },
          { label: "Módulo qtd", value: "moduloQtde" },
          { label: "Inversor 1 fabricante", value: "marcaInversor1" },
          { label: "Inversor 1 modelo", value: "modeloInversor1" },
          { label: "Inversor 1 qtd", value: "qtdeInversor1" },
          { label: "Inversor 2 fabricante", value: "marcaInversor2" },
          { label: "Inversor 2 modelo", value: "modeloInversor2" },
          { label: "Inversor 2 qtd", value: "qtdeInversor2" },
          { label: "Inversor 3 fabricante", value: "marcaInversor3" },
          { label: "Inversor 3 modelo", value: "modeloInversor3" },
          { label: "Inversor 3 qtd", value: "qtdeInversor3" },
          { label: "Otimizador fabricante", value: "marcaOtimizador" },
          { label: "Otimizador modelo", value: "modeloOtimizador" },
          { label: "Otimizador qtd", value: "qtdeOtimizador" },
          { label: "Topologia", value: "topologia" },
          { label: "excluir?", value: "excluir" },
          { label: "Módulo potência (W)", value: "potenciaModulo" },
          { label: "Inversor 1 potência (W)", value: "potenciaInversor1" },
          { label: "Inversor 1 qtd fases", value: "qtdeFasesInversor1" },
          {
            label: "Inversor 1 tensão saída (Linha)",
            value: "tensaoSaidaInversor1",
          },
        ],
        content: contentArr,
      },
    ];
    let settings = {
      fileName: "MySpreadsheet", // Name of the resulting spreadsheet
      extraLength: 3, // A bigger number means that columns will be wider
      writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
      writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
      RTL: true, // Display the columns from right-to-left (the default value is false)
    };
    xlsx(convertData, session);
  }
  async function getQuotations() {
    let response = await axios.get("/api/projects/cotacoes");
    console.log(response);
    setQuotations(response.data);
    // if (response.statusText == "OK") {
    //   setQuotations(response.data);
    // } else {
    //   alert("Houve um erro na conexão com o servidor.");
    // }
  }
  useEffect(() => {
    if (
      session?.user.accessibleRoutes.includes("Suprimentos") ||
      session?.user.accessibleRoutes.includes("Comercial")
    ) {
      getQuotations();
    } else {
      if (session?.user) {
        router.push("/");
      }
    }
  }, [session]);
  if (status == "loading") return <LoadingPage />;
  if (status == "authenticated") {
    return (
      <div className="p-6 grow flex flex-col">
        <div className="flex items-center pb-2 border-b border-gray-200">
          <h1 className="font-['Raleway'] text-2xl font-bold text-[#15599a]">
            CONTROLE DE COTAÇÕES
          </h1>
          {/* {quotations && (
            <button
              onClick={convertToXLSX}
              className="p-2 rounded border border-black"
            >
              CONVERTER PARA XLSX
            </button>
          )} */}
        </div>
        {!quotations ? (
          <div className="self-center mt-6" role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : null}
        {quotations ? (
          <div className="flex flex-wrap justify-between gap-2">
            {quotations.map((quotation, index) => (
              <CotacaoCard info={quotation} key={index} />
            ))}
          </div>
        ) : null}

        <div
          onClick={() => setNewQuotationModalOpen(true)}
          className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
        >
          <p className="uppercase font-bold text-sm">NOVA COTAÇÃO</p>
        </div>
        {newQuotationModalOpen ? (
          <ModalNovaCotacao
            getQuotations={getQuotations}
            modalIsOpen={newQuotationModalOpen}
            setModalIsOpen={setNewQuotationModalOpen}
          />
        ) : null}
      </div>
    );
  }
}

export default Cotacoes;
