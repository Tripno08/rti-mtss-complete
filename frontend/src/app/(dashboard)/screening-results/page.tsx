'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, BarChart } from 'lucide-react';

// Tipos
interface ScreeningResult {
  id: string;
  studentName: string;
  screeningName: string;
  date: string;
  score: number;
  maxScore: number;
  status: 'at-risk' | 'some-risk' | 'no-risk' | 'incomplete';
  appliedBy: string;
  indicators: string[];
}

// Dados simulados
const mockResults: ScreeningResult[] = [
  {
    id: '1',
    studentName: 'João Silva',
    screeningName: 'Avaliação de Leitura',
    date: '2025-02-20',
    score: 65,
    maxScore: 100,
    status: 'some-risk',
    appliedBy: 'Maria Oliveira',
    indicators: ['Fluência de leitura', 'Compreensão de texto'],
  },
  {
    id: '2',
    studentName: 'Ana Pereira',
    screeningName: 'Avaliação de Matemática',
    date: '2025-02-18',
    score: 45,
    maxScore: 100,
    status: 'at-risk',
    appliedBy: 'Pedro Costa',
    indicators: ['Operações básicas', 'Resolução de problemas'],
  },
  {
    id: '3',
    studentName: 'Lucas Mendes',
    screeningName: 'Avaliação Comportamental',
    date: '2025-02-15',
    score: 85,
    maxScore: 100,
    status: 'no-risk',
    appliedBy: 'Carla Rodrigues',
    indicators: ['Atenção', 'Participação'],
  },
  {
    id: '4',
    studentName: 'Mariana Souza',
    screeningName: 'Avaliação de Escrita',
    date: '2025-02-10',
    score: 30,
    maxScore: 100,
    status: 'at-risk',
    appliedBy: 'José Ferreira',
    indicators: ['Ortografia', 'Produção textual'],
  },
  {
    id: '5',
    studentName: 'Gabriel Santos',
    screeningName: 'Avaliação Socioemocional',
    date: '2025-02-05',
    score: 0,
    maxScore: 100,
    status: 'incomplete',
    appliedBy: 'Fernanda Lima',
    indicators: [],
  },
];

export default function ScreeningResultsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all-statuses');
  const [screeningFilter, setScreeningFilter] = useState('all-screenings');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadgeColor = (status: ScreeningResult['status']) => {
    switch (status) {
      case 'at-risk':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'some-risk':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'no-risk':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'incomplete':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusLabel = (status: ScreeningResult['status']) => {
    switch (status) {
      case 'at-risk':
        return 'Em Risco';
      case 'some-risk':
        return 'Algum Risco';
      case 'no-risk':
        return 'Sem Risco';
      case 'incomplete':
        return 'Incompleto';
      default:
        return status;
    }
  };

  // Calcular porcentagem do score
  const calculatePercentage = (score: number, maxScore: number) => {
    return Math.round((score / maxScore) * 100);
  };

  // Filtrar resultados
  const filteredResults = mockResults.filter((result) => {
    const matchesSearch =
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.screeningName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.appliedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all-statuses' || result.status === statusFilter;

    const matchesScreening =
      screeningFilter === 'all-screenings' || result.screeningName === screeningFilter;

    return matchesSearch && matchesStatus && matchesScreening;
  });

  // Obter rastreios únicos para o filtro
  const uniqueScreenings = Array.from(
    new Set(mockResults.map((result) => result.screeningName))
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resultados de Rastreio</h1>
        <Button onClick={() => router.push('/screening-results/new')}>
          <Plus className="mr-2 h-4 w-4" /> Novo Resultado
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os resultados por status, tipo de rastreio ou use a busca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por aluno, rastreio ou aplicador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">Todos os Status</SelectItem>
                  <SelectItem value="at-risk">Em Risco</SelectItem>
                  <SelectItem value="some-risk">Algum Risco</SelectItem>
                  <SelectItem value="no-risk">Sem Risco</SelectItem>
                  <SelectItem value="incomplete">Incompleto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Select
                value={screeningFilter}
                onValueChange={setScreeningFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por rastreio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-screenings">Todos os Rastreios</SelectItem>
                  {uniqueScreenings.map((screening) => (
                    <SelectItem key={screening} value={screening}>
                      {screening}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Rastreio</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Pontuação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aplicado por</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      {result.studentName}
                    </TableCell>
                    <TableCell>{result.screeningName}</TableCell>
                    <TableCell>{formatDate(result.date)}</TableCell>
                    <TableCell>
                      {result.status !== 'incomplete' ? (
                        <div className="flex items-center gap-2">
                          <span>{result.score}/{result.maxScore}</span>
                          <span className="text-xs text-gray-500">
                            ({calculatePercentage(result.score, result.maxScore)}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadgeColor(result.status)}
                        variant="outline"
                      >
                        {getStatusLabel(result.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{result.appliedBy}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/screening-results/${result.id}`)}
                        >
                          <FileText className="h-4 w-4 mr-1" /> Detalhes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/screening-results/${result.id}/analysis`)}
                        >
                          <BarChart className="h-4 w-4 mr-1" /> Análise
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Nenhum resultado encontrado com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 