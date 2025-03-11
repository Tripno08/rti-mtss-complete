import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  description?: string;
  className?: string;
  action?: ReactNode;
}

export function ChartCard({
  title,
  children,
  description,
  className,
  action,
}: ChartCardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-stroke bg-white p-5 shadow-sm dark:border-stroke-dark dark:bg-gray-dark",
      className
    )}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-innerview-secondary dark:text-white">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        
        {action && (
          <div>
            {action}
          </div>
        )}
      </div>
      
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  );
} 