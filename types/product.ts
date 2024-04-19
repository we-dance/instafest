import type { CellContext } from '@tanstack/vue-table'
import { z } from 'zod'
import { getColumnsDef } from '~/lib/utils'

export const durationOptions = [
  { value: '0', label: 'One Time' },
  { value: '1', label: '1 month' },
  { value: '3', label: '3 months' },
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
]

export const schema = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  price: z.number().gt(0),
  duration: z.string().optional().default('0'),
})

const extend = {
  price: {
    cell: (ctx: CellContext<any, number>) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(ctx.row.getValue('price'))
    },
  },
}

export const columns = getColumnsDef(schema, extend)

export type Product = z.infer<typeof schema>
