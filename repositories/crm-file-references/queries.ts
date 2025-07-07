import type { TFileReference } from "@/utils/schemas/crm/file-reference.schema";
import type { Collection, Filter } from "mongodb";

type GetFileReferenceByQueryParams = {
	collection: Collection<TFileReference>;
	query: Filter<TFileReference>;
};

export async function getFileReferencesByQuery({ collection, query }: GetFileReferenceByQueryParams) {
	try {
		const references = await collection.find({ ...query, dataExclusao: null }).toArray();
		return references;
	} catch (error) {
		throw error;
	}
}
type GetFileReferenceByOpportunityParams = {
	collection: Collection<TFileReference>;
	opportunityId: string;
	query: Filter<TFileReference>;
};

export async function getFileReferencesByOpportunityId({ collection, opportunityId, query }: GetFileReferenceByOpportunityParams) {
	try {
		const references = await collection.find({ idOportunidade: opportunityId, dataExclusao: null }).toArray();
		return references;
	} catch (error) {
		throw error;
	}
}

type GetFileReferenceByAnalysisParams = {
	collection: Collection<TFileReference>;
	analysisId: string;
};

export async function getFileReferencesByAnalysisId({ collection, analysisId }: GetFileReferenceByAnalysisParams) {
	try {
		const references = await collection.find({ idAnaliseTecnica: analysisId, dataExclusao: null }).toArray();
		return references;
	} catch (error) {
		throw error;
	}
}
type GetFileReferenceByClientParams = {
	collection: Collection<TFileReference>;
	clientId: string;
};

export async function getFileReferencesByClientId({ collection, clientId }: GetFileReferenceByClientParams) {
	try {
		const references = await collection.find({ idCliente: clientId, dataExclusao: null }).toArray();
		return references;
	} catch (error) {
		throw error;
	}
}
type GetFileReferenceByHomologationParams = {
	collection: Collection<TFileReference>;
	homologationId: string;
};

export async function getFileReferencesByHomologationId({ collection, homologationId }: GetFileReferenceByHomologationParams) {
	try {
		const references = await collection.find({ idHomologacao: homologationId, dataExclusao: null }).toArray();
		return references;
	} catch (error) {
		throw error;
	}
}

type GetFileReferenceByCallParams = {
	collection: Collection<TFileReference>;
	callId: string;
};

export async function getFileReferencesByCallId({ collection, callId }: GetFileReferenceByCallParams) {
	try {
		const references = await collection.find({ idChamado: callId, dataExclusao: null }).toArray();
		return references;
	} catch (error) {
		throw error;
	}
}
