'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Plus, Trash } from 'lucide-react';

export default function NewScreeningResultPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [indicators, setIndicators] = useState<string[]>(['']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio para a API
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/screening-results');
    }, 1000);
  };

  const addIndicator = () => {
    setIndicators([...indicators, '']);
  };

  const removeIndicator = (index: number) => {
    const newIndicators = [...indicators];
    newIndicators.splice(index, 1);
    setIndicators(newIndicators);
  };

  const updateIndicator = (index: number, value: string) => {
    const newIndicators = [...indicators];
    newIndicators[index] = value;
    setIndicators(newIndicators);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/screening-results')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Novo Resultado de Rastreio</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Resultado</CardTitle>
          <CardDescription>
            Preencha os dados para registrar um novo resultado de rastreio
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student">Aluno</Label>
                <Select>
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">João Silva</SelectItem>
                    <SelectItem value="2">Ana Pereira</SelectItem>
                    <SelectItem value="3">Lucas Mendes</SelectItem>
                    <SelectItem value="4">Mariana Souza</SelectItem>
                    <SelectItem value="5">Gabriel Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="screening">Rastreio</Label>
                <Select>
                  <SelectTrigger id="screening">
                    <SelectValue placeholder="Selecione o rastreio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Avaliação de Leitura</SelectItem>
                    <SelectItem value="2">Avaliação de Matemática</SelectItem>
                    <SelectItem value="3">Avaliação Comportamental</SelectItem>
                    <SelectItem value="4">Avaliação de Escrita</SelectItem>
                    <SelectItem value="5">Avaliação Socioemocional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">Pontuação</Label>
                <Input id="score" type="number" min="0" placeholder="Pontuação obtida" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxScore">Pontuação Máxima</Label>
                <Input id="maxScore" type="number" min="0" placeholder="Pontuação máxima possível" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="at-risk">Em Risco</SelectItem>
                    <SelectItem value="some-risk">Algum Risco</SelectItem>
                    <SelectItem value="no-risk">Sem Risco</SelectItem>
                    <SelectItem value="incomplete">Incompleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appliedBy">Aplicado por</Label>
                <Input id="appliedBy" placeholder="Nome do aplicador" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Indicadores Observados</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addIndicator}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Indicador
                </Button>
              </div>
              
              {indicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={indicator}
                    onChange={(e) => updateIndicator(index, e.target.value)}
                    placeholder={`Indicador ${index + 1}`}
                    className="flex-1"
                  />
                  {indicators.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIndicator(index)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea 
                id="notes" 
                placeholder="Observações adicionais sobre o resultado" 
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/screening-results')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Resultado'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 