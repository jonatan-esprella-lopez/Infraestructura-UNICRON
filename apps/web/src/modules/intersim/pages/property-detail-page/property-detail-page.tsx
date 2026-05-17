import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bed, Bath, Square, Car, MapPin, Home, Building2, Trees, Briefcase,
  Loader2, AlertCircle, Navigation, MessageCircle, Phone, Star, CheckCircle,
  ChevronLeft, ChevronRight, Calendar, Layers, ZoomIn,
} from 'lucide-react';
import { propertyService } from '@modules/proptech/services/property.service';
import type { Property } from '@modules/proptech/types/property.types';
import './property-detail-page.css';

const OPERATION_LABELS: Record<string, string> = { sale: 'Venta', rent: 'Alquiler', anticretico: 'Anticrético' };
const PROPERTY_TYPE_LABELS: Record<string, string> = {
  house: 'Casa', apartment: 'Departamento', land: 'Terreno',
  office: 'Oficina', commercial: 'Local Comercial', warehouse: 'Almacén', parking: 'Estacionamiento',
};
const PROPERTY_TYPE_ICONS: Record<string, React.ReactNode> = {
  house: <Home size={16} />, apartment: <Building2 size={16} />,
  land: <Trees size={16} />, office: <Briefcase size={16} />,
};

function formatPrice(price: number, currency: string, opType: string) {
  const formatted = new Intl.NumberFormat('es-BO', {
    style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0,
  }).format(price);
  return opType === 'rent' ? `${formatted}/mes` : formatted;
}

function getMapEmbedUrl(prop: Property): string {
  if (prop.latitude && prop.longitude) {
    return `https://maps.google.com/maps?q=${prop.latitude},${prop.longitude}&z=16&output=embed&iwloc=near`;
  }
  const query = encodeURIComponent(`${prop.address}, ${prop.city}, Bolivia`);
  return `https://maps.google.com/maps?q=${query}&z=15&output=embed&iwloc=near`;
}

