"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import NumberInput from "@/components/inputs/Number";
import SelectInput from "@/components/inputs/Select";
import SelectVirtualizedInput from "@/components/inputs/SelectVirtualized";
import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import ProductItem from "@/components/blocosInfoProjeto/Utils/ProductItem";
import ServiceItem from "@/components/blocosInfoProjeto/Utils/ServiceItem";
import { Button } from "@/components/ui/button";
import { useEquipments } from "@/utils/methods/query/crm/equipments";
import type { TEquipmentDTO } from "@/utils/schemas/crm/equipments";
import type { TProductItem, TServiceItem } from "@/utils/schemas/crm/kits.schema";
import type { TProject } from "@/utils/schemas/projects";
import { ProductItemCategories, SystemTopologiesTypes } from "@/utils/select-options";

import { FieldGrid, StageSection } from "./shared";

type StageProps = {
	project: TProject;
	updateProjectWith: (updater: (project: TProject) => TProject) => void;
};

const batteryTypes = ["LÍTIO", "ESTACIONÁRIA", "NAO DEFINIDO"].map((value, index) => ({ id: index + 1, label: value === "NAO DEFINIDO" ? "NÃO DEFINIDO" : value, value }));
const controllerTypes = ["INTEGRADO AO INVERSOR", "SEPARADO", "NAO DEFINIDO"].map((value, index) => ({ id: index + 1, label: value, value }));

function sortProducts(products: TProductItem[]) {
	return [...products].sort((a, b) => a.categoria.localeCompare(b.categoria));
}

function normalizeSystemByProducts(project: TProject, products: TProductItem[]): TProject {
	const modules = products.filter((product) => product.categoria === "MÓDULO");
	const inverters = products.filter((product) => product.categoria === "INVERSOR");
	const modulesQty = modules.reduce((acc, product) => acc + Number(product.qtde || 0), 0);
	const modulesPeakPower = modules.reduce((acc, product) => acc + Number(product.qtde || 0) * Number(product.potencia || 0), 0) / 1000;
	const averageModulePower = modules.length > 0 ? modules.reduce((acc, product) => acc + Number(product.potencia || 0), 0) / modules.length : "";
	const inverterSummary = inverters.map((product) => `${product.qtde}x ${product.fabricante} ${product.modelo} ${product.potencia || 0}W`).join(" | ");

	return {
		...project,
		produtos: products,
		sistema: {
			...project.sistema,
			potPico: modules.length > 0 ? modulesPeakPower : project.sistema.potPico,
			qtdeModulos: modules.length > 0 ? modulesQty : 0,
			potModulos: averageModulePower,
			inversor: inverters.length > 0 ? inverterSummary : "",
		},
		homologacao: {
			...project.homologacao,
			potencia: modules.length > 0 ? modulesPeakPower : project.homologacao.potencia,
		},
	};
}

