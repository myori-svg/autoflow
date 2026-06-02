import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

type Props = {
  selected?: Date
  onSelect: (date: Date | undefined) => void
}

export function DatePicker({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false)

  const handleSelect = (date: Date | undefined) => {
    onSelect(date)
    setOpen(false)
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-sm font-medium text-gray-700">
        마감일 <span className="text-red-500">*</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-left text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-colors hover:border-gray-400"
      >
        {selected ? formatDate(selected) : '날짜를 선택하세요'}
      </button>
      {open && (
        <div className="absolute top-full mt-1 z-10 bg-white rounded-xl border border-gray-200 shadow-lg p-2">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={{ before: new Date() }}
            today={new Date()}
          />
        </div>
      )}
    </div>
  )
}
