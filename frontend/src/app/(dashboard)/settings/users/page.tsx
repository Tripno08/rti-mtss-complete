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
const userSettingsSchema = z.object({
  // Configurações de Registro
  allowRegistration: z.boolean(),
  requireApproval: z.boolean(),
  defaultRole: z.string().min(1, 'Selecione o papel padrão'),
  registrationDomain: z.string().optional(),
  
  // Papéis e Permissões
  adminEnabled: z.boolean(),
  adminPermissions: z.object({
    manageUsers: z.boolean(),
    manageSettings: z.boolean(),
    manageData: z.boolean(),
  }),
  
  coordinatorEnabled: z.boolean(),
  coordinatorPermissions: z.object({
    manageInterventions: z.boolean(),
    manageAssessments: z.boolean(),
    viewReports: z.boolean(),
  }),
  
  specialistEnabled: z.boolean(),
  specialistPermissions: z.object({
    conductInterventions: z.boolean(),
    conductAssessments: z.boolean(),
    viewStudentData: z.boolean(),
  }),
  
  teacherEnabled: z.boolean(),
  teacherPermissions: z.object({
    viewOwnStudents: z.boolean(),
    submitAssessments: z.boolean(),
    requestInterventions: z.boolean(),
  }),
  
  // Segurança
  sessionTimeout: z.coerce.number().min(5, 'Mínimo de 5 minutos'),
  maxLoginAttempts: z.coerce.number().min(1, 'Mínimo de 1 tentativa'),
  passwordMinLength: z.coerce.number().min(6, 'Mínimo de 6 caracteres'),
  requirePasswordChange: z.boolean(),
  passwordExpiryDays: z.coerce.number().min(0, 'Não pode ser negativo'),
});

type UserSettingsForm = z.infer<typeof userSettingsSchema>;

export default function UserSettingsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserSettingsForm>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      allowRegistration: false,
      requireApproval: true,
      defaultRole: 'teacher',
      registrationDomain: '',
      adminEnabled: true,
      adminPermissions: {
        manageUsers: true,
        manageSettings: true,
        manageData: true,
      },
      coordinatorEnabled: true,
      coordinatorPermissions: {
        manageInterventions: true,
        manageAssessments: true,
        viewReports: true,
      },
      specialistEnabled: true,
      specialistPermissions: {
        conductInterventions: true,
        conductAssessments: true,
        viewStudentData: true,
      },
      teacherEnabled: true,
      teacherPermissions: {
        viewOwnStudents: true,
        submitAssessments: true,
        requestInterventions: true,
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requirePasswordChange: true,
      passwordExpiryDays: 90,
    },
  });

  const onSubmit = async (data: UserSettingsForm) => {
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
          <h1 className="text-3xl font-bold tracking-tight">Configurações de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os papéis e permissões dos usuários do sistema
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Registro</CardTitle>
              <CardDescription>
                Configure as opções de registro de novos usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="allowRegistration"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Permitir Registro</FormLabel>
                        <FormDescription>
                          Permitir que novos usuários se registrem no sistema
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
                  name="requireApproval"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exigir Aprovação</FormLabel>
                        <FormDescription>
                          Exigir aprovação de administrador para novos registros
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

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="defaultRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Papel Padrão</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o papel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="teacher">Professor</SelectItem>
                          <SelectItem value="specialist">Especialista</SelectItem>
                          <SelectItem value="coordinator">Coordenador</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Papel atribuído aos novos usuários
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domínio de Email</FormLabel>
                      <FormControl>
                        <Input placeholder="exemplo.com.br" {...field} />
                      </FormControl>
                      <FormDescription>
                        Restrinja registros a um domínio específico (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Papéis e Permissões</CardTitle>
              <CardDescription>
                Configure os papéis disponíveis e suas permissões
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="adminEnabled"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <FormLabel>Administrador</FormLabel>
                            <FormDescription>
                              Acesso total ao sistema
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="ml-6 space-y-2">
                    <FormField
                      control={form.control}
                      name="adminPermissions.manageUsers"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Gerenciar Usuários</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="adminPermissions.manageSettings"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Gerenciar Configurações</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="adminPermissions.manageData"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Gerenciar Dados</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="coordinatorEnabled"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <FormLabel>Coordenador</FormLabel>
                            <FormDescription>
                              Coordenação de intervenções e avaliações
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="ml-6 space-y-2">
                    <FormField
                      control={form.control}
                      name="coordinatorPermissions.manageInterventions"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Gerenciar Intervenções</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="coordinatorPermissions.manageAssessments"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Gerenciar Avaliações</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="coordinatorPermissions.viewReports"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Visualizar Relatórios</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="specialistEnabled"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <FormLabel>Especialista</FormLabel>
                            <FormDescription>
                              Condução de intervenções e avaliações
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="ml-6 space-y-2">
                    <FormField
                      control={form.control}
                      name="specialistPermissions.conductInterventions"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Conduzir Intervenções</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialistPermissions.conductAssessments"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Conduzir Avaliações</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialistPermissions.viewStudentData"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Visualizar Dados dos Estudantes</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="teacherEnabled"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <FormLabel>Professor</FormLabel>
                            <FormDescription>
                              Acesso básico ao sistema
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="ml-6 space-y-2">
                    <FormField
                      control={form.control}
                      name="teacherPermissions.viewOwnStudents"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Visualizar Próprios Estudantes</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="teacherPermissions.submitAssessments"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Enviar Avaliações</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="teacherPermissions.requestInterventions"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Solicitar Intervenções</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Configure os parâmetros de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="sessionTimeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo Limite da Sessão (minutos)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Tempo de inatividade antes do logout automático
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxLoginAttempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tentativas de Login</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número máximo de tentativas de login
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passwordMinLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamanho Mínimo da Senha</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número mínimo de caracteres na senha
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passwordExpiryDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiração da Senha (dias)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Dias até a senha expirar (0 para nunca)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="requirePasswordChange"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Exigir Troca de Senha</FormLabel>
                      <FormDescription>
                        Exigir troca de senha no primeiro acesso
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