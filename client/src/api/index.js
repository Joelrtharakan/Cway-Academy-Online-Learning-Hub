import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage as fallback
    const token = localStorage.getItem('auth-storage')
      ? JSON.parse(localStorage.getItem('auth-storage')).state?.token
      : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const authData = localStorage.getItem('auth-storage')
        const refreshToken = authData ? JSON.parse(authData).state?.token : null

        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh', { refreshToken })
          const { accessToken } = response.data

          // Update localStorage
          const currentAuth = JSON.parse(localStorage.getItem('auth-storage'))
          currentAuth.state.token = accessToken
          localStorage.setItem('auth-storage', JSON.stringify(currentAuth))

          originalRequest.headers.Authorization = `Bearer ${accessToken}`

          return api(originalRequest)
        }
      } catch (refreshError) {
        // Clear auth data and redirect to login
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api