'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  ArrowLeft,
  FileText,
  Download,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  FileDown,
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'form' | 'report' | 'plan' | 'guide';
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  fileUrl: string;
  fileName: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function DocumentDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      try {
        // Simulando uma chamada de API
        setTimeout(() => {
          const mockDocument: Document = {
            id: params.id,
            title: 'Formulário de Avaliação Inicial',
            type: 'form',
            category: 'Avaliação',
            description: 'Formulário padrão para avaliação inicial de estudantes no programa RTI/MTSS. Inclui seções para avaliação acadêmica, comportamental e social.',
            createdAt: '2024-02-15T10:00:00',
            updatedAt: '2024-02-15T10:00:00',
            author: 'Maria Santos',
            status: 'published',
            tags: ['avaliação', 'formulário', 'inicial', 'RTI'],
            fileUrl: '#',
            fileName: 'formulario-avaliacao-inicial.pdf',
          };
          setDocument(mockDocument);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Erro ao buscar detalhes do documento:', error);
        toast.error('Não foi possível carregar os detalhes do documento. Tente novamente mais tarde.');
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Implementar a chamada real à API
      console.log('Deletando documento:', params.id);
      
      toast.success('Documento excluído com sucesso!');
      router.push('/documents');
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast.error('Erro ao excluir documento. Tente novamente.');
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Implementar o download real
      console.log('Baixando documento:', document?.fileName);
      
      toast.success('Download iniciado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
      toast.error('Erro ao baixar documento. Tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Documento não encontrado</h2>
          <p className="text-muted-foreground mb-6">
            Não foi possível encontrar os detalhes deste documento.
          </p>
          <Button onClick={() => router.push('/documents')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Documentos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge className={getStatusBadgeColor(document.status)}>
                {getStatusLabel(document.status)}
              </Badge>
              <span>•</span>
              <span>{getTypeLabel(document.type)}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <>
                <FileDown className="mr-2 h-4 w-4 animate-bounce" />
                Baixando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Baixar
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/documents/${document.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Documento</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
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
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Documento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Descrição</h3>
                <p className="text-muted-foreground">{document.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Categoria</h4>
                  <p className="text-sm text-muted-foreground">{document.category}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Arquivo</h4>
                  <p className="text-sm text-muted-foreground">{document.fileName}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Autor</p>
                  <p className="text-sm text-muted-foreground">{document.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Criado em</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(document.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Última atualização</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(document.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Visualizar PDF
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Baixar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 