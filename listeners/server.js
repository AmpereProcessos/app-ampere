// listeners/server.js

import { createServer } from "http";
import { MongoClient } from "mongodb";
import { Server } from "socket.io";

// As variáveis de .env.local são carregadas pelo script 'npm run listen:ws'
const MONGODB_URI = process.env.DB_KEY;
const PORT = process.env.PORT || 4001;
const CLIENT_URL = process.env.NEXT_PUBLIC_APP_URL;

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

// --- Lógica de Conexão do Socket ---

io.on("connection", (socket) => {
	console.log(`Cliente conectado: ${socket.id}`);

	// O cliente (frontend) deve se autenticar e dizer sua 'orgId'
	socket.on("join-organization-room", (orgId) => {
		// !! IMPORTANTE !!
		// Aqui você deve validar (ex: com um JWT) se este socket
		// tem permissão para ouvir esta organização.
		const roomName = `organization:${orgId}`;
		socket.join(roomName);
		console.log(`Cliente ${socket.id} entrou na sala ${roomName}`);
	});

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

	// 1. Watcher de Mensagens
	watchCollection(io, "messages", { insert: "new-message", update: "message-update" }, (doc) => (doc.chat?.id ? `chat:${doc.chat.id}` : null));

	// 2. Watcher de Chats
	watchCollection(
		io,
		"chats",
		{ insert: "new-chat", update: "chat-update" },
		(doc) => (doc.orgId ? `organization:${doc.orgId}` : null), // Assumindo que 'doc.orgId' existe
	);

	// 3. Watcher de Atendimentos (Services)
	watchCollection(
		io,
		"services",
		{ insert: "new-service", update: "service-update" },
		(doc) => (doc.orgId ? `organization:${doc.orgId}` : null), // Assumindo que 'doc.orgId' existe
	);
}

startServer();
