declare module '@/components/analytics/predictive-analysis-tab' {
  const PredictiveAnalysisTab: React.ComponentType;
  export default PredictiveAnalysisTab;
}

declare module '@/components/analytics/comparative-analysis-tab' {
  const ComparativeAnalysisTab: React.ComponentType;
  export default ComparativeAnalysisTab;
}

declare module '@/components/analytics/trend-analysis-tab' {
  const TrendAnalysisTab: React.ComponentType;
  export default TrendAnalysisTab;
}

declare module '@/components/analytics/recommendations-tab' {
  const RecommendationsTab: React.ComponentType;
  export default RecommendationsTab;
}

declare module 'regression' {
  interface RegressionResult {
    equation: number[];
    points: number[][];
    string: string;
    r2?: number;
  }

  interface RegressionOptions {
    precision?: number;
    order?: number;
  }

  interface RegressionLib {
    linear(data: number[][], options?: RegressionOptions): RegressionResult;
    exponential(data: number[][], options?: RegressionOptions): RegressionResult;
    logarithmic(data: number[][], options?: RegressionOptions): RegressionResult;
    power(data: number[][], options?: RegressionOptions): RegressionResult;
    polynomial(data: number[][], options?: RegressionOptions & { order: number }): RegressionResult;
  }

  const regression: RegressionLib;
  export default regression;
}

interface School {
  id: string;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  networkId?: string;
  network?: SchoolNetwork;
  _count?: {
    users: number;
    students: number;
    teams: number;
  };
}

interface SchoolNetwork {
  id: string;
  name: string;
  description?: string;
  code?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  schools?: School[];
  _count?: {
    schools: number;
  };
} 