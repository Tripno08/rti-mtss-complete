import { Skeleton } from '@/components/ui/skeleton';

interface Activity {
  id: string;
  date: string;
  type: 'assessment' | 'intervention';
  title: string;
  studentName: string;
  details: string;
}

interface RecentActivitiesTimelineProps {
  data: Activity[] | null;
  isLoading: boolean;
}

export function RecentActivitiesTimeline({ data, isLoading }: RecentActivitiesTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="py-4 text-center text-muted-foreground">Nenhuma atividade recente</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {data.map((activity) => (
        <div key={activity.id} className="flex">
          <div className="mr-4 flex flex-col items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              activity.type === 'assessment' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
            }`}>
              {activity.type === 'assessment' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              )}
            </div>
            <div className="h-full w-0.5 bg-border"></div>
          </div>
          <div className="pb-8">
            <div className="text-sm text-muted-foreground">
              {formatDate(activity.date)}
            </div>
            <div className="font-medium">{activity.title}</div>
            <div className="mt-1 text-sm">
              Aluno: {activity.studentName}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {activity.details}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 