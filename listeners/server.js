// listeners/server.js

import { createServer } from "http";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { MongoClient, ObjectId } from "mongodb";
import { Server } from "socket.io";

// As variáveis de .env.local são carregadas pelo script 'npm run listen:ws'
const MONGODB_URI = process.env.DB_KEY;
const PORT = process.env.PORT || 4001;
const CLIENT_URL = process.env.NEXT_PUBLIC_APP_URL;
const DEFAULT_ORG_ID = process.env.DEFAULT_ORG_ID || "default-org";

if (!MONGODB_URI || !CLIENT_URL) {
	throw new Error("MONGODB_URI e CLIENT_URL devem ser definidos nas variáveis de ambiente do projeto.");
}

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: { origin: CLIENT_URL, methods: ["GET", "POST"] },
});

const mongoClient = new MongoClient(MONGODB_URI);

// --- Funções de "Watcher" ---

async function watchCollection(io, collectionName, eventMap, getRoomFn) {
	try {
		const collection = mongoClient.db().collection(collectionName);
		console.log(`👂 Observando a coleção: ${collectionName}`);
		const changeStream = collection.watch([], { fullDocument: "updateLookup" });

		for await (const change of changeStream) {
			let document;
			let eventName;

			switch (change.operationType) {
				case "insert":
					document = change.fullDocument;
					eventName = eventMap.insert;
					break;
				case "update":
					document = change.fullDocument; // 'updateLookup' nos dá o doc completo
					eventName = eventMap.update;
					break;
			}

			if (document && eventName) {
				const room = getRoomFn(document); // Obtém a sala (ou salas) para emitir
				if (room) {
					io.to(room).emit(eventName, document);
					console.log(`🚀 Evento ${eventName} emitido para a sala: ${room}`);
				}
			}
		}
	} catch (err) {
		console.error(`Erro ao observar ${collectionName}:`, err);
	}
}

// --- Session Validation ---
async function validateSessionToken(token) {
	if (!token) return null;

	try {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

		const db = mongoClient.db("administration");
		const session = await db.collection("sessoes-usuarios").findOne({ sessaoId: sessionId });

		if (!session) return null;

		// Check if session is expired
		if (Date.now() > new Date(session.dataExpiracao).getTime()) {
			return null;
		}

		// Get user
		const user = await db.collection("colaboradores").findOne({ _id: new ObjectId(session.usuarioId) });
		if (!user) return null;

		return {
			userId: session.usuarioId,
			userName: user.nome,
		};
	} catch (error) {
		console.error("Error validating session:", error);
		return null;
	}
}

// --- Lógica de Conexão do Socket ---

io.on("connection", async (socket) => {
	console.log(`Cliente tentando conectar: ${socket.id}`);

	// Get authentication token from handshake
	const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace("Bearer ", "");

	// Validate session
	const session = await validateSessionToken(token);
	if (!session) {
		console.log(`Cliente ${socket.id} não autenticado - desconectando`);
		socket.emit("error", { message: "Não autenticado" });
		socket.disconnect();
		return;
	}

	console.log(`Cliente ${session.userName} (${session.userId}) conectado: ${socket.id}`);

	// Store session info in socket
	socket.data.session = session;

	// Automatically join organization room
	const orgRoomName = `organization:${DEFAULT_ORG_ID}`;
	socket.join(orgRoomName);
	console.log(`Cliente ${socket.id} entrou na sala ${orgRoomName}`);

	// Cliente entra em um chat específico
	socket.on("join-chat-room", (chatId) => {
		const roomName = `chat:${chatId}`;
		socket.join(roomName);
		console.log(`Cliente ${socket.id} entrou na sala ${roomName}`);
	});

	// Cliente sai de um chat específico
	socket.on("leave-chat-room", (chatId) => {
		const roomName = `chat:${chatId}`;
		socket.leave(roomName);
		console.log(`Cliente ${socket.id} saiu da sala ${roomName}`);
	});

	socket.on("disconnect", () => {
		console.log(`Cliente desconectado: ${socket.id}`);
	});
});

// --- Inicialização do Servidor ---

async function startServer() {
	await mongoClient.connect();
	console.log("Conectado ao MongoDB.");

	httpServer.listen(PORT, () => {
		console.log(`Servidor Socket.IO rodando na porta *:${PORT}`);
	});

	// Inicia todos os watchers em paralelo

	// 1. Watcher de Mensagens (chats-messages collection)
	watchCollection(io, "chats-messages", { insert: "new-message", update: "message-update" }, (doc) => (doc.chat?.id ? `chat:${doc.chat.id}` : null));

	// 2. Watcher de Chats
	watchCollection(io, "chats", { insert: "new-chat", update: "chat-update" }, (doc) =>
		doc.orgId ? `organization:${doc.orgId}` : `organization:${DEFAULT_ORG_ID}`,
	);

	// 3. Watcher de Atendimentos (Services) - chats-services collection
	watchCollection(io, "chats-services", { insert: "new-service", update: "service-update" }, (doc) => (doc.chat?.id ? `chat:${doc.chat.id}` : null));
}

startServer();
