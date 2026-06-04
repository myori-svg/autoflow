const MAX_TITLE_LENGTH = 100

type Props = {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function TaskInput({ value, onChange, error }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= MAX_TITLE_LENGTH) {
      onChange(e.target.value)
    }
  }

  const isEmpty = value.trim().length === 0

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        할일 제목 <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="할일을 입력하세요"
        maxLength={MAX_TITLE_LENGTH}
        className={[
          'rounded-md border px-3 py-2 text-sm outline-none transition-colors',
          'focus:ring-2 focus:ring-blue-500',
          error || isEmpty && value !== ''
            ? 'border-red-400 focus:ring-red-400'
            : 'border-gray-300',
        ].join(' ')}
      />
      <div className="flex justify-between text-xs">
        <span className="text-red-500">
          {error ?? (isEmpty && value !== '' ? '할일 제목을 입력해주세요.' : '')}
        </span>
        <span className="text-gray-400">
          {value.length}/{MAX_TITLE_LENGTH}
        </span>
      </div>
    </div>
  )
}
