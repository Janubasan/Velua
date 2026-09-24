import type { Aula, Fase } from "./curso-parte1";
import { fases123 } from "./curso-parte1";
import { fases456 } from "./curso-parte2";

export type { Aula, Fase };

export const fases: Fase[] = [...fases123, ...fases456].sort((a, b) => a.numero - b.numero);

export const totalAulas = fases.reduce((acc, f) => acc + f.aulas.length, 0);

export function getFase(slug: string): Fase | undefined {
  return fases.find((f) => f.slug === slug);
}

export function getAula(faseSlug: string, aulaSlug: string): { fase: Fase; aula: Aula } | undefined {
  const fase = getFase(faseSlug);
  const aula = fase?.aulas.find((a) => a.slug === aulaSlug);
  if (!fase || !aula) return undefined;
  return { fase, aula };
}

export function aulasFlat(): { fase: Fase; aula: Aula }[] {
  return fases.flatMap((fase) => fase.aulas.map((aula) => ({ fase, aula })));
}

export function navegacao(faseSlug: string, aulaSlug: string) {
  const flat = aulasFlat();
  const idx = flat.findIndex((x) => x.fase.slug === faseSlug && x.aula.slug === aulaSlug);
  return {
    anterior: idx > 0 ? flat[idx - 1] : null,
    proxima: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
    indice: idx + 1,
    total: flat.length,
  };
}
