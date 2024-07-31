import React, { useCallback, useEffect, useState } from 'react'
import {usePrex} from '@prex0/prex-react'
import { PrimaryButton, SubButton, LoadingIndicator } from '../components/common'
import { TextInput } from '../components/common/TextInput'
import { CoinBalance } from '../components/CoinBalance'
import { ERC20_ADDRESS } from '../constants'
import { Header } from '../components/Header'
import { QRModal } from '../components/QRModal'
import { LocalModal } from '../components/LocalModal'
import { toErrorMessage } from '../utils/error'

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
  const [isLocalOpen, setIsLocalOpen] = React.useState(false)

  const [isCreatingMessageLoading, setIsCreatingMessageLoading] =
    useState(false)

  const [recipientLink, setRecipientLink] = useState('')
  const [message, setMessage] = useState(`コインをお送りします！`)
  const { error, approve, transferByLink, loadBalance, allowance, balance } = usePrex()

  useEffect(() => {
    loadBalance(ERC20_ADDRESS)
  }, [loadBalance])


  const onTransfer = useCallback(async () => {
    setIsCreatingMessageLoading(true)


    if (amount === null || amount === 0) {
      throw new Error('amount must not be null')
    }

    if (allowance[ERC20_ADDRESS] < 1000n) {
      try {
        await approve(ERC20_ADDRESS)
      } catch (e) {
        console.error(e)
        setIsCreatingMessageLoading(false)
      }
    }

    const expiration = Math.floor(new Date('2024-08-31').getTime() / 1000)

    const transferResponse = await transferByLink(
      ERC20_ADDRESS,
      BigInt(amount),
      {
        message
      },
      expiration
    )

    if (transferResponse) {
      const { id, secret } = transferResponse
      const _recipientLink = `${
        location.origin
      }/receive?openExternalBrowser=1&id=${encodeURIComponent(
        id
      )}&s=${encodeURIComponent(secret)}`

      console.log(_recipientLink)

      setRecipientLink(_recipientLink)

      setIsCreatingMessageLoading(false)
    } else {
      setIsCreatingMessageLoading(false)
    }
  }, [
    amount,
    allowance,
    approve,
    message,
    setRecipientLink,
    transferByLink
  ])

  const isShareAvailable = !!navigator.share && navigator.canShare()

  const onSendByShare = useCallback(async () => {
    const textMessage = `${recipientLink}`

    if(!isShareAvailable) {
      setIsLocalOpen(true)
      return
    }
    
    try {
      await navigator.share({
        text: textMessage
      })
    } catch (e) {
      console.error(e)
    }
  }, [recipientLink])

  if (balance[ERC20_ADDRESS] === undefined) {
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
            <CoinBalance erc20Address={ERC20_ADDRESS} unit={'demoCoin'} />
          </div>

          <div className="mt-4 pb-32 space-y-4">
            <div className="space-y-2">
              <div className="mt-8 text-zinc-700">送る枚数を決めてください。</div>
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

                    <span className="text-black">demoCoin</span>
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

            {recipientLink.length > 0 ? (
              <LocalModal
                isOpen={isLocalOpen}
                onRequestClose={() => {
                  setIsLocalOpen(false)
                }}
                url={recipientLink}
              />
            ) : null}
          </div>

          <div className="fixed bottom-10 z-999 left-0 w-full p-4 space-y-4">
            <div className="text-xs text-red-700">
              {error ? toErrorMessage(error) : null}
              {amount === null ? '数量が不正です' : null}
              {amount !== null && amount > Number(balance[ERC20_ADDRESS])
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
                <PrimaryButton onClick={onSendByShare}>
                  他のツール
                </PrimaryButton>
              </div>
            ) : (
              <PrimaryButton
                disabled={
                  amount === null ||
                  amount === 0 ||
                  amount > Number(balance[ERC20_ADDRESS])
                }
                onClick={onTransfer}
              >
                {isCreatingMessageLoading ? (
                  <LoadingIndicator />
                ) : (
                  'メッセージを作る'
                )}
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferView
