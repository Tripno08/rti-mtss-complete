'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ArrowLeft, Download } from 'lucide-react';

// Dados simulados
const interventionStatus = [
  { name: 'Em Andamento', value: 45, color: '#f59e0b' },
  { name: 'Concluídas', value: 35, color: '#22c55e' },
  { name: 'Planejadas', value: 15, color: '#2563eb' },
  { name: 'Canceladas', value: 5, color: '#ef4444' },
];

const interventionTrends = [
  { month: 'Jan', active: 35, new: 12, completed: 8 },
  { month: 'Fev', active: 39, new: 15, completed: 11 },
  { month: 'Mar', active: 43, new: 18, completed: 14 },
  { month: 'Abr', active: 47, new: 20, completed: 16 },
  { month: 'Mai', active: 51, new: 22, completed: 18 },
  { month: 'Jun', active: 55, new: 25, completed: 21 },
];

const interventionTypes = [
  { type: 'Leitura', success: 85, ongoing: 45, total: 130 },
  { type: 'Matemática', success: 75, ongoing: 40, total: 115 },
  { type: 'Escrita', success: 70, ongoing: 35, total: 105 },
  { type: 'Comportamental', success: 80, ongoing: 30, total: 110 },
];

const recentInterventions = [
  {
    id: '1',
    student: 'João Silva',
    type: 'Leitura',
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    status: 'active',
    progress: 75,
    responsible: 'Maria Santos',
  },
  {
    id: '2',
    student: 'Ana Oliveira',
    type: 'Matemática',
    startDate: '2024-02-05',
    endDate: '2024-03-05',
    status: 'active',
    progress: 60,
    responsible: 'Carlos Pereira',
  },
  {
    id: '3',
    student: 'Pedro Costa',
    type: 'Escrita',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'completed',
    progress: 100,
    responsible: 'Ana Oliveira',
  },
  {
    id: '4',
    student: 'Maria Santos',
    type: 'Comportamental',
    startDate: '2024-02-10',
    endDate: '2024-03-10',
    status: 'active',
    progress: 45,
    responsible: 'Roberto Santos',
  },
  {
    id: '5',
    student: 'Lucas Ferreira',
    type: 'Leitura',
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    status: 'completed',
    progress: 100,
    responsible: 'Maria Santos',
  },
];

export default function InterventionsReportPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('6months');
  const [interventionType, setInterventionType] = useState('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'planned':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Em Andamento';
      case 'completed':
        return 'Concluída';
      case 'planned':
        return 'Planejada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Intervenções</h1>
            <p className="text-muted-foreground">
              Análise detalhada das intervenções realizadas no programa RTI/MTSS
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={interventionType} onValueChange={setInterventionType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Intervenção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Intervenções</SelectItem>
              <SelectItem value="reading">Leitura</SelectItem>
              <SelectItem value="math">Matemática</SelectItem>
              <SelectItem value="writing">Escrita</SelectItem>
              <SelectItem value="behavior">Comportamental</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status das Intervenções</CardTitle>
            <CardDescription>
              Distribuição das intervenções por status atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={interventionStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {interventionStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendências de Intervenção</CardTitle>
            <CardDescription>
              Evolução do número de intervenções ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={interventionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#f59e0b"
                    name="Em Andamento"
                  />
                  <Line
                    type="monotone"
                    dataKey="new"
                    stroke="#2563eb"
                    name="Novas"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#22c55e"
                    name="Concluídas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intervenções por Tipo</CardTitle>
            <CardDescription>
              Análise comparativa entre diferentes tipos de intervenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interventionTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="success" stackId="a" fill="#22c55e" name="Sucesso" />
                  <Bar dataKey="ongoing" stackId="a" fill="#f59e0b" name="Em Andamento" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intervenções Recentes</CardTitle>
            <CardDescription>
              Últimas intervenções registradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInterventions.map((intervention) => (
                    <TableRow key={intervention.id}>
                      <TableCell className="font-medium">{intervention.student}</TableCell>
                      <TableCell>{intervention.type}</TableCell>
                      <TableCell>
                        {formatDate(intervention.startDate)} - {formatDate(intervention.endDate)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(intervention.status)}>
                          {getStatusLabel(intervention.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{intervention.responsible}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo das Intervenções</CardTitle>
          <CardDescription>
            Indicadores chave das intervenções realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Total de Intervenções</p>
              <p className="text-2xl font-bold">460</p>
              <p className="text-sm text-muted-foreground">
                No período selecionado
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-sm text-muted-foreground">
                Das intervenções concluídas
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Estudantes Atendidos</p>
              <p className="text-2xl font-bold">142</p>
              <p className="text-sm text-muted-foreground">
                Com intervenções ativas
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Duração Média</p>
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-muted-foreground">
                Dias por intervenção
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 