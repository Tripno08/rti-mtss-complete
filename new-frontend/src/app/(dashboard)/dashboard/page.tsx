'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BrainCircuit, 
  BarChart3, 
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Dados simulados para o dashboard
  const stats = [
    { 
      title: 'Estudantes', 
      value: 248, 
      description: 'Total de estudantes no sistema', 
      icon: <Users className="h-5 w-5" />,
      href: '/students'
    },
    { 
      title: 'Avaliações', 
      value: 1254, 
      description: 'Avaliações realizadas este ano', 
      icon: <BookOpen className="h-5 w-5" />,
      href: '/assessments'
    },
    { 
      title: 'Reuniões', 
      value: 87, 
      description: 'Reuniões realizadas este ano', 
      icon: <Calendar className="h-5 w-5" />,
      href: '/meetings'
    },
    { 
      title: 'Intervenções', 
      value: 156, 
      description: 'Intervenções ativas', 
      icon: <BrainCircuit className="h-5 w-5" />,
      href: '/interventions'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bem-vindo, {user?.name}!</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <Button variant="link" className="mt-2 px-0" asChild>
                <Link href={stat.href}>
                  Ver mais <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alunos em Risco</CardTitle>
            <CardDescription>Estudantes que precisam de atenção imediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">João Silva</p>
                  <p className="text-xs text-muted-foreground">Nível 3 - Matemática</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/students/1">Ver perfil</Link>
                </Button>
              </div>
              {/* Adicione mais alunos conforme necessário */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Intervenções Recentes</CardTitle>
            <CardDescription>Últimas intervenções registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Reforço em Leitura</p>
                  <p className="text-xs text-muted-foreground">Concluído em 05/03</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/interventions/1">Detalhes</Link>
                </Button>
              </div>
              {/* Adicione mais intervenções conforme necessário */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximas Reuniões</CardTitle>
            <CardDescription>Reuniões agendadas para esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Conselho de Classe</p>
                  <p className="text-xs text-muted-foreground">10/03 às 14:00</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/meetings/1">Ver pauta</Link>
                </Button>
              </div>
              {/* Adicione mais reuniões conforme necessário */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 