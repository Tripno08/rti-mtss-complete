'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Eye, 
  Pencil, 
  Trash2,
  Loader2,
  Calendar,
  ClipboardList,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { api } from '@/lib/utils/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Enums
enum StatusRastreio {
  AGENDADO = 'AGENDADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
}

// Interfaces
interface Screening {
  id: string;
  dataAplicacao: string;
  observacoes: string | null;
  status: StatusRastreio;
  estudante: {
    id: string;
    name: string;
    grade: string;
  };
  aplicador: {
    id: string;
    name: string;
    email: string;
  };
  instrumento: {
    id: string;
    nome: string;
    categoria: string;
  };
  resultados: ScreeningResult[];
}

interface ScreeningResult {
  id: string;
  valor: number;
  nivelRisco: string | null;
}

interface Student {
  id: string;
  name: string;
  grade: string;
}

interface ScreeningInstrument {
  id: string;
  nome: string;
  categoria: string;
}

// Schema de validação para o formulário de novo rastreio
const formSchema = z.object({
  estudanteId: z.string({
    required_error: "Selecione um estudante",
  }),
  instrumentoId: z.string({
    required_error: "Selecione um instrumento de rastreio",
  }),
  dataAplicacao: z.string({
    required_error: "Selecione uma data de aplicação",
  }),
  observacoes: z.string().optional(),
});

// Dados simulados para desenvolvimento
const mockScreenings: Screening[] = [
  {
    id: '1',
    dataAplicacao: '2025-03-01T10:00:00Z',
    observacoes: 'Aluno demonstrou dificuldade em leitura',
    status: StatusRastreio.CONCLUIDO,
    estudante: {
      id: '1',
      name: 'João Silva',
      grade: '3º Ano'
    },
    aplicador: {
      id: '1',
      name: 'Maria Oliveira',
      email: 'maria@escola.edu'
    },
    instrumento: {
      id: '1',
      nome: 'Avaliação de Leitura',
      categoria: 'Alfabetização'
    },
    resultados: [
      {
        id: '1',
        valor: 65,
        nivelRisco: 'MODERADO'
      }
    ]
  },
  {
    id: '2',
    dataAplicacao: '2025-03-05T14:30:00Z',
    observacoes: 'Aluno apresentou bom desempenho',
    status: StatusRastreio.CONCLUIDO,
    estudante: {
      id: '2',
      name: 'Ana Souza',
      grade: '2º Ano'
    },
    aplicador: {
      id: '1',
      name: 'Maria Oliveira',
      email: 'maria@escola.edu'
    },
    instrumento: {
      id: '2',
      nome: 'Avaliação de Matemática',
      categoria: 'Matemática'
    },
    resultados: [
      {
        id: '2',
        valor: 85,
        nivelRisco: 'BAIXO'
      }
    ]
  },
  {
    id: '3',
    dataAplicacao: '2025-03-10T09:00:00Z',
    observacoes: null,
    status: StatusRastreio.AGENDADO,
    estudante: {
      id: '3',
      name: 'Pedro Santos',
      grade: '4º Ano'
    },
    aplicador: {
      id: '2',
      name: 'Carlos Ferreira',
      email: 'carlos@escola.edu'
    },
    instrumento: {
      id: '3',
      nome: 'Avaliação de Comportamento',
      categoria: 'Comportamental'
    },
    resultados: []
  }
];

const mockStudents: Student[] = [
  { id: '1', name: 'João Silva', grade: '3º Ano' },
  { id: '2', name: 'Ana Souza', grade: '2º Ano' },
  { id: '3', name: 'Pedro Santos', grade: '4º Ano' },
  { id: '4', name: 'Mariana Costa', grade: '1º Ano' },
  { id: '5', name: 'Lucas Oliveira', grade: '5º Ano' }
];

