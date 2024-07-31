export const TextInput = ({
  placeholder,
  value,
  onChange,
  disabled
}: {
  placeholder: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) => {
  return (
    <input
      className="w-full h-10 px-2 py-1 rounded-lg text-right text-base text-zinc-950 placeholder:text-zinc-500 sm:text-sm bg-transparent shadow border border-zinc-950/10 border-[1px]"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      disabled={disabled === undefined ? false : disabled}
    />
  )
}
