# Índice de documentos legales — `docs/legalities/`

Documentación legal del proyecto UNICRON: contratos tipificados y marcos normativos que regulan las operaciones inmobiliarias en Bolivia.

---

## Mapa de relaciones entre archivos

```
codigoCivilBolivia.pdf                      codigoProcesalCivil.pdf
       │                                           │
       │ (arts. 585, obligaciones,                 │ (procedimiento de
       │  dominio, capacidad)                      │  ejecución de contratos)
       ├────────────┴─────────────┐               │
       │                          │               │
Contrato_VentaConArras.doc   Contrato_ReservaPropiedades.doc
["Venta con Reserva de
Propiedad / Arras"]          ["Venta con Reserva de Propiedad"]
       │                          └───────────┐
       │ (igualmente Art. 585 Código Civil) ──┤
Contrato_VentaDirecta.doc                    Contrato_MedianteIntermediario.doc
["Venta Definitiva Directa"]   ["Venta mediante Apoderado/Intermediario"]
       │
AlquilerInmueble.doc          Aticretico.doc
["Arrendamiento"]              ["Anticrésis"]

CompraVenta.jpeg              VisitacionMinutas.jpeg
["Ejemplo de acta de venta"]  ["Actas de inspección/visita"]
        └───── complementan visualmente los modelos contractuales ─────┘
```

---

## Resumen de cruces normativos clave

| Documento | Cita legal explícita | Regulado por |
|---|---|---|
| Contrato_VentaConArras.doc | Art. 585 Código Civil | codigoCivilBolivia.pdf |
| Contrato_ReservaPropiedades.doc | Art. 585 Código Civil | codigoCivilBolivia.pdf |
| AlquilerInmueble.doc | Código Civil (obligaciones) | codigoCivilBolivia.pdf |
| Todos los contratos | "autoridad llamada por ley" | codigoProcesalCivil.pdf |
| Aticretico.doc | Código Civil (anticrésis) | codigoCivilBolivia.pdf |

---

## Flujo de documentos según tipo de operación

### Operación: Venta a plazos con reserva de dominio
1. Codificar las cláusulas usando **Contrato_VentaConArras.doc** o **Contrato_ReservaPropiedades.doc** (modelo base)
2. Aplicar el régimen del **Art. 585** definido en **codigoCivilBolivia.pdf**
3. Incluir **VisitacionMinutas.jpeg** como previa de estado del inmueble
4. Registrar en Derechos Reales; ejecutar por **codigoProcesalCivil.pdf** en caso de incumplimiento

### Operación: Venta directa y total
1. Usar **Contrato_VentaDirecta.doc**
2. Opcional: usar **Contrato_MedianteIntermediario.doc** cuando el vendedor actúe por apoderado
3. Incluir **VisitacionMinutas.jpeg** para el estado de entrega
4. Cerrado con **CompraVenta.jpeg** (última evidencia)

### Operación: Alquiler / arrendamiento
1. Usar **AlquilerInmueble.doc**
2. Anotar fecha y estado de medidores en **VisitacionMinutas.jpeg**
3. Resolver por **codigoProcesalCivil.pdf** en caso de resolución del contrato

### Operación: Anticrésis
1. Usar **Aticretico.doc**
2. Documentar entrega del bien en **VisitacionMinutas.jpeg**
3. Código Civil define todas las obligaciones sustantivas