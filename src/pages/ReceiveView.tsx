import React, { useCallback, useState } from 'react'
import { Address, Hex } from 'viem'
import { usePrex, splitAddress } from '@prex0/prex-react'
import { GetLinkTransferResponse, RequestStatus } from '@prex0/prex-client'
import Linkify from 'linkify-react'
import { Link } from 'react-router-dom'
import {
  PrimaryButton,
  LoadingIndicator,
  LoadingIndicatorDark
} from '../components/common'
import { UNIT_NAME } from '../constants'
import { useLinkTransfer } from '../hooks/useLinkTransfer'
import { toErrorMessage } from '../utils/error'

enum Status {
  NotReceived,
  Processing,
  Received
}

const ReceiveView = () => {
  const params = new URLSearchParams(window.location.search)

  const id = params.get('id')
  const secret = params.get('s')

  if (id === null || secret === null) {
    return (
      <div className="mt-20">
        <LoadingIndicatorDark />
      </div>
    )
  }

  return <ReceiveViewWithParams id={id} secret={secret} />
}

const ReceiveViewWithParams = ({
  id,
  secret
}: {
  id: string
  secret: string
}) => {
  const linkTransfer = useLinkTransfer(id, secret)

  if (linkTransfer.isLoading || linkTransfer.data === undefined) {
    return (
      <div className="mt-20">
        <LoadingIndicatorDark />
      </div>
    )
  }

  if (linkTransfer.data === null) {
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

  return (
    <ReceiveViewWithLinkTransfer
      id={id}
      secret={secret}
      linkTransfer={linkTransfer.data}
    />
  )
}

const ReceiveViewWithLinkTransfer = ({
  id,
  secret,
  linkTransfer
}: {
  id: string
  secret: string
  linkTransfer: GetLinkTransferResponse
}) => {
  const [status, setStatus] = React.useState<Status>(Status.NotReceived)

  const { nicknames, receiveLinkTransfer } = usePrex()
  const [error, setError] = useState<string | null>(null)

  const amount = linkTransfer.request.amount
  const message = linkTransfer.message.messageBody.message

  const getDisplayName = (address: Address) => {
    return nicknames[address] || splitAddress(address)
  }

  const onReceive = useCallback(async () => {
    if (!secret) {
      throw new Error('Invalid secret')
    }

    if (id === null) {
      throw new Error('Link transfer is null')
    }

    setStatus(Status.Processing)

    try {
      receiveLinkTransfer(id, secret as Hex)

      setStatus(Status.Received)

      window.location.href = '/'
    }catch(e) {
      setError(toErrorMessage(e))
      setStatus(Status.NotReceived)
    }
  }, [setStatus, secret, id, receiveLinkTransfer])

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
              {linkTransfer
                ? getDisplayName(linkTransfer.request.sender) + 'から'
                : ''}
              {Number(amount)} {UNIT_NAME} が届いています。
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
              {error}
            </div>
            <div className="h-10">
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
    </div>
  )
}

export default ReceiveView
