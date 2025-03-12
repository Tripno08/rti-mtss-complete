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
} from 'recharts';
import { ArrowLeft, Download } from 'lucide-react';

// Dados simulados
const progressData = [
  { month: 'Jan', avgScore: 65, interventions: 12 },
  { month: 'Fev', avgScore: 68, interventions: 15 },
  { month: 'Mar', avgScore: 72, interventions: 18 },
  { month: 'Abr', avgScore: 75, interventions: 20 },
  { month: 'Mai', avgScore: 78, interventions: 22 },
  { month: 'Jun', avgScore: 82, interventions: 25 },
];

const studentProgressData = [
  { name: 'João Silva', initialScore: 60, currentScore: 75, improvement: 15 },
  { name: 'Maria Santos', initialScore: 55, currentScore: 72, improvement: 17 },
  { name: 'Pedro Costa', initialScore: 65, currentScore: 85, improvement: 20 },
  { name: 'Ana Oliveira', initialScore: 58, currentScore: 78, improvement: 20 },
  { name: 'Lucas Ferreira', initialScore: 62, currentScore: 80, improvement: 18 },
];

const interventionEffectiveness = [
  { type: 'Leitura', success: 85, partial: 10, noEffect: 5 },
  { type: 'Matemática', success: 80, partial: 15, noEffect: 5 },
  { type: 'Escrita', success: 75, partial: 20, noEffect: 5 },
  { type: 'Comportamental', success: 70, partial: 20, noEffect: 10 },
];

export default function ProgressReportPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('6months');
  const [studentGroup, setStudentGroup] = useState('all');

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
            <h1 className="text-3xl font-bold tracking-tight">Relatório de Progresso</h1>
            <p className="text-muted-foreground">
              Análise detalhada do progresso dos estudantes no programa Innerview
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
          <Select value={studentGroup} onValueChange={setStudentGroup}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Grupo de Estudantes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Estudantes</SelectItem>
              <SelectItem value="tier1">Nível 1</SelectItem>
              <SelectItem value="tier2">Nível 2</SelectItem>
              <SelectItem value="tier3">Nível 3</SelectItem>
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
                    dataKey="interventions"
                    stroke="#22c55e"
                    name="Intervenções"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso Individual</CardTitle>
            <CardDescription>
              Comparação entre pontuação inicial e atual dos estudantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="initialScore" fill="#94a3b8" name="Pontuação Inicial" />
                  <Bar dataKey="currentScore" fill="#2563eb" name="Pontuação Atual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efetividade das Intervenções</CardTitle>
            <CardDescription>
              Análise do impacto das intervenções por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interventionEffectiveness} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="success" stackId="a" fill="#22c55e" name="Sucesso" />
                  <Bar dataKey="partial" stackId="a" fill="#f59e0b" name="Parcial" />
                  <Bar dataKey="noEffect" stackId="a" fill="#ef4444" name="Sem Efeito" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Progresso</CardTitle>
            <CardDescription>
              Indicadores chave de desempenho do programa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground">Média de Melhoria</p>
                <p className="text-2xl font-bold">18%</p>
                <p className="text-sm text-muted-foreground">
                  Aumento em relação à avaliação inicial
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-sm text-muted-foreground">
                  Das intervenções alcançaram seus objetivos
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground">Estudantes Atendidos</p>
                <p className="text-2xl font-bold">142</p>
                <p className="text-sm text-muted-foreground">
                  Participando ativamente do programa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 