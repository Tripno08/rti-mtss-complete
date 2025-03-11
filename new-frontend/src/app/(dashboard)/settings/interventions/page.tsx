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
const interventionSettingsSchema = z.object({
  // Configurações Gerais
  defaultDuration: z.coerce.number().min(1, 'A duração deve ser maior que 0'),
  minDuration: z.coerce.number().min(1, 'A duração mínima deve ser maior que 0'),
  maxDuration: z.coerce.number().min(1, 'A duração máxima deve ser maior que 0'),
  durationUnit: z.string().min(1, 'Selecione a unidade de duração'),
  
  // Tipos de Intervenção
  readingEnabled: z.boolean(),
  readingIntensity: z.string().min(1, 'Selecione a intensidade'),
  mathEnabled: z.boolean(),
  mathIntensity: z.string().min(1, 'Selecione a intensidade'),
  writingEnabled: z.boolean(),
  writingIntensity: z.string().min(1, 'Selecione a intensidade'),
  behavioralEnabled: z.boolean(),
  behavioralIntensity: z.string().min(1, 'Selecione a intensidade'),
  
  // Monitoramento
  progressFrequency: z.string().min(1, 'Selecione a frequência'),
  minDataPoints: z.coerce.number().min(1, 'Mínimo de 1 ponto de dados'),
  requireEvidence: z.boolean(),
  allowAdjustments: z.boolean(),
  
  // Critérios de Sucesso
  successThreshold: z.coerce.number().min(0).max(100, 'O limiar deve estar entre 0 e 100'),
  minSuccessfulSessions: z.coerce.number().min(1, 'Mínimo de 1 sessão'),
  requireConsistency: z.boolean(),
  consistencyPeriod: z.coerce.number().min(1, 'O período deve ser maior que 0'),
});

type InterventionSettingsForm = z.infer<typeof interventionSettingsSchema>;

export default function InterventionSettingsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InterventionSettingsForm>({
    resolver: zodResolver(interventionSettingsSchema),
    defaultValues: {
      defaultDuration: 6,
      minDuration: 4,
      maxDuration: 12,
      durationUnit: 'weeks',
      readingEnabled: true,
      readingIntensity: 'moderate',
      mathEnabled: true,
      mathIntensity: 'moderate',
      writingEnabled: true,
      writingIntensity: 'moderate',
      behavioralEnabled: true,
      behavioralIntensity: 'moderate',
      progressFrequency: 'weekly',
      minDataPoints: 3,
      requireEvidence: true,
      allowAdjustments: true,
      successThreshold: 80,
      minSuccessfulSessions: 6,
      requireConsistency: true,
      consistencyPeriod: 3,
    },
  });

  const onSubmit = async (data: InterventionSettingsForm) => {
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
          <h1 className="text-3xl font-bold tracking-tight">Configurações de Intervenção</h1>
          <p className="text-muted-foreground">
            Gerencie os parâmetros e critérios de intervenção do sistema
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Defina os parâmetros gerais das intervenções
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="defaultDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração Padrão</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Duração padrão das intervenções
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade de Duração</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="days">Dias</SelectItem>
                          <SelectItem value="weeks">Semanas</SelectItem>
                          <SelectItem value="months">Meses</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração Mínima</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Duração mínima permitida
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração Máxima</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Duração máxima permitida
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
              <CardTitle>Tipos de Intervenção</CardTitle>
              <CardDescription>
                Configure os tipos de intervenção disponíveis e suas intensidades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="readingEnabled"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Leitura</FormLabel>
                            <FormDescription>
                              Intervenções de leitura
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
                  <FormField
                    control={form.control}
                    name="readingIntensity"
                    render={({ field }) => (
                      <FormItem className="w-[180px]">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Intensidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="moderate">Moderada</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="mathEnabled"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Matemática</FormLabel>
                            <FormDescription>
                              Intervenções de matemática
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
                  <FormField
                    control={form.control}
                    name="mathIntensity"
                    render={({ field }) => (
                      <FormItem className="w-[180px]">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Intensidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="moderate">Moderada</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="writingEnabled"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Escrita</FormLabel>
                            <FormDescription>
                              Intervenções de escrita
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
                  <FormField
                    control={form.control}
                    name="writingIntensity"
                    render={({ field }) => (
                      <FormItem className="w-[180px]">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Intensidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="moderate">Moderada</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="behavioralEnabled"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Comportamental</FormLabel>
                            <FormDescription>
                              Intervenções comportamentais
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
                  <FormField
                    control={form.control}
                    name="behavioralIntensity"
                    render={({ field }) => (
                      <FormItem className="w-[180px]">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Intensidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="moderate">Moderada</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitoramento</CardTitle>
              <CardDescription>
                Configure os parâmetros de monitoramento das intervenções
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="progressFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência de Monitoramento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a frequência" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Diária</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="biweekly">Quinzenal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minDataPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mínimo de Pontos de Dados</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número mínimo de pontos de dados para análise
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="requireEvidence"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exigir Evidências</FormLabel>
                        <FormDescription>
                          Exigir evidências do progresso da intervenção
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
                  name="allowAdjustments"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Permitir Ajustes</FormLabel>
                        <FormDescription>
                          Permitir ajustes na intervenção durante sua execução
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
              <CardTitle>Critérios de Sucesso</CardTitle>
              <CardDescription>
                Configure os critérios para determinar o sucesso das intervenções
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="successThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limiar de Sucesso (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Porcentagem mínima para considerar sucesso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minSuccessfulSessions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mínimo de Sessões</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número mínimo de sessões bem-sucedidas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consistencyPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período de Consistência</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Período para manter o progresso consistente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="requireConsistency"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Exigir Consistência</FormLabel>
                      <FormDescription>
                        Exigir progresso consistente por um período
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