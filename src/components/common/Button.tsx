import React from 'react'

export const PrimaryButton = ({
  children,
  disabled = false,
  onClick,
  size = 'base'
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  size?: 'base' | 'lg'
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full h-full bg-zinc-900 disabled:bg-zinc-500 hover:bg-zinc-600 text-white text-${size} font-bold px-4 py-2 rounded-md`}
    >
      {children}
    </button>
  )
}

export const SubButton = ({
  children,
  disabled = false,
  onClick
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full h-12 border-zinc-950/10 border border-[1px] text-base font-bold text-zinc-900 px-4 py-2 rounded-md"
    >
      {children}
    </button>
  )
}

export const AccentButton = ({
  children,
  onClick
}: {
  children: React.ReactNode
  onClick?: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full h-12 bg-accent disabled:bg-high-accent text-white px-4 py-2 rounded-md"
    >
      {children}
    </button>
  )
}
