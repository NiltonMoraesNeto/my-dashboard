import type { TFunction } from "i18next";

const monthCodeMap: Record<string, MonthCode> = {
  jan: "jan",
  january: "jan",
  janeiro: "jan",
  enero: "jan",
  fev: "feb",
  fevereiro: "feb",
  feb: "feb",
  february: "feb",
  febrero: "feb",
  mar: "mar",
  março: "mar",
  marzo: "mar",
  march: "mar",
  abr: "apr",
  abril: "apr",
  april: "apr",
  may: "may",
  maio: "may",
  mayo: "may",
  jun: "jun",
  junho: "jun",
  junio: "jun",
  june: "jun",
  jul: "jul",
  julho: "jul",
  julio: "jul",
  july: "jul",
  ago: "aug",
  agosto: "aug",
  august: "aug",
  set: "sep",
  sept: "sep",
  setembro: "sep",
  septiembre: "sep",
  september: "sep",
  oct: "oct",
  out: "oct",
  outubro: "oct",
  octubre: "oct",
  october: "oct",
  nov: "nov",
  novembro: "nov",
  noviembre: "nov",
  november: "nov",
  dez: "dec",
  dic: "dec",
  dezembro: "dec",
  diciembre: "dec",
  december: "dec",
};

type MonthCode = "jan" | "feb" | "mar" | "apr" | "may" | "jun" | "jul" | "aug" | "sep" | "oct" | "nov" | "dec";

export function translateMonthLabel(label: string, t: TFunction): string {
  const normalized = label.trim().toLowerCase();
  const key = monthCodeMap[normalized as keyof typeof monthCodeMap];
  if (key) {
    return t(`monthsShort.${key}`);
  }
  return label.toUpperCase();
}

