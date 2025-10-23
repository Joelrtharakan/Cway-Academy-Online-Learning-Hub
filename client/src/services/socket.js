import { io } from 'socket.io-client'
import { useAuthStore } from '../store'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect() {
    if (this.socket?.connected) return

    const token = useAuthStore.getState().token
    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
      auth: {
        token,
      },
    })

    this.socket.on('connect', () => {
      console.log('Connected to server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join_room', { roomId })
    }
  }

  leaveRoom(roomId) {
    if (this.socket) {
      this.socket.leave(roomId)
    }
  }

  sendMessage(roomId, text) {
    if (this.socket) {
      this.socket.emit('new_message', { roomId, text })
    }
  }

  onMessage(callback) {
    this.addListener('message', callback)
  }

  onUserTyping(callback) {
    this.addListener('user_typing', callback)
  }

  startTyping(roomId) {
    if (this.socket) {
      this.socket.emit('typing', { roomId })
    }
  }

  createPoll(courseId, question, options) {
    if (this.socket) {
      this.socket.emit('live_poll_create', { courseId, question, options })
    }
  }

  voteOnPoll(pollId, optionKey) {
    if (this.socket) {
      this.socket.emit('live_poll_vote', { pollId, optionKey })
    }
  }

  onPollCreated(callback) {
    this.addListener('poll_created', callback)
  }

  onPollResults(callback) {
    this.addListener('poll_results', callback)
  }

  addListener(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
      this.listeners.set(event, callback)
    }
  }

  removeListener(event) {
    if (this.socket) {
      const callback = this.listeners.get(event)
      if (callback) {
        this.socket.off(event, callback)
        this.listeners.delete(event)
      }
    }
  }

  removeAllListeners() {
    for (const [event, callback] of this.listeners) {
      if (this.socket) {
        this.socket.off(event, callback)
      }
    }
    this.listeners.clear()
  }
}

export const socketService = new SocketService()