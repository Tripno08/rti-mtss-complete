'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts';

// Tipos para os dados
interface InterventionType {
  id: string;
  name: string;
}

interface InterventionEffectiveness {
  interventionType: string;
  averageGrowth: number;
  successRate: number;
  implementationRate: number;
  costEffectiveness: number;
  studentSatisfaction: number;
}

interface GapAnalysis {
  category: string;
  group1Value: number;
  group2Value: number;
  gap: number;
}

interface BenchmarkData {
  category: string;
  schoolValue: number;
  districtAverage: number;
  stateAverage: number;
}

export default function ComparativeAnalysisTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [interventionTypes, setInterventionTypes] = useState<InterventionType[]>([]);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [effectivenessData, setEffectivenessData] = useState<InterventionEffectiveness[]>([]);
  const [gapData, setGapData] = useState<GapAnalysis[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [comparisonType, setComparisonType] = useState<'effectiveness' | 'gaps' | 'benchmarks'>('effectiveness');

  useEffect(() => {
    // Simulando carregamento de dados
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulando uma chamada de API
        setTimeout(() => {
          // Dados simulados
          const mockInterventionTypes: InterventionType[] = [
            { id: 'phonics', name: 'Intervenção Fonológica' },
            { id: 'fluency', name: 'Fluência de Leitura' },
            { id: 'comprehension', name: 'Compreensão de Texto' },
            { id: 'math-concepts', name: 'Conceitos Matemáticos' },
            { id: 'behavior', name: 'Intervenção Comportamental' }
          ];

          const mockEffectivenessData: InterventionEffectiveness[] = [
            { 
              interventionType: 'Intervenção Fonológica', 
              averageGrowth: 12.5, 
              successRate: 0.78, 
              implementationRate: 0.85,
              costEffectiveness: 0.72,
              studentSatisfaction: 0.65
            },
            { 
              interventionType: 'Fluência de Leitura', 
              averageGrowth: 10.2, 
              successRate: 0.82, 
              implementationRate: 0.90,
              costEffectiveness: 0.80,
              studentSatisfaction: 0.75
            },
            { 
              interventionType: 'Compreensão de Texto', 
              averageGrowth: 8.7, 
              successRate: 0.75, 
              implementationRate: 0.82,
              costEffectiveness: 0.68,
              studentSatisfaction: 0.70
            },
            { 
              interventionType: 'Conceitos Matemáticos', 
              averageGrowth: 11.3, 
              successRate: 0.80, 
              implementationRate: 0.78,
              costEffectiveness: 0.75,
              studentSatisfaction: 0.68
            },
            { 
              interventionType: 'Intervenção Comportamental', 
              averageGrowth: 7.5, 
              successRate: 0.65, 
              implementationRate: 0.70,
              costEffectiveness: 0.60,
              studentSatisfaction: 0.72
            }
          ];

          const mockGapData: GapAnalysis[] = [
            { category: 'Leitura', group1Value: 78, group2Value: 65, gap: 13 },
            { category: 'Matemática', group1Value: 82, group2Value: 68, gap: 14 },
            { category: 'Escrita', group1Value: 75, group2Value: 62, gap: 13 },
            { category: 'Ciências', group1Value: 80, group2Value: 70, gap: 10 },
            { category: 'Estudos Sociais', group1Value: 76, group2Value: 64, gap: 12 }
          ];

          const mockBenchmarkData: BenchmarkData[] = [
            { category: 'Leitura', schoolValue: 78, districtAverage: 72, stateAverage: 70 },
            { category: 'Matemática', schoolValue: 82, districtAverage: 75, stateAverage: 73 },
            { category: 'Escrita', schoolValue: 75, districtAverage: 70, stateAverage: 68 },
            { category: 'Ciências', schoolValue: 80, districtAverage: 76, stateAverage: 74 },
            { category: 'Estudos Sociais', schoolValue: 76, districtAverage: 72, stateAverage: 70 }
          ];

          setInterventionTypes(mockInterventionTypes);
          setEffectivenessData(mockEffectivenessData);
          setGapData(mockGapData);
          setBenchmarkData(mockBenchmarkData);
          setSelectedInterventions(['phonics', 'fluency', 'comprehension']);
          
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Função para obter dados de eficácia filtrados
  const getFilteredEffectivenessData = () => {
    const selectedInterventionNames = interventionTypes
      .filter(type => selectedInterventions.includes(type.id))
      .map(type => type.name);
    
    return effectivenessData.filter(item => 
      selectedInterventionNames.includes(item.interventionType)
    );
  };

  // Função para transformar dados para o gráfico de radar
  const getRadarData = () => {
    const filtered = getFilteredEffectivenessData();
    
    return filtered.map(item => ({
      interventionType: item.interventionType,
      'Taxa de Sucesso': item.successRate * 100,
      'Taxa de Implementação': item.implementationRate * 100,
      'Custo-Benefício': item.costEffectiveness * 100,
      'Satisfação do Estudante': item.studentSatisfaction * 100
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        
        <Skeleton className="h-[400px] w-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/2">
          <Select value={comparisonType} onValueChange={(value: 'effectiveness' | 'gaps' | 'benchmarks') => setComparisonType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de comparação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="effectiveness">Eficácia de Intervenções</SelectItem>
              <SelectItem value="gaps">Análise de Gaps</SelectItem>
              <SelectItem value="benchmarks">Benchmarking</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {comparisonType === 'effectiveness' && (
          <div className="w-full md:w-1/2 flex gap-2">
            {interventionTypes.map(type => (
              <Button
                key={type.id}
                variant={selectedInterventions.includes(type.id) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (selectedInterventions.includes(type.id)) {
                    setSelectedInterventions(selectedInterventions.filter(id => id !== type.id));
                  } else {
                    setSelectedInterventions([...selectedInterventions, type.id]);
                  }
                }}
              >
                {type.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      {comparisonType === 'effectiveness' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Eficácia de Intervenções</CardTitle>
              <CardDescription>
                Crescimento médio em pontos por tipo de intervenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getFilteredEffectivenessData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="interventionType" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} pontos`, 'Crescimento Médio']} />
                    <Legend />
                    <Bar dataKey="averageGrowth" name="Crescimento Médio (pontos)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise Multidimensional</CardTitle>
                <CardDescription>
                  Comparação de múltiplos fatores por intervenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={getRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="interventionType" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Taxa de Sucesso" dataKey="Taxa de Sucesso" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Taxa de Implementação" dataKey="Taxa de Implementação" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Radar name="Custo-Benefício" dataKey="Custo-Benefício" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                      <Radar name="Satisfação do Estudante" dataKey="Satisfação do Estudante" stroke="#ff8042" fill="#ff8042" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxas de Sucesso</CardTitle>
                <CardDescription>
                  Percentual de estudantes que atingiram as metas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getFilteredEffectivenessData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="interventionType" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                      <Legend />
                      <Bar dataKey="successRate" name="Taxa de Sucesso" fill="#8884d8" stackId="a" barSize={20}>
                        {getFilteredEffectivenessData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#8884d8" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {comparisonType === 'gaps' && (
        <Card>
          <CardHeader>
            <CardTitle>Análise de Gaps de Aprendizado</CardTitle>
            <CardDescription>
              Comparação entre grupos de estudantes por área de conhecimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gapData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="group1Value" name="Grupo 1 (Sem Intervenção)" fill="#8884d8" />
                  <Bar dataKey="group2Value" name="Grupo 2 (Com Intervenção)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              {gapData.map((item, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg text-center">
                  <h4 className="font-medium text-sm">{item.category}</h4>
                  <p className="text-2xl font-bold text-primary">{item.gap}</p>
                  <p className="text-xs text-muted-foreground">pontos de diferença</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {comparisonType === 'benchmarks' && (
        <Card>
          <CardHeader>
            <CardTitle>Benchmarking de Performance</CardTitle>
            <CardDescription>
              Comparação com médias do distrito e do estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={benchmarkData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="schoolValue" name="Nossa Escola" fill="#8884d8" />
                  <Bar dataKey="districtAverage" name="Média do Distrito" fill="#82ca9d" />
                  <Bar dataKey="stateAverage" name="Média do Estado" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Análise de Desempenho</h4>
              <p className="text-sm text-muted-foreground">
                Nossa escola está superando as médias do distrito e do estado em todas as áreas avaliadas. 
                O maior diferencial está na área de Matemática, onde estamos 9 pontos acima da média estadual.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 