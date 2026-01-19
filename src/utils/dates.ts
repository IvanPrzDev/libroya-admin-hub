import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatea una fecha a formato legible en español
 * @param dateString - String de fecha ISO
 * @param formatStr - Formato de salida (por defecto "dd MMM, yyyy")
 * @returns Fecha formateada
 */
export const formatDate = (
  dateString: string,
  formatStr: string = "dd MMM, yyyy",
): string => {
  return format(new Date(dateString), formatStr, { locale: es });
};

/**
 * Formatea una fecha a formato corto (dd/MM/yyyy)
 */
export const formatDateShort = (dateString: string): string => {
  return formatDate(dateString, "dd/MM/yyyy");
};

/**
 * Formatea una fecha con hora
 */
export const formatDateTime = (dateString: string): string => {
  return formatDate(dateString, "dd MMM, yyyy HH:mm");
};
