import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Bath,
  Bed,
  Car,
  ChevronLeft,
  ChevronRight,
  Home,
  ListFilter,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  Ruler,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import L from 'leaflet';
import { propertyService } from '@modules/proptech/services/property.service';
import type { OperationType, Property, PropertyFilters, PropertyType } from '@modules/proptech/types/property.types';
import { OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@modules/proptech/constants/property-types.constant';
import 'leaflet/dist/leaflet.css';
import './properties-map-page.css';

const PAGE_SIZE = 8;
const MAP_MARKER_LIMIT = 200;

const BOLIVIAN_CITIES = ['La Paz', 'Santa Cruz', 'Cochabamba', 'El Alto', 'Sucre', 'Tarija', 'Oruro', 'Potosi', 'Trinidad', 'Cobija'];

const HOUSE_MARKER_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.28"/>
  </filter>
  <path d="M26 4 8 18v15c0 9.4 7.6 15 18 15s18-5.6 18-15V18L26 4Z" fill="#2563eb" filter="url(#shadow)"/>
  <path d="M15 24.5 26 15l11 9.5V39a2 2 0 0 1-2 2h-6v-9h-6v9h-6a2 2 0 0 1-2-2V24.5Z" fill="#fff"/>
  <path d="M12 25.5 26 13l14 12.5" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`)}`;

const HOUSE_MARKER_SELECTED_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">
  <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
    <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#111827" flood-opacity="0.32"/>
  </filter>
  <path d="M28 4 8.5 19.3V36c0 9.9 8.2 16 19.5 16S47.5 45.9 47.5 36V19.3L28 4Z" fill="#f59e0b" filter="url(#shadow)"/>
  <path d="M16.2 26.2 28 16.1l11.8 10.1V42a2.2 2.2 0 0 1-2.2 2.2h-6.4v-9.8h-6.4v9.8h-6.4A2.2 2.2 0 0 1 16.2 42V26.2Z" fill="#111827"/>
  <path d="M13.2 27.2 28 14l14.8 13.2" fill="none" stroke="#111827" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`)}`;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
const DEFAULT_MAP_CENTER = { lat: -16.2902, lng: -63.5887 };

declare global {
  interface Window {
    google?: any;
    __propertyGoogleMapsPromise?: Promise<void>;
  }
}

interface LocatedProperty {
  property: Property;
  lat: number;
  lng: number;
}

function loadGoogleMapsScript() {
  if (!GOOGLE_MAPS_API_KEY) return Promise.reject(new Error('Google Maps key is not configured.'));
  if (window.google?.maps) return Promise.resolve();
  if (window.__propertyGoogleMapsPromise) return window.__propertyGoogleMapsPromise;

  window.__propertyGoogleMapsPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('google-maps-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Google Maps could not be loaded.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-js';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps could not be loaded.'));
    document.head.appendChild(script);
  });

  return window.__propertyGoogleMapsPromise;
}

function formatPrice(price: number | undefined, currency: string | undefined, operation: OperationType | undefined) {
  const amount = Number(price);
  if (!Number.isFinite(amount) || amount <= 0) return 'Consultar precio';

  const safeCurrency = currency || 'USD';
  const formatter = new Intl.NumberFormat(safeCurrency === 'BOB' ? 'es-BO' : 'en-US', {
    style: 'currency',
    currency: safeCurrency,
    maximumFractionDigits: 0,
  });

  return operation === 'rent' ? `${formatter.format(amount)}/mes` : formatter.format(amount);
}

function getPropertyImage(property: Property) {
  return property.imageUrls?.[0] || '/properties_hero.png';
}

function getLocationLabel(property: Property) {
  const parts = [property.zone, property.city].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');
  return property.address || 'Ubicacion por confirmar';
}

function getFullAddress(property: Property) {
  return [property.address, property.zone, property.city].filter(Boolean).join(', ');
}

