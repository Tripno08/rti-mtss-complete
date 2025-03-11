'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  BookOpen, 
  Calculator, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ThumbsUp, 
  Bell
} from 'lucide-react';

// Tipos para os dados
interface Student {
  id: string;
  name: string;
  grade: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface Intervention {
  id: string;
  name: string;
  type: string;
  description: string;
  recommendationScore: number;
  successRate: number;
  timeCommitment: string;
  resourceIntensity: 'low' | 'medium' | 'high';
}

interface InterventionRecommendation {
  studentId: string;
  interventionId: string;
  score: number;
  reason: string;
}

interface AdjustmentRecommendation {
  interventionId: string;
  currentSetting: string;
  recommendedSetting: string;
  reason: string;
  potentialImprovement: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  date: string;
  relatedStudentId?: string;
  relatedInterventionId?: string;
  isRead: boolean;
}

export default function RecommendationsTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<InterventionRecommendation[]>([]);
  const [adjustments, setAdjustments] = useState<AdjustmentRecommendation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recommendationType, setRecommendationType] = useState<'interventions' | 'adjustments' | 'alerts'>('interventions');

  useEffect(() => {
    // Simulando carregamento de dados
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulando uma chamada de API
        setTimeout(() => {
          // Dados simulados
          const mockStudents: Student[] = [
            { id: '1', name: 'João Silva', grade: '3º Ano', riskLevel: 'high' },
            { id: '2', name: 'Maria Santos', grade: '3º Ano', riskLevel: 'medium' },
            { id: '3', name: 'Pedro Oliveira', grade: '3º Ano', riskLevel: 'low' },
            { id: '4', name: 'Ana Pereira', grade: '3º Ano', riskLevel: 'high' },
            { id: '5', name: 'Lucas Mendes', grade: '3º Ano', riskLevel: 'medium' }
          ];

          const mockInterventions: Intervention[] = [
            { 
              id: '1', 
              name: 'Instrução Fonológica Intensiva', 
              type: 'Leitura',
              description: 'Sessões diárias de 20 minutos focadas em consciência fonológica e decodificação.',
              recommendationScore: 0.92,
              successRate: 0.85,
              timeCommitment: '20 min/dia',
              resourceIntensity: 'medium'
            },
            { 
              id: '2', 
              name: 'Tutoria de Pares em Leitura', 
              type: 'Leitura',
              description: 'Sessões de leitura em pares com estudantes mais avançados, 3x por semana.',
              recommendationScore: 0.88,
              successRate: 0.78,
              timeCommitment: '30 min, 3x/semana',
              resourceIntensity: 'low'
            },
            { 
              id: '3', 
              name: 'Instrução Explícita em Matemática', 
              type: 'Matemática',
              description: 'Instrução direta em conceitos matemáticos com prática guiada e feedback imediato.',
              recommendationScore: 0.85,
              successRate: 0.82,
              timeCommitment: '30 min/dia',
              resourceIntensity: 'medium'
            },
            { 
              id: '4', 
              name: 'Monitoramento de Comportamento', 
              type: 'Comportamento',
              description: 'Sistema de check-in/check-out diário com feedback comportamental.',
              recommendationScore: 0.75,
              successRate: 0.70,
              timeCommitment: '10 min, 2x/dia',
              resourceIntensity: 'low'
            },
            { 
              id: '5', 
              name: 'Intervenção Intensiva em Fluência', 
              type: 'Leitura',
              description: 'Prática de leitura repetida com monitoramento de precisão e velocidade.',
              recommendationScore: 0.82,
              successRate: 0.75,
              timeCommitment: '15 min/dia',
              resourceIntensity: 'medium'
            }
          ];

          const mockRecommendations: InterventionRecommendation[] = [
            {
              studentId: '1',
              interventionId: '1',
              score: 0.92,
              reason: 'Alta correspondência com o perfil de dificuldades fonológicas e histórico de resposta positiva a intervenções similares.'
            },
            {
              studentId: '1',
              interventionId: '5',
              score: 0.85,
              reason: 'Déficit significativo em fluência de leitura identificado nas últimas avaliações.'
            },
            {
              studentId: '1',
              interventionId: '2',
              score: 0.78,
              reason: 'Benefício potencial da interação com pares mais avançados para modelagem de leitura fluente.'
            },
            {
              studentId: '2',
              interventionId: '3',
              score: 0.90,
              reason: 'Dificuldades específicas com conceitos matemáticos básicos que requerem instrução explícita.'
            },
            {
              studentId: '2',
              interventionId: '2',
              score: 0.82,
              reason: 'Histórico de resposta positiva a abordagens colaborativas de aprendizagem.'
            },
            {
              studentId: '4',
              interventionId: '1',
              score: 0.88,
              reason: 'Padrão de erros fonológicos consistente nas avaliações de leitura.'
            },
            {
              studentId: '4',
              interventionId: '4',
              score: 0.85,
              reason: 'Dificuldades de atenção que impactam o desempenho acadêmico.'
            }
          ];

          const mockAdjustments: AdjustmentRecommendation[] = [
            {
              interventionId: '1',
              currentSetting: 'Sessões de 20 minutos, 3x por semana',
              recommendedSetting: 'Sessões de 15 minutos, 5x por semana',
              reason: 'Sessões mais curtas e mais frequentes mostram maior eficácia para retenção de habilidades fonológicas.',
              potentialImprovement: 15
            },
            {
              interventionId: '3',
              currentSetting: 'Grupo de 6 estudantes',
              recommendedSetting: 'Grupo de 3-4 estudantes',
              reason: 'Grupos menores permitem mais prática guiada e feedback individualizado.',
              potentialImprovement: 20
            },
            {
              interventionId: '4',
              currentSetting: 'Check-in apenas no início do dia',
              recommendedSetting: 'Check-in no início e check-out no final do dia',
              reason: 'O ciclo completo de feedback melhora a autorregulação comportamental.',
              potentialImprovement: 25
            }
          ];

          const mockAlerts: Alert[] = [
            {
              id: '1',
              type: 'warning',
              title: 'Queda de Desempenho Detectada',
              description: 'João Silva apresentou queda de 15% na avaliação de leitura mais recente.',
              date: '2023-11-10',
              relatedStudentId: '1',
              isRead: false
            },
            {
              id: '2',
              type: 'info',
              title: 'Intervenção Concluída',
              description: 'Maria Santos completou o ciclo de 8 semanas de Instrução Explícita em Matemática.',
              date: '2023-11-08',
              relatedStudentId: '2',
              relatedInterventionId: '3',
              isRead: true
            },
            {
              id: '3',
              type: 'success',
              title: 'Meta Atingida',
              description: 'Pedro Oliveira atingiu a meta de fluência de leitura de 90 palavras por minuto.',
              date: '2023-11-05',
              relatedStudentId: '3',
              isRead: false
            },
            {
              id: '4',
              type: 'warning',
              title: 'Baixa Participação',
              description: 'Ana Pereira participou de apenas 60% das sessões de intervenção na última semana.',
              date: '2023-11-02',
              relatedStudentId: '4',
              isRead: false
            }
          ];

          setStudents(mockStudents);
          setInterventions(mockInterventions);
          setRecommendations(mockRecommendations);
          setAdjustments(mockAdjustments);
          setAlerts(mockAlerts);
          setSelectedStudent(mockStudents[0].id);
          
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Função para obter recomendações para um estudante específico
  const getStudentRecommendations = (studentId: string) => {
    return recommendations
      .filter(rec => rec.studentId === studentId)
      .sort((a, b) => b.score - a.score);
  };

  // Função para obter detalhes de uma intervenção
  const getInterventionDetails = (interventionId: string) => {
    return interventions.find(int => int.id === interventionId);
  };

  // Função para obter a cor com base no nível de risco
  const getRiskColor = (riskLevel: 'low' | 'medium' | 'high') => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter a cor com base no tipo de alerta
  const getAlertColor = (type: 'warning' | 'info' | 'success') => {
    switch (type) {
      case 'warning':
        return 'bg-red-100 border-red-200';
      case 'info':
        return 'bg-blue-100 border-blue-200';
      case 'success':
        return 'bg-green-100 border-green-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  // Função para obter o ícone com base no tipo de alerta
  const getAlertIcon = (type: 'warning' | 'info' | 'success') => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'info':
        return <Bell className="h-5 w-5 text-blue-600" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  // Função para obter o ícone com base no tipo de intervenção
  const getInterventionIcon = (type: string) => {
    switch (type) {
      case 'Leitura':
        return <BookOpen className="h-5 w-5 text-primary" />;
      case 'Matemática':
        return <Calculator className="h-5 w-5 text-primary" />;
      case 'Comportamento':
        return <Users className="h-5 w-5 text-primary" />;
      default:
        return <Clock className="h-5 w-5 text-primary" />;
    }
  };

  // Função para formatar o percentual
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  const selectedStudentData = students.find(s => s.id === selectedStudent);
  const studentRecommendations = selectedStudent ? getStudentRecommendations(selectedStudent) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/2">
          <Select value={selectedStudent || ''} onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um estudante" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.grade}) - 
                  <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(student.riskLevel)}`}>
                    {student.riskLevel === 'high' ? 'Alto Risco' : student.riskLevel === 'medium' ? 'Risco Médio' : 'Baixo Risco'}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <Select value={recommendationType} onValueChange={(value: 'interventions' | 'adjustments' | 'alerts') => setRecommendationType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de recomendação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interventions">Recomendações de Intervenções</SelectItem>
              <SelectItem value="adjustments">Ajustes em Intervenções</SelectItem>
              <SelectItem value="alerts">Alertas Inteligentes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {recommendationType === 'interventions' && selectedStudentData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intervenções Recomendadas para {selectedStudentData.name}</CardTitle>
              <CardDescription>
                Baseadas no perfil do estudante, histórico de avaliações e padrões de resposta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studentRecommendations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma recomendação disponível para este estudante.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {studentRecommendations.map((recommendation) => {
                    const intervention = getInterventionDetails(recommendation.interventionId);
                    if (!intervention) return null;
                    
                    return (
                      <div key={recommendation.interventionId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            {getInterventionIcon(intervention.type)}
                            <div>
                              <h3 className="font-medium">{intervention.name}</h3>
                              <p className="text-sm text-muted-foreground">{intervention.description}</p>
                            </div>
                          </div>
                          <Badge className="bg-primary text-primary-foreground">
                            {formatPercent(recommendation.score)} Correspondência
                          </Badge>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Taxa de Sucesso: {formatPercent(intervention.successRate)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Tempo: {intervention.timeCommitment}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">Intensidade:</span>
                            <Badge variant="outline" className={
                              intervention.resourceIntensity === 'high' 
                                ? 'border-red-200 text-red-800' 
                                : intervention.resourceIntensity === 'medium'
                                  ? 'border-yellow-200 text-yellow-800'
                                  : 'border-green-200 text-green-800'
                            }>
                              {intervention.resourceIntensity === 'high' 
                                ? 'Alta' 
                                : intervention.resourceIntensity === 'medium'
                                  ? 'Média'
                                  : 'Baixa'
                              }
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4 bg-muted p-3 rounded text-sm">
                          <p className="font-medium">Motivo da Recomendação:</p>
                          <p>{recommendation.reason}</p>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button>
                            Implementar Intervenção <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {recommendationType === 'adjustments' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ajustes Recomendados em Intervenções Existentes</CardTitle>
              <CardDescription>
                Otimizações baseadas em análise de eficácia e padrões de resposta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adjustments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum ajuste recomendado no momento.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {adjustments.map((adjustment) => {
                    const intervention = getInterventionDetails(adjustment.interventionId);
                    if (!intervention) return null;
                    
                    return (
                      <div key={adjustment.interventionId} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            {getInterventionIcon(intervention.type)}
                            <div>
                              <h3 className="font-medium">{intervention.name}</h3>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="mr-2">Atual</Badge>
                                <p className="text-sm">{adjustment.currentSetting}</p>
                              </div>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="mr-2 bg-primary text-primary-foreground">Recomendado</Badge>
                                <p className="text-sm font-medium">{adjustment.recommendedSetting}</p>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            +{adjustment.potentialImprovement}% Potencial
                          </Badge>
                        </div>
                        
                        <div className="mt-4 bg-muted p-3 rounded text-sm">
                          <p className="font-medium">Justificativa:</p>
                          <p>{adjustment.reason}</p>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button>
                            Aplicar Ajuste <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {recommendationType === 'alerts' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Inteligentes</CardTitle>
              <CardDescription>
                Notificações automáticas baseadas em análise contínua de dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum alerta no momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => {
                    const student = alert.relatedStudentId ? students.find(s => s.id === alert.relatedStudentId) : null;
                    const intervention = alert.relatedInterventionId ? interventions.find(i => i.id === alert.relatedInterventionId) : null;
                    
                    return (
                      <Alert key={alert.id} className={`${getAlertColor(alert.type)} ${!alert.isRead ? 'border-l-4' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            {getAlertIcon(alert.type)}
                            <div>
                              <AlertTitle className="font-medium">{alert.title}</AlertTitle>
                              <AlertDescription className="mt-1">{alert.description}</AlertDescription>
                              
                              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                {student && (
                                  <Badge variant="outline">
                                    Estudante: {student.name}
                                  </Badge>
                                )}
                                
                                {intervention && (
                                  <Badge variant="outline">
                                    Intervenção: {intervention.name}
                                  </Badge>
                                )}
                                
                                <Badge variant="outline">
                                  {new Date(alert.date).toLocaleDateString('pt-BR')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {!alert.isRead && (
                            <Badge className="bg-blue-100 text-blue-800">
                              Novo
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="mr-2">
                            Marcar como Lido
                          </Button>
                          <Button size="sm">
                            Tomar Ação
                          </Button>
                        </div>
                      </Alert>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver Todos os Alertas
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
} 