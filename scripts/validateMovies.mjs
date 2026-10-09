import { MCU_MOVIES } from '../src/data/mcuMovies.js';

const errors = [];
const ids = new Set();
const requiredTextFields = [
  'titulo',
  'año',
  'añoCronologico',
  'fase',
  'saga',
  'plataforma',
  'calidad',
  'tipoContinuidad',
  'notas',
  'sinopsisCorta',
  'notasContinuidad',
  'posterKey',
  'backdropKey',
];
const optionalStringFields = [
  'director',
  'compositor',
  'soundtrackDestacado',
  'trailerUrl',
  'posterUrl',
  'backdropUrl',
  'escenasPostCreditos',
];

if (MCU_MOVIES.length !== 37) {
  errors.push(`Se esperaban 37 películas y hay ${MCU_MOVIES.length}.`);
}

MCU_MOVIES.forEach((movie, index) => {
  const expectedNumber = index + 1;

  if (movie.numero !== expectedNumber) {
    errors.push(`Película ${index + 1}: numero esperado ${expectedNumber}, recibido ${movie.numero}.`);
  }

  if (ids.has(movie.id)) {
    errors.push(`ID duplicado: ${movie.id}.`);
  }
  ids.add(movie.id);

  for (const field of requiredTextFields) {
    if (!movie[field]?.trim()) {
      errors.push(`Película ${movie.numero}: falta ${field}.`);
    }
  }

  if (!Number.isInteger(movie.añoEstreno) || movie.añoEstreno < 2008) {
    errors.push(`Película ${movie.numero}: añoEstreno inválido.`);
  }

  for (const field of optionalStringFields) {
    if (typeof movie[field] !== 'string') {
      errors.push(`Película ${movie.numero}: ${field} debe existir como texto.`);
    }
  }

  if (!Array.isArray(movie.castPrincipal)) {
    errors.push(`Película ${movie.numero}: castPrincipal debe ser un arreglo.`);
  }

  if (
    !movie.disponibilidad
    || typeof movie.disponibilidad.plataforma !== 'string'
    || typeof movie.disponibilidad.calidad !== 'string'
    || typeof movie.disponibilidad.notas !== 'string'
  ) {
    errors.push(`Película ${movie.numero}: disponibilidad inválida.`);
  }

  if (!Number.isInteger(movie.duracionMinutos) || movie.duracionMinutos <= 0) {
    errors.push(`Película ${movie.numero}: duracionMinutos inválida.`);
  }
});

if (errors.length > 0) {
  console.error('Validación fallida:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const total = MCU_MOVIES.reduce((sum, movie) => sum + movie.duracionMinutos, 0);
console.log(`OK: ${MCU_MOVIES.length} películas, ${total} minutos totales.`);
