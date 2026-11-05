import {
  isTemplateEvent,
  parseTemplateCategoryUpdate,
  parseTemplateQualityUpdate,
  parseTemplateStatusUpdate,
} from "@/lib/whatsapp/parsing";
import type { TWhatsappTemplate } from "@/utils/schemas/whatsapp-templates";
import connectToAdministrationDatabase from "@/utils/services/mongodb/administration";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
    if (!req.query["hub.mode"] || !req.query["hub.verify_token"])
      return res.status(400).json({ error: "Missing parameters" });
    if (verifyToken && req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === verifyToken)
      return res.status(200).send(req.query["hub.challenge"]);
    return res.status(403).json({ error: "Verification failed" });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const body = req.body;
  if (body?.object !== "whatsapp_business_account")
    return res.status(404).json({ error: "Event not supported" });
  try {
    // Template management remains active. Deprecated chat events are acknowledged without processing.
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
          console.log(
            `[WHATSAPP_WEBHOOK] Template status updated: ${statusUpdate.messageTemplateName} -> ${statusUpdate.status}`,
          );
        } else {
          console.warn(
            `[WHATSAPP_WEBHOOK] Template not found in database: ${statusUpdate.messageTemplateName} (${statusUpdate.messageTemplateId})`,
          );
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
          console.log(
            `[WHATSAPP_WEBHOOK] Template quality updated: ${qualityUpdate.messageTemplateName} -> ${qualityUpdate.quality}`,
          );
        } else {
          console.warn(
            `[WHATSAPP_WEBHOOK] Template not found in database: ${qualityUpdate.messageTemplateName} (${qualityUpdate.messageTemplateId})`,
          );
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
            console.log(
              `[WHATSAPP_WEBHOOK] Template category updated: ${categoryUpdate.messageTemplateName} -> ${normalizedCategory}`,
            );
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
  } catch (error) {
    console.error("[WHATSAPP_WEBHOOK] Error processing template event:", error);
  }
  return res.status(200).json({ success: true });
}
