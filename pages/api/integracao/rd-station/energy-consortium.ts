import { apiHandler } from '@/utils/api'
import { formatToMoney } from '@/utils/constants'
import connectToDatabase from '@/utils/services/mongodb/inside-sales'
import axios from 'axios'
import { Collection } from 'mongodb'
import { NextApiHandler } from 'next'
import { z } from 'zod'

const DISCOUNT = 0.18
const BASE_PUBLIC_ILUMINATION_PRICE = 20
const CONNECTIONS = [
  { id: 1, label: 'MONOFÁSICO', value: 'MONOFÁSICO', disponibility: 30 },
  { id: 2, label: 'BIFÁSICO', value: 'BIFÁSICO', disponibility: 50 },
  { id: 3, label: 'TRIFÁSICO', value: 'TRIFÁSICO', disponibility: 100 },
]
const ENERGY_TARIFFS = [
  { id: 1, distributor: 'CEMIG', tariff: 0.93 },
  { id: 2, distributor: 'EQUATORIAL', tariff: 0.8 },
]
const valor_conta_de_luz = [
  {
    parametros: {
      min: 0,
      max: 300,
    },
    value: 'Até R$ 300,00',
  },
  {
    parametros: {
      min: 300,
      max: 2000,
    },
    value: 'de R$301 até R$ 2.000',
  },
  {
    parametros: {
      min: 2000,
      max: 5000,
    },
    value: 'de R$ 2.001 até R$ 5.000',
  },
  {
    parametros: {
      min: 5000,
      max: 9999999,
    },
    value: 'Acima de de R$ 5.001',
  },
]

function handleCalculation({ simulation }: { simulation: TSimulation }) {
  const { expense, distributor, tariff, connection } = simulation
  const disponibility = CONNECTIONS.find((c) => c.value == connection)?.disponibility || 30

  const energyConsumption = (expense - BASE_PUBLIC_ILUMINATION_PRICE) / tariff

  const acquirable = energyConsumption - disponibility

  // New expenses
  const newDistributorExpense = BASE_PUBLIC_ILUMINATION_PRICE + disponibility * 1.02 * tariff // 1.02 to fix taxes and other tariffs
  const newConsortiumExpense = (1 - DISCOUNT) * tariff * acquirable
  const newExpense = newDistributorExpense + newConsortiumExpense

  const economy = expense - newExpense
  return { newExpense, economy }
}
type PostResponse = {
  data: { newExpense: number; economy: number }
  message: string
}

const SimulationSchema = z.object({
  userName: z.string({ required_error: 'Oops, preencha por favor um nome válido.', invalid_type_error: 'Tipo inválido para nome.' }),
  userEmail: z
    .string({ required_error: 'Oops, preencha por favor um email válido.' })
    .email({ message: 'Oops, preencha por favor um email válido.' }),
  expense: z.number({
    required_error: 'Oops, preencha por favor a despesa de energia atual.',
    invalid_type_error: 'Oops, preencha por favor um email válido.',
  }),
  distributor: z.string({
    required_error: 'Oops, preencha por favor a distribuidora de energia.',
    invalid_type_error: 'Oops, preencha por favor a distribuidora de energia.',
  }),
  tariff: z.number({
    required_error: 'Oops, preencha por favor a tarifa de energia.',
    invalid_type_error: 'Oops, preencha por favor a tarifa de energia.',
  }),
  connection: z.string({
    required_error: 'Oops, preencha por favor o seu tipo de conexão.',
    invalid_type_error: 'Oops, preencha por favor o seu tipo de conexão.',
  }),
})
export type TSimulation = z.infer<typeof SimulationSchema>
const createLeadFromSimulation: NextApiHandler<PostResponse> = async (req, res) => {
  const simulation = SimulationSchema.parse(req.body)

  const db = await connectToDatabase(process.env.DB_KEY)
  const collection: Collection = db.collection('leads')

  const lead = { nome: simulation.userName, email: simulation.userEmail, consumo: simulation.expense }
  await collection.insertOne({ ...lead })

  const cf_valor_conta_de_luz = valor_conta_de_luz.find(
    (rdParam) => simulation.expense > rdParam.parametros.min && simulation.expense <= rdParam.parametros.max
  )

  const { newExpense, economy } = handleCalculation({ simulation })

  const { data: rdResponse } = await axios.post(`https://api.rd.services/platform/conversions?api_key=${process.env.RD_API_KEY}`, {
    event_type: 'CONVERSION',
    event_family: 'CDP',
    payload: {
      conversion_identifier: 'CALCULADORA CONSÓRCIO',
      email: simulation.userEmail,
      personal_phone: '',
      name: simulation.userName,
      cf_economia_mes_calc: formatToMoney(economy),
      cf_economia_ano_calc: formatToMoney(economy * 12),
      cf_valor_estimativa_consorcio: formatToMoney(newExpense),
      cf_valor_conta_energia_consorcio: formatToMoney(simulation.expense),
      state: '',
      city: '',
    },
  })
  console.log(rdResponse)

  return res.status(200).json({ data: { newExpense, economy }, message: 'Simulação concluída com sucesso !' })
}

export default apiHandler({ POST: createLeadFromSimulation })
