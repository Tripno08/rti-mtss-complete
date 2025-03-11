'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LearningDifficulty {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  studentId: string;
  student?: {
    id: string;
    name: string;
    grade: string;
  };
  identifiedDate: string;
  interventions: string[];
}

// Dados simulados para desenvolvimento
const mockLearningDifficulties: LearningDifficulty[] = [
  {
    id: '1',
    name: 'Dislexia',
    description: 'Dificuldade na leitura e interpretação de textos',
    category: 'Leitura',
    severity: 'MODERATE',
    studentId: '1',
    student: {
      id: '1',
      name: 'João Silva',
      grade: '3º Ano'
    },
    identifiedDate: '2025-01-15',
    interventions: ['1']
  },
  {
    id: '2',
    name: 'Discalculia',
    description: 'Dificuldade em compreender e trabalhar com números e conceitos matemáticos',
    category: 'Matemática',
    severity: 'MILD',
    studentId: '2',
    student: {
      id: '2',
      name: 'Ana Souza',
      grade: '2º Ano'
    },
    identifiedDate: '2025-02-10',
    interventions: ['2']
  },
  {
    id: '3',
    name: 'TDAH',
    description: 'Transtorno de Déficit de Atenção e Hiperatividade',
    category: 'Comportamental',
    severity: 'SEVERE',
    studentId: '3',
    student: {
      id: '3',
      name: 'Pedro Santos',
      grade: '4º Ano'
    },
    identifiedDate: '2025-01-05',
    interventions: ['3']
  },
  {
    id: '4',
    name: 'Disgrafia',
    description: 'Dificuldade na escrita e coordenação motora fina',
    category: 'Escrita',
    severity: 'MODERATE',
    studentId: '4',
    student: {
      id: '4',
      name: 'Mariana Costa',
      grade: '1º Ano'
    },
    identifiedDate: '2025-03-01',
    interventions: ['4']
  }
];

export default function LearningDifficultiesPage() {
  const [difficulties, setDifficulties] = useState<LearningDifficulty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Carregar dados simulados
    try {
      setDifficulties(mockLearningDifficulties);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados simulados:', error);
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }

    try {
      // Simulação de exclusão
      setDifficulties(difficulties.filter((difficulty) => difficulty.id !== id));
      toast.success('Registro excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      toast.error('Erro ao excluir registro.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'MILD':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'SEVERE':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'MILD':
        return 'Leve';
      case 'MODERATE':
        return 'Moderada';
      case 'SEVERE':
        return 'Severa';
      default:
        return severity;
    }
  };

  // Filtrar dificuldades
  const filteredDifficulties = difficulties.filter((difficulty) => {
    const matchesSearch = 
      difficulty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      difficulty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      difficulty.student?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || difficulty.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Obter categorias únicas para o filtro
  const categories = Array.from(new Set(difficulties.map(d => d.category)));

  // Se não estamos no cliente, renderizar um placeholder
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  // Se ocorreu um erro
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dificuldades de Aprendizagem</h1>
          <Button onClick={() => router.push('/learning-difficulties/new')}>Novo Registro</Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">Erro ao carregar dados. Tente novamente mais tarde.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dificuldades de Aprendizagem</h1>
        <Button onClick={() => router.push('/learning-difficulties/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, descrição ou aluno..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{categoryFilter || 'Filtrar por categoria'}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando...</span>
        </div>
      ) : filteredDifficulties.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Nenhuma dificuldade de aprendizagem encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDifficulties.map((difficulty) => (
            <Card key={difficulty.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{difficulty.name}</CardTitle>
                  <Badge className={getSeverityColor(difficulty.severity)}>
                    {getSeverityText(difficulty.severity)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {difficulty.student?.name || 'Aluno não encontrado'} - {difficulty.category}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Identificada em:</span>
                    <span>{formatDate(difficulty.identifiedDate)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Descrição:</span>
                    <p className="mt-1 text-sm line-clamp-2">{difficulty.description}</p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/learning-difficulties/${difficulty.id}`)}
                    >
                      Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/learning-difficulties/${difficulty.id}/edit`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(difficulty.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 