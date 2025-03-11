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
const assessmentDistribution = [
  { name: 'Abaixo do Esperado', value: 25, color: '#ef4444' },
  { name: 'Parcialmente Adequado', value: 45, color: '#f59e0b' },
  { name: 'Adequado', value: 30, color: '#22c55e' },
];

const assessmentTrends = [
  { month: 'Jan', avgScore: 65, totalAssessments: 45 },
  { month: 'Fev', avgScore: 68, totalAssessments: 52 },
  { month: 'Mar', avgScore: 72, totalAssessments: 48 },
  { month: 'Abr', avgScore: 75, totalAssessments: 55 },
  { month: 'Mai', avgScore: 78, totalAssessments: 50 },
  { month: 'Jun', avgScore: 82, totalAssessments: 58 },
];

const assessmentTypes = [
  { type: 'Leitura', avgScore: 75, total: 120 },
  { type: 'Matemática', avgScore: 72, total: 110 },
  { type: 'Escrita', avgScore: 68, total: 95 },
  { type: 'Comportamental', avgScore: 80, total: 85 },
];

const recentAssessments = [
  {
    id: '1',
    student: 'João Silva',
    type: 'Leitura',
    score: 85,
    date: '2024-02-20',
    evaluator: 'Maria Santos',
    status: 'completed',
  },
  {
    id: '2',
    student: 'Ana Oliveira',
    type: 'Matemática',
    score: 72,
    date: '2024-02-19',
    evaluator: 'Carlos Pereira',
    status: 'completed',
  },
  {
    id: '3',
    student: 'Pedro Costa',
    type: 'Escrita',
    score: 68,
    date: '2024-02-18',
    evaluator: 'Ana Oliveira',
    status: 'completed',
  },
  {
    id: '4',
    student: 'Maria Santos',
    type: 'Comportamental',
    score: 90,
    date: '2024-02-17',
    evaluator: 'Roberto Santos',
    status: 'completed',
  },
  {
    id: '5',
    student: 'Lucas Ferreira',
    type: 'Leitura',
    score: 78,
    date: '2024-02-16',
    evaluator: 'Maria Santos',
    status: 'completed',
  },
];

export default function AssessmentsReportPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('6months');
  const [assessmentType, setAssessmentType] = useState('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Avaliações</h1>
            <p className="text-muted-foreground">
              Análise detalhada das avaliações realizadas no programa RTI/MTSS
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
          <Select value={assessmentType} onValueChange={setAssessmentType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Avaliação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Avaliações</SelectItem>
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
            <CardTitle>Distribuição das Avaliações</CardTitle>
            <CardDescription>
              Distribuição dos resultados por nível de desempenho
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assessmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assessmentDistribution.map((entry, index) => (
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
            <CardTitle>Tendências de Avaliação</CardTitle>
            <CardDescription>
              Evolução das pontuações médias e número de avaliações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={assessmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
                  <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#2563eb"
                    name="Pontuação Média"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalAssessments"
                    stroke="#22c55e"
                    name="Total de Avaliações"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações por Tipo</CardTitle>
            <CardDescription>
              Comparação entre diferentes tipos de avaliação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assessmentTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
                  <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="avgScore"
                    fill="#2563eb"
                    name="Pontuação Média"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="total"
                    fill="#22c55e"
                    name="Total de Avaliações"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações Recentes</CardTitle>
            <CardDescription>
              Últimas avaliações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Pontuação</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Avaliador</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">{assessment.student}</TableCell>
                      <TableCell>{assessment.type}</TableCell>
                      <TableCell>
                        <span className={getScoreColor(assessment.score)}>
                          {assessment.score}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(assessment.date)}</TableCell>
                      <TableCell>{assessment.evaluator}</TableCell>
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
          <CardTitle>Resumo das Avaliações</CardTitle>
          <CardDescription>
            Indicadores chave das avaliações realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Total de Avaliações</p>
              <p className="text-2xl font-bold">410</p>
              <p className="text-sm text-muted-foreground">
                Realizadas no período
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
              <p className="text-2xl font-bold">75.8</p>
              <p className="text-sm text-muted-foreground">
                Pontuação média global
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Estudantes Avaliados</p>
              <p className="text-2xl font-bold">142</p>
              <p className="text-sm text-muted-foreground">
                No período selecionado
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Taxa de Melhoria</p>
              <p className="text-2xl font-bold">68%</p>
              <p className="text-sm text-muted-foreground">
                Em relação à avaliação anterior
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 