export interface BrowserLocationAddress {
  countryCode?: string;
  countryName?: string;
  stateName?: string;
  cityName?: string;
  latitude: number;
  longitude: number;
}

interface NominatimReverseResponse {
  lat?: string;
  lon?: string;
  address?: {
    country?: string;
    country_code?: string;
    state?: string;
    region?: string;
    province?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
  };
}

function getBrowserPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalizacion no disponible"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 5 * 60 * 1000,
      timeout: 9000,
    });
  });
}

export async function detectBrowserLocation(): Promise<BrowserLocationAddress> {
  const position = await getBrowserPosition();
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: "1",
    "accept-language": "es",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("No se pudo resolver la ubicacion");
  }

  const data = (await response.json()) as NominatimReverseResponse;
  const address = data.address ?? {};

  return {
    countryCode: address.country_code?.toUpperCase(),
    countryName: address.country,
    stateName: address.state ?? address.region ?? address.province,
    cityName: address.city ?? address.town ?? address.village ?? address.municipality ?? address.county,
    latitude,
    longitude,
  };
}
