import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface LearningDifficulty {
  name: string;
  value: number;
}

interface LearningDifficultiesChartProps {
  data: LearningDifficulty[] | null;
  isLoading: boolean;
}

const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884d8', '#82ca9d'];

export function LearningDifficultiesChart({ data, isLoading }: LearningDifficultiesChartProps) {
  if (isLoading) {
    return <Skeleton className="h-[250px] w-full" />;
  }

  if (!data || data.length === 0) {
    return <div className="flex h-[250px] items-center justify-center">Nenhum dado disponível</div>;
  }

  // Ordenar por valor (do maior para o menor)
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={sortedData}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {sortedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number, name: string) => [
            `${value} avaliações (${((value / sortedData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`, 
            name
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
} 