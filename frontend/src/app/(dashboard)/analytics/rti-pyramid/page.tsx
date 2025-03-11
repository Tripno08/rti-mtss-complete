'use client';

import { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RtiPyramidChart } from '@/components/dashboard/rti-pyramid-chart';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight, Download, Home } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dados simulados para a tabela de estudantes
const studentsData = [
  {
    id: '1',
    name: 'João Silva',
    grade: '3º Ano',
    tier: 'Tier 3',
    riskLevel: 'Alto',
    interventionsCount: 3,
    lastAssessment: '15/02/2025',
    progress: 'Abaixo da meta'
  },
  {
    id: '2',
    name: 'Ana Pereira',
    grade: '4º Ano',
    tier: 'Tier 3',
    riskLevel: 'Alto',
    interventionsCount: 2,
    lastAssessment: '10/02/2025',
    progress: 'Abaixo da meta'
  },
  {
    id: '3',
    name: 'Lucas Mendes',
    grade: '2º Ano',
    tier: 'Tier 3',
    riskLevel: 'Alto',
    interventionsCount: 4,
    lastAssessment: '18/02/2025',
    progress: 'Próximo da meta'
  },
  {
    id: '4',
    name: 'Mariana Souza',
    grade: '5º Ano',
    tier: 'Tier 2',
    riskLevel: 'Médio',
    interventionsCount: 2,
    lastAssessment: '05/02/2025',
    progress: 'Próximo da meta'
  },
  {
    id: '5',
    name: 'Gabriel Santos',
    grade: '3º Ano',
    tier: 'Tier 2',
    riskLevel: 'Médio',
    interventionsCount: 1,
    lastAssessment: '12/02/2025',
    progress: 'Próximo da meta'
  },
  {
    id: '6',
    name: 'Juliana Lima',
    grade: '4º Ano',
    tier: 'Tier 2',
    riskLevel: 'Médio',
    interventionsCount: 2,
    lastAssessment: '08/02/2025',
    progress: 'Atingiu a meta'
  },
  {
    id: '7',
    name: 'Pedro Costa',
    grade: '2º Ano',
    tier: 'Tier 1',
    riskLevel: 'Baixo',
    interventionsCount: 0,
    lastAssessment: '01/02/2025',
    progress: 'Atingiu a meta'
  },
  {
    id: '8',
    name: 'Carla Rodrigues',
    grade: '5º Ano',
    tier: 'Tier 1',
    riskLevel: 'Baixo',
    interventionsCount: 0,
    lastAssessment: '03/02/2025',
    progress: 'Acima da meta'
  },
  {
    id: '9',
    name: 'Rafael Oliveira',
    grade: '3º Ano',
    tier: 'Tier 1',
    riskLevel: 'Baixo',
    interventionsCount: 1,
    lastAssessment: '07/02/2025',
    progress: 'Atingiu a meta'
  }
];

// Dados simulados para o gráfico de tendências
const trendData = [
  {
    name: 'Janeiro',
    tier1: 75,
    tier2: 30,
    tier3: 10,
  },
  {
    name: 'Fevereiro',
    tier1: 78,
    tier2: 32,
    tier3: 12,
  },
  {
    name: 'Março',
    tier1: 80,
    tier2: 35,
    tier3: 15,
  },
  {
    name: 'Abril',
    tier1: 82,
    tier2: 33,
    tier3: 14,
  },
  {
    name: 'Maio',
    tier1: 85,
    tier2: 30,
    tier3: 12,
  },
];

// Definição de tipos para a tabela
type Student = {
  id: string;
  name: string;
  grade: string;
  tier: string;
  riskLevel: string;
  interventionsCount: number;
  lastAssessment: string;
  progress: string;
};

// Colunas para a tabela de estudantes
const columns = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'grade',
    header: 'Série',
  },
  {
    accessorKey: 'tier',
    header: 'Tier',
    cell: ({ row }: { row: { getValue: (key: string) => any } }) => {
      const tier = row.getValue('tier');
      return (
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ 
              backgroundColor: 
                tier === 'Tier 3' ? '#FF4560' : 
                tier === 'Tier 2' ? '#FFAB00' : 
                '#00E396' 
            }}
          ></div>
          {tier}
        </div>
      );
    },
  },
  {
    accessorKey: 'riskLevel',
    header: 'Nível de Risco',
  },
  {
    accessorKey: 'interventionsCount',
    header: 'Intervenções',
  },
  {
    accessorKey: 'lastAssessment',
    header: 'Última Avaliação',
  },
  {
    accessorKey: 'progress',
    header: 'Progresso',
  },
  {
    id: 'actions',
    cell: ({ row }: { row: any }) => {
      return (
        <Button variant="ghost" size="sm">
          <ChevronRight className="h-4 w-4" />
        </Button>
      );
    },
  },
];

// Componente de tabela simplificado para evitar dependência do @tanstack/react-table
function SimpleDataTable({ columns, data }: { columns: any[], data: any[] }) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th key={column.accessorKey || column.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id} className="border-b transition-colors hover:bg-muted/50">
                {columns.map((column) => (
                  <td key={column.accessorKey || column.id} className="p-4 align-middle">
                    {column.cell 
                      ? column.cell({ row: { getValue: (key: string) => row[key] } })
                      : row[column.accessorKey]
                    }
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                Nenhum resultado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function RtiPyramidPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('pyramid');

  const handleViewStudents = (tierId: string) => {
    setSelectedTier(tierId);
    setViewMode('students');
  };

  const filteredStudents = selectedTier 
    ? studentsData.filter(student => {
        if (selectedTier === 'tier1') return student.tier === 'Tier 1';
        if (selectedTier === 'tier2') return student.tier === 'Tier 2';
        if (selectedTier === 'tier3') return student.tier === 'Tier 3';
        return true;
      })
    : studentsData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">
                <Home className="h-4 w-4 mr-1" />
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/analytics">Análises</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Pirâmide Innerview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="students">Estudantes</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pirâmide Innerview</CardTitle>
              <CardDescription>
                Visualização detalhada da distribuição de estudantes nos diferentes níveis da pirâmide Innerview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RtiPyramidChart data={null} onViewStudents={handleViewStudents} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Estudantes por Tier</CardTitle>
                  <CardDescription>
                    Lista detalhada de estudantes em cada nível da pirâmide Innerview
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="tier-filter">Filtrar por Tier:</Label>
                    <Select 
                      onValueChange={(value) => setSelectedTier(value === 'all' ? null : value)}
                      defaultValue={selectedTier || 'all'}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Todos os Tiers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Tiers</SelectItem>
                        <SelectItem value="tier1">Tier 1</SelectItem>
                        <SelectItem value="tier2">Tier 2</SelectItem>
                        <SelectItem value="tier3">Tier 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input placeholder="Buscar estudante..." className="w-[200px]" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SimpleDataTable columns={columns} data={filteredStudents} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendências Innerview</CardTitle>
              <CardDescription>
                Evolução da distribuição de estudantes nos diferentes níveis ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trendData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tier1" name="Tier 1" stackId="a" fill="#00E396" />
                    <Bar dataKey="tier2" name="Tier 2" stackId="a" fill="#FFAB00" />
                    <Bar dataKey="tier3" name="Tier 3" stackId="a" fill="#FF4560" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Insights:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Aumento de 5% no número de estudantes no Tier 1 nos últimos 3 meses</li>
                  <li>Redução de 2% no número de estudantes no Tier 3 desde o início do ano letivo</li>
                  <li>Estabilização do número de estudantes no Tier 2 após implementação de novas intervenções</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 