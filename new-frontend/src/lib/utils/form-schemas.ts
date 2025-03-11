import { z } from 'zod';

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Schema para criação de usuário
export const createUserSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['ADMIN', 'TEACHER', 'SPECIALIST'], {
    errorMap: () => ({ message: 'Selecione um papel válido' }),
  }),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

// Schema para atualização de usuário
export const updateUserSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').optional(),
  role: z
    .enum(['ADMIN', 'TEACHER', 'SPECIALIST'], {
      errorMap: () => ({ message: 'Selecione um papel válido' }),
    })
    .optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

// Schema para criação de estudante
export const createStudentSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  grade: z.string().min(1, 'A série é obrigatória'),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de nascimento inválida',
  }),
  userId: z.string().uuid('ID de usuário inválido'),
});

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;

// Schema para atualização de estudante
export const updateStudentSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').optional(),
  grade: z.string().min(1, 'A série é obrigatória').optional(),
  dateOfBirth: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Data de nascimento inválida',
    })
    .optional(),
  userId: z.string().uuid('ID de usuário inválido').optional(),
});

export type UpdateStudentFormValues = z.infer<typeof updateStudentSchema>;

// Schema para criação de avaliação
export const createAssessmentSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data inválida',
  }),
  type: z.string().min(1, 'O tipo é obrigatório'),
  score: z.coerce
    .number()
    .min(0, 'A pontuação deve ser maior ou igual a 0')
    .max(100, 'A pontuação deve ser menor ou igual a 100'),
  notes: z.string().optional(),
  studentId: z.string().uuid('ID de estudante inválido'),
});

export type CreateAssessmentFormValues = z.infer<typeof createAssessmentSchema>;

// Schema para atualização de avaliação
export const updateAssessmentSchema = z.object({
  date: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Data inválida',
    })
    .optional(),
  type: z.string().min(1, 'O tipo é obrigatório').optional(),
  score: z.coerce
    .number()
    .min(0, 'A pontuação deve ser maior ou igual a 0')
    .max(100, 'A pontuação deve ser menor ou igual a 100')
    .optional(),
  notes: z.string().optional(),
  studentId: z.string().uuid('ID de estudante inválido').optional(),
});

export type UpdateAssessmentFormValues = z.infer<typeof updateAssessmentSchema>;

// Schema para criação de intervenção
export const createInterventionSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de início inválida',
  }),
  endDate: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Data de término inválida',
    })
    .optional(),
  type: z.string().min(1, 'O tipo é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  status: z
    .enum(['ACTIVE', 'COMPLETED', 'CANCELLED'], {
      errorMap: () => ({ message: 'Selecione um status válido' }),
    })
    .optional(),
  notes: z.string().optional(),
  studentId: z.string().uuid('ID de estudante inválido'),
});

export type CreateInterventionFormValues = z.infer<typeof createInterventionSchema>;

// Schema para atualização de intervenção
export const updateInterventionSchema = z.object({
  startDate: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Data de início inválida',
    })
    .optional(),
  endDate: z
    .string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: 'Data de término inválida',
    })
    .optional(),
  type: z.string().min(1, 'O tipo é obrigatório').optional(),
  description: z.string().min(1, 'A descrição é obrigatória').optional(),
  status: z
    .enum(['ACTIVE', 'COMPLETED', 'CANCELLED'], {
      errorMap: () => ({ message: 'Selecione um status válido' }),
    })
    .optional(),
  notes: z.string().optional(),
  studentId: z.string().uuid('ID de estudante inválido').optional(),
});

export type UpdateInterventionFormValues = z.infer<typeof updateInterventionSchema>; 