import { TIME_UNTIL_EXPIRATION } from '../constants'

export function getExpiration() {
  const expiration =
    Math.floor(new Date().getTime() / 1000) + TIME_UNTIL_EXPIRATION

  return expiration
}
