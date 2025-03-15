'use client';

import { useState, useEffect } from 'react';
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
  Building,
} from 'lucide-react';
// import { useAuthStore } from '@/stores/auth-store';

// Schema de validação
const schoolSettingsSchema = z.object({
  schoolId: z.string().min(1, 'Selecione uma escola'),
  schoolName: z.string().min(3, 'O nome da escola deve ter pelo menos 3 caracteres'),
  address: z.string().min(3, 'O endereço deve ter pelo menos 3 caracteres'),
  phone: z.string().min(10, 'O telefone deve ter pelo menos 10 caracteres'),
  email: z.string().email('Email inválido'),
  website: z.string().url('URL inválida').optional(),
  logo: z.string().optional(),
});

const notificationSettingsSchema = z.object({
  schoolId: z.string().min(1, 'Selecione uma escola'),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  assessmentReminders: z.boolean(),
  interventionAlerts: z.boolean(),
  meetingReminders: z.boolean(),
  reportNotifications: z.boolean(),
});

const userSettingsSchema = z.object({
  schoolId: z.string().min(1, 'Selecione uma escola'),
  defaultRole: z.string().min(1, 'Selecione uma função padrão'),
  allowRegistration: z.boolean(),
  requireApproval: z.boolean(),
  sessionTimeout: z.string().min(1, 'Selecione um tempo limite'),
});

type SchoolSettingsForm = z.infer<typeof schoolSettingsSchema>;
type NotificationSettingsForm = z.infer<typeof notificationSettingsSchema>;
type UserSettingsForm = z.infer<typeof userSettingsSchema>;

// Dados mockados para escolas
const MOCK_SCHOOLS = [
  {
    id: '1',
    name: 'Escola Municipal João da Silva',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 1234-5678',
    email: 'contato@joaodasilva.edu.br',
    website: 'https://joaodasilva.edu.br',
    logo: '',
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: false,
      assessmentReminders: true,
      interventionAlerts: true,
      meetingReminders: true,
      reportNotifications: false,
    },
    userSettings: {
      defaultRole: 'teacher',
      allowRegistration: false,
      requireApproval: true,
      sessionTimeout: '30',
    }
  },
  {
    id: '2',
    name: 'Escola Estadual Maria Souza',
    address: 'Av. Principal, 456 - Centro',
    phone: '(11) 8765-4321',
    email: 'contato@mariasouza.edu.br',
    website: 'https://mariasouza.edu.br',
    logo: '',
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
      assessmentReminders: false,
      interventionAlerts: true,
      meetingReminders: false,
      reportNotifications: true,
    },
    userSettings: {
      defaultRole: 'coordinator',
      allowRegistration: true,
      requireApproval: true,
      sessionTimeout: '60',
    }
  },
  {
    id: '3',
    name: 'Colégio Particular ABC',
    address: 'Rua dos Estudantes, 789 - Jardim',
    phone: '(11) 2468-1357',
    email: 'contato@colegioabc.edu.br',
    website: 'https://colegioabc.edu.br',
    logo: '',
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: true,
      assessmentReminders: true,
      interventionAlerts: true,
      meetingReminders: true,
      reportNotifications: true,
    },
    userSettings: {
      defaultRole: 'admin',
      allowRegistration: false,
      requireApproval: true,
      sessionTimeout: '15',
    }
  }
];

