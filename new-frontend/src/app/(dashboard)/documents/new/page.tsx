'use client';

import { useState } from 'react';
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
import { ArrowLeft, Save, Upload } from 'lucide-react';

// Schema de validação
const documentSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  type: z.string().min(1, 'Selecione o tipo de documento'),
  category: z.string().min(1, 'Selecione a categoria'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  file: z.any().optional(), // TODO: Implementar validação de arquivo
  tags: z.string().optional(),
});

type DocumentForm = z.infer<typeof documentSchema>;

export default function NewDocumentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<DocumentForm>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      type: '',
      category: '',
      description: '',
      tags: '',
    },
  });

  const onSubmit = async (data: DocumentForm) => {
    if (!selectedFile) {
      toast.error('Por favor, selecione um arquivo');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Implementar o upload real do arquivo e a chamada à API
      console.log('Criando documento:', { ...data, file: selectedFile });
      
      toast.success('Documento criado com sucesso!');
      router.push('/documents');
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      toast.error('Erro ao criar documento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Novo Documento</h1>
          <p className="text-muted-foreground">
            Adicione um novo documento ao sistema RTI/MTSS
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Documento</CardTitle>
          <CardDescription>
            Preencha os dados do novo documento
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

              <FormItem>
                <FormLabel>Arquivo</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      className="flex-1"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        {selectedFile.name}
                      </p>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX
                </FormDescription>
                <FormMessage />
              </FormItem>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-bounce" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Criar Documento
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 