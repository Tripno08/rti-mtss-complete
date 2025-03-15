'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserPlus, UserMinus, School, CalendarPlus, 
  Edit, Trash2, AlertCircle 
} from 'lucide-react';
import { api } from '@/lib/utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TeamMember {
  id: string;
  role: string;
  joinedAt: string;
  user: User;
}

interface Student {
  id: string;
  name: string;
  grade: string;
  dateOfBirth: string;
  assignedAt: string;
  latestAssessment: {
    id: string;
    date: string;
    score: number;
    type: string;
  } | null;
  activeInterventions: number;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  status: string;
}

interface Referral {
  id: string;
  title: string;
  status: string;
  priority: string;
  student: {
    id: string;
    name: string;
  };
  assignedTo: {
    id: string;
    name: string;
  };
}

interface TeamStats {
  studentsCount: number;
  activeInterventionsCount: number;
  completedInterventionsCount: number;
  assessmentsCount: number;
  pendingReferralsCount: number;
  completedReferralsCount: number;
  interventionSuccessRate: number;
  referralCompletionRate: number;
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
}

interface TeamDashboard {
  team: Team;
  stats: TeamStats;
  upcomingMeetings: Meeting[];
  recentReferrals: Referral[];
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeamDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [teamDashboard, setTeamDashboard] = useState<TeamDashboard | null>(null);
  const [teamStudents, setTeamStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const teamId = id;
  
  const [isStudentsLoading, setIsStudentsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamDashboard = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/teams/${teamId}/dashboard`);
        setTeamDashboard(response.data);
      } catch (error) {
        console.error('Erro ao buscar dashboard da equipe:', error);
        toast.error('Erro ao carregar informações da equipe. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamDashboard();
  }, [teamId]);

  useEffect(() => {
    const fetchTeamStudents = async () => {
      try {
        setIsStudentsLoading(true);
        const response = await api.get(`/teams/${teamId}/students`);
        setTeamStudents(response.data);
      } catch (error) {
        console.error('Erro ao buscar estudantes da equipe:', error);
        toast.error('Erro ao carregar estudantes da equipe. Tente novamente mais tarde.');
      } finally {
        setIsStudentsLoading(false);
      }
    };

    fetchTeamStudents();
  }, [teamId]);

  const handleEditTeam = () => {
    router.push(`/teams/${teamId}/edit`);
  };

  const handleDeleteTeam = async () => {
    if (!confirm('Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await api.delete(`/teams/${teamId}`);
      toast.success('Equipe excluída com sucesso!');
      router.push('/teams');
    } catch (error) {
      console.error('Erro ao excluir equipe:', error);
      toast.error('Erro ao excluir equipe. Tente novamente mais tarde.');
    }
  };

  const handleAddMember = () => {
    router.push(`/teams/${teamId}/members/add`);
  };

  const handleAddStudent = () => {
    router.push(`/teams/${teamId}/students/add`);
  };

  const handleCreateMeeting = () => {
    router.push(`/meetings/new?teamId=${id}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getTeamRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      'COORDINATOR': 'Coordenador',
      'SPECIALIST': 'Especialista',
      'TEACHER': 'Professor',
      'COUNSELOR': 'Conselheiro',
      'PSYCHOLOGIST': 'Psicólogo',
      'OTHER': 'Outro',
    };
    return roles[role] || role;
  };

