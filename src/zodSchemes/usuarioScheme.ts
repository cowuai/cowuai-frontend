import { z } from "zod";

/* Regex CPF: exige exatamente 11 dígitos (sem pontuação) */
const cpfRegex = /^\d{11}$/;

/* Validar CPF */
function validarCPF(cpf: string) {
  if (!cpf) return false;
  const onlyDigits = cpf.replace(/\D/g, "");
  if (onlyDigits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(onlyDigits)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(onlyDigits[i]) * (10 - i);
  let d1 = 11 - (soma % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== parseInt(onlyDigits[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(onlyDigits[i]) * (11 - i);
  let d2 = 11 - (soma % 11);
  if (d2 >= 10) d2 = 0;
  return d2 === parseInt(onlyDigits[10]);
}

/* --- schema para criação (o body enviado ao backend) --- */
export const createUsuarioSchema = z.object({
  cpf: z
    .string()
    .regex(cpfRegex, "CPF deve conter exatamente 11 números")
    .refine((v) => validarCPF(v), "CPF inválido"),

  nome: z
    .string()
    .min(4, "Nome muito curto")
    .max(255, "Nome muito longo")
    .refine((v) => v.trim().split(" ").length >= 2, {
      message: "Digite nome completo (nome e sobrenome)",
    })
    .refine((v) => v.trim().split(" ").every((p) => p.length >= 2), {
      message: "Cada parte do nome deve ter ao menos 2 caracteres",
    }),

  email: z.string().email("Email inválido"),

  senha: z
    .string()
    .min(8, "Senha deve ter ao menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve ter ao menos 1 letra maiúscula")
    .regex(/[a-z]/, "Senha deve ter ao menos 1 letra minúscula")
    .regex(/[0-9]/, "Senha deve ter ao menos 1 número")
    .regex(/[\W_]/, "Senha deve ter ao menos 1 caractere especial"),

  dataNascimento: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), { message: "Data de nascimento inválida" })
    .refine((s) => {
      if (!s) return true;
      const birth = new Date(s as string);
      const today = new Date();
      const birthDateOnly = new Date(birth.getFullYear(), birth.getMonth(), birth.getDate());
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return birthDateOnly <= todayDateOnly;
    }, "Data de nascimento não pode ser no futuro"),

  ativo: z.boolean().optional(),

  telefone: z.union([z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido"), z.literal("")]).optional(),

  localizacao: z
    .union([z.string().max(255).regex(/^[\p{L}\p{N}\s,.-]*$/u, "Localização contém caracteres inválidos"), z.literal("")])
    .optional(),

  urlImagem: z.union([z.string().url("URL inválida").max(2048), z.literal("")]).optional(),
});

/* --- Schema para update ---*/
export const updateUsuarioSchema = createUsuarioSchema.partial();

/* --- Schema para view/listagem ---*/
export const usuarioViewSchema = z.object({
  id: z.string(),
  cpf: z.string(),
  nome: z.string(),
  email: z.string(),
  dataNascimento: z.string().nullable().optional(),
  telefone: z.string().nullable().optional(),
  localizacao: z.string().nullable().optional(),
  ativo: z.boolean(),
  urlImagem: z.string().nullable().optional(),
  dataCadastro: z.string(),
  dataAtualizacao: z.string().optional(),
});

export type CreateUsuarioForm = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioForm = z.infer<typeof updateUsuarioSchema>;
export type UsuarioView = z.infer<typeof usuarioViewSchema>;
