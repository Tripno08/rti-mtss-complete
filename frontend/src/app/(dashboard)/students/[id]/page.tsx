'use client';

import React from 'react';
import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { getStudentById, deleteStudent, Student } from '@/lib/api/students';
import { getInterventionsByStudentId, Intervention } from '@/lib/api/interventions';

// Interface para avaliações (ainda não implementada na API)
interface Assessment {
  id: string;
  date: string;
  type: string;
  score: number;
  notes: string;
}

// Dados simulados apenas para avaliações (até termos a API)
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

// Interface estendida para incluir dados calculados
interface ExtendedStudent extends Student {
  riskLevel: 'low' | 'medium' | 'high';
  teacherName?: string;
  notes?: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StudentDetailsPage({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [student, setStudent] = useState<ExtendedStudent | null>(null);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!resolvedParams) return;
      
      try {
        setIsLoading(true);
        const id = resolvedParams.id;
        
        // Buscar dados do estudante
        const studentData = await getStudentById(id);
        
        // Buscar intervenções do estudante
        let interventionsData: Intervention[] = [];
        try {
          interventionsData = await getInterventionsByStudentId(id);
        } catch (error) {
          console.error(`Erro ao buscar intervenções para o estudante ${id}:`, error);
        }
        
        // Calcular o nível de risco com base no número de intervenções (lógica simplificada)
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        if (interventionsData.length >= 3) {
          riskLevel = 'high';
        } else if (interventionsData.length >= 1) {
          riskLevel = 'medium';
        }
        
        // Criar objeto estendido do estudante
        const extendedStudent: ExtendedStudent = {
          ...studentData,
          riskLevel,
          // Aqui poderíamos buscar o nome do professor se tivéssemos uma API para isso
          teacherName: 'Professor Responsável', // Placeholder
        };
        
        setStudent(extendedStudent);
        setInterventions(interventionsData);
      } catch (error) {
        console.error('Erro ao buscar dados do estudante:', error);
        toast.error('Erro ao carregar os dados do estudante.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentData();
  }, [resolvedParams]);

  const handleDelete = async () => {
    if (!resolvedParams) return;
    
    if (!confirm('Tem certeza que deseja excluir este estudante?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteStudent(resolvedParams.id);
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
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getRiskBadgeColor = (risk: ExtendedStudent['riskLevel']) => {
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

  const getRiskLabel = (risk: ExtendedStudent['riskLevel']) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativa';
      case 'COMPLETED':
        return 'Concluída';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  if (!student) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Estudante não encontrado.</p>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => router.push('/students')}>Voltar para a lista</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
            <p className="text-muted-foreground">
              Detalhes do estudante e seu progresso
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => resolvedParams && router.push(`/students/${resolvedParams.id}/edit`)}
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
                <p className="text-sm">{student.grade}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                <p className="text-sm">{formatDate(student.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nível de Risco</p>
                <Badge className={getRiskBadgeColor(student.riskLevel)}>
                  {getRiskLabel(student.riskLevel)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Professor Responsável</p>
                <p className="text-sm">{student.teacherName || 'Não informado'}</p>
              </div>
            </div>
            {student.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Observações</p>
                <p className="text-sm">{student.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Resumo do desempenho do estudante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Intervenções</div>
                <div className="mt-1 text-2xl font-bold">{interventions.length}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Avaliações</div>
                <div className="mt-1 text-2xl font-bold">{mockAssessments.length}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Intervenções Ativas</div>
                <div className="mt-1 text-2xl font-bold">
                  {interventions.filter(i => i.status === 'ACTIVE').length}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Média de Avaliações</div>
                <div className="mt-1 text-2xl font-bold">
                  {mockAssessments.length > 0
                    ? Math.round(
                        mockAssessments.reduce((acc, curr) => acc + curr.score, 0) /
                          mockAssessments.length
                      )
                    : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="interventions">
        <TabsList>
          <TabsTrigger value="interventions" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Intervenções
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            Avaliações
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Linha do Tempo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interventions" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Intervenções</CardTitle>
                <CardDescription>
                  Intervenções aplicadas ao estudante
                </CardDescription>
              </div>
              <Button
                onClick={() => resolvedParams && router.push(`/interventions/new?studentId=${resolvedParams.id}`)}
              >
                Nova Intervenção
              </Button>
            </CardHeader>
            <CardContent>
              {interventions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma intervenção registrada para este estudante.
                </p>
              ) : (
                <div className="space-y-4">
                  {interventions.map((intervention) => (
                    <div
                      key={intervention.id}
                      className="rounded-lg border p-4 cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/interventions/${intervention.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{intervention.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(intervention.startDate)} - {intervention.endDate ? formatDate(intervention.endDate) : 'Em andamento'}
                          </p>
                        </div>
                        <Badge className={getStatusColor(intervention.status)}>
                          {getStatusLabel(intervention.status)}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm">{intervention.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Avaliações</CardTitle>
                <CardDescription>
                  Avaliações realizadas pelo estudante
                </CardDescription>
              </div>
              <Button
                onClick={() => resolvedParams && router.push(`/assessments/new?studentId=${resolvedParams.id}`)}
              >
                Nova Avaliação
              </Button>
            </CardHeader>
            <CardContent>
              {mockAssessments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma avaliação registrada para este estudante.
                </p>
              ) : (
                <div className="space-y-4">
                  {mockAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="rounded-lg border p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{assessment.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(assessment.date)}
                          </p>
                        </div>
                        <div className="text-xl font-bold">{assessment.score}%</div>
                      </div>
                      <p className="mt-2 text-sm">{assessment.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Linha do Tempo</CardTitle>
              <CardDescription>
                Histórico de atividades do estudante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Combinar intervenções e avaliações em uma linha do tempo */}
                {[
                  ...interventions.map(i => ({
                    id: `intervention-${i.id}`,
                    date: i.startDate,
                    title: `Intervenção: ${i.type}`,
                    description: i.description,
                    type: 'intervention',
                  })),
                  ...mockAssessments.map(a => ({
                    id: `assessment-${a.id}`,
                    date: a.date,
                    title: `Avaliação: ${a.type}`,
                    description: a.notes,
                    type: 'assessment',
                  })),
                ]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((item, index) => (
                    <div key={item.id} className="relative pl-6 pb-4">
                      {index !== 0 && (
                        <div className="absolute left-2.5 top-0 h-full w-px bg-muted-foreground/20"></div>
                      )}
                      <div className="absolute left-0 top-1 h-5 w-5 rounded-full border-2 border-primary bg-background"></div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {formatDate(item.date)}
                          </p>
                          <Badge variant="outline">
                            {item.type === 'intervention' ? 'Intervenção' : 'Avaliação'}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 