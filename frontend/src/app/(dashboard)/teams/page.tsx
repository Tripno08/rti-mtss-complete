'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Users, FileText } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    members: number;
    students: number;
  };
}

// Dados mockados para desenvolvimento
const MOCK_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Equipe de Intervenção Alfabetização',
    description: 'Equipe focada em intervenções de alfabetização para alunos do 1º ao 3º ano',
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-03-10T14:30:00Z',
    _count: {
      members: 8,
      students: 45
    }
  },
  {
    id: '2',
    name: 'Equipe de Suporte Matemático',
    description: 'Equipe especializada em intervenções matemáticas para todos os níveis',
    active: true,
    createdAt: '2025-02-01T09:15:00Z',
    updatedAt: '2025-03-05T11:20:00Z',
    _count: {
      members: 6,
      students: 38
    }
  },
  {
    id: '3',
    name: 'Equipe de Comportamento e Socioemocional',
    description: 'Equipe focada em intervenções comportamentais e desenvolvimento socioemocional',
    active: true,
    createdAt: '2025-01-20T13:45:00Z',
    updatedAt: '2025-03-12T16:10:00Z',
    _count: {
      members: 10,
      students: 52
    }
  },
  {
    id: '4',
    name: 'Equipe de Necessidades Especiais',
    description: 'Equipe dedicada a estudantes com necessidades educacionais especiais',
    active: false,
    createdAt: '2024-11-10T08:30:00Z',
    updatedAt: '2025-02-28T15:45:00Z',
    _count: {
      members: 12,
      students: 28
    }
  },
  {
    id: '5',
    name: 'Equipe de Avaliação e Monitoramento',
    description: 'Equipe responsável por avaliações diagnósticas e monitoramento de progresso',
    active: true,
    createdAt: '2025-01-05T11:20:00Z',
    updatedAt: '2025-03-08T09:30:00Z',
    _count: {
      members: 5,
      students: 120
    }
  }
];

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Simulando uma chamada de API
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        // Simulando um delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        setTeams(MOCK_TEAMS);
      } catch (error) {
        console.error('Erro ao buscar equipes:', error);
        toast.error('Erro ao carregar equipes. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (team.description && team.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateTeam = () => {
    router.push('/teams/new');
  };

  const handleViewTeam = (id: string) => {
    router.push(`/teams/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Equipes RTI</h1>
        <Button onClick={handleCreateTeam}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Equipe
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar equipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma equipe encontrada</CardTitle>
            <CardDescription>
              {searchQuery 
                ? 'Nenhuma equipe corresponde à sua busca. Tente outros termos.'
                : 'Você ainda não tem equipes RTI. Crie uma nova equipe para começar.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              As equipes RTI permitem organizar estudantes e profissionais para intervenções coordenadas.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateTeam}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Equipe
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{team.name}</CardTitle>
                  <Badge variant={team.active ? 'default' : 'secondary'}>
                    {team.active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {team.description || 'Sem descrição'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{team._count.members} membros</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="mr-1 h-4 w-4" />
                    <span>{team._count.students} estudantes</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => handleViewTeam(team.id)}
                >
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 