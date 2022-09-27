import React, { useState } from "react";
import EstagioUm from "../../components/EstagioUm";
import EstagioDois from "../../components/EstagioDois";
import { FaMoneyBillWaveAlt, FaSolarPanel, FaPiggyBank } from "react-icons/fa";
import { WiSolarEclipse } from "react-icons/wi";
import { ImPower } from "react-icons/im";
import { IoIosResize } from "react-icons/io";
function CalculadoraSolar() {
  const [clientCurrentEnergyBill, setBillPrice] = useState(0);
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
      {currentEstagio == 1 && (
        <EstagioUm
          clientCurrentEnergyBill={clientCurrentEnergyBill}
          setBillPrice={setBillPrice}
          setCurrentEstagio={setCurrentEstagio}
        />
      )}
      {currentEstagio == 2 && (
        <EstagioDois
          necessaryEconomy={necessaryEconomy}
          necessaryMonthlyEnergy={necessaryMonthlyEnergy}
          necessaryPeakPot={necessaryPeakPot}
          necessaryModules={necessaryModules}
          necessaryArea={necessaryArea}
          necessaryInvestiment={necessaryInvestiment}
        />
      )}
    </section>
  );
}

export default CalculadoraSolar;
