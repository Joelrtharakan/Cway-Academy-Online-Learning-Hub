import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,

        login: (userData) => {
          set({
            user: userData.user,
            token: userData.accessToken,
            isAuthenticated: true,
          })
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        },

        updateUser: (userData) => {
          set((state) => ({
            user: { ...state.user, ...userData },
          }))
        },

        refreshToken: (newToken) => {
          set({ token: newToken })
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
)

const useUIStore = create(
  devtools(
    (set) => ({
      theme: 'light',
      sidebarOpen: false,

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }))
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        }))
      },
    }),
    { name: 'ui-store' }
  )
)

export { useAuthStore, useUIStore }