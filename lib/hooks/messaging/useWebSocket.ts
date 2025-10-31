import { SESSION_COOKIE_NAME } from "@/config";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Socket, io } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4001";

// Helper to get cookie value
function getCookie(name: string): string | null {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
	return null;
}

type WebSocketMessage = {
	chat?: { id: string };
	[key: string]: unknown;
};

type UseWebSocketOptions = {
	sessionId: string;
	onNewMessage?: (message: WebSocketMessage) => void;
	onMessageUpdate?: (message: WebSocketMessage) => void;
	onChatUpdate?: (chat: WebSocketMessage) => void;
	onNewChat?: (chat: WebSocketMessage) => void;
	onServiceUpdate?: (service: WebSocketMessage) => void;
};

export function useWebSocket(options: UseWebSocketOptions) {
	console.log("WebSocket URL", WS_URL);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const optionsRef = useRef(options);

	// Update options ref when they change
	useEffect(() => {
		optionsRef.current = options;
	}, [options]);

	useEffect(() => {
		// Get session token from props or cookies
		const token = options.sessionId;

		if (!token) {
			setError("Sem token de autenticação");
			return;
		}

		console.log("Connecting to WebSocket with token:", token ? "✓" : "✗");

		// Connect to WebSocket server
		const newSocket = io(WS_URL, {
			auth: {
				token,
			},
			transports: ["websocket", "polling"],
		});

		// Connection events
		newSocket.on("connect", () => {
			console.log("WebSocket connected");
			setIsConnected(true);
			setError(null);
		});

		newSocket.on("disconnect", () => {
			console.log("WebSocket disconnected");
			setIsConnected(false);
		});

		newSocket.on("error", (err: { message: string }) => {
			console.error("WebSocket error:", err);
			setError(err.message || "Erro de conexão");
		});

		newSocket.on("connect_error", (err) => {
			console.error("WebSocket connection error:", err);
			setError("Erro ao conectar");
		});

		// Message events
		newSocket.on("new-message", (message: WebSocketMessage) => {
			console.log("New message received:", message);
			optionsRef.current.onNewMessage?.(message);
		});

		newSocket.on("message-update", (message: WebSocketMessage) => {
			console.log("Message update received:", message);
			optionsRef.current.onMessageUpdate?.(message);
		});

		newSocket.on("chat-update", (chat: WebSocketMessage) => {
			console.log("Chat update received:", chat);
			optionsRef.current.onChatUpdate?.(chat);
		});

		newSocket.on("new-chat", (chat: WebSocketMessage) => {
			console.log("New chat received:", chat);
			optionsRef.current.onNewChat?.(chat);
		});

		newSocket.on("service-update", (service: WebSocketMessage) => {
			console.log("Service update received:", service);
			optionsRef.current.onServiceUpdate?.(service);
		});

		setSocket(newSocket);

		// Cleanup on unmount
		return () => {
			newSocket.close();
		};
	}, [options.sessionId]); // Reconnect if sessionId changes

	const joinChatRoom = useCallback(
		(chatId: string) => {
			if (socket && isConnected) {
				socket.emit("join-chat-room", chatId);
			}
		},
		[socket, isConnected],
	);

	const leaveChatRoom = useCallback(
		(chatId: string) => {
			if (socket && isConnected) {
				socket.emit("leave-chat-room", chatId);
			}
		},
		[socket, isConnected],
	);

	console.log("socket", socket);
	return {
		socket,
		isConnected,
		error,
		joinChatRoom,
		leaveChatRoom,
	};
}
