'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { formatDateTime } from '@/lib/utils'
import LoadingSpinner from '@/components/LoadingSpinner'

type Message = {
  id: string
  message: string
  reply: string | null
  createdAt: string
  admin: { name: string } | null
}

export default function CustomerMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch messages', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      })

      if (!res.ok) throw new Error('Failed to send')

      toast({ title: 'Sent', description: 'Your message has been sent!' })
      setNewMessage('')
      fetchMessages()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="h-96" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-forest-700">Contact Admin</h1>
        <p className="text-forest-500">Send messages and get support</p>
      </div>

      {/* Send New Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gold-500" />
            New Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={sendMessage} className="space-y-4">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here... (e.g., inquiries about bulk orders, product availability, etc.)"
              rows={4}
            />
            <Button type="submit" disabled={sending || !newMessage.trim()} className="gap-2">
              <Send className="h-4 w-4" />
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Message History */}
      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {/* Customer Message */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-forest-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-forest-700">You</span>
                      <span className="text-xs text-forest-500">{formatDateTime(msg.createdAt)}</span>
                    </div>
                    <div className="p-4 bg-forest-50 rounded-xl rounded-tl-none">
                      <p className="text-forest-700">{msg.message}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Reply */}
                {msg.reply ? (
                  <div className="flex gap-3 ml-8">
                    <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-gold-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gold-700">
                          Admin {msg.admin && `(${msg.admin.name})`}
                        </span>
                        <Badge variant="success" className="text-xs">Replied</Badge>
                      </div>
                      <div className="p-4 bg-gold-50 rounded-xl rounded-tl-none border border-gold-200">
                        <p className="text-forest-700">{msg.reply}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="ml-16 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-700">Awaiting admin response...</p>
                  </div>
                )}
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-forest-300" />
                <p className="text-forest-500">No messages yet. Send your first message above!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

