import { z } from 'zod';

export const diagnosticInputSchema = z.object({
  title: z.string()
    .trim()
    .min(5, 'Título deve ter no mínimo 5 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .refine(
      (val) => !/[<>{}]/.test(val),
      'Título contém caracteres inválidos'
    ),
  
  sector: z.string()
    .trim()
    .min(1, 'Setor é obrigatório')
    .max(100, 'Setor deve ter no máximo 100 caracteres'),
  
  inputText: z.string()
    .trim()
    .min(50, 'Resumo da reunião deve ter no mínimo 50 caracteres')
    .max(10000, 'Resumo da reunião deve ter no máximo 10.000 caracteres')
    .refine(
      (val) => !/[<>{}]/.test(val),
      'Texto contém caracteres inválidos'
    ),
});

export type DiagnosticInput = z.infer<typeof diagnosticInputSchema>;

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>{}]/g, '') // Remove caracteres perigosos
    .slice(0, 10000); // Limita tamanho
};