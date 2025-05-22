// utils/helmetConfig.ts
import helmet from 'helmet';

export const helmetConfig = helmet({
  // Desactiva CSP si estás sirviendo desde múltiples orígenes (ej. React en Vite o Next externo)
  contentSecurityPolicy: false,

  // Evita errores si cargás contenido externo (como fonts, scripts de terceros)
  crossOriginEmbedderPolicy: false,

  // Configura Referrer-Policy: no enviar referrer a sitios externos
  referrerPolicy: { policy: 'no-referrer' },

  // Protege contra sniffing de tipo MIME
  noSniff: true,

  // Evita que el sitio sea embebido (clickjacking)
  frameguard: { action: 'deny' },

  // Control de caché DNS prefetching
  dnsPrefetchControl: { allow: false },

  // Forzar HTTPS con HSTS si estás en producción
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 60 * 60 * 24 * 365, // 1 año
    includeSubDomains: true,
    preload: true,
  } : false,
});
