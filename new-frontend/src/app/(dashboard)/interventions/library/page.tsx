'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { create } from 'zustand';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  Trash2,
  Loader2,
  FileText,
  BookOpen,
  Target,
  Clock,
  Users,
  BarChart,
  CheckCircle2
} from 'lucide-react';
import { api } from '@/lib/utils/api';
import { toast } from 'sonner';

// Enums
enum CategoriaIntervencao {
  LEITURA = 'LEITURA',
  ESCRITA = 'ESCRITA',
  MATEMATICA = 'MATEMATICA',
  COMPORTAMENTO = 'COMPORTAMENTO',
  SOCIOEMOCIONAL = 'SOCIOEMOCIONAL',
  ATENCAO = 'ATENCAO',
  ORGANIZACAO = 'ORGANIZACAO',
  OUTRO = 'OUTRO',
}

enum NivelRTI {
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
  TIER_3 = 'TIER_3',
}

enum NivelEvidencia {
  FORTE = 'FORTE',
  MODERADO = 'MODERADO',
  PROMISSOR = 'PROMISSOR',
  EMERGENTE = 'EMERGENTE',
}

// Interfaces
interface Intervencao {
  id: string;
  nome: string;
  descricao: string;
  categoria: CategoriaIntervencao;
  nivelRTI: NivelRTI;
  nivelEvidencia: NivelEvidencia;
  tempoSessao: string;
  frequenciaSemanal: number;
  duracaoSemanas: number;
  tamanhoGrupo: string;
  objetivos: string[];
  materiais: string[];
  passos: string[];
  evidencias: {
    fonte: string;
    descricao: string;
    link?: string;
  }[];
  referencias: string[];
  ativo: boolean;
}

// Store Zustand
interface IntervencoesStore {
  intervencoes: Intervencao[];
  isLoading: boolean;
  error: string | null;
  fetchIntervencoes: () => Promise<void>;
  deleteIntervencao: (id: string) => Promise<void>;
}

const useIntervencoesStore = create<IntervencoesStore>((set) => ({
  intervencoes: [],
  isLoading: false,
  error: null,
  fetchIntervencoes: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/interventions');
      set({ intervencoes: response.data, isLoading: false, error: null });
    } catch (error) {
      set({ error: 'Erro ao carregar intervenções', isLoading: false });
    }
  },
  deleteIntervencao: async (id: string) => {
    try {
      await api.delete(`/interventions/${id}`);
      set((state) => ({
        intervencoes: state.intervencoes.filter((i) => i.id !== id),
      }));
    } catch (error) {
      set({ error: 'Erro ao excluir intervenção' });
    }
  },
}));

