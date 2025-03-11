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
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  BookOpen,
  LineChart,
  FileText,
} from 'lucide-react';

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
  notes: string;
  recommendations: string;
  previousScore?: number;
  improvement?: number;
}

// Dados simulados
const mockAssessment: Assessment = {
  id: '1',
  studentName: 'João Silva',
  studentGrade: '3º Ano',
  type: 'Leitura',
  date: '2024-02-15',
  score: 75,
  evaluator: 'Maria Santos',
  status: 'completed',
  notes: 'O aluno demonstrou melhora significativa na fluência de leitura, mas ainda apresenta dificuldades na compreensão de textos mais complexos. Recomenda-se continuar com as intervenções focadas em estratégias de compreensão textual.',
  recommendations: 'Continuar com as sessões de leitura guiada, focando em textos progressivamente mais complexos. Implementar atividades de identificação de ideias principais e detalhes de suporte.',
  previousScore: 65,
  improvement: 10,
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AssessmentDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar a chamada real à API
      console.log('Deletando avaliação:', params.id);
      
      toast.success('Avaliação excluída com sucesso!');
      router.push('/assessments');
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      toast.error('Erro ao excluir avaliação. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Detalhes da Avaliação</h1>
            <p className="text-muted-foreground">
              Avaliação de {mockAssessment.type} - {mockAssessment.studentName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/assessments/${params.id}/edit`)}
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
            <CardDescription>Detalhes da avaliação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estudante</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{mockAssessment.studentName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Série</p>
                <p className="text-sm">{mockAssessment.studentGrade}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{formatDate(mockAssessment.date)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{mockAssessment.type}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avaliador</p>
                <p className="text-sm">{mockAssessment.evaluator}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStatusBadgeColor(mockAssessment.status)}>
                  {getStatusLabel(mockAssessment.status)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>Pontuação e progresso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pontuação Atual</p>
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                  <p className="text-2xl font-bold">{mockAssessment.score}%</p>
                </div>
              </div>
              {mockAssessment.previousScore && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pontuação Anterior</p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    {mockAssessment.previousScore}%
                  </p>
                </div>
              )}
              {mockAssessment.improvement && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Melhoria</p>
                  <p className="text-2xl font-bold text-green-600">
                    +{mockAssessment.improvement}%
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
            <CardDescription>Notas sobre a avaliação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
              <p className="text-sm">{mockAssessment.notes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recomendações</CardTitle>
            <CardDescription>Próximos passos sugeridos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
              <p className="text-sm">{mockAssessment.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 