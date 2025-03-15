'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores/auth';
import { createLessonPlan } from '@/lib/api/lesson-plans';
import { getClasses } from '@/lib/api/classes';
import { getContentsByClass } from '@/lib/api/contents';
import { toast } from 'sonner';

interface Class {
  id: string;
  name: string;
  grade: string;
  subject?: string;
}

interface Content {
  id: string;
  title: string;
  type: string;
  status: string;
}

export default function NewLessonPlanPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [resources, setResources] = useState('');
  const [activities, setActivities] = useState('');
  const [assessment, setAssessment] = useState('');
  const [duration, setDuration] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState('draft');
  const [notes, setNotes] = useState('');
  const [classId, setClassId] = useState('');
  const [contentId, setContentId] = useState('');
  
  const [classes, setClasses] = useState<Class[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingContents, setIsLoadingContents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoadingClasses(true);
        const data = await getClasses();
        // Filtrar apenas as turmas do professor logado
        const teacherClasses = data.filter((c: any) => c.teacherId === user.id);
        setClasses(teacherClasses);
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        toast.error('Erro ao carregar turmas');
      } finally {
        setIsLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [user?.id]);

  useEffect(() => {
    const fetchContents = async () => {
      if (!classId) {
        setContents([]);
        return;
      }
      
      try {
        setIsLoadingContents(true);
        const data = await getContentsByClass(classId);
        setContents(data);
      } catch (error) {
        console.error('Erro ao buscar conteúdos:', error);
        toast.error('Erro ao carregar conteúdos');
      } finally {
        setIsLoadingContents(false);
      }
    };

    fetchContents();
  }, [classId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }
    
    if (!title || !classId) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await createLessonPlan({
        title,
        description,
        objectives,
        resources,
        activities,
        assessment,
        duration: duration ? parseInt(duration) : undefined,
        date: date ? date.toISOString() : undefined,
        status,
        notes,
        classId,
        contentId: contentId || undefined,
        teacherId: user.id,
      });
      
      toast.success('Plano de aula criado com sucesso');
      router.push('/teacher-portal/lesson-plans');
    } catch (error) {
      console.error('Erro ao criar plano de aula:', error);
      toast.error('Erro ao criar plano de aula');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/teacher-portal/lesson-plans')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-innerview-secondary">Novo Plano de Aula</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título do plano de aula"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="class">Turma <span className="text-red-500">*</span></Label>
                <Select value={classId} onValueChange={setClassId} required>
                  <SelectTrigger id="class" disabled={isLoadingClasses}>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} - {c.grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo Relacionado</Label>
                <Select value={contentId} onValueChange={setContentId} disabled={!classId || isLoadingContents}>
                  <SelectTrigger id="content">
                    <SelectValue placeholder="Selecione um conteúdo (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {contents.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title} - {c.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data da Aula</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 50"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição geral do plano de aula"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detalhes do Plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="objectives">Objetivos</Label>
              <Textarea
                id="objectives"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="Objetivos de aprendizagem"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resources">Recursos Necessários</Label>
              <Textarea
                id="resources"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                placeholder="Materiais e recursos para a aula"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activities">Atividades</Label>
              <Textarea
                id="activities"
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                placeholder="Descrição das atividades a serem realizadas"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessment">Avaliação</Label>
              <Textarea
                id="assessment"
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Métodos de avaliação da aprendizagem"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações adicionais"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.push('/teacher-portal/lesson-plans')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Plano de Aula
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
} 