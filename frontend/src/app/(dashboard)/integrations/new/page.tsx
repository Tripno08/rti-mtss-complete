'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/utils/api';

// Esquema de validação para Google Classroom
const googleClassroomSchema = z.object({
  platform: z.literal('GOOGLE_CLASSROOM'),
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  clientId: z.string().min(5, 'ID do cliente é obrigatório'),
  clientSecret: z.string().min(5, 'Segredo do cliente é obrigatório'),
  redirectUri: z.string().url('URI de redirecionamento deve ser uma URL válida'),
  scopes: z.string().min(5, 'Escopos são obrigatórios'),
});

// Esquema de validação para Microsoft Teams
const microsoftTeamsSchema = z.object({
  platform: z.literal('MICROSOFT_TEAMS'),
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  clientId: z.string().min(5, 'ID do cliente é obrigatório'),
  clientSecret: z.string().min(5, 'Segredo do cliente é obrigatório'),
  tenantId: z.string().min(5, 'ID do tenant é obrigatório'),
  redirectUri: z.string().url('URI de redirecionamento deve ser uma URL válida'),
  scopes: z.string().min(5, 'Escopos são obrigatórios'),
});

// Esquema de validação para LTI
const ltiSchema = z.object({
  platform: z.literal('LTI'),
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  clientId: z.string().min(5, 'ID do cliente é obrigatório'),
  clientSecret: z.string().min(5, 'Segredo do cliente é obrigatório'),
  redirectUri: z.string().url('URI de redirecionamento deve ser uma URL válida'),
  scopes: z.string().min(5, 'Escopos são obrigatórios'),
});

// União dos esquemas
const formSchema = z.discriminatedUnion('platform', [
  googleClassroomSchema,
  microsoftTeamsSchema,
  ltiSchema,
]);

type FormValues = z.infer<typeof formSchema>;

export default function NewIntegrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const platform = searchParams?.get('platform') || 'GOOGLE_CLASSROOM';
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Definir valores padrão com base na plataforma
  const getDefaultValues = (): FormValues => {
    switch (platform) {
      case 'GOOGLE_CLASSROOM':
        return {
          platform: 'GOOGLE_CLASSROOM',
          name: '',
          clientId: '',
          clientSecret: '',
          redirectUri: `${window.location.origin}/api/integrations/google/callback`,
          scopes: 'https://www.googleapis.com/auth/classroom.courses.readonly,https://www.googleapis.com/auth/classroom.rosters.readonly',
        };
      case 'MICROSOFT_TEAMS':
        return {
          platform: 'MICROSOFT_TEAMS',
          name: '',
          clientId: '',
          clientSecret: '',
          tenantId: '',
          redirectUri: `${window.location.origin}/api/integrations/microsoft/callback`,
          scopes: 'User.Read,User.ReadBasic.All,Group.Read.All,EduRoster.ReadBasic.All',
        };
      case 'LTI':
        return {
          platform: 'LTI',
          name: '',
          clientId: '',
          clientSecret: '',
          redirectUri: `${window.location.origin}/api/integrations/lti/launch`,
          scopes: 'openid',
        };
      default:
        return {
          platform: 'GOOGLE_CLASSROOM',
          name: '',
          clientId: '',
          clientSecret: '',
          redirectUri: `${window.location.origin}/api/integrations/google/callback`,
          scopes: 'https://www.googleapis.com/auth/classroom.courses.readonly,https://www.googleapis.com/auth/classroom.rosters.readonly',
        };
    }
  };

  // Inicializar formulário
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  // Atualizar valores padrão quando a plataforma mudar
  useEffect(() => {
    form.reset(getDefaultValues());
  }, [platform, form]);

  // Enviar formulário
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/integrations', data);
      toast.success('Integração criada com sucesso!');
      router.push(`/integrations/${response.data.id}`);
    } catch (error) {
      console.error('Erro ao criar integração:', error);
      toast.error('Erro ao criar integração. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obter título da plataforma
  const getPlatformTitle = () => {
    switch (platform) {
      case 'GOOGLE_CLASSROOM':
        return 'Google Classroom';
      case 'MICROSOFT_TEAMS':
        return 'Microsoft Teams';
      case 'LTI':
        return 'LTI (Learning Tools Interoperability)';
      default:
        return 'Nova Integração';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Nova Integração: {getPlatformTitle()}</h1>
        <Button variant="outline" onClick={() => router.push('/integrations')}>
          Voltar
        </Button>
      </div>

      <Tabs defaultValue={platform} onValueChange={(value) => router.push(`/integrations/new?platform=${value}`)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="GOOGLE_CLASSROOM">Google Classroom</TabsTrigger>
          <TabsTrigger value="MICROSOFT_TEAMS">Microsoft Teams</TabsTrigger>
          <TabsTrigger value="LTI">LTI</TabsTrigger>
        </TabsList>

        <TabsContent value="GOOGLE_CLASSROOM">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Integração com Google Classroom</CardTitle>
              <CardDescription>
                Configure a integração com o Google Classroom para sincronizar turmas e alunos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Integração</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Google Classroom - Escola XYZ" {...field} />
                        </FormControl>
                        <FormDescription>
                          Um nome descritivo para identificar esta integração.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID do Cliente OAuth</FormLabel>
                        <FormControl>
                          <Input placeholder="ID do cliente do Google Cloud Console" {...field} />
                        </FormControl>
                        <FormDescription>
                          Obtido no Google Cloud Console ao criar um projeto OAuth.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Segredo do Cliente OAuth</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Segredo do cliente do Google Cloud Console" {...field} />
                        </FormControl>
                        <FormDescription>
                          Obtido junto com o ID do cliente no Google Cloud Console.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="redirectUri"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URI de Redirecionamento</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          URL para onde o Google redirecionará após a autenticação. Configure esta mesma URL no Google Cloud Console.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scopes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escopos de Permissão</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Escopos de permissão separados por vírgula. Os escopos padrão permitem acesso somente leitura às turmas e alunos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" type="button" onClick={() => router.push('/integrations')}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Salvando...' : 'Salvar Integração'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="MICROSOFT_TEAMS">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Integração com Microsoft Teams</CardTitle>
              <CardDescription>
                Configure a integração com o Microsoft Teams para sincronizar turmas e alunos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Integração</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Microsoft Teams - Escola XYZ" {...field} />
                        </FormControl>
                        <FormDescription>
                          Um nome descritivo para identificar esta integração.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID do Cliente (Application ID)</FormLabel>
                        <FormControl>
                          <Input placeholder="ID do aplicativo do Azure Portal" {...field} />
                        </FormControl>
                        <FormDescription>
                          Obtido no Azure Portal ao registrar um aplicativo.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Segredo do Cliente</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Segredo do cliente do Azure Portal" {...field} />
                        </FormControl>
                        <FormDescription>
                          Obtido ao criar um segredo de cliente no Azure Portal.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tenantId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID do Tenant</FormLabel>
                        <FormControl>
                          <Input placeholder="ID do tenant do Azure Portal" {...field} />
                        </FormControl>
                        <FormDescription>
                          ID do diretório (tenant) do Azure AD.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="redirectUri"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URI de Redirecionamento</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          URL para onde o Microsoft redirecionará após a autenticação. Configure esta mesma URL no Azure Portal.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scopes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escopos de Permissão</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Escopos de permissão separados por vírgula. Os escopos padrão permitem acesso às informações básicas de usuários e grupos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" type="button" onClick={() => router.push('/integrations')}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Salvando...' : 'Salvar Integração'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="LTI">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Integração LTI</CardTitle>
              <CardDescription>
                Configure a integração LTI para conectar com plataformas LMS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Integração</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Canvas LTI - Escola XYZ" {...field} />
                        </FormControl>
                        <FormDescription>
                          Um nome descritivo para identificar esta integração.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID do Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="ID do cliente LTI" {...field} />
                        </FormControl>
                        <FormDescription>
                          Identificador único para esta ferramenta LTI.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Segredo do Cliente</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Segredo compartilhado" {...field} />
                        </FormControl>
                        <FormDescription>
                          Segredo compartilhado para autenticação LTI.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="redirectUri"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URI de Lançamento</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          URL para onde a plataforma LMS redirecionará ao lançar a ferramenta.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scopes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escopos de Permissão</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Escopos de permissão para autenticação OpenID Connect.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" type="button" onClick={() => router.push('/integrations')}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Salvando...' : 'Salvar Integração'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 