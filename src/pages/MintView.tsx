import React, { useCallback } from 'react'
import {usePrex} from '@prex0/prex-react'
import { PrimaryButton } from '../components/common'
import RegisterWallet from '../components/RegisterWallet'

enum Status {
  NotReceived,
  Processing,
  Received
}

const MintView = () => {
  const [status, setStatus] = React.useState<Status>(Status.NotReceived)
  const { user, mint } = usePrex()

  const onReceive = useCallback(async () => {
    if (!user) {
      throw new Error('Failed to generate key')
    }

    setStatus(Status.Processing)

    await mint(user.address, 100n)

    setStatus(Status.Received)
  }, [setStatus, user, mint])

  return (
    <div className="m-2 flex justify-center items-center">
      <div className="mt-8">
        <RegisterWallet>
          <div className="text-base space-y-3">
            <div>デモ用コイン配布</div>
            <div>100 Demo Coin を受け取ることができます。</div>

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
        </RegisterWallet>
      </div>
    </div>
  )
}

export default MintView
