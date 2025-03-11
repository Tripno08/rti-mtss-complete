'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
  Search,
  Plus,
  Download,
  FileDown,
  Eye,
  Calendar,
  User,
} from 'lucide-react';

// Tipos
interface Document {
  id: string;
  title: string;
  type: 'form' | 'report' | 'plan' | 'guide';
  category: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  downloadUrl: string;
}

// Dados simulados
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Formulário de Avaliação Inicial',
    type: 'form',
    category: 'Avaliação',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
    author: 'Maria Santos',
    status: 'published',
    downloadUrl: '#',
  },
  {
    id: '2',
    title: 'Plano de Intervenção - Modelo',
    type: 'plan',
    category: 'Intervenção',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-12',
    author: 'Carlos Pereira',
    status: 'published',
    downloadUrl: '#',
  },
  {
    id: '3',
    title: 'Guia de Estratégias de Leitura',
    type: 'guide',
    category: 'Recursos',
    createdAt: '2024-02-08',
    updatedAt: '2024-02-08',
    author: 'Ana Oliveira',
    status: 'published',
    downloadUrl: '#',
  },
  {
    id: '4',
    title: 'Relatório de Progresso - Template',
    type: 'report',
    category: 'Relatórios',
    createdAt: '2024-02-05',
    updatedAt: '2024-02-14',
    author: 'Paulo Ribeiro',
    status: 'draft',
    downloadUrl: '#',
  },
  {
    id: '5',
    title: 'Formulário de Monitoramento',
    type: 'form',
    category: 'Monitoramento',
    createdAt: '2024-01-28',
    updatedAt: '2024-02-01',
    author: 'Maria Santos',
    status: 'archived',
    downloadUrl: '#',
  },
];

export default function DocumentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para obter o rótulo do tipo
  const getTypeLabel = (type: Document['type']) => {
    switch (type) {
      case 'form':
        return 'Formulário';
      case 'report':
        return 'Relatório';
      case 'plan':
        return 'Plano';
      case 'guide':
        return 'Guia';
      default:
        return type;
    }
  };

  // Função para obter a cor do badge de status
  const getStatusBadgeColor = (status: Document['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'archived':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return '';
    }
  };

  // Função para obter o rótulo do status
  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Rascunho';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  };

  // Função para baixar documento
  const handleDownload = async (document: Document) => {
    setIsDownloading(document.id);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar o download real
      console.log('Baixando documento:', document);
      
      toast.success('Download iniciado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
      toast.error('Erro ao baixar documento. Tente novamente.');
    } finally {
      setIsDownloading(null);
    }
  };

  // Filtragem dos documentos
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || doc.type === typeFilter;
    const matchesStatus = !statusFilter || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground">
            Gerencie os documentos do sistema RTI/MTSS
          </p>
        </div>
        <Button onClick={() => router.push('/documents/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Documento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Documentos</CardTitle>
          <CardDescription>
            Total de {filteredDocuments.length} documentos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título ou autor..."
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
                    <SelectItem value="form">Formulários</SelectItem>
                    <SelectItem value="report">Relatórios</SelectItem>
                    <SelectItem value="plan">Planos</SelectItem>
                    <SelectItem value="guide">Guias</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="published">Publicados</SelectItem>
                    <SelectItem value="draft">Rascunhos</SelectItem>
                    <SelectItem value="archived">Arquivados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.title}</TableCell>
                      <TableCell>{getTypeLabel(doc.type)}</TableCell>
                      <TableCell>{doc.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(doc.updatedAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{doc.author}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(doc.status)}>
                          {getStatusLabel(doc.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/documents/${doc.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(doc)}
                            disabled={isDownloading === doc.id}
                          >
                            {isDownloading === doc.id ? (
                              <FileDown className="h-4 w-4 animate-bounce" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
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