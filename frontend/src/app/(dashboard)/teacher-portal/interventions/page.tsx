"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Clock, Filter, MoreHorizontal, Plus, Search, User, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInterventions, deleteIntervention, Intervention } from "@/lib/api/interventions";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth";

// Interface estendida para intervenção com informações adicionais
interface ExtendedIntervention extends Intervention {
  class?: {
    id: string;
    name: string;
  };
  frequency?: string;
}

export default function InterventionsPage() {
  const router = useRouter();
  const [interventions, setInterventions] = useState<ExtendedIntervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchInterventions = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const data = await getInterventions();
        
        // Processar os dados para adicionar informações adicionais
        const extendedData: ExtendedIntervention[] = data.map((intervention: Intervention) => {
          // Adicionar informações de classe e frequência (simuladas por enquanto)
          return {
            ...intervention,
            class: {
              id: "c1",
              name: intervention.student?.grade || "Não especificado"
            },
            frequency: "2-3 vezes por semana" // Placeholder
          };
        });
        
        setInterventions(extendedData);
      } catch (error) {
        console.error("Erro ao buscar intervenções:", error);
        toast.error("Erro ao carregar intervenções. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterventions();
  }, [currentUser]);

  const handleViewIntervention = (id: string) => {
    router.push(`/teacher-portal/interventions/${id}`);
  };

  const handleEditIntervention = (id: string) => {
    router.push(`/teacher-portal/interventions/edit/${id}`);
  };

  const handleDeleteIntervention = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta intervenção?")) {
      try {
        await deleteIntervention(id);
        setInterventions(interventions.filter(intervention => intervention.id !== id));
        toast.success("Intervenção excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir intervenção:", error);
        toast.error("Erro ao excluir intervenção. Tente novamente.");
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

  // Mapear status para exibição
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { label: 'Ativa', color: 'bg-green-100 text-green-800' };
      case 'COMPLETED':
        return { label: 'Concluída', color: 'bg-blue-100 text-blue-800' };
      case 'CANCELLED':
        return { label: 'Cancelada', color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Determinar o tier com base no tipo de intervenção (lógica simplificada)
  const getTierFromType = (type: string): "Tier 1" | "Tier 2" | "Tier 3" => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('intensiv') || lowerType.includes('especial')) {
      return "Tier 3";
    } else if (lowerType.includes('grupo') || lowerType.includes('reforço')) {
      return "Tier 2";
    }
    return "Tier 1";
  };

  // Filtragem de intervenções
  const filteredInterventions = interventions.filter(intervention => {
    const matchesSearch = 
      intervention.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (intervention.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (intervention.class?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && intervention.status === "ACTIVE") ||
      (statusFilter === "completed" && intervention.status === "COMPLETED") ||
      (statusFilter === "cancelled" && intervention.status === "CANCELLED");
    
    const tier = getTierFromType(intervention.type);
    const matchesTier = tierFilter === "all" || tier === tierFilter;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

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
        <h1 className="text-3xl font-bold">Intervenções</h1>
        <Button onClick={() => router.push("/teacher-portal/interventions/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Intervenção
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Refine a lista de intervenções</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar intervenções..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tiers</SelectItem>
                <SelectItem value="Tier 1">Tier 1</SelectItem>
                <SelectItem value="Tier 2">Tier 2</SelectItem>
                <SelectItem value="Tier 3">Tier 3</SelectItem>
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
            <CardTitle>Lista de Intervenções</CardTitle>
            <CardDescription>
              {filteredInterventions.length} intervenções encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredInterventions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">Nenhuma intervenção encontrada com os filtros atuais.</p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTierFilter("all");
                }}>
                  <Filter className="mr-2 h-4 w-4" />
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterventions.map((intervention) => {
                    const statusDisplay = getStatusDisplay(intervention.status);
                    const tier = getTierFromType(intervention.type);
                    
                    return (
                      <TableRow key={intervention.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium" onClick={() => handleViewIntervention(intervention.id)}>
                          {intervention.type}
                        </TableCell>
                        <TableCell onClick={() => handleViewIntervention(intervention.id)}>
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            {intervention.student?.name || "Não especificado"}
                          </div>
                        </TableCell>
                        <TableCell onClick={() => handleViewIntervention(intervention.id)}>
                          {intervention.class?.name || "Não especificado"}
                        </TableCell>
                        <TableCell onClick={() => handleViewIntervention(intervention.id)}>
                          <Badge variant="outline">{tier}</Badge>
                        </TableCell>
                        <TableCell onClick={() => handleViewIntervention(intervention.id)}>
                          <Badge className={statusDisplay.color}>
                            {statusDisplay.label}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={() => handleViewIntervention(intervention.id)}>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {formatDate(intervention.startDate)} - {intervention.endDate ? formatDate(intervention.endDate) : "Em andamento"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => handleViewIntervention(intervention.id)}>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            {intervention.frequency || "Não especificado"}
                          </div>
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
                              <DropdownMenuItem onClick={() => handleViewIntervention(intervention.id)}>
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditIntervention(intervention.id)}>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteIntervention(intervention.id)}
                              >
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 