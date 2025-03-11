'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Innerview</h1>
        <p className="text-xl text-muted-foreground">
          Sistema de visualização interna de dados educacionais e Suporte Multi-Níveis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monitoramento</CardTitle>
            <CardDescription>
              Acompanhe o progresso dos alunos em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitore o desempenho acadêmico e comportamental dos alunos com ferramentas avançadas de análise.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/monitoring">Acessar</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intervenções</CardTitle>
            <CardDescription>
              Gerencie intervenções personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Crie e acompanhe intervenções específicas para cada nível de suporte do MTSS.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/interventions">Acessar</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios</CardTitle>
            <CardDescription>
              Visualize dados e gere relatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Acesse relatórios detalhados e análises para tomada de decisão baseada em dados.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/reports">Acessar</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/login">Acessar o Sistema</Link>
        </Button>
      </div>
    </div>
  );
}
