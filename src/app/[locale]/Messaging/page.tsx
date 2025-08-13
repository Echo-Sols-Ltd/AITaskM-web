"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/header';

// Mock data for messaging
const mockContacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/pp1.png",
    role: "Senior Designer",
    status: "online",
    lastMessage: "Can you review the latest design mockups?",
    lastMessageTime: "2 min ago",
    unreadCount: 2
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "/pp2.png",
    role: "Frontend Developer",
    status: "online",
    lastMessage: "The authentication system is ready for testing",
    lastMessageTime: "5 min ago",
    unreadCount: 0
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/pp1.png",
    role: "Product Manager",
    status: "away",
    lastMessage: "Great work on the user research!",
    lastMessageTime: "1 hour ago",
    unreadCount: 1
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "/pp2.png",
    role: "Backend Developer",
    status: "offline",
    lastMessage: "Database optimization completed",
    lastMessageTime: "2 hours ago",
    unreadCount: 0
  },
  {
    id: 5,
    name: "Design Team",
    avatar: "🎨",
    role: "Group Chat",
    status: "online",
    lastMessage: "Sarah: New color palette approved!",
    lastMessageTime: "30 min ago",
    unreadCount: 5
  }
];

const mockMessages = [
  {
    id: 1,
    senderId: 1,
    content: "Hi! Can you review the latest design mockups for the landing page?",
    timestamp: "10:30 AM",
    type: "text"
  },
  {
    id: 2,
    senderId: "me",
    content: "Sure! I'll take a look at them right away.",
    timestamp: "10:32 AM",
    type: "text"
  },
  {
    id: 3,
    senderId: 1,
    content: "Perfect! I've uploaded them to the shared drive. Let me know what you think.",
    timestamp: "10:33 AM",
    type: "text"
  },
  {
    id: 4,
    senderId: "me",
    content: "I've reviewed the mockups and they look great! A few minor suggestions:",
    timestamp: "10:45 AM",
    type: "text"
  },
  {
    id: 5,
    senderId: "me",
    content: "1. The CTA button could be more prominent\n2. Consider adding more whitespace\n3. The mobile version looks perfect",
    timestamp: "10:46 AM",
    type: "text"
  },
  {
    id: 6,
    senderId: 1,
    content: "Thanks for the feedback! I'll make those adjustments.",
    timestamp: "10:48 AM",
    type: "text"
  },
  {
    id: 7,
    senderId: 1,
    content: "Here's the updated version with your suggestions:",
    timestamp: "11:15 AM",
    type: "text"
  },
  {
    id: 8,
    senderId: 1,
    content: "design-mockup-v2.fig",
    timestamp: "11:15 AM",
    type: "file"
  }
];

const Messaging: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        senderId: "me",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "text"
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FFFD] to-[#edfbfa]">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Team Chat
            </h1>
            <p className="text-gray-600">Stay connected with your team members</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="flex h-[600px]">
              {/* Contacts Sidebar */}
              <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedContact.id === contact.id ? 'bg-[#e7f9f6]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {contact.avatar.startsWith('/') ? (
                            <div className="w-10 h-10 bg-[#40b8a6] rounded-full flex items-center justify-center text-white font-medium">
                              {contact.name.charAt(0)}
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                              {contact.avatar}
                            </div>
                          )}
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                            <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{contact.role}</p>
                          <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                        </div>
                        
                        {contact.unreadCount > 0 && (
                          <div className="bg-[#40b8a6] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {contact.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {selectedContact.avatar.startsWith('/') ? (
                        <div className="w-10 h-10 bg-[#40b8a6] rounded-full flex items-center justify-center text-white font-medium">
                          {selectedContact.name.charAt(0)}
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                          {selectedContact.avatar}
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedContact.status)}`}></div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedContact.name}</h3>
                      <p className="text-sm text-gray-600">{selectedContact.role}</p>
                    </div>
                    
                    <div className="ml-auto flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === 'me'
                          ? 'bg-[#40b8a6] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.type === 'file' ? (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm">{message.content}</span>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                        <p className={`text-xs mt-1 ${
                          message.senderId === 'me' ? 'text-[#e7f9f6]' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent resize-none"
                        rows={1}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="p-2 bg-[#40b8a6] text-white rounded-lg hover:bg-[#359e8d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Messaging; 