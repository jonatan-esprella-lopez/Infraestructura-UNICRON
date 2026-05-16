import { useEffect, useMemo, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { City, Country, State, type ICity, type ICountry, type IState } from "country-state-city";
import { detectBrowserLocation } from "../../services/location.service";
import type { BrowserLocationAddress } from "../../services/location.service";
import type { LocationSelectorProps, LocationValue } from "./location-selector.types";
import "./location-selector.css";

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

function findCountry(countries: ICountry[], location: BrowserLocationAddress) {
  if (location.countryCode) {
    const byCode = countries.find((country) => country.isoCode === location.countryCode);
    if (byCode) return byCode;
  }

  const countryName = normalizeName(location.countryName);
  return countries.find((country) => normalizeName(country.name) === countryName);
}

function findState(states: IState[], stateName?: string) {
  const normalized = normalizeName(stateName);
  if (!normalized) return undefined;

  return states.find((state) => {
    const candidate = normalizeName(state.name);
    return candidate === normalized || candidate.includes(normalized) || normalized.includes(candidate);
  });
}

function findCity(cities: ICity[], cityName?: string) {
  const normalized = normalizeName(cityName);
  if (!normalized) return undefined;

  return cities.find((city) => {
    const candidate = normalizeName(city.name);
    return candidate === normalized || candidate.includes(normalized) || normalized.includes(candidate);
  });
}

function countryToLocation(country?: ICountry): LocationValue {
  return {
    countryCode: country?.isoCode,
    countryName: country?.name,
  };
}

export function LocationSelector({
  autoDetect = false,
  className = "",
  label = "Ubicacion",
  value,
  onChange,
}: LocationSelectorProps) {
  const hasAutoDetected = useRef(false);
  const [detecting, setDetecting] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"info" | "error">("info");

  const countries = useMemo(() => {
    const all = Country.getAllCountries();
    return [...all].sort((a, b) => {
      if (a.isoCode === DEFAULT_COUNTRY_CODE) return -1;
      if (b.isoCode === DEFAULT_COUNTRY_CODE) return 1;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const selectedCountry = useMemo(() => {
    return Country.getCountryByCode(value.countryCode ?? DEFAULT_COUNTRY_CODE);
  }, [value.countryCode]);

  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode);
  }, [selectedCountry]);

  const selectedState = useMemo(() => {
    if (!selectedCountry || !value.stateCode) return undefined;
    return State.getStateByCodeAndCountry(value.stateCode, selectedCountry.isoCode);
  }, [selectedCountry, value.stateCode]);

  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
  }, [selectedCountry, selectedState]);

  const applyLocation = (next: LocationValue) => {
    onChange(next);
  };

  const handleCountryChange = (countryCode: string) => {
    const country = Country.getCountryByCode(countryCode);
    applyLocation(countryToLocation(country));
    setStatus("");
  };

  const handleStateChange = (stateCode: string) => {
    const state = states.find((item) => item.isoCode === stateCode);
    applyLocation({
      ...value,
      stateCode: state?.isoCode,
      stateName: state?.name,
      cityName: "",
      latitude: state?.latitude ? Number(state.latitude) : value.latitude,
      longitude: state?.longitude ? Number(state.longitude) : value.longitude,
    });
    setStatus("");
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
      const country = findCountry(countries, detected) ?? Country.getCountryByCode(DEFAULT_COUNTRY_CODE);
      const countryStates = country ? State.getStatesOfCountry(country.isoCode) : [];
      const state = findState(countryStates, detected.stateName);
      const stateCities = country && state ? City.getCitiesOfState(country.isoCode, state.isoCode) : [];
      const city = findCity(stateCities, detected.cityName);

      applyLocation({
        countryCode: country?.isoCode,
        countryName: country?.name ?? detected.countryName,
        stateCode: state?.isoCode,
        stateName: state?.name ?? detected.stateName,
        cityName: city?.name ?? detected.cityName ?? "",
        latitude: detected.latitude,
        longitude: detected.longitude,
      });

      setStatusType("info");
      setStatus("Ubicacion detectada desde el navegador.");
    } catch {
      const fallbackCountry = Country.getCountryByCode(DEFAULT_COUNTRY_CODE);
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
    if (!value.countryCode) {
      const fallbackCountry = Country.getCountryByCode(DEFAULT_COUNTRY_CODE);
      onChange(countryToLocation(fallbackCountry));
    }
  }, [onChange, value.countryCode]);

  useEffect(() => {
    if (!autoDetect || hasAutoDetected.current) return;
    hasAutoDetected.current = true;
    void handleDetect();
  }, [autoDetect]);

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
          disabled={detecting}
        >
          {detecting ? "Detectando..." : "Usar mi ubicacion"}
        </button>
      </div>

      <div className="location-selector__grid">
        <label className="location-selector__field">
          <span>Pais</span>
          <div className="location-selector__select-wrap">
            {selectedCountry?.isoCode && (
              <ReactCountryFlag
                countryCode={selectedCountry.isoCode}
                className="location-selector__flag"
                aria-label={selectedCountry.name}
              />
            )}
            <select
              className="location-selector__select location-selector__select--country"
              value={selectedCountry?.isoCode ?? ""}
              onChange={(event) => handleCountryChange(event.target.value)}
            >
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
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
            onChange={(event) => handleStateChange(event.target.value)}
            disabled={!selectedCountry}
          >
            <option value="">Selecciona</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
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
            disabled={!selectedState}
          >
            <option value="">Selecciona</option>
            {value.cityName && !cities.some((city) => city.name === value.cityName) && (
              <option value={value.cityName}>{value.cityName}</option>
            )}
            {cities.map((city) => (
              <option key={`${city.stateCode}-${city.name}`} value={city.name}>
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
