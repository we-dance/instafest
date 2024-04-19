import { z } from 'zod'
import type { CellContext } from '@tanstack/vue-table'
import { getColumnsDef, getFieldsDef } from '~/lib/utils'

export const customerAccountSchemaInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  gender: z.enum(['male', 'female']),
  phone: z.string(),
  level: z.string(),
  package: z.string(),
  course: z.string(),
})

export const customerAccountSchema = z.object({
  gender: z.enum(['male', 'female']),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
})

const genderOptions: Record<string, string> = {
  male: 'Male',
  female: 'Female',
}

function getOptions(options: Record<string, string>) {
  return Object.keys(options).map((key) => ({
    value: key,
    label: options[key],
  }))
}

const extend = {
  gender: {
    cell: (ctx: CellContext<any, string>) => {
      const value: string = ctx.row.getValue('gender')

      return genderOptions[value] || ''
    },
    bind: {
      options: getOptions(genderOptions),
    },
  },
}

export const fields = getFieldsDef(customerAccountSchema, extend)
export const columns = getColumnsDef(customerAccountSchema, extend)

export type CustomerAccountInput = z.infer<typeof customerAccountSchemaInput>
export type CustomerAccount = z.infer<typeof customerAccountSchema>
