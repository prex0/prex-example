import React, { useCallback } from 'react'
import { usePrex } from '@prex0/prex-react'
import { PrimaryButton, SubButton } from './common/Button'
import {
  LoadingIndicator,
  LoadingIndicatorDark
} from './common/LoadingIndicator'
import { PlatformOS, usePlatformOS } from '../hooks/usePlatformOS'
import icloudPng from '../assets/onboarding/icloud.png'
import { AccordionContainer } from './common/Accordion'
import { toErrorMessage } from '../utils/error'

const OnBoardingPasskey = ({ platform }: { platform: PlatformOS }) => {
  if (platform === PlatformOS.iOS) {
    return (
      <div className="mb-40">
        <div className="text-sm">
          パスキーを使うには、iOS 16、またはiPadOS 16以降が必要です。また、
          <a
            href="https://support.apple.com/ja-jp/guide/iphone/iph82d6721b2/17.0/ios/17.0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            iCloudキーチェーン
          </a>
          と
          <a
            href="https://support.apple.com/ja-jp/guide/iphone/iphd709a3c46/17.0/ios/17.0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            2ファクタ認証
          </a>
          もオンになっている必要があります。
        </div>
        <div className="my-6 text-sm">
          <AccordionContainer title="iCloudキーチェーンを設定するには？">
            <div>
              <div className="my-2">
                「設定」＞「[自分の名前]」＞「iCloud」＞「パスワードとキーチェーン」と選択してから「iCloudキーチェーン」をオンにし、画面に表示される指示に従います。
              </div>
              <img
                src={icloudPng}
                alt="パスワードとキーチェーン"
                className="w-[336px] rounded mx-auto"
              />
            </div>
          </AccordionContainer>
        </div>
      </div>
    )
  } else if (platform === PlatformOS.Mac) {
    return (
      <div className="text-sm">
        パスキーを使うには、macOS 13以降が必要です。また、
        <a
          href="https://support.apple.com/ja-jp/guide/mac-help/mh43699/14.0/mac/14.0"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          iCloudキーチェーン
        </a>
        を設定する必要があります。
      </div>
    )
  } else if (platform === PlatformOS.Android) {
    return (
      <div className="text-sm">
        詳しくは、
        <a
          href="https://support.google.com/android/answer/14124480?hl=ja"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          「パスキーでアプリやウェブサイトにログインする」
        </a>
        をご覧ください。
      </div>
    )
  } else {
    return (
      <div className="text-sm">
        申し訳ございません。お使いの環境では、Prexウォレットをご利用いただけません。
      </div>
    )
  }
}

const RegisterWallet = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = usePrex()

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="mt-10">
          <LoadingIndicatorDark />
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="w-full h-full p-4">
      {location.pathname === '/receive' ? (
        <div>
          <div>
            コインが届いています。
            ウォレットを登録して、コインを受け取りましょう。
          </div>
          <RegisterWalletInner />
        </div>
      ) : (
        <RegisterWalletInner />
      )}
    </div>
  )
}

const RegisterWalletInner = () => {
  const { error, isPasskeyAvailable, isLoading, createWallet, restoreWallet } =
    usePrex()

  const onRegister = useCallback(async () => {
    await createWallet()
  }, [createWallet])

  const onRecover = useCallback(async () => {
    await restoreWallet()
  }, [restoreWallet])

  const platformOs = usePlatformOS()

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="mt-10">
          <LoadingIndicatorDark />
        </div>
      </div>
    )
  }

  if (!isPasskeyAvailable) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="p-2 text-zinc-600 text-sm">
          このデバイスでは、
          <br />
          パスキーがサポートされていません。
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-center items-center">
        <div className="my-4 text-sm">
          <div className="text-base font-bold text-zinc-800">
            Prexウォレットを使用するには、端末にパスキーを登録する必要があります。
          </div>
          <div className="py-1 text-zinc-600">
            <OnBoardingPasskey platform={platformOs} />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 pb-6 z-999 left-0 w-full p-4 space-y-2 bg-zinc-50">
        <div className="text-xs text-red-700">
          {error ? toErrorMessage(error) : null}
        </div>

        <PrimaryButton onClick={onRegister} size="lg">
          {isLoading ? <LoadingIndicator /> : '登録する'}
        </PrimaryButton>

        <SubButton onClick={onRecover}>
          {isLoading ? <LoadingIndicator /> : 'すでにウォレットを持っている'}
        </SubButton>
      </div>
    </div>
  )
}

export default RegisterWallet
