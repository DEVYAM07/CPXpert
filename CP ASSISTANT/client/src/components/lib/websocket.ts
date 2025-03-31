// WebSocket connection management
type MessageHandler = (response: any) => void;
type ErrorHandler = (error: string) => void;
type ConnectionStateHandler = (connected: boolean) => void;

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

class WebSocketManager {
  private socket: WebSocket | null = null;
  private debugHandlers: MessageHandler[] = [];
  private explainHandlers: MessageHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private connectionStateHandlers: ConnectionStateHandler[] = [];
  private codeforcesProfileHandlers: MessageHandler[] = [];
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 2000; // 2 seconds
  private reconnectTimeoutId: number | null = null;
  
  constructor() {
    this.connect();
  }
  
  private connect(): void {
    try {
      // Close existing connection if any
      if (this.socket) {
        this.socket.close();
      }
      
      // Create WebSocket connection
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      this.socket = new WebSocket(wsUrl);
      
      // Setup WebSocket event listeners
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.attemptReconnect();
    }
  }
  
  private handleOpen(): void {
    console.log("WebSocket connection established");
    this.reconnectAttempts = 0;
    this.notifyConnectionState(true);
  }
  
  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      // Route messages to appropriate handlers
      if (data.type === 'debug_response') {
        this.debugHandlers.forEach(handler => handler(data));
      } else if (data.type === 'explain_response') {
        this.explainHandlers.forEach(handler => handler(data));
      } else if (data.type === 'error') {
        this.errorHandlers.forEach(handler => handler(data.message));
      } else if (data.type === 'codeforces_profile_update') {
        console.log('Received CF profile update via WebSocket:', data);
        this.codeforcesProfileHandlers.forEach(handler => handler(data));
      }
    } catch (error) {
      console.error("Error handling WebSocket message:", error);
    }
  }
  
  // Public methods to send requests
  public sendDebugRequest(problemStatement: string, code: string, language: string, userId?: number): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.errorHandlers.forEach(handler => 
        handler("WebSocket is not connected. Please try again later.")
      );
      return;
    }
    
    const message: WebSocketMessage = {
      type: 'debug_request',
      problemStatement,
      code,
      language,
      userId
    };
    
    this.socket.send(JSON.stringify(message));
  }
  
  public sendExplainRequest(problemStatement: string, solutionCode: string, language: string, userId?: number): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.errorHandlers.forEach(handler => 
        handler("WebSocket is not connected. Please try again later.")
      );
      return;
    }
    
    const message: WebSocketMessage = {
      type: 'explain_request',
      problemStatement,
      solutionCode,
      language,
      userId
    };
    
    this.socket.send(JSON.stringify(message));
  }
  
  // Codeforces real-time profile updates
  public startCodeforcesProfileUpdates(userId: number, handle: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.errorHandlers.forEach(handler => 
        handler("WebSocket is not connected. Please try again later.")
      );
      return;
    }
    
    const message: WebSocketMessage = {
      type: 'start_codeforces_updates',
      userId,
      handle
    };
    
    this.socket.send(JSON.stringify(message));
    console.log(`Requested real-time updates for Codeforces profile ${handle}`);
  }
  
  public stopCodeforcesProfileUpdates(userId: number): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.errorHandlers.forEach(handler => 
        handler("WebSocket is not connected. Please try again later.")
      );
      return;
    }
    
    const message: WebSocketMessage = {
      type: 'stop_codeforces_updates',
      userId
    };
    
    this.socket.send(JSON.stringify(message));
    console.log(`Requested to stop real-time updates for user ${userId}`);
  }
  
  // Event handler registration methods
  public onDebugResponse(handler: MessageHandler): () => void {
    this.debugHandlers.push(handler);
    return () => {
      this.debugHandlers = this.debugHandlers.filter(h => h !== handler);
    };
  }
  
  public onExplainResponse(handler: MessageHandler): () => void {
    this.explainHandlers.push(handler);
    return () => {
      this.explainHandlers = this.explainHandlers.filter(h => h !== handler);
    };
  }
  
  public onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
    };
  }
  
  public onConnectionStateChange(handler: ConnectionStateHandler): () => void {
    this.connectionStateHandlers.push(handler);
    return () => {
      this.connectionStateHandlers = this.connectionStateHandlers.filter(h => h !== handler);
    };
  }
  
  public onCodeforcesProfileUpdate(handler: MessageHandler): () => void {
    this.codeforcesProfileHandlers.push(handler);
    return () => {
      this.codeforcesProfileHandlers = this.codeforcesProfileHandlers.filter(h => h !== handler);
    };
  }
}

// Export a singleton instance
export const wsManager = new WebSocketManager();