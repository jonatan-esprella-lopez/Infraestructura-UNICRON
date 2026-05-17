# Lógica de Funcionamiento — UNICRON / CasaLens

## ¿Qué es?

CasaLens es una plataforma de inteligencia artificial para el mercado inmobiliario boliviano. Integra cuatro herramientas en un solo lugar para ayudarle a agentes, compradores, vendedores y abogados a gestionar operaciones inmobiliarias de forma más rápida y segura.

---

## Los 4 componentes principales

### 1. Calificador de Leads

Un usuario escribe a un bot de Telegram como si hablara con una asesora. El bot le hace entre 4 y 6 preguntas naturales para entender qué busca:

- ¿Qué tipo de operación? (alquiler, anticrético o compraventa)
- ¿Cuánto tiene de presupuesto?
- ¿En qué zona de la ciudad?
- ¿Cuántos dormitorios necesita?
- ¿Qué tan urgido está?

Una vez que tiene toda la información, el bot le envía el enlace al panel web con las recomendaciones listas. Toda la conversación se guarda automáticamente en la base de datos.

---

### 2. Buscador de Propiedades (con coincidencia inteligente)

Cuando se carga un perfil de cliente, el sistema busca entre todas las propiedades disponibles y devuelve las 5 que mejor encajan. Lo hace en dos pasos:

1. **Filtra** las propiedades por presupuesto, zona y cantidad de dormitorios.
2. **Las ordena** por nivel de ajuste al perfil usando inteligencia artificial, y explica con una frase corta por qué cada una es una buena opción.

### 3. Revisor de Contratos

El usuario pega o sube un contrato inmobiliario y el sistema lo analiza automáticamente. Identifica tres tipos de hallazgos:

- 🔴 **Rojo** — cláusulas ilegales o abusivas (por ejemplo: entrada al inmueble sin aviso, garantías excesivas, falta de inscripción en Derechos Reales en un anticrético).
- 🟡 **Amarillo** — cláusulas confusas o que conviene negociar.
- 🟢 **Verde** — cláusulas correctamente redactadas.
- 📋 **Faltantes** — elementos legalmente obligatorios que no aparecen en el documento.

El análisis se basa en el Código Civil boliviano, incluyendo artículos específicos como el 1540 y el 1429.

### 4. Asesor Financiero

El usuario conversa por la web sobre su situación económica y recibe una evaluación de si está en condiciones de acceder a la operación que desea. El sistema tiene acceso a información legal y financiera relevante de Bolivia (Infocenter, Folio Real, criterios de ASFI, etc.) para responder con precisión. Devuelve un veredicto:

- ✅ Apto
- ⚠️ Condicionado
- ❌ No apto

Y explica los motivos, el puntaje, el máximo crédito que podría acceder y recomendaciones concretas.

---

## ¿Cómo se conecta todo?

```
Usuario ── escribe ──▶ Telegram ──▶ Calificador de Leads (IA)
                                        │ guarda perfil
                                        ▼
                                    Base de Datos
                                   /        \
               Web (panel) ── Buscador    Revisor de Contratos
               leer perfil   de Props       (IA analiza el contrato)
               y ver matches  (IA)              y devuelve
                                    ▲           alertas
                                    │
                            Asesor Financiero (IA)
                          evalúa la situación económica
```

1. El usuario inicia una conversación por Telegram → el calificador le pregunta lo que necesite → guarda su perfil.
2. El usuario abre el panel web → ve propiedades recomendadas según su perfil.
3. El usuario puede subir un contrato → el revisor le devuelve un análisis detallado.
4. El usuario puede preguntar sobre su situación financiera → el asesor evalúa y responde con contexto legal boliviano.

---

## La Base de Datos

Guarda cuatro tipos de información, todo en un solo lugar:

| Lo que guarda | Para qué sirve |
|---|---|
| Perfiles de leads | Recordar qué busca cada cliente |
| Propiedades con vectores | Buscar por similitud de texto (embeddings) |
| Documentos financieros de referencia | El asesor lee de aquí cuando responde |
| Perfiles financieros de usuarios | Historial de evaluaciones |

---

## El panel web

Es una página web donde el usuario puede:
- Ver las propiedades recomendadas para su caso
- Analizar un contrato
- Conversar con el asesor financiero

Todo sin necesidad de conocimientos técnicos.

---

## Planes y precios

Dirigido a agentes inmobiliarios. Se puede pagar por tarjeta o por QR y transferencia. Todos los planes se renuevan automáticamente cada mes y se pueden cancelar en cualquier momento.

### Básico — $40/mes

- 5 propiedades activas
- Agente IA para contratos
- Reportes mensuales
- Perfil de agente verificado

### Platino — $60/mes ⭐ más popular

- 10 propiedades activas
- Agente IA avanzado para contratos
- Reportes semanales
- Recomendaciones IA a clientes
- Perfil destacado en búsquedas

### Diamante — $100/mes

- 15 propiedades activas
- Agente IA completo
- Reportes semanales + analítica avanzada
- Recomendaciones IA premium
- CRM integrado y campañas de marketing
- Badge de Agente Premium

---

## ¿De dónde saca la información legal?

El sistema tiene incorporado un repositorio de documentos legales bolivianos: modelos de contrato de alquiler, anticrético, compraventa directa, compraventa con reserva de dominio y venta por intermediario, además del Código Civil y el Código Procesal Civil. Esta información es la base tanto del revisor de contratos como del asesor financiero.
