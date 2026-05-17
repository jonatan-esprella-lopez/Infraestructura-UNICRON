import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BadgeCheck, Bath, BedDouble, Building2, Car, CheckCircle2,
  CircleDollarSign, Crosshair, ExternalLink, Eye, FileCheck2,
  Image as ImageIcon, Loader2, LocateFixed, MapPin, Minus,
  Plus, Ruler, Save, TrendingDown, TrendingUp, X,
} from 'lucide-react';
import { ROUTES } from '@core/constants/routes.constants';
import { Role } from '@core/enums/roles.enum';
import { useRootStore } from '@store/root-store';
import { LocationSelector } from '@modules/proptech/shared/components/location-selector';
import type { LocationValue } from '@modules/proptech/shared/components/location-selector';
import { propertyService } from '../../services/property.service';
import type { Currency, LegalStatus, OperationType, Property, PropertyType } from '../../types/property.types';
import {
  CURRENCY_LABELS, LEGAL_STATUS_LABELS, OPERATION_TYPE_LABELS, PROPERTY_TYPE_LABELS,
} from '../../constants/property-types.constant';
import './property-create-page.css';

/* ─── Types ─────────────────────────────────────────────── */

type DraftPropertyType = PropertyType | '';
type DraftOperationType = OperationType | '';
type DraftCurrency = Currency | '';
type DraftLegalStatus = LegalStatus | '';

interface PropertyDraft {
  ownerId: string;
  title: string;
  description: string;
  propertyType: DraftPropertyType;
  operationType: DraftOperationType;
  price: string;
  currency: DraftCurrency;
  areaTotal: string;
  areaBuilt: string;
  bedrooms: string;
  bathrooms: string;
  parkingSpaces: string;
  floorNumber: string;
  yearBuilt: string;
  address: string;
  zone: string;
  location: LocationValue;
  latitude: string;
  longitude: string;
  legalStatus: DraftLegalStatus;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

/* ─── Bolivian zones ─────────────────────────────────────── */

const BOLIVIAN_ZONES: readonly string[] = [
  'Achumani', 'Aeropuerto', 'Alalay', 'Alto Obrajes', 'Alto San Pedro', 'América',
  'Auquisamaña', 'Barrio Lindo', 'Barrio Nuevo', 'Barrio Profesional', 'Bella Vista',
  'Cala Cala', 'Calacoto', 'Centenario', 'Centro', 'Centro Histórico',
  'Cerro Verde', 'Ciudad Blanca', 'Ciudad del Este', 'Ciudad Jardín', 'Ciudad Nueva',
  'Ciudad Satélite', 'Colcapirhua', 'Cota Cota', 'Cotahuma', 'Delicias',
  'El Alto', 'El Cristo', 'El Kenko', 'El Molino', 'El Paso',
  'El Trompillo', 'El Urubó', 'Equipetrol Norte', 'Equipetrol Sur', 'Hamacas',
  'Hipódromo', 'Irpavi', 'Jaihuayco', 'Jardín', 'Juana Azurduy',
  'Kupini', 'La Calancha', 'La Florida', 'La Guardia', 'La Pampa',
  'La Portada', 'La Recoleta', 'Las Cuadras', 'Las Palmas', 'Lazareto',
  'Llojeta', 'Lomas de Aranjuez', 'Los Pinos', 'Mallasa', 'Mayorazgo',
  'Mercado Campesino', 'Meseta de Achumani', 'Miraflores', 'Montero', 'Muyurina',
  'Norte', 'Obrajes', 'Ovejuyo', 'Pagador', 'Palermo',
  'Pampahasi', 'Paurito', 'Periférica', 'Plan 3000', 'Quillacollo',
  'Río Seco', 'Rondón', 'Rosales', 'Sacaba', 'San Antonio',
  'San Benito', 'San Gerónimo', 'San Luis', 'San Miguel', 'San Sebastián',
  'Santa Bárbara', 'Sarco', 'Sopocachi', 'Sud', 'Sur',
  'Tiquipaya', 'Tomatitas', 'Urbarí', 'Valle Hermoso', 'Valle Sanchez',
  'Villa Armonía', 'Villa Busch', 'Villa Copacabana', 'Villa Coronilla',
  'Villa Dolores', 'Villa Esperanza', 'Villa Fátima', 'Villa Marx',
  'Villa San Antonio', 'Villa Verde', 'Warnes', 'Yotala',
  'Zona Norte', 'Zona Nor-Oeste', 'Zona Sur', 'Zona Sur-Este',
  'Otro',
];

/* ─── Price ranges (USD) ─────────────────────────────────── */

interface PriceRange { min: number; max: number; perM2: boolean; }

const USD_PRICE_RANGES: Record<OperationType, Record<PropertyType, PriceRange>> = {
  sale: {
    apartment: { min: 400, max: 1400, perM2: true },
    house:     { min: 250, max: 900,  perM2: true },
    office:    { min: 500, max: 1800, perM2: true },
    land:      { min: 40,  max: 400,  perM2: true },
    commercial:{ min: 450, max: 1600, perM2: true },
    warehouse: { min: 150, max: 500,  perM2: true },
    parking:   { min: 3000, max: 18000, perM2: false },
  },
  rent: {
    apartment: { min: 3,   max: 12,  perM2: true },
    house:     { min: 2,   max: 8,   perM2: true },
    office:    { min: 4,   max: 20,  perM2: true },
    land:      { min: 0.5, max: 4,   perM2: true },
    commercial:{ min: 4,   max: 25,  perM2: true },
    warehouse: { min: 1,   max: 5,   perM2: true },
    parking:   { min: 25,  max: 150, perM2: false },
  },
  anticretico: {
    apartment: { min: 15000, max: 70000,  perM2: false },
    house:     { min: 10000, max: 90000,  perM2: false },
    office:    { min: 20000, max: 120000, perM2: false },
    land:      { min: 4000,  max: 30000,  perM2: false },
    commercial:{ min: 20000, max: 150000, perM2: false },
    warehouse: { min: 6000,  max: 45000,  perM2: false },
    parking:   { min: 2000,  max: 15000,  perM2: false },
  },
};

/* ─── Property preview backgrounds ──────────────────────── */

const PROPERTY_PREVIEW_BACKGROUNDS: Record<PropertyType, string> = {
  apartment:  'linear-gradient(135deg, #dbeafe 0%, #ecfeff 100%)',
  house:      'linear-gradient(135deg, #dcfce7 0%, #fef9c3 100%)',
  office:     'linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 100%)',
  land:       'linear-gradient(135deg, #f0fdf4 0%, #d9f99d 100%)',
  commercial: 'linear-gradient(135deg, #ffedd5 0%, #fee2e2 100%)',
  warehouse:  'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
  parking:    'linear-gradient(135deg, #e2e8f0 0%, #fafafa 100%)',
};

/* ─── Google Maps ────────────────────────────────────────── */

interface GoogleMapPickerProps {
  latitude?: number; longitude?: number; query: string;
  onCoordinatesChange: (latitude: number, longitude: number) => void;
}

declare global { interface Window { google?: any; __propertyGoogleMapsPromise?: Promise<void>; } }

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
const DEFAULT_MAP_CENTER = { lat: -16.2902, lng: -63.5887 };
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

/* ─── Helpers ────────────────────────────────────────────── */

function numericValue(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function optionalNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) && value.trim() !== '' ? n : undefined;
}

