'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Info, Users, Target, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RtiTierData {
  id: string;
  name: string;
  value: number;
  color: string;
  description: string;
  interventionTypes: string[];
  characteristics: string[];
  students: {
    id: string;
    name: string;
    grade: string;
    riskLevel: 'high' | 'medium' | 'low';
    interventionsCount: number;
  }[];
}

interface RtiPyramidChartProps {
  data: RtiTierData[] | null;
  isLoading?: boolean;
  showDetails?: boolean;
  onViewStudents?: (tierId: string) => void;
  className?: string;
}

const defaultData: RtiTierData[] = [
  {
    id: 'tier3',
    name: 'Tier 3',
    value: 15,
    color: '#FF4560',
    description: 'Intervenções intensivas e individualizadas para estudantes com necessidades significativas',
    interventionTypes: [
      'Intervenções individualizadas',
      'Monitoramento diário ou semanal',
      'Serviços especializados',
      'Planos de intervenção personalizados'
    ],
    characteristics: [
      'Intensidade alta',
      'Frequência diária',
      'Duração prolongada',
      'Implementação por especialistas'
    ],
    students: [
      { id: '1', name: 'João Silva', grade: '3º Ano', riskLevel: 'high', interventionsCount: 3 },
      { id: '2', name: 'Ana Pereira', grade: '4º Ano', riskLevel: 'high', interventionsCount: 2 },
      { id: '3', name: 'Lucas Mendes', grade: '2º Ano', riskLevel: 'high', interventionsCount: 4 }
    ]
  },
  {
    id: 'tier2',
    name: 'Tier 2',
    value: 35,
    color: '#FFAB00',
    description: 'Intervenções direcionadas para estudantes que não respondem adequadamente ao Tier 1',
    interventionTypes: [
      'Intervenções em pequenos grupos',
      'Monitoramento semanal ou quinzenal',
      'Estratégias específicas para dificuldades identificadas',
      'Suporte adicional ao currículo principal'
    ],
    characteristics: [
      'Intensidade moderada',
      'Frequência 3-4 vezes por semana',
      'Duração de 10-15 semanas',
      'Implementação por professores treinados'
    ],
    students: [
      { id: '4', name: 'Mariana Souza', grade: '5º Ano', riskLevel: 'medium', interventionsCount: 2 },
      { id: '5', name: 'Gabriel Santos', grade: '3º Ano', riskLevel: 'medium', interventionsCount: 1 },
      { id: '6', name: 'Juliana Lima', grade: '4º Ano', riskLevel: 'medium', interventionsCount: 2 }
    ]
  },
  {
    id: 'tier1',
    name: 'Tier 1',
    value: 80,
    color: '#00E396',
    description: 'Ensino de alta qualidade para todos os estudantes na sala de aula regular',
    interventionTypes: [
      'Currículo principal',
      'Práticas baseadas em evidências',
      'Diferenciação de ensino',
      'Avaliações universais'
    ],
    characteristics: [
      'Disponível para todos os estudantes',
      'Implementação em sala de aula regular',
      'Monitoramento trimestral',
      'Foco em prevenção'
    ],
    students: [
      { id: '7', name: 'Pedro Costa', grade: '2º Ano', riskLevel: 'low', interventionsCount: 0 },
      { id: '8', name: 'Carla Rodrigues', grade: '5º Ano', riskLevel: 'low', interventionsCount: 0 },
      { id: '9', name: 'Rafael Oliveira', grade: '3º Ano', riskLevel: 'low', interventionsCount: 1 }
    ]
  }
];

export function RtiPyramidChart({ 
  data = null, 
  isLoading = false, 
  showDetails = true,
  onViewStudents,
  className
}: RtiPyramidChartProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const chartData = data || defaultData;
  
  // Ordenar os dados para que Tier 3 fique no topo da pirâmide
  const sortedData = [...chartData].sort((a, b) => {
    const tierOrder = { 'Tier 3': 1, 'Tier 2': 2, 'Tier 1': 3 };
    return tierOrder[a.name as keyof typeof tierOrder] - tierOrder[b.name as keyof typeof tierOrder];
  });

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full" />;
  }

  const handleTierClick = (tier: RtiTierData) => {
    setSelectedTier(selectedTier === tier.id ? null : tier.id);
  };

  const selectedTierData = selectedTier 
    ? chartData.find(tier => tier.id === selectedTier) 
    : null;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Distribuição Innerview</CardTitle>
              <CardDescription>
                Visualização da distribuição de estudantes por tier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    onClick={(data) => handleTierClick(data)}
                  >
                    {chartData.map((entry) => (
                      <Cell 
                        key={`cell-${entry.id}`} 
                        fill={entry.color} 
                        stroke={selectedTier === entry.id ? '#000' : 'none'}
                        strokeWidth={selectedTier === entry.id ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} estudantes`, 'Quantidade']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Pirâmide Innerview</CardTitle>
              <CardDescription>
                Visualização da pirâmide de suporte multi-nível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={cn("flex flex-col items-center space-y-4", className)}>
                {sortedData.map((tier, index) => (
                  <div 
                    key={tier.id}
                    className={cn(
                      `
                        w-full 
                        py-4 
                        flex 
                        items-center 
                        justify-center 
                        text-white 
                        font-bold 
                        rounded-md
                        cursor-pointer
                        transition-all
                        ${selectedTier === tier.id ? 'ring-2 ring-black' : ''}
                      `,
                      {
                        'w-full': index === 0,
                        'w-4/5': index === 1,
                        'w-3/5': index === 2
                      }
                    )}
                    style={{ 
                      backgroundColor: tier.color,
                    }}
                    onClick={() => handleTierClick(tier)}
                  >
                    <div className="flex items-center gap-2">
                      {tier.name} 
                      <Badge variant="outline" className="bg-white/20 text-white">
                        {tier.value} estudantes
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showDetails && selectedTierData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: selectedTierData.color }}
                  ></div>
                  {selectedTierData.name}
                </CardTitle>
                <CardDescription>{selectedTierData.description}</CardDescription>
              </div>
              {onViewStudents && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewStudents(selectedTierData.id)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Ver Estudantes
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="characteristics">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="characteristics">Características</TabsTrigger>
                <TabsTrigger value="interventions">Intervenções</TabsTrigger>
                <TabsTrigger value="students">Estudantes</TabsTrigger>
              </TabsList>
              <TabsContent value="characteristics" className="mt-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Características do {selectedTierData.name}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedTierData.characteristics.map((item, index) => (
                      <li key={index} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="interventions" className="mt-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Tipos de Intervenções</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedTierData.interventionTypes.map((item, index) => (
                      <li key={index} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="students" className="mt-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Exemplos de Estudantes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {selectedTierData.students.map((student) => (
                      <Card key={student.id} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="space-y-1">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-gray-500">{student.grade}</div>
                            <div className="flex items-center justify-between mt-2">
                              <Badge 
                                variant="outline"
                                className={`
                                  ${student.riskLevel === 'high' ? 'bg-red-100 text-red-800' : ''}
                                  ${student.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${student.riskLevel === 'low' ? 'bg-green-100 text-green-800' : ''}
                                `}
                              >
                                {student.riskLevel === 'high' ? 'Alto Risco' : ''}
                                {student.riskLevel === 'medium' ? 'Médio Risco' : ''}
                                {student.riskLevel === 'low' ? 'Baixo Risco' : ''}
                              </Badge>
                              <div className="text-xs">
                                {student.interventionsCount} intervenções
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 