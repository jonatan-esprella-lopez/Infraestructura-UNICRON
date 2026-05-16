export interface LocationValue {
  countryCode?: string;
  countryName?: string;
  stateCode?: string;
  stateName?: string;
  cityName?: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationSelectorProps {
  autoDetect?: boolean;
  className?: string;
  label?: string;
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}
