type GetContractValueParams = {
  projectValue?: number | null
  paValue?: number | null
  structureValue?: number | null
  oemValue?: number | null
  insuranceValue?: number | null
}
export function getContractValue({ projectValue, paValue, structureValue, oemValue, insuranceValue }: GetContractValueParams) {
  var totalSum = 0

  let projeto = !isNaN(projectValue || 0) ? projectValue || 0 : 0
  let padrao = !isNaN(paValue || 0) ? paValue || 0 : 0
  let estrutura = !isNaN(structureValue || 0) ? structureValue || 0 : 0
  let oem = !isNaN(oemValue || 0) ? oemValue || 0 : 0
  let seguro = !isNaN(insuranceValue || 0) ? insuranceValue || 0 : 0
  console.log(projeto, padrao, estrutura, oem, seguro)
  totalSum = Number(totalSum) + Number(projeto) + Number(padrao) + Number(estrutura) + Number(oem) + Number(seguro)
  return totalSum
}
