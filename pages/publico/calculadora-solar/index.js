import React, { useState } from "react";
import EstagioUm from "../../../components/EstagioUm";
import EstagioDois from "../../../components/EstagioDois";
import EstagioTres from "../../../components/EstagioTres";
import { FaMoneyBillWaveAlt, FaSolarPanel, FaPiggyBank } from "react-icons/fa";
import { WiSolarEclipse } from "react-icons/wi";
import { ImPower } from "react-icons/im";
import { IoIosResize } from "react-icons/io";
import Pixel from "../../../components/Pixel";
import { cities } from "../../../utils/constants";
function CalculadoraSolar() {
  const [clientCurrentEnergyBill, setBillPrice] = useState(0);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCity, setClientCity] = useState(cities[0].name);
  let necessaryEconomy = clientCurrentEnergyBill;
  let necessaryMonthlyEnergy = necessaryEconomy / 1.15;
  let necessaryPeakPot = necessaryMonthlyEnergy / 127.92;
  console.log(
    clientCurrentEnergyBill,
    necessaryMonthlyEnergy,
    necessaryEconomy / 127.92
  );
  let necessaryModules = Math.ceil(necessaryPeakPot / 0.45);
  let necessaryArea = (necessaryModules * 2.2).toFixed(2);
  let necessaryInvestiment = (necessaryPeakPot * 4800).toFixed(2);

  const [currentEstagio, setCurrentEstagio] = useState(1);
  return (
    <section className="min-h-[100vh] flex items-center justify-center bg-[#15599a]">
      <Pixel />
      {currentEstagio == 1 && (
        <EstagioUm
          clientCurrentEnergyBill={clientCurrentEnergyBill}
          setBillPrice={setBillPrice}
          setCurrentEstagio={setCurrentEstagio}
        />
      )}
      {currentEstagio == 2 && (
        <EstagioDois
          valorFatura={clientCurrentEnergyBill}
          name={{ clientName, setClientName }}
          email={{ clientEmail, setClientEmail }}
          phone={{ clientPhone, setClientPhone }}
          city={{ clientCity, setClientCity }}
          setCurrentEstagio={setCurrentEstagio}
        />
      )}
    </section>
  );
}
{
  /**      {currentEstagio == 1 && (
        <EstagioUm
          clientCurrentEnergyBill={clientCurrentEnergyBill}
          setBillPrice={setBillPrice}
          setCurrentEstagio={setCurrentEstagio}
        />
      )}
      {currentEstagio == 2 && (
        <EstagioTres
          necessaryEconomy={necessaryEconomy}
          necessaryMonthlyEnergy={necessaryMonthlyEnergy}
          necessaryPeakPot={necessaryPeakPot}
          necessaryModules={necessaryModules}
          necessaryArea={necessaryArea}
          necessaryInvestiment={necessaryInvestiment}
        />
      )} */
}
export default CalculadoraSolar;
