import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Camera,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileClock,
  FileUp,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  WalletCards,
} from 'lucide-react';
import type { AppUser } from '@core/types/auth.types';
import { Button } from '@shared/components/ui/button';
import { useRootStore } from '@store/root-store';
import './client-profile-page.css';

type DocumentStatus = 'uploaded' | 'review' | 'pending';

interface PurchaseDocument {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  fileName?: string;
  updatedAt?: string;
}

interface ClientProfile {
  fullName: string;
  email: string;
  phone: string;
  documentId: string;
  city: string;
  preferredZones: string;
  budgetRange: string;
  purchaseStage: string;
  contactPreference: string;
  notes: string;
  avatarUrl?: string;
  documents: PurchaseDocument[];
  updatedAt?: string;
}

type ProfileField =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'documentId'
  | 'city'
  | 'preferredZones'
  | 'budgetRange'
  | 'purchaseStage'
  | 'contactPreference'
  | 'notes';

const DEFAULT_DOCUMENTS: PurchaseDocument[] = [
  {
    id: 'identity',
    title: 'Carnet de identidad',
    description: 'Anverso y reverso del comprador o apoderado.',
    status: 'uploaded',
    fileName: 'ci-ana-lopez.pdf',
    updatedAt: '2026-05-15T10:00:00.000Z',
  },
  {
    id: 'funds',
    title: 'Respaldo de fondos',
    description: 'Preaprobacion bancaria, extracto o carta financiera.',
    status: 'review',
    fileName: 'preaprobacion-banco.pdf',
    updatedAt: '2026-05-14T16:30:00.000Z',
  },
  {
    id: 'reserve',
    title: 'Contrato de reserva',
    description: 'Documento asociado a la propiedad elegida.',
    status: 'pending',
  },
  {
    id: 'property-papers',
    title: 'Papeles de la propiedad',
    description: 'Folio real, impuestos y minuta preliminar cuando aplique.',
    status: 'pending',
  },
];

const STATUS_META = {
  uploaded: { label: 'Cargado', icon: FileCheck2 },
  review: { label: 'En revision', icon: FileClock },
  pending: { label: 'Pendiente', icon: FileUp },
} satisfies Record<DocumentStatus, { label: string; icon: typeof FileCheck2 }>;

function storageKey(userId: string) {
  return `intersim.client-profile.${userId}`;
}

function mergeDocuments(savedDocuments?: PurchaseDocument[]) {
  return DEFAULT_DOCUMENTS.map((document) => {
    const saved = savedDocuments?.find((item) => item.id === document.id);
    return saved ? { ...document, ...saved } : document;
  });
}

function createDefaultProfile(user: AppUser): ClientProfile {
  return {
    fullName: user.name || 'Ana Lopez',
    email: user.email || 'cliente@intersim.bo',
    phone: '+591 700 14567',
    documentId: 'CI 6589214 SC',
    city: 'Santa Cruz',
    preferredZones: 'Equipetrol, Urubo, Sirari',
    budgetRange: 'USD 180.000 - 250.000',
    purchaseStage: 'Buscando propiedad verificada para compra',
    contactPreference: 'WhatsApp',
    notes: 'Casa familiar con buena plusvalia, documentacion saneada y disponibilidad para visita en fin de semana.',
    avatarUrl: user.avatarUrl,
    documents: DEFAULT_DOCUMENTS,
  };
}

function loadProfile(user: AppUser): ClientProfile {
  const defaults = createDefaultProfile(user);
  try {
    const raw = localStorage.getItem(storageKey(user.id));
    if (!raw) return defaults;

    const saved = JSON.parse(raw) as Partial<ClientProfile>;
    return {
      ...defaults,
      ...saved,
      avatarUrl: saved.avatarUrl ?? user.avatarUrl ?? defaults.avatarUrl,
      documents: mergeDocuments(saved.documents),
    };
  } catch {
    return defaults;
  }
}

function formatDate(value?: string) {
  if (!value) return 'Sin cargar';
  return new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(value),
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'CL';
}

