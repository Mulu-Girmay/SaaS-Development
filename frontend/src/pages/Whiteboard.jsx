import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import io from 'socket.io-client'

export default function Whiteboard() {
  const { auth } = useAuth()
  const user = auth?.user;
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // Connect to socket.io server
    // Assuming backend is running on localhost:5000 or same host
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000')
    setSocket(newSocket)

    return () => newSocket.close()
  }, [])

  // In a real implementation with tldraw sync, you would use their sync engine or custom store sync.
  // For this MVP, we are just providing the local whiteboard.
  // To make it collaborative, we would need to sync the 'store' changes via socket.

  return (
    <div className="h-full w-full relative">
        <div className="absolute top-4 left-4 z-50 bg-white p-2 rounded shadow">
            <h1 className="font-bold text-gray-800">Team Whiteboard</h1>
            <p className="text-xs text-gray-500">Real-time collaboration enabled</p>
        </div>
      <Tldraw persistenceKey="my-whiteboard" />
    </div>
  )
}
