import { z } from 'zod';

// Função para validar CPF
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let d1 = 11 - (soma % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  let d2 = 11 - (soma % 11);
  if (d2 >= 10) d2 = 0;
  return d2 === parseInt(cpf[10]);
}

export const createUsuarioSchema = z.object({
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter exatamente 11 números')
    .refine(validarCPF, 'CPF inválido'),

  nome: z
    .string()
    .min(8, 'Nome muito curto')
    .max(255, 'Nome muito longo')
    .refine((v) => v.trim().split(' ').length >= 2, {
      message: 'Digite nome completo (nome e sobrenome)',
    })
    .refine((v) => v.trim().split(' ').every((p) => p.length >= 2), {
      message: 'Cada parte do nome deve ter ao menos 2 caracteres',
    }),

  email: z.string().email('Email inválido'),

  senha: z
    .string()
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve ter ao menos 1 letra maiúscula')
    .regex(/[a-z]/, 'Senha deve ter ao menos 1 letra minúscula')
    .regex(/[0-9]/, 'Senha deve ter ao menos 1 número')
    .regex(/[\W_]/, 'Senha deve conter ao menos 1 caractere especial'),

  dataNascimento: z
    .string()
    .optional()
    .refine((s) => !s || !Number.isNaN(Date.parse(s)), {
      message: 'Data inválida',
    })
    .refine((s) => {
      if (!s) return true;
      const birth = new Date(s);
      const now = new Date();
      const age =
        now.getFullYear() -
        birth.getFullYear() -
        (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
      return age >= 18;
    }, 'Usuário deve ter pelo menos 18 anos'),

  ativo: z.boolean().optional(),

  telefone: z
    .union([
      z.string().regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
      z.literal(''),
    ])
    .optional(),

  localizacao: z
    .string()
    .max(255, 'Localização muito longa')
    .regex(/^[\p{L}\p{N}\s,.-]*$/u, 'Localização contém caracteres inválidos')
    .optional()
    .or(z.literal('')),

  urlImagem: z
    .string()
    .url('URL inválida')
    .max(2048, 'URL muito longa')
    .optional()
    .or(z.literal('')),
});

export const updateUsuarioSchema = createUsuarioSchema.partial();

export const updateUsuarioWithIdSchema = updateUsuarioSchema.extend({
  id: z.string().regex(/^\d+$/, 'ID deve ser um número inteiro positivo').optional(),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
