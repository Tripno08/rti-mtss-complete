"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Filter, MoreHorizontal, Plus, Search, User, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAssessments, deleteAssessment, Assessment, getAssessmentTypeOptions } from "@/lib/api/assessments";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth";

export default function AssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const currentUser = useAuthStore((state) => state.user);
  const assessmentTypeOptions = getAssessmentTypeOptions();

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const data = await getAssessments();
        setAssessments(data);
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        toast.error("Erro ao carregar avaliações. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [currentUser]);

  const handleViewAssessment = (id: string) => {
    router.push(`/teacher-portal/assessments/${id}`);
  };

  const handleEditAssessment = (id: string) => {
    router.push(`/teacher-portal/assessments/edit/${id}`);
  };

  const handleDeleteAssessment = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
      try {
        await deleteAssessment(id);
        setAssessments(assessments.filter(assessment => assessment.id !== id));
        toast.success("Avaliação excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir avaliação:", error);
        toast.error("Erro ao excluir avaliação. Tente novamente.");
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Filtragem de avaliações
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = 
      assessment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assessment.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assessment.student?.grade || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || assessment.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Função para formatar a pontuação
  const formatScore = (score: number) => {
    return `${score.toFixed(1)}%`;
  };

  // Função para determinar a cor da badge com base na pontuação
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-muted-foreground">Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Avaliações</h1>
        <Button onClick={() => router.push("/teacher-portal/assessments/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Avaliação
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Refine a lista de avaliações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar avaliações..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {assessmentTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando...</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Avaliações</CardTitle>
            <CardDescription>
              {filteredAssessments.length} avaliações encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAssessments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">Nenhuma avaliação encontrada com os filtros atuais.</p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                }}>
                  <Filter className="mr-2 h-4 w-4" />
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Pontuação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.map((assessment) => (
                    <TableRow key={assessment.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell onClick={() => handleViewAssessment(assessment.id)}>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(assessment.date)}
                        </div>
                      </TableCell>
                      <TableCell onClick={() => handleViewAssessment(assessment.id)}>
                        {assessment.type}
                      </TableCell>
                      <TableCell onClick={() => handleViewAssessment(assessment.id)}>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {assessment.student?.name || "Não especificado"}
                        </div>
                      </TableCell>
                      <TableCell onClick={() => handleViewAssessment(assessment.id)}>
                        {assessment.student?.grade || "Não especificado"}
                      </TableCell>
                      <TableCell onClick={() => handleViewAssessment(assessment.id)}>
                        <Badge className={getScoreColor(assessment.score)}>
                          {formatScore(assessment.score)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewAssessment(assessment.id)}>
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditAssessment(assessment.id)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteAssessment(assessment.id)}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 