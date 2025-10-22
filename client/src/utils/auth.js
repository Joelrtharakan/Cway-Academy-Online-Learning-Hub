import { useAuthStore } from '../store'

export const getAuthToken = () => {
  return useAuthStore.getState().token
}

export const refreshAuthToken = (newToken) => {
  useAuthStore.getState().refreshToken(newToken)
}

export const logoutUser = () => {
  useAuthStore.getState().logout()
}