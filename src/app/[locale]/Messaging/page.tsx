'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Users,
  Download,
  Check,
  CheckCheck,
  Trash2,
  Reply,
  Copy,
  Forward
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file';
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  reactions?: {
    emoji: string;
    userId: string;
    userName: string;
  }[];
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
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
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversationDetails, setConversationDetails] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [conversationType, setConversationType] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; message: Message } | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConversations();
    loadUsers();
    
    // Setup socket listeners
    const token = localStorage.getItem('moveit_token');
    if (token && !socketService.isConnected()) {
      socketService.connect(token).catch(err => {
        console.error('Failed to connect to socket:', err);
      });
    }
    
    socketService.on('new-message', handleNewMessage);
    socketService.on('message-deleted', handleMessageDeleted);
    socketService.on('typing', handleTypingIndicator);
    socketService.on('reaction-added', handleReactionAdded);
    socketService.on('message-read', handleMessageRead);
    socketService.on('messages-read', handleMessagesRead);
    socketService.on('user-online', handleUserOnline);
    socketService.on('user-offline', handleUserOffline);
    
    return () => {
      socketService.off('new-message', handleNewMessage);
      socketService.off('message-deleted', handleMessageDeleted);
      socketService.off('typing', handleTypingIndicator);
      socketService.off('reaction-added', handleReactionAdded);
      socketService.off('message-read', handleMessageRead);
      socketService.off('messages-read', handleMessagesRead);
      socketService.off('user-online', handleUserOnline);
      socketService.off('user-offline', handleUserOffline);
    };
  }, []);

  const handleUserOnline = (userId: string) => {
    console.log('User came online:', userId);
    setOnlineUsers(prev => new Set(prev).add(userId));
    
    // Update conversation online status
    setConversations(prev => prev.map(conv => {
      if (conv.type === 'direct') {
        // Check if this conversation includes the online user
        return { ...conv, online: true }; // Simplified - would need to check participants
      }
      return conv;
    }));
  };

  const handleUserOffline = (userId: string) => {
    console.log('User went offline:', userId);
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
    
    // Update conversation online status
    setConversations(prev => prev.map(conv => {
      if (conv.type === 'direct') {
        // Check if this conversation includes the offline user
        return { ...conv, online: false }; // Simplified - would need to check participants
      }
      return conv;
    }));
  };

  const handleMessageRead = (data: { messageId: string; userId: string; readAt: Date }) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === data.messageId && msg.senderId?.toString() === user?.id?.toString()) {
        return { ...msg, read: true };
      }
      return msg;
    }));
  };

  const handleMessagesRead = (data: { messageIds: string[]; userId: string; readAt: Date }) => {
      setMessages(prev => prev.map(msg => {
      if (data.messageIds.includes(msg.id) && msg.senderId?.toString() === user?.id?.toString()) {
        return { ...msg, read: true };
      }
      return msg;
    }));
  };

  const handleTypingIndicator = (data: { userId: string; userName: string; isTyping: boolean; conversationId: string }) => {
    if (data.conversationId === selectedConversation && data.userId !== user?.id) {
      setTypingUsers(prev => {
        if (data.isTyping) {
          return prev.includes(data.userName) ? prev : [...prev, data.userName];
        } else {
          return prev.filter(name => name !== data.userName);
        }
      });
    }
  };

  const handleReactionAdded = (data: { messageId: string; reaction: any }) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === data.messageId) {
        const reactions = msg.reactions || [];
        return { ...msg, reactions: [...reactions, data.reaction] };
      }
      return msg;
    }));
  };

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      loadConversationDetails(selectedConversation);
      socketService.emit('join-conversation', selectedConversation);
      
      // Mark all messages as read when opening conversation
      apiClient.markConversationAsRead(selectedConversation)
        .then(() => {
          // Update unread count in conversation list
          setConversations(prev => prev.map(conv => 
            conv.id === selectedConversation 
              ? { ...conv, unreadCount: 0 }
              : conv
          ));
        })
        .catch(err => {
          console.error('Failed to mark conversation as read:', err);
        });
    } else {
      setConversationDetails(null);
    }
  }, [selectedConversation]);

  const loadConversationDetails = async (conversationId: string) => {
    try {
      const response = await apiClient.getConversationById(conversationId);
      setConversationDetails(response.conversation);
      console.log('Loaded conversation details:', response.conversation);
    } catch (error: any) {
      console.error('Failed to load conversation details:', error);
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getConversations();
      const convs = response.conversations || [];
      
      // Use the onlineUsers state
      
      // Transform to match frontend format
      const transformedConvs: Conversation[] = await Promise.all(convs.map(async (conv: any) => {
        // Calculate unread count using optimized endpoint
        let unreadCount = 0;
        try {
          const unreadResponse = await apiClient.getUnreadCount(conv._id);
          unreadCount = unreadResponse.unreadCount || 0;
        } catch (err) {
          console.error('Failed to get unread count:', err);
        }
        
        // Determine online status
        // For direct conversations, check if the other participant is online
        let online = false;
        if (conv.type === 'direct' && conv.participants) {
          const otherParticipant = conv.participants.find((p: any) => 
            p._id?.toString() !== user?.id?.toString()
          );
          if (otherParticipant) {
            // Check if user is in online users set
            online = onlineUsers.has(otherParticipant._id?.toString());
          }
        }
        
        // Generate avatar from name or participants
        let avatar = 'CH';
        if (conv.name) {
          avatar = conv.name.substring(0, 2).toUpperCase();
        } else if (conv.participants && conv.participants.length > 0) {
          const otherParticipant = conv.participants.find((p: any) => 
            p._id?.toString() !== user?.id?.toString()
          );
          if (otherParticipant?.name) {
            avatar = otherParticipant.name.substring(0, 2).toUpperCase();
          }
        }
        
        // Get display name
        let displayName = conv.name;
        if (!displayName && conv.participants) {
          const otherParticipants = conv.participants.filter((p: any) => 
            p._id?.toString() !== user?.id?.toString()
          );
          displayName = otherParticipants.map((p: any) => p.name).join(', ') || 'Unknown';
        }
        
        return {
          id: conv._id,
          name: displayName || 'Conversation',
          avatar: avatar,
          lastMessage: conv.lastMessage?.message || conv.lastMessage?.content || 'No messages yet',
          lastMessageTime: new Date(conv.lastActivity || conv.createdAt),
          unreadCount: unreadCount,
          online: online,
          type: conv.type
        };
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
      const transformedMsgs: Message[] = msgs.map((msg: any) => {
        const senderId = msg.sender?._id?.toString() || msg.sender?.id?.toString() || '';        
        return {
          id: msg._id,
          senderId: senderId,
          senderName: msg.sender?.name || 'Unknown',
          content: msg.message || msg.content, // Backend uses 'message' field
          timestamp: new Date(msg.createdAt),
          read: msg.readBy?.some((r: any) => r.user?.toString() === user?.id?.toString()) || false,
          type: msg.messageType || msg.type || 'text',
          attachments: msg.attachments,
          reactions: msg.reactions?.map((r: any) => ({
            emoji: r.emoji,
            userId: r.user?._id?.toString() || r.user?.toString() || '',
            userName: r.user?.name || 'User'
          })),
          replyTo: msg.replyTo ? {
            id: msg.replyTo._id,
            content: msg.replyTo.message,
            senderName: msg.replyTo.sender?.name || 'User'
          } : undefined
        };
      });
      
      setMessages(transformedMsgs);
      scrollToBottom();
    } catch (error: any) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleNewMessage = (message: any) => {    
    if (message.conversation === selectedConversation) {
      const senderId = message.sender?._id?.toString() || message.sender?.id?.toString() || '';
      
      const newMsg: Message = {
        id: message._id,
        senderId: senderId,
        senderName: message.sender?.name || 'Unknown',
        content: message.message || message.content, // Backend uses 'message' field
        timestamp: new Date(message.createdAt),
        read: senderId === user?.id?.toString(), // Own messages are read
        type: message.messageType || message.type || 'text',
        attachments: message.attachments,
        reactions: message.reactions
      };
      
      // Check if message already exists (avoid duplicates)
      setMessages(prev => {
        const exists = prev.some(m => m.id === newMsg.id);
        if (exists) return prev;
        return [...prev, newMsg];
      });
      
      scrollToBottom();
    } else {
      // Message is for a different conversation - increment unread count
      setConversations(prev => prev.map(conv => 
        conv.id === message.conversation
          ? { 
              ...conv, 
              unreadCount: conv.unreadCount + 1,
              lastMessage: message.message || message.content || 'New message',
              lastMessageTime: new Date(message.createdAt)
            }
          : conv
      ));
    }
  };

  const handleMessageDeleted = (data: any) => {
    setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedConversation) return;

    try {
      const messageData: any = {
        content: newMessage.trim(),
        type: selectedFiles.length > 0 ? 'file' : 'text'
      };

      if (replyingTo) {
        messageData.replyTo = replyingTo.id;
      }

      // Handle file uploads
      if (selectedFiles.length > 0) {
        // In a real app, upload files to server first
        messageData.attachments = selectedFiles.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file) // Temporary URL
        }));
      }

      // Optimistically add message to UI
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        senderId: user?.id?.toString() || '',
        senderName: user?.name || 'You',
        content: newMessage.trim(),
        timestamp: new Date(),
        read: true, // Own messages are considered read
        type: selectedFiles.length > 0 ? 'file' : 'text',
        attachments: messageData.attachments
      };
      
      console.log('Creating optimistic message with sender ID:', optimisticMessage.senderId);
      
      setMessages(prev => [...prev, optimisticMessage]);
      scrollToBottom();

      const response = await apiClient.sendMessage(selectedConversation, messageData);
      
      // Replace temp message with real one from server
      if (response.data) {
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? {
            ...msg,
            id: response.data._id,
            timestamp: new Date(response.data.createdAt)
          } : msg
        ));
      }
      
      setNewMessage('');
      setSelectedFiles([]);
      setReplyingTo(null);
      setShowEmojiPicker(false);
      
      // Stop typing indicator
      socketService.emitTyping(selectedConversation, false);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (!selectedConversation) return;
    
    // Emit typing indicator
    socketService.emitTyping(selectedConversation, true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitTyping(selectedConversation, false);
    }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      await apiClient.addReaction(messageId, emoji);
      // Socket will handle updating the message
    } catch (error: any) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await apiClient.deleteMessage(messageId);
      // Socket will handle removing the message
    } catch (error: any) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setContextMenu(null);
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyingTo(message);
    setContextMenu(null);
  };

  const emojis = ['😀', '😂', '❤️', '👍', '👎', '🎉', '🔥', '✨', '💯', '🙌', '👏', '🤔', '😍', '😊', '😎', '🚀', '💪', '✅', '❌', '⭐'];

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
                      <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Voice call"
                      >
                        <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Video call"
                      >
                        <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => setShowChatInfo(true)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Chat info"
                      >
                        <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => {
                      const isOwn = message.senderId?.toString() === user?.id?.toString();
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({ x: e.clientX, y: e.clientY, message });
                          }}
                        >
                          <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                            {!isOwn && (
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 px-3">
                                {message.senderName}
                              </p>
                            )}
                            
                            {/* Reply Preview */}
                            {message.replyTo && (
                              <div className={`px-3 py-2 mb-1 rounded-lg border-l-4 max-w-full ${
                                isOwn 
                                  ? 'bg-[#2d8b7a] dark:bg-[#1a5a4d] border-white/50 dark:border-white/30' 
                                  : 'bg-gray-200 dark:bg-gray-600 border-[#40b8a6]'
                              }`}>
                                <p className={`text-xs font-medium mb-1 ${isOwn ? 'text-white/80' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {message.replyTo.senderName}
                                </p>
                                <p className={`text-xs truncate ${isOwn ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {message.replyTo.content}
                                </p>
                              </div>
                            )}

                            <div
                              className={`px-4 py-2 rounded-2xl shadow-sm ${
                                isOwn
                                  ? 'bg-[#40b8a6] dark:bg-[#059669] text-white rounded-br-md'
                                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              {message.content && (
                                <p className="text-sm break-words">{message.content}</p>
                              )}
                              
                              {/* Attachments */}
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.attachments.map((attachment, idx) => (
                                    <div key={idx}>
                                      {attachment.type && attachment.type.startsWith('image/') ? (
                                        <img
                                          src={attachment.url}
                                          alt={attachment.name}
                                          className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                          onClick={() => window.open(attachment.url, '_blank')}
                                        />
                                      ) : (
                                        <a
                                          href={attachment.url}
                                          download={attachment.name}
                                          className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                                            isOwn 
                                              ? 'bg-white/20 hover:bg-white/30' 
                                              : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                                          }`}
                                        >
                                          <File className="w-4 h-4" />
                                          <span className="text-sm flex-1 truncate">{attachment.name}</span>
                                          <Download className="w-4 h-4" />
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Reactions */}
                            {message.reactions && message.reactions.length > 0 && (
                              <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                {Object.entries(
                                  message.reactions.reduce((acc, r) => {
                                    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                    return acc;
                                  }, {} as Record<string, number>)
                                ).map(([emoji, count]) => (
                                  <button
                                    key={emoji}
                                    onClick={() => handleAddReaction(message.id, emoji)}
                                    className="px-2 py-0.5 bg-white dark:bg-gray-600 rounded-full text-xs hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors shadow-sm border border-gray-200 dark:border-gray-500"
                                  >
                                    {emoji} {count}
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <p className={`text-xs ${isOwn ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {formatTime(message.timestamp)}
                              </p>
                              {isOwn && (
                                <span className="text-xs flex items-center" title={message.read ? 'Read' : 'Delivered'}>
                                  {message.read ? (
                                    <CheckCheck className="w-4 h-4 text-blue-500 dark:text-blue-400" strokeWidth={2.5} />
                                  ) : (
                                    <CheckCheck className="w-4 h-4 text-gray-400 dark:text-gray-500" strokeWidth={2.5} />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Reply Preview */}
                    {replyingTo && (
                      <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Reply className="w-4 h-4 text-[#40b8a6]" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Replying to {replyingTo.senderName}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {replyingTo.content}
                          </p>
                        </div>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}

                    {/* File Previews */}
                    {selectedFiles.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="relative p-2 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center gap-2 max-w-xs"
                          >
                            {file.type && file.type.startsWith('image/') ? (
                              <ImageIcon className="w-5 h-5 text-[#40b8a6]" />
                            ) : (
                              <File className="w-5 h-5 text-[#40b8a6]" />
                            )}
                            <span className="text-sm text-gray-900 dark:text-white truncate">
                              {file.name}
                            </span>
                            <button
                              onClick={() => removeFile(index)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              <X className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Typing Indicator */}
                    {typingUsers.length > 0 && (
                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400 italic">
                        {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                      </div>
                    )}

                    <div className="flex items-end gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Attach file"
                        >
                          <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <button
                          onClick={() => imageInputRef.current?.click()}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Attach image"
                        >
                          <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => handleTyping(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          rows={1}
                          className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#40b8a6] focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        />
                        <div className="absolute right-2 bottom-2">
                          <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Smile className="w-5 h-5 text-gray-400" />
                          </button>
                          {showEmojiPicker && (
                            <div className="absolute bottom-full right-0 mb-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 grid grid-cols-5 gap-2 w-64">
                              {emojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setNewMessage(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-600 rounded p-1 transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() && selectedFiles.length === 0}
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

        {/* Context Menu */}
        {contextMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setContextMenu(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ top: contextMenu.y, left: contextMenu.x }}
              className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[180px]"
            >
              <button
                onClick={() => handleReplyToMessage(contextMenu.message)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Reply className="w-4 h-4" />
                Reply
              </button>
              <button
                onClick={() => handleCopyMessage(contextMenu.message.content)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              <div className="px-4 py-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">React with</p>
                <div className="flex gap-1">
                  {['❤️', '👍', '😂', '🎉', '🔥'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => {
                        handleAddReaction(contextMenu.message.id, emoji);
                        setContextMenu(null);
                      }}
                      className="text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              {contextMenu.message.senderId === user?.id && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  <button
                    onClick={() => {
                      handleDeleteMessage(contextMenu.message.id);
                      setContextMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}

        {/* Chat Info Panel */}
        <AnimatePresence>
          {showChatInfo && selectedConv && conversationDetails && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowChatInfo(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chat Info</h2>
                    <button
                      onClick={() => setShowChatInfo(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white text-2xl font-semibold">
                      {selectedConv.avatar}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {conversationDetails.name || selectedConv.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {conversationDetails.type} conversation
                    </p>
                    {selectedConv.online && (
                      <p className="text-xs text-green-500 mt-1">● Online</p>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Created</span>
                        <span className="text-gray-900 dark:text-white">
                          {new Date(conversationDetails.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Participants</span>
                        <span className="text-gray-900 dark:text-white">
                          {conversationDetails.participants?.length || 0}
                        </span>
                      </div>
                      {conversationDetails.metadata?.project && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Project</span>
                          <span className="text-gray-900 dark:text-white">
                            {conversationDetails.metadata.project.name}
                          </span>
                        </div>
                      )}
                      {conversationDetails.metadata?.team && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Team</span>
                          <span className="text-gray-900 dark:text-white">
                            {conversationDetails.metadata.team.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Members List */}
                  {conversationDetails.participants && conversationDetails.participants.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Members ({conversationDetails.participants.length})
                        </h4>
                        {conversationDetails.admins?.some((admin: any) => admin._id === user?.id) && (
                          <button
                            onClick={() => {
                              // TODO: Add member functionality
                              alert('Add member functionality coming soon');
                            }}
                            className="text-xs text-[#40b8a6] hover:underline"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {conversationDetails.participants.map((participant: any) => {
                          const isAdmin = conversationDetails.admins?.some((admin: any) => admin._id === participant._id);
                          const isCurrentUser = participant._id === user?.id;
                          
                          return (
                            <div key={participant._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#40b8a6] to-[#359e8d] flex items-center justify-center text-white font-semibold">
                                {participant.name?.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {participant.name}
                                    {isCurrentUser && ' (You)'}
                                  </p>
                                  {isAdmin && (
                                    <span className="text-xs bg-[#40b8a6] text-white px-2 py-0.5 rounded">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {participant.email}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Settings */}
                  {conversationDetails.settings && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Settings
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">File Uploads</span>
                          <span className={conversationDetails.settings.allowFileUploads ? 'text-green-600' : 'text-red-600'}>
                            {conversationDetails.settings.allowFileUploads ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Reactions</span>
                          <span className={conversationDetails.settings.allowReactions ? 'text-green-600' : 'text-red-600'}>
                            {conversationDetails.settings.allowReactions ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Edit Messages</span>
                          <span className={conversationDetails.settings.allowEditing ? 'text-green-600' : 'text-red-600'}>
                            {conversationDetails.settings.allowEditing ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                      <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Search in conversation</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left">
                      <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">Media & Files</span>
                    </button>
                    {conversationDetails.admins?.some((admin: any) => admin._id === user?.id) && (
                      <button 
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this conversation?')) {
                            try {
                              await apiClient.deleteConversation(conversationDetails._id);
                              setShowChatInfo(false);
                              setSelectedConversation(null);
                              loadConversations();
                            } catch (error) {
                              console.error('Failed to delete conversation:', error);
                              alert('Failed to delete conversation');
                            }
                          }
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-left text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="text-sm">Delete conversation</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
