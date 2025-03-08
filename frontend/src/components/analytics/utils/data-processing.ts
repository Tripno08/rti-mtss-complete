/**
 * Utilitários para processamento de dados analíticos
 */

import regression from 'regression';
import * as ss from 'simple-statistics';

/**
 * Calcula a linha de tendência linear para um conjunto de dados
 * @param data Array de pontos [x, y]
 * @returns Objeto com equação da linha e pontos projetados
 */
export function calculateLinearTrend(data: number[][]) {
  const result = regression.linear(data);
  return {
    equation: result.equation,
    r2: result.r2 || 0,
    predict: (x: number) => result.equation[0] * x + result.equation[1]
  };
}

/**
 * Calcula o intervalo de confiança para um conjunto de valores
 * @param data Array de valores numéricos
 * @param confidenceLevel Nível de confiança (padrão: 0.95)
 * @returns Objeto com limites inferior e superior do intervalo
 */
export function calculateConfidenceInterval(data: number[], confidenceLevel = 0.95) {
  const mean = ss.mean(data);
  const stdDev = ss.standardDeviation(data);
  const n = data.length;
  
  // Valor z para o nível de confiança (1.96 para 95%)
  const zScore = confidenceLevel === 0.95 ? 1.96 : 
                confidenceLevel === 0.99 ? 2.58 : 
                confidenceLevel === 0.90 ? 1.645 : 1.96;
  
  const marginOfError = zScore * (stdDev / Math.sqrt(n));
  
  return {
    lower: mean - marginOfError,
    upper: mean + marginOfError,
    mean,
    stdDev
  };
}

/**
 * Detecta valores atípicos (outliers) em um conjunto de dados
 * @param data Array de valores numéricos
 * @param threshold Multiplicador para o intervalo interquartil (padrão: 1.5)
 * @returns Array de índices dos outliers
 */
export function detectOutliers(data: number[], threshold = 1.5) {
  const q1 = ss.quantile(data, 0.25);
  const q3 = ss.quantile(data, 0.75);
  const iqr = q3 - q1;
  const lowerBound = q1 - threshold * iqr;
  const upperBound = q3 + threshold * iqr;
  
  return data.map((value, index) => 
    value < lowerBound || value > upperBound ? index : -1
  ).filter(index => index !== -1);
}

/**
 * Calcula a taxa de crescimento entre dois valores
 * @param initialValue Valor inicial
 * @param finalValue Valor final
 * @returns Taxa de crescimento em percentual
 */
export function calculateGrowthRate(initialValue: number, finalValue: number) {
  if (initialValue === 0) return 0;
  return ((finalValue - initialValue) / Math.abs(initialValue)) * 100;
}

/**
 * Normaliza um conjunto de dados para a escala 0-1
 * @param data Array de valores numéricos
 * @returns Array de valores normalizados
 */
export function normalizeData(data: number[]) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  if (max === min) return data.map(() => 0.5);
  
  return data.map(value => (value - min) / (max - min));
}

/**
 * Calcula a correlação entre dois conjuntos de dados
 * @param dataX Primeiro conjunto de dados
 * @param dataY Segundo conjunto de dados
 * @returns Coeficiente de correlação de Pearson
 */
export function calculateCorrelation(dataX: number[], dataY: number[]) {
  if (dataX.length !== dataY.length || dataX.length === 0) {
    throw new Error('Os conjuntos de dados devem ter o mesmo tamanho e não podem estar vazios');
  }
  
  return ss.sampleCorrelation(dataX, dataY);
}

/**
 * Agrupa dados por categoria e calcula estatísticas
 * @param data Array de objetos com valores
 * @param categoryKey Chave para agrupar os dados
 * @param valueKey Chave do valor a ser analisado
 * @returns Objeto com estatísticas por categoria
 */
export function groupAndAnalyze<T>(
  data: T[], 
  categoryKey: keyof T, 
  valueKey: keyof T
) {
  const groups: Record<string, number[]> = {};
  
  // Agrupar valores por categoria
  data.forEach(item => {
    const category = String(item[categoryKey]);
    const value = Number(item[valueKey]);
    
    if (isNaN(value)) return;
    
    if (!groups[category]) {
      groups[category] = [];
    }
    
    groups[category].push(value);
  });
  
  // Calcular estatísticas para cada grupo
  const result: Record<string, { 
    count: number; 
    mean: number; 
    median: number; 
    stdDev: number;
    min: number;
    max: number;
  }> = {};
  
  Object.entries(groups).forEach(([category, values]) => {
    result[category] = {
      count: values.length,
      mean: ss.mean(values),
      median: ss.median(values),
      stdDev: values.length > 1 ? ss.standardDeviation(values) : 0,
      min: Math.min(...values),
      max: Math.max(...values)
    };
  });
  
  return result;
} 