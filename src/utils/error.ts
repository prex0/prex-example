export function toErrorMessage(error: Error) {
  if (error.message.includes('Failed to fetch')) {
    return 'インターネットに繋がってない可能性があります'
  } else {
    return 'サーバの調子が悪いようです'
  }
}
