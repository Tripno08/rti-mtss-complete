'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getStudents, Student } from '@/lib/api/students';
import { getInterventionsByStudentId } from '@/lib/api/interventions';

// Interface estendida para incluir dados calculados
interface ExtendedStudent extends Student {
  riskLevel: 'low' | 'medium' | 'high';
  interventionsCount: number;
  lastAssessmentDate: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const studentsData = await getStudents();
        
        // Processar os dados dos estudantes para adicionar informações adicionais
        const extendedStudentsPromises = studentsData.map(async (student: Student) => {
          // Buscar intervenções do estudante
          let interventions = [];
          try {
            interventions = await getInterventionsByStudentId(student.id);
          } catch (error) {
            console.error(`Erro ao buscar intervenções para o estudante ${student.id}:`, error);
          }
          
          // Calcular o nível de risco com base no número de intervenções (lógica simplificada)
          let riskLevel: 'low' | 'medium' | 'high' = 'low';
          if (interventions.length >= 3) {
            riskLevel = 'high';
          } else if (interventions.length >= 1) {
            riskLevel = 'medium';
          }
          
          // Última data de avaliação (simulada por enquanto)
          // Em uma implementação real, isso viria de uma API de avaliações
          const lastAssessmentDate = new Date().toISOString().split('T')[0];
          
          return {
            ...student,
            riskLevel,
            interventionsCount: interventions.length,
            lastAssessmentDate,
          };
        });
        
        const extendedStudents = await Promise.all(extendedStudentsPromises);
        setStudents(extendedStudents);
      } catch (error) {
        console.error('Erro ao buscar estudantes:', error);
        toast.error('Erro ao carregar a lista de estudantes.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Função para obter a cor do badge de risco
  const getRiskBadgeColor = (risk: ExtendedStudent['riskLevel']) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return '';
    }
  };

  // Função para traduzir o nível de risco
  const getRiskLabel = (risk: ExtendedStudent['riskLevel']) => {
    switch (risk) {
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Médio';
      case 'low':
        return 'Baixo';
      default:
        return risk;
    }
  };

  // Filtragem dos estudantes
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !gradeFilter || gradeFilter === 'all-grades' || student.grade === gradeFilter;
    const matchesRisk = !riskFilter || riskFilter === 'all-levels' || student.riskLevel === riskFilter;
    return matchesSearch && matchesGrade && matchesRisk;
  });

  // Obter lista única de séries para o filtro
  const uniqueGrades = Array.from(new Set(students.map(student => student.grade)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estudantes</h1>
          <p className="text-muted-foreground">
            Gerencie os estudantes do sistema Innerview
          </p>
        </div>
        <Button onClick={() => router.push('/students/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Estudante
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando...</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Estudantes</CardTitle>
            <CardDescription>
              Total de {filteredStudents.length} estudantes encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por série" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-grades">Todas as séries</SelectItem>
                      {uniqueGrades.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por risco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-levels">Todos os níveis</SelectItem>
                      <SelectItem value="high">Alto Risco</SelectItem>
                      <SelectItem value="medium">Médio Risco</SelectItem>
                      <SelectItem value="low">Baixo Risco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum estudante encontrado com os filtros selecionados.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Série</TableHead>
                        <TableHead>Data de Nascimento</TableHead>
                        <TableHead>Nível de Risco</TableHead>
                        <TableHead>Intervenções</TableHead>
                        <TableHead>Última Avaliação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow
                          key={student.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => router.push(`/students/${student.id}`)}
                        >
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>{formatDate(student.dateOfBirth)}</TableCell>
                          <TableCell>
                            <Badge className={getRiskBadgeColor(student.riskLevel)}>
                              {getRiskLabel(student.riskLevel)}
                            </Badge>
                          </TableCell>
                          <TableCell>{student.interventionsCount}</TableCell>
                          <TableCell>{formatDate(student.lastAssessmentDate)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 