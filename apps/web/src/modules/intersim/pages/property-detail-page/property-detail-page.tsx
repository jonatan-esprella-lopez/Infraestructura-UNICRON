import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Bath,
  Bed,
  Briefcase,
  Building2,
  Calendar,
  Car,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileCheck2,
  Home,
  Layers,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  UserRound,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react';
import { propertyService } from '@modules/proptech/services/property.service';
import { leadService } from '@modules/proptech/services/lead.service';
import type { Property } from '@modules/proptech/types/property.types';
import {
  LEGAL_STATUS_LABELS,
  OPERATION_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
} from '@modules/proptech/constants/property-types.constant';
import './property-detail-page.css';

const TYPE_ICONS: Partial<Record<Property['propertyType'], LucideIcon>> = {
  apartment: Building2,
  commercial: Briefcase,
  house: Home,
  land: Trees,
  office: Briefcase,
  parking: Car,
  warehouse: Building2,
};

function formatPrice(price: number | undefined, currency: string | undefined, operationType: string | undefined) {
  const amount = Number(price);
  if (!Number.isFinite(amount) || amount <= 0) return 'Consultar precio';

  const formatter = new Intl.NumberFormat(currency === 'BOB' ? 'es-BO' : 'en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  });

  return operationType === 'rent' ? `${formatter.format(amount)}/mes` : formatter.format(amount);
}

function formatNumber(value: number | undefined) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return new Intl.NumberFormat('es-BO', { maximumFractionDigits: 0 }).format(amount);
}

function formatArea(value: number | undefined) {
  const amount = formatNumber(value);
  return amount ? `${amount} m²` : null;
}

function formatDate(value: string | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' });
}

function getPricePerM2(property: Property) {
  const price = Number(property.price);
  const area = Number(property.areaTotal || property.areaBuilt);
  if (!Number.isFinite(price) || !Number.isFinite(area) || price <= 0 || area <= 0) return null;
  return formatPrice(Math.round(price / area), property.currency, undefined);
}

function getMapEmbedUrl(property: Property): string {
  if (property.latitude && property.longitude) {
    return `https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=16&output=embed&iwloc=near`;
  }
  const query = encodeURIComponent(`${property.address}, ${property.city}, Bolivia`);
  return `https://maps.google.com/maps?q=${query}&z=15&output=embed&iwloc=near`;
}

