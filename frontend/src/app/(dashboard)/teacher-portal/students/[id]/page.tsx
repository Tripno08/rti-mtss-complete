'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, BookOpen, Calendar, ChevronRight, Download, FileText, LineChart, MessageSquare, Plus, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart as RechartsLineChart, Line } from 'recharts';
import { getStudentById } from '@/lib/api/students';
import { getInterventionsByStudentId, Intervention as ApiIntervention } from '@/lib/api/interventions';
import { getAssessmentsByStudentId, Assessment as ApiAssessment } from '@/lib/api/assessments';
import { differenceInYears } from 'date-fns';

// Tipos
interface Student {
  id: string;
  name: string;
  grade: string;
  className: string;
  age: number;
  birthDate: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  performanceLevel: 'high' | 'medium' | 'low';
  photo?: string;
}

interface Assessment {
  id: string;
  date: string;
  type: string;
  score: number;
  maxScore: number;
  percentile: number;
}

interface Content {
  id: string;
  name: string;
  category: string;
  status: 'mastered' | 'developing' | 'struggling';
  lastAssessmentDate: string;
}

interface Intervention {
  id: string;
  title: string;
  type: 'individual' | 'group';
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  effectiveness?: number;
  notes?: string;
}

// Dados mockados
const MOCK_CONTENTS: Content[] = [
  { id: '1', name: 'Adição com reagrupamento', category: 'Matemática', status: 'mastered', lastAssessmentDate: '2025-03-12' },
  { id: '2', name: 'Subtração com reagrupamento', category: 'Matemática', status: 'developing', lastAssessmentDate: '2025-03-12' },
  { id: '3', name: 'Multiplicação básica', category: 'Matemática', status: 'struggling', lastAssessmentDate: '2025-03-12' },
  { id: '4', name: 'Divisão básica', category: 'Matemática', status: 'struggling', lastAssessmentDate: '2025-03-12' },
  { id: '5', name: 'Leitura fluente', category: 'Português', status: 'developing', lastAssessmentDate: '2025-03-10' },
  { id: '6', name: 'Interpretação de texto', category: 'Português', status: 'struggling', lastAssessmentDate: '2025-03-10' },
  { id: '7', name: 'Escrita de frases', category: 'Português', status: 'developing', lastAssessmentDate: '2025-03-10' },
  { id: '8', name: 'Ortografia básica', category: 'Português', status: 'mastered', lastAssessmentDate: '2025-03-10' }
];

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadData = async () => {
      if (!params?.id) return;
      
      try {
        setIsLoading(true);
        
        // Buscar dados do estudante da API
        const studentId = params.id as string;
        const studentData = await getStudentById(studentId);
        
        // Calcular a idade com base na data de nascimento
        const age = studentData.dateOfBirth 
          ? differenceInYears(new Date(), new Date(studentData.dateOfBirth))
          : 0;
        
        // Buscar intervenções do estudante
        const interventionsData = await getInterventionsByStudentId(studentId);
        
        // Buscar avaliações do estudante
        const assessmentsData = await getAssessmentsByStudentId(studentId);
        
        // Determinar nível de desempenho com base no número de intervenções (lógica simplificada)
        let performanceLevel: 'high' | 'medium' | 'low' = 'high';
        if (interventionsData.length >= 3) {
          performanceLevel = 'low';
        } else if (interventionsData.length >= 1) {
          performanceLevel = 'medium';
        }
        
        // Mapear intervenções da API para o formato que precisamos
        const mappedInterventions: Intervention[] = interventionsData.map((intervention: ApiIntervention) => {
          // Mapear status da API para o formato que usamos na UI
          let uiStatus: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
          switch (intervention.status) {
            case 'ACTIVE':
              uiStatus = 'in-progress';
              break;
            case 'COMPLETED':
              uiStatus = 'completed';
              break;
            case 'CANCELLED':
              uiStatus = 'cancelled';
              break;
            default:
              uiStatus = 'scheduled';
          }
          
          return {
            id: intervention.id,
            title: intervention.type,
            type: 'individual',
            startDate: intervention.startDate,
            endDate: intervention.endDate || '',
            status: uiStatus,
            notes: intervention.notes
          };
        });
        
        // Mapear avaliações da API para o formato que precisamos
        const mappedAssessments: Assessment[] = assessmentsData.map((assessment: ApiAssessment) => {
          return {
            id: assessment.id,
            date: assessment.date,
            type: assessment.type,
            score: assessment.score,
            maxScore: 100, // Assumindo que a pontuação máxima é 100
            percentile: Math.round(assessment.score) // Usando a pontuação como percentil para simplificar
          };
        });
        
        // Atualizar o estado com os dados obtidos
        setStudent({
          id: studentData.id,
          name: studentData.name,
          grade: studentData.grade,
          className: 'Turma ' + studentData.grade.replace(/[^\d]/g, ''),
          age,
          birthDate: studentData.dateOfBirth,
          parentName: 'Informação não disponível',
          parentEmail: 'Informação não disponível',
          parentPhone: 'Informação não disponível',
          performanceLevel,
          photo: 'https://i.pravatar.cc/150?img=32' // Placeholder
        });
        
        setInterventions(mappedInterventions);
        setAssessments(mappedAssessments);
        setContents(MOCK_CONTENTS);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params?.id]);

  // Dados para os gráficos
  const progressData = assessments.map(assessment => ({
    name: new Date(assessment.date).toLocaleDateString('pt-BR'),
    percentile: assessment.percentile,
    score: (assessment.score / assessment.maxScore) * 100
  }));

  const contentStatusData = [
    { name: 'Dominados', value: contents.filter(c => c.status === 'mastered').length },
    { name: 'Em desenvolvimento', value: contents.filter(c => c.status === 'developing').length },
    { name: 'Com dificuldade', value: contents.filter(c => c.status === 'struggling').length }
  ];

  const COLORS = ['#4ade80', '#facc15', '#f87171'];

  // Função para obter a cor com base no status do conteúdo
  const getContentStatusColor = (status: 'mastered' | 'developing' | 'struggling') => {
    switch (status) {
      case 'mastered': return 'bg-green-100 text-green-800';
      case 'developing': return 'bg-yellow-100 text-yellow-800';
      case 'struggling': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter o texto do status do conteúdo
  const getContentStatusText = (status: 'mastered' | 'developing' | 'struggling') => {
    switch (status) {
      case 'mastered': return 'Dominado';
      case 'developing': return 'Em desenvolvimento';
      case 'struggling': return 'Com dificuldade';
      default: return 'Desconhecido';
    }
  };

  // Função para obter a cor com base no status da intervenção
  const getInterventionStatusColor = (status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter o texto do status da intervenção
  const getInterventionStatusText = (status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'in-progress': return 'Em andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconhecido';
    }
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex h-48 flex-col items-center justify-center">
        <p className="text-xl font-semibold">Aluno não encontrado</p>
        <Button variant="link" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
          <p className="text-muted-foreground">
            {student.grade} - {student.className}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
          <Button onClick={() => router.push(`/teacher-portal/interventions/new?studentId=${student.id}`)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Intervenção
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex-1">
              <CardTitle className="text-sm font-medium">Informações Pessoais</CardTitle>
            </div>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full overflow-hidden">
                {student.photo ? (
                  <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-2xl font-bold">
                    {student.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Idade:</span>
                <span className="text-sm">{student.age} anos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Data de Nascimento:</span>
                <span className="text-sm">{formatDate(student.birthDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Responsável:</span>
                <span className="text-sm">{student.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{student.parentEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Telefone:</span>
                <span className="text-sm">{student.parentPhone}</span>
              </div>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/teacher-portal/communications/new?parentEmail=${student.parentEmail}`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contatar Responsável
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <div className="flex-1">
              <CardTitle className="text-sm font-medium">Progresso Acadêmico</CardTitle>
              <CardDescription>Evolução nas avaliações</CardDescription>
            </div>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={progressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" name="Pontuação (%)" />
                  <Line type="monotone" dataKey="percentile" stroke="#82ca9d" name="Percentil" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="contents" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Conteúdos
          </TabsTrigger>
          <TabsTrigger value="interventions" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Intervenções
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Conteúdos</CardTitle>
                <CardDescription>
                  Status dos conteúdos avaliados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {contentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Últimas Avaliações</h3>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/teacher-portal/assessments/new?studentId=${student.id}`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Avaliação
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={assessments.map(a => ({
                        name: new Date(a.date).toLocaleDateString('pt-BR'),
                        pontuação: (a.score / a.maxScore) * 100
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pontuação" fill="#8884d8" name="Pontuação (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Intervenções</CardTitle>
              <CardDescription>
                Intervenções agendadas ou em andamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interventions
                  .filter(i => ['scheduled', 'in-progress'].includes(i.status))
                  .map(intervention => (
                    <div key={intervention.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <h4 className="font-medium">{intervention.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{intervention.type === 'individual' ? 'Individual' : 'Em grupo'}</span>
                          <span>•</span>
                          <span>{formatDate(intervention.startDate)} até {formatDate(intervention.endDate)}</span>
                        </div>
                        <div className="pt-1">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getInterventionStatusColor(intervention.status)}`}>
                            {getInterventionStatusText(intervention.status)}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/teacher-portal/interventions/${intervention.id}`}>
                          <span className="sr-only">Ver detalhes</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                {interventions.filter(i => ['scheduled', 'in-progress'].includes(i.status)).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma intervenção agendada ou em andamento.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdos Avaliados</CardTitle>
              <CardDescription>
                Status de domínio dos conteúdos curriculares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  {contentStatusData.map((status, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="text-sm">{status.name}: {status.value}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {['Matemática', 'Português'].map(category => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-semibold">{category}</h3>
                      <div className="grid gap-2 md:grid-cols-2">
                        {contents
                          .filter(content => content.category === category)
                          .map(content => (
                            <div key={content.id} className="rounded-lg border p-4">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{content.name}</h4>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getContentStatusColor(content.status)}`}>
                                  {getContentStatusText(content.status)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Última avaliação: {formatDate(content.lastAssessmentDate)}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">Histórico de Intervenções</h3>
            <Button onClick={() => router.push(`/teacher-portal/interventions/new?studentId=${student.id}`)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Intervenção
            </Button>
          </div>

          <div className="space-y-4">
            {interventions.map(intervention => (
              <Card key={intervention.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{intervention.title}</CardTitle>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getInterventionStatusColor(intervention.status)}`}>
                      {getInterventionStatusText(intervention.status)}
                    </span>
                  </div>
                  <CardDescription>
                    {intervention.type === 'individual' ? 'Intervenção Individual' : 'Intervenção em Grupo'} • 
                    {new Date(intervention.startDate).toLocaleDateString('pt-BR')} até {new Date(intervention.endDate).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {intervention.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Observações:</h4>
                      <p className="text-sm text-muted-foreground">{intervention.notes}</p>
                    </div>
                  )}
                  {intervention.effectiveness !== undefined && (
                    <div>
                      <h4 className="font-medium mb-1">Efetividade:</h4>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div 
                            key={index} 
                            className={`h-2 w-8 rounded ${index < intervention.effectiveness! ? 'bg-primary' : 'bg-muted'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {intervention.effectiveness}/5
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher-portal/interventions/${intervention.id}`}>
                        Ver Detalhes
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {interventions.length === 0 && (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Nenhuma intervenção registrada para este aluno.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
              <CardDescription>
                Relatórios gerados para este aluno
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Relatório de Progresso</h4>
                      <p className="text-sm text-muted-foreground">
                        Resumo do progresso acadêmico do aluno
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Histórico de Intervenções</h4>
                      <p className="text-sm text-muted-foreground">
                        Detalhes de todas as intervenções realizadas
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Relatório de Avaliações</h4>
                      <p className="text-sm text-muted-foreground">
                        Resultados detalhados de todas as avaliações
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 