  const getMeetingStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      'SCHEDULED': 'Agendada',
      'IN_PROGRESS': 'Em andamento',
      'COMPLETED': 'Concluída',
      'CANCELLED': 'Cancelada',
    };
    return statuses[status] || status;
  };

  const getMeetingStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'SCHEDULED': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getReferralStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      'PENDING': 'Pendente',
      'IN_PROGRESS': 'Em andamento',
      'COMPLETED': 'Concluído',
      'CANCELLED': 'Cancelado',
    };
    return statuses[status] || status;
  };

  const getReferralStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getReferralPriorityLabel = (priority: string) => {
    const priorities: Record<string, string> = {
      'LOW': 'Baixa',
      'MEDIUM': 'Média',
      'HIGH': 'Alta',
      'URGENT': 'Urgente',
    };
    return priorities[priority] || priority;
  };

  const getReferralPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Tabs defaultValue="dashboard">
          <TabsList className="w-full">
            <TabsTrigger value="dashboard" className="flex-1">Dashboard</TabsTrigger>
            <TabsTrigger value="members" className="flex-1">Membros</TabsTrigger>
            <TabsTrigger value="students" className="flex-1">Estudantes</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (!teamDashboard) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Equipe não encontrada</h2>
        <p className="text-muted-foreground mb-4">
          A equipe que você está procurando não existe ou foi removida.
        </p>
        <Button onClick={() => router.push('/teams')}>Voltar para Equipes</Button>
      </div>
    );
  }

  const { team, stats, upcomingMeetings, recentReferrals } = teamDashboard;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
            <Badge variant={team.active ? 'default' : 'secondary'}>
              {team.active ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
          {team.description && (
            <p className="text-muted-foreground mt-1">{team.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEditTeam}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDeleteTeam}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="w-full">
          <TabsTrigger value="dashboard" className="flex-1">Dashboard</TabsTrigger>
          <TabsTrigger value="members" className="flex-1">Membros</TabsTrigger>
          <TabsTrigger value="students" className="flex-1">Estudantes</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Estudantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.studentsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Estudantes atribuídos a esta equipe
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Intervenções Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeInterventionsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Intervenções em andamento
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.interventionSuccessRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Intervenções concluídas com sucesso
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Encaminhamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingReferralsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Encaminhamentos pendentes
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Próximas Reuniões</CardTitle>
                  <Button size="sm" onClick={handleCreateMeeting}>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Agendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingMeetings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Não há reuniões agendadas para esta equipe.
                    </p>
                    <Button size="sm" onClick={handleCreateMeeting}>
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Agendar Reunião
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{meeting.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(meeting.date).toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <Badge className={getMeetingStatusColor(meeting.status)}>
                          {getMeetingStatusLabel(meeting.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/meetings?teamId=' + team.id)}
                >
                  Ver Todas as Reuniões
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Encaminhamentos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {recentReferrals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Não há encaminhamentos registrados para esta equipe.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentReferrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{referral.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Estudante: {referral.student.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Responsável: {referral.assignedTo.name}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={getReferralStatusColor(referral.status)}>
                            {getReferralStatusLabel(referral.status)}
                          </Badge>
                          <Badge className={getReferralPriorityColor(referral.priority)}>
                            {getReferralPriorityLabel(referral.priority)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/referrals?teamId=' + team.id)}
                >
                  Ver Todos os Encaminhamentos
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Membros da Equipe</h2>
            <Button onClick={handleAddMember}>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Membro
            </Button>
          </div>

          {team.members.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Nenhum membro encontrado</CardTitle>
                <CardDescription>
                  Esta equipe ainda não possui membros.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Adicione membros à equipe para começar a colaborar.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddMember}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Membro
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {team.members.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${member.user.id}`} />
                        <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{member.user.name}</CardTitle>
                        <CardDescription>{member.user.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">
                        {getTeamRoleLabel(member.role)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Desde {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        if (confirm(`Remover ${member.user.name} da equipe?`)) {
                          api.delete(`/teams/${team.id}/members/${member.user.id}`)
                            .then(() => {
                              toast.success('Membro removido com sucesso!');
                              // Recarregar dados
                              window.location.reload();
                            })
                            .catch((error) => {
                              console.error('Erro ao remover membro:', error);
                              toast.error('Erro ao remover membro. Tente novamente mais tarde.');
                            });
                        }
                      }}
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Remover
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="students" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Estudantes da Equipe</h2>
            <Button onClick={handleAddStudent}>
              <School className="mr-2 h-4 w-4" />
              Adicionar Estudante
            </Button>
          </div>

          {isStudentsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(6).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-32 w-full" />
              ))}
            </div>
          ) : teamStudents.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Nenhum estudante encontrado</CardTitle>
                <CardDescription>
                  Esta equipe ainda não possui estudantes atribuídos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Adicione estudantes à equipe para começar a monitorar seu progresso.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddStudent}>
                  <School className="mr-2 h-4 w-4" />
                  Adicionar Estudante
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamStudents.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <Badge>{student.grade}</Badge>
                    </div>
                    <CardDescription>
                      {new Date(student.dateOfBirth).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Intervenções ativas:</span>
                        <Badge variant={student.activeInterventions > 0 ? 'default' : 'outline'}>
                          {student.activeInterventions}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Última avaliação:</span>
                        <span className="text-sm font-medium">
                          {student.latestAssessment 
                            ? `${student.latestAssessment.score} (${new Date(student.latestAssessment.date).toLocaleDateString('pt-BR')})`
                            : 'Nenhuma'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/students/${student.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        if (confirm(`Remover ${student.name} da equipe?`)) {
                          api.delete(`/teams/${team.id}/students/${student.id}`)
                            .then(() => {
                              toast.success('Estudante removido com sucesso!');
                              // Recarregar dados
                              setTeamStudents(teamStudents.filter(s => s.id !== student.id));
                            })
                            .catch((error) => {
                              console.error('Erro ao remover estudante:', error);
                              toast.error('Erro ao remover estudante. Tente novamente mais tarde.');
                            });
                        }
                      }}
                    >
                      Remover
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 