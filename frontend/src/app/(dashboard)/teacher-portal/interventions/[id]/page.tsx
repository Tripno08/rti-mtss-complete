"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Edit, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Tipo para a intervenção
interface Intervention {
  id: string;
  title: string;
  description: string;
  student: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  };
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  status: "active" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  frequency: string;
  duration: string;
  notes: string[];
  progress: {
    date: string;
    note: string;
  }[];
}

export default function InterventionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregamento de dados
    const timer = setTimeout(() => {
      // Dados mockados para demonstração
      setIntervention({
        id,
        title: "Leitura Diária Guiada",
        description: "Sessões de leitura guiada para melhorar a fluência e compreensão",
        student: {
          id: "s1",
          name: "João Silva"
        },
        class: {
          id: "c1",
          name: "3º Ano A"
        },
        tier: "Tier 2",
        status: "active",
        startDate: "2023-09-01",
        endDate: "2023-12-15",
        frequency: "3 vezes por semana",
        duration: "20 minutos",
        notes: [
          "O aluno demonstra dificuldade com palavras multissilábicas",
          "Prefere leitura em voz alta com apoio"
        ],
        progress: [
          {
            date: "2023-09-05",
            note: "Primeira sessão concluída. O aluno leu 3 páginas com poucos erros."
          },
          {
            date: "2023-09-07",
            note: "Segunda sessão. Melhoria na fluência, mas ainda com dificuldades em palavras novas."
          }
        ]
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir esta intervenção?")) {
      // Simulação de exclusão
      toast.success("Intervenção excluída com sucesso");
      router.push("/teacher-portal/interventions");
    }
  };

  const handleEdit = () => {
    router.push(`/teacher-portal/interventions/edit/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <InterventionSkeleton />;
  }

  if (!intervention) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Intervenção não encontrada</h2>
        <p className="text-muted-foreground mb-4">A intervenção solicitada não existe ou foi removida.</p>
        <Button onClick={() => router.push("/teacher-portal/interventions")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para intervenções
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/teacher-portal/interventions")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Detalhes da Intervenção</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{intervention.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <Badge variant={intervention.tier === "Tier 1" ? "default" : 
                                  intervention.tier === "Tier 2" ? "secondary" : "destructive"}>
                      {intervention.tier}
                    </Badge>
                    <Badge 
                      variant={intervention.status === "active" ? "outline" : 
                              intervention.status === "completed" ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {intervention.status === "active" ? "Ativa" : 
                       intervention.status === "completed" ? "Concluída" : "Cancelada"}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={handleEdit}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Descrição</h3>
                  <p className="text-muted-foreground mt-1">{intervention.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Aluno</p>
                      <p className="font-medium">{intervention.student.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Período</p>
                      <p className="font-medium">
                        {formatDate(intervention.startDate)} - {formatDate(intervention.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Frequência</p>
                      <p className="font-medium">{intervention.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duração</p>
                      <p className="font-medium">{intervention.duration}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Notas</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {intervention.notes.map((note, index) => (
                      <li key={index} className="text-muted-foreground">{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Progresso da Intervenção</CardTitle>
              <CardDescription>
                Registro de acompanhamento e evolução
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {intervention.progress.length === 0 ? (
                  <p className="text-muted-foreground">Nenhum registro de progresso disponível.</p>
                ) : (
                  intervention.progress.map((entry, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{formatDate(entry.date)}</h4>
                      </div>
                      <p className="text-muted-foreground">{entry.note}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Adicionar Registro de Progresso</Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informações da Turma</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Turma</p>
                  <p className="font-medium">{intervention.class.name}</p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => router.push(`/teacher-portal/classes/${intervention.class.id}`)}>
                  Ver Detalhes da Turma
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Intervenção
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Intervenção
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Componente de esqueleto para carregamento
function InterventionSkeleton() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-24 mr-4" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-5 w-5 mr-2" />
                      <div>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <Skeleton className="h-6 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="h-6 w-1/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 