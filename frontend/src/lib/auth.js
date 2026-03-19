const ACCESS_TOKEN_KEY = 'factoryiq.accessToken'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function isAuthed() {
  return Boolean(getAccessToken())
}

