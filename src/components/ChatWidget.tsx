'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import socketService from '@/services/socket';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ChatWidgetProps {
  conversationId?: string;
  recipientId?: string;
  recipientName?: string;
}

export default function ChatWidget({ conversationId, recipientId, recipientName }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { user } = useAuth();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join chat room and listen for messages
  useEffect(() => {
    if (isOpen && conversationId) {
      socketService.joinChatRoom(conversationId);

      // Listen for incoming messages
      socketService.onMessage((message) => {
        setMessages(prev => [...prev, {
          id: message.id || Date.now().toString(),
          senderId: message.senderId,
          senderName: message.senderName,
          message: message.message,
          timestamp: new Date(message.timestamp),
          read: false
        }]);
      });

      // Listen for typing indicators
      socketService.onTyping((data) => {
        if (data.userId !== user?.id) {
          setOtherUserTyping(data.isTyping);
          if (data.isTyping) {
            setTimeout(() => setOtherUserTyping(false), 3000);
          }
        }
      });

      return () => {
        socketService.off('message');
        socketService.off('typing');
      };
    }
  }, [isOpen, conversationId, user]);

  const handleTyping = (value: string) => {
    setNewMessage(value);

    if (!isTyping && conversationId) {
      setIsTyping(true);
      socketService.emitTyping(conversationId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (conversationId) {
        socketService.emitTyping(conversationId, false);
      }
    }, 1000);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && conversationId) {
      const message = {
        id: Date.now().toString(),
        senderId: user?.id || '',
        senderName: user?.name || 'You',
        message: newMessage.trim(),
        timestamp: new Date(),
        read: false
      };

      // Add to local state immediately
      setMessages(prev => [...prev, message]);

      // Send via socket
      socketService.sendMessage(conversationId, newMessage.trim());

      // Clear input
      setNewMessage('');
      setIsTyping(false);
      if (conversationId) {
        socketService.emitTyping(conversationId, false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#40b8a6] to-[#359e8d] text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#40b8a6] to-[#359e8d] rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                  {recipientName?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {recipientName || 'Chat'}
                  </h3>
                  {otherUserTyping && (
                    <p className="text-xs text-white/80">typing...</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                  <MessageCircle className="w-12 h-12 mb-2" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Start a conversation!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.senderId === user?.id;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                        {!isOwn && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-3">
                            {message.senderName}
                          </p>
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn
                              ? 'bg-gradient-to-r from-[#40b8a6] to-[#359e8d] text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          <p className="text-sm break-words">{message.message}</p>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 px-3">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Smile className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-[#40b8a6] to-[#359e8d] text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
