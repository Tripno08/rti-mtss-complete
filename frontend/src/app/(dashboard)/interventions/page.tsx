'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { getInterventions, deleteIntervention, Intervention } from '@/lib/api/interventions';

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    const fetchInterventions = async () => {
      try {
        setIsLoading(true);
        const data = await getInterventions();
        setInterventions(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar intervenções:', error);
        setIsError(true);
        setIsLoading(false);
        toast.error('Erro ao carregar intervenções. Tente novamente mais tarde.');
      }
    };

    fetchInterventions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta intervenção?')) {
      return;
    }

    try {
      await deleteIntervention(id);
      setInterventions(interventions.filter((intervention) => intervention.id !== id));
      toast.success('Intervenção excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir intervenção:', error);
      toast.error('Erro ao excluir intervenção.');
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

  // Se não estamos no cliente, renderizar um placeholder
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  // Se ocorreu um erro
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Intervenções</h1>
          <Button onClick={() => router.push('/interventions/new')}>Nova Intervenção</Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">Erro ao carregar intervenções. Tente novamente mais tarde.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Intervenções</h1>
        <Button onClick={() => router.push('/interventions/new')}>Nova Intervenção</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando...</span>
        </div>
      ) : interventions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Nenhuma intervenção encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interventions.map((intervention) => (
            <Card key={intervention.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{intervention.type}</CardTitle>
                  <Badge className={getStatusColor(intervention.status)}>
                    {getStatusText(intervention.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {intervention.student?.name || 'Aluno não encontrado'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Início:</span>
                    <span>{formatDate(intervention.startDate)}</span>
                  </div>
                  {intervention.endDate && (
                    <div className="flex justify-between">
                      <span className="font-medium">Término:</span>
                      <span>{formatDate(intervention.endDate)}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Descrição:</span>
                    <p className="mt-1 text-sm line-clamp-2">{intervention.description}</p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/interventions/${intervention.id}`)}
                    >
                      Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/interventions/${intervention.id}/edit`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(intervention.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 