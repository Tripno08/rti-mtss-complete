'use client';

import { StatCard } from '@/components/dashboard/stat-card';
import { ChartCard } from '@/components/dashboard/chart-card';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Target, Calendar, ArrowRight, PieChart, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth';
import { RtiPyramidChart } from '@/components/dashboard/rti-pyramid-chart';

// Definir a interface para os estudantes
interface Student {
  id: number;
  name: string;
  grade: string;
  tier: string;
  lastAssessment: string;
  progress: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Dados simulados para o dashboard
  const stats = [
    { title: 'Total de Estudantes', value: 1248, icon: Users, description: '32 novos esta semana', trend: { value: 12, isPositive: true } },
    { title: 'Avaliações', value: 342, icon: BookOpen, description: '18 realizadas hoje', trend: { value: 8, isPositive: true } },
    { title: 'Intervenções Ativas', value: 156, icon: Target, description: '5 concluídas hoje', trend: { value: 3, isPositive: false } },
    { title: 'Reuniões Agendadas', value: 24, icon: Calendar, description: 'Próxima em 2 dias', trend: { value: 15, isPositive: true } },
  ];

  // Dados simulados para a tabela de estudantes recentes
  const recentStudents: Student[] = [
    { id: 1, name: 'Ana Silva', grade: '5º Ano', tier: 'Tier 2', lastAssessment: '12/03/2025', progress: 'Em progresso' },
    { id: 2, name: 'João Santos', grade: '3º Ano', tier: 'Tier 1', lastAssessment: '10/03/2025', progress: 'Concluído' },
    { id: 3, name: 'Maria Oliveira', grade: '7º Ano', tier: 'Tier 3', lastAssessment: '08/03/2025', progress: 'Necessita atenção' },
    { id: 4, name: 'Pedro Costa', grade: '2º Ano', tier: 'Tier 2', lastAssessment: '11/03/2025', progress: 'Em progresso' },
    { id: 5, name: 'Carla Mendes', grade: '9º Ano', tier: 'Tier 1', lastAssessment: '09/03/2025', progress: 'Concluído' },
  ];

  // Colunas para a tabela de estudantes recentes
  const studentColumns = [
    { header: 'Nome', accessor: 'name' as const },
    { header: 'Série', accessor: 'grade' as const },
    { 
      header: 'Tier', 
      accessor: 'tier' as const,
      cell: (student: Student) => (
        <span className={
          student.tier === 'Tier 1' ? 'text-green-500' : 
          student.tier === 'Tier 2' ? 'text-yellow-500' : 
          'text-red-500'
        }>
          {student.tier}
        </span>
      )
    },
    { header: 'Última Avaliação', accessor: 'lastAssessment' as const },
    { 
      header: 'Progresso', 
      accessor: 'progress' as const,
      cell: (student: Student) => (
        <span className={
          student.progress === 'Concluído' ? 'text-green-500' : 
          student.progress === 'Em progresso' ? 'text-blue-500' : 
          'text-red-500'
        }>
          {student.progress}
        </span>
      )
    },
    {
      header: 'Ações',
      accessor: 'id' as const,
      cell: (student: Student) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/students/${student.id}`}>
            Ver detalhes
          </Link>
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bem-vindo, {user?.name}!</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="Pirâmide Innerview"
          description="Distribuição de estudantes por tier"
          action={
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/rti-pyramid" className="flex items-center">
                <span>Ver detalhes</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          }
          className="h-[300px]"
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center w-full max-w-[220px]">
              {/* Tier 1 - Base da pirâmide */}
              <div className="relative w-full">
                <div className="bg-green-500 h-16 w-full rounded-sm flex items-center justify-center text-white font-medium">
                  <span>Tier 1 (80%)</span>
                </div>
                <div className="absolute -bottom-2 left-0 right-0 text-center text-xs text-gray-600 dark:text-gray-400">
                  Suporte Universal
                </div>
              </div>
              
              {/* Tier 2 - Meio da pirâmide */}
              <div className="relative w-4/5 mt-4">
                <div className="bg-yellow-500 h-14 w-full rounded-sm flex items-center justify-center text-white font-medium">
                  <span>Tier 2 (15%)</span>
                </div>
                <div className="absolute -bottom-2 left-0 right-0 text-center text-xs text-gray-600 dark:text-gray-400">
                  Suporte Direcionado
                </div>
              </div>
              
              {/* Tier 3 - Topo da pirâmide */}
              <div className="relative w-3/5 mt-4">
                <div className="bg-red-500 h-12 w-full rounded-sm flex items-center justify-center text-white font-medium">
                  <span>Tier 3 (5%)</span>
                </div>
                <div className="absolute -bottom-2 left-0 right-0 text-center text-xs text-gray-600 dark:text-gray-400">
                  Suporte Intensivo
                </div>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Análise de Dados Innerview"
          description="Insights e tendências do programa"
          action={
            <Button variant="outline" size="sm" asChild>
              <Link href="/analytics/rti-pyramid" className="flex items-center">
                <span>Ver análise completa</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          }
          className="h-[300px]"
        >
          <div className="flex h-full w-full p-4">
            <div className="w-full">
              <h3 className="text-sm font-medium mb-3">Principais Insights:</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Aumento de 5% no número de estudantes no Tier 1 nos últimos 3 meses</li>
                <li>Redução de 2% no número de estudantes no Tier 3 desde o início do ano letivo</li>
                <li>Maior eficácia em intervenções de leitura (78% de sucesso)</li>
                <li>25 estudantes movidos para tiers de menor intensidade este mês</li>
              </ul>
              <div className="mt-4 flex justify-center">
                <BarChart3 className="h-20 w-20 text-innerview-primary opacity-50" />
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-innerview-secondary dark:text-white">Estudantes Recentes</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/students" className="flex items-center">
              <span>Ver todos</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <DataTable
          columns={studentColumns}
          data={recentStudents}
        />
      </div>
    </div>
  );
} 