function toLocatedProperty(property: Property): LocatedProperty | null {
  const lat = Number(property.latitude);
  const lng = Number(property.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { property, lat, lng };
}

function getWhatsAppUrl(phone: string, title: string) {
  const clean = phone.replace(/\D/g, '');
  const intl = clean.startsWith('591') ? clean : `591${clean}`;
  const msg = encodeURIComponent(`Hola! Vi la propiedad "${title}" en Wasi y me gustaría recibir más información.`);
  return `https://wa.me/${intl}?text=${msg}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i += 1) pages.push(i);
  return pages;
}

function createGoogleMarkerIcon(selected: boolean) {
  const googleMaps = window.google.maps;
  return {
    url: selected ? HOUSE_MARKER_SELECTED_URL : HOUSE_MARKER_URL,
    scaledSize: new googleMaps.Size(selected ? 52 : 46, selected ? 52 : 46),
    anchor: new googleMaps.Point(selected ? 26 : 23, selected ? 52 : 46),
  };
}

function createLeafletMarkerIcon(selected: boolean) {
  const size: [number, number] = selected ? [54, 54] : [46, 46];
  return L.icon({
    iconUrl: selected ? HOUSE_MARKER_SELECTED_URL : HOUSE_MARKER_URL,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [0, -size[1] + 8],
    className: 'prop-map-leaflet-marker',
  });
}

interface MapCanvasProps {
  properties: Property[];
  selectedId: string | null;
  focusKey: number;
  onSelect: (propertyId: string) => void;
  onClose: () => void;
}

function PropertiesMapCanvas({ properties, selectedId, focusKey, onSelect, onClose }: MapCanvasProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRefs = useRef<Record<string, any>>({});
  const leafletNodeRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletMarkerRefs = useRef<Record<string, L.Marker>>({});
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const markers = useMemo(() => properties.map(toLocatedProperty).filter((item): item is LocatedProperty => Boolean(item)), [properties]);
  const selectedMarker = markers.find((marker) => marker.property.id === selectedId) ?? markers[0] ?? null;
  const showGoogleMap = Boolean(GOOGLE_MAPS_API_KEY) && !mapError;

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !mapNodeRef.current) return;

    let alive = true;
    void loadGoogleMapsScript()
      .then(() => {
        if (!alive || !mapNodeRef.current) return;
        mapRef.current = new window.google.maps.Map(mapNodeRef.current, {
          center: DEFAULT_MAP_CENTER,
          zoom: 6,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: false,
        });
        setMapReady(true);
      })
      .catch(() => setMapError(true));

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google?.maps) return;

    window.google.maps.event.trigger(mapRef.current, 'resize');
    Object.values(markerRefs.current).forEach((marker) => marker.setMap(null));
    markerRefs.current = {};

    if (markers.length === 0) {
      mapRef.current.setCenter(DEFAULT_MAP_CENTER);
      mapRef.current.setZoom(6);
      return;
    }

    const googleBounds = new window.google.maps.LatLngBounds();
    markers.forEach((markerItem) => {
      const position = { lat: markerItem.lat, lng: markerItem.lng };
      const marker = new window.google.maps.Marker({
        map: mapRef.current,
        position,
        title: markerItem.property.title,
        icon: createGoogleMarkerIcon(false),
      });
      marker.addListener('click', () => onSelect(markerItem.property.id));
      markerRefs.current[markerItem.property.id] = marker;
      googleBounds.extend(position);
    });

    if (markers.length === 1) {
      mapRef.current.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
      mapRef.current.setZoom(15);
    } else {
      mapRef.current.fitBounds(googleBounds, 72);
    }

    return () => {
      Object.values(markerRefs.current).forEach((marker) => marker.setMap(null));
      markerRefs.current = {};
    };
  }, [mapReady, markers, onSelect]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google?.maps) return;

    Object.entries(markerRefs.current).forEach(([propertyId, marker]) => {
      marker.setIcon(createGoogleMarkerIcon(propertyId === selectedId));
    });

    const selected = markers.find((marker) => marker.property.id === selectedId);
    if (selected) {
      mapRef.current.setZoom(16);
      mapRef.current.panTo({ lat: selected.lat, lng: selected.lng });
    }
  }, [focusKey, mapReady, markers, selectedId]);

  useEffect(() => {
    if (showGoogleMap || !leafletNodeRef.current) return;

    const map = L.map(leafletNodeRef.current, {
      center: [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng],
      zoom: 6,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    leafletMapRef.current = map;
    const resizeTimers = [0, 120, 320].map((delay) => (
      window.setTimeout(() => map.invalidateSize({ pan: false }), delay)
    ));

    return () => {
      resizeTimers.forEach((timer) => window.clearTimeout(timer));
      Object.values(leafletMarkerRefs.current).forEach((marker) => marker.remove());
      leafletMarkerRefs.current = {};
      map.remove();
      leafletMapRef.current = null;
    };
  }, [showGoogleMap]);

  useEffect(() => {
    if (showGoogleMap || !leafletMapRef.current) return;

    const map = leafletMapRef.current;
    map.invalidateSize({ pan: false });
    Object.values(leafletMarkerRefs.current).forEach((marker) => marker.remove());
    leafletMarkerRefs.current = {};

    if (markers.length === 0) {
      map.setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng], 6);
      return;
    }

    const leafletBounds = L.latLngBounds([]);
    markers.forEach((markerItem) => {
      const marker = L.marker([markerItem.lat, markerItem.lng], {
        icon: createLeafletMarkerIcon(false),
        title: markerItem.property.title,
      }).addTo(map);

      marker.on('click', () => onSelect(markerItem.property.id));
      leafletMarkerRefs.current[markerItem.property.id] = marker;
      leafletBounds.extend([markerItem.lat, markerItem.lng]);
    });

    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 15);
    } else {
      map.fitBounds(leafletBounds, { padding: [72, 72], maxZoom: 15 });
    }
  }, [markers, onSelect, showGoogleMap]);

  useEffect(() => {
    if (showGoogleMap || !leafletMapRef.current) return;

    Object.entries(leafletMarkerRefs.current).forEach(([propertyId, marker]) => {
      marker.setIcon(createLeafletMarkerIcon(propertyId === selectedId));
    });

    const selected = markers.find((marker) => marker.property.id === selectedId);
    if (selected) {
      leafletMapRef.current.setView([selected.lat, selected.lng], 16, { animate: true });
    }
  }, [focusKey, markers, selectedId, showGoogleMap]);

  useEffect(() => {
    const node = showGoogleMap ? mapNodeRef.current : leafletNodeRef.current;
    if (!node) return;

    const refreshMapSize = () => {
      if (showGoogleMap && mapReady && mapRef.current && window.google?.maps) {
        const center = mapRef.current.getCenter?.();
        window.google.maps.event.trigger(mapRef.current, 'resize');
        if (center) mapRef.current.setCenter(center);
      }

      if (!showGoogleMap && leafletMapRef.current) {
        leafletMapRef.current.invalidateSize({ pan: false });
      }
    };

    const resizeTimers = [0, 160, 420].map((delay) => window.setTimeout(refreshMapSize, delay));
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(refreshMapSize) : null;
    resizeObserver?.observe(node);
    window.addEventListener('resize', refreshMapSize);
    window.addEventListener('orientationchange', refreshMapSize);

    return () => {
      resizeTimers.forEach((timer) => window.clearTimeout(timer));
      resizeObserver?.disconnect();
      window.removeEventListener('resize', refreshMapSize);
      window.removeEventListener('orientationchange', refreshMapSize);
    };
  }, [mapReady, showGoogleMap]);

  return (
    <section className="prop-map-main" aria-label="Mapa de propiedades">
      <div className="prop-map-canvas">
        {showGoogleMap ? (
          <div ref={mapNodeRef} className="prop-map-google" />
        ) : (
          <div className="prop-map-fallback">
            <div ref={leafletNodeRef} className="prop-map-leaflet" aria-label="Mapa de propiedades con ubicaciones ancladas" />
          </div>
        )}

        {markers.length === 0 && (
          <div className="prop-map-empty-overlay">
            <MapPin size={22} />
            <strong>No hay puntos en el mapa</strong>
            <span>Las propiedades de estos resultados todavia no tienen coordenadas registradas.</span>
          </div>
        )}

        {selectedMarker && (
          <div className="prop-map-popup">
            <button className="prop-map-popup__close" onClick={onClose} aria-label="Cerrar">
              <X size={15} />
            </button>

            <div className="prop-map-popup__img">
              <img
                src={getPropertyImage(selectedMarker.property)}
                alt={selectedMarker.property.title}
                onError={(e) => { (e.target as HTMLImageElement).src = '/properties_hero.png'; }}
              />
              <span className="prop-map-popup__op-tag">
                {OPERATION_TYPE_LABELS[selectedMarker.property.operationType] ?? 'Inmueble'}
              </span>
            </div>

            <div className="prop-map-popup__body">
              <p className="prop-map-popup__type">
                {PROPERTY_TYPE_LABELS[selectedMarker.property.propertyType] ?? 'Propiedad'}
              </p>
              <h3 className="prop-map-popup__title">{selectedMarker.property.title}</h3>

              <div className="prop-map-popup__location">
                <MapPin size={13} />
                <span>{getLocationLabel(selectedMarker.property)}</span>
              </div>

              <div className="prop-map-popup__stats">
                {(selectedMarker.property.bedrooms ?? 0) > 0 && (
                  <span><Bed size={13} /> {selectedMarker.property.bedrooms} dorm.</span>
                )}
                {(selectedMarker.property.bathrooms ?? 0) > 0 && (
                  <span><Bath size={13} /> {selectedMarker.property.bathrooms} baños</span>
                )}
                {(selectedMarker.property.areaTotal ?? 0) > 0 && (
                  <span><Ruler size={13} /> {selectedMarker.property.areaTotal} m²</span>
                )}
              </div>

              <div className="prop-map-popup__footer">
                <strong className="prop-map-popup__price">
                  {formatPrice(selectedMarker.property.price, selectedMarker.property.currency, selectedMarker.property.operationType)}
                </strong>
                <div className="prop-map-popup__actions">
                  {selectedMarker.property.agentPhone && (
                    <a
                      href={getWhatsAppUrl(selectedMarker.property.agentPhone, selectedMarker.property.title)}
                      target="_blank"
                      rel="noreferrer"
                      className="prop-map-popup__wa"
                    >
                      <MessageCircle size={14} />
                      Contactar ahora
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedMarker.lat},${selectedMarker.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="prop-map-popup__route"
                  >
                    <Navigation size={13} />
                    Ruta
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface PropertyResultCardProps {
  property: Property;
  selected: boolean;
  onSelect: (propertyId: string) => void;
}

function PropertyResultCard({ property, selected, onSelect }: PropertyResultCardProps) {
  const hasCoordinates = Boolean(toLocatedProperty(property));

  return (
    <article
      className={`prop-map-card${selected ? ' is-selected' : ''}`}
      onClick={() => onSelect(property.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(property.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="prop-map-card__image">
        <img src={getPropertyImage(property)} alt={property.title} loading="lazy" />
        <span>{OPERATION_TYPE_LABELS[property.operationType] ?? 'Inmueble'}</span>
      </div>

      <div className="prop-map-card__body">
        <div className="prop-map-card__top">
          <div>
            <p>{PROPERTY_TYPE_LABELS[property.propertyType] ?? 'Propiedad'}</p>
            <h3>{property.title}</h3>
          </div>
          <strong>{formatPrice(property.price, property.currency, property.operationType)}</strong>
        </div>

        <div className="prop-map-card__location">
          <MapPin size={15} />
          <span>{getFullAddress(property) || 'Ubicacion por confirmar'}</span>
        </div>

        <div className="prop-map-card__features">
          <span><Ruler size={15} /> {property.areaTotal || 0} m2</span>
          {(property.bedrooms ?? 0) > 0 && <span><Bed size={15} /> {property.bedrooms} dorm.</span>}
          {(property.bathrooms ?? 0) > 0 && <span><Bath size={15} /> {property.bathrooms} banos</span>}
          {(property.parkingSpaces ?? 0) > 0 && <span><Car size={15} /> {property.parkingSpaces} gar.</span>}
        </div>

        <div className="prop-map-card__footer">
          <span className={hasCoordinates ? 'has-map-point' : 'no-map-point'}>
            <Navigation size={14} />
            {hasCoordinates ? 'Ubicacion marcada' : 'Sin punto de mapa'}
          </span>
          <Link to={`/propiedades/${property.id}`} onClick={(event) => event.stopPropagation()}>
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}

export function PropertiesMapPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [mapProperties, setMapProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState(0);

  const page = Math.max(1, Number(searchParams.get('page') || '1') || 1);
  const query = searchParams.get('query') || '';
  const operationType = searchParams.get('operation') || '';
  const propertyType = searchParams.get('type') || '';
  const city = searchParams.get('city') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minBedrooms = searchParams.get('minBedrooms') || '';
  const petsAllowed = searchParams.get('petsAllowed') === 'true';
  const [localQuery, setLocalQuery] = useState(query);

  const updateParam = useCallback((key: string, value: string | boolean | number | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === '' || value === false) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const clearFilters = () => {
    setLocalQuery('');
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (localQuery !== query) updateParam('query', localQuery);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [localQuery, query, updateParam]);

  const activeFilterCount = useMemo(() => (
    [operationType, propertyType, city, minPrice, maxPrice, minBedrooms, petsAllowed].filter(Boolean).length
  ), [operationType, propertyType, city, minPrice, maxPrice, minBedrooms, petsAllowed]);

  const baseFilters = useMemo<PropertyFilters>(() => ({
    publicationStatus: 'published',
    query: query || undefined,
    operationType: operationType ? (operationType as OperationType) : undefined,
    propertyType: propertyType ? (propertyType as PropertyType) : undefined,
    city: city || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minBedrooms: minBedrooms ? Number(minBedrooms) : undefined,
    petsAllowed: petsAllowed || undefined,
  }), [query, operationType, propertyType, city, minPrice, maxPrice, minBedrooms, petsAllowed]);

  useEffect(() => {
    let alive = true;

    async function fetchProperties() {
      setLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * PAGE_SIZE;
        const [listResult, markerResult] = await Promise.all([
          propertyService.findAllPublic({ ...baseFilters, limit: PAGE_SIZE, offset }),
          propertyService.findAllPublic({ ...baseFilters, limit: MAP_MARKER_LIMIT, offset: 0 }),
        ]);

        if (!alive) return;

        setProperties(listResult.items);
        setTotal(listResult.total);
        setMapProperties(markerResult.items);
        setSelectedId((current) => {
          const stillExists = [...listResult.items, ...markerResult.items].some((property) => property.id === current);
          if (current && stillExists) return current;
          return listResult.items[0]?.id ?? markerResult.items[0]?.id ?? null;
        });
      } catch (err) {
        if (!alive) return;
        console.error('Error fetching map properties:', err);
        setProperties([]);
        setMapProperties([]);
        setTotal(0);
        setSelectedId(null);
        setError('No se pudieron cargar las propiedades. Intenta nuevamente en unos segundos.');
      } finally {
        if (alive) setLoading(false);
      }
    }

    void fetchProperties();

    return () => {
      alive = false;
    };
  }, [baseFilters, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageNumbers = useMemo(() => getPageNumbers(page, totalPages), [page, totalPages]);
  const startResult = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endResult = Math.min(page * PAGE_SIZE, total);

  useEffect(() => {
    if (!loading && total > 0 && page > totalPages) {
      updateParam('page', totalPages);
    }
  }, [loading, page, total, totalPages, updateParam]);

  const goToPage = (nextPage: number) => {
    updateParam('page', clamp(nextPage, 1, totalPages));
  };

  const focusPropertyOnMap = useCallback((propertyId: string) => {
    setSelectedId(propertyId);
    setFocusKey((current) => current + 1);
  }, []);

  return (
    <div className="prop-map-layout">
      <aside className="prop-map-sidebar" aria-label="Listado de propiedades">
        <header className="prop-map-sidebar__header">
          <button className="prop-map-back-btn" onClick={() => navigate('/propiedades')}>
            <ArrowLeft size={18} />
            Volver al catalogo
          </button>

          <div className="prop-map-title">
            <span>Mapa de propiedades</span>
          </div>

          <div className="prop-map-controls">
            <div className="prop-map-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Buscar por ciudad, zona o direccion"
                value={localQuery}
                onChange={(event) => setLocalQuery(event.target.value)}
              />
              {localQuery && (
                <button type="button" onClick={() => setLocalQuery('')} aria-label="Limpiar busqueda">
                  <X size={16} />
                </button>
              )}
            </div>

            <details className="prop-map-filter-panel">
              <summary aria-label="Abrir filtros">
                <SlidersHorizontal size={18} />
                {activeFilterCount > 0 && <strong>{activeFilterCount}</strong>}
              </summary>

              <div className="prop-map-filter-grid">
              <label>
                <span>Operacion</span>
                <select value={operationType} onChange={(event) => updateParam('operation', event.target.value)}>
                  <option value="">Todas</option>
                  <option value="sale">Venta</option>
                  <option value="rent">Alquiler</option>
                  <option value="anticretico">Anticretico</option>
                </select>
              </label>

              <label>
                <span>Tipo</span>
                <select value={propertyType} onChange={(event) => updateParam('type', event.target.value)}>
                  <option value="">Todos</option>
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Ciudad</span>
                <select value={city} onChange={(event) => updateParam('city', event.target.value)}>
                  <option value="">Todas</option>
                  {BOLIVIAN_CITIES.map((cityName) => (
                    <option key={cityName} value={cityName}>{cityName}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Precio minimo</span>
                <select value={minPrice} onChange={(event) => updateParam('minPrice', event.target.value)}>
                  <option value="">Sin minimo</option>
                  <option value="30000">30.000 USD</option>
                  <option value="50000">50.000 USD</option>
                  <option value="100000">100.000 USD</option>
                  <option value="200000">200.000 USD</option>
                </select>
              </label>

              <label>
                <span>Precio maximo</span>
                <select value={maxPrice} onChange={(event) => updateParam('maxPrice', event.target.value)}>
                  <option value="">Sin maximo</option>
                  <option value="50000">50.000 USD</option>
                  <option value="100000">100.000 USD</option>
                  <option value="200000">200.000 USD</option>
                  <option value="500000">500.000 USD</option>
                </select>
              </label>

              <label>
                <span>Dormitorios</span>
                <select value={minBedrooms} onChange={(event) => updateParam('minBedrooms', event.target.value)}>
                  <option value="">Cualquiera</option>
                  <option value="1">1 o mas</option>
                  <option value="2">2 o mas</option>
                  <option value="3">3 o mas</option>
                  <option value="4">4 o mas</option>
                </select>
              </label>

              <label className="prop-map-checkbox">
                <input
                  type="checkbox"
                  checked={petsAllowed}
                  onChange={(event) => updateParam('petsAllowed', event.target.checked)}
                />
                <span>Acepta mascotas</span>
              </label>

              <button type="button" className="prop-map-clear-btn" onClick={clearFilters}>
                <X size={15} />
                Limpiar filtros
              </button>
              </div>
            </details>
          </div>

          <div className="prop-map-count">
            {loading ? (
              <span><Loader2 size={15} className="prop-map-spin" /> Buscando propiedades</span>
            ) : (
              <span>{startResult}-{endResult} de {total} propiedades</span>
            )}
          </div>
        </header>

        <div className="prop-map-list">
          {error && (
            <div className="prop-map-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="prop-map-loading">
              <Loader2 size={34} className="prop-map-spin" />
              <span>Cargando inmuebles...</span>
            </div>
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <PropertyResultCard
                key={property.id}
                property={property}
                selected={property.id === selectedId}
                onSelect={focusPropertyOnMap}
              />
            ))
          ) : !error ? (
            <div className="prop-map-empty-list">
              <Home size={28} />
              <strong>No hay propiedades con estos filtros</strong>
              <span>Prueba limpiando filtros o buscando otra ciudad.</span>
            </div>
          ) : null}
        </div>

        <footer className="prop-map-pagination" aria-label="Paginacion">
          <button type="button" onClick={() => goToPage(page - 1)} disabled={page <= 1 || loading}>
            <ChevronLeft size={17} />
          </button>

          <div className="prop-map-pages">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={pageNumber === page ? 'is-active' : ''}
                onClick={() => goToPage(pageNumber)}
                disabled={loading}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button type="button" onClick={() => goToPage(page + 1)} disabled={page >= totalPages || loading}>
            <ChevronRight size={17} />
          </button>
        </footer>
      </aside>

      <PropertiesMapCanvas
        properties={mapProperties}
        selectedId={selectedId}
        focusKey={focusKey}
        onSelect={focusPropertyOnMap}
        onClose={() => setSelectedId(null)}
      />

      <div className="prop-map-mobile-count">
        <ListFilter size={16} />
        {total} propiedades encontradas
      </div>
    </div>
  );
}
