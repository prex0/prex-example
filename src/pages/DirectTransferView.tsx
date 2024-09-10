import React, { useCallback, useEffect, useState } from 'react'
import { Address, parseUnits } from 'viem'
import { usePrex, splitAddress } from '@prex0/prex-react'
import dayjs from 'dayjs'
import { PrimaryButton, LoadingIndicator, SubTitle } from '../components/common'
import { CoinBalance } from '../components/CoinBalance'
import {
  ERC20_ADDRESS,
  TOKEN_DECIMALS,
  TOKEN_NAME,
  UNIT_NAME
} from '../constants'
import { Header } from '../components/Header'
import { toErrorMessage } from '../utils/error'
import { AmountForm } from '../components/AmountForm'
import { Container } from '../components/ui/Container'

enum Status {
  NotTransferred,
  Processing,
  Transferred
}

const DirectTransferViewInner = () => {
  const [status, setStatus] = React.useState<Status>(Status.NotTransferred)

  const params = new URLSearchParams(window.location.search)
  const [amount, setAmount] = React.useState<number | null>(0)
  const [error, setError] = useState<string | null>(null)

  const {
    wallet,
    balanceMap,
    allowanceMap,
    loadBalance,
    nicknames,
    transfer,
    approve,
    loadNicknames
  } = usePrex()

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

  const onTransferClicked = useCallback(async () => {
    if (!recipient) {
      throw new Error('Invalid request')
    }

    if (amount === null || amount === 0) {
      throw new Error('amount must not be null')
    }

    setStatus(Status.Processing)

    if (allowanceMap[ERC20_ADDRESS] < 1000n) {
      try {
        await approve(ERC20_ADDRESS)
      } catch (e) {
        setError(toErrorMessage(e))

        setStatus(Status.NotTransferred)

        return
      }
    }

    try {
      await transfer(
        ERC20_ADDRESS,
        recipient as Address,
        parseUnits(amount.toString(), TOKEN_DECIMALS)
      )

      setStatus(Status.Transferred)
    } catch (e) {
      setError(toErrorMessage(e))
    }
  }, [transfer, setStatus, amount, recipient])

  if (balanceMap[ERC20_ADDRESS] === undefined) {
    return (
      <div className="m-2 flex justify-center items-center">
        <div className="mt-8">
          <LoadingIndicator />
        </div>
      </div>
    )
  }

  const isAmountZero = amount === null || amount === 0
  const isExceeded =
    isAmountZero ||
    parseUnits(amount.toString(), TOKEN_DECIMALS) > balanceMap[ERC20_ADDRESS]

  const now = dayjs()

  if (recipient === null) {
    return (
      <div className="mt-8">
        <div className="text-base space-y-3">
          <div>
            <div className="flex justify-center">
              <SubTitle>送付先が不明です。</SubTitle>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const recipientName = nicknames[recipient]
    ? nicknames[recipient]
    : splitAddress(recipient)

  if (status === Status.Transferred) {
    return (
      <div className="mt-12">
        <div className="text-base space-y-4">
          <div className="flex justify-center">
            <div className="text-center text-base">{recipientName}</div>
          </div>

          <div className="flex justify-center">
            <div className="text-center text-base">
              {now.format('YYYY年MM月DD日 HH時mm分ss秒')}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-center text-2xl font-bold">
              {amount} {UNIT_NAME}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-40 p-2 rounded-2xl bg-green-700 text-white text-center text-base font-bold">
              送付完了
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="text-base space-y-3">
        <div>
          <div className="flex justify-center">
            <SubTitle>送付先：{recipientName}</SubTitle>
          </div>

          <div className="flex justify-center">
            <div className="text-center">{TOKEN_NAME}を送付します。</div>
          </div>
        </div>

        <div className="flex justify-center">
          <CoinBalance erc20Address={ERC20_ADDRESS} unit={UNIT_NAME} />
        </div>

        <div className="fixed bottom-10 z-999 left-0 w-full p-2">
          <div className="space-y-3">
            <div className="mt-8 text-zinc-700">送る枚数を決めてください。</div>
            <AmountForm symbol={UNIT_NAME} setAmount={setAmount} />

            <div className="text-xs text-red-700">
              {error}
              {isAmountZero
                ? '数量を入力してください'
                : isExceeded
                  ? '残高が足りません'
                  : null}
            </div>

            <PrimaryButton
              disabled={isExceeded || status !== Status.NotTransferred}
              onClick={onTransferClicked}
            >
              {status === Status.Processing ? <LoadingIndicator /> : '送付する'}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}

const DirectTransferView = () => {
  return (
    <div>
      <Header title="送付" />
      <Container>
        <DirectTransferViewInner />
      </Container>
    </div>
  )
}

export default DirectTransferView
