import { useEffect, useState } from 'react'
import { SubButton } from './common'

function getNumber(text: string) {
  const num = parseInt(text)

  if (!Number.isNaN(num)) {
    return num
  } else {
    return null
  }
}

export const AmountForm = ({
  symbol,
  setAmount
}: {
  symbol: string
  setAmount: (amount: number | null) => void
}) => {
  const [amountText, setAmountText] = useState('0')

  useEffect(() => {
    const amount = getNumber(amountText)

    setAmount(amount)
  }, [amountText, setAmount])

  return (
    <div className="flex justify-between items-center space-x-2 text-sm">
      <div className="basis-1/4">
        <SubButton
          onClick={() => {
            setAmountText('1')
          }}
        >
          1
        </SubButton>
      </div>
      <div className="basis-1/4">
        <SubButton
          onClick={() => {
            setAmountText('2')
          }}
        >
          2
        </SubButton>
      </div>
      <div className="basis-2/4">
        <div className="p-2 shadow text-base text-zinc-950 flex justify-center items-center w-full bg-transparent h-10 rounded-lg border border-zinc-950/10">
          <div className="w-full h-full">
            <input
              className="w-full h-full bg-transparent text-right pr-3"
              type="number"
              value={amountText}
              onChange={e => setAmountText(e.target.value)}
            />
          </div>

          <span className="text-black">{symbol}</span>
        </div>
      </div>
    </div>
  )
}
