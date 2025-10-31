import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import { getServiceById, updateService } from "@/repositories/messaging/services";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * PATCH /api/messaging/services/[serviceId]
 * Update a service
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
	try {
		// Authenticate user
		const session = await getValidCurrentSessionUncached();
		if (!session.user) {
			return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
		}

		const { serviceId } = await params;

		// Parse request body
		const body = await request.json();

		// Validate request
		const schema = z.object({
			status: z.enum(["PENDENTE", "EM ANDAMENTO", "CONCLUÍDO", "CANCELADO"]).optional(),
			descricao: z.string().optional(),
			atendente: z
				.object({
					tipo: z.enum(["USUÁRIO", "AGENTE-IA"]),
					id: z.string(),
					nome: z.string(),
					avatar: z.string().optional().nullable(),
				})
				.optional()
				.nullable(),
			tags: z.array(z.any()).optional(),
		});

		const validatedData = schema.parse(body);

		// Update service
		const success = await updateService(serviceId, validatedData);

		if (!success) {
			return NextResponse.json({ error: "Serviço não encontrado ou não atualizado" }, { status: 404 });
		}

		// Get updated service
		const updatedService = await getServiceById(serviceId);

		return NextResponse.json({
			success: true,
			service: updatedService
				? {
						...updatedService,
						_id: updatedService._id.toString(),
					}
				: null,
		});
	} catch (error) {
		console.error("Error updating service:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 });
		}

		return NextResponse.json({ error: "Erro ao atualizar serviço" }, { status: 500 });
	}
}
