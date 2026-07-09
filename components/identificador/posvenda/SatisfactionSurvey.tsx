import TextInput from "@/components/inputs/Text";
import { formatToPhone } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { answerSatisfactionSurvey } from "@/utils/methods/mutation/after-sales";
import { updateProject } from "@/utils/methods/mutation/clients";
import React, { useState } from "react";
import toast from "react-hot-toast";

type TPoints = {
  sale: number | null;
  delivery: number | null;
  execution: number | null;
  afterSales: number | null;
};

function getAverage(points: TPoints) {
  const filtered = Object.values(points).filter((v) => !!v);
  if (filtered.length < 4) return null;
  const sum =
    filtered.reduce((acc, current) => {
      const accNumber = acc || 0;
      const currentNumber = current || 0;
      return accNumber + currentNumber;
    }, 0) || 0;
  return sum / filtered.length;
}

type SatisfactionSurveyProps = {
  projectId: string;
};
function SatisfactionSurvey({ projectId }: SatisfactionSurveyProps) {
  const [points, setPoints] = useState<TPoints>({
    sale: null,
    delivery: null,
    execution: null,
    afterSales: null,
  });
  const [indications, setIndications] = useState([{ nome: "", telefone: "" }]);

  const avg = getAverage(points);
  async function handleSurverAnswer() {
    console.log("CHAMADO");
    if (!points.sale)
      return toast.error(
        "Por favor, preencha a nota referência a sua satisfação com o processo de venda.",
      );
    if (!points.delivery)
      return toast.error(
        "Por favor, preencha a nota referência a sua satisfação com o processo de entrega.",
      );
    if (!points.execution)
      return toast.error(
        "Por favor, preencha a nota referência a sua satisfação com o processo de execução/montagem.",
      );
    if (!points.afterSales)
      return toast.error("Por favor, preencha a nota referência a sua satisfação com o pós-venda.");
    try {
      const satisfaction = {
        venda: points.sale,
        entrega: points.delivery,
        execucao: points.execution,
        posVenda: points.afterSales,
      };

      await answerSatisfactionSurvey({ id: projectId, answer: { satisfaction, indications } });
      toast.success("Obrigado por preencher a pesquisa de satisfação.");
      return window.location.reload();
    } catch (error) {
      const msg = getErrorMessage(error);
      return toast.error(msg);
    }
  }
  return (
    <>
      <div className="bg-primary/60 my-6 h-px w-full"></div>
      <h1 className="my-4 rounded-full bg-[#fead41] px-4 py-2 text-lg leading-none font-black tracking-tight text-white">
        PESQUISA DE SATISFAÇÃO
      </h1>
      <p className="text-foreground w-full self-center text-center font-medium tracking-tight lg:w-[60%]">
        Seu projeto conosco foi concluído.
      </p>
      <p className="text-foreground mt-2 w-full self-center text-center font-medium tracking-tight lg:w-[60%]">
        Esperamos que sua experiência conosco tenha sido a melhor possível até agora e gostaríamos
        de uma opinião sua para que pudessemos melhorar ainda mais os nossos serviços.
      </p>
      <p className="text-foreground mt-2 w-full self-center text-center font-medium tracking-tight lg:w-[60%]">
        Clique por favor abaixo na sua nota para algumas das etapas dos seus projetos.
      </p>
      <div className="mt-4 flex w-full flex-col gap-2">
        <h1 className="w-fit self-center rounded-full bg-[#15599a] px-4 py-2 text-base leading-none font-black tracking-tight text-white">
          VENDA
        </h1>
        <div className="flex w-full flex-wrap items-center justify-around gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div
              key={n}
              onClick={() => setPoints((prev) => ({ ...prev, sale: n }))}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full lg:h-12 lg:w-12 ${
                points.sale == n ? "bg-black text-white" : ""
              } border border-black text-xs font-black duration-200 ease-in-out hover:bg-black hover:text-white lg:text-sm`}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col gap-2">
        <h1 className="w-fit self-center rounded-full bg-[#15599a] px-4 py-2 text-base leading-none font-black tracking-tight text-white">
          ENTREGA
        </h1>
        <div className="flex w-full flex-wrap items-center justify-around gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div
              key={n}
              onClick={() => setPoints((prev) => ({ ...prev, delivery: n }))}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full lg:h-12 lg:w-12 ${
                points.delivery == n ? "bg-black text-white" : ""
              } border border-black text-xs font-black duration-200 ease-in-out hover:bg-black hover:text-white lg:text-sm`}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col gap-2">
        <h1 className="w-fit self-center rounded-full bg-[#15599a] px-4 py-2 text-base leading-none font-black tracking-tight text-white">
          EXECUÇÃO/MONTAGEM
        </h1>
        <div className="flex w-full flex-wrap items-center justify-around gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div
              key={n}
              onClick={() => setPoints((prev) => ({ ...prev, execution: n }))}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full lg:h-12 lg:w-12 ${
                points.execution == n ? "bg-black text-white" : ""
              } border border-black text-xs font-black duration-200 ease-in-out hover:bg-black hover:text-white lg:text-sm`}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col gap-2">
        <h1 className="w-fit self-center rounded-full bg-[#15599a] px-4 py-2 text-base leading-none font-black tracking-tight text-white">
          PÓS-VENDA
        </h1>
        <div className="flex w-full flex-wrap items-center justify-around gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div
              key={n}
              onClick={() => setPoints((prev) => ({ ...prev, afterSales: n }))}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full lg:h-12 lg:w-12 ${
                points.afterSales == n ? "bg-black text-white" : ""
              } border border-black text-xs font-black duration-200 ease-in-out hover:bg-black hover:text-white lg:text-sm`}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
      {/* {avg && avg > 7 ? (
            <div className="flex w-full flex-col gap-2">
              <p className="my-2 w-full self-center text-center font-medium tracking-tight text-foreground lg:w-[60%]">
                Gostou dos nossos serviços ? Indique um conhecido para começar já a economizar na conta de luz.
              </p>
              {indications.map((indication, index) => (
                <div key={index} className="flex w-full items-center gap-2">
                  <div className="w-full lg:w-1/2">
                    <TextInput
                      label="NOME DO INDICADO"
                      showLabel={false}
                      value={indication.nome}
                      placeholder="Preencha o nome do indicado..."
                      handleChange={(value) =>
                        setIndications((prev) => {
                          const ind = [...prev]
                          ind[index].nome = value
                          return ind
                        })
                      }
                      width="100%"
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <TextInput
                      label="TELEFONE DO INDICADO"
                      showLabel={false}
                      value={indication.telefone}
                      placeholder="Preencha o telefone do indicado..."
                      handleChange={(value) =>
                        setIndications((prev) => {
                          const ind = [...prev]
                          ind[index].telefone = formatToPhone(value)
                          return ind
                        })
                      }
                      width="100%"
                    />
                  </div>
                </div>
              ))}
              <div className="mt-1 flex w-full items-center justify-end">
                <button
                  onClick={() => setIndications((prev) => [...prev, { nome: '', telefone: '' }])}
                  className="rounded bg-black py-1 px-4 text-xs font-medium text-white duration-300 ease-in-out disabled:bg-primary/60 enabled:hover:bg-primary/70"
                >
                  ADICIONAR INDICAÇÃO
                </button>
              </div>
            </div>
           ) : null} */}
      <div className="mt-4 flex w-full items-center justify-center">
        <button
          onClick={() => handleSurverAnswer()}
          className="disabled:bg-primary/60 rounded bg-green-600 px-4 py-1 text-lg font-medium text-white duration-300 ease-in-out enabled:hover:bg-green-700"
        >
          RESPONDER PESQUISA
        </button>
      </div>
      <div className="bg-primary/60 my-6 h-px w-full"></div>
    </>
  );
}

export default SatisfactionSurvey;
