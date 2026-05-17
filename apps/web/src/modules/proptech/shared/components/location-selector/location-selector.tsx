import { useEffect, useMemo, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { GetCity, GetCountries, GetState } from "react-country-state-city";
import { detectBrowserLocation } from "../../services/location.service";
import type { BrowserLocationAddress } from "../../services/location.service";
import type { LocationSelectorProps, LocationValue } from "./location-selector.types";
import "./location-selector.css";

type CountryOption = Awaited<ReturnType<typeof GetCountries>>[number];
type StateOption = Awaited<ReturnType<typeof GetState>>[number];
type CityOption = Awaited<ReturnType<typeof GetCity>>[number];

const DEFAULT_COUNTRY_CODE = "BO";

function normalizeName(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(department|departamento|provincia|province|region|de|del)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getCountryCode(country: CountryOption) {
  return country.iso2;
}

function getStateCode(state: StateOption) {
  return state.state_code || String(state.id);
}

function findCountry(countries: CountryOption[], location: BrowserLocationAddress) {
  if (location.countryCode) {
    const byCode = countries.find((country) => getCountryCode(country) === location.countryCode);
    if (byCode) return byCode;
  }

  const countryName = normalizeName(location.countryName);
  return countries.find((country) => normalizeName(country.name) === countryName);
}

function findState(states: StateOption[], stateName?: string) {
  const normalized = normalizeName(stateName);
  if (!normalized) return undefined;

  return states.find((state) => {
    const candidate = normalizeName(state.name);
    return candidate === normalized || candidate.includes(normalized) || normalized.includes(candidate);
  });
}

function findCity(cities: CityOption[], cityName?: string) {
  const normalized = normalizeName(cityName);
  if (!normalized) return undefined;

  return cities.find((city) => {
    const candidate = normalizeName(city.name);
    return candidate === normalized || candidate.includes(normalized) || normalized.includes(candidate);
  });
}

function countryToLocation(country?: CountryOption): LocationValue {
  return {
    countryCode: country ? getCountryCode(country) : undefined,
    countryName: country?.name,
  };
}

export function LocationSelector({
  autoDetect = false,
  className = "",
  defaultCountryCode = DEFAULT_COUNTRY_CODE,
  label = "Ubicacion",
  value,
  onChange,
}: LocationSelectorProps) {
  const hasAutoDetected = useRef(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"info" | "error">("info");

  const orderedCountries = useMemo(() => {
    return [...countries].sort((a, b) => {
      if (defaultCountryCode && getCountryCode(a) === defaultCountryCode) return -1;
      if (defaultCountryCode && getCountryCode(b) === defaultCountryCode) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [countries, defaultCountryCode]);

  const selectedCountry = useMemo(() => {
    const code = value.countryCode ?? defaultCountryCode ?? "";
    return countries.find((country) => getCountryCode(country) === code);
  }, [countries, defaultCountryCode, value.countryCode]);

  const selectedState = useMemo(() => {
    return states.find((state) => getStateCode(state) === value.stateCode);
  }, [states, value.stateCode]);

  const applyLocation = (next: LocationValue) => {
    onChange(next);
  };

  const loadStates = async (country: CountryOption) => {
    const nextStates = await GetState(country.id);
    setStates(nextStates);
    return nextStates;
  };

  const loadCities = async (country: CountryOption, state: StateOption) => {
    const nextCities = await GetCity(country.id, state.id);
    setCities(nextCities);
    return nextCities;
  };

  const handleCountryChange = async (countryCode: string) => {
    const country = countries.find((item) => getCountryCode(item) === countryCode);
    setCities([]);
    setStates([]);
    applyLocation(countryToLocation(country));
    setStatus("");

    if (country) {
      await loadStates(country);
    }
  };

  const handleStateChange = async (stateCode: string) => {
    const state = states.find((item) => getStateCode(item) === stateCode);
    setCities([]);
    applyLocation({
      ...value,
      stateCode: state ? getStateCode(state) : undefined,
      stateName: state?.name,
      cityName: "",
      latitude: state?.latitude ? Number(state.latitude) : value.latitude,
      longitude: state?.longitude ? Number(state.longitude) : value.longitude,
    });
    setStatus("");

    if (selectedCountry && state) {
      await loadCities(selectedCountry, state);
    }
  };

  const handleCityChange = (cityName: string) => {
    const city = cities.find((item) => item.name === cityName);
    applyLocation({
      ...value,
      cityName,
      latitude: city?.latitude ? Number(city.latitude) : value.latitude,
      longitude: city?.longitude ? Number(city.longitude) : value.longitude,
    });
    setStatus("");
  };

  const handleDetect = async () => {
    setDetecting(true);
    setStatusType("info");
    setStatus("Detectando ubicacion...");

    try {
      const detected = await detectBrowserLocation();
      const country = findCountry(countries, detected)
        ?? countries.find((item) => defaultCountryCode && getCountryCode(item) === defaultCountryCode);
      const countryStates = country ? await loadStates(country) : [];
      const state = findState(countryStates, detected.stateName);
      const stateCities = country && state ? await loadCities(country, state) : [];
      const city = findCity(stateCities, detected.cityName);

      applyLocation({
        countryCode: country ? getCountryCode(country) : detected.countryCode,
        countryName: country?.name ?? detected.countryName,
        stateCode: state ? getStateCode(state) : undefined,
        stateName: state?.name ?? detected.stateName,
        cityName: city?.name ?? detected.cityName ?? "",
        latitude: detected.latitude,
        longitude: detected.longitude,
      });

      setStatusType("info");
      setStatus("Ubicacion detectada desde el navegador.");
    } catch {
      const fallbackCountry = countries.find((item) => defaultCountryCode && getCountryCode(item) === defaultCountryCode);
      applyLocation({
        ...countryToLocation(fallbackCountry),
        stateCode: value.stateCode,
        stateName: value.stateName,
        cityName: value.cityName,
      });
      setStatusType("error");
      setStatus("No se pudo detectar automaticamente. Puedes seleccionar la ubicacion manualmente.");
    } finally {
      setDetecting(false);
    }
  };

  useEffect(() => {
    let alive = true;

    const loadCountries = async () => {
      setLoadingData(true);
      try {
        const nextCountries = await GetCountries();
        if (!alive) return;
        setCountries(nextCountries);
      } finally {
        if (alive) setLoadingData(false);
      }
    };

    void loadCountries();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    let alive = true;
    void GetState(selectedCountry.id).then((nextStates) => {
      if (alive) setStates(nextStates);
    });

    return () => {
      alive = false;
    };
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCities([]);
      return;
    }

    let alive = true;
    void GetCity(selectedCountry.id, selectedState.id).then((nextCities) => {
      if (alive) setCities(nextCities);
    });

    return () => {
      alive = false;
    };
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    if (value.countryCode || countries.length === 0 || !defaultCountryCode) return;
    const fallbackCountry = countries.find((country) => getCountryCode(country) === defaultCountryCode);
    onChange(countryToLocation(fallbackCountry));
  }, [countries, defaultCountryCode, onChange, value.countryCode]);

  useEffect(() => {
    if (!autoDetect || hasAutoDetected.current || countries.length === 0) return;
    hasAutoDetected.current = true;
    void handleDetect();
  }, [autoDetect, countries]);

  return (
    <div className={`location-selector ${className}`}>
      <div className="location-selector__head">
        <div className="location-selector__label">
          <span>{label}</span>
          <small>Pais, departamento/provincia y ciudad con autollenado opcional.</small>
        </div>
        <button
          type="button"
          className="location-selector__detect"
          onClick={() => void handleDetect()}
          disabled={detecting || loadingData || countries.length === 0}
        >
          {detecting ? "Detectando..." : "Usar mi ubicacion"}
        </button>
      </div>

      <div className="location-selector__grid">
        <label className="location-selector__field">
          <span>Pais</span>
          <div className="location-selector__select-wrap">
            {selectedCountry && (
              <ReactCountryFlag
                countryCode={getCountryCode(selectedCountry)}
                className="location-selector__flag"
                aria-label={selectedCountry.name}
              />
            )}
            <select
              className="location-selector__select location-selector__select--country"
              value={selectedCountry ? getCountryCode(selectedCountry) : ""}
              onChange={(event) => void handleCountryChange(event.target.value)}
              disabled={loadingData}
            >
              <option value="">Selecciona</option>
              {orderedCountries.map((country) => (
                <option key={getCountryCode(country)} value={getCountryCode(country)}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="location-selector__field">
          <span>Departamento / provincia</span>
          <select
            className="location-selector__select"
            value={value.stateCode ?? ""}
            onChange={(event) => void handleStateChange(event.target.value)}
            disabled={!selectedCountry || states.length === 0}
          >
            <option value="">Selecciona</option>
            {states.map((state) => (
              <option key={getStateCode(state)} value={getStateCode(state)}>
                {state.name}
              </option>
            ))}
          </select>
        </label>

        <label className="location-selector__field">
          <span>Ciudad / municipio</span>
          <select
            className="location-selector__select"
            value={value.cityName ?? ""}
            onChange={(event) => handleCityChange(event.target.value)}
            disabled={!selectedState || cities.length === 0}
          >
            <option value="">Selecciona</option>
            {value.cityName && !cities.some((city) => city.name === value.cityName) && (
              <option value={value.cityName}>{value.cityName}</option>
            )}
            {cities.map((city) => (
              <option key={`${city.id}-${city.name}`} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {status && (
        <div className={`location-selector__status${statusType === "error" ? " location-selector__status--error" : ""}`}>
          {status}
        </div>
      )}
    </div>
  );
}
