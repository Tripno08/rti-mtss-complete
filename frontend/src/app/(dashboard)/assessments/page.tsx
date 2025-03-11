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
import { Plus, Search } from 'lucide-react';

// Tipos
interface Assessment {
  id: string;
  studentName: string;
  studentGrade: string;
  type: string;
  date: string;
  score: number;
  evaluator: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// Dados simulados
const mockAssessments: Assessment[] = [
  {
    id: '1',
    studentName: 'João Silva',
    studentGrade: '3º Ano',
    type: 'Leitura',
    date: '2024-02-15',
    score: 75,
    evaluator: 'Maria Santos',
    status: 'completed',
  },
  {
    id: '2',
    studentName: 'Ana Oliveira',
    studentGrade: '2º Ano',
    type: 'Matemática',
    date: '2024-02-20',
    score: 0,
    evaluator: 'Carlos Pereira',
    status: 'pending',
  },
  {
    id: '3',
    studentName: 'Pedro Costa',
    studentGrade: '4º Ano',
    type: 'Comportamental',
    date: '2024-02-10',
    score: 85,
    evaluator: 'Maria Santos',
    status: 'completed',
  },
  {
    id: '4',
    studentName: 'Mariana Lima',
    studentGrade: '3º Ano',
    type: 'Leitura',
    date: '2024-02-18',
    score: 0,
    evaluator: 'Paulo Ribeiro',
    status: 'cancelled',
  },
  {
    id: '5',
    studentName: 'Lucas Ferreira',
    studentGrade: '5º Ano',
    type: 'Matemática',
    date: '2024-02-12',
    score: 92,
    evaluator: 'Carlos Pereira',
    status: 'completed',
  },
];

export default function AssessmentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para obter a cor do badge de status
  const getStatusBadgeColor = (status: Assessment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return '';
    }
  };

  // Função para traduzir o status
  const getStatusLabel = (status: Assessment['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Filtragem das avaliações
  const filteredAssessments = mockAssessments.filter(assessment => {
    const matchesSearch = assessment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.evaluator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || assessment.type === typeFilter;
    const matchesStatus = !statusFilter || assessment.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
          <p className="text-muted-foreground">
            Gerencie as avaliações do sistema RTI/MTSS
          </p>
        </div>
        <Button onClick={() => router.push('/assessments/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Avaliação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Avaliações</CardTitle>
          <CardDescription>
            Total de {filteredAssessments.length} avaliações encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por estudante ou avaliador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">Todos os tipos</SelectItem>
                    <SelectItem value="Leitura">Leitura</SelectItem>
                    <SelectItem value="Matemática">Matemática</SelectItem>
                    <SelectItem value="Comportamental">Comportamental</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-statuses">Todos os status</SelectItem>
                    <SelectItem value="completed">Concluídas</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Série</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Pontuação</TableHead>
                    <TableHead>Avaliador</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.map((assessment) => (
                    <TableRow
                      key={assessment.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/assessments/${assessment.id}`)}
                    >
                      <TableCell className="font-medium">{assessment.studentName}</TableCell>
                      <TableCell>{assessment.studentGrade}</TableCell>
                      <TableCell>{assessment.type}</TableCell>
                      <TableCell>{formatDate(assessment.date)}</TableCell>
                      <TableCell>
                        {assessment.status === 'completed' ? `${assessment.score}%` : '-'}
                      </TableCell>
                      <TableCell>{assessment.evaluator}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(assessment.status)}>
                          {getStatusLabel(assessment.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 