import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuthStore } from '../store'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const { user, token } = useAuthStore()

  useEffect(() => {
    if (user && token) {
      // Create socket connection
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000', {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
      })

      // Connection events
      newSocket.on('connect', () => {
        console.log('Connected to server')
        setIsConnected(true)
      })

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server')
        setIsConnected(false)
      })

      // User events
      newSocket.on('users:online', (users) => {
        setOnlineUsers(users)
      })

      newSocket.on('user:joined', (user) => {
        setOnlineUsers(prev => [...prev.filter(u => u._id !== user._id), user])
      })

      newSocket.on('user:left', (userId) => {
        setOnlineUsers(prev => prev.filter(u => u._id !== userId))
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
        setSocket(null)
        setIsConnected(false)
        setOnlineUsers([])
      }
    }
  }, [user, token])

  // Join/leave course room
  const joinCourse = (courseId) => {
    if (socket && isConnected) {
      socket.emit('course:join', courseId)
    }
  }

  const leaveCourse = (courseId) => {
    if (socket && isConnected) {
      socket.emit('course:leave', courseId)
    }
  }

  // Discussion methods
  const sendMessage = (courseId, message) => {
    if (socket && isConnected) {
      socket.emit('discussion:send', { courseId, message })
    }
  }

  const startTyping = (courseId) => {
    if (socket && isConnected) {
      socket.emit('discussion:typing:start', courseId)
    }
  }

  const stopTyping = (courseId) => {
    if (socket && isConnected) {
      socket.emit('discussion:typing:stop', courseId)
    }
  }

  // Poll methods
  const createPoll = (courseId, pollData) => {
    if (socket && isConnected) {
      socket.emit('poll:create', { courseId, ...pollData })
    }
  }

  const votePoll = (pollId, optionId) => {
    if (socket && isConnected) {
      socket.emit('poll:vote', { pollId, optionId })
    }
  }

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinCourse,
    leaveCourse,
    sendMessage,
    startTyping,
    stopTyping,
    createPoll,
    votePoll,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}