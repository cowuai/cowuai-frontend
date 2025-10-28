// src/zodSchemes/aplicacaoVacinaScheme.ts
import { z } from "zod";

export const aplicacaoVacinaScheme = z
  .object({
    idAnimal: z.bigint({
      error: "Informe o ID do animal",
    }),
    idTipoVacina: z.bigint({
      error: "Informe o ID do tipo de vacina",
    }),
    dataAplicacao: z
      .string({
        error: "Informe a data de aplicação da vacina",
      })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Data de aplicação inválida",
      }),
    proximaDose: z
      .string()
      .optional()
      .refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Data da próxima dose inválida",
      }),
    lote: z.string().max(100, "Lote muito longo (máx. 100 caracteres)").optional().or(z.literal("")).nullable(),
    veterinario: z.string().max(255, "Nome do veterinário muito longo (máx. 255 caracteres)").optional().or(z.literal("")).nullable(),
    observacoes: z.string().max(2000, "Observações muito longas (máx. 2000 caracteres)").optional().or(z.literal("")).nullable(),
  })
  .refine((data) => {
    if (data.proximaDose) {
      const dataAplicacao = new Date(data.dataAplicacao);
      const proximaDose = new Date(data.proximaDose);
      return proximaDose > dataAplicacao;
    }
    return true;
  }, {
    message: "A próxima dose deve ser posterior à data de aplicação",
    path: ["proximaDose"],
  });
