import { useState } from "react";
import type { LandValuationInput } from "../../types/land-valuation.types";
import type { ValuationFormProps } from "./valuation-form.types";
import "./valuation-form.css";

const initialFormState: LandValuationInput = {
  city: "Cochabamba",
  municipality: "",
  zone: "",
  neighborhood: "",

  surfaceM2: 0,
  frontMeters: undefined,
  depthMeters: undefined,

  isCornerLot: false,
  isOnMainAvenue: false,
  roadType: "unknown",
  landUseType: "unknown",

  hasWater: false,
  hasElectricity: false,
  hasSewerage: false,
  hasGas: false,
  hasInternetAccess: false,

  legalStatus: "unknown",
  hasFolioReal: false,
  hasApprovedPlan: false,
  taxesUpToDate: false,

  latitude: undefined,
  longitude: undefined,

  requestedPrice: undefined,
  currency: "USD",
};

export function ValuationForm({
  isLoading = false,
  onSubmit,
  onReset,
}: ValuationFormProps) {
  const [form, setForm] = useState<LandValuationInput>(initialFormState);

  const updateField = <K extends keyof LandValuationInput>(
    field: K,
    value: LandValuationInput[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
  };

  const handleReset = () => {
    setForm(initialFormState);
    onReset?.();
  };

  return (
    <form className="valuation-form" onSubmit={handleSubmit}>
      <div className="valuation-form__section">
        <h2 className="valuation-form__section-title">Ubicación</h2>

        <label className="valuation-form__field">
          <span className="valuation-form__label">Ciudad</span>
          <input
            className="valuation-form__input"
            value={form.city}
            onChange={(event) => updateField("city", event.target.value)}
          />
        </label>

        <label className="valuation-form__field">
          <span className="valuation-form__label">Municipio</span>
          <input
            className="valuation-form__input"
            placeholder="Ej: Cercado, Sacaba, Tiquipaya"
            value={form.municipality}
            onChange={(event) =>
              updateField("municipality", event.target.value)
            }
          />
        </label>

        <label className="valuation-form__field">
          <span className="valuation-form__label">Zona</span>
          <input
            className="valuation-form__input"
            placeholder="Ej: Cala Cala, Queru Queru, Coña Coña"
            value={form.zone}
            onChange={(event) => updateField("zone", event.target.value)}
          />
        </label>
      </div>

      <div className="valuation-form__section">
        <h2 className="valuation-form__section-title">Características</h2>

        <label className="valuation-form__field">
          <span className="valuation-form__label">Superficie m²</span>
          <input
            className="valuation-form__input"
            type="number"
            min="1"
            value={form.surfaceM2 || ""}
            onChange={(event) =>
              updateField("surfaceM2", Number(event.target.value))
            }
          />
        </label>

        <label className="valuation-form__field">
          <span className="valuation-form__label">Frente en metros</span>
          <input
            className="valuation-form__input"
            type="number"
            value={form.frontMeters ?? ""}
            onChange={(event) =>
              updateField(
                "frontMeters",
                event.target.value ? Number(event.target.value) : undefined
              )
            }
          />
        </label>

        <label className="valuation-form__field">
          <span className="valuation-form__label">Fondo en metros</span>
          <input
            className="valuation-form__input"
            type="number"
            value={form.depthMeters ?? ""}
            onChange={(event) =>
              updateField(
                "depthMeters",
                event.target.value ? Number(event.target.value) : undefined
              )
            }
          />
        </label>

        <label className="valuation-form__field">
          <span className="valuation-form__label">Tipo de vía</span>
          <select
            className="valuation-form__select"
            value={form.roadType}
            onChange={(event) =>
              updateField(
                "roadType",
                event.target.value as LandValuationInput["roadType"]
              )
            }
          >
            <option value="unknown">No especificado</option>
            <option value="main_avenue">Avenida principal</option>
            <option value="paved_street">Calle asfaltada</option>
            <option value="secondary_road">Vía secundaria</option>
            <option value="dirt_road">Camino de tierra</option>
          </select>
        </label>

        <label className="valuation-form__field">
          <span className="valuation-form__label">Uso de suelo</span>
          <select
            className="valuation-form__select"
            value={form.landUseType}
            onChange={(event) =>
              updateField(
                "landUseType",
                event.target.value as LandValuationInput["landUseType"]
              )
            }
          >
            <option value="unknown">No especificado</option>
            <option value="residential">Residencial</option>
            <option value="commercial">Comercial</option>
            <option value="mixed">Mixto</option>
            <option value="industrial">Industrial</option>
            <option value="agricultural">Agrícola</option>
          </select>
        </label>

        <div className="valuation-form__checkbox-group">
          <label className="valuation-form__checkbox">
            <input
              type="checkbox"
              checked={form.isCornerLot}
              onChange={(event) =>
                updateField("isCornerLot", event.target.checked)
              }
            />
            <span>Terreno en esquina</span>
          </label>

          <label className="valuation-form__checkbox">
            <input
              type="checkbox"
              checked={form.isOnMainAvenue}
              onChange={(event) =>
                updateField("isOnMainAvenue", event.target.checked)
              }
            />
            <span>Sobre avenida principal</span>
          </label>
        </div>
      </div>

      <div className="valuation-form__section">
        <h2 className="valuation-form__section-title">Servicios básicos</h2>

        <div className="valuation-form__checkbox-grid">
          {[
            ["hasWater", "Agua"],
            ["hasElectricity", "Luz"],
            ["hasSewerage", "Alcantarillado"],
            ["hasGas", "Gas"],
            ["hasInternetAccess", "Internet"],
          ].map(([field, label]) => (
            <label className="valuation-form__checkbox" key={field}>
              <input
                type="checkbox"
                checked={Boolean(form[field as keyof LandValuationInput])}
                onChange={(event) =>
                  updateField(
                    field as keyof LandValuationInput,
                    event.target.checked as never
                  )
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="valuation-form__section">
        <h2 className="valuation-form__section-title">Documentación</h2>

        <label className="valuation-form__field">
          <span className="valuation-form__label">Estado legal</span>
          <select
            className="valuation-form__select"
            value={form.legalStatus}
            onChange={(event) =>
              updateField(
                "legalStatus",
                event.target.value as LandValuationInput["legalStatus"]
              )
            }
          >
            <option value="unknown">No especificado</option>
            <option value="complete_documents">Documentos completos</option>
            <option value="in_process">Documentos en proceso</option>
            <option value="incomplete">Documentos incompletos</option>
            <option value="has_risk">Con riesgo legal</option>
          </select>
        </label>

        <div className="valuation-form__checkbox-grid">
          <label className="valuation-form__checkbox">
            <input
              type="checkbox"
              checked={form.hasFolioReal}
              onChange={(event) =>
                updateField("hasFolioReal", event.target.checked)
              }
            />
            <span>Folio real</span>
          </label>

          <label className="valuation-form__checkbox">
            <input
              type="checkbox"
              checked={form.hasApprovedPlan}
              onChange={(event) =>
                updateField("hasApprovedPlan", event.target.checked)
              }
            />
            <span>Plano aprobado</span>
          </label>

          <label className="valuation-form__checkbox">
            <input
              type="checkbox"
              checked={form.taxesUpToDate}
              onChange={(event) =>
                updateField("taxesUpToDate", event.target.checked)
              }
            />
            <span>Impuestos al día</span>
          </label>
        </div>
      </div>

      <div className="valuation-form__actions">
        <button
          className="valuation-form__button valuation-form__button--secondary"
          type="button"
          onClick={handleReset}
          disabled={isLoading}
        >
          Limpiar
        </button>

        <button
          className="valuation-form__button valuation-form__button--primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Calculando..." : "Calcular valor"}
        </button>
      </div>
    </form>
  );
}
