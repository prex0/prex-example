import { PrexSDKError } from '@prex0/prex-react'

export function toErrorMessage(error: unknown) {
  if (error instanceof PrexSDKError) {
    if (error.error === 'fetch_error') {
      return 'インターネットに繋がってない可能性があります'
    } else if (error.error === 'wallet_not_found') {
      return 'ウォレットが見つかりません'
    } else if (error.error === 'passkey_not_allowed') {
      return 'パスキーの使用がキャンセルされました'
    } else {
      return 'サーバの調子が悪いようです'
    }
  } else {
    return 'サーバの調子が悪いようです'
  }
}
