'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Users,
  BookOpen,
  BrainCircuit,
  BarChart3,
  Download,
  FileDown,
} from 'lucide-react';

// Tipos
interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const reportTypes: ReportType[] = [
  {
    id: 'students',
    title: 'Relatório de Estudantes',
    description: 'Lista completa de estudantes com detalhes de progresso e risco',
    icon: <Users className="h-5 w-5" />,
    href: '/reports/students',
  },
  {
    id: 'assessments',
    title: 'Relatório de Avaliações',
    description: 'Resumo das avaliações realizadas e resultados obtidos',
    icon: <BookOpen className="h-5 w-5" />,
    href: '/reports/assessments',
  },
  {
    id: 'interventions',
    title: 'Relatório de Intervenções',
    description: 'Análise detalhada das intervenções e sua eficácia',
    icon: <BrainCircuit className="h-5 w-5" />,
    href: '/reports/interventions',
  },
  {
    id: 'progress',
    title: 'Relatório de Progresso',
    description: 'Visão geral do progresso dos estudantes ao longo do tempo',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/reports/progress',
  },
];

export default function ReportsPage() {
  const router = useRouter();
  const [reportType, setReportType] = useState('');
  const [format, setFormat] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!reportType || !format) {
      toast.error('Selecione o tipo de relatório e o formato');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implementar a chamada real à API
      console.log('Gerando relatório:', { reportType, format });
      
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportTypeName = (id: string) => {
    switch (id) {
      case 'students':
        return 'Estudantes';
      case 'assessments':
        return 'Avaliações';
      case 'interventions':
        return 'Intervenções';
      case 'progress':
        return 'Progresso';
      default:
        return id;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Gere e exporte relatórios do sistema RTI/MTSS
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {type.icon}
                  {type.title}
                </CardTitle>
                <Button variant="outline" onClick={() => router.push(type.href)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
              </div>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exportar Dados</CardTitle>
          <CardDescription>
            Selecione o tipo de relatório e o formato para exportação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {getReportTypeName(type.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="sm:w-auto w-full"
              onClick={handleGenerateReport} 
              disabled={isGenerating || !reportType || !format}
            >
              {isGenerating ? (
                <>
                  <FileDown className="mr-2 h-4 w-4 animate-bounce" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 