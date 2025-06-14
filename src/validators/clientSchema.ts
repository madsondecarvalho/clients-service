import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
});

export type ClientInput = z.infer<typeof clientSchema>;