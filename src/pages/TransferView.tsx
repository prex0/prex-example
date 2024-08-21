import React, { useCallback, useEffect, useState } from 'react'
import { useBalance, usePrex } from '@prex0/prex-react'
import {
  PrimaryButton,
  SubButton,
  LoadingIndicator
} from '../components/common'
import { TextInput } from '../components/common/TextInput'
import { CoinBalance } from '../components/CoinBalance'
import { ERC20_ADDRESS, UNIT_NAME } from '../constants'
import { Header } from '../components/Header'
import { QRModal } from '../components/QRModal'
import { toErrorMessage } from '../utils/error'
import { RWebShare } from 'react-web-share'
import { getExpiration } from '../utils'

function getNumber(text: string) {
  const num = parseInt(text)

  if (!Number.isNaN(num)) {
    return num
  } else {
    return null
  }
}

const TransferView = () => {
  const [amountText, setAmount] = React.useState('0')
  const amount = getNumber(amountText)

  const [isQROpen, setIsQROpen] = React.useState(false)

  const [isCreatingMessageLoading, setIsCreatingMessageLoading] =
    useState(false)

  const [recipientLink, setRecipientLink] = useState('')
  const [message, setMessage] = useState(`コインをお送りします！`)
  const [error, setError] = useState<string | null>(null)
  const { approve, transferByLink } =
    usePrex()
  const {balance, allowance} = useBalance(ERC20_ADDRESS)

  const onTransfer = useCallback(async () => {
    setIsCreatingMessageLoading(true)

    if (amount === null || amount === 0) {
      throw new Error('amount must not be null')
    }

    if(allowance === null) {
      throw new Error('allowance must not be null')
    }

    if (allowance < 1000n) {
      try {
        await approve(ERC20_ADDRESS)
      } catch (e) {
        console.error(e)
        setError(toErrorMessage(e))
        setIsCreatingMessageLoading(false)
      }
    }

    // Create expiration timestamp in seconds
    const expiration = getExpiration()

    // Call Prex API to lock the amount of tokens in the smart contract
    try {
      const transferResponse = await transferByLink(
        ERC20_ADDRESS,
        BigInt(amount),
        expiration,
        {
          message
        }
      )

      const { id, secret } = transferResponse

      // Create recipient link
      const _recipientLink = `${
        location.origin
      }/receive?openExternalBrowser=1&id=${encodeURIComponent(
        id
      )}&s=${encodeURIComponent(secret)}`

      console.log(_recipientLink)

      setRecipientLink(_recipientLink)

      setIsCreatingMessageLoading(false)
    } catch(e) {
      console.error(e)
      setError(toErrorMessage(e))
      setIsCreatingMessageLoading(false)      
    }
  }, [amount, allowance, approve, message, setRecipientLink, transferByLink])

  if (balance === null) {
    return (
      <div className="m-2 flex justify-center items-center">
        <div className="mt-8">
          <LoadingIndicator />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="リンク送金" />
      <div className="p-4 flex justify-center items-center">
        <div className="text-base space-y-3">
          <div className="flex justify-center">
            <CoinBalance erc20Address={ERC20_ADDRESS} unit={UNIT_NAME} />
          </div>

          <div className="mt-4 pb-32 space-y-4">
            <div className="space-y-2">
              <div className="mt-8 text-zinc-700">
                送る枚数を決めてください。
              </div>
              <div className="flex justify-between items-center space-x-2 text-sm">
                <div className="basis-1/4">
                  <SubButton
                    onClick={() => {
                      setAmount('1')
                    }}
                  >
                    1
                  </SubButton>
                </div>
                <div className="basis-1/4">
                  <SubButton
                    onClick={() => {
                      setAmount('2')
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
                        onChange={e => setAmount(e.target.value)}
                      />
                    </div>

                    <span className="text-black">{UNIT_NAME}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-zinc-700">メッセージ</div>
              <TextInput
                placeholder="メッセージを入力してください"
                value={message}
                onChange={setMessage}
              />
            </div>

            {recipientLink.length > 0 ? (
              <QRModal
                isOpen={isQROpen}
                onRequestClose={() => {
                  setIsQROpen(false)
                }}
                url={recipientLink}
              />
            ) : null}
          </div>

          <div className="fixed bottom-10 z-999 left-0 w-full p-4 space-y-4">
            <div className="text-xs text-red-700">
              {error}
              {amount === null ? '数量が不正です' : null}
              {amount !== null && amount > Number(balance)
                ? '残高が足りません'
                : null}
            </div>

            {recipientLink.length > 0 ? (
              <div className="flex justify-between space-x-1">
                <PrimaryButton
                  onClick={() => {
                    setIsQROpen(true)
                  }}
                >
                  QRを表示する
                </PrimaryButton>
                <RWebShare data={{ url: recipientLink }}>
                  <PrimaryButton>他のツール</PrimaryButton>
                </RWebShare>
              </div>
            ) : (
              <div className="h-10">
                <PrimaryButton
                  disabled={
                    amount === null ||
                    amount === 0 ||
                    amount > Number(balance)
                  }
                  onClick={onTransfer}
                >
                  {isCreatingMessageLoading ? (
                    <LoadingIndicator />
                  ) : (
                    'メッセージを作る'
                  )}
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferView
