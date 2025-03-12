'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/utils/api';
import { useAuthStore } from '@/lib/stores/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Student {
  id: string;
  name: string;
  grade: string;
  dateOfBirth: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailsPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, studentsResponse] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/students?userId=${id}`),
        ]);
        
        setUser(userResponse.data);
        setStudents(studentsResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        toast.error('Erro ao carregar os dados do usuário.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleDelete = async () => {
    // Não permitir que o usuário exclua a si mesmo
    if (id === currentUser?.id) {
      toast.error('Você não pode excluir sua própria conta.');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      toast.success('Usuário excluído com sucesso!');
      router.push('/users');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Administrador</Badge>;
      case 'TEACHER':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Professor</Badge>;
      case 'SPECIALIST':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Especialista</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  // Verificar se o usuário atual é um administrador
  const isAdmin = currentUser?.role === 'ADMIN';

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Usuário não encontrado.</p>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => router.push('/users')}>Voltar para a lista</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Detalhes do Usuário</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push('/users')}>
            Voltar
          </Button>
          {isAdmin && (
            <>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/users/${id}/edit`)}
              >
                Editar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={id === currentUser?.id}
              >
                Excluir
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Informações do Usuário</CardTitle>
              {getRoleBadge(user.role)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Nome</h3>
                <p>{user.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                <p>{user.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Papel</h3>
                <p>{user.role === 'ADMIN' ? 'Administrador' : user.role === 'TEACHER' ? 'Professor' : 'Especialista'}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Criado em</h3>
                <p>{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Atualizado em</h3>
                <p>{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alunos Associados</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-muted-foreground">Nenhum aluno associado a este usuário.</p>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">Série: {student.grade}</p>
                      </div>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto" 
                        onClick={() => router.push(`/students/${student.id}`)}
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 