import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface HighRiskStudent {
  id: string;
  name: string;
  grade: string;
  responsibleTeacher: string;
  interventionsCount: number;
  latestAssessmentScore: number | string;
  riskFactors: string[];
}

interface HighRiskStudentsTableProps {
  data: HighRiskStudent[] | null;
  isLoading: boolean;
}

export function HighRiskStudentsTable({ data, isLoading }: HighRiskStudentsTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="py-4 text-center text-muted-foreground">Nenhum estudante de alto risco identificado</div>;
  }

  return (
    <div className="space-y-4">
      {data.slice(0, 5).map((student) => (
        <div key={student.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{student.name}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push(`/students/${student.id}`)}
            >
              Ver
            </Button>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Série: {student.grade} | Professor: {student.responsibleTeacher}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {student.riskFactors.map((factor, index) => (
              <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                {factor}
              </Badge>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Intervenções: </span>
              <span className="font-medium">{student.interventionsCount}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Última avaliação: </span>
              <span className="font-medium">{student.latestAssessmentScore}</span>
            </div>
          </div>
        </div>
      ))}
      {data.length > 5 && (
        <Button 
          variant="link" 
          className="w-full" 
          onClick={() => router.push('/reports/high-risk')}
        >
          Ver todos ({data.length})
        </Button>
      )}
    </div>
  );
} 