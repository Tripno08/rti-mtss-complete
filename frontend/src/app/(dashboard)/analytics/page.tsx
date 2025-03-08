'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Dados simulados
const interventionData = [
  { type: 'Leitura', count: 45, avgImprovement: 15 },
  { type: 'Matemática', count: 38, avgImprovement: 12 },
  { type: 'Comportamental', count: 27, avgImprovement: 18 },
  { type: 'Escrita', count: 32, avgImprovement: 14 },
];

const progressData = [
  { month: 'Jan', avgScore: 65 },
  { month: 'Fev', avgScore: 68 },
  { month: 'Mar', avgScore: 72 },
  { month: 'Abr', avgScore: 75 },
  { month: 'Mai', avgScore: 78 },
  { month: 'Jun', avgScore: 82 },
];

const riskDistributionData = [
  { name: 'Alto Risco', value: 24, color: '#ef4444' },
  { name: 'Médio Risco', value: 45, color: '#f59e0b' },
  { name: 'Baixo Risco', value: 89, color: '#22c55e' },
];

const gradeDistributionData = [
  { grade: '1º Ano', count: 28, atRisk: 8 },
  { grade: '2º Ano', count: 32, atRisk: 12 },
  { grade: '3º Ano', count: 35, atRisk: 15 },
  { grade: '4º Ano', count: 30, atRisk: 10 },
  { grade: '5º Ano', count: 33, atRisk: 9 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('year');
  const [interventionType, setInterventionType] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Análise de Dados</h1>
          <p className="text-muted-foreground">
            Visualize métricas e tendências do sistema RTI/MTSS
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={interventionType} onValueChange={setInterventionType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Intervenção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="reading">Leitura</SelectItem>
              <SelectItem value="math">Matemática</SelectItem>
              <SelectItem value="behavior">Comportamental</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Risco</CardTitle>
            <CardDescription>
              Distribuição atual dos estudantes por nível de risco
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
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
            <CardTitle>Progresso Médio</CardTitle>
            <CardDescription>
              Evolução da pontuação média dos estudantes ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#2563eb"
                    name="Pontuação Média"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eficácia das Intervenções</CardTitle>
            <CardDescription>
              Número de intervenções e melhoria média por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interventionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
                  <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="count"
                    fill="#2563eb"
                    name="Número de Intervenções"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="avgImprovement"
                    fill="#22c55e"
                    name="Melhoria Média (%)"
                  />
                </BarChart>
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
                <BarChart data={gradeDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#2563eb" name="Total de Estudantes" />
                  <Bar dataKey="atRisk" fill="#ef4444" name="Em Risco" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">158</CardTitle>
            <CardDescription>Total de Estudantes</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">24</CardTitle>
            <CardDescription>Estudantes em Alto Risco</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">142</CardTitle>
            <CardDescription>Intervenções Ativas</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">78%</CardTitle>
            <CardDescription>Taxa de Sucesso das Intervenções</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
} 