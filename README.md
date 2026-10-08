# MCU Marathon Tracker

Tracker React + Vite + Tailwind CSS + Firebase Firestore para registrar 37 películas del UCM.

## Arquitectura

```text
mcu-marathon-tracker/
├─ public/
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

El script comprueba que existan exactamente 37 películas, que los números sean consecutivos, que los IDs sean únicos y que las duraciones sean válidas.

> Nota de datos: la estructura conserva el catálogo de 37 películas utilizado en la versión anterior. La entrada de *Los 4 Fantásticos: Primeros pasos* está identificada explícitamente como una excepción de realidad/universo. Marvel describe el UCM como una estructura con diferentes mundos y líneas temporales; por eso no conviene modelar el multiverso como si todas las películas pertenecieran a una única cronología lineal.
