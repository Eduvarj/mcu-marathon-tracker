# Guía paso a paso — MCU Marathon Tracker

## 1. Instalar Node.js

Usa una versión de Node compatible con Vite 8. La opción sencilla es Node 22.12+.

Comprueba:

```bash
node -v
npm -v
```

## 2. Crear o abrir el proyecto

### Opción A — usar este proyecto ya preparado

Descomprime `mcu-marathon-tracker.zip`, abre una terminal en la carpeta y ejecuta:

```bash
npm install
npm run validate:data
npm run dev
```

El primer `npm install` genera `package-lock.json` y descarga React, Vite, Tailwind y Firebase.

### Opción B — comenzar desde cero con Vite

```bash
npm create vite@latest mcu-marathon-tracker -- --template react
cd mcu-marathon-tracker
npm install firebase
npm install -D tailwindcss @tailwindcss/vite
```

Después sustituye el contenido de `src` y de los archivos de configuración por los incluidos en este proyecto.

## 3. Configurar Tailwind CSS

El proyecto ya incluye `vite.config.js` con el plugin oficial de Tailwind y `src/index.css` con:

```css
@import "tailwindcss";
```

No necesitas `tailwind.config.js` para esta configuración.

## 4. Crear el proyecto Firebase

En Firebase Console:

1. Crea un proyecto nuevo.
2. Entra a Project settings.
3. Registra una Web App.
4. Copia la configuración de Firebase que aparece al registrar la app.

Instalar `firebase` en el proyecto:

```bash
npm install firebase
```

## 5. Activar autenticación anónima

En Firebase Console:

`Authentication` → `Sign-in method` → `Anonymous` → `Enable` → `Save`.

La app usa cuentas anónimas para que cada navegador tenga un UID y ese UID sea usado como propietario del documento de Firestore.

## 6. Crear Firestore

En Firebase Console:

`Firestore Database` → `Create database`.

Selecciona una ubicación cercana a tus usuarios. Para un proyecto personal, usa el modo de producción y después publica las reglas incluidas en `firestore.rules`.

## 7. Configurar variables de entorno

Duplica `.env.example` con el nombre `.env.local`.

Ejemplo:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

No subas `.env.local` a Git. Ya está incluido en `.gitignore`.

Después de crear o modificar `.env.local`, reinicia Vite:

```bash
npm run dev
```

## 8. Publicar las reglas de Firestore

Instala Firebase CLI:

```bash
npm install -g firebase-tools
```

Inicia sesión:

```bash
firebase login
```

Selecciona tu proyecto:

```bash
firebase use --add
```

Elige el proyecto creado en Firebase Console.

Publica las reglas:

```bash
firebase deploy --only firestore:rules
```

## 9. Probar la aplicación

Arranca desarrollo:

```bash
npm run dev
```

Abre la URL que indique Vite, normalmente:

```text
http://localhost:5173
```

Prueba en este orden:

1. Escribe `15` en una película.
2. Comprueba que el dashboard aumente 15 minutos.
3. Escribe la duración exacta.
4. Comprueba que la película se marque automáticamente.
5. Desmarca la película.
6. Recarga la página.
7. Comprueba que el progreso siga allí.
8. Abre la consola de Firebase y verifica el documento en `mcuMarathonUsers/{uid}`.

## 10. Comprobar la nube

El documento queda con esta estructura:

```text
mcuMarathonUsers/
└── UID_ANONIMO/
    ├── progress
    │   ├── mcu-01
    │   ├── mcu-02
    │   └── ...
    └── updatedAt
```

El listener `onSnapshot` mantiene la interfaz actualizada cuando Firestore cambia.

## 11. Validar el catálogo

```bash
npm run validate:data
```

Debe aparecer un mensaje similar a:

```text
OK: 37 películas, 4839 minutos totales.
```

La validación también exige que cada película tenga fase, saga, año cronológico, año de estreno, plataforma, tipo de continuidad y notas.

## 12. Generar build de producción

```bash
npm run build
```

Esto genera:

```text
dist/
```

Prueba el build localmente:

```bash
npm run preview
```

El build de producción registra el service worker y usa `public/manifest.webmanifest` para que el tracker pueda instalarse como app en navegadores compatibles.

## 13. Publicar con Firebase Hosting

Construye primero:

```bash
npm run build
```

Después:

```bash
firebase deploy --only hosting
```

O publica reglas + Hosting juntos:

```bash
firebase deploy --only firestore:rules,hosting
```

## 14. Arquitectura del código

`src/App.jsx`

Orquesta estado de UI, filtros y composición. No contiene la lógica de Firebase.

`src/data/mcuMovies.js`

Catálogo de las 37 películas, campos de fase/saga/continuidad y constantes derivadas.

`src/hooks/useMcuProgress.js`

Gestiona el estado del progreso, autenticación, sincronización y acciones de usuario.

`src/services/progressStorage.js`

Es la frontera de persistencia. Aquí se encuentran localStorage, autenticación anónima y Firestore.

`src/registerServiceWorker.js`

Registra el service worker solo en producción para habilitar comportamiento PWA básico.

`src/utils/progress.js`

Contiene normalización, actualización de una película y cálculo del dashboard.

`src/utils/format.js`

Contiene el formateo de días, horas y minutos.

`src/components/`

Contiene únicamente piezas de presentación.

## 15. Decisiones de arquitectura

### Por qué no meter Firebase dentro de App.jsx

Porque mezcla infraestructura con presentación y vuelve más difícil probar, mantener y sustituir Firebase por otra fuente de datos.

### Por qué existe localStorage si ya existe Firestore

Sirve como respaldo inmediato y permite que la aplicación siga siendo útil si Firebase no está configurado o no está disponible temporalmente.

### Por qué el guardado tiene debounce

El input de minutos puede generar muchos eventos consecutivos. Guardar directamente cada pulsación provoca escrituras innecesarias. El hook espera 500 ms después del último cambio antes de escribir en Firestore.

### Por qué la regla de Firestore usa auth.uid

El cliente web puede conocer la configuración pública de Firebase, pero el control real de acceso debe estar en Authentication + Security Rules. La regla permite que un usuario escriba únicamente en su propio documento.

## 16. Limitación importante de la autenticación anónima

La cuenta anónima es útil para este tracker porque no obliga al usuario a registrarse. Sin embargo, su identidad depende de la persistencia del navegador. No debe considerarse una cuenta personal transferible entre dispositivos.

La evolución natural del proyecto es ofrecer "Vincular mi progreso" con Google, correo u otro proveedor y conservar el UID mediante la vinculación de la cuenta anónima. Ese flujo debe copiar o conservar el progreso actual antes de convertir la sesión anónima en una cuenta reutilizable.
