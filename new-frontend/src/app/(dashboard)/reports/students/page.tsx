'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft, Download, Eye } from 'lucide-react';

// Dados simulados
const riskDistribution = [
  { name: 'Alto Risco', value: 25, color: '#ef4444' },
  { name: 'Médio Risco', value: 35, color: '#f59e0b' },
  { name: 'Baixo Risco', value: 40, color: '#22c55e' },
];

const gradeDistribution = [
  { grade: '1º Ano', total: 45, atRisk: 15 },
  { grade: '2º Ano', total: 48, atRisk: 18 },
  { grade: '3º Ano', total: 52, atRisk: 22 },
  { grade: '4º Ano', total: 50, atRisk: 20 },
  { grade: '5º Ano', total: 47, atRisk: 17 },
];

const interventionDistribution = [
  { type: 'Leitura', students: 45 },
  { type: 'Matemática', students: 38 },
  { type: 'Escrita', students: 32 },
  { type: 'Comportamental', students: 27 },
];

const recentStudents = [
  {
    id: '1',
    name: 'João Silva',
    grade: '3º Ano',
    riskLevel: 'high',
    interventions: 3,
    lastAssessment: 65,
    responsible: 'Maria Santos',
  },
  {
    id: '2',
    name: 'Ana Oliveira',
    grade: '2º Ano',
    riskLevel: 'medium',
    interventions: 2,
    lastAssessment: 72,
    responsible: 'Carlos Pereira',
  },
  {
    id: '3',
    name: 'Pedro Costa',
    grade: '4º Ano',
    riskLevel: 'low',
    interventions: 1,
    lastAssessment: 85,
    responsible: 'Ana Oliveira',
  },
  {
    id: '4',
    name: 'Maria Santos',
    grade: '1º Ano',
    riskLevel: 'medium',
    interventions: 2,
    lastAssessment: 70,
    responsible: 'Roberto Santos',
  },
  {
    id: '5',
    name: 'Lucas Ferreira',
    grade: '5º Ano',
    riskLevel: 'high',
    interventions: 3,
    lastAssessment: 62,
    responsible: 'Maria Santos',
  },
];

export default function StudentsReportPage() {
  const router = useRouter();
  const [grade, setGrade] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return '';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'Alto Risco';
      case 'medium':
        return 'Médio Risco';
      case 'low':
        return 'Baixo Risco';
      default:
        return risk;
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Estudantes</h1>
            <p className="text-muted-foreground">
              Análise detalhada dos estudantes no programa RTI/MTSS
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Série" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Séries</SelectItem>
              <SelectItem value="1">1º Ano</SelectItem>
              <SelectItem value="2">2º Ano</SelectItem>
              <SelectItem value="3">3º Ano</SelectItem>
              <SelectItem value="4">4º Ano</SelectItem>
              <SelectItem value="5">5º Ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskLevel} onValueChange={setRiskLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Nível de Risco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Níveis</SelectItem>
              <SelectItem value="high">Alto Risco</SelectItem>
              <SelectItem value="medium">Médio Risco</SelectItem>
              <SelectItem value="low">Baixo Risco</SelectItem>
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
            <CardTitle>Distribuição por Risco</CardTitle>
            <CardDescription>
              Distribuição dos estudantes por nível de risco
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
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
            <CardTitle>Distribuição por Série</CardTitle>
            <CardDescription>
              Número total de estudantes e estudantes em risco por série
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#2563eb" name="Total de Estudantes" />
                  <Bar dataKey="atRisk" fill="#ef4444" name="Em Risco" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intervenções por Tipo</CardTitle>
            <CardDescription>
              Número de estudantes por tipo de intervenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interventionDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#2563eb" name="Estudantes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estudantes em Risco</CardTitle>
            <CardDescription>
              Lista de estudantes que requerem atenção especial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Série</TableHead>
                    <TableHead>Risco</TableHead>
                    <TableHead>Intervenções</TableHead>
                    <TableHead>Última Avaliação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <Badge className={getRiskBadgeColor(student.riskLevel)}>
                          {getRiskLabel(student.riskLevel)}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.interventions}</TableCell>
                      <TableCell>
                        <span className={getScoreColor(student.lastAssessment)}>
                          {student.lastAssessment}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/students/${student.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
          <CardTitle>Resumo dos Estudantes</CardTitle>
          <CardDescription>
            Indicadores chave do programa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Total de Estudantes</p>
              <p className="text-2xl font-bold">242</p>
              <p className="text-sm text-muted-foreground">
                No programa RTI/MTSS
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Em Risco</p>
              <p className="text-2xl font-bold">60</p>
              <p className="text-sm text-muted-foreground">
                Necessitam atenção imediata
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Com Intervenções</p>
              <p className="text-2xl font-bold">142</p>
              <p className="text-sm text-muted-foreground">
                Recebendo suporte ativo
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Taxa de Progresso</p>
              <p className="text-2xl font-bold">72%</p>
              <p className="text-sm text-muted-foreground">
                Mostrando melhoria
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 