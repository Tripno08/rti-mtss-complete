import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-stroke bg-white p-5 shadow-sm dark:border-stroke-dark dark:bg-gray-dark",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="mt-1 text-2xl font-bold text-innerview-secondary dark:text-white">{value}</p>
          
          {trend && (
            <div className="mt-1 flex items-center">
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              {description && (
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                  {description}
                </span>
              )}
            </div>
          )}
          
          {!trend && description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-innerview-light dark:bg-innerview-dark/10">
          <Icon className="h-6 w-6 text-innerview-primary" />
        </div>
      </div>
    </div>
  );
} 