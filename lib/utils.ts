import type { Ref } from 'vue'
import type { Updater } from '@tanstack/vue-table'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DateFormatter } from '@internationalized/date'
import type { ColumnDef } from '@tanstack/vue-table'
import { z } from 'zod'
import Input from '~/components/ui/input/Input.vue'
import { InputDate } from '~/components/ui/input'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
  timeStyle: 'short',
})

export function formatDate(date: Date) {
  if (!date) return ''

  return df.format(date)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(
  updaterOrValue: T,
  ref: Ref
) {
  ref.value =
    typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue
}

export function deCamelCase(str: string) {
  return str.replace(/[A-Z]/g, ' $&').replace(/^./, (v) => v.toUpperCase())
}

export type FieldDef = {
  accessorKey: string
  label: string
  as: any
  bind: Record<string, any>
}

export function getFieldsDef(schema: z.ZodObject<any>): FieldDef[] {
  return Object.keys(schema.shape).map((key) => {
    const column: FieldDef = {
      accessorKey: key,
      label: deCamelCase(key),
      as: Input,
      bind: {},
    }

    if (schema.shape[key]._def.typeName === 'ZodDate') {
      column.as = InputDate
    }

    return column
  })
}

export function getColumnsDef<T>(schema: z.ZodObject<any>): ColumnDef<T>[] {
  return Object.keys(schema.shape).map((key) => {
    const column: ColumnDef<T> = {
      accessorKey: key,
      header: deCamelCase(key),
    }

    if (schema.shape[key]._def.typeName === 'ZodDate') {
      column.cell = ({ row }) => {
        return formatDate(row.getValue(key))
      }
    }

    return column
  })
}
