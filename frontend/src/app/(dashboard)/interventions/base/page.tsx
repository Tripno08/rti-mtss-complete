'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle2,
  XCircle,
  Lightbulb
} from 'lucide-react';
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

// Interfaces
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

export default function BaseInterventionsPage() {
  const [baseInterventions, setBaseInterventions] = useState<BaseIntervention[]>([]);
  const [filteredInterventions, setFilteredInterventions] = useState<BaseIntervention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [nivelFilter, setNivelFilter] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchBaseInterventions();
  }, [showInactive]);

  useEffect(() => {
    filterInterventions();
  }, [searchTerm, areaFilter, nivelFilter, baseInterventions]);

  const fetchBaseInterventions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/interventions/base?includeInactive=${showInactive}`);
      setBaseInterventions(response.data);
      setFilteredInterventions(response.data);
    } catch (error) {
      console.error('Erro ao buscar intervenções base:', error);
      toast.error('Erro ao carregar intervenções base.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterInterventions = () => {
    let filtered = [...baseInterventions];

    if (searchTerm) {
      filtered = filtered.filter(
        (intervention) =>
          intervention.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          intervention.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (areaFilter && areaFilter !== 'all') {
      filtered = filtered.filter((intervention) => intervention.area === areaFilter);
    }

    if (nivelFilter && nivelFilter !== 'all') {
      filtered = filtered.filter((intervention) => intervention.nivel === nivelFilter);
    }

    setFilteredInterventions(filtered);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/interventions/base/${id}`, { ativo: !currentStatus });
      toast.success(`Intervenção ${currentStatus ? 'desativada' : 'ativada'} com sucesso.`);
      fetchBaseInterventions();
    } catch (error) {
      console.error('Erro ao alterar status da intervenção:', error);
      toast.error('Erro ao alterar status da intervenção.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta intervenção base? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete(`/interventions/base/${id}`);
        toast.success('Intervenção base excluída com sucesso.');
        fetchBaseInterventions();
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Intervenções Base</h1>
        <Button onClick={() => router.push('/interventions/base/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Intervenção Base
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as intervenções base por nome, área ou nível
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar intervenções..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                {Object.values(AreaIntervencao).map((area) => (
                  <SelectItem key={area} value={area}>
                    {formatAreaIntervencao(area as AreaIntervencao)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={nivelFilter} onValueChange={setNivelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                {Object.values(NivelIntervencao).map((nivel) => (
                  <SelectItem key={nivel} value={nivel}>
                    {formatNivelIntervencao(nivel as NivelIntervencao)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showInactive"
                checked={showInactive}
                onChange={() => setShowInactive(!showInactive)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="showInactive" className="text-sm font-medium">
                Mostrar intervenções inativas
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intervenções Base</CardTitle>
          <CardDescription>
            Lista de modelos de intervenção disponíveis no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredInterventions.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Nenhuma intervenção encontrada</h3>
              <p className="mt-1 text-gray-500">
                Tente ajustar seus filtros ou criar uma nova intervenção base.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>Tempo Estimado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterventions.map((intervention) => (
                    <TableRow key={intervention.id}>
                      <TableCell className="font-medium">{intervention.nome}</TableCell>
                      <TableCell>
                        <Badge className={getBadgeColorForArea(intervention.area)}>
                          {formatAreaIntervencao(intervention.area)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getBadgeColorForNivel(intervention.nivel)}>
                          {formatNivelIntervencao(intervention.nivel)}
                        </Badge>
                      </TableCell>
                      <TableCell>{intervention.tempoEstimado}</TableCell>
                      <TableCell>
                        {intervention.ativo ? (
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push(`/interventions/base/${intervention.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push(`/interventions/base/${intervention.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleStatus(intervention.id, intervention.ativo)}
                          >
                            {intervention.ativo ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(intervention.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 