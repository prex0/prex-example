import React, { useCallback, useEffect } from 'react'
import { Address } from 'viem'
import {usePrex, splitAddress} from '@prex0/prex-react'
import dayjs from 'dayjs'
import { PrimaryButton, SubButton, LoadingIndicator, SubTitle } from '../components/common'
import { CoinBalance } from '../components/CoinBalance'
import { ERC20_ADDRESS } from '../constants'
import { Header } from '../components/Header'

enum Status {
  NotReceived,
  Processing,
  Received
}

function getNumber(text: string) {
  const num = parseInt(text)

  if (!Number.isNaN(num)) {
    return num
  } else {
    return null
  }
}

const DirectTransferView = () => {
  const [status, setStatus] = React.useState<Status>(Status.NotReceived)

  const params = new URLSearchParams(window.location.search)
  const [amountText, setAmount] = React.useState<string>('0')
  const amount = getNumber(amountText)

  const { wallet, balance, loadBalance,nicknames, error, transfer, loadNicknames } = usePrex()

  const recipient = params.get('r')

  useEffect(() => {
    if (recipient) {
      loadNicknames([recipient as Address])
    }
  }, [recipient, loadNicknames])

  useEffect(() => {
    if (wallet) {
      loadBalance(ERC20_ADDRESS)
    }
  }, [wallet])

  const onReceive = useCallback(async () => {
    if (!recipient) {
      throw new Error('Invalid request')
    }

    if (amount === null || amount === 0) {
      throw new Error('amount must not be null')
    }

    setStatus(Status.Processing)

    await transfer(ERC20_ADDRESS, recipient as Address, BigInt(amount))

    setStatus(Status.Received)
  }, [transfer, setStatus, amount, recipient])

  if (balance[ERC20_ADDRESS] === undefined) {
    return (
      <div className="m-2 flex justify-center items-center">
        <div className="mt-8">
          <LoadingIndicator />
        </div>
      </div>
    )
  }

  const isAmountZero = amount === null || amount === 0
  const isExceeded = isAmountZero || amount > Number(balance[ERC20_ADDRESS])

  const now = dayjs()

  if (status === Status.Received) {
    return (
      <div>
        <Header title="送付" />
        <div className="m-2 flex justify-center items-center">
          <div className="mt-12">
            <div className="text-base space-y-4">
              <div className="flex justify-center">
                <div className="text-center text-base">
                  {recipient
                    ? nicknames[recipient]
                      ? nicknames[recipient]
                      : splitAddress(recipient)
                    : '...'}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="text-center text-base">
                  {now.format('YYYY年MM月DD日 HH時mm分ss秒')}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="text-center text-2xl font-bold">1 demoCoin</div>
              </div>
              <div className="flex justify-center">
                <div className="w-40 p-2 rounded-2xl bg-green-700 text-white text-center text-base font-bold">
                  送付完了
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="送付" />
      <div className="m-2 flex justify-center items-center">
        <div className="mt-8">
          <div className="text-base space-y-3">
            <div>
              <div className="flex justify-center">
                <SubTitle>demoCoinを送付します。</SubTitle>
              </div>
            </div>
            <CoinBalance erc20Address={ERC20_ADDRESS} unit={'demoCoin'} />

            <div className="fixed bottom-10 z-999 left-0 w-full p-2">
              <div className="space-y-3">
                <div className="p-2 shadow text-base text-zinc-950 flex justify-center w-full bg-transparent rounded-lg border border-zinc-950/10">
                  <span className="text-black whitespace-nowrap">送る量</span>

                  <div className="w-full md:w-7/8">
                    <input
                      className="w-full h-full bg-transparent text-right pr-3"
                      type="number"
                      value={amountText}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>

                  <span className="text-black">demoCoin</span>
                </div>

                <div className="flex justify-between space-x-1 text-sm">
                  <SubButton
                    onClick={() => {
                      setAmount('1')
                    }}
                  >
                    1
                  </SubButton>
                  <SubButton
                    onClick={() => {
                      setAmount('2')
                    }}
                  >
                    2
                  </SubButton>
                  <SubButton
                    onClick={() => {
                      setAmount('3')
                    }}
                  >
                    3
                  </SubButton>
                  <SubButton
                    onClick={() => {
                      setAmount('4')
                    }}
                  >
                    4
                  </SubButton>
                </div>

                <div className="text-xs text-red-700">
                  {error ? 'サーバの調子が悪いようです' : null}
                  {isAmountZero
                    ? '数量を入力してください'
                    : isExceeded
                    ? '残高が足りません'
                    : null}
                </div>

                <PrimaryButton
                  disabled={isExceeded || status !== Status.NotReceived}
                  onClick={onReceive}
                >
                  {status === Status.Processing ? (
                    <LoadingIndicator />
                  ) : (
                    '送付する'
                  )}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectTransferView
