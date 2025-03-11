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
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save } from 'lucide-react';

// Schema de validação
const rtiSettingsSchema = z.object({
  // Configurações Gerais
  schoolYear: z.string().min(1, 'Selecione o ano letivo'),
  screeningFrequency: z.string().min(1, 'Selecione a frequência de triagem'),
  interventionPeriod: z.string().min(1, 'Selecione o período de intervenção'),
  
  // Níveis de Intervenção
  tier1Threshold: z.coerce.number().min(0).max(100, 'O limiar deve estar entre 0 e 100'),
  tier2Threshold: z.coerce.number().min(0).max(100, 'O limiar deve estar entre 0 e 100'),
  tier3Threshold: z.coerce.number().min(0).max(100, 'O limiar deve estar entre 0 e 100'),
  
  // Notificações
  alertThreshold: z.coerce.number().min(0).max(100, 'O limiar deve estar entre 0 e 100'),
  progressAlerts: z.boolean(),
  interventionReminders: z.boolean(),
  assessmentReminders: z.boolean(),
  
  // Avaliações
  minAssessments: z.coerce.number().min(1, 'Mínimo de 1 avaliação'),
  assessmentPeriod: z.string().min(1, 'Selecione o período de avaliação'),
  autoProgress: z.boolean(),
});

type RtiSettingsForm = z.infer<typeof rtiSettingsSchema>;

export default function RtiSettingsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RtiSettingsForm>({
    resolver: zodResolver(rtiSettingsSchema),
    defaultValues: {
      schoolYear: '2024',
      screeningFrequency: 'bimonthly',
      interventionPeriod: '6weeks',
      tier1Threshold: 80,
      tier2Threshold: 60,
      tier3Threshold: 40,
      alertThreshold: 70,
      progressAlerts: true,
      interventionReminders: true,
      assessmentReminders: true,
      minAssessments: 3,
      assessmentPeriod: 'monthly',
      autoProgress: false,
    },
  });

  const onSubmit = async (data: RtiSettingsForm) => {
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
          <h1 className="text-3xl font-bold tracking-tight">Configurações RTI/MTSS</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema RTI/MTSS
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Defina as configurações básicas do sistema RTI/MTSS
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
                  name="screeningFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência de Triagem</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a frequência" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Mensal</SelectItem>
                          <SelectItem value="bimonthly">Bimestral</SelectItem>
                          <SelectItem value="quarterly">Trimestral</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interventionPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período de Intervenção</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o período" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="4weeks">4 Semanas</SelectItem>
                          <SelectItem value="6weeks">6 Semanas</SelectItem>
                          <SelectItem value="8weeks">8 Semanas</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Níveis de Intervenção</CardTitle>
              <CardDescription>
                Configure os limiares para cada nível de intervenção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="tier1Threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limiar Nível 1 (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Pontuação mínima para Nível 1
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tier2Threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limiar Nível 2 (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Pontuação mínima para Nível 2
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tier3Threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limiar Nível 3 (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Pontuação mínima para Nível 3
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
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure as notificações e alertas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="alertThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limiar de Alerta (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Pontuação que dispara alertas de risco
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-4" />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="progressAlerts"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Alertas de Progresso</FormLabel>
                        <FormDescription>
                          Receba alertas sobre o progresso dos estudantes
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
                  name="interventionReminders"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Lembretes de Intervenção</FormLabel>
                        <FormDescription>
                          Receba lembretes sobre intervenções agendadas
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
                  name="assessmentReminders"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Lembretes de Avaliação</FormLabel>
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avaliações</CardTitle>
              <CardDescription>
                Configure os parâmetros de avaliação do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="minAssessments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mínimo de Avaliações</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número mínimo de avaliações por período
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessmentPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período de Avaliação</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o período" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="biweekly">Quinzenal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />

              <FormField
                control={form.control}
                name="autoProgress"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Progressão Automática</FormLabel>
                      <FormDescription>
                        Permitir progressão automática entre níveis baseada em avaliações
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