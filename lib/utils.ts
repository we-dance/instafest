import type { Ref } from 'vue'
import type { Updater } from '@tanstack/vue-table'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DateFormatter } from '@internationalized/date'
import type { ColumnDef } from '@tanstack/vue-table'
import { z } from 'zod'
import Input from '~/components/ui/input/Input.vue'
import { InputDate, InputSelect } from '~/components/ui/input'
import type { Event } from '~/types/event'

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

export function getEventDates(event: Event) {
  if (!event.startDate || !event.endDate) return ''

  return `${event.startDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })}, ${event.startDate.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })}-${event.endDate.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

export function normalizeDoc(doc: any) {
  const result = { ...doc }

  Object.keys(doc).forEach((key) => {
    if (doc[key] && doc[key].toDate) {
      result[key] = doc[key].toDate()
    }
  })

  return result
}

export function getFieldsDef(
  schema: z.ZodObject<any>,
  extend?: Record<string, any>
): FieldDef[] {
  return Object.keys(schema.shape).map((key) => {
    let column: FieldDef = {
      accessorKey: key,
      label: deCamelCase(key),
      as: Input,
      bind: {},
    }

    if (schema.shape[key]._def.typeName === 'ZodDate') {
      column.as = InputDate
    }

    if (schema.shape[key]._def.typeName === 'ZodNumber') {
      column.bind.type = 'number'
    }

    if (schema.shape[key]._def.typeName === 'ZodEnum') {
      column.as = InputSelect
      column.bind.options = schema.shape[key]._def.options
    }

    if (extend && extend[key]?.bind) {
      column.bind = { ...column.bind, ...extend[key].bind }
    }

    return column
  })
}

export function getColumnsDef<T>(
  schema: z.ZodObject<any>,
  extend?: Record<string, any>
): ColumnDef<T>[] {
  return Object.keys(schema.shape).map((key) => {
    const column: ColumnDef<T> = {
      accessorKey: key,
      header: deCamelCase(key),
    }

    if (extend && extend[key]?.cell) {
      column.cell = extend[key].cell
      return column
    }

    if (
      schema.shape[key]._def.typeName === 'ZodDate' ||
      (schema.shape[key]._def.typeName == 'ZodOptional' &&
        schema.shape[key]._def.innerType._def.typeName === 'ZodDate')
    ) {
      column.cell = ({ row }) => {
        return formatDate(row.getValue(key))
      }
    }

    return column
  })
}
