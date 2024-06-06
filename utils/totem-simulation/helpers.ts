export function getUFVSystemInvestmentByEnergyBill(bill: number) {
  const INVESTIMENT_BY_KWP = 3200

  const energyConsumption = Number(Number((bill / 0.85).toFixed(2)))

  const suggestedPeakPower = Number(energyConsumption / 120)

  var effectivePeakPower = 0
  var investiment = 0

  const moduleQty = Math.ceil((energyConsumption * 1000) / (120 * 565))
  const modulePower = 565
  effectivePeakPower = (moduleQty * modulePower) / 1000
  console.log(effectivePeakPower)
  investiment = effectivePeakPower * INVESTIMENT_BY_KWP

  return { moduleQty, modulePower, effectivePeakPower, investiment }
}
