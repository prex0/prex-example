import { useCallback, useEffect, useState } from 'react'
import {usePrex} from '@prex0/prex-react'
import * as QRCode from 'qrcode'
import { LoadingIndicator, SubButton } from '../components/common'
import { Header } from '../components/Header'

const DirectReceiveView = () => {
  const { user } = usePrex()

  const [url, setUrl] = useState('')
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const url = `${location.origin}/dtransfer?r=${user.address}`

      setUrl(url)

      QRCode.toDataURL(url).then((image: string) => {
        setSrc(image)
      })
    }
  }, [user, setSrc])

  const onSendByShare = useCallback(async () => {
    await navigator.share({
      text: url
    })
  }, [url])

  return (
    <div>
      <Header title="受け取り" />
      <div className="m-2 p-3 flex justify-center items-center">
        <div className="mt-0">
          <div className="flex flex-col justify-center space-y-3">
            <div>
              コインを受け取るには、二次元コードを相手に読み取ってもらってください
            </div>
            <div className="p-4 flex justify-center shadow">
              {src ? <img src={src} alt="qr code" /> : <LoadingIndicator />}
            </div>
            <div>
              <SubButton onClick={onSendByShare}>
                受け取りリンクを共有する
              </SubButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectReceiveView
