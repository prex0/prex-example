export function toErrorMessage(error: Error) {
  if (error.message.includes('Failed to fetch')) {
    return 'インターネットに繋がってない可能性があります'
  } else if (error.message.includes('Not Found')) {
    return 'ウォレットが見つかりません'
  } else {
    return 'サーバの調子が悪いようです'
  }
}
