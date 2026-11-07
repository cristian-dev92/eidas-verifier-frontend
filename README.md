# EUDI Verifier — Frontend

Aplicación web (Angular 21) para la verificación de edad basada en el estándar **eIDAS 2.0** y **OpenID4VP**. Actúa como panel del verificador y, en desarrollo, incluye un simulador de EUDI Wallet.

## Características

- Panel de verificación que solicita un *challenge* OpenID4VP (nonce + URI) y muestra un **QR real**.
- Simulador de wallet que **pide al emisor una credencial SD-JWT firmada real** y la presenta (solo en desarrollo).
- Tema claro/oscuro persistente.
- Internacionalización ES/EN con diccionario propio.
- Notificaciones toast globales.
- Configuración por entornos (desarrollo/producción).

## Stack

- Angular 21 (standalone components + signals)
- TypeScript 5.9
- SCSS
- Vitest / Angular unit-test builder

## Estructura

```
src/
  app/
    components/          # Dashboard y simulador de wallet
    services/            # API, notificaciones, tema e idioma
    app.ts|html|scss     # Shell de la aplicación (navbar + toast)
    app.routes.ts
  environments/
    environment.ts       # Desarrollo
    environment.prod.ts  # Producción
```

## Requisitos

- Node.js 20+ y npm 11+
- Backend `eudi-verifier` en ejecución (por defecto `http://localhost:8080`)

## Desarrollo local

```bash
npm install
npm start
```

La app queda en `http://localhost:4200/`.

La URL del backend se configura en `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  showWalletSimulator: true
};
```

## Build de producción

```bash
npm run build
```

El resultado se genera en `dist/eudi-frontend/browser`.

En producción, `angular.json` reemplaza `environment.ts` por `environment.prod.ts`. Edita ahí:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://TU-BACKEND.onrender.com/api',
  showWalletSimulator: false
};
```

## Despliegue en Vercel

El repo incluye `vercel.json` con:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist/eudi-frontend/browser`
- rewrite SPA a `index.html`

Pasos:

1. Importa el repositorio en Vercel.
2. Framework preset: **Angular** (o "Other" respetando `vercel.json`).
3. Verifica que `apiUrl` de `environment.prod.ts` apunta al backend en Render.
4. En Render, añade el dominio de Vercel a `APP_CORS_ALLOWED_ORIGINS`.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm start` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run watch` | Build en modo watch |
| `npm test` | Tests unitarios |

## Seguridad

- No se suben secretos al repositorio (`.env`, `.vercel`, `node_modules`, `dist` están en `.gitignore`).
- El simulador de wallet está desactivado en producción mediante `showWalletSimulator`.
- Los mensajes del backend se muestran traducidos a partir de `messageCode`.