function supportsRooms(propertyType: DraftPropertyType) {
  return ['apartment', 'house', 'office', 'commercial'].includes(propertyType);
}

function formatMoney(value: string, currency: DraftCurrency) {
  if (!value.trim()) return 'Precio por definir';
  const safeCurrency = currency || 'USD';
  return new Intl.NumberFormat(safeCurrency === 'BOB' ? 'es-BO' : 'en-US', {
    style: 'currency', currency: safeCurrency, maximumFractionDigits: 0,
  }).format(numericValue(value));
}

async function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadGoogleMapsScript() {
  if (!GOOGLE_MAPS_API_KEY) return Promise.reject(new Error('No hay una clave de Google Maps configurada.'));
  if (window.google?.maps) return Promise.resolve();
  if (window.__propertyGoogleMapsPromise) return window.__propertyGoogleMapsPromise;

  window.__propertyGoogleMapsPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('google-maps-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('No se pudo cargar Google Maps.')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-js';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}`;
    script.async = true; script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar Google Maps.'));
    document.head.appendChild(script);
  });

  return window.__propertyGoogleMapsPromise;
}

/* ─── GoogleMapPicker ────────────────────────────────────── */

function GoogleMapPicker({ latitude, longitude, query, onCoordinatesChange }: GoogleMapPickerProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [status, setStatus] = useState(
    GOOGLE_MAPS_API_KEY
      ? 'Haz clic en el mapa para marcar el inmueble.'
      : 'Para marcar haciendo clic falta configurar la clave de Google Maps. Puedes usar la ubicación del navegador.',
  );
  const [loadingLocation, setLoadingLocation] = useState(false);
  const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number';

  const iframeSrc = useMemo(() => {
    const mapQuery = hasCoordinates ? `${latitude},${longitude}` : query.trim() || 'Bolivia';
    const zoom = hasCoordinates ? 17 : 6;
    return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${zoom}&output=embed`;
  }, [hasCoordinates, latitude, longitude, query]);

  const setMapPoint = (lat: number, lng: number) =>
    onCoordinatesChange(Number(lat.toFixed(7)), Number(lng.toFixed(7)));

  const requestBrowserLocation = () => {
    if (!navigator.geolocation) { setStatus('Tu navegador no permite geolocalización.'); return; }
    setLoadingLocation(true); setStatus('Obteniendo ubicación del navegador...');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setMapPoint(pos.coords.latitude, pos.coords.longitude); setStatus('Punto marcado desde la ubicación del navegador.'); setLoadingLocation(false); },
      () => { setStatus('No se pudo obtener la ubicación. Revisa permisos del navegador.'); setLoadingLocation(false); },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const geocodeAddress = async () => {
    if (!query.trim()) { setStatus('Escribe dirección, zona y ciudad para buscar el punto.'); return; }
    if (!GOOGLE_MAPS_API_KEY) { setStatus('El mapa se actualiza por dirección, pero para guardar coordenadas exactas usa tu ubicación o configura la clave de Google Maps.'); return; }
    try {
      await loadGoogleMapsScript();
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: query }, (results: Array<{ geometry: { location: { lat: () => number; lng: () => number } } }>, responseStatus: string) => {
        if (responseStatus !== 'OK' || !results?.[0]) { setStatus('Google Maps no encontró esa dirección. Ajusta la zona o ciudad.'); return; }
        const loc = results[0].geometry.location;
        setMapPoint(loc.lat(), loc.lng()); setStatus('Punto marcado desde la dirección ingresada.');
      });
    } catch { setStatus('No se pudo buscar la dirección en Google Maps.'); }
  };

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !mapNodeRef.current) return;
    let alive = true;
    void loadGoogleMapsScript().then(() => {
      if (!alive || !mapNodeRef.current) return;
      const center = hasCoordinates ? { lat: latitude, lng: longitude } : DEFAULT_MAP_CENTER;
      mapRef.current = new window.google.maps.Map(mapNodeRef.current, { center, zoom: hasCoordinates ? 17 : 6, mapTypeControl: false, streetViewControl: false, fullscreenControl: true });
      mapRef.current.addListener('click', (event: { latLng?: { lat: () => number; lng: () => number } }) => {
        if (!event.latLng) return;
        setMapPoint(event.latLng.lat(), event.latLng.lng()); setStatus('Punto marcado manualmente en Google Maps.');
      });
    }).catch(() => setStatus('No se pudo cargar Google Maps interactivo. Puedes usar la ubicación del navegador.'));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps || !hasCoordinates) return;
    const position = { lat: latitude, lng: longitude };
    mapRef.current.setCenter(position); mapRef.current.setZoom(17);
    if (!markerRef.current) {
      markerRef.current = new window.google.maps.Marker({ map: mapRef.current, position, icon: { url: HOUSE_MARKER_URL, scaledSize: new window.google.maps.Size(46, 46), anchor: new window.google.maps.Point(23, 46) } });
      return;
    }
    markerRef.current.setPosition(position);
  }, [hasCoordinates, latitude, longitude]);

  return (
    <div className="property-map">
      <div className="property-map__head">
        <div>
          <span>Mapa de Google Maps</span>
          <strong>{hasCoordinates ? `${latitude?.toFixed(5)}, ${longitude?.toFixed(5)}` : 'Punto pendiente'}</strong>
        </div>
        <div className="property-map__actions">
          <button type="button" onClick={requestBrowserLocation} disabled={loadingLocation}>
            {loadingLocation ? <Loader2 size={16} className="property-create__spinner" /> : <LocateFixed size={16} />}
            Usar mi ubicación
          </button>
          <button type="button" onClick={geocodeAddress}>
            <Crosshair size={16} /> Buscar dirección
          </button>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hasCoordinates ? `${latitude},${longitude}` : query || 'Bolivia')}`} target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Abrir
          </a>
        </div>
      </div>
      <div className="property-map__canvas">
        {GOOGLE_MAPS_API_KEY
          ? <div ref={mapNodeRef} className="property-map__interactive" />
          : <iframe title="Ubicación de la propiedad en Google Maps" src={iframeSrc} loading="lazy" allowFullScreen />}
        {(!GOOGLE_MAPS_API_KEY || !hasCoordinates) && (
          <div className="property-map__center-marker" aria-hidden="true"><img src={HOUSE_MARKER_URL} alt="" /></div>
        )}
      </div>
      <p className="property-map__status">{status}</p>
    </div>
  );
}

/* ─── PriceValidator ─────────────────────────────────────── */

interface PriceValidatorProps {
  price: string;
  currency: DraftCurrency;
  operationType: DraftOperationType;
  propertyType: DraftPropertyType;
  areaTotal: string;
}

function PriceValidator({ price, currency, operationType, propertyType, areaTotal }: PriceValidatorProps) {
  if (!price || !operationType || !propertyType) return null;
  const priceNum = Number(price);
  if (!priceNum || !isFinite(priceNum)) return null;

  const BOB_RATE = 6.96;
  const EUR_RATE = 1.08;
  const priceUSD = currency === 'BOB' ? priceNum / BOB_RATE : currency === 'EUR' ? priceNum * EUR_RATE : priceNum;

  const range = USD_PRICE_RANGES[operationType as OperationType]?.[propertyType as PropertyType];
  if (!range) return null;

  const area = Number(areaTotal);
  const usePerM2 = range.perM2 && area > 0;
  if (range.perM2 && area <= 0) return null;

  const compareValue = usePerM2 ? priceUSD / area : priceUSD;
  const { min, max } = range;
  const mid = (min + max) / 2;
  const pct = ((compareValue - min) / (max - min)) * 100;

  let status: 'low' | 'ok' | 'high' = 'ok';
  if (pct < 0) status = 'low';
  else if (pct > 100) status = 'high';

  const COLORS = { low: '#f59e0b', ok: '#22c55e', high: '#ef4444' };
  const color = COLORS[status];
  const Icon = status === 'ok' ? Minus : status === 'low' ? TrendingUp : TrendingDown;

  const suggestedUSD = mid * (usePerM2 ? area : 1);
  const suggested = currency === 'BOB' ? Math.round(suggestedUSD * BOB_RATE) : currency === 'EUR' ? Math.round(suggestedUSD / EUR_RATE) : Math.round(suggestedUSD);
  const suggestedFmt = suggested.toLocaleString(currency === 'BOB' ? 'es-BO' : 'en-US');

  const displayPer = usePerM2
    ? `${Math.round(compareValue).toLocaleString('en-US')} USD/m²`
    : `${Math.round(compareValue).toLocaleString('en-US')} USD`;
  const rangeFmt = `${min.toLocaleString('en-US')} – ${max.toLocaleString('en-US')} USD${usePerM2 ? '/m²' : ''}`;
  const recText = status === 'ok'
    ? 'Precio dentro del rango de mercado.'
    : status === 'low'
    ? `Por debajo del rango. Referencia: ~${suggestedFmt} ${currency}.`
    : `Por encima del rango. Referencia: ~${suggestedFmt} ${currency}.`;

  return (
    <div className="price-validator">
      <div className="price-validator__head">
        <span>Validar precio</span>
        <Icon size={13} style={{ color, flexShrink: 0 }} />
      </div>
      <p className="price-validator__calc">{displayPer}</p>
      <p className="price-validator__range">Rango: {rangeFmt}</p>
      <div className="price-validator__bar">
        <div className="price-validator__fill" style={{ width: `${Math.min(Math.max(pct, 0), 100)}%`, background: color }} />
      </div>
      <p className="price-validator__rec" style={{ color }}>{recText}</p>
    </div>
  );
}

/* ─── PropertyCreatePage ─────────────────────────────────── */

export function PropertyCreatePage() {
  const navigate = useNavigate();
  const { currentUser } = useRootStore();
  const isOwner = currentUser.roles.includes(Role.Owner);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /* Images */
  const [images, setImages] = useState<ImageFile[]>([]);
  const [imgDragIdx, setImgDragIdx] = useState<number | null>(null);
  const [imgOverIdx, setImgOverIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => { objUrlsRef.current.forEach((u) => URL.revokeObjectURL(u)); };
  }, []);

  const handleImageAdd = (files: FileList | null) => {
    if (!files) return;
    const MAX_SIZE = 3 * 1024 * 1024; // 3 MB
    const valid = Array.from(files)
      .filter((f) => f.type.startsWith('image/') && f.size <= MAX_SIZE)
      .slice(0, 10 - images.length);
    const newImgs = valid.map((file) => {
      const preview = URL.createObjectURL(file);
      objUrlsRef.current.push(preview);
      return { id: crypto.randomUUID(), file, preview };
    });
    if (Array.from(files).some((f) => f.size > MAX_SIZE)) {
      alert('Algunas imágenes superan 3 MB y fueron omitidas.');
    }
    setImages((prev) => [...prev, ...newImgs]);
    // Reset so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageRemove = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.preview);
        objUrlsRef.current = objUrlsRef.current.filter((u) => u !== img.preview);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleImgDragStart = (idx: number) => setImgDragIdx(idx);
  const handleImgDragEnd = () => { setImgDragIdx(null); setImgOverIdx(null); };
  const handleImgDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setImgOverIdx(idx);
  };
  const handleImgDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (imgDragIdx === null || imgDragIdx === idx) { setImgDragIdx(null); setImgOverIdx(null); return; }
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(imgDragIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setImgDragIdx(null); setImgOverIdx(null);
  };

  /* Draft */
  const [draft, setDraft] = useState<PropertyDraft>({
    ownerId: currentUser.id,
    title: '', description: '', propertyType: '', operationType: '',
    price: '', currency: '', areaTotal: '', areaBuilt: '',
    bedrooms: '', bathrooms: '', parkingSpaces: '', floorNumber: '',
    yearBuilt: '', address: '', zone: '', location: {}, latitude: '', longitude: '',
    legalStatus: '',
  });

  const updateDraft = <K extends keyof PropertyDraft>(field: K, value: PropertyDraft[K]) =>
    setDraft((cur) => ({ ...cur, [field]: value }));

  const completion = useMemo(() => {
    const checks = [
      draft.title.trim(), draft.description.trim(), draft.propertyType, draft.operationType,
      draft.price.trim(), draft.currency, draft.areaTotal.trim(), draft.address.trim(),
      draft.location.cityName, draft.zone, draft.legalStatus, images.length > 0 ? 'ok' : '',
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [draft, images]);

  const mapLatitude = optionalNumber(draft.latitude) ?? draft.location.latitude;
  const mapLongitude = optionalNumber(draft.longitude) ?? draft.location.longitude;
  const mapQuery = [draft.address, draft.zone, draft.location.cityName, draft.location.stateName, draft.location.countryName].filter(Boolean).join(', ');
  const previewType: PropertyType = draft.propertyType || 'house';
  const requiredMissing = !draft.title.trim() || !draft.propertyType || !draft.operationType
    || !draft.price.trim() || !draft.currency || !draft.areaTotal.trim()
    || !draft.address.trim() || !draft.location.cityName || !draft.legalStatus;

  const handleSave = async () => {
    if (requiredMissing) {
      setError('Completa título, tipo, operación, precio, moneda, superficie, dirección, ciudad y estado legal antes de guardar.');
      return;
    }
    setSaving(true); setError('');
    try {
      const imageUrls: string[] = [];
      for (const img of images) {
        try { imageUrls.push(await toBase64(img.file)); } catch { /* skip */ }
      }
      const payload: Partial<Property> = {
        ownerId: isOwner ? currentUser.id : draft.ownerId,
        tenantId: currentUser.tenantId,
        title: draft.title.trim(),
        description: draft.description.trim(),
        propertyType: draft.propertyType as PropertyType,
        operationType: draft.operationType as OperationType,
        price: numericValue(draft.price),
        currency: draft.currency as Currency,
        areaTotal: numericValue(draft.areaTotal),
        areaBuilt: optionalNumber(draft.areaBuilt),
        bedrooms: supportsRooms(draft.propertyType) ? optionalNumber(draft.bedrooms) : undefined,
        bathrooms: supportsRooms(draft.propertyType) ? optionalNumber(draft.bathrooms) : undefined,
        parkingSpaces: optionalNumber(draft.parkingSpaces),
        floorNumber: optionalNumber(draft.floorNumber),
        yearBuilt: optionalNumber(draft.yearBuilt),
        address: draft.address.trim(),
        city: draft.location.cityName ?? '',
        zone: draft.zone || undefined,
        latitude: mapLatitude,
        longitude: mapLongitude,
        legalStatus: draft.legalStatus as LegalStatus,
        isFeatured: false,
      };
      if (imageUrls.length > 0) payload.imageUrls = imageUrls;
      await propertyService.create(payload);
      navigate(ROUTES.proptechProperties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar la propiedad.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="property-create">
      <div className="property-create__topbar">
        <Link to={ROUTES.proptechProperties} className="property-create__back">
          <ArrowLeft size={18} /> Volver a mis propiedades
        </Link>
        <button className="property-create__save property-create__save--compact" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={18} className="property-create__spinner" /> : <Save size={18} />}
          Guardar propiedad
        </button>
      </div>

      <div className="property-create__hero">
        <div>
          <p>Registro de inmueble</p>
          <h2>Nueva propiedad</h2>
          <span>Completa los datos de la base y revisa cómo se verá antes de guardarla.</span>
        </div>
        <div className="property-create__progress" aria-label={`Completado ${completion}%`}>
          <strong>{completion}%</strong>
          <span>completo</span>
        </div>
      </div>

      {error && <div className="property-create__error">{error}</div>}

      <div className="property-create__layout">
        <form className="property-create__form" onSubmit={(e) => { e.preventDefault(); void handleSave(); }}>

          {/* ── Información principal ─────────────────────── */}
          <section className="property-create__section">
            <div className="property-create__section-head">
              <Building2 size={20} />
              <div>
                <h3>Información principal</h3>
                <p>Título, tipo, operación y descripción comercial.</p>
              </div>
            </div>

            <label className="property-create__field property-create__field--wide">
              <span>Título de la propiedad</span>
              <input value={draft.title} onChange={(e) => updateDraft('title', e.target.value)} placeholder="Ej. Casa familiar con jardín en zona norte" />
            </label>

            <div className="property-create__grid">
              <label className="property-create__field">
                <span>Tipo de inmueble</span>
                <select value={draft.propertyType} onChange={(e) => updateDraft('propertyType', e.target.value as DraftPropertyType)}>
                  <option value="" disabled>Selecciona el tipo</option>
                  {Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <label className="property-create__field">
                <span>Operación</span>
                <select value={draft.operationType} onChange={(e) => updateDraft('operationType', e.target.value as DraftOperationType)}>
                  <option value="" disabled>Selecciona la operación</option>
                  {Object.entries(OPERATION_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
            </div>

            <label className="property-create__field property-create__field--wide">
              <span>Descripción</span>
              <textarea value={draft.description} onChange={(e) => updateDraft('description', e.target.value)} placeholder="Describe distribución, estado, accesos, entorno y puntos fuertes del inmueble." rows={4} />
            </label>
          </section>

          {/* ── Fotos del inmueble ────────────────────────── */}
          <section className="property-create__section">
            <div className="property-create__section-head">
              <ImageIcon size={20} />
              <div>
                <h3>Fotos del inmueble</h3>
                <p>La primera foto es la portada. Arrastra para reordenar. Máx. 10 fotos (3 MB c/u).</p>
              </div>
            </div>

            <div className="img-upload__grid">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className={[
                    'img-thumb',
                    idx === 0 ? 'img-thumb--cover' : '',
                    imgDragIdx === idx ? 'img-thumb--dragging' : '',
                    imgOverIdx === idx && imgDragIdx !== null && imgDragIdx !== idx ? 'img-thumb--over' : '',
                  ].filter(Boolean).join(' ')}
                  draggable
                  onDragStart={(e) => { e.stopPropagation(); handleImgDragStart(idx); }}
                  onDragOver={(e) => handleImgDragOver(e, idx)}
                  onDrop={(e) => handleImgDrop(e, idx)}
                  onDragEnd={handleImgDragEnd}
                >
                  <img src={img.preview} alt={`Foto ${idx + 1}`} className="img-thumb__img" draggable={false} />
                  {idx === 0 && <span className="img-thumb__badge">Portada</span>}
                  <button
                    type="button"
                    className="img-thumb__del"
                    title="Eliminar foto"
                    onClick={(e) => { e.stopPropagation(); handleImageRemove(img.id); }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}

              {images.length < 10 && (
                <button type="button" className="img-thumb img-thumb--add" onClick={() => fileInputRef.current?.click()}>
                  <Plus size={22} />
                  <span>Añadir fotos</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handleImageAdd(e.target.files)}
            />
          </section>

          {/* ── Precio y medidas ──────────────────────────── */}
          <section className="property-create__section">
            <div className="property-create__section-head property-create__section-head--price">
              <div className="property-create__section-head-left">
                <CircleDollarSign size={20} />
                <div>
                  <h3>Precio y medidas</h3>
                  <p>Datos usados para publicación, valoración y comparación.</p>
                </div>
              </div>
              <PriceValidator
                price={draft.price}
                currency={draft.currency}
                operationType={draft.operationType}
                propertyType={draft.propertyType}
                areaTotal={draft.areaTotal}
              />
            </div>

            <div className="property-create__grid property-create__grid--thirds">
              <label className="property-create__field">
                <span>Precio</span>
                <input type="number" min="0" value={draft.price} onChange={(e) => updateDraft('price', e.target.value)} placeholder="Ej. 145000" />
              </label>
              <label className="property-create__field">
                <span>Moneda</span>
                <select value={draft.currency} onChange={(e) => updateDraft('currency', e.target.value as DraftCurrency)}>
                  <option value="" disabled>Selecciona moneda</option>
                  {Object.entries(CURRENCY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <label className="property-create__field">
                <span>Área total m2</span>
                <input type="number" min="0" value={draft.areaTotal} onChange={(e) => updateDraft('areaTotal', e.target.value)} placeholder="Ej. 250" />
              </label>
            </div>

            <div className="property-create__grid property-create__grid--thirds">
              <label className="property-create__field">
                <span>Área construida m2</span>
                <input type="number" min="0" value={draft.areaBuilt} onChange={(e) => updateDraft('areaBuilt', e.target.value)} placeholder="Ej. 180" />
              </label>
              <label className="property-create__field">
                <span>Dormitorios</span>
                <input type="number" min="0" value={draft.bedrooms} onChange={(e) => updateDraft('bedrooms', e.target.value)} placeholder="Ej. 3" disabled={!supportsRooms(draft.propertyType)} />
              </label>
              <label className="property-create__field">
                <span>Baños</span>
                <input type="number" min="0" value={draft.bathrooms} onChange={(e) => updateDraft('bathrooms', e.target.value)} placeholder="Ej. 2" disabled={!supportsRooms(draft.propertyType)} />
              </label>
            </div>

            <div className="property-create__grid property-create__grid--thirds">
              <label className="property-create__field">
                <span>Parqueos</span>
                <input type="number" min="0" value={draft.parkingSpaces} onChange={(e) => updateDraft('parkingSpaces', e.target.value)} placeholder="Ej. 1" />
              </label>
              <label className="property-create__field">
                <span>Piso</span>
                <input type="number" value={draft.floorNumber} onChange={(e) => updateDraft('floorNumber', e.target.value)} placeholder="Ej. 4" />
              </label>
              <label className="property-create__field">
                <span>Año de construcción</span>
                <input type="number" min="1800" max="2100" value={draft.yearBuilt} onChange={(e) => updateDraft('yearBuilt', e.target.value)} placeholder="Ej. 2018" />
              </label>
            </div>
          </section>

          {/* ── Ubicación ────────────────────────────────── */}
          <section className="property-create__section">
            <div className="property-create__section-head">
              <MapPin size={20} />
              <div>
                <h3>Ubicación</h3>
                <p>Selecciona ciudad, escribe la dirección y marca el punto en Google Maps.</p>
              </div>
            </div>

            <LocationSelector
              defaultCountryCode={null}
              label="Ubicación de la propiedad"
              value={draft.location}
              onChange={(location) => {
                updateDraft('location', location);
                if (location.latitude) updateDraft('latitude', String(location.latitude));
                if (location.longitude) updateDraft('longitude', String(location.longitude));
              }}
            />

            <div className="property-create__grid">
              <label className="property-create__field">
                <span>Zona / barrio</span>
                <select value={draft.zone} onChange={(e) => updateDraft('zone', e.target.value)}>
                  <option value="">Selecciona la zona</option>
                  {BOLIVIAN_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              </label>
              <label className="property-create__field">
                <span>Dirección</span>
                <input value={draft.address} onChange={(e) => updateDraft('address', e.target.value)} placeholder="Ej. Av. América esquina parque principal" />
              </label>
            </div>

            <GoogleMapPicker
              latitude={mapLatitude}
              longitude={mapLongitude}
              query={mapQuery}
              onCoordinatesChange={(lat, lng) => { updateDraft('latitude', String(lat)); updateDraft('longitude', String(lng)); }}
            />
          </section>

          {/* ── Estado legal ──────────────────────────────── */}
          <section className="property-create__section">
            <div className="property-create__section-head">
              <FileCheck2 size={20} />
              <div>
                <h3>Estado legal</h3>
                <p>Base para validar publicación y preparar documentos.</p>
              </div>
            </div>

            <div className="property-create__grid">
              <label className="property-create__field">
                <span>Situación legal</span>
                <select value={draft.legalStatus} onChange={(e) => updateDraft('legalStatus', e.target.value as DraftLegalStatus)}>
                  <option value="" disabled>Selecciona el estado legal</option>
                  {Object.entries(LEGAL_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              {!isOwner && (
                <label className="property-create__field">
                  <span>ID del propietario</span>
                  <input value={draft.ownerId} onChange={(e) => updateDraft('ownerId', e.target.value)} placeholder="ID del usuario propietario" />
                </label>
              )}
            </div>
          </section>

          <div className="property-create__footer">
            <button className="property-create__save" type="submit" disabled={saving}>
              {saving ? <Loader2 size={18} className="property-create__spinner" /> : <Save size={18} />}
              Guardar propiedad
            </button>
          </div>
        </form>

        {/* ── Vista previa ──────────────────────────────── */}
        <aside className="property-preview">
          <div className="property-preview__label">
            <Eye size={18} /> Vista previa
          </div>
          <article className="property-preview__card">
            <div
              className="property-preview__media"
              style={images.length > 0 ? undefined : { background: PROPERTY_PREVIEW_BACKGROUNDS[previewType] }}
            >
              {images.length > 0 ? (
                <>
                  <img src={images[0].preview} alt="Portada" className="property-preview__cover-img" />
                  <span className="property-preview__op-badge">{draft.operationType ? OPERATION_TYPE_LABELS[draft.operationType] : 'Operación'}</span>
                  {images.length > 1 && (
                    <span className="property-preview__img-count">+{images.length - 1} fotos</span>
                  )}
                </>
              ) : (
                <>
                  <Building2 size={54} />
                  <span>{draft.operationType ? OPERATION_TYPE_LABELS[draft.operationType] : 'Operación'}</span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="property-preview__thumbnails">
                {images.slice(1, 5).map((img, idx) => (
                  <div key={img.id} className={`property-preview__thumb${idx === 3 && images.length > 5 ? ' property-preview__thumb--more' : ''}`}>
                    <img src={img.preview} alt={`Foto ${idx + 2}`} />
                    {idx === 3 && images.length > 5 && <span>+{images.length - 5}</span>}
                  </div>
                ))}
              </div>
            )}

            <div className="property-preview__body">
              <div className="property-preview__type">
                <span>{draft.propertyType ? PROPERTY_TYPE_LABELS[draft.propertyType] : 'Tipo de inmueble'}</span>
                <strong>Borrador</strong>
              </div>
              <h3>{draft.title || 'Título de la propiedad'}</h3>
              <p className="property-preview__location">
                <MapPin size={16} />
                {draft.location.cityName || 'Ciudad'}{draft.zone ? `, ${draft.zone}` : ''}
              </p>
              <p className="property-preview__description">
                {draft.description || 'Agrega una descripción clara para destacar el inmueble.'}
              </p>
              <div className="property-preview__price">{formatMoney(draft.price, draft.currency)}</div>
              <div className="property-preview__facts">
                <span><Ruler size={15} /> {draft.areaTotal || 0} m2</span>
                {supportsRooms(draft.propertyType) && <span><BedDouble size={15} /> {draft.bedrooms || 0} dorm.</span>}
                {supportsRooms(draft.propertyType) && <span><Bath size={15} /> {draft.bathrooms || 0} baños</span>}
                <span><Car size={15} /> {draft.parkingSpaces || 0} parqueos</span>
              </div>
            </div>
          </article>

          <div className="property-preview__checklist">
            <h4>Checklist para revisión</h4>
            {[
              { label: 'Datos comerciales', ok: Boolean(draft.title && draft.description && draft.price) },
              { label: 'Fotos del inmueble', ok: images.length > 0 },
              { label: 'Medidas del inmueble', ok: Boolean(draft.areaTotal) },
              { label: 'Ubicación y punto de mapa', ok: Boolean(draft.location.cityName && draft.address && mapLatitude && mapLongitude) },
              { label: 'Estado legal informado', ok: Boolean(draft.legalStatus) },
            ].map((item) => (
              <div key={item.label} className={item.ok ? 'property-preview__check property-preview__check--done' : 'property-preview__check'}>
                {item.ok ? <CheckCircle2 size={17} /> : <BadgeCheck size={17} />}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
