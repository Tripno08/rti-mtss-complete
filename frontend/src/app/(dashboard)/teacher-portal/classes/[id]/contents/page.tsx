'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getClassById, Class } from '@/lib/api/classes';
import { useAuthStore } from '@/lib/stores/auth';
import { 
  Content, 
  getContentsByClass, 
  createContent, 
  updateContent, 
  deleteContent,
  CreateContentDto
} from '@/lib/api/contents';

export default function ClassContentsPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState<Class | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lesson' as 'lesson' | 'activity' | 'assessment',
    status: 'draft' as 'draft' | 'published'
  });
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadData = async () => {
      if (!params?.id || !currentUser) return;
      
      try {
        setIsLoading(true);
        
        // Buscar dados da turma
        const classId = params.id as string;
        const classResponse = await getClassById(classId);
        setClassData(classResponse);
        
        // Buscar conteúdos da turma usando a API real
        try {
          const contentsResponse = await getContentsByClass(classId);
          setContents(contentsResponse);
        } catch (error) {
          console.error('Erro ao buscar conteúdos:', error);
          toast.error('Erro ao buscar conteúdos. Usando dados de exemplo.');
          // Fallback para dados vazios
          setContents([]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados. Tente novamente.');
        setIsLoading(false);
      }
    };

    loadData();
  }, [params?.id, currentUser]);

  const handleOpenDialog = (content?: Content) => {
    if (content) {
      setIsEditMode(true);
      setCurrentContent(content);
      setFormData({
        title: content.title,
        description: content.description || '',
        type: content.type as 'lesson' | 'activity' | 'assessment',
        status: content.status as 'draft' | 'published'
      });
    } else {
      setIsEditMode(false);
      setCurrentContent(null);
      setFormData({
        title: '',
        description: '',
        type: 'lesson',
        status: 'draft'
      });
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    try {
      if (isEditMode && currentContent) {
        // Atualizar conteúdo existente
        const updatedContent = await updateContent(currentContent.id, formData);
        
        // Atualizar a lista de conteúdos
        setContents(prev => 
          prev.map(content => content.id === currentContent.id ? updatedContent : content)
        );
        
        toast.success('Conteúdo atualizado com sucesso!');
      } else {
        // Adicionar novo conteúdo
        if (!params?.id) {
          toast.error('ID da turma não encontrado');
          return;
        }
        
        const newContentData: CreateContentDto = {
          ...formData,
          classId: params.id as string
        };
        
        const newContent = await createContent(newContentData);
        setContents(prev => [...prev, newContent]);
        toast.success('Conteúdo adicionado com sucesso!');
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      toast.error('Erro ao salvar conteúdo. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este conteúdo?')) {
      return;
    }
    
    try {
      await deleteContent(id);
      setContents(prev => prev.filter(content => content.id !== id));
      toast.success('Conteúdo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir conteúdo:', error);
      toast.error('Erro ao excluir conteúdo. Tente novamente.');
    }
  };

  // Filtrar conteúdos com base na pesquisa
  const filteredContents = contents.filter(content => 
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (content.description && content.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Função para obter o rótulo do tipo de conteúdo
  const getContentTypeLabel = (type: 'lesson' | 'activity' | 'assessment') => {
    switch (type) {
      case 'lesson': return 'Aula';
      case 'activity': return 'Atividade';
      case 'assessment': return 'Avaliação';
      default: return type;
    }
  };

  // Função para obter a classe CSS para o status
  const getStatusClass = (status: 'draft' | 'published') => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter o rótulo do status
  const getStatusLabel = (status: 'draft' | 'published') => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'published': return 'Publicado';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="flex h-48 flex-col items-center justify-center">
        <p className="text-xl font-semibold">Turma não encontrada</p>
        <Button variant="link" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Conteúdos da Turma</h1>
          <p className="text-muted-foreground">
            {classData.name} - {classData.grade}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Conteúdo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Editar Conteúdo' : 'Adicionar Novo Conteúdo'}</DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? 'Atualize as informações do conteúdo abaixo.' 
                  : 'Preencha as informações para adicionar um novo conteúdo à turma.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Título
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Digite o título do conteúdo"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descrição
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Digite uma descrição para o conteúdo"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Tipo
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, type: value as 'lesson' | 'activity' | 'assessment' }))
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lesson">Aula</SelectItem>
                      <SelectItem value="activity">Atividade</SelectItem>
                      <SelectItem value="assessment">Avaliação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, status: value as 'draft' | 'published' }))
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {isEditMode ? 'Salvar Alterações' : 'Adicionar Conteúdo'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Conteúdos</CardTitle>
          <CardDescription>
            Gerencie os conteúdos disponíveis para esta turma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar conteúdos..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {contents.length} conteúdos disponíveis
            </div>
          </div>

          {filteredContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Nenhum conteúdo encontrado com os filtros atuais.' : 'Nenhum conteúdo disponível para esta turma.'}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Limpar Filtros
                </Button>
              )}
              {!searchTerm && (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Conteúdo
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContents.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium">{content.title}</TableCell>
                      <TableCell>{getContentTypeLabel(content.type as 'lesson' | 'activity' | 'assessment')}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(content.status as 'draft' | 'published')}`}>
                          {getStatusLabel(content.status as 'draft' | 'published')}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(content.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(content)}
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(content.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 