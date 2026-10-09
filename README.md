# MCU Marathon Tracker

Tracker React + Vite + Tailwind CSS + Firebase Firestore para registrar 37 películas del UCM.

## Arquitectura

```text
mcu-marathon-tracker/
├─ public/
│  ├─ icon.svg
│  ├─ manifest.webmanifest
│  ├─ maskable-icon.svg
│  └─ sw.js
├─ src/
│  ├─ components/
│  │  ├─ Dashboard.jsx
│  │  ├─ MovieCard.jsx
│  │  ├─ MovieGrid.jsx
│  │  ├─ ProgressRing.jsx
│  │  ├─ StatCard.jsx
│  │  ├─ SyncBadge.jsx
│  │  └─ Toolbar.jsx
│  ├─ data/
│  │  └─ mcuMovies.js
│  ├─ hooks/
│  │  └─ useMcuProgress.js
│  ├─ lib/
│  │  └─ firebase.js
│  ├─ services/
│  │  └─ progressStorage.js
│  ├─ utils/
│  │  ├─ format.js
│  │  └─ progress.js
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ .env.example
├─ firebase.json
├─ firestore.rules
├─ index.html
├─ package.json
└─ vite.config.js
```

## Requisitos

- Node.js 20.19+ (o 22.12+).
- npm.
- Un proyecto de Firebase para sincronización en nube.

## Instalación local

```bash
npm install
npm run dev
```

Vite mostrará una URL como `http://localhost:5173`.

## Firebase

1. Crea un proyecto en Firebase Console.
2. Registra una aplicación Web.
3. Copia la configuración de la aplicación Web.
4. Habilita Authentication > Sign-in method > Anonymous.
5. Crea la base de datos de Cloud Firestore.
6. Publica `firestore.rules`.
7. Crea `.env.local` a partir de `.env.example`.

Ejemplo de `.env.local`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Reinicia el servidor de Vite después de modificar `.env.local`.

## Firestore

La aplicación guarda un documento por usuario:

```text
mcuMarathonUsers/{uid}
```

Estructura:

```json
{
  "progress": {
    "mcu-01": {
      "completed": false,
      "minute": 42
    }
  },
  "updatedAt": "server timestamp"
}
```

Las reglas limitan lectura y escritura al usuario autenticado cuyo UID coincide con el ID del documento.

## Desarrollo y producción

```bash
npm run dev
npm run build
npm run preview
```

## Firebase Hosting

Instala la CLI de Firebase:

```bash
npm install -g firebase-tools
firebase login
```

Dentro del proyecto:

```bash
firebase use --add
```

Selecciona tu proyecto Firebase.

Después:

```bash
npm run build
firebase deploy --only firestore:rules,hosting
```

## Persistencia

La estrategia es de dos niveles:

1. `localStorage`: respaldo inmediato y funcionamiento local sin Firebase.
2. Firebase Authentication anónima + Firestore: sincronización en la nube.

La autenticación anónima mantiene un UID en el navegador mientras la sesión/persistencia local siga disponible. Para sincronizar el mismo progreso entre dispositivos distintos, la siguiente evolución recomendada es vincular la cuenta anónima con Google u otro proveedor.

## Uso tipo app / PWA

La app incluye una configuración PWA básica:

- `public/manifest.webmanifest` con nombre, color de tema, modo standalone e iconos.
- `public/icon.svg` y `public/maskable-icon.svg` como iconos básicos.
- `public/sw.js` para cachear el shell de la app y permitir una experiencia más estable después de la primera carga.
- `src/registerServiceWorker.js` registra el service worker solo en build de producción.

Por ahora no se agregó `vite-plugin-pwa` porque el alcance es simple y un service worker propio mantiene menos dependencias. Si después se quieren estrategias más avanzadas de precache, actualización en segundo plano o auditorías Lighthouse estrictas, ese plugin sería el siguiente paso natural.

## Reglas de negocio

- Marcar una película como completada fija el minuto en su duración.
- Introducir un minuto igual o superior a la duración marca la película como completada.
- Un minuto negativo o mayor a la duración queda normalizado al rango permitido.
- El dashboard suma duración completa para películas terminadas y minuto registrado para películas pendientes.
- El cambio de un minuto se guarda con debounce para evitar escrituras innecesarias.

## Validación de datos

Antes de hacer cambios al catálogo puedes ejecutar:

```bash
npm run validate:data
```

El script comprueba que existan exactamente 37 películas, que los números sean consecutivos, que los IDs sean únicos, que las duraciones sean válidas y que el catálogo incluya campos de producto como fase, saga, año cronológico, año de estreno, plataforma, tipo de continuidad y notas.

## Modelo del catálogo

Cada película mantiene los campos usados por la UI (`id`, `numero`, `titulo`, `año`, `plataforma`, `duracionMinutos`, `calidad`) y añade contexto para evolucionar filtros, fichas y assets visuales:

- `fase`: fase oficial del UCM.
- `saga`: Saga del Infinito o Saga del Multiverso.
- `añoCronologico`: rango o año donde se ubica dentro del maratón.
- `añoEstreno`: año de lanzamiento.
- `tipoContinuidad`: línea principal, multiversal o realidad alterna.
- `notas`: contexto corto para decidir por qué aparece en esa posición.
- `director`, `castPrincipal`, `compositor`, `soundtrackDestacado`: metadata editorial para completar después.
- `trailerUrl`: enlace externo para la ficha de película.
- `posterUrl`/`posterKey` y `backdropUrl`/`backdropKey`: soporte para assets propios sin depender de imágenes oficiales.
- `sinopsisCorta`, `escenasPostCreditos`, `notasContinuidad` y `disponibilidad`: contenido para la ficha expandida.

No se agregaron series todavía. Una evolución futura razonable sería soportar tipos de entrada (`película`, `serie`, `especial`) y separar el catálogo en presets: solo películas, películas + especiales y cronología completa.

## Sincronización futura

El proyecto conserva `localStorage` como fallback y Firebase Anonymous Auth + Firestore como sincronización actual. Para sincronizar entre dispositivos, la evolución recomendada es agregar login opcional con vinculación de cuenta anónima, por ejemplo Google o email, usando Firebase Auth. Ese flujo debe conservar el progreso existente antes de vincular para no perder datos locales.

> Nota de datos: la estructura conserva el catálogo de 37 películas utilizado en la versión anterior. La entrada de *Los 4 Fantásticos: Primeros pasos* está identificada explícitamente como una excepción de realidad/universo. Marvel describe el UCM como una estructura con diferentes mundos y líneas temporales; por eso no conviene modelar el multiverso como si todas las películas pertenecieran a una única cronología lineal.
