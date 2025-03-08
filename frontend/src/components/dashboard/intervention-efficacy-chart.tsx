import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface InterventionEfficacyData {
  type: string;
  count: number;
  averageImprovement: number;
  preInterventionAvg: number;
  postInterventionAvg: number;
}

interface InterventionEfficacyChartProps {
  data: InterventionEfficacyData[] | null;
  isLoading: boolean;
}

export function InterventionEfficacyChart({ data, isLoading }: InterventionEfficacyChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!data || data.length === 0) {
    return <div className="flex h-[400px] items-center justify-center">Nenhum dado disponível</div>;
  }

  // Transformar os dados para o formato adequado para o gráfico
  const chartData = data.map(item => ({
    name: item.type,
    'Antes da Intervenção': parseFloat(item.preInterventionAvg.toFixed(2)),
    'Depois da Intervenção': parseFloat(item.postInterventionAvg.toFixed(2)),
    'Melhoria Média': parseFloat(item.averageImprovement.toFixed(2)),
  }));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Antes da Intervenção" fill="#8884d8" />
          <Bar dataKey="Depois da Intervenção" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium">Resumo da Eficácia</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((item) => (
            <div key={item.type} className="rounded-lg border p-3">
              <div className="font-medium">{item.type}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {item.count} intervenções analisadas
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Antes: </span>
                  <span className="font-medium">{item.preInterventionAvg.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Depois: </span>
                  <span className="font-medium">{item.postInterventionAvg.toFixed(2)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Melhoria: </span>
                  <span className={`font-medium ${item.averageImprovement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.averageImprovement > 0 ? '+' : ''}{item.averageImprovement.toFixed(2)} pontos
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 