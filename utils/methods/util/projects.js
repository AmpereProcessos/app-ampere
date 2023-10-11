export function getContractValue({ projectValue, paValue, structureValue }) {
  var totalSum = 0

  let projeto = !isNaN(projectValue) ? projectValue : 0
  let padrao = !isNaN(paValue) ? paValue : 0
  let estrutura = !isNaN(structureValue) ? structureValue : 0
  totalSum = Number(totalSum) + Number(projeto) + Number(padrao) + Number(estrutura)
  return totalSum
}
