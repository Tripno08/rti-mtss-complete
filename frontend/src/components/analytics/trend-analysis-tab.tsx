'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  ReferenceLine
} from 'recharts';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos para os dados
interface TrendData {
  date: string;
  readingScore: number;
  mathScore: number;
  behaviorScore: number;
  attendanceRate: number;
}

interface SeasonalityData {
  month: string;
  readingScore: number;
  mathScore: number;
  behaviorScore: number;
  attendanceRate: number;
}

interface SignificantChange {
  metric: string;
  date: string;
  previousValue: number;
  newValue: number;
  percentChange: number;
  isPositive: boolean;
}

export default function TrendAnalysisTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [seasonalityData, setSeasonalityData] = useState<SeasonalityData[]>([]);
  const [significantChanges, setSignificantChanges] = useState<SignificantChange[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('readingScore');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('6m');

  useEffect(() => {
    // Simulando carregamento de dados
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulando uma chamada de API
        setTimeout(() => {
          // Gerar dados de tendência para os últimos 12 meses
          const now = new Date();
          const mockTrendData: TrendData[] = [];
          
          for (let i = 11; i >= 0; i--) {
            const date = subMonths(now, i);
            const formattedDate = format(date, 'yyyy-MM-dd');
            const monthName = format(date, 'MMM', { locale: ptBR });
            
            // Simular tendência crescente com alguma variação
            const baseReadingScore = 70 + (11 - i) * 1.5 + (Math.random() * 5 - 2.5);
            const baseMathScore = 65 + (11 - i) * 1.8 + (Math.random() * 5 - 2.5);
            const baseBehaviorScore = 75 + (11 - i) * 1.2 + (Math.random() * 5 - 2.5);
            
            // Simular sazonalidade na taxa de frequência (menor nos meses de férias)
            let attendanceRate = 0.92 + (Math.random() * 0.05 - 0.025);
            if (monthName === 'dez' || monthName === 'jan' || monthName === 'jul') {
              attendanceRate -= 0.08;
            }
            
            mockTrendData.push({
              date: formattedDate,
              readingScore: Math.min(100, Math.max(0, baseReadingScore)),
              mathScore: Math.min(100, Math.max(0, baseMathScore)),
              behaviorScore: Math.min(100, Math.max(0, baseBehaviorScore)),
              attendanceRate: Math.min(1, Math.max(0, attendanceRate))
            });
          }
          
          // Gerar dados de sazonalidade por mês
          const mockSeasonalityData: SeasonalityData[] = [
            { month: 'Jan', readingScore: 72, mathScore: 68, behaviorScore: 76, attendanceRate: 0.85 },
            { month: 'Fev', readingScore: 74, mathScore: 70, behaviorScore: 78, attendanceRate: 0.92 },
            { month: 'Mar', readingScore: 76, mathScore: 73, behaviorScore: 80, attendanceRate: 0.94 },
            { month: 'Abr', readingScore: 78, mathScore: 75, behaviorScore: 82, attendanceRate: 0.93 },
            { month: 'Mai', readingScore: 80, mathScore: 77, behaviorScore: 83, attendanceRate: 0.92 },
            { month: 'Jun', readingScore: 81, mathScore: 78, behaviorScore: 84, attendanceRate: 0.90 },
            { month: 'Jul', readingScore: 79, mathScore: 76, behaviorScore: 82, attendanceRate: 0.86 },
            { month: 'Ago', readingScore: 82, mathScore: 79, behaviorScore: 85, attendanceRate: 0.93 },
            { month: 'Set', readingScore: 84, mathScore: 81, behaviorScore: 86, attendanceRate: 0.95 },
            { month: 'Out', readingScore: 85, mathScore: 83, behaviorScore: 87, attendanceRate: 0.94 },
            { month: 'Nov', readingScore: 86, mathScore: 84, behaviorScore: 88, attendanceRate: 0.93 },
            { month: 'Dez', readingScore: 83, mathScore: 80, behaviorScore: 85, attendanceRate: 0.87 }
          ];
          
          // Gerar mudanças significativas
          const mockSignificantChanges: SignificantChange[] = [
            {
              metric: 'Pontuação em Leitura',
              date: '2023-09-15',
              previousValue: 78,
              newValue: 84,
              percentChange: 7.7,
              isPositive: true
            },
            {
              metric: 'Pontuação em Matemática',
              date: '2023-08-10',
              previousValue: 75,
              newValue: 79,
              percentChange: 5.3,
              isPositive: true
            },
            {
              metric: 'Taxa de Frequência',
              date: '2023-07-05',
              previousValue: 0.92,
              newValue: 0.86,
              percentChange: -6.5,
              isPositive: false
            },
            {
              metric: 'Comportamento',
              date: '2023-10-20',
              previousValue: 82,
              newValue: 87,
              percentChange: 6.1,
              isPositive: true
            }
          ];
          
          setTrendData(mockTrendData);
          setSeasonalityData(mockSeasonalityData);
          setSignificantChanges(mockSignificantChanges);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Função para formatar datas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM yyyy', { locale: ptBR });
  };

  // Função para formatar percentuais
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  // Função para obter o rótulo da métrica selecionada
  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'readingScore':
        return 'Pontuação em Leitura';
      case 'mathScore':
        return 'Pontuação em Matemática';
      case 'behaviorScore':
        return 'Comportamento';
      case 'attendanceRate':
        return 'Taxa de Frequência';
      default:
        return metric;
    }
  };

  // Função para filtrar dados por período de tempo
  const getFilteredTrendData = () => {
    if (selectedTimeframe === 'all') {
      return trendData;
    }
    
    const months = parseInt(selectedTimeframe.replace('m', ''));
    return trendData.slice(-months);
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
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma métrica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="readingScore">Pontuação em Leitura</SelectItem>
              <SelectItem value="mathScore">Pontuação em Matemática</SelectItem>
              <SelectItem value="behaviorScore">Comportamento</SelectItem>
              <SelectItem value="attendanceRate">Taxa de Frequência</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="12m">Últimos 12 meses</SelectItem>
              <SelectItem value="all">Todo o período</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="progress">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">Progresso ao Longo do Tempo</TabsTrigger>
          <TabsTrigger value="seasonality">Sazonalidade</TabsTrigger>
          <TabsTrigger value="changes">Mudanças Significativas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso ao Longo do Tempo</CardTitle>
              <CardDescription>
                Evolução de {getMetricLabel(selectedMetric)} nos últimos {selectedTimeframe === 'all' ? trendData.length : selectedTimeframe} meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getFilteredTrendData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                    />
                    <YAxis 
                      domain={selectedMetric === 'attendanceRate' ? [0.7, 1] : [0, 100]}
                      tickFormatter={selectedMetric === 'attendanceRate' ? formatPercent : undefined}
                    />
                    <Tooltip 
                      labelFormatter={formatDate}
                      formatter={(value: number) => [
                        selectedMetric === 'attendanceRate' ? formatPercent(value) : value,
                        getMetricLabel(selectedMetric)
                      ]}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      name={getMetricLabel(selectedMetric)}
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                    <ReferenceLine 
                      y={selectedMetric === 'attendanceRate' ? 0.9 : 70} 
                      stroke="red" 
                      strokeDasharray="3 3" 
                      label="Meta" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {['readingScore', 'mathScore', 'behaviorScore', 'attendanceRate'].map((metric) => {
              const filteredData = getFilteredTrendData();
              const firstValue = filteredData[0][metric as keyof TrendData] as number;
              const lastValue = filteredData[filteredData.length - 1][metric as keyof TrendData] as number;
              const change = lastValue - firstValue;
              const percentChange = (change / firstValue) * 100;
              
              return (
                <Card key={metric}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{getMetricLabel(metric)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {metric === 'attendanceRate' ? formatPercent(lastValue) : lastValue.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Valor atual
                        </p>
                      </div>
                      <div className={`text-sm font-medium ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="seasonality" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Sazonalidade</CardTitle>
              <CardDescription>
                Padrões sazonais em {getMetricLabel(selectedMetric)} ao longo do ano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={seasonalityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      domain={selectedMetric === 'attendanceRate' ? [0.7, 1] : [0, 100]}
                      tickFormatter={selectedMetric === 'attendanceRate' ? formatPercent : undefined}
                    />
                    <Tooltip 
                      formatter={(value: number) => [
                        selectedMetric === 'attendanceRate' ? formatPercent(value) : value,
                        getMetricLabel(selectedMetric)
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey={selectedMetric} 
                      name={getMetricLabel(selectedMetric)}
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h4 className="font-medium mb-2">Análise de Sazonalidade</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedMetric === 'attendanceRate' 
                    ? 'Observa-se uma queda na frequência durante os meses de férias (janeiro, julho e dezembro), com recuperação nos meses seguintes.'
                    : 'Observa-se um padrão de crescimento contínuo durante o ano letivo, com pequenas quedas após períodos de férias, seguidas de recuperação.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="changes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mudanças Significativas</CardTitle>
              <CardDescription>
                Detecção de alterações importantes nas métricas monitoradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={significantChanges}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[-10, 10]} />
                    <YAxis dataKey="metric" type="category" />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Variação Percentual']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="percentChange" 
                      name="Variação Percentual" 
                      fill="#8884d8"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-4">
                {significantChanges.map((change, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{change.metric}</h4>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${change.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {change.isPositive ? '+' : ''}{change.percentChange.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Mudança detectada em {new Date(change.date).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="flex justify-between mt-2 text-sm">
                      <span>Valor anterior: {change.metric === 'Taxa de Frequência' ? formatPercent(change.previousValue) : change.previousValue}</span>
                      <span>Novo valor: {change.metric === 'Taxa de Frequência' ? formatPercent(change.newValue) : change.newValue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 