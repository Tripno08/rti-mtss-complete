'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { 
  getInterventionById, 
  deleteIntervention, 
  updateIntervention, 
  completeIntervention, 
  cancelIntervention,
  Intervention 
} from '@/lib/api/interventions';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InterventionDetailsPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchIntervention = async () => {
      try {
        const data = await getInterventionById(id);
        setIntervention(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes da intervenção:', error);
        toast.error('Erro ao carregar os detalhes da intervenção.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntervention();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta intervenção?')) {
      return;
    }

    try {
      await deleteIntervention(id);
      toast.success('Intervenção excluída com sucesso!');
      router.push('/interventions');
    } catch (error) {
      console.error('Erro ao excluir intervenção:', error);
      toast.error('Erro ao excluir intervenção.');
    }
  };

  const handleStatusChange = async (newStatus: 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => {
    try {
      let updatedIntervention;
      
      if (newStatus === 'COMPLETED') {
        updatedIntervention = await completeIntervention(id);
      } else if (newStatus === 'CANCELLED') {
        updatedIntervention = await cancelIntervention(id);
      } else {
        updatedIntervention = await updateIntervention(id, { status: newStatus });
      }
      
      setIntervention(updatedIntervention);
      toast.success('Status da intervenção atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar status da intervenção:', error);
      toast.error('Erro ao atualizar status da intervenção.');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativa';
      case 'COMPLETED':
        return 'Concluída';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  if (!intervention) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Intervenção não encontrada.</p>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => router.push('/interventions')}>Voltar para a lista</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Detalhes da Intervenção</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push('/interventions')}>
            Voltar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/interventions/${id}/edit`)}
          >
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{intervention.type}</CardTitle>
            <Badge className={getStatusColor(intervention.status)}>
              {getStatusText(intervention.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Informações da Intervenção</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data de Início:</span>
                  <span>{formatDate(intervention.startDate)}</span>
                </div>
                {intervention.endDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data de Término:</span>
                    <span>{formatDate(intervention.endDate)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span>{intervention.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span>{getStatusText(intervention.status)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Alterar Status</h4>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={intervention.status === 'ACTIVE' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('ACTIVE')}
                    disabled={intervention.status === 'ACTIVE'}
                  >
                    Ativar
                  </Button>
                  <Button 
                    size="sm" 
                    variant={intervention.status === 'COMPLETED' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('COMPLETED')}
                    disabled={intervention.status === 'COMPLETED'}
                  >
                    Concluir
                  </Button>
                  <Button 
                    size="sm" 
                    variant={intervention.status === 'CANCELLED' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('CANCELLED')}
                    disabled={intervention.status === 'CANCELLED'}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Aluno</h3>
              {intervention.student ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nome:</span>
                    <span>{intervention.student.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Série:</span>
                    <span>{intervention.student.grade}</span>
                  </div>
                  <div className="mt-2">
                    <Button 
                      variant="link" 
                      className="p-0" 
                      onClick={() => router.push(`/students/${intervention.student?.id}`)}
                    >
                      Ver perfil do aluno
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Informações do aluno não disponíveis</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Descrição</h3>
            <p className="text-sm">{intervention.description}</p>
          </div>

          {intervention.notes && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Observações</h3>
              <p className="text-sm">{intervention.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 