'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  Trash2,
  BookOpen,
  BrainCircuit,
  Calendar,
} from 'lucide-react';

// Tipos
interface Student {
  id: string;
  name: string;
  grade: string;
  dateOfBirth: string;
  riskLevel: 'low' | 'medium' | 'high';
  responsibleTeacher: string;
  notes?: string;
}

interface Assessment {
  id: string;
  date: string;
  type: string;
  score: number;
  notes: string;
}

interface Intervention {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  status: 'active' | 'completed' | 'cancelled';
  description: string;
  progress: string;
}

// Dados simulados
const mockStudent: Student = {
  id: '1',
  name: 'João Silva',
  grade: '3º Ano',
  dateOfBirth: '2015-03-15',
  riskLevel: 'high',
  responsibleTeacher: 'Maria Santos',
  notes: 'Apresenta dificuldades em leitura e compreensão textual.',
};

const mockAssessments: Assessment[] = [
  {
    id: '1',
    date: '2024-02-15',
    type: 'Leitura',
    score: 65,
    notes: 'Dificuldade na compreensão de textos complexos.',
  },
  {
    id: '2',
    date: '2024-01-20',
    type: 'Matemática',
    score: 78,
    notes: 'Melhora significativa em operações básicas.',
  },
  {
    id: '3',
    date: '2024-01-05',
    type: 'Comportamental',
    score: 85,
    notes: 'Boa participação em atividades em grupo.',
  },
];

const mockInterventions: Intervention[] = [
  {
    id: '1',
    startDate: '2024-01-10',
    endDate: '2024-02-10',
    type: 'Reforço em Leitura',
    status: 'completed',
    description: 'Sessões individuais de leitura com foco em compreensão textual.',
    progress: 'Melhora na fluência de leitura.',
  },
  {
    id: '2',
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    type: 'Apoio em Matemática',
    status: 'active',
    description: 'Atividades extras de matemática com foco em resolução de problemas.',
    progress: 'Em andamento - 50% concluído.',
  },
];

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StudentDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este estudante?')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar a chamada real à API
      console.log('Deletando estudante:', params.id);
      
      toast.success('Estudante excluído com sucesso!');
      router.push('/students');
    } catch (error) {
      console.error('Erro ao excluir estudante:', error);
      toast.error('Erro ao excluir estudante. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRiskBadgeColor = (risk: Student['riskLevel']) => {
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

  const getRiskLabel = (risk: Student['riskLevel']) => {
    switch (risk) {
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Médio';
      case 'low':
        return 'Baixo';
      default:
        return risk;
    }
  };

  const getStatusColor = (status: Intervention['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: Intervention['status']) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{mockStudent.name}</h1>
            <p className="text-muted-foreground">
              Detalhes do estudante e seu progresso
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/students/${params.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados cadastrais do estudante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Série</p>
                <p className="text-sm">{mockStudent.grade}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                <p className="text-sm">{formatDate(mockStudent.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Professor Responsável</p>
                <p className="text-sm">{mockStudent.responsibleTeacher}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nível de Risco</p>
                <Badge className={getRiskBadgeColor(mockStudent.riskLevel)}>
                  {getRiskLabel(mockStudent.riskLevel)}
                </Badge>
              </div>
            </div>
            {mockStudent.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Observações</p>
                <p className="text-sm">{mockStudent.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Progresso</CardTitle>
            <CardDescription>Visão geral do desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Avaliações</span>
                </div>
                <span className="text-sm">{mockAssessments.length} realizadas</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BrainCircuit className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Intervenções</span>
                </div>
                <span className="text-sm">{mockInterventions.length} registradas</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Próxima Avaliação</span>
                </div>
                <span className="text-sm">Em 7 dias</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assessments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assessments">Avaliações</TabsTrigger>
          <TabsTrigger value="interventions">Intervenções</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessments" className="space-y-4">
          {mockAssessments.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{assessment.type}</CardTitle>
                  <Badge variant="outline">{assessment.score}%</Badge>
                </div>
                <CardDescription>{formatDate(assessment.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{assessment.notes}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          {mockInterventions.map((intervention) => (
            <Card key={intervention.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{intervention.type}</CardTitle>
                  <Badge className={getStatusColor(intervention.status)}>
                    {getStatusLabel(intervention.status)}
                  </Badge>
                </div>
                <CardDescription>
                  {formatDate(intervention.startDate)} - {formatDate(intervention.endDate)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{intervention.description}</p>
                <p className="text-sm font-medium">{intervention.progress}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
} 