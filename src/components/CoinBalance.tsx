import { Address, formatUnits } from 'viem'
import { useBalance } from '@prex0/prex-react'
import { LoadingIndicatorDark } from './common/LoadingIndicator'
import { Link } from 'react-router-dom'
import { TOKEN_DECIMALS } from '../constants'

export const CoinBalance = ({
  erc20Address,
  unit
}: {
  erc20Address: Address
  unit: string
}) => {
  const { isLoading, data } = useBalance(erc20Address)

  const hasZero = isLoading ? false : data === 0n

  return (
    <div className="mt-8 w-48 p-4 shadow-lg rounded-xl border-primary border-[1px] bg-white">
      <div>
        <div className="text-base text-zinc-700 flex justify-center">
          コイン保有数
        </div>
        {!isLoading ? (
          <div className="text-xl font-bold text-zinc-900 flex justify-center">
            {formatUnits(data, TOKEN_DECIMALS)} {unit}
          </div>
        ) : (
          <LoadingIndicatorDark />
        )}
      </div>

      {hasZero && (
        <div className="flex justify-center">
          <Link
            to={'/mint'}
            className="py-4 w-40 flex flex-col justify-center items-center space-x-1"
          >
            <div className="text-xs text-zinc-600 underline">
              デモ用のコインをもらう。
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
