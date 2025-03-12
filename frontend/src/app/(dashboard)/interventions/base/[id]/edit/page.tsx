'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '@/lib/utils/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Enums
enum AreaIntervencao {
  LEITURA = 'LEITURA',
  ESCRITA = 'ESCRITA',
  MATEMATICA = 'MATEMATICA',
  COMPORTAMENTO = 'COMPORTAMENTO',
  SOCIOEMOCIONAL = 'SOCIOEMOCIONAL',
  ATENCAO = 'ATENCAO',
  ORGANIZACAO = 'ORGANIZACAO',
  OUTRO = 'OUTRO',
}

enum NivelIntervencao {
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
  TIER_3 = 'TIER_3',
}

enum FrequenciaAplicacao {
  DIARIA = 'DIARIA',
  SEMANAL = 'SEMANAL',
  QUINZENAL = 'QUINZENAL',
  MENSAL = 'MENSAL',
  BIMESTRAL = 'BIMESTRAL',
}

// Schema de validação
const formSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  descricao: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  objetivo: z.string().min(10, 'O objetivo deve ter pelo menos 10 caracteres'),
  nivel: z.nativeEnum(NivelIntervencao, {
    errorMap: () => ({ message: 'Selecione um nível de intervenção' }),
  }),
  area: z.nativeEnum(AreaIntervencao, {
    errorMap: () => ({ message: 'Selecione uma área de intervenção' }),
  }),
  tempoEstimado: z.string().min(1, 'Informe o tempo estimado'),
  frequencia: z.nativeEnum(FrequenciaAplicacao, {
    errorMap: () => ({ message: 'Selecione uma frequência de aplicação' }),
  }),
  materiaisNecessarios: z.string().optional(),
  evidenciaCientifica: z.string().optional(),
  fonteEvidencia: z.string().optional(),
  ativo: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditBaseInterventionPage() {
  const params = useParams();
  const id = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      objetivo: '',
      tempoEstimado: '',
      materiaisNecessarios: '',
      evidenciaCientifica: '',
      fonteEvidencia: '',
      ativo: true,
    },
  });

  useEffect(() => {
    fetchIntervention();
  }, [id]);

  const fetchIntervention = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/interventions/base/${id}`);
      const intervention = response.data;
      
      // Preencher o formulário com os dados da intervenção
      form.reset({
        nome: intervention.nome,
        descricao: intervention.descricao,
        objetivo: intervention.objetivo,
        nivel: intervention.nivel,
        area: intervention.area,
        tempoEstimado: intervention.tempoEstimado,
        frequencia: intervention.frequencia,
        materiaisNecessarios: intervention.materiaisNecessarios || '',
        evidenciaCientifica: intervention.evidenciaCientifica || '',
        fonteEvidencia: intervention.fonteEvidencia || '',
        ativo: intervention.ativo,
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes da intervenção:', error);
      toast.error('Erro ao carregar detalhes da intervenção.');
      router.push('/interventions/base');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await api.put(`/interventions/base/${id}`, data);
      toast.success('Intervenção base atualizada com sucesso!');
      router.push(`/interventions/base/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar intervenção base:', error);
      toast.error('Erro ao atualizar intervenção base. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAreaIntervencao = (area: AreaIntervencao) => {
    const areaMap = {
      [AreaIntervencao.LEITURA]: 'Leitura',
      [AreaIntervencao.ESCRITA]: 'Escrita',
      [AreaIntervencao.MATEMATICA]: 'Matemática',
      [AreaIntervencao.COMPORTAMENTO]: 'Comportamento',
      [AreaIntervencao.SOCIOEMOCIONAL]: 'Socioemocional',
      [AreaIntervencao.ATENCAO]: 'Atenção',
      [AreaIntervencao.ORGANIZACAO]: 'Organização',
      [AreaIntervencao.OUTRO]: 'Outro',
    };
    return areaMap[area] || area;
  };

  const formatNivelIntervencao = (nivel: NivelIntervencao) => {
    const nivelMap = {
      [NivelIntervencao.TIER_1]: 'Tier 1',
      [NivelIntervencao.TIER_2]: 'Tier 2',
      [NivelIntervencao.TIER_3]: 'Tier 3',
    };
    return nivelMap[nivel] || nivel;
  };

  const formatFrequenciaAplicacao = (frequencia: FrequenciaAplicacao) => {
    const frequenciaMap = {
      [FrequenciaAplicacao.DIARIA]: 'Diária',
      [FrequenciaAplicacao.SEMANAL]: 'Semanal',
      [FrequenciaAplicacao.QUINZENAL]: 'Quinzenal',
      [FrequenciaAplicacao.MENSAL]: 'Mensal',
      [FrequenciaAplicacao.BIMESTRAL]: 'Bimestral',
    };
    return frequenciaMap[frequencia] || frequencia;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/interventions/base/${id}`)}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Editar Intervenção Base</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Intervenção</CardTitle>
          <CardDescription>
            Atualize os campos abaixo para editar esta intervenção base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Intervenção</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome da intervenção" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área de Intervenção</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a área" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(AreaIntervencao).map((area) => (
                            <SelectItem key={area} value={area}>
                              {formatAreaIntervencao(area)}
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
                  name="nivel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Intervenção</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(NivelIntervencao).map((nivel) => (
                            <SelectItem key={nivel} value={nivel}>
                              {formatNivelIntervencao(nivel)}
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
                  name="frequencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência de Aplicação</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a frequência" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(FrequenciaAplicacao).map((freq) => (
                            <SelectItem key={freq} value={freq}>
                              {formatFrequenciaAplicacao(freq)}
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
                  name="tempoEstimado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo Estimado</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 30 minutos, 1 hora, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Ativo</FormLabel>
                        <FormDescription>
                          Marque esta opção para que a intervenção esteja disponível para uso
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva a intervenção em detalhes"
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
                name="objetivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o objetivo desta intervenção"
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
                name="materiaisNecessarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materiais Necessários</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liste os materiais necessários para esta intervenção (opcional)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="evidenciaCientifica"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evidência Científica</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva as evidências científicas que suportam esta intervenção (opcional)"
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
                  name="fonteEvidencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonte da Evidência</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Indique as fontes das evidências científicas (opcional)"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-end px-0 pb-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/interventions/base/${id}`)}
                  className="mr-2"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 