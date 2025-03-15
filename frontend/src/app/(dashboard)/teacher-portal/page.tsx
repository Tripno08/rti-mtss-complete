'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Users, BookOpen, Calendar, Search, UserPlus, Loader2, User, FileText } from 'lucide-react';
import Link from 'next/link';
import { getClassesByTeacher, Class } from '@/lib/api/classes';
import { getStudents, Student } from '@/lib/api/students';
import { getInterventionsByStudentId, Intervention } from '@/lib/api/interventions';
import { useAuthStore } from '@/lib/stores/auth';

// Interface estendida para incluir dados calculados
interface ExtendedStudent extends Student {
  className?: string;
  performanceLevel: 'high' | 'medium' | 'low';
  interventionsCount: number;
  lastAssessmentDate: string;
}

export default function TeacherPortalPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('classes');
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [activeInterventionsCount, setActiveInterventionsCount] = useState(0);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        
        // Buscar turmas do professor atual
        const classesData = await getClassesByTeacher(currentUser.id);
        setClasses(classesData);
        
        // Buscar todos os estudantes
        const studentsData = await getStudents();
        
        // Processar os dados dos estudantes para adicionar informações adicionais
        let totalActiveInterventions = 0;
        const extendedStudentsPromises = studentsData.map(async (student: Student) => {
          // Buscar intervenções do estudante
          let interventions = [];
          try {
            interventions = await getInterventionsByStudentId(student.id);
            // Contar intervenções ativas
            const activeInterventions = interventions.filter((i: Intervention) => i.status === 'ACTIVE');
            totalActiveInterventions += activeInterventions.length;
          } catch (error) {
            console.error(`Erro ao buscar intervenções para o estudante ${student.id}:`, error);
          }
          
          // Calcular o nível de desempenho com base no número de intervenções (lógica simplificada)
          let performanceLevel: 'high' | 'medium' | 'low' = 'high';
          if (interventions.length >= 3) {
            performanceLevel = 'low';
          } else if (interventions.length >= 1) {
            performanceLevel = 'medium';
          }
          
          // Encontrar a turma do estudante (se existir)
          const className = 'Não atribuído'; // Placeholder - em uma implementação real, isso viria da API
          
          // Última data de avaliação (simulada por enquanto)
          const lastAssessmentDate = new Date().toISOString().split('T')[0];
          
          return {
            ...student,
            className,
            performanceLevel,
            interventionsCount: interventions.length,
            lastAssessmentDate,
          };
        });
        
        const extendedStudents = await Promise.all(extendedStudentsPromises);
        setStudents(extendedStudents);
        setActiveInterventionsCount(totalActiveInterventions);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // Filtrar classes e alunos com base na pesquisa
  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cls.subject && cls.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.className && student.className.toLowerCase().includes(searchQuery.toLowerCase()))
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

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-muted-foreground">Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portal do Professor</h1>
          <p className="text-muted-foreground">
            Gerencie suas turmas, alunos e intervenções
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 md:mt-0">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar turmas ou alunos..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => router.push('/teacher-portal/interventions/new')}>
            Nova Intervenção
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              Turmas sob sua responsabilidade
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Alunos sob sua supervisão
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intervenções Ativas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInterventionsCount}</div>
            <p className="text-xs text-muted-foreground">
              Intervenções em andamento
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando...</span>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Turmas
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Alunos
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendário
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <Link href={`/teacher-portal/classes/${cls.id}`} key={cls.id} className="block">
                    <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                      <CardHeader>
                        <CardTitle>{cls.name}</CardTitle>
                        <CardDescription>{cls.grade} {cls.subject ? `- ${cls.subject}` : ''}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {cls._count?.students || 0} alunos
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-8">
                  <p className="text-center text-muted-foreground">
                    Nenhuma turma encontrada.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Turma</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Desempenho</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Intervenções</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Última Avaliação</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                          onClick={() => router.push(`/students/${student.id}`)}
                        >
                          <td className="p-4 font-medium">{student.name}</td>
                          <td className="p-4">{student.className || 'Não atribuído'}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPerformanceBadgeColor(student.performanceLevel)}`}>
                              {getPerformanceText(student.performanceLevel)}
                            </span>
                          </td>
                          <td className="p-4">{student.interventionsCount}</td>
                          <td className="p-4">{formatDate(student.lastAssessmentDate)}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/interventions/new?studentId=${student.id}`);
                                }}
                              >
                                Intervenção
                              </Button>
                            </div>
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

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendário de Atividades</CardTitle>
                <CardDescription>
                  Visualize suas atividades e intervenções programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Funcionalidade de calendário em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push('/teacher-portal/students')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudantes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Gerenciar estudantes e visualizar perfis
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push('/teacher-portal/classes')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              Gerenciar turmas e visualizar desempenho
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push('/teacher-portal/interventions')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intervenções</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInterventionsCount}</div>
            <p className="text-xs text-muted-foreground">
              Gerenciar intervenções e acompanhar progresso
            </p>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push('/teacher-portal/assessments')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Gerenciar avaliações e analisar resultados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 