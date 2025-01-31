import { TRevenue } from '@/utils/schemas/revenues'
import axios from 'axios'

export const CONTA_AZUL_PRODUCTS_AND_SERVICES = [
  {
    id: '75c53cc4-6149-4815-9b83-ccfbee581a42',
    label: 'MÃO DE OBRA E EQUIPAMENTO',
    serviceTypeEquivalent: 'SISTEMA FOTOVOLTAICO',
  },
  {
    id: 'e4ee8aed-d4de-48ce-950f-3ecb9a518f71',
    label: 'AUMENTO',
    serviceTypeEquivalent: 'AUMENTO DE SISTEMA FOTOVOLTAICO',
  },
]

function getContaAzulProductsAndServicesFromRevenueType(revenueType: string) {
  const equivalent = CONTA_AZUL_PRODUCTS_AND_SERVICES.find((p) => p.serviceTypeEquivalent == revenueType)
  return equivalent
}

export async function createSaleFromRevenue({ revenue, accessToken }: { revenue: TRevenue; accessToken: string }) {
  try {
    const url = `https://api.contaazul.com/v1/sales`
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }

    const contaAzulProductsAndServices = getContaAzulProductsAndServicesFromRevenueType(revenue.tipo)
    const contaAzulSale = {
      emission: '2025-01-30T12:45:28.179Z',
      status: 'PENDING',
      payment: {
        type: 'TIMES',
        installments: revenue.fracionamento.map((revenueFraction, revenueFractionIndex) => ({
          number: revenueFractionIndex + 1,
          value: revenueFraction.valor || revenueFraction.porcentagem * revenue.total,
          due_date: revenueFraction.dataRecebimento || revenueFraction.dataPrevisaoRecebimento,
          status: revenueFraction.dataRecebimento ? 'ACQUITTED' : 'PENDING',
          note: revenueFraction.titulo,
          hasBillet: false,
        })),
      },
      services: contaAzulProductsAndServices
        ? [
            {
              service_id: contaAzulProductsAndServices.id,
              description: contaAzulProductsAndServices.label,
              quantity: 1,
              value: revenue.total,
            },
          ]
        : undefined,
      notes: revenue.projeto.id ? `Venda do Projeto ${revenue.projeto.nome}, do tipo ${revenue.tipo}.` : '',
    }
    const { data } = await axios.post(url, contaAzulSale, { headers })
    console.log('CONTA AZUL CREATE SALE RESPONSE', data)
    const contaAzulSaleId = data.id
    if (!contaAzulSaleId) throw new Error('Ocorreu um erro ao criar a venda no Conta Azul.')
    return { contaAzulSaleId }
  } catch (error) {
    console.log('ERROR', error)
    throw error
  }
}

type UpdateSaleInstallmentParams = {
  saleId: string
  saleInstallmentIndex: number
  saleInstallmentPaid: boolean
  accessToken: string
}
export async function updateSaleInstallment({ saleId, saleInstallmentIndex, saleInstallmentPaid, accessToken }: UpdateSaleInstallmentParams) {
  try {
    const url = `https://api.contaazul.com/v1/sales/${saleId}/installments/${saleInstallmentIndex}`
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }

    const { data } = await axios.put(url, { status: saleInstallmentPaid ? 'ACQUITTED' : 'PENDING' }, { headers })
    console.log('CONTA AZUL UPDATE INSTALLMENT RESPONSE', data)
    return { data: 'Recebimento atualizado.' }
  } catch (error) {
    throw error
  }
}
