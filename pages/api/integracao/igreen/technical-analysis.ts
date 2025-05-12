import { technicalAnalysis } from "@/utils/services/drizzle/schema/technical-analysis";
import { technicalAnalysisAnalysts } from "@/utils/services/drizzle/schema";
import type { NextApiHandler, NextApiRequest } from "next";
import { and, exists, eq, sql, inArray } from "drizzle-orm";
import { db } from "@/utils/services/drizzle";
import { apiHandler, validateAuthenticationWithSession } from "@/utils/api";

async function getTechnicalAnalysis(req: NextApiRequest) {


    const analysts = ['pic5yupyfcw30xqur1rw2']
    const conditions = []
    if (analysts.length > 0) {
        conditions.push(
            inArray(
                technicalAnalysis.id,
                db
                    .select({ id: technicalAnalysisAnalysts.analiseTecnicaId })
                    .from(technicalAnalysisAnalysts)
                    .where(inArray(technicalAnalysisAnalysts.usuarioId, analysts)),
            ),
        );
        // conditions.push(sql`EXISTS (
        //     SELECT 1 FROM ${technicalAnalysisAnalysts}
        //     WHERE ${technicalAnalysisAnalysts.analiseTecnicaId} = ${technicalAnalysis.id}
        //     AND ${technicalAnalysisAnalysts.usuarioId} IN ${analysts}
        // )`);
    }

    const technicalAnalysisResult = await db.query.technicalAnalysis.findMany({
        where: and(...conditions),
        with: {
            autor: {
                columns: {
                    id: true,
                    nome: true,
                    avatar: true,
                },
            },
            cliente: {
                columns: {
                    id: true,
                    nome: true,
                    telefonePrimario: true,
                    email: true,
                },
            },
            propostaVenda: {
                columns: {
                    id: true,
                    titulo: true,
                    dataGanho: true,
                    perdaData: true,
                    dataExpiracao: true,
                    dataInsercao: true,
                },
                with: {
                    autor: {
                        columns: {
                            id: true,
                            nome: true,
                            avatar: true,
                        },
                    },
                    produtos: {
                        columns: {
                            id: true,
                            quantidade: true,
                        },
                        with: {
                            produto: {
                                columns: {
                                    id: true,
                                    nome: true,
                                    natureza: true,
                                    numeroSerie: true,
                                    unidade: true,
                                    metadadosCategoriaProduto: true,
                                    metadadosFabricante: true,
                                    metadadosModelo: true,
                                    metadadosGarantiaMedida: true,
                                    metadadosGarantiaValor: true,
                                    metadadosPotencia: true,
                                },
                            },
                        },
                    },
                    servicos: {
                        columns: {
                            id: true,
                            quantidade: true,
                        },
                        with: {
                            servico: {
                                columns: {
                                    id: true,
                                    titulo: true,
                                    observacoes: true,
                                    garantiaMedida: true,
                                    garantiaValor: true,
                                },
                            },
                        },
                    },
                },
            },
            venda: {
                columns: {
                    id: true,
                    nome: true,
                    contratoStatus: true,
                    contratoDataAssinatura: true,
                    observacoes: true,
                    segmentoUsoImovel: true,
                    segmentoGeografico: true,
                    dataInsercao: true,
                },
                with: {
                    autor: {
                        columns: {
                            id: true,
                            nome: true,
                            avatar: true,
                        },
                    },
                    produtos: {
                        columns: {
                            id: true,
                            quantidade: true,
                        },
                        with: {
                            produto: {
                                columns: {
                                    id: true,
                                    nome: true,
                                    natureza: true,
                                    numeroSerie: true,
                                    unidade: true,
                                    metadadosCategoriaProduto: true,
                                    metadadosFabricante: true,
                                    metadadosModelo: true,
                                    metadadosGarantiaMedida: true,
                                    metadadosGarantiaValor: true,
                                    metadadosPotencia: true,
                                },
                            },
                        },
                    },
                    servicos: {
                        columns: {
                            id: true,
                            quantidade: true,
                        },
                        with: {
                            servico: {
                                columns: {
                                    id: true,
                                    titulo: true,
                                    observacoes: true,
                                    garantiaMedida: true,
                                    garantiaValor: true,
                                },
                            },
                        },
                    },
                },
            },
            projeto: {
                columns: {
                    id: true,
                    nome: true,
                    dataInicio: true,
                    dataPrevisaoConclusao: true,
                    dataConclusao: true,
                    contatosPrimarioNome: true,
                    contatosPrimarioTelefone: true,
                    contatosEmail: true,
                    contatosObservacoes: true,
                    localizacaoUf: true,
                    localizacaoCidade: true,
                    localizacaoCep: true,
                    localizacaoBairro: true,
                    localizacaoLogradouro: true,
                    localizacaoNumero: true,
                    localizacaoComplemento: true,
                    localizacaoLatitude: true,
                    localizacaoLongitude: true,
                    dataInsercao: true,
                },
                with: {
                    autor: {
                        columns: {
                            id: true,
                            nome: true,
                            avatar: true,
                        },
                    },
                    produtos: {
                        columns: {
                            id: true,
                            quantidade: true,
                        },
                        with: {
                            produto: {
                                columns: {
                                    id: true,
                                    nome: true,
                                    natureza: true,
                                    numeroSerie: true,
                                    unidade: true,
                                    metadadosCategoriaProduto: true,
                                    metadadosFabricante: true,
                                    metadadosModelo: true,
                                    metadadosGarantiaMedida: true,
                                    metadadosGarantiaValor: true,
                                    metadadosPotencia: true,
                                },
                            },
                        },
                    },
                    servicos: {
                        columns: {
                            id: true,
                            quantidade: true,
                        },
                        with: {
                            servico: {
                                columns: {
                                    id: true,
                                    titulo: true,
                                    observacoes: true,
                                    garantiaMedida: true,
                                    garantiaValor: true,
                                },
                            },
                        },
                    },
                },
            },
            analistas: {
                columns: {
                    id: true,
                },
                with: {
                    usuario: {
                        columns: {
                            id: true,
                            nome: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
        orderBy: (fields, { desc }) => desc(fields.dataInsercao),
    });

    return technicalAnalysisResult
}
export type TIGreenTechnicalAnalysis = Awaited<ReturnType<typeof getTechnicalAnalysis>>
const handleGetTechnicalAnalysis: NextApiHandler<{ data: TIGreenTechnicalAnalysis }> = async (req, res) => {

    const result = await getTechnicalAnalysis(req)

    res.status(200).json({ data: result })
}


export default apiHandler({
    GET: handleGetTechnicalAnalysis
})