// Simulando o usuário logado com acesso a múltiplas escolas
const MOCK_USER = {
  id: '1',
  name: 'Administrador',
  email: 'admin@example.com',
  role: 'admin',
  schools: ['1', '2', '3'] // IDs das escolas que o usuário tem acesso
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('school');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(MOCK_USER.schools[0]);
  const [selectedSchool, setSelectedSchool] = useState(MOCK_SCHOOLS.find(school => school.id === MOCK_USER.schools[0]));
  
  // const authStore = useAuthStore();
  // const user = authStore.user;

  const schoolForm = useForm<SchoolSettingsForm>({
    resolver: zodResolver(schoolSettingsSchema),
    defaultValues: {
      schoolId: selectedSchoolId,
      schoolName: selectedSchool?.name || '',
      address: selectedSchool?.address || '',
      phone: selectedSchool?.phone || '',
      email: selectedSchool?.email || '',
      website: selectedSchool?.website || '',
      logo: selectedSchool?.logo || '',
    },
  });

  const notificationForm = useForm<NotificationSettingsForm>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      schoolId: selectedSchoolId,
      ...selectedSchool?.notificationSettings,
    },
  });

  const userForm = useForm<UserSettingsForm>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      schoolId: selectedSchoolId,
      ...selectedSchool?.userSettings,
    },
  });

  // Atualizar os formulários quando a escola selecionada mudar
  useEffect(() => {
    const school = MOCK_SCHOOLS.find(school => school.id === selectedSchoolId);
    setSelectedSchool(school);
    
    if (school) {
      // Atualizar formulário de escola
      schoolForm.reset({
        schoolId: selectedSchoolId,
        schoolName: school.name,
        address: school.address,
        phone: school.phone,
        email: school.email,
        website: school.website,
        logo: school.logo,
      });
      
      // Atualizar formulário de notificações
      notificationForm.reset({
        schoolId: selectedSchoolId,
        ...school.notificationSettings,
      });
      
      // Atualizar formulário de usuários
      userForm.reset({
        schoolId: selectedSchoolId,
        ...school.userSettings,
      });
    }
  }, [selectedSchoolId, schoolForm, notificationForm, userForm]);

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
  };

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

  // Verificar se o usuário tem acesso a múltiplas escolas
  const hasMultipleSchools = MOCK_USER.schools.length > 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema Innerview
        </p>
      </div>

      {/* Seletor de escola (apenas se o usuário tiver acesso a múltiplas escolas) */}
      {hasMultipleSchools && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Selecione a Escola
            </CardTitle>
            <CardDescription>
              Escolha a escola para gerenciar suas configurações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSchoolId} onValueChange={handleSchoolChange}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Selecione uma escola" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_SCHOOLS
                  .filter(school => MOCK_USER.schools.includes(school.id))
                  .map(school => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

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
                  {/* Campo oculto para o ID da escola */}
                  <input type="hidden" {...schoolForm.register('schoolId')} />
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={schoolForm.control}
                      name="schoolName"
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
                      control={schoolForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço completo" {...field} />
                          </FormControl>
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
                          <FormControl>
                            <Input placeholder="(00) 0000-0000" {...field} />
                          </FormControl>
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
                          <FormControl>
                            <Input placeholder="contato@escola.edu.br" {...field} />
                          </FormControl>
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
                          <FormControl>
                            <Input placeholder="https://escola.edu.br" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={schoolForm.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="URL da logo" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL da imagem da logo da escola
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                    {isSubmitting ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
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
                Gerencie como e quando receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onSubmitNotificationSettings)} className="space-y-6">
                  {/* Campo oculto para o ID da escola */}
                  <input type="hidden" {...notificationForm.register('schoolId')} />
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Notificações por Email
                            </FormLabel>
                            <FormDescription>
                              Receba atualizações por email
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
                      control={notificationForm.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Notificações Push
                            </FormLabel>
                            <FormDescription>
                              Receba notificações no navegador
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
                      control={notificationForm.control}
                      name="assessmentReminders"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Lembretes de Avaliação
                            </FormLabel>
                            <FormDescription>
                              Receba lembretes sobre avaliações pendentes
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
                      control={notificationForm.control}
                      name="interventionAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Alertas de Intervenção
                            </FormLabel>
                            <FormDescription>
                              Receba alertas sobre intervenções necessárias
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
                      control={notificationForm.control}
                      name="meetingReminders"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Lembretes de Reunião
                            </FormLabel>
                            <FormDescription>
                              Receba lembretes sobre reuniões agendadas
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
                      control={notificationForm.control}
                      name="reportNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Notificações de Relatórios
                            </FormLabel>
                            <FormDescription>
                              Receba notificações quando novos relatórios estiverem disponíveis
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

                  <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                    {isSubmitting ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
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
                Gerencie as configurações de usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(onSubmitUserSettings)} className="space-y-6">
                  {/* Campo oculto para o ID da escola */}
                  <input type="hidden" {...userForm.register('schoolId')} />
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={userForm.control}
                      name="defaultRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Função Padrão</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma função padrão" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="coordinator">Coordenador</SelectItem>
                                <SelectItem value="teacher">Professor</SelectItem>
                                <SelectItem value="assistant">Assistente</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Função padrão para novos usuários
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
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um tempo limite" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 minutos</SelectItem>
                                <SelectItem value="30">30 minutos</SelectItem>
                                <SelectItem value="60">1 hora</SelectItem>
                                <SelectItem value="120">2 horas</SelectItem>
                                <SelectItem value="240">4 horas</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Tempo de inatividade antes do logout automático
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={userForm.control}
                      name="allowRegistration"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Permitir Registro
                            </FormLabel>
                            <FormDescription>
                              Permitir que novos usuários se registrem
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
                      control={userForm.control}
                      name="requireApproval"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Exigir Aprovação
                            </FormLabel>
                            <FormDescription>
                              Exigir aprovação de administrador para novos usuários
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

                  <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                    {isSubmitting ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 