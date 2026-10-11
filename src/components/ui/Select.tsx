import { useId } from 'react'

export interface Option<T extends string> {
  value: T
  label: string
}

interface SelectProps<T extends string> {
  label: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
}

/** Labelled native <select>. Generic, so `onChange` receives the correct type instead of a plain string. */
export function Select<T extends string>({ label, value, options, onChange }: SelectProps<T>) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-10 w-full rounded-lg bg-white px-3 text-sm ring-1 ring-slate-300 ring-inset focus:ring-2 focus:ring-sky-600 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
