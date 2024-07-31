import { useEffect } from 'react'
import { Address } from 'viem'
import {usePrex} from '@prex0/prex-react'
import { LoadingIndicatorDark } from './common/LoadingIndicator'
import {Link} from 'react-router-dom'

export const CoinBalance = ({
  erc20Address,
  unit
}: {
  erc20Address: Address
  unit: string
}) => {
  const {user, balance, loadBalance} = usePrex()

  useEffect(() => {
    loadBalance(erc20Address)
  }, [loadBalance, erc20Address])

  const hasZero = balance[erc20Address] === undefined ? false : balance[erc20Address] === 0n

  return (
    <div className="mt-8 w-48 p-4 shadow-lg rounded-xl border-primary border-[1px]">
      <div>
        <div className="text-base text-zinc-700 flex justify-center">
          コイン保有数
        </div>
        {user && balance[erc20Address] !== undefined ? (
          <div className="text-xl font-bold text-zinc-900 flex justify-center">
            {Number(balance[erc20Address])} {unit}
          </div>
        ) : (
          <LoadingIndicatorDark />
        )}
      </div>

      {hasZero && (
      <div className='flex justify-center'>
      <Link
          to={'/mint'}
          className="py-4 w-40 flex flex-col justify-center items-center space-x-1"
        >
        <div className="text-xs text-zinc-600 underline">デモ用のコインをもらう。</div>
      </Link>
</div>
      )}

    </div>
  )
}
