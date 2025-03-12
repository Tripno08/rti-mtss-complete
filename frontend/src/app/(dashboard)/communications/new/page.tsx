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
import { ArrowLeft, Mail, MessageSquare, Phone, FileText, Users } from 'lucide-react';

export default function NewCommunicationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communicationType, setCommunicationType] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulação de envio para a API
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/communications');
    }, 1000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'letter':
        return <FileText className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/communications')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Nova Comunicação</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Comunicação</CardTitle>
          <CardDescription>
            Preencha os dados para criar uma nova comunicação
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" placeholder="Assunto da comunicação" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Comunicação</Label>
                <Select onValueChange={setCommunicationType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>E-mail</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sms">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>SMS</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="letter">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Carta</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>Telefone</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="meeting">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Reunião</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender">Remetente</Label>
                <Input id="sender" placeholder="Nome do remetente" />
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
              <Label htmlFor="recipients">Destinatários</Label>
              <Input id="recipients" placeholder="E-mails ou nomes separados por vírgula" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo da Comunicação</Label>
              <Textarea 
                id="content" 
                placeholder="Digite o conteúdo da comunicação" 
                rows={6}
              />
            </div>

            {communicationType === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="attachments">Anexos</Label>
                <Input id="attachments" type="file" multiple />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => router.push('/communications')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Comunicação'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 