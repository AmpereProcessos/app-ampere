import Image from "next/image";
import React, { useState } from "react";
import Logo from "../../utils/whitelogoHD.png";
import estadosECidades from "../../utils/estados_cidades.json";
import irradiancia from "../../utils/irradiancia.json";
import SelectFoatingInput from "../../components/SelectFloatingInput";
import NumberFloatingInput from "../../components/NumberFloatingInput";
function getCities(uf) {
  var filteredState = estadosECidades.filter((item) => item.nome == uf)[0];
  return filteredState.cidades;
}
function GeneratioEstimative() {
  const [infoHolder, setInfoHolder] = useState({
    uf: "MINAS GERAIS",
    cidade: "ITUIUTABA",
    potPico: 0,
    perda: 0,
  });
  function getGenFactor(city, uf, month) {
    console.log(city, uf);
    const irrad = irradiancia.find(
      (item) =>
        item.STATE == uf && item.NAME.toLowerCase() == city.toLowerCase()
    );
    if (irrad) {
      return (irrad[month] / 1000) * 30 * 0.81;
    } else {
      return "-";
    }
  }
  return (
    <div className="p-6 grow flex flex-col bg-[#15599a] items-center">
      <div className="w-[90%] h-[100%] bg-[#fff] rounded-lg flex flex-col border border-gray-300 shadow-lg p-2 items-center">
        <div className="flex items-center justify-center h-[80px]">
          <Image height={"80px"} width={"80px"} src={Logo} objectFit="fill" />
        </div>
        <h1 className="font-medium text-lg text-[#fead61] mt-4">
          ESTUDO DE PERFORMACE DE USINA SOLAR FOTOVOLTAICA
        </h1>
        <div className="flex flex-col w-full mt-4 items-center">
          <SelectFoatingInput
            label={"UF"}
            editable={true}
            value={infoHolder.uf}
            options={[
              { label: "MINAS GERAIS", value: "MINAS GERAIS" },
              { label: "GOIÁS", value: "GOIÁS" },
            ]}
            handleChange={(value) =>
              setInfoHolder((prev) => ({
                ...prev,
                uf: value,
                cidade: getCities(value)[0],
              }))
            }
            width={"50%"}
          />
          <SelectFoatingInput
            label={"CIDADE"}
            editable={true}
            value={infoHolder.cidade}
            options={getCities(infoHolder.uf).map((city) => ({
              label: city,
              value: city,
            }))}
            handleChange={(value) =>
              setInfoHolder((prev) => ({ ...prev, cidade: value }))
            }
            width={"50%"}
          />
          <NumberFloatingInput
            label={"POTÊNCIA PICO DO SISTEMA"}
            editable={true}
            value={infoHolder.potPico}
            handleChange={(value) =>
              setInfoHolder((prev) => ({ ...prev, potPico: Number(value) }))
            }
            width={"50%"}
          />
          <NumberFloatingInput
            label={"PERDA DE GERAÇÃO (%)"}
            editable={true}
            value={infoHolder.perda}
            handleChange={(value) =>
              setInfoHolder((prev) => ({ ...prev, perda: Number(value) }))
            }
            width={"50%"}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="bg-[#15599a] font-medium text-white col-span-1 text-center">
              MESES
            </div>
            <div className="bg-[#15599a] font-medium text-white col-span-1 text-center">
              FATOR DE GERAÇÃO
            </div>
            <div className="bg-[#15599a] font-medium text-white col-span-1 text-center">
              EXPECTATIVA (kWh)
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              JANEIRO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "JAN").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "JAN") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              FEVEREIRO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "FEB").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "FEB") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              MARÇO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "MAR").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "MAR") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              ABRIL
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "APR").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "APR") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              MAIO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "MAY").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "MAY") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              JUNHO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "JUN").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "JUN") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              JULHO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "JUL").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "JUL") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              AGOSTO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "AUG").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "AUG") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              SETEMBRO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "SEP").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "SEP") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              OUTUBRO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "OCT").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "OCT") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              NOVEMBRO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "NOV").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "NOV") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              DEZEMBRO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "DEC").toFixed(2)}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "DEC") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          <div className="w-full grid grid-cols-3 border-b border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-l border-gray-200">
              MÉDIA
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-x border-gray-200">
              {getGenFactor(infoHolder.cidade, infoHolder.uf, "ANNUAL").toFixed(
                2
              )}
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center border-r border-gray-200">
              {infoHolder.potPico
                ? Number(
                    (getGenFactor(infoHolder.cidade, infoHolder.uf, "ANNUAL") *
                      infoHolder.potPico *
                      (100 - infoHolder.perda)) /
                      100
                  ).toFixed(2)
                : "-"}
            </div>
          </div>
          {/* <div className="w-full grid grid-cols-3 border-l border-gray-200">
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center">
              MÉDIA
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center">
              FATOR DE GERAÇÃO
            </div>
            <div className="text-gray-600 font-medium col-span-1 p-1 text-center">
              EXPECTATIVA (kWh)
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default GeneratioEstimative;
