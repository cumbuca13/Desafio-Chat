'use client'
import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface Message {
  id?: number;
  content: string;
  userId: number;
  user?: { name: string };
  createdAt?: string;
  isSystem?: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [userId, setUserId] = useState<number>(1) // Mock de usuário logado
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io('http://localhost:3000')
    socketRef.current = socket

    // Persistência: Carregar histórico
    socket.on('history', (history: Message[]) => {
      setMessages(history)
    })

    // Indicador de Presença
    socket.on('presence', (data: { message: string }) => {
      setMessages(prev => [...prev, { content: data.message, userId: 0, isSystem: true }])
    })

    socket.on('receiveMessage', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const sendMessage = () => {
    if (input.trim() && socketRef.current) {
      socketRef.current.emit('sendMessage', {
        content: input,
        userId: userId
      })
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-zinc-50 dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Chat Desafio</h1>
      
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-2 flex ${msg.isSystem ? 'justify-center' : (msg.userId === userId ? 'justify-end' : 'justify-start')}`}
          >
            {msg.isSystem ? (
              <span className="text-xs text-zinc-500 italic bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded-full">
                {msg.content}
              </span>
            ) : (
              <div 
                className={`max-w-[70%] p-3 rounded-lg ${
                  // Estilização Condicional: Diferencie visualmente as mensagens enviadas por "Você"
                  msg.userId === userId 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-bl-none'
                }`}
              >
                <div className="text-xs font-bold mb-1">
                  {msg.userId === userId ? 'Você' : (msg.user?.name || `Usuário ${msg.userId}`)}
                </div>
                <div>{msg.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Digite sua mensagem..."
          className="flex-1 p-2 border rounded dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Enviar
        </button>
      </div>
      
      <div className="mt-4 text-xs text-zinc-500">
        Logado como Usuário ID: 
        <input 
          type="number" 
          value={userId} 
          onChange={(e) => setUserId(Number(e.target.value))}
          className="ml-2 w-12 bg-transparent border-b border-zinc-400 focus:outline-none"
        /> (Troque para simular outro usuário)
      </div>
    </div>
  )
}
