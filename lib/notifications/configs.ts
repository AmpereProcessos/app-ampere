export const NOTIFICATION_TRACK_EVENTS_CONFIG = {
  MATERIAL_QUANTITY_BELOW_THRESHOLD: {
    to: ["64638b6c2071c508968bdf08"],
    subject: "QUANTIDADE DE MATERIAL ABAIXO DO LIMITE",
    body: ({
      materialName,
      materialQuantity,
    }: {
      materialName: string;
      materialQuantity: number;
    }) =>
      `A quantidade de material ${materialName} está abaixo do limite de ${materialQuantity} unidades.`,
    text: ({
      materialName,
      materialQuantity,
    }: {
      materialName: string;
      materialQuantity: number;
    }) =>
      `A quantidade de material ${materialName} está abaixo do limite de ${materialQuantity} unidades.`,
    primaryAction: {
      label: "CONFERIR",
      redirectUrl: "/almoxarifado/estoque",
    },
  },
};
