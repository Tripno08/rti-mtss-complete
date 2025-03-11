'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

// Schema de validação
const documentSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  type: z.string().min(1, 'Selecione o tipo de documento'),
  category: z.string().min(1, 'Selecione a categoria'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived'], {
    required_error: 'Selecione o status do documento',
  }),
});

type DocumentForm = z.infer<typeof documentSchema>;

interface Document extends DocumentForm {
  id: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  fileUrl: string;
  fileName: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditDocumentPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DocumentForm>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      type: '',
      category: '',
      description: '',
      tags: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      try {
        // Simulando uma chamada de API
        setTimeout(() => {
          const mockDocument: Document = {
            id: params.id,
            title: 'Formulário de Avaliação Inicial',
            type: 'form',
            category: 'assessment',
            description: 'Formulário padrão para avaliação inicial de estudantes no programa Innerview. Inclui seções para avaliação acadêmica, comportamental e social.',
            createdAt: '2024-02-15T10:00:00',
            updatedAt: '2024-02-15T10:00:00',
            author: 'Maria Santos',
            status: 'published',
            tags: 'avaliação,formulário,inicial,RTI',
            fileUrl: '#',
            fileName: 'formulario-avaliacao-inicial.pdf',
          };

          form.reset({
            title: mockDocument.title,
            type: mockDocument.type,
            category: mockDocument.category,
            description: mockDocument.description,
            tags: mockDocument.tags,
            status: mockDocument.status,
          });

          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Erro ao buscar detalhes do documento:', error);
        toast.error('Não foi possível carregar os detalhes do documento. Tente novamente mais tarde.');
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [params.id, form]);

  const onSubmit = async (data: DocumentForm) => {
    setIsSubmitting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Implementar a chamada real à API
      console.log('Atualizando documento:', params.id, data);
      
      toast.success('Documento atualizado com sucesso!');
      router.push(`/documents/${params.id}`);
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      toast.error('Erro ao atualizar documento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Documento</h1>
          <p className="text-muted-foreground">
            Atualize as informações do documento
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Documento</CardTitle>
          <CardDescription>
            Edite os dados do documento conforme necessário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título do documento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="form">Formulário</SelectItem>
                          <SelectItem value="report">Relatório</SelectItem>
                          <SelectItem value="plan">Plano</SelectItem>
                          <SelectItem value="guide">Guia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="assessment">Avaliação</SelectItem>
                          <SelectItem value="intervention">Intervenção</SelectItem>
                          <SelectItem value="monitoring">Monitoramento</SelectItem>
                          <SelectItem value="resources">Recursos</SelectItem>
                          <SelectItem value="reports">Relatórios</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                          <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição detalhada do documento"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tags separadas por vírgula"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Adicione tags para facilitar a busca (opcional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 