'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Mail, MessageSquare } from 'lucide-react';

// Tipos
interface Communication {
  id: string;
  subject: string;
  date: string;
  type: 'email' | 'sms' | 'letter' | 'phone' | 'meeting';
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed';
  sender: string;
  recipients: string[];
  priority: 'low' | 'medium' | 'high';
}

// Dados simulados
const mockCommunications: Communication[] = [
  {
    id: '1',
    subject: 'Reunião de Acompanhamento - João Silva',
    date: '2025-02-20',
    type: 'email',
    status: 'sent',
    sender: 'Maria Oliveira',
    recipients: ['carlos.silva@email.com', 'ana.pereira@email.com'],
    priority: 'medium',
  },
  {
    id: '2',
    subject: 'Avaliação Psicopedagógica - Ana Pereira',
    date: '2025-02-18',
    type: 'letter',
    status: 'delivered',
    sender: 'Pedro Costa',
    recipients: ['joana.santos@email.com'],
    priority: 'high',
  },
  {
    id: '3',
    subject: 'Lembrete: Entrega de Relatório',
    date: '2025-02-15',
    type: 'sms',
    status: 'read',
    sender: 'Carla Rodrigues',
    recipients: ['equipe.pedagogica@email.com'],
    priority: 'low',
  },
  {
    id: '4',
    subject: 'Convite para Reunião de Pais',
    date: '2025-02-10',
    type: 'email',
    status: 'draft',
    sender: 'José Ferreira',
    recipients: ['pais.responsaveis@email.com'],
    priority: 'medium',
  },
  {
    id: '5',
    subject: 'Atualização sobre Intervenção - Lucas Mendes',
    date: '2025-02-05',
    type: 'phone',
    status: 'failed',
    sender: 'Fernanda Lima',
    recipients: ['roberto.mendes@email.com'],
    priority: 'high',
  },
];

export default function CommunicationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all-statuses');
  const [typeFilter, setTypeFilter] = useState('all-types');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadgeColor = (status: Communication['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'sent':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'delivered':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'read':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusLabel = (status: Communication['status']) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'sent':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'read':
        return 'Lido';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: Communication['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
      case 'phone':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: Communication['type']) => {
    switch (type) {
      case 'email':
        return 'E-mail';
      case 'sms':
        return 'SMS';
      case 'letter':
        return 'Carta';
      case 'phone':
        return 'Telefone';
      case 'meeting':
        return 'Reunião';
      default:
        return type;
    }
  };

  // Filtrar comunicações
  const filteredCommunications = mockCommunications.filter((communication) => {
    const matchesSearch =
      communication.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      communication.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      communication.recipients.some(recipient => 
        recipient.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === 'all-statuses' || communication.status === statusFilter;

    const matchesType =
      typeFilter === 'all-types' || communication.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Comunicações</h1>
        <Button onClick={() => router.push('/communications/new')}>
          <Plus className="mr-2 h-4 w-4" /> Nova Comunicação
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as comunicações por status, tipo ou use a busca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por assunto, remetente ou destinatário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-statuses">Todos os Status</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="sent">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="read">Lido</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">Todos os Tipos</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="letter">Carta</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="meeting">Reunião</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assunto</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remetente</TableHead>
                <TableHead>Destinatários</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommunications.length > 0 ? (
                filteredCommunications.map((communication) => (
                  <TableRow key={communication.id}>
                    <TableCell className="font-medium">
                      {communication.subject}
                    </TableCell>
                    <TableCell>{formatDate(communication.date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(communication.type)}
                        <span>{getTypeLabel(communication.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadgeColor(communication.status)}
                        variant="outline"
                      >
                        {getStatusLabel(communication.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{communication.sender}</TableCell>
                    <TableCell>
                      {communication.recipients.length > 1
                        ? `${communication.recipients[0]} +${communication.recipients.length - 1}`
                        : communication.recipients[0]}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/communications/${communication.id}`)}
                      >
                        <Mail className="h-4 w-4 mr-1" /> Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Nenhuma comunicação encontrada com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 