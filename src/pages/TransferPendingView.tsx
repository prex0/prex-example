import React, { useEffect, useState } from 'react'
import { usePrex } from '@prex0/prex-react'
import { GetLinkTransferResponse, RequestStatus } from '@prex0/prex-client'
import Linkify from 'linkify-react'
import { Link } from 'react-router-dom'
import { PrimaryButton, LoadingIndicatorDark } from '../components/common'
import { QRLink } from '../components/QRLink'
import { Header } from '../components/Header'
import { RWebShare } from 'react-web-share'
import { Clipboard } from '../components/common/Clipboard'
import { TOKEN_DECIMALS, UNIT_NAME } from '../constants'
import { formatUnits } from 'viem'

const TransferPendingView = () => {
  const params = new URLSearchParams(window.location.search)
  const [linkTransfer, setLinkTransfer] =
    useState<GetLinkTransferResponse | null>(null)

  const [message, setMessage] = useState('')

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
      <div className="p-4 flex justify-center items-center">
        <div className="mt-8">
          <div className="text-base space-y-3">
            <div className="flex justify-center">
              {amount ? (
                <div>
                  {formatUnits(amount, TOKEN_DECIMALS)} {UNIT_NAME}
                  を送付しています
                </div>
              ) : (
                <div>読み込み中です</div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-white">
              <div className="flex justify-center">
                {recipientLink.length > 0 ? (
                  <QRLink url={recipientLink} />
                ) : null}
              </div>
              <div className="flex justify-center text-xs text-center">
                こちらの２次元コードを、
                <br />
                相手に読み取ってもらってください。
              </div>
            </div>

            <div className="flex justify-center">
              <div className="mt-4 ">
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

            <div className="fixed bottom-10 z-999 left-0 w-full px-8 py-4">
              <div className="text-xs text-red-700">
                {error ? 'サーバの調子が悪いようです' : null}
              </div>

              <div className="flex flex-col justify-between space-y-1">
                <div className="h-10">
                  <RWebShare data={{ url: recipientLink }}>
                    <PrimaryButton>リンクをシェアする</PrimaryButton>
                  </RWebShare>
                </div>
                <Clipboard value={recipientLink}>
                  <div>リンクをコピーする</div>
                </Clipboard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferPendingView
