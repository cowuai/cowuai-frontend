import { z } from "zod";

export const fazendaCreateSchema = z
  .object({
    idProprietario: z
      .number()
      .int("idProprietario deve ser inteiro")
      .positive("idProprietario deve ser positivo"),

    nome: z
      .string()
      .min(3, "Informe um nome com pelo menos 3 caracteres")
      .max(255, "Nome muito longo (máx. 255 caracteres)"),

    endereco: z
      .string()
      .min(3, "Informe um endereço válido")
      .max(255, "Endereço muito longo (máx. 255 caracteres)"),

    cidade: z
      .string()
      .min(2, "Informe a cidade")
      .max(255, "Cidade muito longa (máx. 255 caracteres)"),

    estado: z
      .string()
      .length(2, "Informe a sigla do estado (ex: MG, SP)"),

    pais: z
      .string()
      .min(2, "Informe o país")
      .max(255, "País muito longo (máx. 255 caracteres)"),

    porte: z.enum(
      ["PEQUENO", "MEDIO", "GRANDE"],
      "Selecione o porte da fazenda"
    ),

    afixo: z
      .string()
      .min(1, "Afixo é obrigatório")
      .refine((value) => value.trim().length > 0, {
        message: "Afixo é obrigatório",
      })
      .max(255, "Afixo muito longo (máx. 255 caracteres)"),

    prefixo: z.boolean(),
    sufixo: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if ((data.prefixo || data.sufixo) && !(data.afixo ?? "").trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["afixo"],
        message: "Informe o texto do afixo quando marcar prefixo ou sufixo.",
      });
    }
  });

export const fazendaUpdateSchema = fazendaCreateSchema.partial();

export const fazendaScheme = fazendaCreateSchema;