import { useCallback } from 'react'
import {usePrex} from '@prex0/prex-react'
import { Header } from '../components/Header'
import { PrimaryButton } from '../components/common'

const SettingsView = () => {
  const { user, recoverWallet } = usePrex()

  const onRecoverWallet = useCallback(() => {
    recoverWallet()
  }, [recoverWallet])

  return (
    <div>
      <Header title="設定" />
      <div className="w-full h-full">
        <div className="mt-14 mx-4 text-sm space-y-3 text-zinc-800">
          <div>
            <div>現在のアドレス：</div>
            <div>{user ? user.address : null}</div>
          </div>
          <div>
            パスキーを誤って複数登録してしまった場合には、こちらでウォレットを切り替えてください。
            <br />
            パスキーが複数登録されている場合は、「ウォレットを切り替える」ボタンをクリックすると、OSのパスキー選択画面が表示されます。
            一つしか登録されていない場合にも、認証画面が表示されますが、認証していただいても何も起こりません。
          </div>

          <PrimaryButton onClick={onRecoverWallet}>
            ウォレットを切り替える
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default SettingsView
