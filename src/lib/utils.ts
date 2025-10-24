import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FrequenciaVacina } from "@/types/TipoVacina";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calcula a data da próxima dose com cuidados para bordas de mês/ano.
 * Retorna string no formato YYYY-MM-DD ou "" para dose única / desconhecido.
 */
export function calculaProximaDose(dataAplicacao: string, frequencia: FrequenciaVacina): string {
  if (!dataAplicacao) return "";
  // Criar Date a partir da string no formato YYYY-MM-DD como data local
  const parts = dataAplicacao.split("-").map((p) => parseInt(p, 10));
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return "";
  // Note: new Date(year, monthIndex, day) usa timezone local e evita deslocamentos de UTC
  const [year, month, day] = parts;
  const dt = new Date(year, month - 1, day);

  let result: Date | null = null;
  switch (frequencia) {
    case FrequenciaVacina.DOSE_UNICA:
      return "N/D";
    case FrequenciaVacina.ANUAL:
      result = new Date(dt.getFullYear() + 1, dt.getMonth(), dt.getDate());
      break;
    case FrequenciaVacina.SEMESTRAL:
      result = addMonthsPreserveDay(dt, 6);
      break;
    case FrequenciaVacina.TRIMESTRAL:
      result = addMonthsPreserveDay(dt, 3);
      break;
    case FrequenciaVacina.BIMESTRAL:
      result = addMonthsPreserveDay(dt, 2);
      break;
    case FrequenciaVacina.MENSAL:
      result = addMonthsPreserveDay(dt, 1);
      break;
    case FrequenciaVacina.REFORCO:
      result = new Date(dt);
      result.setDate(result.getDate() + 21);
      break;
    default:
      return "N/D";
  }

  if (!result) return "N/D";
  return formatDateLocal(result);
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDateLocal(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Adiciona meses preservando o dia quando possível. Se o mês alvo não tem o dia
 * (ex: 31 em abril), ajusta para o último dia do mês alvo.
 */
function addMonthsPreserveDay(date: Date, months: number) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  const targetMonth = m + months;
  const result = new Date(y, targetMonth, 1);
  // último dia do mês alvo
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  const day = Math.min(d, lastDay);
  result.setDate(day);
  return result;
}

export function calculateAge(birthDate: string) {
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();

    if (years > 0) {
        return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
};
