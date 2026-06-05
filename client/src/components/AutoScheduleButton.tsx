type Props = {
  disabled: boolean
  loading: boolean
  onClick: () => void
}

export function AutoScheduleButton({ disabled, loading, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
        disabled || loading
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-indigo-600 text-white hover:bg-indigo-700',
      ].join(' ')}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          AI 분석 중...
        </>
      ) : (
        '✨ 자동 배분'
      )}
    </button>
  )
}
