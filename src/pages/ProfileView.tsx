import React, { useCallback } from 'react'
import { usePrex } from '@prex0/prex-react'
import {
  LoadingIndicatorDark,
  TextInput,
  PrimaryButton
} from '../components/common'
import { Header } from '../components/Header'
import { Container } from '../components/ui/Container'

const MAX_NICKNAME_LENGTH = 32

const ProfileView = () => {
  const { wallet } = usePrex()

  console.log(wallet)

  return (
    <div>
      <Header title="プロフィール" />
      <Container>
        <div className="text-base space-y-3">
          <div className="fixed bottom-8 z-999 left-0 w-full p-2">
            {wallet ? (
              <NickNameForm nickname={wallet.nickname} />
            ) : (
              <LoadingIndicatorDark />
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

const NickNameForm = ({ nickname }: { nickname: string }) => {
  const { updateNickName } = usePrex()

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isSaved, setIsSaved] = React.useState<boolean>(false)

  const [nickName, setNickName] = React.useState<string>(nickname)

  const onUpdate = useCallback(async () => {
    setIsLoading(true)
    await updateNickName(nickName)
    setIsLoading(false)
    setIsSaved(true)
  }, [updateNickName, nickName])

  return (
    <div className="px-3 py-2 space-y-3">
      <div className="text-sm">ニックネーム</div>
      <div className="text-xs">
        ニックネームは、他の人も見ることができます。
      </div>
      <TextInput
        placeholder="ニックネーム"
        value={nickName}
        onChange={setNickName}
      />
      <PrimaryButton
        onClick={onUpdate}
        disabled={
          nickName.length === 0 ||
          nickName.length > MAX_NICKNAME_LENGTH ||
          isLoading
        }
      >
        {isLoading ? '保存中...' : '保存'}
      </PrimaryButton>
      <div className="text-xs text-green-600 h-6">
        {isSaved ? '保存に成功しました' : ' '}
      </div>
    </div>
  )
}

export default ProfileView
