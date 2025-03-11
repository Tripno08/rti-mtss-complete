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
import { Plus, Search, FileText } from 'lucide-react';

// Tipos
interface Referral {
  id: string;
  studentName: string;
  referralDate: string;
  referralType: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  referredBy: string;
  referredTo: string;
  priority: 'low' | 'medium' | 'high';
}

// Dados simulados
const mockReferrals: Referral[] = [
  {
    id: '1',
    studentName: 'João Silva',
    referralDate: '2025-02-15',
    referralType: 'Psicólogo',
    status: 'pending',
    referredBy: 'Maria Oliveira',
    referredTo: 'Dr. Carlos Santos',
    priority: 'high',
  },
  {
    id: '2',
    studentName: 'Ana Pereira',
    referralDate: '2025-02-10',
    referralType: 'Fonoaudiólogo',
    status: 'in-progress',
    referredBy: 'Pedro Costa',
    referredTo: 'Dra. Juliana Lima',
    priority: 'medium',
  },
  {
    id: '3',
    studentName: 'Lucas Mendes',
    referralDate: '2025-01-25',
    referralType: 'Terapeuta Ocupacional',
    status: 'completed',
    referredBy: 'Carla Rodrigues',
    referredTo: 'Dr. Roberto Alves',
    priority: 'low',
  },
  {
    id: '4',
    studentName: 'Mariana Souza',
    referralDate: '2025-01-20',
    referralType: 'Neurologista',
    status: 'cancelled',
    referredBy: 'José Ferreira',
    referredTo: 'Dra. Amanda Gomes',
    priority: 'high',
  },
  {
    id: '5',
    studentName: 'Gabriel Santos',
    referralDate: '2025-01-15',
    referralType: 'Psicopedagogo',
    status: 'pending',
    referredBy: 'Fernanda Lima',
    referredTo: 'Dr. Marcelo Silva',
    priority: 'medium',
  },
];

export default function ReferralsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all-statuses');
  const [typeFilter, setTypeFilter] = useState('all-types');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadgeColor = (status: Referral['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusLabel = (status: Referral['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in-progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getPriorityBadgeColor = (priority: Referral['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getPriorityLabel = (priority: Referral['priority']) => {
    switch (priority) {
      case 'low':
        return 'Baixa';
      case 'medium':
        return 'Média';
      case 'high':
        return 'Alta';
      default:
        return priority;
    }
  };

  // Filtrar encaminhamentos
  const filteredReferrals = mockReferrals.filter((referral) => {
    const matchesSearch =
      referral.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referredBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referredTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all-statuses' || referral.status === statusFilter;

    const matchesType =
      typeFilter === 'all-types' || referral.referralType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Obter tipos únicos para o filtro
  const uniqueTypes = Array.from(
    new Set(mockReferrals.map((referral) => referral.referralType))
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Encaminhamentos</h1>
        <Button onClick={() => router.push('/referrals/new')}>
          <Plus className="mr-2 h-4 w-4" /> Novo Encaminhamento
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os encaminhamentos por status, tipo ou use a busca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por aluno, responsável ou destinatário..."
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
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in-progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
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
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
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
                <TableHead>Aluno</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">
                      {referral.studentName}
                    </TableCell>
                    <TableCell>{formatDate(referral.referralDate)}</TableCell>
                    <TableCell>{referral.referralType}</TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadgeColor(referral.status)}
                        variant="outline"
                      >
                        {getStatusLabel(referral.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getPriorityBadgeColor(referral.priority)}
                        variant="outline"
                      >
                        {getPriorityLabel(referral.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>{referral.referredBy}</TableCell>
                    <TableCell>{referral.referredTo}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/referrals/${referral.id}`)}
                      >
                        <FileText className="h-4 w-4 mr-1" /> Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Nenhum encaminhamento encontrado com os filtros selecionados.
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