export function ClientProfilePage() {
  const { currentUser, setCurrentUser } = useRootStore();
  const [profile, setProfile] = useState<ClientProfile>(() => loadProfile(currentUser));
  const [savedMessage, setSavedMessage] = useState('');

  const completion = useMemo(() => {
    const checks = [
      Boolean(profile.avatarUrl),
      Boolean(profile.fullName.trim()),
      Boolean(profile.email.trim()),
      Boolean(profile.phone.trim()),
      Boolean(profile.documentId.trim()),
      Boolean(profile.city.trim()),
      Boolean(profile.preferredZones.trim()),
      Boolean(profile.budgetRange.trim()),
      profile.documents.some((document) => document.status !== 'pending'),
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  const uploadedDocuments = profile.documents.filter((document) => document.status !== 'pending').length;

  const updateField = (field: ProfileField, value: string) => {
    setSavedMessage('');
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      setSavedMessage('');
      setProfile((current) => ({ ...current, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentUpload = (documentId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSavedMessage('');
    setProfile((current) => ({
      ...current,
      documents: current.documents.map((document) =>
        document.id === documentId
          ? {
              ...document,
              fileName: file.name,
              status: document.status === 'uploaded' ? 'uploaded' : 'review',
              updatedAt: new Date().toISOString(),
            }
          : document,
      ),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextProfile = { ...profile, updatedAt: new Date().toISOString() };
    setProfile(nextProfile);
    localStorage.setItem(storageKey(currentUser.id), JSON.stringify(nextProfile));
    setCurrentUser({
      ...currentUser,
      name: nextProfile.fullName,
      email: nextProfile.email,
      avatarUrl: nextProfile.avatarUrl,
    });
    setSavedMessage('Perfil actualizado');
  };

  return (
    <section className="client-profile">
      <header className="client-profile__hero">
        <div className="client-profile__hero-copy">
          <p className="client-profile__eyebrow">Perfil del cliente</p>
          <h2 className="client-profile__title">Datos y expediente personal</h2>
          <p className="client-profile__subtitle">
            Mantiene tu informacion de contacto, preferencias de compra y papeles de la operacion en un solo lugar.
          </p>
        </div>

        <div className="client-profile__completion" aria-label={`Perfil al ${completion}%`}>
          <span className="client-profile__completion-value">{completion}%</span>
          <div className="client-profile__meter">
            <span style={{ width: `${completion}%` }} />
          </div>
          <small>Perfil listo para matching y revision legal</small>
        </div>
      </header>

      <div className="client-profile__summary-grid">
        <div className="client-profile__summary-item">
          <UserRound size={18} />
          <span>Cliente verificado</span>
        </div>
        <div className="client-profile__summary-item">
          <ClipboardList size={18} />
          <span>{uploadedDocuments} de {profile.documents.length} documentos</span>
        </div>
        <div className="client-profile__summary-item">
          <WalletCards size={18} />
          <span>{profile.budgetRange}</span>
        </div>
        <div className="client-profile__summary-item">
          <ShieldCheck size={18} />
          <span>Expediente protegido</span>
        </div>
      </div>

      <div className="client-profile__workspace">
        <aside className="client-profile__identity">
          <div className="client-profile__avatar">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={`Foto de ${profile.fullName}`} />
            ) : (
              <span>{getInitials(profile.fullName)}</span>
            )}
          </div>

          <label className="client-profile__avatar-action">
            <Camera size={16} />
            <span>Cambiar foto</span>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </label>

          <div className="client-profile__identity-copy">
            <h3>{profile.fullName}</h3>
            <p>{profile.purchaseStage}</p>
          </div>

          <div className="client-profile__contact-list">
            <span><Mail size={15} /> {profile.email}</span>
            <span><Phone size={15} /> {profile.phone}</span>
            <span><MapPin size={15} /> {profile.city}</span>
          </div>
        </aside>

        <form className="client-profile__form" onSubmit={handleSubmit}>
          <div className="client-profile__section-head">
            <div>
              <h3>Informacion personal</h3>
              <p>Datos visibles para agentes, documentos y seguimiento de compra.</p>
            </div>
            <Button type="submit" icon={<Save size={16} />}>
              Guardar
            </Button>
          </div>

          <div className="client-profile__fields">
            <label>
              Nombre completo
              <input value={profile.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
            </label>
            <label>
              Correo
              <input type="email" value={profile.email} onChange={(event) => updateField('email', event.target.value)} />
            </label>
            <label>
              Telefono
              <input value={profile.phone} onChange={(event) => updateField('phone', event.target.value)} />
            </label>
            <label>
              Documento
              <input value={profile.documentId} onChange={(event) => updateField('documentId', event.target.value)} />
            </label>
            <label>
              Ciudad
              <input value={profile.city} onChange={(event) => updateField('city', event.target.value)} />
            </label>
            <label>
              Contacto preferido
              <select value={profile.contactPreference} onChange={(event) => updateField('contactPreference', event.target.value)}>
                <option>WhatsApp</option>
                <option>Correo</option>
                <option>Llamada</option>
              </select>
            </label>
          </div>

          <div className="client-profile__section-head client-profile__section-head--compact">
            <div>
              <h3>Preferencias de compra</h3>
              <p>Informacion que alimenta recomendaciones y filtros de agentes.</p>
            </div>
          </div>

          <div className="client-profile__fields client-profile__fields--wide">
            <label>
              Zonas de interes
              <input value={profile.preferredZones} onChange={(event) => updateField('preferredZones', event.target.value)} />
            </label>
            <label>
              Presupuesto
              <input value={profile.budgetRange} onChange={(event) => updateField('budgetRange', event.target.value)} />
            </label>
            <label>
              Etapa actual
              <select value={profile.purchaseStage} onChange={(event) => updateField('purchaseStage', event.target.value)}>
                <option>Buscando propiedad verificada para compra</option>
                <option>Comparando propiedades favoritas</option>
                <option>Negociando oferta</option>
                <option>Preparando firma y papeles</option>
              </select>
            </label>
            <label className="client-profile__textarea">
              Notas para el agente
              <textarea
                rows={4}
                value={profile.notes}
                onChange={(event) => updateField('notes', event.target.value)}
              />
            </label>
          </div>

          {savedMessage && (
            <div className="client-profile__saved">
              <CheckCircle2 size={16} />
              <span>{savedMessage}</span>
            </div>
          )}
        </form>
      </div>

      <section className="client-profile__documents">
        <div className="client-profile__section-head">
          <div>
            <h3>Expediente de compra</h3>
            <p>Papeles relacionados con la compra, reserva y validacion legal.</p>
          </div>
          <span className="client-profile__document-count">{uploadedDocuments}/{profile.documents.length}</span>
        </div>

        <div className="client-profile__document-grid">
          {profile.documents.map((document) => {
            const meta = STATUS_META[document.status];
            const StatusIcon = meta.icon;

            return (
              <article key={document.id} className={`client-profile__document client-profile__document--${document.status}`}>
                <div className="client-profile__document-top">
                  <span className="client-profile__document-icon">
                    <StatusIcon size={17} />
                  </span>
                  <span className="client-profile__document-status">{meta.label}</span>
                </div>
                <h4>{document.title}</h4>
                <p>{document.description}</p>
                <div className="client-profile__document-meta">
                  <span>{document.fileName ?? 'Archivo no cargado'}</span>
                  <small>{formatDate(document.updatedAt)}</small>
                </div>
                <label className="client-profile__document-action">
                  <FileUp size={15} />
                  <span>Subir archivo</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(event) => handleDocumentUpload(document.id, event)}
                  />
                </label>
              </article>
            );
          })}
        </div>
      </section>

      <section className="client-profile__next">
        <div>
          <h3>Mejoras utiles para esta zona</h3>
          <p>Un perfil mas completo permite priorizar propiedades, alertas y documentos por etapa.</p>
        </div>
        <div className="client-profile__next-grid">
          <span>Alertas de vencimiento de reservas</span>
          <span>Validacion legal por cada documento</span>
          <span>Historial de ofertas y contraofertas</span>
          <span>Preferencias IA por familia, inversion o alquiler</span>
        </div>
      </section>
    </section>
  );
}
