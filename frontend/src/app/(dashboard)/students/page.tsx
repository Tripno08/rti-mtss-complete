'use client';

import { useState } from 'react';
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
import { Plus, Search } from 'lucide-react';

// Tipos
interface Student {
  id: string;
  name: string;
  grade: string;
  dateOfBirth: string;
  riskLevel: 'low' | 'medium' | 'high';
  interventionsCount: number;
  lastAssessmentDate: string;
  responsibleTeacher: string;
}

// Dados simulados
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'João Silva',
    grade: '3º Ano',
    dateOfBirth: '2015-03-15',
    riskLevel: 'high',
    interventionsCount: 3,
    lastAssessmentDate: '2024-02-15',
    responsibleTeacher: 'Maria Santos'
  },
  {
    id: '2',
    name: 'Ana Oliveira',
    grade: '2º Ano',
    dateOfBirth: '2016-07-22',
    riskLevel: 'medium',
    interventionsCount: 2,
    lastAssessmentDate: '2024-02-10',
    responsibleTeacher: 'Carlos Pereira'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    grade: '4º Ano',
    dateOfBirth: '2014-11-30',
    riskLevel: 'low',
    interventionsCount: 1,
    lastAssessmentDate: '2024-01-28',
    responsibleTeacher: 'Maria Santos'
  },
  {
    id: '4',
    name: 'Mariana Lima',
    grade: '3º Ano',
    dateOfBirth: '2015-09-10',
    riskLevel: 'high',
    interventionsCount: 4,
    lastAssessmentDate: '2024-02-18',
    responsibleTeacher: 'Paulo Ribeiro'
  },
  {
    id: '5',
    name: 'Lucas Ferreira',
    grade: '5º Ano',
    dateOfBirth: '2013-05-25',
    riskLevel: 'medium',
    interventionsCount: 2,
    lastAssessmentDate: '2024-02-05',
    responsibleTeacher: 'Carlos Pereira'
  }
];

export default function StudentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para obter a cor do badge de risco
  const getRiskBadgeColor = (risk: Student['riskLevel']) => {
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
  const getRiskLabel = (risk: Student['riskLevel']) => {
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
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.responsibleTeacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !gradeFilter || student.grade === gradeFilter;
    const matchesRisk = !riskFilter || student.riskLevel === riskFilter;
    return matchesSearch && matchesGrade && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estudantes</h1>
          <p className="text-muted-foreground">
            Gerencie os estudantes do sistema RTI/MTSS
          </p>
        </div>
        <Button onClick={() => router.push('/students/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Estudante
        </Button>
      </div>

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
                    placeholder="Buscar por nome ou professor..."
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
                    <SelectItem value="2º Ano">2º Ano</SelectItem>
                    <SelectItem value="3º Ano">3º Ano</SelectItem>
                    <SelectItem value="4º Ano">4º Ano</SelectItem>
                    <SelectItem value="5º Ano">5º Ano</SelectItem>
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
                    <TableHead>Professor Responsável</TableHead>
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
                      <TableCell>{student.responsibleTeacher}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 