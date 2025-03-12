'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/utils/api';

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

// Interface
interface BaseIntervention {
  id: string;
  nome: string;
  descricao: string;
  objetivo: string;
  nivel: NivelIntervencao;
  area: AreaIntervencao;
  tempoEstimado: string;
  frequencia: FrequenciaAplicacao;
  materiaisNecessarios?: string;
  evidenciaCientifica?: string;
  fonteEvidencia?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BaseInterventionDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [intervention, setIntervention] = useState<BaseIntervention | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchIntervention();
  }, [id]);

  const fetchIntervention = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/interventions/base/${id}`);
      setIntervention(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes da intervenção:', error);
      toast.error('Erro ao carregar detalhes da intervenção.');
      router.push('/interventions/base');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!intervention) return;
    
    try {
      await api.patch(`/interventions/base/${id}`, { ativo: !intervention.ativo });
      toast.success(`Intervenção ${intervention.ativo ? 'desativada' : 'ativada'} com sucesso.`);
      fetchIntervention();
    } catch (error) {
      console.error('Erro ao alterar status da intervenção:', error);
      toast.error('Erro ao alterar status da intervenção.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta intervenção base? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete(`/interventions/base/${id}`);
        toast.success('Intervenção base excluída com sucesso.');
        router.push('/interventions/base');
      } catch (error) {
        console.error('Erro ao excluir intervenção base:', error);
        toast.error('Erro ao excluir intervenção base.');
      }
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

  const getBadgeColorForNivel = (nivel: NivelIntervencao) => {
    const colorMap = {
      [NivelIntervencao.TIER_1]: 'bg-green-100 text-green-800',
      [NivelIntervencao.TIER_2]: 'bg-yellow-100 text-yellow-800',
      [NivelIntervencao.TIER_3]: 'bg-red-100 text-red-800',
    };
    return colorMap[nivel] || 'bg-gray-100 text-gray-800';
  };

  const getBadgeColorForArea = (area: AreaIntervencao) => {
    const colorMap = {
      [AreaIntervencao.LEITURA]: 'bg-blue-100 text-blue-800',
      [AreaIntervencao.ESCRITA]: 'bg-indigo-100 text-indigo-800',
      [AreaIntervencao.MATEMATICA]: 'bg-purple-100 text-purple-800',
      [AreaIntervencao.COMPORTAMENTO]: 'bg-orange-100 text-orange-800',
      [AreaIntervencao.SOCIOEMOCIONAL]: 'bg-pink-100 text-pink-800',
      [AreaIntervencao.ATENCAO]: 'bg-cyan-100 text-cyan-800',
      [AreaIntervencao.ORGANIZACAO]: 'bg-teal-100 text-teal-800',
      [AreaIntervencao.OUTRO]: 'bg-gray-100 text-gray-800',
    };
    return colorMap[area] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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

  if (!intervention) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Intervenção não encontrada</h2>
          <p className="text-gray-500 mb-4">A intervenção solicitada não foi encontrada ou não está disponível.</p>
          <Button onClick={() => router.push('/interventions/base')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/interventions/base')}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">{intervention.nome}</h1>
          {intervention.ativo ? (
            <Badge className="ml-4 bg-green-100 text-green-800">Ativo</Badge>
          ) : (
            <Badge className="ml-4 bg-gray-100 text-gray-800">Inativo</Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleToggleStatus}
          >
            {intervention.ativo ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Desativar
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Ativar
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/interventions/base/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes da Intervenção</CardTitle>
            <CardDescription>Informações detalhadas sobre esta intervenção base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700 whitespace-pre-line">{intervention.descricao}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Objetivo</h3>
              <p className="text-gray-700 whitespace-pre-line">{intervention.objetivo}</p>
            </div>
            
            {intervention.materiaisNecessarios && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Materiais Necessários</h3>
                  <p className="text-gray-700 whitespace-pre-line">{intervention.materiaisNecessarios}</p>
                </div>
              </>
            )}
            
            {(intervention.evidenciaCientifica || intervention.fonteEvidencia) && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Evidência Científica</h3>
                  {intervention.evidenciaCientifica && (
                    <p className="text-gray-700 whitespace-pre-line mb-4">{intervention.evidenciaCientifica}</p>
                  )}
                  {intervention.fonteEvidencia && (
                    <div>
                      <h4 className="text-md font-medium mb-1">Fonte:</h4>
                      <p className="text-gray-700 whitespace-pre-line">{intervention.fonteEvidencia}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Área de Intervenção</dt>
                  <dd className="mt-1">
                    <Badge className={getBadgeColorForArea(intervention.area)}>
                      {formatAreaIntervencao(intervention.area)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nível de Intervenção</dt>
                  <dd className="mt-1">
                    <Badge className={getBadgeColorForNivel(intervention.nivel)}>
                      {formatNivelIntervencao(intervention.nivel)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tempo Estimado</dt>
                  <dd className="mt-1 text-gray-900">{intervention.tempoEstimado}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Frequência de Aplicação</dt>
                  <dd className="mt-1 text-gray-900">{formatFrequenciaAplicacao(intervention.frequencia)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadados</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID</dt>
                  <dd className="mt-1 text-gray-900 text-sm font-mono">{intervention.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(intervention.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Última atualização</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(intervention.updatedAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 