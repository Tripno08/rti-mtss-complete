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
const assessmentSettingsSchema = z.object({
  // Configurações de Pontuação
  maxScore: z.coerce.number().min(1, 'A pontuação máxima deve ser maior que 0'),
  passingScore: z.coerce.number().min(0, 'A pontuação mínima não pode ser negativa'),
  usePercentage: z.boolean(),
  allowPartialScores: z.boolean(),
  
  // Tipos de Avaliação
  readingEnabled: z.boolean(),
  readingWeight: z.coerce.number().min(0).max(100, 'O peso deve estar entre 0 e 100'),
  mathEnabled: z.boolean(),
  mathWeight: z.coerce.number().min(0).max(100, 'O peso deve estar entre 0 e 100'),
  writingEnabled: z.boolean(),
  writingWeight: z.coerce.number().min(0).max(100, 'O peso deve estar entre 0 e 100'),
  behavioralEnabled: z.boolean(),
  behavioralWeight: z.coerce.number().min(0).max(100, 'O peso deve estar entre 0 e 100'),
  
  // Critérios de Avaliação
  minEvaluators: z.coerce.number().min(1, 'Mínimo de 1 avaliador'),
  requireConsensus: z.boolean(),
  consensusThreshold: z.coerce.number().min(0).max(100, 'O limiar deve estar entre 0 e 100'),
  allowComments: z.boolean(),
  requireEvidence: z.boolean(),
  
  // Períodos de Avaliação
  defaultPeriod: z.string().min(1, 'Selecione o período padrão'),
  gracePercentage: z.coerce.number().min(0).max(100, 'A porcentagem deve estar entre 0 e 100'),
  allowEarlyAssessment: z.boolean(),
  requireJustification: z.boolean(),
});

type AssessmentSettingsForm = z.infer<typeof assessmentSettingsSchema>;

export default function AssessmentSettingsPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AssessmentSettingsForm>({
    resolver: zodResolver(assessmentSettingsSchema),
    defaultValues: {
      maxScore: 100,
      passingScore: 60,
      usePercentage: true,
      allowPartialScores: true,
      readingEnabled: true,
      readingWeight: 25,
      mathEnabled: true,
      mathWeight: 25,
      writingEnabled: true,
      writingWeight: 25,
      behavioralEnabled: true,
      behavioralWeight: 25,
      minEvaluators: 2,
      requireConsensus: true,
      consensusThreshold: 80,
      allowComments: true,
      requireEvidence: true,
      defaultPeriod: 'monthly',
      gracePercentage: 10,
      allowEarlyAssessment: false,
      requireJustification: true,
    },
  });

  const onSubmit = async (data: AssessmentSettingsForm) => {
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
          <h1 className="text-3xl font-bold tracking-tight">Configurações de Avaliação</h1>
          <p className="text-muted-foreground">
            Gerencie os parâmetros e critérios de avaliação do sistema
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pontuação</CardTitle>
              <CardDescription>
                Defina os parâmetros de pontuação das avaliações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="maxScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pontuação Máxima</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Valor máximo possível nas avaliações
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pontuação Mínima</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Pontuação mínima para aprovação
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="usePercentage"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Usar Porcentagem</FormLabel>
                        <FormDescription>
                          Exibir pontuações em formato percentual
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
                  name="allowPartialScores"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Pontuações Parciais</FormLabel>
                        <FormDescription>
                          Permitir pontuações parciais nas avaliações
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
              <CardTitle>Tipos de Avaliação</CardTitle>
              <CardDescription>
                Configure os tipos de avaliação disponíveis e seus pesos
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
                              Avaliações de competência em leitura
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
                    name="readingWeight"
                    render={({ field }) => (
                      <FormItem className="w-[100px]">
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription className="text-center">
                          Peso (%)
                        </FormDescription>
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
                              Avaliações de competência matemática
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
                    name="mathWeight"
                    render={({ field }) => (
                      <FormItem className="w-[100px]">
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription className="text-center">
                          Peso (%)
                        </FormDescription>
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
                              Avaliações de competência em escrita
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
                    name="writingWeight"
                    render={({ field }) => (
                      <FormItem className="w-[100px]">
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription className="text-center">
                          Peso (%)
                        </FormDescription>
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
                              Avaliações de aspectos comportamentais
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
                    name="behavioralWeight"
                    render={({ field }) => (
                      <FormItem className="w-[100px]">
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription className="text-center">
                          Peso (%)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Critérios de Avaliação</CardTitle>
              <CardDescription>
                Configure os critérios e requisitos para avaliações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="minEvaluators"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mínimo de Avaliadores</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número mínimo de avaliadores por avaliação
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consensusThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limiar de Consenso (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Porcentagem mínima para considerar consenso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="requireConsensus"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exigir Consenso</FormLabel>
                        <FormDescription>
                          Exigir consenso entre avaliadores
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
                  name="allowComments"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Permitir Comentários</FormLabel>
                        <FormDescription>
                          Permitir comentários nas avaliações
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
                  name="requireEvidence"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exigir Evidências</FormLabel>
                        <FormDescription>
                          Exigir evidências para suportar avaliações
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
              <CardTitle>Períodos de Avaliação</CardTitle>
              <CardDescription>
                Configure os períodos e prazos para avaliações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="defaultPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período Padrão</FormLabel>
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
                          <SelectItem value="bimonthly">Bimestral</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Período padrão entre avaliações
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gracePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período de Tolerância (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Porcentagem de tolerância no prazo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="allowEarlyAssessment"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Permitir Avaliação Antecipada</FormLabel>
                        <FormDescription>
                          Permitir avaliações antes do período padrão
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
                  name="requireJustification"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Exigir Justificativa</FormLabel>
                        <FormDescription>
                          Exigir justificativa para avaliações fora do prazo
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