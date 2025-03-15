'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Search, Trash2, UserPlus, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getClassById, getClassStudents, addStudentToClass, removeStudentFromClass, ClassStudent, Class } from '@/lib/api/classes';
import { getStudents, Student } from '@/lib/api/students';
import { useAuthStore } from '@/lib/stores/auth';

// Versões mockadas para testes (temporário)
async function getMockClassStudents(classId: string): Promise<ClassStudent[]> {
  // Simular um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retornar dados mockados
  return [
    {
      id: '1',
      classId: classId,
      studentId: '101',
      student: {
        id: '101',
        name: 'Ana Silva',
        grade: '5º Ano',
        dateOfBirth: '2013-05-15',
        schoolId: '1',
        userId: 'user1',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      },
      joinedAt: '2023-02-01T00:00:00Z'
    },
    {
      id: '2',
      classId: classId,
      studentId: '102',
      student: {
        id: '102',
        name: 'Pedro Santos',
        grade: '5º Ano',
        dateOfBirth: '2013-03-22',
        schoolId: '1',
        userId: 'user2',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      },
      joinedAt: '2023-02-01T00:00:00Z'
    },
    {
      id: '3',
      classId: classId,
      studentId: '103',
      student: {
        id: '103',
        name: 'Mariana Oliveira',
        grade: '5º Ano',
        dateOfBirth: '2013-07-10',
        schoolId: '1',
        userId: 'user3',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      },
      joinedAt: '2023-02-15T00:00:00Z'
    }
  ];
}

async function getMockStudents(): Promise<Student[]> {
  // Simular um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retornar dados mockados
  return [
    {
      id: '101',
      name: 'Ana Silva',
      grade: '5º Ano',
      dateOfBirth: '2013-05-15',
      schoolId: '1',
      userId: 'user1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '102',
      name: 'Pedro Santos',
      grade: '5º Ano',
      dateOfBirth: '2013-03-22',
      schoolId: '1',
      userId: 'user2',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '103',
      name: 'Mariana Oliveira',
      grade: '5º Ano',
      dateOfBirth: '2013-07-10',
      schoolId: '1',
      userId: 'user3',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '104',
      name: 'João Pereira',
      grade: '5º Ano',
      dateOfBirth: '2013-09-05',
      schoolId: '1',
      userId: 'user4',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '105',
      name: 'Luiza Costa',
      grade: '5º Ano',
      dateOfBirth: '2013-11-18',
      schoolId: '1',
      userId: 'user5',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }
  ];
}

async function mockAddStudentToClass(classId: string, studentId: string): Promise<ClassStudent> {
  // Simular um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Buscar o estudante para incluir nos dados de retorno
  const students = await getMockStudents();
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    throw new Error('Estudante não encontrado');
  }
  
  // Retornar dados mockados
  return {
    id: Date.now().toString(),
    classId,
    studentId,
    student,
    joinedAt: new Date().toISOString()
  };
}

async function mockRemoveStudentFromClass(classId: string, studentId: string): Promise<void> {
  // Simular um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Não precisa retornar nada
  return;
}

export default function ClassStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isRemovingStudent, setIsRemovingStudent] = useState(false);
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
        
        // Buscar estudantes da turma
        const studentsResponse = await getMockClassStudents(classId);
        setStudents(studentsResponse);
        
        // Buscar todos os estudantes disponíveis
        const allStudentsResponse = await getMockStudents();
        
        // Filtrar estudantes que já estão na turma
        const studentIdsInClass = studentsResponse.map((s: ClassStudent) => s.student.id);
        const filteredStudents = allStudentsResponse.filter(
          (student: Student) => !studentIdsInClass.includes(student.id)
        );
        
        setAvailableStudents(filteredStudents);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados. Tente novamente.');
        setIsLoading(false);
      }
    };

    loadData();
  }, [params?.id, currentUser]);

  const handleAddStudent = async () => {
    if (!selectedStudentId) {
      toast.error('Selecione um estudante para adicionar à turma.');
      return;
    }
    
    try {
      setIsAddingStudent(true);
      const classId = params?.id as string;
      const newClassStudent = await mockAddStudentToClass(classId, selectedStudentId);
      
      // Atualizar a lista de estudantes
      setStudents(prev => [...prev, newClassStudent]);
      
      // Atualizar a lista de estudantes disponíveis
      setAvailableStudents(prev => prev.filter(student => student.id !== selectedStudentId));
      
      setSelectedStudentId('');
      setIsDialogOpen(false);
      toast.success('Estudante adicionado à turma com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar estudante:', error);
      toast.error('Erro ao adicionar estudante. Tente novamente.');
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm('Tem certeza que deseja remover este estudante da turma?')) {
      return;
    }
    
    try {
      setIsRemovingStudent(true);
      const classId = params?.id as string;
      await mockRemoveStudentFromClass(classId, studentId);
      
      // Atualizar a lista de estudantes
      const removedStudent = students.find(cs => cs.student.id === studentId)?.student;
      setStudents(prev => prev.filter(cs => cs.student.id !== studentId));
      
      // Adicionar o estudante removido de volta à lista de disponíveis
      if (removedStudent) {
        setAvailableStudents(prev => [...prev, removedStudent]);
      }
      
      toast.success('Estudante removido da turma com sucesso!');
    } catch (error) {
      console.error('Erro ao remover estudante:', error);
      toast.error('Erro ao remover estudante. Tente novamente.');
    } finally {
      setIsRemovingStudent(false);
    }
  };

  // Filtrar estudantes com base na pesquisa
  const filteredStudents = students.filter(student => 
    student.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold tracking-tight">Estudantes da Turma</h1>
          <p className="text-muted-foreground">
            {classData.name} - {classData.grade}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Estudante
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Estudante à Turma</DialogTitle>
              <DialogDescription>
                Selecione um estudante para adicionar à turma {classData.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select
                value={selectedStudentId}
                onValueChange={setSelectedStudentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estudante" />
                </SelectTrigger>
                <SelectContent>
                  {availableStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableStudents.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Não há estudantes disponíveis para adicionar a esta turma.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddStudent} disabled={isAddingStudent || !selectedStudentId}>
                {isAddingStudent ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudantes</CardTitle>
          <CardDescription>
            Gerencie os estudantes matriculados nesta turma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar estudantes..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {students.length} estudantes matriculados
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Nenhum estudante encontrado com os filtros atuais.' : 'Nenhum estudante matriculado nesta turma.'}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Limpar Filtros
                </Button>
              )}
              {!searchTerm && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Estudante
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Série</TableHead>
                    <TableHead>Data de Ingresso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((classStudent) => (
                    <TableRow key={classStudent.id}>
                      <TableCell className="font-medium">{classStudent.student.name}</TableCell>
                      <TableCell>{classStudent.student.grade}</TableCell>
                      <TableCell>{new Date(classStudent.joinedAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStudent(classStudent.student.id)}
                          disabled={isRemovingStudent}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Remover</span>
                        </Button>
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