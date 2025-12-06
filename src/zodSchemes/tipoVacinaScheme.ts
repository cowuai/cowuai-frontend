import { z } from "zod";
import { FrequenciaVacina, SexoAnimal } from "@/types/tipoVacina";

export const tipoVacinaScheme = z
    .object({
        nome: z
            .string()
            .min(3, "Informe um nome com pelo menos 3 caracteres")
            .max(255, "Nome muito longo (máx. 255 caracteres)"),
        descricao: z
            .string()
            .max(2000, "Descrição muito longa (máx. 2000 caracteres)")
            .optional()
            .or(z.literal("")).nullable(),
        obrigatoria: z.boolean({
            error: "Informe se a vacinação é obrigatória",
        }),
        generoAlvo: z.enum(SexoAnimal, {
            error: "Informe o gênero alvo da vacina",
        }),
        minIdadeMeses: z
            .number({ error: "Informe a idade mínima em meses" })
            .int("Use um número inteiro")
            .min(0, "Idade mínima não pode ser negativa"),
        maxIdadeMeses: z
            .number({ error: "Informe a idade máxima em meses" })
            .int("Use um número inteiro")
            .min(0, "Idade máxima não pode ser negativa"),
        // frequencia: permitimos um enum (categorias) ou um número de meses.
        frequencia: z.enum(FrequenciaVacina)
    })
    .superRefine((obj, ctx) => {
        if (obj.maxIdadeMeses < obj.minIdadeMeses) {
            ctx.addIssue({
                code: "custom",
                path: ["maxIdadeMeses"],
                message: "Idade máxima deve ser maior ou igual à mínima",
            });
        }
    });