export function SistemaStage({ project, updateProjectWith }: StageProps) {
	const [productMenuOpen, setProductMenuOpen] = useState(false);
	const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
	const products = useMemo(() => project.produtos || [], [project.produtos]);
	const services = useMemo(() => project.servicos || [], [project.servicos]);
	const isOffGrid = project.tipoDeServico === "SISTEMA FOTOVOLTAICO (OFF GRID)";
	const isPump = project.tipoDeServico === "BOMBA SOLAR";

	function updateProducts(products: TProductItem[]) {
		const orderedProducts = sortProducts(products);
		updateProjectWith((prev) => normalizeSystemByProducts(prev, orderedProducts));
	}

	function updateServices(services: TServiceItem[]) {
		updateProjectWith((prev) => ({ ...prev, servicos: services }));
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<StageSection title="Valores e normalizações">
				<FieldGrid cols={4}>
					<NumberInput label="VALOR DO PROJETO" value={project.sistema.valorProjeto || 0} placeholder="0,00" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, valorProjeto: value } }))} width="100%" />
					<NumberInput label="POTÊNCIA PICO (kWp)" value={project.sistema.potPico || 0} placeholder="Potência" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, potPico: value }, homologacao: { ...prev.homologacao, potencia: value } }))} width="100%" />
					<SelectInput label="TOPOLOGIA" value={project.sistema.topologia || null} selectedItemLabel="NAO DEFINIDO" options={SystemTopologiesTypes} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, topologia: value as TProject["sistema"]["topologia"] } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, topologia: null } }))} width="100%" />
					<TextInput label="KIT / OBS. EQUIPAMENTOS" value={project.compra.kitInfo || ""} placeholder="Resumo do kit" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, compra: { ...prev.compra, kitInfo: value } }))} width="100%" />
					<TextInput label="NÚMERO DE MÓDULOS" value={project.sistema.qtdeModulos?.toString() || ""} placeholder="Calculado pelos produtos" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, qtdeModulos: Number(value) || 0 } }))} width="100%" />
					<TextInput label="POTÊNCIA DOS MÓDULOS" value={project.sistema.potModulos?.toString() || ""} placeholder="Calculado pelos produtos" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, potModulos: value } }))} width="100%" />
					<TextInput label="INVERSORES" value={project.sistema.inversor || ""} placeholder="Calculado pelos produtos" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, inversor: value } }))} width="100%" />
				</FieldGrid>
			</StageSection>

			<StageSection title="Produtos">
				<div className="flex w-full items-center justify-between gap-2">
					<p className="text-xs font-medium text-primary/60">{products.length} produto(s) na composição.</p>
					<Button type="button" size="sm" variant={productMenuOpen ? "secondary" : "outline"} onClick={() => setProductMenuOpen((prev) => !prev)} className="gap-2">
						<Plus className="h-4 w-4" />
						ADICIONAR PRODUTO
					</Button>
				</div>
				{productMenuOpen ? <ProductCompositionMenu products={products} updateProducts={updateProducts} /> : null}
				{products.length > 0 ? (
					<div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
						{products.map((product, index) => (
							<ProductItem key={`${product.categoria}-${product.modelo}-${index}`} product={product} index={index} removeProduct={(itemIndex) => updateProducts(products.filter((_, index) => index !== itemIndex))} />
						))}
					</div>
				) : (
					<p className="rounded-md border border-dashed border-primary/15 p-4 text-center text-sm text-primary/60">Nenhum produto adicionado. Esta etapa pode seguir sem módulos, inversores ou outros equipamentos.</p>
				)}
			</StageSection>

			<StageSection title="Serviços">
				<div className="flex w-full items-center justify-between gap-2">
					<p className="text-xs font-medium text-primary/60">{services.length} serviço(s) na composição.</p>
					<Button type="button" size="sm" variant={serviceMenuOpen ? "secondary" : "outline"} onClick={() => setServiceMenuOpen((prev) => !prev)} className="gap-2">
						<Plus className="h-4 w-4" />
						ADICIONAR SERVIÇO
					</Button>
				</div>
				{serviceMenuOpen ? <ServiceCompositionMenu services={services} updateServices={updateServices} /> : null}
				{services.length > 0 ? (
					<div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
						{services.map((service, index) => (
							<ServiceItem key={`${service.descricao}-${index}`} service={service} index={index} removeService={(itemIndex) => updateServices(services.filter((_, index) => index !== itemIndex))} />
						))}
					</div>
				) : (
					<p className="rounded-md border border-dashed border-primary/15 p-4 text-center text-sm text-primary/60">Nenhum serviço adicionado.</p>
				)}
			</StageSection>

			{isOffGrid || isPump ? (
				<StageSection title="Sistema especial">
					{isOffGrid ? (
						<FieldGrid cols={4}>
							<SelectInput label="TIPO DO CONTROLADOR" value={project.sistema.tipoControlador || null} selectedItemLabel="NAO DEFINIDO" options={controllerTypes} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, tipoControlador: value } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, tipoControlador: "" } }))} width="100%" />
							<TextInput label="MARCA DO CONTROLADOR" value={project.sistema.marcaControlador || ""} placeholder="Marca" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, marcaControlador: value } }))} width="100%" />
							<NumberInput label="QTDE CONTROLADORES" value={project.sistema.qtdeControlador || 0} placeholder="Quantidade" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, qtdeControlador: value } }))} width="100%" />
							<NumberInput label="CORRENTE CONTROLADOR" value={project.sistema.correnteControlador || 0} placeholder="A" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, correnteControlador: value } }))} width="100%" />
						</FieldGrid>
					) : null}
					{isPump ? (
						<FieldGrid>
							<TextInput label="MARCA DA BOMBA" value={project.sistema.marcaBomba || ""} placeholder="Marca" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, marcaBomba: value } }))} width="100%" />
							<NumberInput label="QTDE BOMBAS" value={project.sistema.qtdeBomba || 0} placeholder="Quantidade" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, qtdeBomba: value } }))} width="100%" />
							<NumberInput label="POTÊNCIA BOMBA" value={project.sistema.potBomba || 0} placeholder="Potência" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, potBomba: value } }))} width="100%" />
						</FieldGrid>
					) : null}
					<FieldGrid cols={4}>
						<TextInput label="MARCA DA BATERIA" value={project.sistema.marcaBateria || ""} placeholder="Marca" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, marcaBateria: value } }))} width="100%" />
						<NumberInput label="QTDE BATERIAS" value={project.sistema.qtdeBateria || 0} placeholder="Quantidade" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, qtdeBateria: value } }))} width="100%" />
						<SelectInput label="TIPO DA BATERIA" value={project.sistema.tipoBateria || null} selectedItemLabel="NAO DEFINIDO" options={batteryTypes} handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, tipoBateria: value } }))} onReset={() => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, tipoBateria: "" } }))} width="100%" />
						<NumberInput label="CAPACIDADE (Ah)" value={project.sistema.capacidadeBateria || 0} placeholder="Ah" handleChange={(value) => updateProjectWith((prev) => ({ ...prev, sistema: { ...prev.sistema, capacidadeBateria: value } }))} width="100%" />
					</FieldGrid>
				</StageSection>
			) : null}

			<StageSection title="Observações">
				<TextareaInput label="OBSERVAÇÕES DE COMPOSIÇÃO" value={project.compra.informacoes || ""} placeholder="Itens relevantes, serviços inclusos, particularidades do kit..." handleChange={(value) => updateProjectWith((prev) => ({ ...prev, compra: { ...prev.compra, informacoes: value } }))} />
			</StageSection>
		</div>
	);
}

type ProductCompositionMenuProps = {
	products: TProductItem[];
	updateProducts: (products: TProductItem[]) => void;
};

function ProductCompositionMenu({ products, updateProducts }: ProductCompositionMenuProps) {
	const { data: equipments } = useEquipments({ category: null });
	const [inverterHolder, setInverterHolder] = useState({ equipment: null as TEquipmentDTO | null, qtde: 1, garantia: 10 });
	const [moduleHolder, setModuleHolder] = useState({ equipment: null as TEquipmentDTO | null, qtde: 1, garantia: 10 });
	const [customProduct, setCustomProduct] = useState<TProductItem>({
		id: null,
		categoria: "OUTROS",
		fabricante: "",
		modelo: "",
		qtde: 1,
		potencia: 0,
		garantia: 0,
		valor: null,
	});
	const inverters = equipments?.filter((equipment) => equipment.categoria === "INVERSOR") || [];
	const modules = equipments?.filter((equipment) => equipment.categoria === "MÓDULO") || [];

	function addCatalogProduct(type: "module" | "inverter") {
		const holder = type === "module" ? moduleHolder : inverterHolder;
		if (!holder.equipment) return toast.error(type === "module" ? "Selecione um módulo." : "Selecione um inversor.");
		if (holder.qtde <= 0) return toast.error("Preencha uma quantidade válida.");
		const product: TProductItem = {
			id: holder.equipment._id,
			categoria: holder.equipment.categoria as TProductItem["categoria"],
			fabricante: holder.equipment.fabricante,
			modelo: holder.equipment.modelo,
			qtde: holder.qtde,
			potencia: holder.equipment.potencia || 0,
			garantia: holder.garantia,
		};
		updateProducts([...products, product]);
		if (type === "module") setModuleHolder({ equipment: null, qtde: 1, garantia: 10 });
		if (type === "inverter") setInverterHolder({ equipment: null, qtde: 1, garantia: 10 });
	}

	function addCustomProduct() {
		if (customProduct.fabricante.trim().length < 2) return toast.error("Informe o fabricante do produto.");
		if (customProduct.modelo.trim().length < 2) return toast.error("Informe o modelo do produto.");
		if (customProduct.qtde <= 0) return toast.error("Preencha uma quantidade válida.");
		updateProducts([...products, { ...customProduct, id: null }]);
		setCustomProduct({ id: null, categoria: "OUTROS", fabricante: "", modelo: "", qtde: 1, potencia: 0, garantia: 0, valor: null });
	}

	return (
		<div className="flex w-full flex-col gap-3 rounded-md border border-primary/10 bg-white p-3 dark:bg-[#121212]">
			<div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-[1fr_120px_120px_auto] lg:items-end">
				<SelectVirtualizedInput<TEquipmentDTO>
					label="INVERSOR"
					value={inverterHolder.equipment}
					handleChange={(equipment) => setInverterHolder((prev) => ({ ...prev, equipment }))}
					onReset={() => setInverterHolder({ equipment: null, qtde: 1, garantia: 10 })}
					selectedItemLabel="NAO DEFINIDO"
					options={inverters.map((equipment) => ({ id: equipment._id, label: `${equipment.fabricante} - ${equipment.modelo}`, value: equipment }))}
					width="100%"
				/>
				<NumberInput label="QTDE" value={inverterHolder.qtde} handleChange={(value) => setInverterHolder((prev) => ({ ...prev, qtde: Number(value) }))} placeholder="QTDE" width="100%" />
				<NumberInput label="GARANTIA" value={inverterHolder.garantia} handleChange={(value) => setInverterHolder((prev) => ({ ...prev, garantia: Number(value) }))} placeholder="ANOS" width="100%" />
				<Button type="button" onClick={() => addCatalogProduct("inverter")}>ADICIONAR</Button>
			</div>

			<div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-[1fr_120px_120px_auto] lg:items-end">
				<SelectVirtualizedInput<TEquipmentDTO>
					label="MÓDULO"
					value={moduleHolder.equipment}
					handleChange={(equipment) => setModuleHolder((prev) => ({ ...prev, equipment }))}
					onReset={() => setModuleHolder({ equipment: null, qtde: 1, garantia: 10 })}
					selectedItemLabel="NAO DEFINIDO"
					options={modules.map((equipment) => ({ id: equipment._id, label: `${equipment.fabricante} - ${equipment.modelo}`, value: equipment }))}
					width="100%"
				/>
				<NumberInput label="QTDE" value={moduleHolder.qtde} handleChange={(value) => setModuleHolder((prev) => ({ ...prev, qtde: Number(value) }))} placeholder="QTDE" width="100%" />
				<NumberInput label="GARANTIA" value={moduleHolder.garantia} handleChange={(value) => setModuleHolder((prev) => ({ ...prev, garantia: Number(value) }))} placeholder="ANOS" width="100%" />
				<Button type="button" onClick={() => addCatalogProduct("module")}>ADICIONAR</Button>
			</div>

			<div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-[160px_1fr_1fr_120px_100px_100px_120px_auto] lg:items-end">
				<SelectInput label="CATEGORIA" selectedItemLabel="NAO DEFINIDO" options={ProductItemCategories} value={customProduct.categoria} handleChange={(value) => setCustomProduct((prev) => ({ ...prev, categoria: value as TProductItem["categoria"] }))} onReset={() => setCustomProduct((prev) => ({ ...prev, categoria: "OUTROS" }))} width="100%" />
				<TextInput label="FABRICANTE" placeholder="Fabricante" value={customProduct.fabricante} handleChange={(value) => setCustomProduct((prev) => ({ ...prev, fabricante: value }))} width="100%" />
				<TextInput label="MODELO" placeholder="Modelo" value={customProduct.modelo} handleChange={(value) => setCustomProduct((prev) => ({ ...prev, modelo: value }))} width="100%" />
				<NumberInput label="POTÊNCIA" value={customProduct.potencia || 0} handleChange={(value) => setCustomProduct((prev) => ({ ...prev, potencia: Number(value) }))} placeholder="W" width="100%" />
				<NumberInput label="QTDE" value={customProduct.qtde} handleChange={(value) => setCustomProduct((prev) => ({ ...prev, qtde: Number(value) }))} placeholder="QTDE" width="100%" />
				<NumberInput label="GARANTIA" value={customProduct.garantia} handleChange={(value) => setCustomProduct((prev) => ({ ...prev, garantia: Number(value) }))} placeholder="ANOS" width="100%" />
				<NumberInput label="VALOR" value={customProduct.valor || 0} handleChange={(value) => setCustomProduct((prev) => ({ ...prev, valor: Number(value) }))} placeholder="0,00" width="100%" />
				<Button type="button" onClick={addCustomProduct}>ADICIONAR</Button>
			</div>
		</div>
	);
}

type ServiceCompositionMenuProps = {
	services: TServiceItem[];
	updateServices: (services: TServiceItem[]) => void;
};

function ServiceCompositionMenu({ services, updateServices }: ServiceCompositionMenuProps) {
	const [serviceHolder, setServiceHolder] = useState<TServiceItem>({
		descricao: "",
		observacoes: "",
		garantia: 0,
		valor: null,
	});

	function addService() {
		if (serviceHolder.descricao.trim().length < 2) return toast.error("Preencha uma descrição de serviço válida.");
		if (serviceHolder.garantia < 0) return toast.error("Preencha uma garantia válida.");
		updateServices([...services, serviceHolder]);
		setServiceHolder({ descricao: "", observacoes: "", garantia: 0, valor: null });
	}

	return (
		<div className="flex w-full flex-col gap-2 rounded-md border border-primary/10 bg-white p-3 dark:bg-[#121212]">
			<div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-[1fr_120px_140px_auto] lg:items-end">
				<TextInput label="DESCRIÇÃO" placeholder="Descrição do serviço" value={serviceHolder.descricao} handleChange={(value) => setServiceHolder((prev) => ({ ...prev, descricao: value }))} width="100%" />
				<NumberInput label="GARANTIA" placeholder="Anos" value={serviceHolder.garantia} handleChange={(value) => setServiceHolder((prev) => ({ ...prev, garantia: value }))} width="100%" />
				<NumberInput label="VALOR" placeholder="0,00" value={serviceHolder.valor || 0} handleChange={(value) => setServiceHolder((prev) => ({ ...prev, valor: value }))} width="100%" />
				<Button type="button" onClick={addService}>ADICIONAR</Button>
			</div>
			<TextareaInput label="OBSERVAÇÕES DO SERVIÇO" value={serviceHolder.observacoes} handleChange={(value) => setServiceHolder((prev) => ({ ...prev, observacoes: value }))} placeholder="Observações, escopo ou particularidades do serviço..." />
		</div>
	);
}
