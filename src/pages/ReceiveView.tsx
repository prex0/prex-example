import React, { useCallback, useEffect, useState } from 'react'
import { Address, Hex } from 'viem'
import {usePrex, splitAddress} from '@prex0/prex-react'
import {GetLinkTransferResponse, RequestStatus} from '@prex0/prex-client'
import Linkify from 'linkify-react'
import { Link } from 'react-router-dom'
import {
  PrimaryButton,
  LoadingIndicator,
  LoadingIndicatorDark
} from '../components/common'

enum Status {
  NotReceived,
  Processing,
  Received
}

const ReceiveView = () => {
  const [status, setStatus] = React.useState<Status>(Status.NotReceived)
  const params = new URLSearchParams(window.location.search)
  const [message, setMessage] = useState('')
  const [linkTransfer, setLinkTransfer] =
    useState<GetLinkTransferResponse | null>(null)

  const [amount, setAmount] = React.useState<bigint | undefined>(undefined)
  const [isNotFound, setIsNotFound] = React.useState(false)

  const id = params.get('id')
  const secret = params.get('s')

  const {
    nicknames,
    error,
    loadNicknames,
    getLinkTransfer,
    receiveLinkTransfer
  } = usePrex()

  const getDisplayName = (address: Address) => {
    return nicknames[address] || splitAddress(address)
  }

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
  }, [
    id,
    getLinkTransfer,
    setLinkTransfer,
    setAmount,
    loadNicknames
  ])

  const onReceive = useCallback(async () => {
    if (!secret) {
      throw new Error('Invalid secret')
    }

    if (id === null) {
      throw new Error('Link transfer is null')
    }

    setStatus(Status.Processing)

    if (await receiveLinkTransfer(id, secret as Hex)) {
      setStatus(Status.Received)

      window.location.href = '/'
    } else {
      setStatus(Status.NotReceived)
    }
  }, [setStatus, secret, id, receiveLinkTransfer])

  if (isNotFound) {
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
    <div className="m-2 p-2 flex justify-center items-center">
      <div className="mt-8">
        <div className="text-base space-y-3">
          {amount ? (
            <div>
              {linkTransfer ? getDisplayName(linkTransfer.request.sender) + 'から' : ''}
              {Number(amount)} demoCoin が届いています。
            </div>
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

          <div className="fixed bottom-10 z-999 left-0 w-full p-2">
            <div className="text-xs text-red-700">
              {error ? 'サーバの調子が悪いようです' : null}
            </div>
            <PrimaryButton
              disabled={status !== Status.NotReceived}
              onClick={onReceive}
            >
              {status === Status.Received ? (
                '受け取り完了'
              ) : status === Status.Processing ? (
                <LoadingIndicator />
              ) : (
                '受け取る'
              )}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReceiveView
