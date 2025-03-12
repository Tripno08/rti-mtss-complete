'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/utils/api';

// Esquema de validação para webhook
const webhookFormSchema = z.object({
  url: z.string().url('URL deve ser válida'),
  events: z.string().min(1, 'Selecione pelo menos um evento'),
  secret: z.string().optional(),
});

type WebhookFormValues = z.infer<typeof webhookFormSchema>;

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<{ id: string; name: string; platform: string }[]>([]);
  const router = useRouter();

  // Inicializar formulário
  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      url: '',
      events: 'student.created,student.updated,assessment.created,intervention.created',
      secret: '',
    },
  });

  // Buscar integrações
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const response = await api.get('/integrations');
        setIntegrations(response.data);
        if (response.data.length > 0) {
          setSelectedIntegrationId(response.data[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar integrações:', error);
        toast.error('Erro ao carregar integrações. Tente novamente mais tarde.');
      }
    };

    fetchIntegrations();
  }, []);

  // Buscar webhooks quando a integração selecionada mudar
  useEffect(() => {
    if (!selectedIntegrationId) return;

    const fetchWebhooks = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/integrations/${selectedIntegrationId}/webhooks`);
        setWebhooks(response.data);
      } catch (error) {
        console.error('Erro ao buscar webhooks:', error);
        toast.error('Erro ao carregar webhooks. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebhooks();
  }, [selectedIntegrationId]);

  // Enviar formulário
  const onSubmit = async (data: WebhookFormValues) => {
    if (!selectedIntegrationId) {
      toast.error('Selecione uma integração primeiro');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/integrations/${selectedIntegrationId}/webhooks`, {
        ...data,
        events: data.events.split(',').map(e => e.trim()),
      });
      
      toast.success('Webhook registrado com sucesso!');
      form.reset();
      
      // Recarregar webhooks
      const response = await api.get(`/integrations/${selectedIntegrationId}/webhooks`);
      setWebhooks(response.data);
    } catch (error) {
      console.error('Erro ao registrar webhook:', error);
      toast.error('Erro ao registrar webhook. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternar status do webhook
  const toggleWebhookStatus = async (webhookId: string, currentStatus: boolean) => {
    try {
      await api.put(`/webhooks/${webhookId}`, {
        active: !currentStatus,
      });
      
      // Atualizar estado local
      setWebhooks(webhooks.map(webhook => 
        webhook.id === webhookId 
          ? { ...webhook, active: !currentStatus } 
          : webhook
      ));
      
      toast.success(`Webhook ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao alterar status do webhook:', error);
      toast.error('Erro ao alterar status do webhook. Tente novamente mais tarde.');
    }
  };

  // Excluir webhook
  const deleteWebhook = async (webhookId: string) => {
    if (!confirm('Tem certeza que deseja excluir este webhook?')) return;
    
    try {
      await api.delete(`/webhooks/${webhookId}`);
      
      // Atualizar estado local
      setWebhooks(webhooks.filter(webhook => webhook.id !== webhookId));
      
      toast.success('Webhook excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir webhook:', error);
      toast.error('Erro ao excluir webhook. Tente novamente mais tarde.');
    }
  };

  // Formatar eventos para exibição
  const formatEvents = (events: string[]) => {
    if (events.length <= 2) return events.join(', ');
    return `${events.slice(0, 2).join(', ')} +${events.length - 2}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
        <Button variant="outline" onClick={() => router.push('/integrations')}>
          Voltar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Registrar Novo Webhook</CardTitle>
            <CardDescription>
              Configure webhooks para receber notificações de eventos do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Integração</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedIntegrationId || ''}
                      onChange={(e) => setSelectedIntegrationId(e.target.value)}
                      disabled={integrations.length === 0}
                    >
                      {integrations.length === 0 ? (
                        <option value="">Nenhuma integração disponível</option>
                      ) : (
                        integrations.map((integration) => (
                          <option key={integration.id} value={integration.id}>
                            {integration.name} ({integration.platform})
                          </option>
                        ))
                      )}
                    </select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Selecione a integração para a qual deseja configurar webhooks.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL do Webhook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://seu-servidor.com/webhook" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL para onde os eventos serão enviados.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="events"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eventos</FormLabel>
                        <FormControl>
                          <Textarea placeholder="student.created,assessment.created" {...field} />
                        </FormControl>
                        <FormDescription>
                          Lista de eventos separados por vírgula. Eventos disponíveis: student.created, student.updated, assessment.created, assessment.updated, intervention.created, intervention.updated
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Segredo (opcional)</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Segredo para verificação de assinatura" {...field} />
                        </FormControl>
                        <FormDescription>
                          Segredo usado para verificar a autenticidade dos eventos. Se não fornecido, um será gerado automaticamente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting || !selectedIntegrationId}>
                    {isSubmitting ? 'Registrando...' : 'Registrar Webhook'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhooks Registrados</CardTitle>
            <CardDescription>
              Gerencie os webhooks configurados para esta integração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Carregando webhooks...</div>
            ) : webhooks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum webhook registrado para esta integração.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Eventos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium truncate max-w-[150px]" title={webhook.url}>
                        {webhook.url}
                      </TableCell>
                      <TableCell>
                        <span title={webhook.events.join(', ')}>
                          {formatEvents(webhook.events)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={webhook.active ? 'default' : 'secondary'}>
                          {webhook.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleWebhookStatus(webhook.id, webhook.active)}
                        >
                          {webhook.active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteWebhook(webhook.id)}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sobre Webhooks</CardTitle>
          <CardDescription>
            Informações sobre como usar webhooks no sistema Innerview.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">O que são webhooks?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Webhooks são callbacks HTTP que são acionados quando determinados eventos ocorrem no sistema. Eles permitem que sistemas externos sejam notificados em tempo real sobre mudanças no sistema Innerview.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Formato dos eventos</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Os eventos são enviados como requisições HTTP POST com um corpo JSON contendo:
            </p>
            <pre className="bg-muted p-4 rounded-md mt-2 text-xs overflow-auto">
              {JSON.stringify({
                event: 'student.created',
                timestamp: new Date().toISOString(),
                data: {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  name: 'Nome do Aluno',
                  // outros dados específicos do evento
                }
              }, null, 2)}
            </pre>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Verificação de assinatura</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Cada requisição webhook inclui um cabeçalho <code>X-Webhook-Signature</code> que contém uma assinatura HMAC-SHA256 do corpo da requisição, usando o segredo do webhook como chave. Você deve verificar esta assinatura para garantir que a requisição é autêntica.
            </p>
            <pre className="bg-muted p-4 rounded-md mt-2 text-xs overflow-auto">
              {`// Exemplo em Node.js
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const calculatedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature),
    Buffer.from(signature)
  );
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 