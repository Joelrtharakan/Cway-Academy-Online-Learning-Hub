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

const useCourseStore = create(
  devtools(
    persist(
      (set, get) => ({
        enrolledCourses: [],

        enrollCourse: (course) => {
          set((state) => {
            const existingCourse = state.enrolledCourses.find(c => c.id === course.id)
            if (!existingCourse) {
              const enrolledCourse = {
                ...course,
                enrollment: {
                  progress: 0,
                  enrolledAt: new Date(),
                  currentLesson: 0,
                  completedLessons: [],
                  lastAccessed: new Date(),
                }
              }
              return {
                enrolledCourses: [...state.enrolledCourses, enrolledCourse]
              }
            }
            return state
          })
        },

        updateProgress: (courseId, lessonId, progress) => {
          set((state) => ({
            enrolledCourses: state.enrolledCourses.map(course => {
              if (course.id === courseId) {
                const completedLessons = course.enrollment?.completedLessons || []
                const newCompletedLessons = lessonId && !completedLessons.includes(lessonId)
                  ? [...completedLessons, lessonId]
                  : completedLessons

                const totalLessons = course.lessons?.length || 1
                const newProgress = Math.max(
                  course.enrollment?.progress || 0,
                  Math.round((newCompletedLessons.length / totalLessons) * 100)
                )

                return {
                  ...course,
                  enrollment: {
                    ...course.enrollment,
                    progress: newProgress,
                    currentLesson: lessonId || course.enrollment?.currentLesson || 0,
                    completedLessons: newCompletedLessons,
                    lastAccessed: new Date(),
                    completedAt: newProgress === 100 ? new Date() : course.enrollment?.completedAt
                  }
                }
              }
              return course
            })
          }))
        },

        setCurrentLesson: (courseId, lessonId) => {
          set((state) => ({
            enrolledCourses: state.enrolledCourses.map(course => {
              if (course.id === courseId) {
                return {
                  ...course,
                  enrollment: {
                    ...course.enrollment,
                    currentLesson: lessonId,
                    lastAccessed: new Date(),
                  }
                }
              }
              return course
            })
          }))
        },

        getEnrolledCourse: (courseId) => {
          return get().enrolledCourses.find(course => course.id === courseId)
        },

        isEnrolled: (courseId) => {
          return get().enrolledCourses.some(course => course.id === courseId)
        },

        getProgress: (courseId) => {
          const course = get().enrolledCourses.find(c => c.id === courseId)
          return course?.enrollment?.progress || 0
        },

        unenrollCourse: (courseId) => {
          set((state) => ({
            enrolledCourses: state.enrolledCourses.filter(course => course.id !== courseId)
          }))
        },

        clearEnrolledCourses: () => {
          set({ enrolledCourses: [] })
        }
      }),
      {
        name: 'course-storage',
        partialize: (state) => ({
          enrolledCourses: state.enrolledCourses,
        }),
      }
    ),
    { name: 'course-store' }
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

export { useAuthStore, useCourseStore, useUIStore }