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
import { ArrowLeft } from 'lucide-react';

export default function NewReferralPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio para a API
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/referrals');
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/referrals')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Novo Encaminhamento</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Encaminhamento</CardTitle>
          <CardDescription>
            Preencha os dados para criar um novo encaminhamento
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
                <Label htmlFor="referralType">Tipo de Encaminhamento</Label>
                <Select>
                  <SelectTrigger id="referralType">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="psicologo">Psicólogo</SelectItem>
                    <SelectItem value="fonoaudiologo">Fonoaudiólogo</SelectItem>
                    <SelectItem value="terapeuta">Terapeuta Ocupacional</SelectItem>
                    <SelectItem value="neurologista">Neurologista</SelectItem>
                    <SelectItem value="psicopedagogo">Psicopedagogo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referredTo">Destinatário</Label>
                <Input id="referredTo" placeholder="Nome do profissional" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo do Encaminhamento</Label>
              <Textarea 
                id="reason" 
                placeholder="Descreva o motivo do encaminhamento" 
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações Adicionais</Label>
              <Textarea 
                id="notes" 
                placeholder="Observações adicionais (opcional)" 
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/referrals')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Encaminhamento'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 