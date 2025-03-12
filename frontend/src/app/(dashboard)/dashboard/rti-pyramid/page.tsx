'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RtiPyramidChart } from '@/components/dashboard/rti-pyramid-chart';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default function DashboardRtiPyramidPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleViewStudents = (tierId: string) => {
    setSelectedTier(tierId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Pirâmide Innerview</h1>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar Dados
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral da Pirâmide Innerview</CardTitle>
          <CardDescription>
            Visualização da distribuição de estudantes nos diferentes níveis de suporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RtiPyramidChart data={null} onViewStudents={handleViewStudents} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tier 1</CardTitle>
            <CardDescription>Suporte Universal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">80%</div>
            <p className="text-sm text-muted-foreground">
              Ensino de alta qualidade para todos os estudantes na sala de aula regular
            </p>
            <div className="mt-4">
              <div className="text-sm font-medium">Principais Características:</div>
              <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                <li>Disponível para todos os estudantes</li>
                <li>Implementação em sala de aula regular</li>
                <li>Monitoramento trimestral</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tier 2</CardTitle>
            <CardDescription>Suporte Direcionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500 mb-2">15%</div>
            <p className="text-sm text-muted-foreground">
              Intervenções direcionadas para estudantes que não respondem adequadamente ao Tier 1
            </p>
            <div className="mt-4">
              <div className="text-sm font-medium">Principais Características:</div>
              <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                <li>Intervenções em pequenos grupos</li>
                <li>Monitoramento semanal ou quinzenal</li>
                <li>Duração de 10-15 semanas</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tier 3</CardTitle>
            <CardDescription>Suporte Intensivo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500 mb-2">5%</div>
            <p className="text-sm text-muted-foreground">
              Intervenções intensivas e individualizadas para estudantes com necessidades significativas
            </p>
            <div className="mt-4">
              <div className="text-sm font-medium">Principais Características:</div>
              <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                <li>Intervenções individualizadas</li>
                <li>Monitoramento diário ou semanal</li>
                <li>Implementação por especialistas</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recomendações para Implementação Eficaz</CardTitle>
          <CardDescription>
            Estratégias para melhorar a implementação do modelo Innerview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">1. Avaliação Universal</h3>
              <p className="text-sm text-muted-foreground">
                Implementar avaliações universais regulares para identificar estudantes em risco e monitorar o progresso de todos os alunos.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">2. Intervenções Baseadas em Evidências</h3>
              <p className="text-sm text-muted-foreground">
                Utilizar apenas intervenções com base científica, adequadas às necessidades específicas dos estudantes.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">3. Monitoramento de Progresso</h3>
              <p className="text-sm text-muted-foreground">
                Estabelecer um sistema consistente de monitoramento para avaliar a eficácia das intervenções e ajustá-las conforme necessário.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1">4. Tomada de Decisão Baseada em Dados</h3>
              <p className="text-sm text-muted-foreground">
                Utilizar dados para orientar todas as decisões sobre intervenções, movimentação entre tiers e ajustes no programa.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 