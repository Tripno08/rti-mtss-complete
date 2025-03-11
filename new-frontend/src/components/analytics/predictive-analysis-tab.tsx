'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import regression from 'regression';
import * as ss from 'simple-statistics';

// Tipos para os dados
interface Student {
  id: string;
  name: string;
  grade: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  predictedResponse: number;
  assessmentHistory: {
    date: string;
    score: number;
  }[];
}

interface PredictionModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastUpdated: string;
}

interface ProjectionPoint {
  month: number;
  actual: number | null;
  projected: number | null;
  label: string;
}

export default function PredictiveAnalysisTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('academic-risk');
  const [predictionModels, setPredictionModels] = useState<PredictionModel[]>([]);
  const [projectionData, setProjectionData] = useState<ProjectionPoint[]>([]);
  const [riskFactors, setRiskFactors] = useState<{factor: string, weight: number}[]>([]);

  useEffect(() => {
    // Simulando carregamento de dados
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulando uma chamada de API
        setTimeout(() => {
          // Dados simulados
          const mockStudents: Student[] = [
            {
              id: '1',
              name: 'João Silva',
              grade: '3º Ano',
              riskScore: 0.78,
              riskLevel: 'high',
              predictedResponse: 0.65,
              assessmentHistory: [
                { date: '2023-01-15', score: 65 },
                { date: '2023-02-15', score: 68 },
                { date: '2023-03-15', score: 70 },
                { date: '2023-04-15', score: 72 },
                { date: '2023-05-15', score: 71 },
              ]
            },
            {
              id: '2',
              name: 'Maria Santos',
              grade: '3º Ano',
              riskScore: 0.45,
              riskLevel: 'medium',
              predictedResponse: 0.82,
              assessmentHistory: [
                { date: '2023-01-15', score: 72 },
                { date: '2023-02-15', score: 75 },
                { date: '2023-03-15', score: 78 },
                { date: '2023-04-15', score: 80 },
                { date: '2023-05-15', score: 83 },
              ]
            },
            {
              id: '3',
              name: 'Pedro Oliveira',
              grade: '3º Ano',
              riskScore: 0.25,
              riskLevel: 'low',
              predictedResponse: 0.90,
              assessmentHistory: [
                { date: '2023-01-15', score: 85 },
                { date: '2023-02-15', score: 87 },
                { date: '2023-03-15', score: 86 },
                { date: '2023-04-15', score: 88 },
                { date: '2023-05-15', score: 90 },
              ]
            },
            {
              id: '4',
              name: 'Ana Pereira',
              grade: '3º Ano',
              riskScore: 0.65,
              riskLevel: 'high',
              predictedResponse: 0.70,
              assessmentHistory: [
                { date: '2023-01-15', score: 68 },
                { date: '2023-02-15', score: 70 },
                { date: '2023-03-15', score: 69 },
                { date: '2023-04-15', score: 71 },
                { date: '2023-05-15', score: 73 },
              ]
            },
            {
              id: '5',
              name: 'Lucas Mendes',
              grade: '3º Ano',
              riskScore: 0.35,
              riskLevel: 'medium',
              predictedResponse: 0.85,
              assessmentHistory: [
                { date: '2023-01-15', score: 78 },
                { date: '2023-02-15', score: 80 },
                { date: '2023-03-15', score: 82 },
                { date: '2023-04-15', score: 85 },
                { date: '2023-05-15', score: 87 },
              ]
            },
          ];

          const mockModels: PredictionModel[] = [
            {
              id: 'academic-risk',
              name: 'Modelo de Risco Acadêmico',
              description: 'Prevê o risco de falha acadêmica com base em histórico de avaliações e frequência.',
              accuracy: 0.85,
              lastUpdated: '2023-05-01'
            },
            {
              id: 'intervention-response',
              name: 'Modelo de Resposta a Intervenções',
              description: 'Prevê a probabilidade de resposta positiva a diferentes tipos de intervenção.',
              accuracy: 0.78,
              lastUpdated: '2023-04-15'
            },
            {
              id: 'learning-trajectory',
              name: 'Modelo de Trajetória de Aprendizado',
              description: 'Projeta a trajetória de aprendizado com base em tendências históricas.',
              accuracy: 0.82,
              lastUpdated: '2023-05-10'
            }
          ];

          const mockRiskFactors = [
            { factor: 'Baixo desempenho em avaliações recentes', weight: 0.35 },
            { factor: 'Frequência escolar abaixo de 85%', weight: 0.25 },
            { factor: 'Histórico de dificuldades em leitura', weight: 0.20 },
            { factor: 'Falta de participação em sala de aula', weight: 0.15 },
            { factor: 'Mudanças recentes na situação familiar', weight: 0.05 }
          ];

          setStudents(mockStudents);
          setPredictionModels(mockModels);
          setRiskFactors(mockRiskFactors);
          setSelectedStudent(mockStudents[0].id);
          
          // Gerar projeção para o primeiro estudante
          generateProjection(mockStudents[0]);
          
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Função para gerar projeção de aprendizado
  const generateProjection = (student: Student) => {
    // Converter histórico para formato de regressão
    const regressionData = student.assessmentHistory.map((assessment, index) => [index, assessment.score]);
    
    // Calcular linha de regressão
    const result = regression.linear(regressionData);
    const gradient = result.equation[0];
    const yIntercept = result.equation[1];
    
    // Gerar dados de projeção para os próximos 3 meses
    const projectionPoints = [];
    
    // Adicionar pontos históricos
    for (let i = 0; i < student.assessmentHistory.length; i++) {
      projectionPoints.push({
        month: i,
        actual: student.assessmentHistory[i].score,
        projected: null,
        label: new Date(student.assessmentHistory[i].date).toLocaleDateString('pt-BR', { month: 'short' })
      });
    }
    
    // Adicionar pontos projetados
    for (let i = student.assessmentHistory.length; i < student.assessmentHistory.length + 3; i++) {
      const projectedValue = gradient * i + yIntercept;
      projectionPoints.push({
        month: i,
        actual: null,
        projected: projectedValue,
        label: `P${i - student.assessmentHistory.length + 1}`
      });
    }
    
    setProjectionData(projectionPoints);
  };

  // Função para calcular o intervalo de confiança
  const calculateConfidenceInterval = (data: number[]) => {
    const mean = ss.mean(data);
    const stdDev = ss.standardDeviation(data);
    const n = data.length;
    const marginOfError = 1.96 * (stdDev / Math.sqrt(n));
    
    return {
      lower: mean - marginOfError,
      upper: mean + marginOfError
    };
  };

  // Função para lidar com a mudança de estudante selecionado
  const handleStudentChange = (studentId: string) => {
    setSelectedStudent(studentId);
    const student = students.find(s => s.id === studentId);
    if (student) {
      generateProjection(student);
    }
  };

  // Função para obter a cor com base no nível de risco
  const getRiskColor = (riskLevel: 'low' | 'medium' | 'high') => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para formatar o percentual
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/2">
          <Select value={selectedStudent || ''} onValueChange={handleStudentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um estudante" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.grade})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um modelo preditivo" />
            </SelectTrigger>
            <SelectContent>
              {predictionModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name} (Precisão: {(model.accuracy * 100).toFixed(0)}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedStudentData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pontuação de Risco</CardTitle>
                <CardDescription>
                  Probabilidade de falha acadêmica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={selectedStudentData.riskLevel === 'high' ? '#ef4444' : selectedStudentData.riskLevel === 'medium' ? '#f59e0b' : '#22c55e'}
                        strokeWidth="10"
                        strokeDasharray={`${selectedStudentData.riskScore * 283} 283`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {formatPercent(selectedStudentData.riskScore)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(selectedStudentData.riskLevel)}`}>
                    {selectedStudentData.riskLevel === 'high' ? 'Alto Risco' : selectedStudentData.riskLevel === 'medium' ? 'Risco Médio' : 'Baixo Risco'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resposta Prevista</CardTitle>
                <CardDescription>
                  Probabilidade de resposta à intervenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={selectedStudentData.predictedResponse > 0.8 ? '#22c55e' : selectedStudentData.predictedResponse > 0.6 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="10"
                        strokeDasharray={`${selectedStudentData.predictedResponse * 283} 283`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {formatPercent(selectedStudentData.predictedResponse)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedStudentData.predictedResponse > 0.8 ? 'bg-green-100 text-green-800' : selectedStudentData.predictedResponse > 0.6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedStudentData.predictedResponse > 0.8 ? 'Alta Resposta' : selectedStudentData.predictedResponse > 0.6 ? 'Resposta Média' : 'Baixa Resposta'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Fatores de Risco</CardTitle>
                <CardDescription>
                  Principais fatores que contribuem para o risco
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {riskFactors.map((factor, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm truncate">{factor.factor}</span>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${factor.weight * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatPercent(factor.weight)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Projeção de Trajetória de Aprendizado</CardTitle>
              <CardDescription>
                Baseado no histórico de avaliações e tendências atuais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={projectionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={70} stroke="#ff0000" strokeDasharray="3 3" label="Mínimo Esperado" />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="Pontuação Real"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="projected"
                      name="Pontuação Projetada"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Interpretação da Projeção</AlertTitle>
                <AlertDescription>
                  Esta projeção é baseada em um modelo de regressão linear aplicado ao histórico de avaliações do estudante. 
                  Os pontos marcados com "P" representam valores projetados para os próximos 3 meses.
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline">Exportar Análise</Button>
            <Button>Gerar Plano de Intervenção</Button>
          </div>
        </>
      )}
    </div>
  );
} 