function getDirectionsUrl(property: Property): string {
  if (property.latitude && property.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${property.address}, ${property.city}, Bolivia`)}`;
}

function getWhatsAppUrl(phone: string, property: Property): string {
  const clean = phone.replace(/\D/g, '');
  const intl = clean.startsWith('591') ? clean : `591${clean}`;
  const msg = encodeURIComponent(
    `Hola! Vi la propiedad "${property.title}" en Intersim y me gustaría recibir más información. ¿Podría ayudarme?`,
  );
  return `https://wa.me/${intl}?text=${msg}`;
}

function getFullAddress(property: Property) {
  return [property.address, property.zone, property.city].filter(Boolean).join(', ');
}

function getPublicCode(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function copyCurrentUrl() {
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(window.location.href);
  }
}

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', phone: '', email: '', message: '' });
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.firstName || !contactForm.lastName) { setContactError('Nombre y apellido son requeridos'); return; }
    setContactSending(true); setContactError('');
    try {
      await leadService.createPublic({
        firstName: contactForm.firstName,
        lastName: contactForm.lastName,
        phone: contactForm.phone || undefined,
        email: contactForm.email || undefined,
        message: contactForm.message || undefined,
        propertyId: property?.id,
        propertyTitle: property?.title,
        agentId: property?.agentId,
        operationType: property?.operationType,
        propertyType: property?.propertyType,
        preferredCity: property?.city,
      });
      setContactSent(true);
      setContactForm({ firstName: '', lastName: '', phone: '', email: '', message: '' });
    } catch { setContactError('No se pudo enviar. Intenta de nuevo.'); }
    finally { setContactSending(false); }
  };

  useEffect(() => {
    if (!id) return;

    let alive = true;
    setLoading(true);
    setError(null);

    propertyService.findByIdPublic(id)
      .then((item) => {
        if (!alive) return;
        setProperty(item);
        setActiveImg(0);
      })
      .catch(() => {
        if (!alive) return;
        setError('No se pudo cargar la propiedad.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const images = useMemo(
    () => (property?.imageUrls?.length ? property.imageUrls : ['/properties_hero.png']),
    [property],
  );

  if (loading) return (
    <div className="pd-loading">
      <Loader2 size={44} className="pd-spinner" />
      <p>Cargando propiedad...</p>
    </div>
  );

  if (error || !property) return (
    <div className="pd-error">
      <AlertCircle size={44} />
      <h2>{error ?? 'Propiedad no encontrada'}</h2>
      <button onClick={() => navigate('/propiedades')}>Volver al listado</button>
    </div>
  );

  const operationLabel = OPERATION_TYPE_LABELS[property.operationType] ?? property.operationType;
  const typeLabel = PROPERTY_TYPE_LABELS[property.propertyType] ?? property.propertyType;
  const legalLabel = LEGAL_STATUS_LABELS[property.legalStatus] ?? property.legalStatus;
  const PropertyIcon = TYPE_ICONS[property.propertyType] ?? Home;
  const pricePerM2 = getPricePerM2(property);
  const agentPhone = property.agentPhone ?? '';
  const whatsappUrl = agentPhone ? getWhatsAppUrl(agentPhone, property) : null;
  const publishedDate = formatDate(property.publishedAt || property.createdAt);
  const fullAddress = getFullAddress(property);
  const mapUrl = getMapEmbedUrl(property);
  const directionsUrl = getDirectionsUrl(property);

  const prevImg = () => setActiveImg((current) => (current - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((current) => (current + 1) % images.length);

  const highlights = [
    { Icon: Ruler, label: 'Superficie total', value: formatArea(property.areaTotal) },
    { Icon: Layers, label: 'Construcción', value: formatArea(property.areaBuilt) },
    { Icon: Bed, label: 'Dormitorios', value: formatNumber(property.bedrooms) },
    { Icon: Bath, label: 'Baños', value: formatNumber(property.bathrooms) },
    { Icon: Car, label: 'Parqueos', value: formatNumber(property.parkingSpaces) },
    { Icon: Calendar, label: 'Año', value: property.yearBuilt ? String(property.yearBuilt) : null },
  ].filter((item) => Boolean(item.value));

  const featureChips = [
    property.areaTotal ? `${formatArea(property.areaTotal)} de terreno` : null,
    property.areaBuilt ? `${formatArea(property.areaBuilt)} construidos` : null,
    property.floorNumber !== undefined && property.floorNumber !== null ? `Piso ${property.floorNumber}` : null,
    property.parkingSpaces ? `${property.parkingSpaces} parqueo${property.parkingSpaces > 1 ? 's' : ''}` : null,
    property.bedrooms ? `${property.bedrooms} dormitorio${property.bedrooms > 1 ? 's' : ''}` : null,
    property.bathrooms ? `${property.bathrooms} baño${property.bathrooms > 1 ? 's' : ''}` : null,
    property.isFeatured ? 'Propiedad destacada' : null,
    property.latitude && property.longitude ? 'Ubicación marcada' : null,
  ].filter((item): item is string => Boolean(item));

  const confidenceItems = [
    {
      ok: property.publicationStatus === 'published',
      title: 'Publicación activa',
      text: property.publicationStatus === 'published' ? 'Visible en el catálogo público.' : 'Pendiente de publicación.',
    },
    {
      ok: property.legalStatus === 'clear',
      title: 'Estado legal',
      text: legalLabel,
    },
    {
      ok: Boolean(property.latitude && property.longitude),
      title: 'Ubicación',
      text: property.latitude && property.longitude ? 'Coordenadas disponibles.' : 'Ubicación aproximada por dirección.',
    },
    {
      ok: Boolean(property.agentName || property.agentPhone || property.agentEmail),
      title: 'Asesor asignado',
      text: property.agentName ?? 'Equipo INTERSIM',
    },
  ];

  const detailRows = [
    ['Código', getPublicCode(property.id)],
    ['Operación', operationLabel],
    ['Tipo de inmueble', typeLabel],
    ['Ciudad', property.city],
    ['Zona', property.zone],
    ['Dirección', property.address],
    ['Precio por m²', pricePerM2],
    ['Estado legal', legalLabel],
    ['Moneda', property.currency],
    ['Publicado', publishedDate],
  ].filter(([, value]) => Boolean(value));

  return (
    <div className="pd-page">
      <div className="pd-topbar">
        <button className="pd-back-btn" onClick={() => navigate('/propiedades')}>
          <ArrowLeft size={18} />
          Volver al listado
        </button>
        <div className="pd-breadcrumb">
          <span>Propiedades</span>
          <span>/</span>
          <span>{typeLabel}</span>
          <span>/</span>
          <span>{property.city}</span>
        </div>
      </div>

      <section className="pd-hero">
        <div className="pd-gallery">
          <div className="pd-gallery-main">
            <img
              src={images[activeImg]}
              alt={property.title}
              className="pd-gallery-img"
              onError={(event) => { (event.target as HTMLImageElement).src = '/properties_hero.png'; }}
            />
            <div className="pd-gallery-shade" />

            <div className="pd-gallery-badges">
              <span className={`pd-op-badge op-${property.operationType}`}>{operationLabel}</span>
              {property.isFeatured && <span className="pd-featured-badge"><Sparkles size={13} /> Destacada</span>}
            </div>

            <button className="pd-lightbox-btn" onClick={() => setLightbox(true)} aria-label="Ver fotos en grande">
              <ZoomIn size={18} />
            </button>

            {images.length > 1 && (
              <>
                <button className="pd-gallery-nav pd-gallery-nav--prev" onClick={prevImg} aria-label="Foto anterior">
                  <ChevronLeft size={22} />
                </button>
                <button className="pd-gallery-nav pd-gallery-nav--next" onClick={nextImg} aria-label="Foto siguiente">
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <div className="pd-gallery-counter">{activeImg + 1} / {images.length}</div>
          </div>

          {images.length > 1 && (
            <div className="pd-gallery-thumbs">
              {images.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  className={`pd-thumb${index === activeImg ? ' active' : ''}`}
                  onClick={() => setActiveImg(index)}
                  aria-label={`Ver foto ${index + 1}`}
                >
                  <img
                    src={img}
                    alt={`Foto ${index + 1}`}
                    onError={(event) => { (event.target as HTMLImageElement).src = '/properties_hero.png'; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="pd-hero-panel">
          <div className="pd-type-chip">
            <PropertyIcon size={17} />
            {typeLabel}
          </div>

          <h1 className="pd-title">{property.title}</h1>

          <div className="pd-location">
            <MapPin size={17} />
            <span>{fullAddress || 'Ubicación por confirmar'}</span>
          </div>

          <div className="pd-price-block">
            <strong>{formatPrice(property.price, property.currency, property.operationType)}</strong>
            <span>{pricePerM2 ? `${pricePerM2} por m²` : 'Precio referencial publicado'}</span>
          </div>

          <div className="pd-hero-meta">
            {publishedDate && <span><Clock3 size={14} /> Publicado {publishedDate}</span>}
            <span><ShieldCheck size={14} /> {legalLabel}</span>
            <span><BadgeCheck size={14} /> Código {getPublicCode(property.id)}</span>
          </div>

          <div className="pd-hero-actions">
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="pd-btn pd-btn--primary">
                <MessageCircle size={18} />
                Consultar por WhatsApp
              </a>
            )}
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="pd-btn pd-btn--secondary">
              <Navigation size={18} />
              Ver ruta
            </a>
            <button type="button" className="pd-icon-btn" onClick={copyCurrentUrl} aria-label="Copiar enlace">
              <Share2 size={18} />
            </button>
          </div>
        </aside>
      </section>

      <div className="pd-layout">
        <main className="pd-left">
          <section className="pd-section pd-overview">
            <div className="pd-section-head">
              <span>Resumen del inmueble</span>
              <h2>Datos clave para evaluar esta propiedad</h2>
            </div>

            <div className="pd-stats-grid">
              {highlights.length > 0 ? highlights.map(({ Icon, label, value }) => (
                <div className="pd-stat" key={label}>
                  <Icon size={22} />
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              )) : (
                <div className="pd-stat pd-stat--empty">
                  <Home size={22} />
                  <strong>{typeLabel}</strong>
                  <span>Información principal</span>
                </div>
              )}
            </div>
          </section>

          {property.description && (
            <section className="pd-section">
              <div className="pd-section-head">
                <span>Descripción</span>
                <h2>Detalles comerciales</h2>
              </div>
              <p className="pd-description">{property.description}</p>
            </section>
          )}

          <section className="pd-section">
            <div className="pd-section-head">
              <span>Características</span>
              <h2>Lo más relevante</h2>
            </div>
            <div className="pd-feature-list">
              {featureChips.length > 0 ? featureChips.map((feature) => (
                <span key={feature}><CheckCircle size={15} /> {feature}</span>
              )) : (
                <span><CheckCircle size={15} /> Información inmobiliaria disponible bajo consulta</span>
              )}
            </div>
          </section>

          <section className="pd-section">
            <div className="pd-section-head">
              <span>Ficha técnica</span>
              <h2>Información del registro</h2>
            </div>
            <div className="pd-details-grid">
              {detailRows.map(([label, value]) => (
                <div className="pd-detail-item" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="pd-section">
            <div className="pd-section-head">
              <span>Ubicación</span>
              <h2>{property.zone ? `${property.zone}, ${property.city}` : property.city}</h2>
            </div>
            <div className="pd-map-layout">
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
              <div className="pd-map-card">
                <MapPin size={20} />
                <strong>{fullAddress || property.city}</strong>
                <span>{property.latitude && property.longitude ? 'Punto marcado con coordenadas de la propiedad.' : 'Ubicación calculada desde la dirección registrada.'}</span>
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation size={16} />
                  Abrir ruta en Google Maps
                </a>
              </div>
            </div>
          </section>
        </main>

        <aside className="pd-sidebar">
          <div className="pd-agent-card">
            <div className="pd-agent-header">
              <div className="pd-agent-avatar">
                {property.agentName ? property.agentName.charAt(0).toUpperCase() : <UserRound size={24} />}
              </div>
              <div className="pd-agent-info">
                <div className="pd-agent-name">
                  {property.agentName ?? 'Asesor INTERSIM'}
                  <BadgeCheck size={16} className="pd-agent-verified" />
                </div>
                <div className="pd-agent-agency">{property.agentAgency ?? 'INTERSIM PropTech'}</div>
                <div className="pd-agent-rating"><Star size={13} /> Asesor verificado</div>
              </div>
            </div>

            <div className="pd-agent-actions">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="pd-btn pd-btn--primary">
                  <MessageCircle size={18} />
                  Contactar ahora
                </a>
              )}
              {agentPhone && (
                <a href={`tel:${agentPhone.replace(/\s/g, '')}`} className="pd-btn pd-btn--secondary">
                  <Phone size={18} />
                  {agentPhone}
                </a>
              )}
              {property.agentEmail && (
                <a href={`mailto:${property.agentEmail}`} className="pd-btn pd-btn--secondary">
                  <Mail size={18} />
                  Enviar correo
                </a>
              )}
            </div>
          </div>

          <div className="pd-confidence-card">
            <div className="pd-sidebar-title">
              <ShieldCheck size={18} />
              Validación de la publicación
            </div>
            <div className="pd-confidence-list">
              {confidenceItems.map((item) => (
                <div className="pd-confidence-item" key={item.title}>
                  <span className={item.ok ? 'is-ok' : ''}>
                    {item.ok ? <CheckCircle size={15} /> : <FileCheck2 size={15} />}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pd-mini-card">
            <div>
              <span>Precio publicado</span>
              <strong>{formatPrice(property.price, property.currency, property.operationType)}</strong>
            </div>
            {pricePerM2 && (
              <div>
                <span>Precio por m²</span>
                <strong>{pricePerM2}</strong>
              </div>
            )}
            <div>
              <span>Operación</span>
              <strong>{operationLabel}</strong>
            </div>
          </div>

          <div className="pd-contact-form-card">
            <div className="pd-sidebar-title">
              <MessageCircle size={18} />
              Solicitar información
            </div>
            {contactSent ? (
              <div className="pd-contact-success">
                <CheckCircle size={28} />
                <strong>¡Solicitud enviada!</strong>
                <p>El asesor te contactará pronto.</p>
                <button className="pd-btn pd-btn--ghost" onClick={() => setContactSent(false)}>Enviar otra consulta</button>
              </div>
            ) : (
              <form ref={formRef} className="pd-contact-form" onSubmit={(e) => { void handleContactSubmit(e); }}>
                {contactError && <div className="pd-contact-error">{contactError}</div>}
                <div className="pd-contact-row">
                  <input
                    className="pd-contact-input"
                    placeholder="Nombre *"
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm((f) => ({ ...f, firstName: e.target.value }))}
                    required
                  />
                  <input
                    className="pd-contact-input"
                    placeholder="Apellido *"
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm((f) => ({ ...f, lastName: e.target.value }))}
                    required
                  />
                </div>
                <input
                  className="pd-contact-input"
                  placeholder="Teléfono / WhatsApp"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                />
                <input
                  className="pd-contact-input"
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                />
                <textarea
                  className="pd-contact-textarea"
                  placeholder="¿Qué te gustaría saber sobre esta propiedad?"
                  rows={3}
                  value={contactForm.message}
                  onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                />
                <button type="submit" className="pd-btn pd-btn--primary pd-btn--full" disabled={contactSending}>
                  {contactSending ? <><Loader2 size={16} className="pd-spinner-sm" /> Enviando...</> : 'Enviar solicitud'}
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>

      {(whatsappUrl || agentPhone) && (
        <div className="pd-mobile-contact">
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="pd-btn pd-btn--primary">
              <MessageCircle size={18} />
              Consultar
            </a>
          )}
          {agentPhone && (
            <a href={`tel:${agentPhone.replace(/\s/g, '')}`} className="pd-btn pd-btn--secondary">
              <Phone size={18} />
              Llamar
            </a>
          )}
        </div>
      )}

      {lightbox && (
        <div className="pd-lightbox" onClick={() => setLightbox(false)}>
          <button className="pd-lightbox-close" onClick={() => setLightbox(false)} aria-label="Cerrar">×</button>
          {images.length > 1 && (
            <button className="pd-lightbox-nav pd-lightbox-nav--prev" onClick={(event) => { event.stopPropagation(); prevImg(); }} aria-label="Foto anterior">
              <ChevronLeft size={32} />
            </button>
          )}
          <img
            src={images[activeImg]}
            alt={property.title}
            className="pd-lightbox-img"
            onClick={(event) => event.stopPropagation()}
            onError={(event) => { (event.target as HTMLImageElement).src = '/properties_hero.png'; }}
          />
          {images.length > 1 && (
            <button className="pd-lightbox-nav pd-lightbox-nav--next" onClick={(event) => { event.stopPropagation(); nextImg(); }} aria-label="Foto siguiente">
              <ChevronRight size={32} />
            </button>
          )}
          <div className="pd-lightbox-counter">{activeImg + 1} / {images.length}</div>
        </div>
      )}
    </div>
  );
}
