import cities from "@/utils/jsons/brazillian-cities.json";
import states from "@/utils/jsons/brazillian-states.json";

type BrazilianCity = {
  codigo_uf: number;
  latitude: number;
  longitude: number;
  nome: string;
};

type BrazilianState = {
  codigo_uf: number;
  uf: string;
};

export type TMunicipalityCoordinates = {
  latitude: number;
  longitude: number;
};

function normalizeLocationName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

const statesByUf = new Map(
  (states as BrazilianState[]).map((state) => [normalizeLocationName(state.uf), state.codigo_uf]),
);

const municipalitiesByCityAndState = new Map(
  (cities as BrazilianCity[]).map((city) => [
    `${normalizeLocationName(city.nome)}:${city.codigo_uf}`,
    { latitude: city.latitude, longitude: city.longitude },
  ]),
);

/** Resolves the approximate IBGE municipality centroid for a city/UF pair. */
export function resolveMunicipalityCoordinates(
  city: string,
  state: string,
): TMunicipalityCoordinates | null {
  const stateCode = statesByUf.get(normalizeLocationName(state));
  if (!stateCode) return null;

  return municipalitiesByCityAndState.get(`${normalizeLocationName(city)}:${stateCode}`) ?? null;
}