function getDirectionsUrl(prop: Property): string {
  if (prop.latitude && prop.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${prop.latitude},${prop.longitude}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${prop.address}, ${prop.city}, Bolivia`)}`;
}

function getWhatsAppUrl(phone: string, prop: Property): string {
  const clean = phone.replace(/\D/g, '');
  const intl = clean.startsWith('591') ? clean : `591${clean}`;
  const msg = encodeURIComponent(
    `Hola! Vi la propiedad "${prop.title}" en Intersim y me gustaría obtener más información. ¿Podría ayudarme?`
  );
  return `https://wa.me/${intl}?text=${msg}`;
}

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    propertyService.findByIdPublic(id)
      .then((p) => { setProperty(p); setLoading(false); })
      .catch(() => { setError('No se pudo cargar la propiedad.'); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="pd-loading">
      <Loader2 size={48} className="pd-spinner" />
      <p>Cargando propiedad...</p>
    </div>
  );

  if (error || !property) return (
    <div className="pd-error">
      <AlertCircle size={48} />
      <h2>{error ?? 'Propiedad no encontrada'}</h2>
      <button onClick={() => navigate('/propiedades')}>Volver al listado</button>
    </div>
  );

  const images: string[] = (property.imageUrls && property.imageUrls.length > 0)
    ? property.imageUrls
    : ['/properties_hero.png'];

  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);

  const opLabel = OPERATION_LABELS[property.operationType] ?? property.operationType;
  const typeLabel = PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType;
  const typeIcon = PROPERTY_TYPE_ICONS[property.propertyType];
  const mapUrl = getMapEmbedUrl(property);
  const directionsUrl = getDirectionsUrl(property);
  const agentPhone = property.agentPhone ?? '';
  const whatsappUrl = agentPhone ? getWhatsAppUrl(agentPhone, property) : null;

  return (
    <div className="pd-page">
      {/* Back */}
      <div className="pd-topbar">
        <button className="pd-back-btn" onClick={() => navigate('/propiedades')}>
          <ArrowLeft size={18} /> Volver al listado
        </button>
        <div className="pd-breadcrumb">
          <span>Propiedades</span> / <span>{typeLabel}</span> / <span>{property.city}</span>
        </div>
      </div>

      <div className="pd-layout">
        {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
        <div className="pd-left">

          {/* Gallery */}
          <div className="pd-gallery">
            <div className="pd-gallery-main">
              <img
                src={images[activeImg]}
                alt={property.title}
                className="pd-gallery-img"
                onError={(e) => { (e.target as HTMLImageElement).src = '/properties_hero.png'; }}
              />
              <span className={`pd-op-badge op-${property.operationType}`}>{opLabel}</span>
              {property.isFeatured && <span className="pd-featured-badge">Destacado</span>}
              <button className="pd-lightbox-btn" onClick={() => setLightbox(true)} title="Ver en grande">
                <ZoomIn size={18} />
              </button>
              {images.length > 1 && (
                <>
                  <button className="pd-gallery-nav pd-gallery-nav--prev" onClick={prevImg}><ChevronLeft size={22} /></button>
                  <button className="pd-gallery-nav pd-gallery-nav--next" onClick={nextImg}><ChevronRight size={22} /></button>
                </>
              )}
              <div className="pd-gallery-counter">{activeImg + 1} / {images.length}</div>
            </div>

            {images.length > 1 && (
              <div className="pd-gallery-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-thumb${i === activeImg ? ' active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`Foto ${i + 1}`} onError={(e) => { (e.target as HTMLImageElement).src = '/properties_hero.png'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div className="pd-header">
            <div className="pd-type-chip">{typeIcon} {typeLabel}</div>
            <h1 className="pd-title">{property.title}</h1>
            <div className="pd-location">
              <MapPin size={16} />
              <span>{property.address}{property.city ? `, ${property.city}` : ''}{property.zone ? ` — ${property.zone}` : ''}</span>
            </div>
            <div className="pd-price-row">
              <div className="pd-price">{formatPrice(property.price, property.currency, property.operationType)}</div>
              {property.operationType === 'rent' && <span className="pd-price-note">por mes</span>}
            </div>
          </div>

          {/* Key Stats */}
          <div className="pd-stats-grid">
            {(property.bedrooms ?? 0) > 0 && (
              <div className="pd-stat"><Bed size={22} /><strong>{property.bedrooms}</strong><span>Habitaciones</span></div>
            )}
            {(property.bathrooms ?? 0) > 0 && (
              <div className="pd-stat"><Bath size={22} /><strong>{property.bathrooms}</strong><span>Baños</span></div>
            )}
            {(property.areaTotal ?? 0) > 0 && (
              <div className="pd-stat"><Square size={22} /><strong>{property.areaTotal}</strong><span>m² totales</span></div>
            )}
            {(property.areaBuilt ?? 0) > 0 && (
              <div className="pd-stat"><Layers size={22} /><strong>{property.areaBuilt}</strong><span>m² construidos</span></div>
            )}
            {(property.parkingSpaces ?? 0) > 0 && (
              <div className="pd-stat"><Car size={22} /><strong>{property.parkingSpaces}</strong><span>Estacionamientos</span></div>
            )}
            {property.yearBuilt && (
              <div className="pd-stat"><Calendar size={22} /><strong>{property.yearBuilt}</strong><span>Año de construcción</span></div>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <div className="pd-section">
              <h2 className="pd-section-title">Descripción</h2>
              <p className="pd-description">{property.description}</p>
            </div>
          )}

          {/* Details Table */}
          <div className="pd-section">
            <h2 className="pd-section-title">Detalles del inmueble</h2>
            <div className="pd-details-grid">
              <div className="pd-detail-item"><span>Tipo de operación</span><strong>{opLabel}</strong></div>
              <div className="pd-detail-item"><span>Tipo de inmueble</span><strong>{typeLabel}</strong></div>
              <div className="pd-detail-item"><span>Ciudad</span><strong>{property.city}</strong></div>
              {property.zone && <div className="pd-detail-item"><span>Zona</span><strong>{property.zone}</strong></div>}
              {property.floorNumber !== undefined && property.floorNumber !== null && (
                <div className="pd-detail-item"><span>Piso</span><strong>{property.floorNumber}</strong></div>
              )}
              <div className="pd-detail-item"><span>Estado legal</span><strong>{{
                clear: 'Sin cargas', in_process: 'En proceso', encumbered: 'Con cargas', unknown: 'Por verificar',
              }[property.legalStatus] ?? property.legalStatus}</strong></div>
              <div className="pd-detail-item"><span>Moneda</span><strong>{property.currency}</strong></div>
              {property.publishedAt && (
                <div className="pd-detail-item">
                  <span>Publicado</span>
                  <strong>{new Date(property.publishedAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="pd-section">
            <h2 className="pd-section-title">Ubicación</h2>
            <div className="pd-map-wrapper">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de la propiedad"
              />
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-directions-btn"
            >
              <Navigation size={18} />
              Cómo llegar
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN (sticky) ──────────────────────────────────── */}
        <aside className="pd-sidebar">

          {/* Price card */}
          <div className="pd-sidebar-price-card">
            <div className="pd-sidebar-op-label op-bg-{property.operationType}">{opLabel}</div>
            <div className="pd-sidebar-price">{formatPrice(property.price, property.currency, property.operationType)}</div>
            <div className="pd-sidebar-address"><MapPin size={13} /> {property.address}, {property.city}</div>
          </div>

          {/* Agent card */}
          <div className="pd-agent-card">
            <div className="pd-agent-header">
              <div className="pd-agent-avatar">
                {property.agentName ? property.agentName.charAt(0) : 'A'}
              </div>
              <div className="pd-agent-info">
                <div className="pd-agent-name">
                  {property.agentName ?? 'Asesor Intersim'}
                  <CheckCircle size={14} className="pd-agent-verified" />
                </div>
                <div className="pd-agent-agency">{property.agentAgency ?? 'Intersim Bolivia'}</div>
                <div className="pd-agent-rating"><Star size={12} /> 4.9 · Verificado</div>
              </div>
            </div>

            <div className="pd-agent-actions">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-btn pd-btn--whatsapp"
                >
                  <MessageCircle size={19} />
                  Contactar por WhatsApp
                </a>
              )}
              {agentPhone && (
                <a href={`tel:${agentPhone.replace(/\s/g, '')}`} className="pd-btn pd-btn--phone">
                  <Phone size={19} />
                  {agentPhone}
                </a>
              )}
            </div>

            <p className="pd-agent-note">
              Responde habitualmente en menos de 1 hora.
            </p>
          </div>

          {/* Quick stats sidebar */}
          <div className="pd-sidebar-stats">
            {(property.bedrooms ?? 0) > 0 && <div><Bed size={15} /> {property.bedrooms} hab.</div>}
            {(property.bathrooms ?? 0) > 0 && <div><Bath size={15} /> {property.bathrooms} baños</div>}
            {(property.areaTotal ?? 0) > 0 && <div><Square size={15} /> {property.areaTotal} m²</div>}
            {(property.parkingSpaces ?? 0) > 0 && <div><Car size={15} /> {property.parkingSpaces} parking</div>}
          </div>
        </aside>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="pd-lightbox" onClick={() => setLightbox(false)}>
          <button className="pd-lightbox-close" onClick={() => setLightbox(false)}>✕</button>
          <button className="pd-lightbox-nav pd-lightbox-nav--prev" onClick={(e) => { e.stopPropagation(); prevImg(); }}>
            <ChevronLeft size={32} />
          </button>
          <img
            src={images[activeImg]}
            alt={property.title}
            className="pd-lightbox-img"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => { (e.target as HTMLImageElement).src = '/properties_hero.png'; }}
          />
          <button className="pd-lightbox-nav pd-lightbox-nav--next" onClick={(e) => { e.stopPropagation(); nextImg(); }}>
            <ChevronRight size={32} />
          </button>
          <div className="pd-lightbox-counter">{activeImg + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}