export default function InterventionsLibraryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [rtiFilter, setRtiFilter] = useState<string>('');
  const [evidenceFilter, setEvidenceFilter] = useState<string>('');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervencao | null>(null);

  const { intervencoes, isLoading, error, fetchIntervencoes, deleteIntervencao } = useIntervencoesStore();

  // Carregar intervenções ao montar o componente
  useState(() => {
    fetchIntervencoes();
  });

  // Função para excluir uma intervenção
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta intervenção?')) {
      await deleteIntervencao(id);
      toast.success('Intervenção excluída com sucesso');
    }
  };

  // Filtrar intervenções
  const filteredInterventions = intervencoes?.filter((intervencao) => {
    const matchesSearch = 
      intervencao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervencao.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? intervencao.categoria === categoryFilter : true;
    const matchesRTI = rtiFilter ? intervencao.nivelRTI === rtiFilter : true;
    const matchesEvidence = evidenceFilter ? intervencao.nivelEvidencia === evidenceFilter : true;
    return matchesSearch && matchesCategory && matchesRTI && matchesEvidence;
  });

  // Função para formatar o nome da categoria
  const formatCategoryName = (category: CategoriaIntervencao) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Função para formatar o nível RTI
  const formatRTILevel = (level: NivelRTI) => {
    const names: Record<NivelRTI, string> = {
      [NivelRTI.TIER_1]: 'Tier 1 - Universal',
      [NivelRTI.TIER_2]: 'Tier 2 - Direcionado',
      [NivelRTI.TIER_3]: 'Tier 3 - Intensivo',
    };
    return names[level];
  };

  // Função para formatar o nível de evidência
  const formatEvidenceLevel = (level: NivelEvidencia) => {
    return level.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Função para obter a cor do badge de categoria
  const getCategoryBadgeColor = (category: CategoriaIntervencao) => {
    const colors: Record<CategoriaIntervencao, string> = {
      [CategoriaIntervencao.LEITURA]: 'bg-blue-100 text-blue-800',
      [CategoriaIntervencao.ESCRITA]: 'bg-indigo-100 text-indigo-800',
      [CategoriaIntervencao.MATEMATICA]: 'bg-purple-100 text-purple-800',
      [CategoriaIntervencao.COMPORTAMENTO]: 'bg-red-100 text-red-800',
      [CategoriaIntervencao.SOCIOEMOCIONAL]: 'bg-pink-100 text-pink-800',
      [CategoriaIntervencao.ATENCAO]: 'bg-orange-100 text-orange-800',
      [CategoriaIntervencao.ORGANIZACAO]: 'bg-yellow-100 text-yellow-800',
      [CategoriaIntervencao.OUTRO]: 'bg-gray-100 text-gray-800',
    };
    return colors[category];
  };

  // Função para obter a cor do badge de nível RTI
  const getRTIBadgeColor = (level: NivelRTI) => {
    const colors: Record<NivelRTI, string> = {
      [NivelRTI.TIER_1]: 'bg-green-100 text-green-800',
      [NivelRTI.TIER_2]: 'bg-yellow-100 text-yellow-800',
      [NivelRTI.TIER_3]: 'bg-red-100 text-red-800',
    };
    return colors[level];
  };

  // Função para obter a cor do badge de nível de evidência
  const getEvidenceBadgeColor = (level: NivelEvidencia) => {
    const colors: Record<NivelEvidencia, string> = {
      [NivelEvidencia.FORTE]: 'bg-green-100 text-green-800',
      [NivelEvidencia.MODERADO]: 'bg-blue-100 text-blue-800',
      [NivelEvidencia.PROMISSOR]: 'bg-yellow-100 text-yellow-800',
      [NivelEvidencia.EMERGENTE]: 'bg-orange-100 text-orange-800',
    };
    return colors[level];
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Biblioteca de Intervenções</h1>
        <Button onClick={() => router.push('/interventions/library/new')}>
          <Plus className="mr-2 h-4 w-4" /> Nova Intervenção
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as intervenções por nome, categoria, nível RTI ou nível de evidência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar por nome ou descrição..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {Object.values(CategoriaIntervencao).map((category) => (
                    <SelectItem key={category} value={category}>
                      {formatCategoryName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={rtiFilter}
                onValueChange={setRtiFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nível RTI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os níveis</SelectItem>
                  {Object.values(NivelRTI).map((level) => (
                    <SelectItem key={level} value={level}>
                      {formatRTILevel(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando intervenções...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              {error}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterventions?.map((intervencao) => (
            <Card key={intervencao.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{intervencao.nome}</CardTitle>
                    <CardDescription className="mt-2">
                      {intervencao.descricao}
                    </CardDescription>
                  </div>
                  <Badge className={getRTIBadgeColor(intervencao.nivelRTI)}>
                    {formatRTILevel(intervencao.nivelRTI)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getCategoryBadgeColor(intervencao.categoria)}>
                      {formatCategoryName(intervencao.categoria)}
                    </Badge>
                    <Badge className={getEvidenceBadgeColor(intervencao.nivelEvidencia)}>
                      {formatEvidenceLevel(intervencao.nivelEvidencia)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {intervencao.tempoSessao}
                    </div>
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 mr-2 text-gray-500" />
                      {intervencao.frequenciaSemanal}x/semana
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2 text-gray-500" />
                      {intervencao.duracaoSemanas} semanas
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      {intervencao.tamanhoGrupo}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedIntervention(intervencao)}>
                      <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{intervencao.nome}</DialogTitle>
                      <DialogDescription>{intervencao.descricao}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div>
                        <h4 className="font-medium mb-2">Objetivos</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {intervencao.objetivos.map((objetivo, index) => (
                            <li key={index}>{objetivo}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Materiais Necessários</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {intervencao.materiais.map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Passos da Intervenção</h4>
                        <ol className="list-decimal list-inside space-y-2">
                          {intervencao.passos.map((passo, index) => (
                            <li key={index}>{passo}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Evidências Científicas</h4>
                        <div className="space-y-4">
                          {intervencao.evidencias.map((evidencia, index) => (
                            <Card key={index}>
                              <CardContent className="pt-4">
                                <div className="flex items-start gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium">{evidencia.fonte}</p>
                                    <p className="text-sm text-gray-600">{evidencia.descricao}</p>
                                    {evidencia.link && (
                                      <a 
                                        href={evidencia.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-500 hover:underline"
                                      >
                                        Ver estudo
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Referências</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {intervencao.referencias.map((referencia, index) => (
                            <li key={index}>{referencia}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/interventions/library/${intervencao.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(intervencao.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 