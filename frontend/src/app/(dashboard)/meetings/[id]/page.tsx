'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileText, 
  Edit, 
  Trash2, 
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { showToast } from '@/components/ui/toast';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  location: string;
  participants: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  organizer: string;
  description: string;
  agenda: string[];
  notes?: string;
  decisions?: string[];
  nextSteps?: string[];
  minutes?: string;
}

export default function MeetingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [minutes, setMinutes] = useState('');
  const [isSubmittingMinutes, setIsSubmittingMinutes] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      setIsLoading(true);
      try {
        // Simulando uma chamada de API
        setTimeout(() => {
          const mockMeeting: Meeting = {
            id: params.id,
            title: 'Revisão do Plano de Intervenção - João Silva',
            date: '2024-02-25',
            time: '14:00',
            type: 'Intervenção',
            location: 'Sala de Reuniões 1',
            participants: ['Maria Santos', 'Carlos Pereira', 'Ana Oliveira'],
            status: 'scheduled',
            organizer: 'Maria Santos',
            description: 'Reunião para revisar o progresso do plano de intervenção do aluno João Silva e ajustar as estratégias conforme necessário.',
            agenda: [
              'Apresentação dos resultados das últimas avaliações',
              'Análise do progresso nas intervenções atuais',
              'Discussão sobre ajustes necessários no plano',
              'Definição de próximos passos e responsabilidades',
            ],
            notes: 'O aluno tem demonstrado melhora significativa na fluência de leitura, mas ainda necessita de suporte adicional na compreensão textual.',
            decisions: [
              'Manter a frequência das sessões de intervenção em leitura',
              'Adicionar atividades específicas de compreensão textual',
              'Agendar nova avaliação para o final do bimestre',
            ],
            nextSteps: [
              'Atualizar o plano de intervenção com as novas atividades',
              'Comunicar as mudanças aos pais',
              'Preparar materiais adicionais para as próximas sessões',
            ],
            minutes: 'Ata da reunião',
          };
          setMeeting(mockMeeting);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Erro ao buscar detalhes da reunião:', error);
        showToast({
          type: 'error',
          message: 'Não foi possível carregar os detalhes da reunião. Tente novamente mais tarde.',
        });
        setIsLoading(false);
      }
    };

    fetchMeeting();
  }, [params.id]);

  const handleStatusChange = async (newStatus: 'completed' | 'cancelled') => {
    try {
      // Simulando uma chamada de API
      setTimeout(() => {
        setMeeting(prev => prev ? { ...prev, status: newStatus } : null);
        showToast({
          type: 'success',
          message: `A reunião foi marcada como ${newStatus === 'completed' ? 'concluída' : 'cancelada'} com sucesso.`,
        });
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar status da reunião:', error);
      showToast({
        type: 'error',
        message: 'Não foi possível atualizar o status da reunião. Tente novamente mais tarde.',
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta reunião?')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar a chamada real à API
      console.log('Deletando reunião:', params.id);
      
      showToast({ type: 'success', message: 'Reunião excluída com sucesso!' });
      router.push('/meetings');
    } catch (error) {
      console.error('Erro ao excluir reunião:', error);
      showToast({ type: 'error', message: 'Erro ao excluir reunião. Tente novamente.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveMinutes = async () => {
    if (!minutes.trim()) {
      showToast({
        type: 'error',
        message: 'Por favor, adicione conteúdo à ata antes de salvar.',
      });
      return;
    }

    setIsSubmittingMinutes(true);
    try {
      // Simulando uma chamada de API
      setTimeout(() => {
        setMeeting(prev => prev ? { ...prev, minutes } : null);
        showToast({
          type: 'success',
          message: 'A ata da reunião foi salva com sucesso.',
        });
        setIsSubmittingMinutes(false);
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar ata da reunião:', error);
      showToast({
        type: 'error',
        message: 'Não foi possível salvar a ata da reunião. Tente novamente mais tarde.',
      });
      setIsSubmittingMinutes(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusBadgeColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Reunião não encontrada</h2>
          <p className="text-muted-foreground mb-6">
            Não foi possível encontrar os detalhes desta reunião.
          </p>
          <Button onClick={() => router.push('/meetings')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Reuniões
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => router.push('/meetings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{meeting.title}</h1>
            <p className="text-muted-foreground">
              {formatDate(meeting.date)} • <Badge className={getStatusBadgeColor(meeting.status)}>{getStatusLabel(meeting.status)}</Badge>
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {meeting.status === 'scheduled' && (
            <>
              <Button variant="outline" onClick={() => router.push(`/meetings/${meeting.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Reunião</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir esta reunião? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Reunião</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Data e Hora</p>
                    <p className="text-sm text-muted-foreground">{formatDate(meeting.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Local</p>
                    <p className="text-sm text-muted-foreground">{meeting.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Equipe</p>
                    <p className="text-sm text-muted-foreground">{meeting.participants.join(', ')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge className={getStatusBadgeColor(meeting.status)}>{getStatusLabel(meeting.status)}</Badge>
                  </div>
                </div>
              </div>
              
              {meeting.notes && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-1">Notas</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{meeting.notes}</p>
                </div>
              )}
            </CardContent>
            {meeting.status === 'scheduled' && (
              <CardFooter className="border-t pt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('cancelled')}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="mr-2 h-4 w-4" /> Cancelar Reunião
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('completed')}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Marcar como Concluída
                </Button>
              </CardFooter>
            )}
          </Card>

          <Tabs defaultValue="participants">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="participants">Participantes</TabsTrigger>
              <TabsTrigger value="minutes">Ata da Reunião</TabsTrigger>
            </TabsList>
            <TabsContent value="participants">
              <Card>
                <CardHeader>
                  <CardTitle>Participantes</CardTitle>
                  <CardDescription>
                    {meeting.participants.length} membros participando desta reunião
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {meeting.participants.map((participant) => (
                      <div key={participant} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(participant)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{participant}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="minutes">
              <Card>
                <CardHeader>
                  <CardTitle>Ata da Reunião</CardTitle>
                  <CardDescription>
                    Registre as discussões, decisões e próximos passos definidos durante a reunião
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {meeting.status === 'scheduled' ? (
                    <p className="text-sm text-muted-foreground py-4">
                      A ata estará disponível após a conclusão da reunião.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Registre aqui os pontos discutidos, decisões tomadas e próximos passos..."
                        className="min-h-[200px]"
                        value={meeting.minutes || minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        disabled={!!meeting.minutes || meeting.status === 'cancelled'}
                      />
                      {!meeting.minutes && meeting.status === 'completed' && (
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleSaveMinutes} 
                            disabled={isSubmittingMinutes}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {isSubmittingMinutes ? 'Salvando...' : 'Salvar Ata'}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" /> Adicionar ao Calendário
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Gerar Relatório
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" /> Convidar Participantes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Reuniões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-3">
                <p className="font-medium text-sm">Avaliação de Progresso - Turma 3º Ano</p>
                <p className="text-xs text-muted-foreground">18 de novembro às 10:30</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="font-medium text-sm">Planejamento de Intervenções - Nível 2</p>
                <p className="text-xs text-muted-foreground">22 de novembro às 14:00</p>
              </div>
              <Button variant="ghost" className="w-full text-sm" onClick={() => router.push('/meetings')}>
                Ver todas as reuniões
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 