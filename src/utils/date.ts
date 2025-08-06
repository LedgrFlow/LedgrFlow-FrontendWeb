import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/es";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Extensiones necesarias
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Puedes cambiar el idioma aquí
dayjs.locale("es");

export class DateFormatter {
  /**
   * Devuelve el nombre del mes en texto, en el idioma configurado.
   * @param date La fecha a analizar.
   * @param options Capitalizar o no.
   * @returns Nombre del mes (ej. "julio", "Diciembre")
   */
  getMonthName(
    date: string | Date,
    options?: { capitalize?: boolean }
  ): string {
    const month = dayjs(date).format("MMMM"); // Ej: julio
    if (options?.capitalize) {
      return month.charAt(0).toUpperCase() + month.slice(1);
    }
    return month;
  }

  /**
   * Convierte una fecha a texto legible, incluyendo día, mes y año.
   * @param date La fecha a formatear.
   * @returns Fecha formateada (ej: "31 de julio de 2025")
   */
  toReadable(date: string | Date): string {
    return dayjs(date).format("D [de] MMMM [de] YYYY");
  }

  /**
   * Convierte una fecha a texto relativo (ej: "hace 2 días")
   * @param date La fecha de referencia.
   * @returns Texto relativo.
   */
  toRelative(date: string | Date): string {
    return dayjs(date).fromNow();
  }

  /**
   * Convierte la fecha a un formato personalizado.
   * @param date La fecha a formatear.
   * @param formatString Formato de salida (ej: "YYYY-MM-DD HH:mm")
   * @returns Cadena formateada.
   */
  toFormat(date: string | Date, formatString: string): string {
    return dayjs(date).format(formatString);
  }

  /**
   * Convierte una fecha a texto relativo (ej: "2 días")
   * @param date La fecha a formatear.
   * @returns
   */
  toRelativeClean(date: string | Date): string {
    const relative = dayjs(date).fromNow();
    return relative
      .replace(/^hace\s+/i, "") // español
      .replace(/^in\s+/i, "") // inglés
      .replace(/\s+ago$/i, "") // inglés alternativo
      .trim();
  }

  /**
   * Verifica si una fecha está dentro del mes especificado (YYYY-MM).
   * @param date Fecha a verificar.
   * @param monthString Mes en formato "YYYY-MM".
   * @returns `true` si la fecha está dentro de ese mes.
   */
  isInMonth(date: string | Date, monthString: string): boolean {
    const targetDate = dayjs(date);
    const [year, month] = monthString.split("-");
    return (
      targetDate.year() === parseInt(year) &&
      targetDate.month() === parseInt(month) - 1 // Dayjs usa 0-index para meses
    );
  }

  /**
   * Verifica si una fecha está dentro de un rango (inclusive).
   * @param date Fecha a evaluar.
   * @param start Fecha de inicio del rango.
   * @param end Fecha de fin del rango.
   * @returns `true` si está dentro del rango (inclusive).
   */
  isInRange(
    date: string | Date,
    start: string | Date,
    end: string | Date
  ): boolean {
    const d = dayjs(date);
    return d.isSameOrAfter(dayjs(start)) && d.isSameOrBefore(dayjs(end));
  }

  /**
   * Devuelve si una fecha es válida.
   * @param date La fecha a validar.
   */
  isValid(date: string | Date): boolean {
    return dayjs(date).isValid();
  }

  /** Ej: "Feb" */
  formatMonthShort(date: string | Date): string {
    return dayjs(date).format("MMM");
  }

  /** Ej: "Feb 1" */
  formatMonthShortWithDayNoPad(date: string | Date): string {
    return dayjs(date).format("MMM D");
  }

  /** Ej: "01 Feb" */
  formatDayMonthShort(date: string | Date): string {
    return dayjs(date).format("DD MMM");
  }

  /** Ej: "01/02" */
  formatDayMonthNumeric(date: string | Date): string {
    return dayjs(date).format("DD/MM");
  }

  /** Ej: "Feb 2025" */
  formatMonthYear(date: string | Date): string {
    return dayjs(date).format("MMM YYYY");
  }

  /** Ej: "01 Feb 25" */
  formatDayMonthShortYearShort(date: string | Date): string {
    return dayjs(date).format("DD MMM YY");
  }

  /** Ej: "25-02-01" (año corto, mes, día) */
  formatShortYearMonthDay(date: string | Date): string {
    return dayjs(date).format("YY-MM-DD");
  }

  /**
   * Formatea dos fechas como rango en estilo compacto.
   * Ej: "01 Feb ... 31 Jul"
   */
  formatRangeCompact(startDate: string | Date, endDate: string | Date): string {
    const start = dayjs(startDate).format("DD MMM");
    const end = dayjs(endDate).format("DD MMM");
    return `${start} ... ${end}`;
  }
}
