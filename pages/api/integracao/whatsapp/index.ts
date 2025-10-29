import { api } from "@/convex/_generated/api";
import {
	isAppStateSyncEvent,
	isHistoryEvent,
	isMessageEchoEvent,
	isMessageEvent,
	isStatusUpdate,
	isTemplateEvent,
	mapWhatsAppStatusToAppStatus,
	parseAppStateSyncEvent,
	parseHistoryEvent,
	parseMessageEchoEvent,
	parseStatusUpdate,
	parseTemplateCategoryUpdate,
	parseTemplateQualityUpdate,
	parseTemplateStatusUpdate,
	parseWebhookIncomingMessage,
} from "@/lib/whatsapp/parsing";
import { formatPhoneAsBase } from "@/utils/methods/formatting";
import type { TClient } from "@/utils/schemas/crm/client.schema";
import type { TWhatsappTemplate } from "@/utils/schemas/whatsapp-templates";
import { convexClient } from "@/utils/services/convex/client";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import connectToCRMDatabase from "@/utils/services/mongodb/crm/main";
import { ConvexHttpClient } from "convex/browser";
import type { NextApiRequest, NextApiResponse } from "next";

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Webhook verification (GET request)
	if (req.method === "GET") {
		console.log("[INFO] [WHATSAPP_WEBHOOK] [VERIFY] Query received:", req.query);
		const mode = req.query["hub.mode"];
		const token = req.query["hub.verify_token"];
		const challenge = req.query["hub.challenge"];

		// Check if a token and mode were sent
		if (mode && token) {
			// Check the mode and token sent are correct
			if (mode === "subscribe" && token === VERIFY_TOKEN) {
				// Respond with 200 OK and challenge token from the request
				console.log("WEBHOOK_VERIFIED");
				return res.status(200).send(challenge);
			}

			// Responds with '403 Forbidden' if verify tokens do not match
			console.log("WEBHOOK_VERIFICATION_FAILED");
			return res.status(403).json({ error: "Verification failed" });
		}

		return res.status(400).json({ error: "Missing parameters" });
	}

	// Webhook events (POST request)
	if (req.method === "POST") {
		const body = req.body;

		// Log incoming messages
		console.log("[INFO] [WHATSAPP_WEBHOOK] [POST] Incoming webhook message:", JSON.stringify(body, null, 2));

		// Check if this is a WhatsApp Business Account event
		if (body.object === "whatsapp_business_account") {
			// Initialize Convex client
			if (!CONVEX_URL) {
				console.error("[WHATSAPP_WEBHOOK] Convex URL not configured");
				return res.status(500).json({ error: "Internal server error" });
			}

			try {
				// Check if this is a template event
				if (isTemplateEvent(body)) {
					const adminDb = await connectToAdministrationDatabase();
					const templatesCollection = adminDb.collection<TWhatsappTemplate>("whatsapp-templates");

					// Parse template status update
					const statusUpdate = parseTemplateStatusUpdate(body);
					if (statusUpdate?.status) {
						console.log("[WHATSAPP_WEBHOOK] Template status update:", {
							id: statusUpdate.messageTemplateId,
							name: statusUpdate.messageTemplateName,
							status: statusUpdate.status,
							reason: statusUpdate.reason,
						});

						const updateResult = await templatesCollection.updateOne(
							{ whatsappTemplateId: statusUpdate.messageTemplateId.toString() },
							{
								$set: {
									status: statusUpdate.status,
									...(statusUpdate.reason && { motivoRejeicao: statusUpdate.reason }),
								},
							},
						);

						if (updateResult.matchedCount > 0) {
							console.log(`[WHATSAPP_WEBHOOK] Template status updated: ${statusUpdate.messageTemplateName} -> ${statusUpdate.status}`);
						} else {
							console.warn(`[WHATSAPP_WEBHOOK] Template not found in database: ${statusUpdate.messageTemplateName} (${statusUpdate.messageTemplateId})`);
						}
					}

					// Parse template quality update
					const qualityUpdate = parseTemplateQualityUpdate(body);
					if (qualityUpdate?.quality) {
						console.log("[WHATSAPP_WEBHOOK] Template quality update:", {
							id: qualityUpdate.messageTemplateId,
							name: qualityUpdate.messageTemplateName,
							quality: qualityUpdate.quality,
							previousQuality: qualityUpdate.previousQuality,
							currentLimit: qualityUpdate.currentLimit,
						});

						const updateResult = await templatesCollection.updateOne(
							{ whatsappTemplateId: qualityUpdate.messageTemplateId },
							{
								$set: {
									qualidade: qualityUpdate.quality,
								},
							},
						);

						if (updateResult.matchedCount > 0) {
							console.log(`[WHATSAPP_WEBHOOK] Template quality updated: ${qualityUpdate.messageTemplateName} -> ${qualityUpdate.quality}`);
						} else {
							console.warn(`[WHATSAPP_WEBHOOK] Template not found in database: ${qualityUpdate.messageTemplateName} (${qualityUpdate.messageTemplateId})`);
						}
					}

					// Parse template category update
					const categoryUpdate = parseTemplateCategoryUpdate(body);
					if (categoryUpdate?.category) {
						console.log("[WHATSAPP_WEBHOOK] Template category update:", {
							id: categoryUpdate.messageTemplateId,
							name: categoryUpdate.messageTemplateName,
							category: categoryUpdate.category,
							previousCategory: categoryUpdate.previousCategory,
						});

						// Validate category is one of the allowed values
						const validCategories = ["authentication", "marketing", "utility"];
						const normalizedCategory = categoryUpdate.category.toLowerCase();

						if (validCategories.includes(normalizedCategory)) {
							const updateResult = await templatesCollection.updateOne(
								{ whatsappTemplateId: categoryUpdate.messageTemplateId },
								{
									$set: {
										categoria: normalizedCategory as "authentication" | "marketing" | "utility",
									},
								},
							);

							if (updateResult.matchedCount > 0) {
								console.log(`[WHATSAPP_WEBHOOK] Template category updated: ${categoryUpdate.messageTemplateName} -> ${normalizedCategory}`);
							} else {
								console.warn(
									`[WHATSAPP_WEBHOOK] Template not found in database: ${categoryUpdate.messageTemplateName} (${categoryUpdate.messageTemplateId})`,
								);
							}
						} else {
							console.warn(`[WHATSAPP_WEBHOOK] Invalid category received: ${categoryUpdate.category}`);
						}
					}
				}
				// Check if this is a status update
				else if (isStatusUpdate(body)) {
					const statusUpdate = parseStatusUpdate(body);
					if (statusUpdate) {
						const { status, whatsappStatus } = mapWhatsAppStatusToAppStatus(statusUpdate.status);

						await convexClient.mutation(api.mutations.messages.updateMessageStatus, {
							whatsappMessageId: statusUpdate.whatsappMessageId,
							status,
							whatsappStatus,
						});

						console.log("[WHATSAPP_WEBHOOK] Status updated for message:", statusUpdate.whatsappMessageId);
					}
				}
				// Check if this is an incoming message
				else if (isMessageEvent(body)) {
					console.log("[INFO] [WHATSAPP_WEBHOOK] Handling incoming message:", body);
					const incomingMessage = parseWebhookIncomingMessage(body);
					const crmDb = await connectToCRMDatabase();
					const clientsCollection = crmDb.collection<TClient>("clients");
					let clientId: string | null = null;
					const existingClient = await clientsCollection.findOne({ telefonePrimarioBase: formatPhoneAsBase(incomingMessage?.fromPhoneNumber ?? "") });
					if (existingClient) {
						console.log("[INFO] [WHATSAPP_WEBHOOK] Client already exists:", existingClient);
						clientId = existingClient._id.toString();
					} else {
						console.log("[INFO] [WHATSAPP_WEBHOOK] Client does not exist, inserting new client:", incomingMessage?.fromPhoneNumber);
						const insertClientResponse = await clientsCollection.insertOne({
							telefonePrimario: incomingMessage?.fromPhoneNumber as string,
							nome: incomingMessage?.profileName as string,
							autor: {
								id: "6463ccaa8c5e3e227af54d89",
								nome: "LUCAS FERNANDES",
								avatar_url:
									"https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/saas-crm%2Fusuarios%2FLUCAS%20FERNANDES?alt=media&token=4a2959af-2fd0-4448-92f6-57af64a3bae1",
							},
							canalAquisicao: "WHATSAPP",
							idParceiro: "65454ba15cf3e3ecf534b308",
							uf: "",
							cidade: "",
							cep: "",
							bairro: "",
							endereco: "",
							dataInsercao: new Date().toISOString(),
							indicador: {},
						});
						clientId = insertClientResponse.insertedId.toString();
					}
					if (incomingMessage) {
						let mediaStorageData = null;

						// Handle media messages
						if (incomingMessage.mediaId && incomingMessage.mimeType) {
							try {
								// Download and store media
								mediaStorageData = await convexClient.action(api.actions.whatsapp.downloadAndStoreWhatsappMedia, {
									mediaId: incomingMessage.mediaId,
									mimeType: incomingMessage.mimeType,
									filename: incomingMessage.filename,
								});
								console.log("[WHATSAPP_WEBHOOK] Media downloaded and stored:", mediaStorageData.storageId);
							} catch (error) {
								console.error("[WHATSAPP_WEBHOOK] Error downloading media:", error);
								// Continue without media if download fails
							}
						}

						// Determine media type
						let midiaTipo: "IMAGEM" | "DOCUMENTO" | "VIDEO" | "AUDIO" | undefined;
						if (incomingMessage.messageType === "image") {
							midiaTipo = "IMAGEM";
						} else if (incomingMessage.messageType === "document") {
							midiaTipo = "DOCUMENTO";
						} else if (incomingMessage.messageType === "video") {
							midiaTipo = "VIDEO";
						} else if (incomingMessage.messageType === "audio") {
							midiaTipo = "AUDIO";
						}

						// Create message in Convex
						await convexClient.mutation(api.mutations.messages.createMessage, {
							cliente: {
								idApp: clientId,
								nome: incomingMessage.profileName,
								telefone: incomingMessage.fromPhoneNumber,
							},
							autor: {
								idApp: clientId,
								tipo: "cliente",
							},
							conteudo: {
								texto: incomingMessage.textContent || incomingMessage.caption,
								midiaTipo,
								midiaStorageId: mediaStorageData?.storageId,
								midiaMimeType: mediaStorageData?.mimeType,
								midiaFileName: mediaStorageData?.filename,
								midiaFileSize: mediaStorageData?.fileSize,
								midiaWhatsappId: incomingMessage.mediaId,
							},
							whatsappMessageId: incomingMessage.whatsappMessageId,
							whatsappPhoneNumberId: incomingMessage.whatsappPhoneNumberId,
						});

						console.log("[WHATSAPP_WEBHOOK] Message created from:", incomingMessage.fromPhoneNumber, "Type:", incomingMessage.messageType);
					}
				}
				// Check if this is a history sync event (Coexistence)
				else if (isHistoryEvent(body)) {
					console.log("[INFO] [WHATSAPP_WEBHOOK] [COEXISTENCE] Handling history sync event");
					const historyData = parseHistoryEvent(body);

					if (historyData) {
						if (historyData.hasError) {
							console.log("[WHATSAPP_WEBHOOK] [COEXISTENCE] History sharing declined:", {
								errorCode: historyData.errorCode,
								errorMessage: historyData.errorMessage,
							});
						} else {
							console.log(`[WHATSAPP_WEBHOOK] [COEXISTENCE] Processing ${historyData.messages.length} historical messages`);

							// Process each historical message
							for (const historicalMessage of historyData.messages) {
								try {
									const crmDb = await connectToCRMDatabase();
									const clientsCollection = crmDb.collection<TClient>("clients");

									// Determine the client phone number (always the customer, not the business)
									const clientPhone =
										historicalMessage.fromPhoneNumber === historyData.businessPhoneNumber ? historicalMessage.toPhoneNumber : historicalMessage.fromPhoneNumber;

									const isFromBusiness = historicalMessage.fromPhoneNumber === historyData.businessPhoneNumber;

									// Find or create client
									let clientId: string | null = null;
									const existingClient = await clientsCollection.findOne({ telefonePrimarioBase: formatPhoneAsBase(clientPhone) });

									if (existingClient) {
										clientId = existingClient._id.toString();
									} else {
										// Create new client for historical contact
										const insertClientResponse = await clientsCollection.insertOne({
											telefonePrimario: clientPhone,
											telefonePrimarioBase: formatPhoneAsBase(clientPhone),
											nome: `Cliente ${clientPhone}`,
											autor: {
												id: "6463ccaa8c5e3e227af54d89",
												nome: "LUCAS FERNANDES",
												avatar_url:
													"https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/saas-crm%2Fusuarios%2FLUCAS%20FERNANDES?alt=media&token=4a2959af-2fd0-4448-92f6-57af64a3bae1",
											},
											canalAquisicao: "WHATSAPP",
											idParceiro: "65454ba15cf3e3ecf534b308",
											uf: "",
											cidade: "",
											cep: "",
											bairro: "",
											endereco: "",
											dataInsercao: new Date().toISOString(),
											indicador: {},
										});
										clientId = insertClientResponse.insertedId.toString();
									}

									// Handle media if present
									let mediaStorageData = null;
									if (historicalMessage.mediaId && historicalMessage.mimeType) {
										try {
											mediaStorageData = await convexClient.action(api.actions.whatsapp.downloadAndStoreWhatsappMedia, {
												mediaId: historicalMessage.mediaId,
												mimeType: historicalMessage.mimeType,
												filename: historicalMessage.filename,
											});
											console.log("[WHATSAPP_WEBHOOK] [COEXISTENCE] Historical media downloaded:", mediaStorageData.storageId);
										} catch (error) {
											console.error("[WHATSAPP_WEBHOOK] [COEXISTENCE] Error downloading historical media:", error);
										}
									}

									// Determine media type
									let midiaTipo: "IMAGEM" | "DOCUMENTO" | "VIDEO" | "AUDIO" | undefined;
									if (historicalMessage.messageType === "image") {
										midiaTipo = "IMAGEM";
									} else if (historicalMessage.messageType === "document") {
										midiaTipo = "DOCUMENTO";
									} else if (historicalMessage.messageType === "video") {
										midiaTipo = "VIDEO";
									} else if (historicalMessage.messageType === "audio") {
										midiaTipo = "AUDIO";
									}

									// Create historical message in Convex
									await convexClient.mutation(api.mutations.messages.createMessage, {
										cliente: {
											idApp: clientId,
											nome: existingClient?.nome || `Cliente ${clientPhone}`,
											telefone: clientPhone,
										},
										autor: {
											idApp: isFromBusiness ? "6463ccaa8c5e3e227af54d89" : clientId,
											tipo: isFromBusiness ? "usuario" : "cliente",
										},
										conteudo: {
											texto: historicalMessage.textContent || historicalMessage.caption,
											midiaTipo,
											midiaStorageId: mediaStorageData?.storageId,
											midiaMimeType: mediaStorageData?.mimeType,
											midiaFileName: mediaStorageData?.filename,
											midiaFileSize: mediaStorageData?.fileSize,
											midiaWhatsappId: historicalMessage.mediaId,
										},
										whatsappMessageId: historicalMessage.whatsappMessageId,
										whatsappPhoneNumberId: historicalMessage.whatsappPhoneNumberId,
									});

									console.log("[WHATSAPP_WEBHOOK] [COEXISTENCE] Historical message created:", historicalMessage.whatsappMessageId);
								} catch (error) {
									console.error("[WHATSAPP_WEBHOOK] [COEXISTENCE] Error processing historical message:", error);
								}
							}

							console.log("[WHATSAPP_WEBHOOK] [COEXISTENCE] Finished processing historical messages");
						}
					}
				}
				// Check if this is a contact sync event (Coexistence)
				else if (isAppStateSyncEvent(body)) {
					console.log("[INFO] [WHATSAPP_WEBHOOK] [COEXISTENCE] Handling contact sync event");
					const stateSyncData = parseAppStateSyncEvent(body);

					if (stateSyncData) {
						console.log(`[WHATSAPP_WEBHOOK] [COEXISTENCE] Processing ${stateSyncData.contacts.length} contact updates`);

						const crmDb = await connectToCRMDatabase();
						const clientsCollection = crmDb.collection<TClient>("clients");

						for (const contact of stateSyncData.contacts) {
							try {
								if (contact.action === "add") {
									// Find or create client
									const existingClient = await clientsCollection.findOne({ telefonePrimarioBase: formatPhoneAsBase(contact.phoneNumber) });

									if (existingClient) {
										// Update existing client with name if we have one
										if (contact.fullName && existingClient.nome !== contact.fullName) {
											await clientsCollection.updateOne(
												{ _id: existingClient._id },
												{
													$set: {
														nome: contact.fullName,
													},
												},
											);
											console.log(`[WHATSAPP_WEBHOOK] [COEXISTENCE] Updated contact: ${contact.fullName}`);
										}
									} else {
										// Create new client
										await clientsCollection.insertOne({
											telefonePrimario: contact.phoneNumber,
											telefonePrimarioBase: formatPhoneAsBase(contact.phoneNumber),
											nome: contact.fullName || contact.firstName || `Cliente ${contact.phoneNumber}`,
											autor: {
												id: "6463ccaa8c5e3e227af54d89",
												nome: "LUCAS FERNANDES",
												avatar_url:
													"https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/saas-crm%2Fusuarios%2FLUCAS%20FERNANDES?alt=media&token=4a2959af-2fd0-4448-92f6-57af64a3bae1",
											},
											canalAquisicao: "WHATSAPP",
											idParceiro: "65454ba15cf3e3ecf534b308",
											uf: "",
											cidade: "",
											cep: "",
											bairro: "",
											endereco: "",
											dataInsercao: new Date().toISOString(),
											indicador: {},
										});
										console.log(`[WHATSAPP_WEBHOOK] [COEXISTENCE] Created new contact: ${contact.fullName || contact.phoneNumber}`);
									}
								} else if (contact.action === "remove") {
									// Optionally mark contact as removed or handle deletion
									// For now, we'll just log it
									console.log(`[WHATSAPP_WEBHOOK] [COEXISTENCE] Contact removed from WhatsApp Business app: ${contact.phoneNumber}`);
								}
							} catch (error) {
								console.error("[WHATSAPP_WEBHOOK] [COEXISTENCE] Error processing contact sync:", error);
							}
						}

						console.log("[WHATSAPP_WEBHOOK] [COEXISTENCE] Finished processing contact syncs");
					}
				}
				// Check if this is a message echo event (Coexistence)
				else if (isMessageEchoEvent(body)) {
					console.log("[INFO] [WHATSAPP_WEBHOOK] [COEXISTENCE] Handling message echo event");
					const messageEchoes = parseMessageEchoEvent(body);

					if (messageEchoes) {
						console.log(`[WHATSAPP_WEBHOOK] [COEXISTENCE] Processing ${messageEchoes.length} message echoes`);

						const crmDb = await connectToCRMDatabase();
						const clientsCollection = crmDb.collection<TClient>("clients");

						for (const echo of messageEchoes) {
							try {
								// Find or create client (customer who received the message)
								let clientId: string | null = null;
								const existingClient = await clientsCollection.findOne({ telefonePrimarioBase: formatPhoneAsBase(echo.toPhoneNumber) });

								if (existingClient) {
									clientId = existingClient._id.toString();
								} else {
									// Create new client
									const insertClientResponse = await clientsCollection.insertOne({
										telefonePrimario: echo.toPhoneNumber,
										telefonePrimarioBase: formatPhoneAsBase(echo.toPhoneNumber),
										nome: `Cliente ${echo.toPhoneNumber}`,
										autor: {
											id: "6463ccaa8c5e3e227af54d89",
											nome: "LUCAS FERNANDES",
											avatar_url:
												"https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/saas-crm%2Fusuarios%2FLUCAS%20FERNANDES?alt=media&token=4a2959af-2fd0-4448-92f6-57af64a3bae1",
										},
										canalAquisicao: "WHATSAPP",
										idParceiro: "65454ba15cf3e3ecf534b308",
										uf: "",
										cidade: "",
										cep: "",
										bairro: "",
										endereco: "",
										dataInsercao: new Date().toISOString(),
										indicador: {},
									});
									clientId = insertClientResponse.insertedId.toString();
								}

								// Handle media if present
								let mediaStorageData = null;
								if (echo.mediaId && echo.mimeType) {
									try {
										mediaStorageData = await convexClient.action(api.actions.whatsapp.downloadAndStoreWhatsappMedia, {
											mediaId: echo.mediaId,
											mimeType: echo.mimeType,
											filename: echo.filename,
										});
										console.log("[WHATSAPP_WEBHOOK] [COEXISTENCE] Echo media downloaded:", mediaStorageData.storageId);
									} catch (error) {
										console.error("[WHATSAPP_WEBHOOK] [COEXISTENCE] Error downloading echo media:", error);
									}
								}

								// Determine media type
								let midiaTipo: "IMAGEM" | "DOCUMENTO" | "VIDEO" | "AUDIO" | undefined;
								if (echo.messageType === "image") {
									midiaTipo = "IMAGEM";
								} else if (echo.messageType === "document") {
									midiaTipo = "DOCUMENTO";
								} else if (echo.messageType === "video") {
									midiaTipo = "VIDEO";
								} else if (echo.messageType === "audio") {
									midiaTipo = "AUDIO";
								}

								// Create message echo in Convex (from business user via WhatsApp Business app)
								await convexClient.mutation(api.mutations.messages.createMessage, {
									cliente: {
										idApp: clientId,
										nome: existingClient?.nome || `Cliente ${echo.toPhoneNumber}`,
										telefone: echo.toPhoneNumber,
									},
									autor: {
										idApp: "6463ccaa8c5e3e227af54d89", // Special ID for business app user
										tipo: "usuario",
									},
									conteudo: {
										texto: echo.textContent || echo.caption,
										midiaTipo,
										midiaStorageId: mediaStorageData?.storageId,
										midiaMimeType: mediaStorageData?.mimeType,
										midiaFileName: mediaStorageData?.filename,
										midiaFileSize: mediaStorageData?.fileSize,
										midiaWhatsappId: echo.mediaId,
									},
									whatsappMessageId: echo.whatsappMessageId,
									whatsappPhoneNumberId: echo.whatsappPhoneNumberId,
								});

								console.log("[WHATSAPP_WEBHOOK] [COEXISTENCE] Message echo created:", echo.whatsappMessageId);
							} catch (error) {
								console.error("[WHATSAPP_WEBHOOK] [COEXISTENCE] Error processing message echo:", error);
							}
						}

						console.log("[WHATSAPP_WEBHOOK] [COEXISTENCE] Finished processing message echoes");
					}
				}

				// Always return 200 OK to acknowledge receipt (must be within 20 seconds)
				return res.status(200).json({ success: true });
			} catch (error) {
				console.error("[WHATSAPP_WEBHOOK] Error processing webhook:", error);
				// Still return 200 to prevent WhatsApp from retrying
				return res.status(200).json({ success: true });
			}
		}

		// Return a '404 Not Found' if event is not from a WhatsApp Business Account
		return res.status(404).json({ error: "Event not supported" });
	}

	// Handle other HTTP methods
	return res.status(405).json({ error: "Method not allowed" });
}
