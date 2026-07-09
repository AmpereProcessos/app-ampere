import { Input } from "@/components/ui/input";
import ErrorComponent from "@/components/utils/ErrorComponent";
import GeneralPaginationComponent from "@/components/utils/Pagination";
import ResponsiveDialogDrawerViewOnly from "@/components/utils/ResponsiveDialogDrawerViewOnly";
import type {
  TGetClientsSearchInput,
  TGetClientsSearchOutput,
} from "@/pages/api/crm/clients/search";
import { formatLocation } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useClientsSearch } from "@/utils/methods/query/crm/clients";
import { MapPin, Phone } from "lucide-react";
import { FaLink } from "react-icons/fa";

type ClientsVinculationMenuProps = {
  initialFilters?: Partial<TGetClientsSearchInput>;
  handleSelect: (client: TGetClientsSearchOutput["data"]["clients"][number]) => void;
  closeModal: () => void;
};
function ClientsVinculationMenu({
  initialFilters,
  handleSelect,
  closeModal,
}: ClientsVinculationMenuProps) {
  const {
    data: clientsResult,
    isLoading,
    isError,
    isSuccess,
    error,
    filters,
    updateFilters,
  } = useClientsSearch({ initialFilters });

  const clients = clientsResult?.clients || [];
  const clientsMatched = clientsResult?.clientsMatched || 0;
  const clientsShowing = clients.length || 0;
  const totalPages = clientsResult?.totalPages || 0;
  return (
    <ResponsiveDialogDrawerViewOnly
      menuTitle="VINCULAÇÃO DE CLIENTES"
      menuDescription="Pesquise aqui para vincular um cliente."
      menuCancelButtonText="Cancelar"
      stateIsLoading={false}
      closeMenu={closeModal}
    >
      <Input
        value={filters.search || ""}
        placeholder="Pesquisa aqui pelo nome ou identificador do cliente..."
        onChange={(e) => updateFilters({ search: e.target.value })}
        className="w-full"
      />
      {isLoading ? <h1>Buscando clientes...</h1> : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? (
        <>
          <GeneralPaginationComponent
            activePage={filters.page}
            totalPages={totalPages}
            selectPage={(page) => updateFilters({ page })}
            queryLoading={isLoading}
            itemsMatchedText={`Foram encontrados ${clientsMatched} clientes.`}
            itemsShowingText={`Mostrando ${clientsShowing} clientes.`}
          />
          {clients.length > 0 ? (
            clients.map((client) => (
              <ClientCard
                key={client._id}
                client={client}
                handleSelect={() => handleSelect(client)}
              />
            ))
          ) : (
            <h1 className="text-foreground w-full text-center text-sm font-medium tracking-tight">
              Nenhum cliente encontrado.
            </h1>
          )}
        </>
      ) : null}
    </ResponsiveDialogDrawerViewOnly>
  );
}

export default ClientsVinculationMenu;

type ClientCardProps = {
  client: TGetClientsSearchOutput["data"]["clients"][number];
  handleSelect: () => void;
};
function ClientCard({ client, handleSelect }: ClientCardProps) {
  return (
    <div className="border-primary bg-background flex w-full flex-col gap-1 rounded border p-2 shadow-xs dark:bg-[#121212]">
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm leading-none font-bold tracking-tight">{client.nome}</p>
        </div>
        <button
          type="button"
          onClick={() => handleSelect()}
          className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white duration-300 ease-in-out hover:bg-blue-700"
        >
          <FaLink />
          <h1>VINCULAR</h1>
        </button>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex grow flex-wrap items-center justify-center gap-2 lg:justify-start">
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4 min-w-4 min-h-4" />
            <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
              {client.telefonePrimario}
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 min-w-4 min-h-4" />
            <h1 className="text-foreground py-0.5 text-center text-[0.6rem] font-medium italic">
              {formatLocation({
                location: {
                  uf: client.uf || "",
                  cidade: client.cidade || "",
                  cep: client.cep || "",
                  bairro: client.bairro,
                  endereco: client.endereco,
                  numeroOuIdentificador: client.numeroOuIdentificador?.toString() || "",
                  complemento: null,
                  latitude: null,
                  longitude: null,
                },
                includeCity: true,
                includeUf: true,
              })}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
