'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import RoleBasedSidebar from '../../../components/RoleBasedSidebar';
import MobileMenuButton from '../../../components/MobileMenuButton';
import ProtectedRoute from '../../../components/ProtectedRoute';
import NotificationCenter from '../../../components/NotificationCenter';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api';
import socketService from '@/services/socket';
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Image as ImageIcon,
  File,
  X,
  Users
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  online: boolean;
  type: 'direct' | 'group';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function MessagingPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [conversationType, setConversationType] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadConversations();
    loadUsers();
    
    // Setup socket listeners
    const token = localStorage.getItem('token');
    if (token && !socketService.isConnected()) {
      socketService.connect(token).catch(err => {
        console.error('Failed to connect to socket:', err);
      });
    }
    
    socketService.on('new-message', handleNewMessage);
    socketService.on('message-deleted', handleMessageDeleted);
    
    return () => {
      socketService.off('new-message', handleNewMessage);
      socketService.off('message-deleted', handleMessageDeleted);
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      socketService.emit('join-conversation', selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getConversations();
      const convs = response.conversations || [];
      
      // Transform to match frontend format
      const transformedConvs: Conversation[] = convs.map((conv: any) => ({
        id: conv._id,
        name: conv.name || conv.participants.map((p: any) => p.name).join(', '),
        avatar: conv.name?.substring(0, 2).toUpperCase() || 'CH',
        lastMessage: conv.lastMessage?.content || 'No messages yet',
        lastMessageTime: new Date(conv.lastActivity || conv.createdAt),
        unreadCount: 0, // TODO: Calculate unread count
        online: false, // TODO: Check online status
        type: conv.type
      }));
      
      setConversations(transformedConvs);
    } catch (error: any) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiClient.getUsers();
      const usersList = response.users || [];
      
      // Transform and filter out current user
      const transformedUsers: User[] = usersList
        .filter((u: any) => u._id !== user?.id)
        .map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.name?.substring(0, 2).toUpperCase()
        }));
      
      setUsers(transformedUsers);
    } catch (error: any) {
      console.error('Failed to load users:', error);
    }
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const response = await apiClient.createConversation({
        type: conversationType,
        participants: selectedUsers,
        name: conversationType === 'group' ? groupName : undefined
      });

      if (response.conversation) {
        await loadConversations();
        setSelectedConversation(response.conversation._id);
        setShowNewConversationModal(false);
        setSelectedUsers([]);
        setGroupName('');
        setUserSearchQuery('');
      }
    } catch (error: any) {
      console.error('Failed to create conversation:', error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        // For direct messages, only allow one user
        if (conversationType === 'direct') {
          return [userId];
        }
        return [...prev, userId];
      }
    });
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await apiClient.getMessages(conversationId);
      const msgs = response.messages || [];
      
      // Transform to match frontend format
      const transformedMsgs: Message[] = msgs.map((msg: any) => ({
        id: msg._id,
        senderId: msg.sender._id,
        senderName: msg.sender.name,
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        read: true, // TODO: Check read status
        type: msg.type || 'text'
      }));
      
      setMessages(transformedMsgs);
      scrollToBottom();
    } catch (error: any) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleNewMessage = (message: any) => {
    if (message.conversation === selectedConversation) {
      const newMsg: Message = {
        id: message._id,
        senderId: message.sender._id,
        senderName: message.sender.name,
        content: message.content,
        timestamp: new Date(message.createdAt),
        read: true,
        type: message.type || 'text'
      };
      setMessages(prev => [...prev, newMsg]);
      scrollToBottom();
    }
    // Refresh conversations to update last message
    loadConversations();
  };

  const handleMessageDeleted = (data: any) => {
    setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
  };

  // Mock conversations for fallback
  const mockConversations: Conversation[] = [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'JD',
      lastMessage: 'Hey, how is the project going?',
      lastMessageTime: new Date(Date.now() - 5 * 60000),
      unreadCount: 2,
      online: true,
      type: 'direct'
    },
    {
      id: '2',
      name: 'Development Team',
      avatar: 'DT',
      lastMessage: 'Meeting at 3 PM today',
      lastMessageTime: new Date(Date.now() - 30 * 60000),
      unreadCount: 0,
      online: false,
      type: 'group'
    }
  ];

  // Mock messages for selected conversation
  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: '1',
      senderName: 'John Doe',
      content: 'Hey, how is the project going?',
      timestamp: new Date(Date.now() - 10 * 60000),
      read: true,
      type: 'text'
    },
    {
      id: '2',
      senderId: user?.id || '',
      senderName: user?.name || 'You',
      content: 'Going well! We are on track.',
      timestamp: new Date(Date.now() - 8 * 60000),
      read: true,
      type: 'text'
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'John Doe',
      content: 'Great! Let me know if you need any help.',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      type: 'text'
    }
  ];

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user?.id || '',
        senderName: user?.name || 'You',
        content: newMessage.trim(),
        timestamp: new Date(),
        read: false,
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <RoleBasedSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="md:ml-64 flex-1 bg-gray-50 dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-[#40b8a6]" />
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <NotificationCenter />
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="h-[calc(100vh-73px)] flex">
            {/* Conversations List */}
            <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <button 
                  onClick={() => setShowNewConversationModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#40b8a6] hover:bg-[#359e8d] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Conversation
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    whileHover={{ backgroundColor: 'rgba(64, 184, 166, 0.05)' }}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 ${
                      selectedConversation === conv.id ? 'bg-[#40b8a6]/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold">
                          {conv.avatar}
                        </div>
                        {conv.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {conv.name}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-[#40b8a6] text-white text-xs font-medium rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold">
                          {selectedConv.avatar}
                        </div>
                        {selectedConv.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          {selectedConv.name}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedConv.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === user?.id;
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
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
                              <p className="text-sm break-words">{message.content}</p>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 px-3">
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          rows={1}
                          className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        />
                        <button className="absolute right-2 bottom-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Smile className="w-5 h-5 text-gray-400" />
                        </button>
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
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Conversation Modal */}
        {showNewConversationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    New Conversation
                  </h2>
                  <button
                    onClick={() => {
                      setShowNewConversationModal(false);
                      setSelectedUsers([]);
                      setGroupName('');
                      setUserSearchQuery('');
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Conversation Type Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => {
                      setConversationType('direct');
                      setSelectedUsers([]);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      conversationType === 'direct'
                        ? 'bg-[#40b8a6] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Direct Message
                  </button>
                  <button
                    onClick={() => {
                      setConversationType('group');
                      setSelectedUsers([]);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      conversationType === 'group'
                        ? 'bg-[#40b8a6] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Users className="w-4 h-4 inline mr-2" />
                    Group Chat
                  </button>
                </div>

                {/* Group Name Input */}
                {conversationType === 'group' && (
                  <input
                    type="text"
                    placeholder="Group name..."
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                  />
                )}

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#40b8a6] dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Selected Users */}
                {selectedUsers.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedUsers.map(userId => {
                      const user = users.find(u => u.id === userId);
                      return user ? (
                        <div
                          key={userId}
                          className="flex items-center gap-2 bg-[#40b8a6]/10 text-[#40b8a6] px-3 py-1 rounded-full"
                        >
                          <span className="text-sm font-medium">{user.name}</span>
                          <button
                            onClick={() => toggleUserSelection(userId)}
                            className="hover:bg-[#40b8a6]/20 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {userSearchQuery ? 'No users found' : 'No users available'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        whileHover={{ backgroundColor: 'rgba(64, 184, 166, 0.05)' }}
                        onClick={() => toggleUserSelection(user.id)}
                        className={`p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                          selectedUsers.includes(user.id)
                            ? 'border-[#40b8a6] bg-[#40b8a6]/5'
                            : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold">
                            {user.avatar || user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          {selectedUsers.includes(user.id) && (
                            <div className="w-6 h-6 rounded-full bg-[#40b8a6] flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNewConversationModal(false);
                      setSelectedUsers([]);
                      setGroupName('');
                      setUserSearchQuery('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateConversation}
                    disabled={
                      selectedUsers.length === 0 ||
                      (conversationType === 'group' && !groupName.trim())
                    }
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#40b8a6] to-[#359e8d] text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Conversation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
