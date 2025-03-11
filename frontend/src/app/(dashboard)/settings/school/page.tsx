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
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';

// Schema de validação
const schoolSettingsSchema = z.object({
  // Informações Básicas
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  address: z.string().min(3, 'O endereço deve ter pelo menos 3 caracteres'),
  phone: z.string().min(10, 'O telefone deve ter pelo menos 10 caracteres'),
  email: z.string().email('Email inválido'),
  website: z.string().url('URL inválida').optional(),
  
  // Configurações Acadêmicas
  schoolYear: z.string().min(1, 'Selecione o ano letivo'),
  gradeRange: z.object({
    start: z.string().min(1, 'Selecione a série inicial'),
    end: z.string().min(1, 'Selecione a série final'),
  }),
  useGradeSystem: z.boolean(),
  useClassSystem: z.boolean(),
  
  // Configurações de Notificação
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  parentPortalEnabled: z.boolean(),
  
  // Configurações de Relatório
  reportHeader: z.string().min(3, 'O cabeçalho deve ter pelo menos 3 caracteres'),
  reportFooter: z.string().min(3, 'O rodapé deve ter pelo menos 3 caracteres'),
  includeLogo: z.boolean(),
  includeSignature: z.boolean(),
});

type SchoolSettingsForm = z.infer<typeof schoolSettingsSchema>;

export default function SchoolSettingsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SchoolSettingsForm>({
    resolver: zodResolver(schoolSettingsSchema),
    defaultValues: {
      name: 'Escola Municipal João da Silva',
      address: 'Rua das Flores, 123 - Centro',
      phone: '(11) 1234-5678',
      email: 'contato@escola.edu.br',
      website: 'https://escola.edu.br',
      schoolYear: '2024',
      gradeRange: {
        start: '1',
        end: '5',
      },
      useGradeSystem: true,
      useClassSystem: true,
      emailNotifications: true,
      smsNotifications: false,
      parentPortalEnabled: true,
      reportHeader: 'Sistema Innerview - Relatório de Avaliação',
      reportFooter: '© 2024 Escola Municipal João da Silva - Todos os direitos reservados',
      includeLogo: true,
      includeSignature: true,
    },
  });

  const onSubmit = async (data: SchoolSettingsForm) => {
    setIsSubmitting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Implementar a chamada real à API
      console.log('Atualizando configurações:', data);
      
      toast.success('Configurações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold tracking-tight">Configurações da Escola</h1>
          <p className="text-muted-foreground">
            Gerencie as informações e configurações da escola
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Configure as informações básicas da escola
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Escola</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da escola" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Endereço completo da escola"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 0000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@escola.edu.br" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://escola.edu.br" {...field} />
                      </FormControl>
                      <FormDescription>Opcional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações Acadêmicas</CardTitle>
              <CardDescription>
                Configure os parâmetros acadêmicos da escola
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="schoolYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano Letivo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o ano" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gradeRange.start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Série Inicial</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a série" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((grade) => (
                            <SelectItem key={grade} value={grade.toString()}>
                              {grade}º Ano
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gradeRange.end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Série Final</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a série" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((grade) => (
                            <SelectItem key={grade} value={grade.toString()}>
                              {grade}º Ano
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="useGradeSystem"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Sistema de Séries</FormLabel>
                        <FormDescription>
                          Usar sistema de séries para organização
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useClassSystem"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Sistema de Turmas</FormLabel>
                        <FormDescription>
                          Usar sistema de turmas para organização
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
              <CardDescription>
                Configure as opções de notificação da escola
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Notificações por Email</FormLabel>
                      <FormDescription>
                        Enviar notificações por email
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smsNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Notificações por SMS</FormLabel>
                      <FormDescription>
                        Enviar notificações por SMS
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentPortalEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Portal dos Pais</FormLabel>
                      <FormDescription>
                        Habilitar acesso ao portal dos pais
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações de Relatório</CardTitle>
              <CardDescription>
                Configure o formato dos relatórios gerados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="reportHeader"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cabeçalho do Relatório</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Texto do cabeçalho dos relatórios"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reportFooter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rodapé do Relatório</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Texto do rodapé dos relatórios"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="includeLogo"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Incluir Logo</FormLabel>
                        <FormDescription>
                          Incluir logo da escola nos relatórios
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeSignature"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Incluir Assinatura</FormLabel>
                        <FormDescription>
                          Incluir campo para assinatura nos relatórios
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

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
    </div>
  );
} 