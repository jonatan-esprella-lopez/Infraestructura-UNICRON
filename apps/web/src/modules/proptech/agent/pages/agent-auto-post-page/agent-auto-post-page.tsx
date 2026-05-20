import { useState, useEffect } from 'react';
import { Copy, Check, Eye, X, Facebook, Sparkles, Loader2, ImageOff } from 'lucide-react';
import { propertyService } from '@modules/proptech/services/property.service';
import type { Property } from '@modules/proptech/types/property.types';
import './agent-auto-post-page.css';

const OP_LABELS: Record<string, string> = {
  sale: 'Venta',
  rent: 'Alquiler',
  anticretico: 'Anticrético',
};

const TYPE_LABELS: Record<string, string> = {
  house: 'Casa',
  apartment: 'Departamento',
  land: 'Terreno',
  office: 'Oficina',
  commercial: 'Local Comercial',
  warehouse: 'Almacén',
  parking: 'Estacionamiento',
};

function formatPrice(price: number | undefined, currency: string | undefined) {
  if (!price) return 'Consultar precio';
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function buildFbPost(property: Property): string {
  const price = formatPrice(property.price, property.currency);
  const opLabel = OP_LABELS[property.operationType] ?? property.operationType ?? 'Venta';
  const typeLabel = TYPE_LABELS[property.propertyType] ?? property.propertyType ?? 'Propiedad';
  const location = [property.zone, property.city].filter(Boolean).join(', ') || property.address || 'Bolivia';
  const beds = property.bedrooms ? `🛏️ ${property.bedrooms} dorm.` : '';
  const baths = property.bathrooms ? `  🚿 ${property.bathrooms} baños` : '';
  const area = property.areaTotal ? `  📐 ${property.areaTotal} m²` : '';

  return `🏡✨ ${opLabel.toUpperCase()} — ${property.title} ✨🏡

💰 Precio: ${price}
📍 Ubicación: ${location}
${[beds, baths, area].filter(Boolean).join('')}
🏗️ ${typeLabel}

——————————————————
✅ ¿QUÉ INCLUYE?
• Documentación completa y folio real al día
• Zona residencial con excelente plusvalía
• Acabados de calidad y espacios bien distribuidos
• Acceso a colegios, comercios y vías principales
——————————————————

🔑 ¿POR QUÉ ES UNA BUENA INVERSIÓN?
Esta propiedad combina ubicación privilegiada, seguridad jurídica y precio competitivo. Ideal para vivir, invertir o generar renta mensual desde el primer mes.

📲 Escríbeme al inbox o WhatsApp para más fotos, video tour y visita presencial sin compromiso.

🏢 Agente certificado | WASI PropTech Bolivia
——————————————————
#${property.city ?? 'Bolivia'} #BienesRaices #InmuebleBolivia #${opLabel.replace(/\s/g, '')} #PropTech #WASI`;
}

interface PostModalProps {
  property: Property;
  onClose: () => void;
}

function PostModal({ property, onClose }: PostModalProps) {
  const [copied, setCopied] = useState(false);
  const text = buildFbPost(property);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="aap-modal-backdrop" onClick={onClose}>
      <div className="aap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="aap-modal-header">
          <div className="aap-modal-title">
            <Facebook size={18} className="aap-fb-icon" />
            <span>Post para Facebook Marketplace</span>
          </div>
          <button className="aap-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="aap-modal-property-info">
          {property.imageUrls?.[0] ? (
            <img src={property.imageUrls[0]} alt={property.title} className="aap-modal-thumb" />
          ) : (
            <div className="aap-modal-thumb aap-modal-thumb--empty"><ImageOff size={20} /></div>
          )}
          <div>
            <div className="aap-modal-prop-title">{property.title}</div>
            <div className="aap-modal-prop-price">{formatPrice(property.price, property.currency)}</div>
          </div>
        </div>

        <div className="aap-modal-text-wrapper">
          <pre className="aap-modal-text">{text}</pre>
        </div>

        <div className="aap-modal-footer">
          <button className="aap-btn aap-btn--ghost" onClick={onClose}>Cerrar</button>
          <button className="aap-btn aap-btn--copy" onClick={handleCopy}>
            {copied ? <><Check size={16} /> Copiado</> : <><Copy size={16} /> Copiar texto</>}
          </button>
        </div>
      </div>
    </div>
  );
}

interface PropertyCardProps {
  property: Property;
  onPreview: () => void;
  onCopy: () => void;
  copied: boolean;
}

function PropertyCard({ property, onPreview, onCopy, copied }: PropertyCardProps) {
  const image = property.imageUrls?.[0];
  const price = formatPrice(property.price, property.currency);
  const opLabel = OP_LABELS[property.operationType] ?? property.operationType;

  return (
    <div className="aap-card">
      <div className="aap-card-img">
        {image ? (
          <img src={image} alt={property.title} />
        ) : (
          <div className="aap-card-img--empty"><ImageOff size={28} /></div>
        )}
        {opLabel && <span className="aap-card-badge">{opLabel}</span>}
      </div>
      <div className="aap-card-body">
        <div className="aap-card-title">{property.title}</div>
        <div className="aap-card-price">{price}</div>
        {property.city && <div className="aap-card-city">📍 {property.city}</div>}
      </div>
      <div className="aap-card-actions">
        <button className="aap-btn aap-btn--preview" onClick={onPreview}>
          <Eye size={15} /> Ver descripción
        </button>
        <button className="aap-btn aap-btn--copy" onClick={onCopy}>
          {copied ? <><Check size={15} /> Copiado</> : <><Copy size={15} /> Copiar</>}
        </button>
      </div>
    </div>
  );
}

export function AgentAutoPostPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Property | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    propertyService
      .findAll({ limit: 50, offset: 0 })
      .then((res) => setProperties(res.items))
      .catch(() => setError('No se pudieron cargar las propiedades'))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = async (property: Property) => {
    await navigator.clipboard.writeText(buildFbPost(property));
    setCopiedId(property.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="aap-page">
      {preview && <PostModal property={preview} onClose={() => setPreview(null)} />}

      <header className="aap-header">
        <div className="aap-header-icon"><Sparkles size={22} /></div>
        <div>
          <h1 className="aap-header-title">Auto Generaciones</h1>
          <p className="aap-header-sub">
            Genera y copia posts listos para Facebook Marketplace con un solo clic
          </p>
        </div>
        <div className="aap-header-badge">
          <Facebook size={14} />
          <span>Marketplace</span>
        </div>
      </header>

      {loading && (
        <div className="aap-state">
          <Loader2 className="aap-spinner" size={36} />
          <span>Cargando propiedades...</span>
        </div>
      )}

      {error && <div className="aap-error">{error}</div>}

      {!loading && !error && properties.length === 0 && (
        <div className="aap-state">
          <ImageOff size={48} opacity={0.3} />
          <p>No tienes propiedades asignadas aún.</p>
        </div>
      )}

      {!loading && properties.length > 0 && (
        <div className="aap-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onPreview={() => setPreview(property)}
              onCopy={() => handleCopy(property)}
              copied={copiedId === property.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
