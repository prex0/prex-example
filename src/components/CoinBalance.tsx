import { useEffect } from 'react'
import { Address } from 'viem'
import {usePrex} from '@prex0/prex-react'
import { LoadingIndicatorDark } from './common/LoadingIndicator'

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
    </div>
  )
}
