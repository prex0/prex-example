import React, { useCallback } from 'react'
import { usePrex } from '@prex0/prex-react'
import { PrimaryButton } from '../components/common'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'

enum Status {
  NotReceived,
  Processing,
  Received
}

const MintView = () => {
  const [status, setStatus] = React.useState<Status>(Status.NotReceived)
  const { wallet, mint } = usePrex()
  const navigate = useNavigate()

  const onReceive = useCallback(async () => {
    if (!wallet) {
      throw new Error('Failed to generate key')
    }

    setStatus(Status.Processing)

    await mint(wallet.address, 10n * 10n ** 18n)

    setStatus(Status.Received)

    setTimeout(() => {
      navigate('/')
    }, 100)
  }, [setStatus, wallet, mint])

  return (
    <div>
      <Header title="デモ用コイン配布" />
      <div className="m-2 p-2 flex justify-center items-center">
        <div className="mt-8">
          <div className="text-base space-y-3">
            <div className="text-base font-bold">デモ用コイン配布</div>
            <div>
              10 Demo Coin
              を受け取ることができます。テストネットでのみ利用可能です。
            </div>

            <div className="fixed bottom-10 z-999 left-0 w-full p-2">
              <PrimaryButton
                disabled={status !== Status.NotReceived}
                onClick={onReceive}
              >
                {status === Status.Received
                  ? '受け取り完了'
                  : status === Status.Processing
                    ? '...'
                    : '受け取る'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintView
