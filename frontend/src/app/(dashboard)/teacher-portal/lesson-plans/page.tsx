'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuthStore } from '@/lib/stores/auth';
import { LessonPlan, getLessonPlansByTeacher } from '@/lib/api/lesson-plans';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function LessonPlansPage() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<LessonPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchLessonPlans = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const data = await getLessonPlansByTeacher(user.id);
        setLessonPlans(data);
        setFilteredPlans(data);
      } catch (error) {
        console.error('Erro ao buscar planos de aula:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonPlans();
  }, [user?.id]);

  useEffect(() => {
    // Filtrar planos de aula com base no termo de pesquisa e na aba ativa
    let filtered = lessonPlans;
    
    // Filtrar por status
    if (activeTab !== 'todos') {
      filtered = filtered.filter(plan => plan.status === activeTab);
    }
    
    // Filtrar por termo de pesquisa
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        plan => 
          plan.title.toLowerCase().includes(term) || 
          (plan.description && plan.description.toLowerCase().includes(term)) ||
          (plan.class?.name && plan.class.name.toLowerCase().includes(term))
      );
    }
    
    setFilteredPlans(filtered);
  }, [searchTerm, activeTab, lessonPlans]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Rascunho</Badge>;
      case 'published':
        return <Badge variant="secondary">Publicado</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não definida';
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const handleCreatePlan = () => {
    router.push('/teacher-portal/lesson-plans/new');
  };

  const handleViewPlan = (id: string) => {
    router.push(`/teacher-portal/lesson-plans/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-innerview-secondary">Planos de Aula</h1>
        <Button onClick={handleCreatePlan}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano de Aula
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar planos de aula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="todos" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos</TabsTrigger>
          <TabsTrigger value="published">Publicados</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
        <TabsContent value="todos" className="mt-6">
          {renderLessonPlansList()}
        </TabsContent>
        <TabsContent value="draft" className="mt-6">
          {renderLessonPlansList()}
        </TabsContent>
        <TabsContent value="published" className="mt-6">
          {renderLessonPlansList()}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {renderLessonPlansList()}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderLessonPlansList() {
    if (isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredPlans.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">Nenhum plano de aula encontrado</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchTerm 
              ? 'Tente ajustar sua pesquisa ou filtros' 
              : 'Comece criando seu primeiro plano de aula'}
          </p>
          <Button onClick={handleCreatePlan} variant="outline" className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Criar Plano de Aula
          </Button>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleViewPlan(plan.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{plan.title}</CardTitle>
                {getStatusBadge(plan.status)}
              </div>
              <CardDescription>
                {plan.class?.name || 'Turma não especificada'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(plan.date)}
                </div>
                {plan.description && (
                  <p className="line-clamp-2 text-muted-foreground">
                    {plan.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
} 