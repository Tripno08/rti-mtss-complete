'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/utils/api';

// Definindo a interface para o erro da API
interface ApiErrorResponse {
  data?: {
    message?: string;
  };
}

interface ApiError {
  response?: ApiErrorResponse;
}

const formSchema = z.object({
  email: z.string().email('Email inválido'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setIsSubmitted(true);
      toast.success('Instruções de recuperação enviadas para seu email.');
    } catch (error: unknown) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      
      // Mensagem de erro personalizada com base na resposta da API
      const apiError = error as ApiError;
      let errorMessage = 'Erro ao solicitar recuperação de senha. Tente novamente.';
      
      if (apiError.response && apiError.response.data && apiError.response.data.message) {
        errorMessage = apiError.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
          <CardDescription>
            Digite seu email para receber instruções de recuperação de senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Enviamos um email com instruções para recuperar sua senha. 
                Por favor, verifique sua caixa de entrada.
              </p>
              <Button asChild className="mt-4">
                <Link href="/login">Voltar para o Login</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu.email@exemplo.com"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Enviar Instruções'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground w-full text-center">
            <Link href="/login" className="text-primary hover:underline">
              Voltar para o Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 