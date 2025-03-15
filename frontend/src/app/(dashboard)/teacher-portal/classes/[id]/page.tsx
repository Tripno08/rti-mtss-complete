'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, BookOpen, Calendar, Download, LineChart, Plus, Search, User, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getClassById, Class, getClassStudents } from '@/lib/api/classes';
import { getContentsByClass, Content as ApiContent } from '@/lib/api/contents';
import { getInterventionsByStudentId } from '@/lib/api/interventions';
import { ClassStudent } from '@/lib/api/classes';

// Interface estendida para estudantes com dados calculados
interface ExtendedStudent {
  id: string;
  name: string;
  performanceLevel: 'high' | 'medium' | 'low';
  interventionsCount: number;
  lastAssessmentDate: string;
  attentionRequired: boolean;
  attentionReason?: string;
}

// Interface local para conteúdos com campos adicionais para UI
interface Content {
  id: string;
  name: string;
  category: string;
  difficultyLevel: number; // 0-10, onde 10 é a maior dificuldade
}

// Dados mockados apenas para conteúdos, que ainda não temos no backend
const MOCK_CONTENTS: Content[] = [
  { id: '1', name: 'Adição com reagrupamento', category: 'Matemática', difficultyLevel: 3 },
  { id: '2', name: 'Subtração com reagrupamento', category: 'Matemática', difficultyLevel: 5 },
  { id: '3', name: 'Multiplicação básica', category: 'Matemática', difficultyLevel: 7 },
  { id: '4', name: 'Divisão básica', category: 'Matemática', difficultyLevel: 8 },
  { id: '5', name: 'Frações', category: 'Matemática', difficultyLevel: 6 },
  { id: '6', name: 'Geometria básica', category: 'Matemática', difficultyLevel: 4 },
  { id: '7', name: 'Leitura fluente', category: 'Português', difficultyLevel: 5 },
  { id: '8', name: 'Interpretação de texto', category: 'Português', difficultyLevel: 7 },
  { id: '9', name: 'Escrita de frases', category: 'Português', difficultyLevel: 6 },
  { id: '10', name: 'Ortografia básica', category: 'Português', difficultyLevel: 4 },
  { id: '11', name: 'Gramática básica', category: 'Português', difficultyLevel: 6 },
  { id: '12', name: 'Produção de texto', category: 'Português', difficultyLevel: 8 },
];

// Função para mapear conteúdos da API para o formato local
const mapApiContentToLocalContent = (apiContent: ApiContent): Content => {
  // Determinar categoria com base no título ou descrição
  let category = 'Geral';
  const titleLower = apiContent.title.toLowerCase();
  const descriptionLower = apiContent.description?.toLowerCase() || '';
  
  if (
    titleLower.includes('matemática') || 
    descriptionLower.includes('matemática') ||
    titleLower.includes('adição') || 
    titleLower.includes('subtração') ||
    titleLower.includes('multiplicação') ||
    titleLower.includes('divisão') ||
    titleLower.includes('fração') ||
    titleLower.includes('geometria') ||
    titleLower.includes('número')
  ) {
    category = 'Matemática';
  } else if (
    titleLower.includes('português') ||
    descriptionLower.includes('português') ||
    titleLower.includes('leitura') ||
    titleLower.includes('escrita') ||
    titleLower.includes('texto') ||
    titleLower.includes('gramática') ||
    titleLower.includes('ortografia')
  ) {
    category = 'Português';
  }
  
  // Determinar nível de dificuldade com base no tipo e status
  let difficultyLevel = 5; // Valor padrão médio
  
  if (apiContent.type === 'assessment') {
    difficultyLevel = 8; // Avaliações são mais difíceis
  } else if (apiContent.type === 'activity') {
    difficultyLevel = 6; // Atividades têm dificuldade média-alta
  } else {
    difficultyLevel = 4; // Aulas têm dificuldade média-baixa
  }
  
  // Ajustar com base no status
  if (apiContent.status === 'draft') {
    difficultyLevel = Math.max(2, difficultyLevel - 2); // Rascunhos são menos difíceis
  }
  
  return {
    id: apiContent.id,
    name: apiContent.title,
    category,
    difficultyLevel
  };
};

export default function ClassDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!params?.id) return;
      
      try {
        setIsLoading(true);
        
        // Buscar dados da turma
        const classId = params.id as string;
        const classResponse = await getClassById(classId);
        setClassData(classResponse);
        
        // Buscar conteúdos da turma usando a API real
        try {
          const apiContents = await getContentsByClass(classId);
          
          // Mapear conteúdos da API para o formato local
          if (apiContents && apiContents.length > 0) {
            const mappedContents = apiContents.map(mapApiContentToLocalContent);
            setContents(mappedContents);
          } else {
            // Fallback para dados mockados se não houver conteúdos na API
            setContents(MOCK_CONTENTS);
          }
        } catch (error) {
          console.error('Erro ao buscar conteúdos:', error);
          // Fallback para dados mockados em caso de erro
          setContents(MOCK_CONTENTS);
        }
        
        // Buscar estudantes da turma
        try {
          const classStudents = await getClassStudents(classId);
          
          // Processar dados dos estudantes para incluir informações adicionais
          const processedStudents = await Promise.all(
            classStudents.map(async (classStudent: ClassStudent) => {
              const student = classStudent.student;
              
              // Buscar intervenções do estudante
              const interventions = await getInterventionsByStudentId(student.id);
              
              // Determinar nível de desempenho (isso seria baseado em dados reais)
              // Por enquanto, vamos usar uma lógica simples baseada no número de intervenções
              let performanceLevel: 'high' | 'medium' | 'low' = 'medium';
              if (interventions.length === 0) {
                performanceLevel = 'high';
              } else if (interventions.length > 3) {
                performanceLevel = 'low';
              }
              
              // Determinar se o aluno precisa de atenção especial
              const attentionRequired = performanceLevel === 'low';
              
              // Encontrar a data da última avaliação (simulado por enquanto)
              const lastAssessmentDate = new Date().toISOString().split('T')[0];
              
              return {
                id: student.id,
                name: student.name,
                performanceLevel,
                interventionsCount: interventions.length,
                lastAssessmentDate,
                attentionRequired,
                attentionReason: attentionRequired ? 'Baixo desempenho geral' : undefined,
              };
            })
          );
          
          setStudents(processedStudents);
        } catch (error) {
          console.error('Erro ao buscar estudantes:', error);
          setStudents([]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados. Tente novamente.');
        setError('Erro ao carregar dados da turma.');
        setIsLoading(false);
      }
    };

    loadData();
  }, [params?.id]);

  // Filtrar alunos com base na pesquisa
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para obter a cor com base no nível de desempenho
  const getPerformanceBadgeColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter o texto do nível de desempenho
  const getPerformanceText = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'Alto';
      case 'medium': return 'Médio';
      case 'low': return 'Baixo';
      default: return 'Desconhecido';
    }
  };

  // Função para obter a cor com base no nível de dificuldade
  const getDifficultyColor = (level: number) => {
    if (level <= 3) return 'bg-green-100';
    if (level <= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Função para obter a intensidade da cor com base no nível de dificuldade
  const getDifficultyColorIntensity = (level: number) => {
    const baseColor = level <= 3 ? 'rgb(220, 252, 231)' : level <= 6 ? 'rgb(254, 249, 195)' : 'rgb(254, 226, 226)';
    const opacity = 0.3 + (level / 10) * 0.7; // Varia de 0.3 a 1.0 com base no nível
    return baseColor.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
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

  if (error) {
    return (
      <div className="flex h-48 flex-col items-center justify-center">
        <p className="text-xl font-semibold text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="flex h-48 flex-col items-center justify-center">
        <p className="text-xl font-semibold">Turma não encontrada</p>
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
          <h1 className="text-3xl font-bold tracking-tight">{classData.name}</h1>
          <p className="text-muted-foreground">
            {classData.grade} {classData.subject ? `- ${classData.subject}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              if (params?.id) {
                router.push(`/teacher-portal/classes/${params.id}/students`);
              }
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            Gerenciar Estudantes
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (params?.id) {
                router.push(`/teacher-portal/classes/${params.id}/contents`);
              }
            }}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Conteúdos
          </Button>
          <Button onClick={() => router.push(`/teacher-portal/interventions/new?classId=${classData.id}`)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Intervenção
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData._count?.students || students.length}</div>
            <p className="text-xs text-muted-foreground">
              Alunos matriculados nesta turma
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos com Atenção Especial</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.attentionRequired).length}</div>
            <p className="text-xs text-muted-foreground">
              Alunos que necessitam de atenção especial
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intervenções Ativas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.reduce((total, student) => total + student.interventionsCount, 0)}</div>
            <p className="text-xs text-muted-foreground">
              Intervenções em andamento para esta turma
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Alunos
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Mapa de Dificuldades
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Planos de Aula
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alunos que Necessitam de Atenção</CardTitle>
              <CardDescription>
                Alunos com baixo desempenho ou dificuldades específicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.filter(s => s.attentionRequired).length > 0 ? (
                  students
                    .filter(s => s.attentionRequired)
                    .map(student => (
                      <div key={student.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {student.attentionReason}
                          </p>
                          <div className="pt-1">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPerformanceBadgeColor(student.performanceLevel)}`}>
                              Desempenho: {getPerformanceText(student.performanceLevel)}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher-portal/students/${student.id}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                      </div>
                    ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum aluno necessita de atenção especial no momento.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conteúdos com Maior Dificuldade</CardTitle>
              <CardDescription>
                Conteúdos em que a turma apresenta maior dificuldade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contents
                  .sort((a, b) => b.difficultyLevel - a.difficultyLevel)
                  .slice(0, 5)
                  .map(content => (
                    <div key={content.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <h4 className="font-medium">{content.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {content.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 10 }).map((_, index) => (
                          <div 
                            key={index} 
                            className={`h-2 w-2 rounded-full ${index < content.difficultyLevel ? 'bg-primary' : 'bg-muted'}`}
                          ></div>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {content.difficultyLevel}/10
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Lista de Alunos</h3>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar alunos..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Desempenho</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Intervenções</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Última Avaliação</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Atenção Especial</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium">{student.name}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPerformanceBadgeColor(student.performanceLevel)}`}>
                            {getPerformanceText(student.performanceLevel)}
                          </span>
                        </td>
                        <td className="p-4">{student.interventionsCount}</td>
                        <td className="p-4">{formatDate(student.lastAssessmentDate)}</td>
                        <td className="p-4">
                          {student.attentionRequired ? (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                              Sim
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                              Não
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/teacher-portal/students/${student.id}`}>
                              Detalhes
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        Nenhum aluno encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Dificuldades por Conteúdo</CardTitle>
              <CardDescription>
                Visualização das áreas que necessitam de maior atenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-100"></div>
                      <span className="text-sm">Baixa dificuldade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-100"></div>
                      <span className="text-sm">Média dificuldade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-100"></div>
                      <span className="text-sm">Alta dificuldade</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>

                <div className="space-y-4">
                  {['Matemática', 'Português'].map(category => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-semibold">{category}</h3>
                      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {contents
                          .filter(content => content.category === category)
                          .map(content => (
                            <div 
                              key={content.id} 
                              className={`rounded-lg border p-4 ${getDifficultyColor(content.difficultyLevel)}`}
                              style={{ 
                                backgroundColor: getDifficultyColorIntensity(content.difficultyLevel),
                                transition: 'background-color 0.3s ease'
                              }}
                            >
                              <div className="flex flex-col h-full">
                                <h4 className="font-medium">{content.name}</h4>
                                <div className="mt-auto pt-2 flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">
                                    Dificuldade:
                                  </span>
                                  <span className="font-medium">
                                    {content.difficultyLevel}/10
                                  </span>
                                </div>
                              </div>
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

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planos de Aula Sugeridos</CardTitle>
              <CardDescription>
                Planos de aula baseados nas dificuldades comuns da turma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Multiplicação e Divisão Básica</h4>
                      <p className="text-sm text-muted-foreground">
                        Plano de aula focado em multiplicação e divisão com números de 1 a 10
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
                      <h4 className="font-medium">Interpretação de Texto</h4>
                      <p className="text-sm text-muted-foreground">
                        Atividades para desenvolver habilidades de interpretação textual
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
                      <h4 className="font-medium">Frações e Números Decimais</h4>
                      <p className="text-sm text-muted-foreground">
                        Introdução a frações e números decimais com atividades práticas
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
                      <h4 className="font-medium">Produção de Texto Narrativo</h4>
                      <p className="text-sm text-muted-foreground">
                        Técnicas e atividades para desenvolver a escrita narrativa
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Gerar Novo Plano de Aula
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 