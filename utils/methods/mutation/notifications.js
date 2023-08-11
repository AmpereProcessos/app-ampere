export function getNotificationObjByMaterialMinQty({
  materialMinQty,
  materialNewQty,
  materialName,
}) {
  return {
    destinatario: "6353eb47ef4e1a367a877947",
    remetente: "SISTEMA",
    mensagem: `O material ${materialName} sofreu redução de quantidade para ${materialNewQty} itens. O limite mínimo para esse item é de ${materialMinQty}.`,
    lido: false,
    dataDeEnvio: new Date(),
  };
}
