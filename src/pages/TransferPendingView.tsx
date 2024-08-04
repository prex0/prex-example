import React, { useCallback, useEffect, useState } from 'react'
import {usePrex} from '@prex0/prex-react'
import { GetLinkTransferResponse, RequestStatus } from '@prex0/prex-client'
import Linkify from 'linkify-react'
import { Link } from 'react-router-dom'
import { PrimaryButton, LoadingIndicatorDark } from '../components/common'
import { QRModal } from '../components/QRModal'
import { Header } from '../components/Header'

const TransferPendingView = () => {
  const params = new URLSearchParams(window.location.search)
  const [linkTransfer, setLinkTransfer] =
    useState<GetLinkTransferResponse | null>(null)

  const [message, setMessage] = useState('')
  const [isQROpen, setIsQROpen] = React.useState(false)

  const [amount, setAmount] = React.useState<bigint | undefined>(undefined)
  const [isNotFound, setIsNotFound] = React.useState(false)

  const id = params.get('id')
  const secret = params.get('s')

  const { error, getLinkTransfer } = usePrex()

  const recipientLink =
    !!id && !!secret
      ? `${
          location.origin
        }/receive?openExternalBrowser=1&id=${encodeURIComponent(
          id
        )}&s=${encodeURIComponent(secret)}`
      : ''

  useEffect(() => {
    if (id && secret) {
      getLinkTransfer(id, secret).then(message => {
        if (message === null) {
          setIsNotFound(true)
          return
        }

        setLinkTransfer(message)
        setMessage(message.message.messageBody.message)

        setAmount(message.request.amount)
      })
    }
  }, [id, getLinkTransfer, setMessage, setAmount])

  const isShareAvailable = !!navigator.share && navigator.canShare()

  const onSendByShare = useCallback(async () => {
    const textMessage = `${recipientLink}`

    try {
      await navigator.share({
        text: textMessage
      })
    } catch (e) {
      console.error(e)
    }
  }, [recipientLink])

  if (recipientLink === '' || isNotFound) {
    return (
      <div className="m-2 flex justify-center items-center">
        <div className="mt-8">
          <div className="text-base space-y-3">
            <div>このリンクは見つかりません</div>
            <div>
              <Link to="/" className="text-blue-600 underline">
                ホームに戻る。
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (linkTransfer === null) {
    return <LoadingIndicatorDark />
  }

  if (linkTransfer.request.status !== RequestStatus.Pending) {
    return (
      <div className="m-2 flex justify-center items-center">
        <div className="mt-8">
          <div className="text-base space-y-3">
            <div>受け取り済みです</div>
            <PrimaryButton
              onClick={() => {
                window.close()
              }}
            >
              閉じる
            </PrimaryButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="リンク送付中" returnPath="/history" />
      <div className="m-2 p-2 flex justify-center items-center">
        <div className="mt-8">
          <div className="text-base space-y-3">
            {amount ? (
              <div>{Number(amount)} DemoCoinを送付しています</div>
            ) : (
              <div>読み込み中です</div>
            )}

            <div className="flex justify-center">
              <div className="mt-8 ">
                <div className="text-sm text-gray">メッセージ</div>
                <div className="text-base text-black">
                  <Linkify
                    as="p"
                    options={{
                      className: 'text-blue-500 underline'
                    }}
                  >
                    {message}
                  </Linkify>
                </div>
              </div>
            </div>

            <div className="pb-24 flex justify-start items-center">
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

            <div className="fixed bottom-10 z-999 left-0 w-full p-2">
              <div className="text-xs text-red-700">
                {error ? 'サーバの調子が悪いようです' : null}
              </div>

              <div className="flex justify-between space-x-1">
                <PrimaryButton
                  onClick={() => {
                    setIsQROpen(true)
                  }}
                >
                  QRを表示する
                </PrimaryButton>
                <PrimaryButton onClick={onSendByShare} disabled={!isShareAvailable}>
                  他のツール
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferPendingView
