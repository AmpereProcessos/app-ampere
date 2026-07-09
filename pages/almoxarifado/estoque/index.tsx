import { useSession } from "@/components/providers/SessionProvider";
import type { TAuthSession } from "@/lib/authentication/types";
import Link from "next/link";
import React, { useState } from "react";

import { FaBox } from "react-icons/fa";

import LoadingPage from "../../../components/utils/LoadingPage";

import NewPurchaseControlSimplified from "@/components/identificador/controles-compras/modals/NewPurchaseControlSimplified";
import EditMaterial from "@/components/identificador/estoque/EditMaterial";
import NewMaterial from "@/components/identificador/estoque/NewMaterial";
import StockSnapshotExportMenu from "@/components/identificador/estoque/StockSnapshotExportMenu";
import CheckboxInput from "@/components/inputs/Checkbox";
import DateTimeInput from "@/components/inputs/DateTimeInput";
import MultipleSelectInput from "@/components/inputs/MultipleSelect";
import SelectInput from "@/components/inputs/Select";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import UnauthenticatedComponent from "@/components/utils/UnauthenticatedComponent";
import UnauthorizedComponent from "@/components/utils/UnauthorizedComponent";
import { cn } from "@/lib/utils";
import type {
  TGetMaterialsDatabaseInput,
  TGetMaterialsDatabaseOutput,
} from "@/pages/api/almoxarifado/estoque/database";
import { SlideMotionVariants, formatDecimalPlaces } from "@/utils/constants";
import { formatDateAsLocale, formatDateTimeForInput } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { formatDateInputChange } from "@/utils/methods/shared";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  Camera,
  ChartColumn,
  Code,
  Edit,
  FileText,
  MapPin,
  MoveDownRight,
  MoveUpRight,
  PackageMinus,
  PackagePlus,
  Plus,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { BsCalendarPlus } from "react-icons/bs";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import NumberInput from "../../../components/inputs/Number";
import TextInput from "../../../components/inputs/Text";
import { useMaterialSuppliers, useMaterialsDatabase } from "../../../utils/methods/query/materials";

function StockPage() {
  const { session, status } = useSession();
  if (status === "loading") return <LoadingPage />;
  if (status === "unauthenticated") return <UnauthenticatedComponent />;

  const isAuthorized =
    !!session?.user.permissoes.almoxarifado.visualizar ||
    !!session?.user.permissoes.execucao.visualizar;
  if (!isAuthorized) return <UnauthorizedComponent />;

  return <StockPageComponent session={session} />;
}

export default StockPage;

type StockPageComponentProps = {
  session: TAuthSession;
};
function StockPageComponent({ session }: StockPageComponentProps) {
  const queryClient = useQueryClient();
  const [filterMenuIsOpens, setFilterMenuIsOpen] = useState<boolean>(false);
  const [newMaterialModalIsOpen, setNewMaterialModalIsOpen] = useState<boolean>(false);
  const [editMaterialModal, setEditMaterialModal] = useState({
    id: null as string | null,
    isOpen: false,
  });
  const [newPurchaseControlModalIsOpen, setNewPurchaseControlModalIsOpen] =
    useState<boolean>(false);
  const [snapshotExportMenuIsOpen, setSnapshotExportMenuIsOpen] = useState<boolean>(false);
  const {
    data: materialsResult,
    isLoading,
    isError,
    isSuccess,
    error,
    filters,
    updateFilters,
  } = useMaterialsDatabase();

  const handleOnMutate = async () =>
    await queryClient.cancelQueries({ queryKey: ["materials-database", filters] });
  const handleOnSettled = async () =>
    await queryClient.invalidateQueries({ queryKey: ["materials-database", filters] });
  const materials = materialsResult?.materials || [];
  const materialsMatched = materialsResult?.materialsMatched || 0;
  const materialsShowing = materials.length;
  const totalPages = materialsResult?.totalPages || 0;
  return (
    <div className="flex grow flex-col gap-2 p-6">
      <div className="border-border flex flex-col items-center justify-between gap-2 border-b p-1">
        <div className="flex w-full items-center justify-between">
          <p className="text-center text-2xl font-black text-[#15599a] uppercase">ESTOQUE</p>
          <div className="flex items-center gap-2">
            {filterMenuIsOpens ? (
              <div className="text-foreground cursor-pointer hover:text-blue-400">
                <IoMdArrowDropupCircle
                  style={{ fontSize: "25px" }}
                  onClick={() => setFilterMenuIsOpen(false)}
                />
              </div>
            ) : (
              <div className="text-foreground cursor-pointer hover:text-blue-400">
                <IoMdArrowDropdownCircle
                  style={{ fontSize: "25px" }}
                  onClick={() => setFilterMenuIsOpen(true)}
                />
              </div>
            )}
            <Button
              variant={"ghost"}
              onClick={() => setNewPurchaseControlModalIsOpen((prev) => !prev)}
            >
              NOVA SOLICITAÇÃO DE COMPRA
            </Button>
            <Button onClick={() => setNewMaterialModalIsOpen((prev) => !prev)}>
              NOVO MATERIAL
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-6 gap-y-1.5 lg:justify-end">
          <Link
            href={"/suprimentos/entregas?tagIds=67113e8d1cef044a60bb7606"}
            className="flex items-center gap-1 transition-colors hover:text-cyan-500"
          >
            <FaBox className="h-4 w-4" />
            <p className="text-xs">ACOMPANHAMENTO DE ENTREGAS</p>
          </Link>
          <Link
            href={"/almoxarifado/estoque/relatorio-pdf"}
            className="flex items-center gap-1 transition-colors hover:text-cyan-500"
          >
            <FileText className="h-4 w-4" />
            <p className="text-xs">RELATÓRIO EM PDF</p>
          </Link>
          <button
            type="button"
            onClick={() => setSnapshotExportMenuIsOpen(true)}
            className="flex items-center gap-1 transition-colors hover:text-cyan-500"
          >
            <Camera className="h-4 w-4" />
            <p className="text-xs">SNAPSHOT DO ESTOQUE</p>
          </button>
          <Link
            href={"/almoxarifado/estoque/analitico"}
            className="flex items-center gap-1 transition-colors hover:text-cyan-500"
          >
            <ChartColumn className="h-4 w-4" />
            <p className="text-xs">ANÁLITICO</p>
          </Link>
          <Link
            href={"/almoxarifado/estoque/entrada"}
            className="flex items-center gap-1 transition-colors hover:text-cyan-500"
          >
            <Plus className="h-4 w-4" />
            <p className="text-xs">ENTRADA DE MATERIAIS</p>
          </Link>
        </div>
      </div>
      <AnimatePresence>
        {filterMenuIsOpens ? (
          <FiltersMenu
            filters={filters}
            updateFilters={updateFilters}
            closeMenu={() => setFilterMenuIsOpen(false)}
          />
        ) : null}
      </AnimatePresence>
      <GeneralPaginationComponent
        activePage={filters.page}
        queryLoading={isLoading}
        selectPage={(page) => updateFilters({ page })}
        totalPages={totalPages}
        itemsMatchedText={`Foram encontrados ${materialsMatched} materiais.`}
        itemsShowingText={`Monstrando ${materialsShowing} materiais.`}
      />
      {isLoading ? <LoadingPage /> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      <div className="flex w-full flex-col gap-3">
        {isSuccess && materials ? (
          materials.length > 0 ? (
            materials.map((material) => (
              <MaterialCard
                key={material._id}
                material={material}
                handleClick={(id) =>
                  setEditMaterialModal({
                    id: id,
                    isOpen: true,
                  })
                }
              />
            ))
          ) : (
            <p className="text-muted-foreground w-full text-center tracking-tight">
              Nenhum material foi encontrado.
            </p>
          )
        ) : null}
      </div>
      {newMaterialModalIsOpen ? (
        <NewMaterial
          session={session}
          closeModal={() => setNewMaterialModalIsOpen(false)}
          callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
        />
      ) : null}
      {editMaterialModal.id && editMaterialModal.isOpen ? (
        <EditMaterial
          materialId={editMaterialModal.id}
          session={session}
          closeModal={() => setEditMaterialModal({ id: null, isOpen: false })}
          callbacks={{ onMutate: handleOnMutate, onSettled: handleOnSettled }}
        />
      ) : null}
      {newPurchaseControlModalIsOpen ? (
        <NewPurchaseControlSimplified
          session={session}
          affectedQueryKey={[]}
          initialData={{
            etiquetas: [
              {
                id: "67113e8d1cef044a60bb7606",
                titulo: "ALMOXARIFADO",
                cores: {
                  primaria: "#FF0000",
                  secundaria: "#FFCCCB",
                },
              },
            ],
          }}
          closeModal={() => setNewPurchaseControlModalIsOpen(false)}
        />
      ) : null}
      {snapshotExportMenuIsOpen ? (
        <StockSnapshotExportMenu closeMenu={() => setSnapshotExportMenuIsOpen(false)} />
      ) : null}
    </div>
  );
}

type MaterialCardProps = {
  material: TGetMaterialsDatabaseOutput["materials"][number];
  handleClick: (id: string) => void;
};
function MaterialCard({ material, handleClick }: MaterialCardProps) {
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-3 rounded border p-2 shadow-xs sm:flex-row dark:bg-[#121212]">
      <div className="flex items-center justify-center">
        <div className="relative h-20 max-h-20 min-h-20 w-20 max-w-20 min-w-20 overflow-hidden rounded-lg">
          {material.imagemUrl ? (
            <Image src={material.imagemUrl} alt={material.nome} fill={true} objectFit="cover" />
          ) : (
            <div className="bg-primary/50 text-primary-foreground flex h-full w-full items-center justify-center">
              <Box className="h-6 w-6" />
            </div>
          )}
        </div>
      </div>
      <div className="flex h-full grow flex-col justify-between gap-2">
        <div className="flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
          <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:grow lg:justify-start">
            <div className="flex items-center gap-1">
              <div className="bg-secondary text-foreground flex items-center gap-1 rounded-lg px-2 py-0.5 text-center text-[0.65rem] font-bold italic">
                <Code size={12} />
                {material.sku || "N/A"}
              </div>
              <h1 className="text-sm font-bold tracking-tight">{material.nome}</h1>
            </div>
            {material.localizacao ? (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 min-h-4 w-4 min-w-4" />
                <h1 className="text-foreground py-0.5 text-center text-xs font-medium italic">
                  LOCALIZAÇÃO
                </h1>
                <h1 className="text-primary py-0.5 text-center text-xs font-bold">
                  {material.localizacao}
                </h1>
              </div>
            ) : null}
            {material.qtdeMinima ? (
              <div className="flex items-center gap-1">
                <PackageMinus className="h-4 min-h-4 w-4 min-w-4" />
                <h1 className="text-foreground py-0.5 text-center text-xs font-medium italic">
                  QTDE MÍNIMA
                </h1>
                <h1 className="text-primary py-0.5 text-center text-xs font-bold">
                  {formatDecimalPlaces(material.qtdeMinima)}
                </h1>
              </div>
            ) : null}
            {material.qtdeMaxima ? (
              <div className="flex items-center gap-1">
                <PackagePlus className="h-4 min-h-4 w-4 min-w-4" />
                <h1 className="text-foreground py-0.5 text-center text-xs font-medium italic">
                  QTDE MÁXIMA
                </h1>
                <h1 className="text-primary py-0.5 text-center text-xs font-bold">
                  {formatDecimalPlaces(material.qtdeMaxima)}
                </h1>
              </div>
            ) : null}
            <div className="flex grow flex-wrap items-center justify-start gap-2">
              <h1 className="text-foreground py-0.5 text-center text-xs font-medium italic">
                FORNECEDORES
              </h1>
              {material.fornecedores && material.fornecedores.length > 0 ? (
                material.fornecedores.map((fornecedor, index) => (
                  <div
                    key={`${fornecedor.id}-${index}`}
                    style={{
                      border: "1px solid",
                      borderColor: fornecedor.cores.primaria,
                      color: fornecedor.cores.primaria,
                      backgroundColor: fornecedor.cores.secundaria,
                    }}
                    className={cn("flex items-center gap-1 rounded px-2 py-0.5")}
                  >
                    <Truck className="h-3 min-h-3 w-3 min-w-3" />
                    <h1 className="text-[0.55rem] font-bold tracking-tight">{fornecedor.nome}</h1>
                  </div>
                ))
              ) : (
                <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
                  NENHUM FORNECEDOR DEFINIDO
                </h1>
              )}
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-2 lg:min-w-fit lg:justify-end">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "bg-primary text-primary-foreground flex items-center gap-1 rounded-lg px-2 py-1",
                  {
                    "bg-red-500 text-white":
                      (material.qtdeMinima && material.qtde <= material.qtdeMinima) ||
                      (material.qtdeMaxima && material.qtde >= material.qtdeMaxima),
                  },
                )}
              >
                <Box className="h-4 w-4" />
                <h3 className="text-xs font-bold">
                  {formatDecimalPlaces(material.qtde)} {material.grandeza || "UN"}
                </h3>
                {material.qtdeMinima && material.qtde <= material.qtdeMinima ? (
                  <MoveDownRight className="h-4 w-4" />
                ) : null}
                {material.qtdeMaxima && material.qtde >= material.qtdeMaxima ? (
                  <MoveUpRight className="h-4 w-4" />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <BsCalendarPlus />
              <p className="text-foreground text-[0.65rem] font-medium">
                {formatDateAsLocale(material.dataInsercao, true)}
              </p>
            </div>
          </div>
          <Button
            variant={"ghost"}
            size="fit"
            onClick={() => handleClick(material._id)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6rem]"
          >
            <Edit className="h-3 min-h-3 w-3 min-w-3" />
            <p className="text-[0.65rem] font-medium">EDITAR</p>
          </Button>
        </div>
      </div>
    </div>
  );
}

type FiltersMenuProps = {
  filters: TGetMaterialsDatabaseInput;
  updateFilters: (filters: Partial<TGetMaterialsDatabaseInput>) => void;
  closeMenu: () => void;
};
function FiltersMenu({ filters, updateFilters, closeMenu }: FiltersMenuProps) {
  const { data: suppliers } = useMaterialSuppliers();
  const [filtersHolder, setFiltersHolder] = useState(filters);

  return (
    <motion.div
      key={"additional-info"}
      variants={SlideMotionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="border-border flex w-full flex-col gap-2 rounded border p-2"
    >
      <h1 className="text-sm font-bold tracking-tight">FILTROS DO BANCO DE MATERIAIS</h1>
      <div className="flex w-full flex-wrap items-center gap-2">
        <TextInput
          label="NOME DO MATERIAL"
          placeholder="Preencha aqui o nome do material..."
          value={filtersHolder.name}
          handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, name: value }))}
        />
        <TextInput
          label="CÓDIGO DO MATERIAL"
          placeholder="Preencha aqui o código do material..."
          value={filtersHolder.sku}
          handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, sku: value }))}
        />
        <TextInput
          label="LOCALIZAÇÃO"
          placeholder="Preencha aqui a localização do material..."
          value={filtersHolder.location}
          handleChange={(value) => setFiltersHolder((prev) => ({ ...prev, location: value }))}
        />

        <MultipleSelectInput
          label="FORNECEDORES"
          options={
            suppliers?.map((supplier) => ({
              id: supplier._id,
              label: supplier.nome,
              value: supplier._id,
            })) || []
          }
          selected={filtersHolder.suppliers}
          selectedItemLabel="NENHUM"
          handleChange={(value) =>
            setFiltersHolder((prev) => ({ ...prev, suppliers: value as string[] }))
          }
          onReset={() => setFiltersHolder((prev) => ({ ...prev, suppliers: [] }))}
        />
        <NumberInput
          label="QUANTIDADE > QUE"
          placeholder="Preencha aqui quantidade maior que.."
          value={filtersHolder.quantity.greaterThan || null}
          handleChange={(value) =>
            setFiltersHolder((prev) => ({
              ...prev,
              quantity: { ...prev.quantity, greaterThan: value },
            }))
          }
        />
        <NumberInput
          label="QUANTIDADE < QUE"
          placeholder="Preencha aqui quantidade menor que..."
          value={filtersHolder.quantity.lessThan || null}
          handleChange={(value) =>
            setFiltersHolder((prev) => ({
              ...prev,
              quantity: { ...prev.quantity, lessThan: value },
            }))
          }
        />
        <NumberInput
          label="PREÇO UNITÁRIO > QUE"
          placeholder="Preencha aqui preço unitário maior que.."
          value={filtersHolder.price.greaterThan || null}
          handleChange={(value) =>
            setFiltersHolder((prev) => ({ ...prev, price: { ...prev.price, greaterThan: value } }))
          }
        />
        <NumberInput
          label="PREÇO UNITÁRIO < QUE"
          placeholder="Preencha aqui preço unitário menor que..."
          value={filtersHolder.price.lessThan || null}
          handleChange={(value) =>
            setFiltersHolder((prev) => ({ ...prev, price: { ...prev.price, lessThan: value } }))
          }
        />
        <SelectInput
          label="TIPO DE MATERIAL"
          value={filtersHolder.materialType}
          options={[
            {
              id: 1,
              label: "EQUIPAMENTO",
              value: "equipment-only",
            },
            {
              id: 2,
              label: "NÃO EQUIPAMENTO",
              value: "non-equipment-only",
            },
            {
              id: 3,
              label: "TODOS",
              value: "all",
            },
          ]}
          selectedItemLabel="NÃO DEFINIDO"
          handleChange={(value) =>
            setFiltersHolder((prev) => ({
              ...prev,
              materialType: value as "equipment-only" | "non-equipment-only" | "all",
            }))
          }
          onReset={() => setFiltersHolder((prev) => ({ ...prev, materialType: "all" }))}
        />
        <SelectInput
          label="CAMPO P/ PERÍODO"
          value={filtersHolder.period.field}
          options={[
            {
              id: 1,
              label: "DATA DE INSERÇÃO",
              value: "dataInsercao",
            },
          ]}
          selectedItemLabel="NÃO DEFINIDO"
          handleChange={(value) =>
            setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, field: value } }))
          }
          onReset={() =>
            setFiltersHolder((prev) => ({ ...prev, period: { ...prev.period, field: null } }))
          }
        />
        <DateTimeInput
          label="DEPOIS DE"
          value={formatDateTimeForInput(filtersHolder.period.after)}
          handleChange={(value) =>
            setFiltersHolder((prev) => ({
              ...prev,
              period: {
                ...prev.period,
                after: formatDateInputChange(value, "string", false) as string,
              },
            }))
          }
        />
        <DateTimeInput
          label="DEPOIS DE"
          value={formatDateTimeForInput(filtersHolder.period.before)}
          handleChange={(value) =>
            setFiltersHolder((prev) => ({
              ...prev,
              period: {
                ...prev.period,
                before: formatDateInputChange(value, "string", false) as string,
              },
            }))
          }
        />
      </div>
      <div className="flex w-full flex-wrap items-center gap-2">
        <div className="w-fit">
          <CheckboxInput
            labelFalse="SOMENTE MATERIAIS ABAIXO DO MÍNIMO"
            labelTrue="SOMENTE MATERIAIS ABAIXO DO MÍNIMO"
            checked={filtersHolder.belowMinimum}
            handleChange={(v) => setFiltersHolder((prev) => ({ ...prev, belowMinimum: v }))}
          />
        </div>
        <div className="w-fit">
          <CheckboxInput
            labelFalse="SOMENTE MATERIAIS ACIMA DO MÁXIMO"
            labelTrue="SOMENTE MATERIAIS ACIMA DO MÁXIMO"
            checked={filtersHolder.aboveMaximum}
            handleChange={(v) => setFiltersHolder((prev) => ({ ...prev, aboveMaximum: v }))}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-end">
        <Button
          onClick={() => {
            updateFilters({ ...filtersHolder, page: 1 });
            closeMenu();
          }}
        >
          FILTRAR
        </Button>
      </div>
    </motion.div>
  );
}
