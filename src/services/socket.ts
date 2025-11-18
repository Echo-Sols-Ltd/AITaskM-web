'use client';

import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
          auth: {
            token
          },
          transports: ['websocket', 'polling'],
          timeout: 20000,
        });

        this.socket.on('connect', () => {
          console.log('✅ Connected to WebSocket server');
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('❌ Disconnected from WebSocket server:', reason);
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            this.handleReconnect();
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ WebSocket connection error:', error);
          this.handleReconnect();
          reject(error);
        });

        this.socket.on('error', (error) => {
          console.error('❌ WebSocket error:', error);
        });

      } catch (error) {
        console.error('❌ Failed to create socket connection:', error);
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.socket?.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Disconnected from WebSocket server');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Room management
  joinUserRoom(userId: string) {
    if (this.socket) {
      this.socket.emit('join-user', userId);
      console.log(`🏠 Joined user room: ${userId}`);
    }
  }

  joinTeamRoom(teamId: string) {
    if (this.socket) {
      this.socket.emit('join-team', teamId);
      console.log(`🏠 Joined team room: ${teamId}`);
    }
  }

  joinNotificationsRoom(userId: string) {
    if (this.socket) {
      this.socket.emit('join-notifications', userId);
      console.log(`🔔 Joined notifications room: ${userId}`);
    }
  }

  joinTasksRoom(userId: string) {
    if (this.socket) {
      this.socket.emit('join-tasks', userId);
      console.log(`📋 Joined tasks room: ${userId}`);
    }
  }

  joinChatRoom(conversationId: string) {
    if (this.socket) {
      this.socket.emit('join-chat', conversationId);
      console.log(`💬 Joined chat room: ${conversationId}`);
    }
  }

  // Event listeners
  onTaskUpdate(callback: (task: any) => void) {
    if (this.socket) {
      this.socket.on('task-updated', callback);
    }
  }

  onTaskCreated(callback: (task: any) => void) {
    if (this.socket) {
      this.socket.on('task-created', callback);
    }
  }

  onTaskDeleted(callback: (taskId: string) => void) {
    if (this.socket) {
      this.socket.on('task-deleted', callback);
    }
  }

  onNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  onUserOnline(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('user-online', callback);
    }
  }

  onUserOffline(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('user-offline', callback);
    }
  }

  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('message', callback);
    }
  }

  onTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  // Event emitters
  emitTaskUpdate(task: any) {
    if (this.socket) {
      this.socket.emit('task-update', task);
    }
  }

  emitTaskCreate(task: any) {
    if (this.socket) {
      this.socket.emit('task-create', task);
    }
  }

  emitTaskDelete(taskId: string) {
    if (this.socket) {
      this.socket.emit('task-delete', taskId);
    }
  }

  sendMessage(conversationId: string, message: string, attachments?: any[]) {
    if (this.socket) {
      this.socket.emit('send-message', {
        conversationId,
        message,
        attachments
      });
    }
  }

  emitTyping(conversationId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', {
        conversationId,
        isTyping
      });
    }
  }

  // Generic event listener
  on(event: string, callback: Function) {
    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  // Generic event emitter
  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Remove event listeners
  off(event: string, callback?: Function) {
    if (this.socket) {
      this.socket.off(event, callback as any);
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event?: string) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
    }
  }
}

// Create singleton instance
export const socketService = new SocketService();
export default socketService;