const mockInstruments: ScreeningInstrument[] = [
  { id: '1', nome: 'Avaliação de Leitura', categoria: 'Alfabetização' },
  { id: '2', nome: 'Avaliação de Matemática', categoria: 'Matemática' },
  { id: '3', nome: 'Avaliação de Comportamento', categoria: 'Comportamental' },
  { id: '4', nome: 'Avaliação de Escrita', categoria: 'Alfabetização' },
  { id: '5', nome: 'Avaliação de Atenção', categoria: 'Comportamental' }
];

export default function ScreeningPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState('all');
  const [isClient, setIsClient] = useState(false);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Garantir que estamos no cliente antes de renderizar
  useEffect(() => {
    setIsClient(true);
    // Carregar dados simulados
    try {
      setScreenings(mockScreenings);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados simulados:', error);
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  // Configurar o formulário
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estudanteId: '',
      instrumentoId: '',
      dataAplicacao: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      observacoes: '',
    },
  });

  // Função para excluir um rastreio
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este rastreio?')) {
      try {
        // Simulação de exclusão
        setScreenings(screenings.filter(screening => screening.id !== id));
        toast.success('Rastreio excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir rastreio:', error);
        toast.error('Erro ao excluir rastreio');
      }
    }
  };

  // Função para atualizar o status de um rastreio
  const handleUpdateStatus = async (id: string, status: StatusRastreio) => {
    try {
      // Simulação de atualização
      setScreenings(screenings.map(screening => 
        screening.id === id ? { ...screening, status } : screening
      ));
      toast.success('Status do rastreio atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do rastreio');
    }
  };

  // Função para criar um novo rastreio
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulação de criação
      const newScreening: Screening = {
        id: (screenings.length + 1).toString(),
        dataAplicacao: values.dataAplicacao,
        observacoes: values.observacoes || null,
        status: StatusRastreio.AGENDADO,
        estudante: mockStudents.find(s => s.id === values.estudanteId) || {
          id: values.estudanteId,
          name: 'Estudante',
          grade: 'N/A'
        },
        aplicador: {
          id: '1',
          name: 'Usuário Atual',
          email: 'usuario@escola.edu'
        },
        instrumento: mockInstruments.find(i => i.id === values.instrumentoId) || {
          id: values.instrumentoId,
          nome: 'Instrumento',
          categoria: 'N/A'
        },
        resultados: []
      };
      
      setScreenings([...screenings, newScreening]);
      toast.success('Rastreio criado com sucesso');
      form.reset();
    } catch (error) {
      console.error('Erro ao criar rastreio:', error);
      toast.error('Erro ao criar rastreio');
    }
  };

  // Filtrar rastreios
  const filteredScreenings = screenings.filter((screening: Screening) => {
    const matchesSearch = 
      screening.estudante.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screening.instrumento.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? screening.status === statusFilter : true;
    
    // Filtrar por tab
    if (activeTab === 'all') return matchesSearch && matchesStatus;
    if (activeTab === 'pending') return matchesSearch && matchesStatus && screening.status === StatusRastreio.AGENDADO;
    if (activeTab === 'in-progress') return matchesSearch && matchesStatus && screening.status === StatusRastreio.EM_ANDAMENTO;
    if (activeTab === 'completed') return matchesSearch && matchesStatus && screening.status === StatusRastreio.CONCLUIDO;
    
    return matchesSearch && matchesStatus;
  });

  // Função para obter a cor do badge de status
  const getStatusBadgeColor = (status: StatusRastreio) => {
    const colors: Record<StatusRastreio, string> = {
      [StatusRastreio.AGENDADO]: 'bg-blue-100 text-blue-800',
      [StatusRastreio.EM_ANDAMENTO]: 'bg-yellow-100 text-yellow-800',
      [StatusRastreio.CONCLUIDO]: 'bg-green-100 text-green-800',
      [StatusRastreio.CANCELADO]: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Função para formatar o nome do status
  const formatStatusName = (status: StatusRastreio) => {
    const names: Record<StatusRastreio, string> = {
      [StatusRastreio.AGENDADO]: 'Agendado',
      [StatusRastreio.EM_ANDAMENTO]: 'Em Andamento',
      [StatusRastreio.CONCLUIDO]: 'Concluído',
      [StatusRastreio.CANCELADO]: 'Cancelado',
    };
    return names[status] || status;
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Função para obter o ícone do status
  const getStatusIcon = (status: StatusRastreio) => {
    switch (status) {
      case StatusRastreio.AGENDADO:
        return <Calendar className="h-4 w-4 mr-1" />;
      case StatusRastreio.EM_ANDAMENTO:
        return <Clock className="h-4 w-4 mr-1" />;
      case StatusRastreio.CONCLUIDO:
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case StatusRastreio.CANCELADO:
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <AlertCircle className="h-4 w-4 mr-1" />;
    }
  };

  // Se não estamos no cliente, renderizar um placeholder
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rastreios</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>
                Filtre os rastreios por estudante, instrumento ou status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Buscar por estudante ou instrumento..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
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
                      <SelectItem value="">Todos os status</SelectItem>
                      {Object.values(StatusRastreio).map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatStatusName(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Novo Rastreio</CardTitle>
              <CardDescription>
                Agende um novo rastreio para um estudante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="estudanteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estudante</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um estudante" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockStudents.map((student: Student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} ({student.grade})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instrumentoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instrumento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um instrumento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockInstruments.map((instrument: ScreeningInstrument) => (
                              <SelectItem key={instrument.id} value={instrument.id}>
                                {instrument.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataAplicacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Aplicação</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Input placeholder="Observações (opcional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Agendar Rastreio
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Agendados</TabsTrigger>
          <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando rastreios...</span>
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Erro ao carregar rastreios. Tente novamente mais tarde.
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Instrumento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Aplicador</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Resultados</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScreenings?.length > 0 ? (
                  filteredScreenings.map((screening: Screening) => (
                    <TableRow key={screening.id}>
                      <TableCell className="font-medium">
                        {screening.estudante.name}
                        <div className="text-xs text-gray-500">{screening.estudante.grade}</div>
                      </TableCell>
                      <TableCell>{screening.instrumento.nome}</TableCell>
                      <TableCell>{formatDate(screening.dataAplicacao)}</TableCell>
                      <TableCell>{screening.aplicador.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(screening.status)}>
                          <span className="flex items-center">
                            {getStatusIcon(screening.status)}
                            {formatStatusName(screening.status)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {screening.resultados?.length || 0} / {/* Aqui deveria mostrar o total de indicadores */}
                        <span className="text-gray-500">?</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/screening/${screening.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/screening/${screening.id}/results`)}
                          >
                            <ClipboardList className="h-4 w-4" />
                          </Button>
                          {screening.status === StatusRastreio.AGENDADO && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateStatus(screening.id, StatusRastreio.EM_ANDAMENTO)}
                              title="Iniciar rastreio"
                            >
                              <Clock className="h-4 w-4 text-yellow-500" />
                            </Button>
                          )}
                          {screening.status === StatusRastreio.EM_ANDAMENTO && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateStatus(screening.id, StatusRastreio.CONCLUIDO)}
                              title="Marcar como concluído"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          {(screening.status === StatusRastreio.AGENDADO || screening.status === StatusRastreio.EM_ANDAMENTO) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateStatus(screening.id, StatusRastreio.CANCELADO)}
                              title="Cancelar rastreio"
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(screening.id)}
                            disabled={screening.status === StatusRastreio.CONCLUIDO}
                            title={screening.status === StatusRastreio.CONCLUIDO ? "Não é possível excluir um rastreio concluído" : "Excluir rastreio"}
                          >
                            <Trash2 className={`h-4 w-4 ${screening.status === StatusRastreio.CONCLUIDO ? 'text-gray-400' : 'text-red-500'}`} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Nenhum rastreio encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 