'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Search,
  Eye,
} from 'lucide-react';

// Tipos
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
}

// Dados simulados
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Revisão do Plano de Intervenção - João Silva',
    date: '2024-02-25',
    time: '14:00',
    type: 'Intervenção',
    location: 'Sala de Reuniões 1',
    participants: ['Maria Santos', 'Carlos Pereira', 'Ana Oliveira'],
    status: 'scheduled',
    organizer: 'Maria Santos',
  },
  {
    id: '2',
    title: 'Avaliação de Progresso - Turma 3º Ano',
    date: '2024-02-26',
    time: '10:30',
    type: 'Avaliação',
    location: 'Sala de Aula 3A',
    participants: ['Pedro Costa', 'Lucia Ferreira'],
    status: 'scheduled',
    organizer: 'Pedro Costa',
  },
  {
    id: '3',
    title: 'Planejamento de Intervenções - Nível 2',
    date: '2024-02-24',
    time: '09:00',
    type: 'Planejamento',
    location: 'Sala dos Professores',
    participants: ['Ana Oliveira', 'Roberto Santos', 'Clara Lima'],
    status: 'completed',
    organizer: 'Ana Oliveira',
  },
  {
    id: '4',
    title: 'Reunião com Pais - Maria Oliveira',
    date: '2024-02-23',
    time: '15:30',
    type: 'Pais',
    location: 'Sala de Reuniões 2',
    participants: ['Carlos Pereira', 'Sandra Oliveira', 'João Oliveira'],
    status: 'cancelled',
    organizer: 'Carlos Pereira',
  },
  {
    id: '5',
    title: 'Análise de Dados - 1º Bimestre',
    date: '2024-02-27',
    time: '13:00',
    type: 'Análise',
    location: 'Laboratório de Informática',
    participants: ['Maria Santos', 'Pedro Costa', 'Ana Oliveira'],
    status: 'scheduled',
    organizer: 'Maria Santos',
  },
];

export default function MeetingsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Função para formatar a data
  const formatDate = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  // Função para obter a cor do badge de status
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

  // Função para obter o rótulo do status
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

  // Filtragem das reuniões
  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || meeting.type === typeFilter;
    const matchesStatus = !statusFilter || meeting.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reuniões</h1>
          <p className="text-muted-foreground">
            Gerencie as reuniões do sistema RTI/MTSS
          </p>
        </div>
        <Button onClick={() => router.push('/meetings/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Reunião
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Reuniões</CardTitle>
          <CardDescription>
            Total de {filteredMeetings.length} reuniões encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título ou organizador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    <SelectItem value="Intervenção">Intervenção</SelectItem>
                    <SelectItem value="Avaliação">Avaliação</SelectItem>
                    <SelectItem value="Planejamento">Planejamento</SelectItem>
                    <SelectItem value="Pais">Pais</SelectItem>
                    <SelectItem value="Análise">Análise</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="scheduled">Agendadas</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluídas</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Título</TableHead>
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Organizador</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">{meeting.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(meeting.date, meeting.time)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{meeting.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{meeting.organizer}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(meeting.status)}>
                          {getStatusLabel(meeting.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/meetings/${meeting.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}