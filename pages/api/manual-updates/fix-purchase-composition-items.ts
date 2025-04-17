import { apiHandler } from "@/utils/api";
import type { TMaterial } from "@/utils/schemas/materials";
import type { TPurchaseControl } from "@/utils/schemas/purchases";
import connectToDatabase from "@/utils/services/mongodb/projects";
import connectToWarehouseDatabase from "@/utils/services/mongodb/warehouse";
import { type AnyBulkWriteOperation, ObjectId } from "mongodb";
import type { NextApiHandler } from "next";

const MostUsedItems = [
	{
		NOME: "HOYMILES - HOYMILES-HMS-2000DW-4T",
		VEZES_UTILIZADO: "259",
		MATERIAL_EQUIVALENTE: "HMS-2000-4T (HOYMILES)",
		"": "",
	},
	{
		NOME: "PERFIL FIXAÇÃO CORDEIRO - 2,40M ",
		VEZES_UTILIZADO: "243",
		MATERIAL_EQUIVALENTE: "PERFIL FIXAÇÃO CORDEIRO - 2,40M (CONTAINER)",
		"": "",
	},
	{
		NOME: "CONECTOR HOYMILES END CAP SERIE HMS-AC",
		VEZES_UTILIZADO: "242",
		MATERIAL_EQUIVALENTE: "CONECTOR HOYMILES END CAP SERIE HMS-AC (CONTAINER)",
		"": "",
	},
	{
		NOME: "KIT SUPORTE FIBROCIMENTO CORDEIRO - 4 MOD.",
		VEZES_UTILIZADO: "241",
		MATERIAL_EQUIVALENTE: "KIT SUPORTE FIBROCIMENTO CORDEIRO - 4 MOD. (CONTAINER)",
		"": "",
	},
	{
		NOME: "CONECTOR HOYMILES SERIE AC - TRUNK ",
		VEZES_UTILIZADO: "237",
		MATERIAL_EQUIVALENTE: "CONECTOR HOYMILES SERIE AC - TRUNK (CONTAINER)",
		"": "",
	},
	{
		NOME: "PARAF. CAB.T TRAVAM CRUZADO M8X20 ESP CAB 23",
		VEZES_UTILIZADO: "228",
		MATERIAL_EQUIVALENTE: "CRIAR ",
		"": "",
	},
	{
		NOME: "POR SEXT M8 FLANGELADA C/SERRILHA DIN6923 A2 6923",
		VEZES_UTILIZADO: "228",
		MATERIAL_EQUIVALENTE: "POR SEXT M8 FLANGELADA C/SERRILHA DIN6923 A2 6923",
		"": "",
	},
	{
		NOME: "HELIUS - HELIUS-HMF144T10-585HL",
		VEZES_UTILIZADO: "128",
		MATERIAL_EQUIVALENTE: "MÓDULO HELIUS HMF144T10-585HL (CONTAINER)",
		"": "",
	},
	{
		NOME: "HELIUS - HELIUS-HMF144T10-590HL",
		VEZES_UTILIZADO: "124",
		MATERIAL_EQUIVALENTE: "MÓDULO HELIUS HMF144T10-590HL (CONTAINER)",
		"": "",
	},
	{
		NOME: "GRAMPO FINAL",
		VEZES_UTILIZADO: "31",
		MATERIAL_EQUIVALENTE: "GRAMPO FINAL UNIVERSAL ",
		"": "",
	},
	{
		NOME: "GRAMPO INTERMEDIÁRIO",
		VEZES_UTILIZADO: "30",
		MATERIAL_EQUIVALENTE: "VERIFICAR COM ALEX ",
		"": "",
	},
	{
		NOME: "TRILHO 3,30",
		VEZES_UTILIZADO: "30",
		MATERIAL_EQUIVALENTE: "TRILHO SOLAR GROUP SMART 3,30MM",
		"": "",
	},
	{
		NOME: "PARAFUSO FIBROCIMENTO MADEIRA",
		VEZES_UTILIZADO: "28",
		MATERIAL_EQUIVALENTE: "PARAFUSO FIBROMADEIRA 250MM",
		"": "",
	},
	{
		NOME: "PAR DE JUNÇÃO TRILHO",
		VEZES_UTILIZADO: "26",
		MATERIAL_EQUIVALENTE: "PAR DE JUNÇÃO DE TRILHO",
		"": "",
	},
	{
		NOME: "HELIUS 585W",
		VEZES_UTILIZADO: "11",
		MATERIAL_EQUIVALENTE: "MÓDULO HELIUS HMF144T10-585HL (CONTAINER)",
		"": "",
	},
	{
		NOME: "HOYMILES - HOYMILES-HMS-2000B-4T",
		VEZES_UTILIZADO: "8",
		MATERIAL_EQUIVALENTE: "HMS-2000-4T (HOYMILES)",
		"": "",
	},
	{
		NOME: "HELIUS - HMF144T10-590HL",
		VEZES_UTILIZADO: "5",
		MATERIAL_EQUIVALENTE: "MÓDULO HELIUS HMF144T10-590HL (CONTAINER)",
		"": "",
	},
	{
		NOME: "PERFIL FIXAÇÃO CORDEIRO - 2,40M  ",
		VEZES_UTILIZADO: "4",
		MATERIAL_EQUIVALENTE: "PERFIL FIXAÇÃO CORDEIRO - 2,40M (CONTAINER)",
		"": "",
	},
	{
		NOME: "HOYMILES - HOYMILES-HMS-2000DW-4T - 220V",
		VEZES_UTILIZADO: "4",
		MATERIAL_EQUIVALENTE: "HMS-2000-4T (HOYMILES)",
		"": "",
	},
	{
		NOME: "CONECTOR HOYMILES SERIE AC-TRUNK",
		VEZES_UTILIZADO: "4",
		MATERIAL_EQUIVALENTE: "CONECTOR HOYMILES SERIE AC - TRUNK (CONTAINER)",
		"": "",
	},
	{
		NOME: "HELIUS - HMF144T10-585HL",
		VEZES_UTILIZADO: "3",
		MATERIAL_EQUIVALENTE: "MÓDULO HELIUS HMF144T10-585HL (CONTAINER)",
		"": "",
	},
	{
		NOME: "HOYMILES - HOYMILES HMS-2000DW-4T ",
		VEZES_UTILIZADO: "3",
		MATERIAL_EQUIVALENTE: "HMS-2000-4T (HOYMILES)",
		"": "",
	},
	{
		NOME: "KIT SUPORTE FIBROCIMENTO CORDEIRO - 4 MOD",
		VEZES_UTILIZADO: "3",
		MATERIAL_EQUIVALENTE: "KIT SUPORTE FIBROCIMENTO CORDEIRO - 4 MOD. (CONTAINER)",
		"": "",
	},
	{
		NOME: "KIT SUPORTE FIBROCIMENTO CORDEIRO - 2 MOD.",
		VEZES_UTILIZADO: "3",
		MATERIAL_EQUIVALENTE: "NÃO USAMOS MAIS",
		"": "",
	},
	{
		NOME: "PARAFUSO FIBROCIMENTO FERRO",
		VEZES_UTILIZADO: "2",
		MATERIAL_EQUIVALENTE: "PARAFUSO FIBROMETAL 250mm",
		"": "",
	},
	{
		NOME: "HOYMILES - HMS-2000-4T",
		VEZES_UTILIZADO: "2",
		MATERIAL_EQUIVALENTE: "HMS-2000-4T (HOYMILES)",
		"": "",
	},
	{
		NOME: "HELIUS 590W",
		VEZES_UTILIZADO: "2",
		MATERIAL_EQUIVALENTE: "MÓDULO HELIUS HMF144T10-590HL (CONTAINER)",
		"": "",
	},
	{
		NOME: "HANERSUN - HANERSUN- DHM660HNS.BF",
		VEZES_UTILIZADO: "2",
		MATERIAL_EQUIVALENTE: "MESMO NOME",
		"": "",
	},
	{
		NOME: "PERFIL FIXAÇÃO CORDEIRO - 2,40M",
		VEZES_UTILIZADO: "2",
		MATERIAL_EQUIVALENTE: "PERFIL FIXAÇÃO CORDEIRO - 2,40M (CONTAINER)",
		"": "",
	},
	{
		NOME: "CABO FLEX 2,5mm (VERMELHO)",
		VEZES_UTILIZADO: "2",
		MATERIAL_EQUIVALENTE: "CABO FLEX 750V 2,5MM VERMELHO",
		"": "",
	},
	{
		NOME: "PARAF. CAB.T TRAVAM CRUZADO M8X20 ESP CAB23",
		VEZES_UTILIZADO: "2",
		MATERIAL_EQUIVALENTE: "DUPLICADO",
		"": "",
	},
];
const handleFixPurchaseCompositionItems: NextApiHandler<any> = async (req, res) => {
	const wareHouseDb = await connectToWarehouseDatabase();
	const appDb = await connectToDatabase();

	const materialsCollection = wareHouseDb.collection<TMaterial>("material");
	const purchaseControlsCollection = appDb.collection<TPurchaseControl>("controles-compras");

	const purchaseControls = await purchaseControlsCollection.find({}).toArray();
	const materials = await materialsCollection.find({}).toArray();

	// const bulkwriteUpdatePurchaseControls: AnyBulkWriteOperation<TPurchaseControl>[] = purchaseControls.map((purchaseControl) => {
	// 	const formattedCompositionItems: TPurchaseControl["composicao"] = purchaseControl.composicao.map((compositionItem) => {
	// 		const equivalentMaterialName = MostUsedItems.find((m) => m.NOME === compositionItem.descricao)?.MATERIAL_EQUIVALENTE;
	// 		const equivalentMaterial = materials.find((m) => m.nome === equivalentMaterialName);

	// 		return { ...compositionItem, materialId: equivalentMaterial?._id.toString() };
	// 	});
	// 	return {
	// 		updateOne: {
	// 			filter: { _id: new ObjectId(purchaseControl._id) },
	// 			update: {
	// 				$set: {
	// 					composicao: formattedCompositionItems,
	// 				},
	// 			},
	// 		},
	// 	};
	// });

	const formattedPurchaseControls: TPurchaseControl[] = purchaseControls.map((purchaseControl) => {
		const formattedCompositionItems: TPurchaseControl["composicao"] = purchaseControl.composicao.map((compositionItem) => {
			const equivalentMaterialName = MostUsedItems.find((m) => m.NOME === compositionItem.descricao)?.MATERIAL_EQUIVALENTE;
			const equivalentMaterial = materials.find((m) => m.nome === equivalentMaterialName);

			return { ...compositionItem, materialId: equivalentMaterial?._id.toString() };
		});
		return {
			...purchaseControl,
			composicao: formattedCompositionItems,
		};
	});

	// const bulkwriteResponse = await purchaseControlsCollection.bulkWrite(bulkwriteUpdatePurchaseControls);
	return res.status(200).json("DESATIVADA");
};

export default apiHandler({
	GET: handleFixPurchaseCompositionItems,
});
