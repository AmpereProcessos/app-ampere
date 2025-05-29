import type { TIGreenTechnicalAnalysis } from "@/pages/api/integracao/igreen/technical-analysis";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchTechnicalAnalysis() {
    try {
        const { data } = await axios.get('/api/integracao/igreen/technical-analysis')
        return data.data as TIGreenTechnicalAnalysis
    } catch (error) {
        console.error(error)
        throw error
    }
}


export function useIGreenTechnicalAnalysis() {
    return useQuery({
        queryKey: ['igreen-technical-analysis'],
        queryFn: fetchTechnicalAnalysis
    })
}

