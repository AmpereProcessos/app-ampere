const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(relative, stubs = {}) {
  const filename = path.resolve(__dirname, '../..', relative);
  const loadedModule = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  new Function('require', 'module', 'exports', code)((id) => {
    if (id in stubs) return stubs[id];
    if (id.startsWith('@/')) return load(`${id.slice(2)}.ts`, stubs);
    return require(id);
  }, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const { getProjectEquipment, normalizeSystemTopology } = load('lib/projects/equipment.ts');
const { getProjectEquipmentForOrigin, getRemovedEquipmentFallbacks, getProductOrigin } = load('lib/projects/equipment.ts');
const { getProjectOemModuleQuantity, getProjectOemPower } = load('utils/methods/util/projects.ts');
const product = (categoria, qtde, potencia, origem = 'EXISTENTE') => ({ categoria, qtde, potencia, origem, modelo: 'Equipment', fabricante: 'Brand', garantia: 0 });
const legacy = { qtdeModulos: 20, potModulos: 440, potPico: 8.8, inversor: '1 - 6 kW', topologia: 'MICRO' };
const maintenance = 'OPERAÇÃO E MANUTENÇÃO';

test('historical projects without products retain module count, power, inverter and topology', () => {
  for (const produtos of [undefined, null, []]) {
    const project = { sistema: legacy, produtos, tipoDeServico: maintenance };
    const result = getProjectEquipment(project);
    assert.equal(result.modulos.qtde, 20);
    assert.equal(result.modulos.potencia, '440');
    assert.equal(result.inversor.qtde, 1);
    assert.equal(result.inversor.potencia, '6000');
    assert.equal(result.topologia, 'MICRO-INVERSOR');
    assert.equal(getProjectOemPower(project), 8.8);
    assert.equal(getProjectOemModuleQuantity(project), 20);
    assert.equal(result.derived.modules, false);
  }
});

test('partial historical records preserve isolated power and free-text inverter identification', () => {
  assert.equal(getProjectEquipment({ sistema: { potModulos: '555' } }).modulos.potencia, '555');
  for (const description of ['GROWATT', 'GROWATT 5000W']) {
    const result = getProjectEquipment({ sistema: { inversor: description } });
    assert.equal(result.inversorDescricao, description);
    assert.equal(result.inversor.modelo, description);
    assert.equal(result.inversor.qtde, 0);
  }
  assert.equal(getProjectEquipment({ sistema: { inversor: '0x(0W)' } }).inversorDescricao, '');
});

test('4590: existing products fill zero legacy fields without adding O&M quantities again', () => {
  const project = {
    tipoDeServico: maintenance,
    produtos: [product('MÓDULO', 8, 555), product('INVERSOR', 2, 2000)],
    oem: { qtdeModulos: 8, qtdeInversores: 2 },
    sistema: { qtdeModulos: 0, potPico: 0, inversor: '0x(0W)', topologia: 'MICRO' },
  };
  const result = getProjectEquipment(project);
  assert.equal(result.modulos.qtde, 8);
  assert.equal(result.modulos.potencia, '555');
  assert.equal(result.inversor.qtde, 2);
  assert.equal(result.potPico, 4.44);
  assert.equal(getProjectOemModuleQuantity(project), 8);
  assert.equal(getProjectOemPower(project), 4.44);
  assert.equal(result.topologia, 'MICRO-INVERSOR');
});

test('mixed sale and existing equipment are resolved by context and per category', () => {
  const project = {
    produtos: [product('MÓDULO', 8, 555), product('MÓDULO', 2, 600, 'VENDA'), product('INVERSOR', 1, 5000, undefined)],
    sistema: legacy,
    oem: { qtdeModulos: 44, qtdeInversores: 2 },
  };
  // Missing origin remains a sale, matching the existing schema convention.
  delete project.produtos[2].origem;
  const sale = getProjectEquipment(project, 'sale');
  const oem = getProjectEquipment(project, 'oem');
  assert.equal(sale.modulos.qtde, 2);
  assert.equal(sale.potPico, 1.2);
  assert.equal(sale.inversor.qtde, 1);
  assert.equal(oem.modulos.qtde, 8);
  assert.equal(oem.inversor.qtde, 2);
  assert.equal(oem.inversor.potencia, '6000');
});

test('origin groups do not repeat legacy system quantities in both sections', () => {
  const saleProject = { tipoDeServico: 'SISTEMA FOTOVOLTAICO', sistema: legacy, produtos: [] };
  assert.equal(getProjectEquipmentForOrigin(saleProject, 'VENDA').modulos.qtde, 20);
  assert.equal(getProjectEquipmentForOrigin(saleProject, 'EXISTENTE').modulos.qtde, 0);
  const oemProject = { ...saleProject, tipoDeServico: maintenance };
  assert.equal(getProjectEquipmentForOrigin(oemProject, 'EXISTENTE').modulos.qtde, 20);
  assert.equal(getProjectEquipmentForOrigin(oemProject, 'VENDA').modulos.qtde, 0);
  assert.equal(getProductOrigin({}), 'VENDA');
});

test('reclassifying or removing the last detailed category clears its stale fallback only', () => {
  const existingModule = product('MÓDULO', 8, 555);
  const existingInverter = product('INVERSOR', 2, 2000);
  const source = { tipoDeServico: maintenance, produtos: [existingModule, existingInverter], oem: { qtdeModulos: 8, qtdeInversores: 2 }, sistema: legacy };
  const next = [{ ...existingModule, origem: 'VENDA' }, existingInverter];
  const changes = getRemovedEquipmentFallbacks(source, next);
  assert.deepEqual(changes.sistema, { qtdeModulos: 0, potModulos: '', potPico: 0 });
  assert.deepEqual(changes.oem, { qtdeModulos: 0 });
  const after = { ...source, produtos: next, sistema: { ...source.sistema, ...changes.sistema }, oem: { ...source.oem, ...changes.oem } };
  assert.equal(getProjectEquipmentForOrigin(after, 'EXISTENTE').modulos.qtde, 0);
  assert.equal(getProjectEquipmentForOrigin(after, 'VENDA').modulos.qtde, 8);
  assert.equal(getProjectEquipmentForOrigin(after, 'EXISTENTE').inversor.qtde, 2);
  assert.deepEqual(getRemovedEquipmentFallbacks(source, [existingModule, { ...existingInverter, qtde: 1 }]), { sistema: {}, oem: {} });
  assert.deepEqual(getRemovedEquipmentFallbacks({ tipoDeServico: maintenance, sistema: legacy }, []), { sistema: {}, oem: {} });
});

test('partial products and O&M summaries keep independent legacy fallbacks', () => {
  const project = { tipoDeServico: maintenance, produtos: [product('MÓDULO', 8, null)], oem: { qtdeModulos: 44 }, sistema: legacy };
  const result = getProjectEquipment(project);
  assert.equal(result.modulos.qtde, 8);
  assert.equal(result.modulos.potencia, '440');
  assert.equal(result.potPico, 8.8);
  assert.equal(result.inversor.potencia, '6000');
  assert.equal(result.derived.modulePower, false);
  assert.equal(getProjectOemModuleQuantity({ oem: { qtdeModulos: 44 }, sistema: legacy }), 44);
  assert.equal(getProjectOemModuleQuantity({ oem: { qtdeModulos: 0 }, sistema: legacy }), 20);
});

test('multiple inverter powers are preserved, and placeholders do not create equipment', () => {
  for (const separator of [' - ', ' / ', '\n']) {
    const result = getProjectEquipment({ sistema: { inversor: `1xGROWATT(10000W)${separator}1xGROWATT(5000W)` } });
    assert.equal(result.inversor.qtde, 2);
    assert.equal(result.inversor.potencia, '10000 / 5000');
  }
  assert.equal(getProjectEquipment({ sistema: { inversor: '0x(0W)' } }).inversor.qtde, 0);
  assert.equal(normalizeSystemTopology(null), null);
  assert.equal(normalizeSystemTopology('MICRO-INVERSOR'), 'MICRO-INVERSOR');
  assert.equal(normalizeSystemTopology('not specified'), null);
});

test('both service-order metadata readers use the legacy and origin-aware resolver', () => {
  const helpers = load('utils/methods/util/service-order.ts');
  const project = { tipoDeServico: maintenance, sistema: legacy, produtos: [product('MÓDULO', 8, 555)] };
  assert.equal(helpers.getServiceOrderModulesMetadataFromProject(project).qtde, 8);
  assert.equal(helpers.getServiceOrderInverterMetadataFromProject(project).qtde, 1);
  assert.deepEqual(project.sistema, legacy);
});

test('new projects populate the system summary from existing products or legacy O&M fields', () => {
  const { getProjectInformationFromRequest } = load('utils/methods/util/contract-requests.ts', {
    '@/lib/project-journeys': { UFV_SYSTEM_PROJECT_JOURNEY_WORKFLOW_STAGES_LEGACY_CONFIG: [] },
    '@/utils/schemas/crm/kits.schema': { getExistingProducts: (items) => items.filter((item) => item.origem === 'EXISTENTE') },
    '../mutation/notifications': {},
    '../query/crm/file-references': {},
    '../query/crm/homologations': {},
  });
  const request = {
    nomeDoContrato: 'Test', tipoDeServico: maintenance, possuiOeM: 'SIM', planoOeM: 'MANUTENÇÃO SIMPLES',
    topologia: 'MICRO-INVERSOR', qtdeModulos: '', potModulos: '',
    qtdeModulosOem: '8', potModulosOem: '555', marcaInversorOem: 'HOYMILES', qtdeInversorOem: '2', potInversorOem: '2000',
  };
  for (const produtos of [[], [product('MÓDULO', 8, 555), product('INVERSOR', 2, 2000)]]) {
    const result = getProjectInformationFromRequest({ request: { ...request, produtos } });
    assert.equal(result.sistema.qtdeModulos, 8);
    assert.equal(result.sistema.potPico, 4.44);
    assert.equal(result.sistema.topologia, 'MICRO-INVERSOR');
    assert.equal(result.oem.qtdeModulos, 8);
    assert.match(result.sistema.inversor, /2x/);
    assert.match(result.sistema.inversor, /2000W/);
  }
});

test('O&M module filters include both limit values using new and legacy equipment', async () => {
  const projects = [
    { nomeDoContrato: 'New', sistema: {}, produtos: [product('MÓDULO', 8, 555)] },
    { nomeDoContrato: 'Old', sistema: { qtdeModulos: 8 } },
    { nomeDoContrato: 'Too many', sistema: { qtdeModulos: 9 } },
    { nomeDoContrato: 'Too few', sistema: { qtdeModulos: 7 } },
  ];
  const { useOeMProjects } = load('utils/methods/query/oem.ts', {
    '../util/projects': { getProjectOemModuleQuantity },
    '../formatting': {},
    react: { useState: (initial) => [{ ...initial, modulesQtyGte: 8, modulesQtyLte: 8 }, () => {}] },
    '@tanstack/react-query': { useQuery: (options) => ({ selected: options.queryFn().then(options.select) }) },
    axios: { get: async () => ({ data: projects }) },
  });
  assert.deepEqual((await useOeMProjects().selected).map((project) => project.nomeDoContrato), ['New', 'Old']);
});

test('O&M APIs project every fallback source instead of dropping new equipment', async () => {
  for (const [file, methods] of [
    ['pages/api/projects/oem.js', ['GET', 'POST']],
    ['pages/api/stats/sector-reports/oem.js', ['GET']],
  ]) {
    for (const method of methods) {
      let projection;
      let response;
      const route = load(file, {
        '../../../utils/services/mongodb/projects': async () => ({ collection: () => ({ aggregate: (pipeline) => {
          projection = pipeline.find((stage) => stage.$project).$project;
          return { toArray: async () => [] };
        } }) }),
        '../../../../utils/services/mongodb/projects': async () => ({ collection: () => ({ aggregate: (pipeline) => {
          projection = pipeline.find((stage) => stage.$project).$project;
          return { toArray: async () => [] };
        } }) }),
        '../../../../utils/methods/handlers': { errorHandler: (error) => { throw error; } },
      }).default;
      await route({ method }, { json: (value) => { response = value; } });
      assert.equal(projection.produtos, 1, `${file} ${method}`);
      assert.equal(projection['sistema.qtdeModulos'], 1);
      assert.equal(projection['sistema.potModulos'], 1);
      assert.equal(projection['sistema.potPico'], 1);
      assert.equal(projection['sistema.inversor'], 1);
      assert.equal(projection['sistema.topologia'], 1);
      assert.equal(projection['oem.qtdeModulos'], 1);
      assert.equal(projection['oem.qtdeInversores'], 1);
      assert.deepEqual(response, []);
    }
  }
});
