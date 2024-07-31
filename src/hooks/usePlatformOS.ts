export enum PlatformOS {
  Android,
  iOS,
  Mac,
  Other
}

export function usePlatformOS() {
  const ua = window.navigator.userAgent.toLowerCase()

  if (ua.indexOf('windows nt') !== -1) {
    return PlatformOS.Other
  } else if (ua.indexOf('android') !== -1) {
    return PlatformOS.Android
  } else if (ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1) {
    return PlatformOS.iOS
  } else if (ua.indexOf('mac os x') !== -1) {
    return PlatformOS.Mac
  } else {
    return PlatformOS.Other
  }
}
