/**
 * Mensajes de error de la aplicación
 */
export const ERROR_MESSAGES = {
  NETWORK:
    "No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000",
  CORS: "Error de CORS. El backend debe permitir peticiones desde el frontend.",
  BAD_REQUEST: "Datos inválidos. Verifica la información enviada.",
  UNAUTHORIZED: "Credenciales incorrectas o usuario no es administrador.",
  FORBIDDEN: "No tienes permisos para realizar esta acción.",
  NOT_FOUND: "Recurso no encontrado.",
  CONFLICT: "Ya existe un registro con estos datos.",
  SERVER_ERROR: "Error del servidor. Inténtalo más tarde.",
  CONNECTION: "Error de conexión. Verifica tu red.",
  UNKNOWN: "Error inesperado",
} as const;

export const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: ERROR_MESSAGES.BAD_REQUEST,
  401: ERROR_MESSAGES.UNAUTHORIZED,
  403: ERROR_MESSAGES.FORBIDDEN,
  404: ERROR_MESSAGES.NOT_FOUND,
  409: ERROR_MESSAGES.CONFLICT,
  500: ERROR_MESSAGES.SERVER_ERROR,
};
