import axios from "axios";

export async function insertExpensesFromMaterials({
  warehouseFormId,
  category,
  user,
  projectId,
  projectQtde,
  projectName,
  projectType,
  materialList,
}) {
  try {
    const formattedItems = materialList.map((material) => {
      return {
        idMaterial: material.id, // id do material, se item estocável
        descricao: material.nome, // nome ou descrição do item de custo
        unidade: material.grandeza, // unidade do item
        preco: material.precoUnit, // preco unitário do item
        qtde: material.qtdeSaida - material.qtdeDevolucao, // quantidade de fato utilizada na execução do serviço
      };
    });
    const totalExpend = materialList.reduce((cummulative, current) => {
      const toSum =
        current.precoUnit * (current.qtdeSaida - current.qtdeDevolucao);
      return cummulative + toSum;
    }, 0);
    const costObj = {
      categoria: category,
      projeto: {
        id: projectId, // id do projeto ampère (contrato nosso, seja SFV, O&M, Montagem, Produto avulso, etc),
        nome: projectName, // nome do projeto no sistema (de modo a facilitar a identificação, e não fazer queries extras no sistema)
        identificador: projectQtde, // identificador QTDE do projeto no banco de projetos
        tipo: projectType, // tipo de projeto (ou tipo de serviço) dentro do banco de projetos
      },
      idFormularioAlmoxarifado: warehouseFormId,
      autor: {
        id: user.id, // id do usuário que criou o referente registro de custos
        nome: user.name, // nome do usuário que criou o referente registro de custos
      },
      itens: formattedItems,
      total: totalExpend, // somatória final do objeto de custo
      dataInsercao: new Date().toISOString(), // data de inserção do documento
    };
    await axios.post("/api/expenses", { data: costObj });

    return { status: "success", statusCode: 201 };
  } catch (error) {
    return {
      status: "error",
      statusCode: 500,
      message: "Erro ao retornar materiais.",
    };
  }
}
