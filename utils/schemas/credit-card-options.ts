import { z } from 'zod'

const OptionSchema = z.object({
  descricao: z.string(),
  parcelas: z.object({
    '1': z.number(),
    '2': z.number(),
    '3': z.number(),
    '4': z.number(),
    '5': z.number(),
    '6': z.number(),
    '7': z.number(),
    '8': z.number(),
    '9': z.number(),
    '10': z.number(),
    '11': z.number(),
    '12': z.number(),
  }),
})
const GeneralCreditCardOptionSchema = z.object({
  empresa: z.string(),
  modalidade: z.enum(['SEM ANTECIPAÇÃO', 'COM ANTECIPAÇÃO']),
  opcoes: z.array(OptionSchema),
})
export const InsertCreditCardOptionSchema = z.object({
  empresa: z.string(),
  modalidade: z.enum(['SEM ANTECIPAÇÃO', 'COM ANTECIPAÇÃO']),
  opcoes: z.array(OptionSchema),
})
export type TCreditCardOption = z.infer<typeof GeneralCreditCardOptionSchema>
// export type TCreditCardOption = {
//   empresa: string
//   modalidade: 'SEM ANTECIPAÇÃO' | 'COM ANTECIPAÇÃO'
//   opcoes: {
//     descricao: string
//     parcelas: {
//       '1': number
//       '2': number
//       '3': number
//       '4': number
//       '5': number
//       '6': number
//       '7': number
//       '8': number
//       '9': number
//       '10': number
//       '11': number
//       '12': number
//     }
//   }[]
// }
export type TCreditCardOptionDTO = TCreditCardOption & { _id: string }
