'use client';

import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  School,
  Users,
  Bell,
  Save,
} from 'lucide-react';

// Schema de validação
const schoolSettingsSchema = z.object({
  schoolName: z.string().min(3, 'O nome da escola deve ter pelo menos 3 caracteres'),
  address: z.string().min(3, 'O endereço deve ter pelo menos 3 caracteres'),
  phone: z.string().min(10, 'O telefone deve ter pelo menos 10 caracteres'),
  email: z.string().email('Email inválido'),
  website: z.string().url('URL inválida').optional(),
  logo: z.string().optional(),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  assessmentReminders: z.boolean(),
  interventionAlerts: z.boolean(),
  meetingReminders: z.boolean(),
  reportNotifications: z.boolean(),
});

const userSettingsSchema = z.object({
  defaultRole: z.string().min(1, 'Selecione uma função padrão'),
  allowRegistration: z.boolean(),
  requireApproval: z.boolean(),
  sessionTimeout: z.string().min(1, 'Selecione um tempo limite'),
});

type SchoolSettingsForm = z.infer<typeof schoolSettingsSchema>;
type NotificationSettingsForm = z.infer<typeof notificationSettingsSchema>;
type UserSettingsForm = z.infer<typeof userSettingsSchema>;

// Dados simulados
const mockSchoolSettings = {
  schoolName: 'Escola Municipal João da Silva',
  address: 'Rua das Flores, 123 - Centro',
  phone: '(11) 1234-5678',
  email: 'contato@escola.edu.br',
  website: 'https://escola.edu.br',
  logo: '',
};

const mockNotificationSettings = {
  emailNotifications: true,
  pushNotifications: false,
  assessmentReminders: true,
  interventionAlerts: true,
  meetingReminders: true,
  reportNotifications: false,
};

const mockUserSettings = {
  defaultRole: 'teacher',
  allowRegistration: false,
  requireApproval: true,
  sessionTimeout: '30',
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('school');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schoolForm = useForm<SchoolSettingsForm>({
    resolver: zodResolver(schoolSettingsSchema),
    defaultValues: mockSchoolSettings,
  });

  const notificationForm = useForm<NotificationSettingsForm>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: mockNotificationSettings,
  });

  const userForm = useForm<UserSettingsForm>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: mockUserSettings,
  });

  const onSubmitSchoolSettings = async (data: SchoolSettingsForm) => {
    setIsSubmitting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar a chamada real à API
      console.log('Atualizando configurações da escola:', data);
      
      toast.success('Configurações da escola atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitNotificationSettings = async (data: NotificationSettingsForm) => {
    setIsSubmitting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar a chamada real à API
      console.log('Atualizando configurações de notificação:', data);
      
      toast.success('Configurações de notificação atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitUserSettings = async (data: UserSettingsForm) => {
    setIsSubmitting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar a chamada real à API
      console.log('Atualizando configurações de usuário:', data);
      
      toast.success('Configurações de usuário atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema RTI/MTSS
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="school" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            Escola
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Escola</CardTitle>
              <CardDescription>
                Informações básicas da instituição
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...schoolForm}>
                <form onSubmit={schoolForm.handleSubmit(onSubmitSchoolSettings)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={schoolForm.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Escola</FormLabel>
                          <div>
                            <Input placeholder="Nome da escola" {...field} />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={schoolForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div>
                            <Input type="email" placeholder="Email da escola" {...field} />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={schoolForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <div>
                            <Input placeholder="Telefone da escola" {...field} />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={schoolForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <div>
                            <Input placeholder="Website da escola" {...field} />
                          </div>
                          <FormDescription>Opcional</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={schoolForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <div>
                          <Textarea
                            placeholder="Endereço completo da escola"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Gerencie as preferências de notificação do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onSubmitNotificationSettings)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notificações por Email</FormLabel>
                            <FormDescription>
                              Receba atualizações importantes por email
                            </FormDescription>
                          </div>
                          <div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notificações Push</FormLabel>
                            <FormDescription>
                              Receba notificações em tempo real no navegador
                            </FormDescription>
                          </div>
                          <div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="assessmentReminders"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Lembretes de Avaliação</FormLabel>
                            <FormDescription>
                              Receba lembretes sobre avaliações pendentes
                            </FormDescription>
                          </div>
                          <div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="interventionAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Alertas de Intervenção</FormLabel>
                            <FormDescription>
                              Receba alertas sobre intervenções que precisam de atenção
                            </FormDescription>
                          </div>
                          <div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="meetingReminders"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Lembretes de Reunião</FormLabel>
                            <FormDescription>
                              Receba lembretes sobre reuniões agendadas
                            </FormDescription>
                          </div>
                          <div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="reportNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notificações de Relatórios</FormLabel>
                            <FormDescription>
                              Receba notificações quando novos relatórios estiverem disponíveis
                            </FormDescription>
                          </div>
                          <div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Usuários</CardTitle>
              <CardDescription>
                Gerencie as configurações de acesso e segurança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(onSubmitUserSettings)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={userForm.control}
                      name="defaultRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Função Padrão</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a função padrão" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="teacher">Professor</SelectItem>
                              <SelectItem value="specialist">Especialista</SelectItem>
                              <SelectItem value="coordinator">Coordenador</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Função atribuída aos novos usuários
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={userForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo Limite da Sessão</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tempo limite" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutos</SelectItem>
                              <SelectItem value="30">30 minutos</SelectItem>
                              <SelectItem value="60">1 hora</SelectItem>
                              <SelectItem value="120">2 horas</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Tempo de inatividade antes do logout automático
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={userForm.control}
                      name="allowRegistration"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Permitir Registro</FormLabel>
                            <FormDescription>
                              Permitir que novos usuários se registrem no sistema
                            </FormDescription>
                          </div>
                          <div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={userForm.control}
                      name="requireApproval"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Exigir Aprovação</FormLabel>
                            <FormDescription>
                              Exigir aprovação de administrador para novos registros
                            </FormDescription>
                          </div>
                          <div>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
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