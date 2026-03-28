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
  customer: { name: string; email: string }
  admin: { name: string } | null
  message: string
  reply: string | null
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

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

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) return
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          reply: replyText,
        }),
      })

      if (!res.ok) throw new Error('Failed to send reply')

      toast({ title: 'Success', description: 'Reply sent successfully' })
      setReplyingTo(null)
      setReplyText('')
      fetchMessages()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send reply', variant: 'destructive' })
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="h-96" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-forest-700">Customer Messages</h1>
        <p className="text-forest-500">Respond to customer inquiries</p>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-forest-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-forest-700">{message.customer.name}</p>
                    <p className="text-xs text-forest-500">{message.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {message.reply ? (
                    <Badge variant="success">Replied</Badge>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                  <span className="text-xs text-forest-500">{formatDateTime(message.createdAt)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Message */}
              <div className="p-4 bg-forest-50 rounded-xl">
                <p className="text-sm text-forest-500 mb-1">Customer Message:</p>
                <p className="text-forest-700">{message.message}</p>
              </div>

              {/* Admin Reply */}
              {message.reply && (
                <div className="p-4 bg-gold-50 rounded-xl border border-gold-200">
                  <p className="text-sm text-gold-600 mb-1">
                    Your Reply {message.admin && `(${message.admin.name})`}:
                  </p>
                  <p className="text-forest-700">{message.reply}</p>
                </div>
              )}

              {/* Reply Form */}
              {!message.reply && (
                <>
                  {replyingTo === message.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyText('')
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => handleReply(message.id)} className="gap-2">
                          <Send className="h-4 w-4" /> Send Reply
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setReplyingTo(message.id)}
                      className="gap-2"
                    >
                      <MessageSquare className="h-4 w-4" /> Reply
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-forest-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-forest-300" />
              <p>No messages yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

