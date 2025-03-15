'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
// import { api } from '@/lib/utils/api';

interface Integration {
  id: string;
  platform: 'GOOGLE_CLASSROOM' | 'MICROSOFT_TEAMS' | 'LTI' | 'CUSTOM';
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dados mockados para desenvolvimento
const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: '1',
    platform: 'GOOGLE_CLASSROOM',
    name: 'Google Classroom - Escola Municipal',
    active: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-03-10T14:30:00Z'
  },
  {
    id: '2',
    platform: 'MICROSOFT_TEAMS',
    name: 'Microsoft Teams - Rede Estadual',
    active: true,
    createdAt: '2025-02-01T09:15:00Z',
    updatedAt: '2025-03-05T11:20:00Z'
  },
  {
    id: '3',
    platform: 'LTI',
    name: 'Moodle - Colégio Particular',
    active: false,
    createdAt: '2025-01-20T13:45:00Z',
    updatedAt: '2025-03-12T16:10:00Z'
  },
  {
    id: '4',
    platform: 'CUSTOM',
    name: 'API Personalizada - Sistema Legado',
    active: true,
    createdAt: '2024-11-10T08:30:00Z',
    updatedAt: '2025-02-28T15:45:00Z'
  }
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setIsLoading(true);
        // Simulando um delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        setIntegrations(MOCK_INTEGRATIONS);
      } catch (error) {
        console.error('Erro ao buscar integrações:', error);
        toast.error('Erro ao carregar integrações. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  const handleCreateIntegration = (platform: string) => {
    router.push(`/integrations/new?platform=${platform}`);
  };

  const handleViewIntegration = (id: string) => {
    router.push(`/integrations/${id}`);
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'GOOGLE_CLASSROOM':
        return 'Google Classroom';
      case 'MICROSOFT_TEAMS':
        return 'Microsoft Teams';
      case 'LTI':
        return 'LTI';
      case 'CUSTOM':
        return 'Personalizada';
      default:
        return platform;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'GOOGLE_CLASSROOM':
        return 'bg-red-100 text-red-800';
      case 'MICROSOFT_TEAMS':
        return 'bg-blue-100 text-blue-800';
      case 'LTI':
        return 'bg-green-100 text-green-800';
      case 'CUSTOM':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="google">Google Classroom</TabsTrigger>
          <TabsTrigger value="microsoft">Microsoft Teams</TabsTrigger>
          <TabsTrigger value="lti">LTI</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              // Esqueletos de carregamento
              Array(3).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
            ) : integrations.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Nenhuma integração encontrada</CardTitle>
                    <CardDescription>
                      Você ainda não configurou nenhuma integração com plataformas externas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Clique em um dos botões abaixo para configurar uma nova integração.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getPlatformColor(integration.platform)}>
                        {getPlatformLabel(integration.platform)}
                      </Badge>
                      <Badge variant={integration.active ? 'default' : 'destructive'}>
                        {integration.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <CardTitle>{integration.name}</CardTitle>
                    <CardDescription>
                      Criado em {new Date(integration.createdAt).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Clique no botão abaixo para gerenciar esta integração.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handleViewIntegration(integration.id)}
                    >
                      Gerenciar
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Google Classroom</CardTitle>
                <CardDescription>
                  Integre com o Google Classroom para sincronizar turmas e alunos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sincronize turmas, alunos e atividades com o Google Classroom.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleCreateIntegration('GOOGLE_CLASSROOM')}
                >
                  Configurar
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Microsoft Teams</CardTitle>
                <CardDescription>
                  Integre com o Microsoft Teams para sincronizar turmas e alunos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sincronize turmas, alunos e atividades com o Microsoft Teams.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleCreateIntegration('MICROSOFT_TEAMS')}
                >
                  Configurar
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LTI</CardTitle>
                <CardDescription>
                  Integre com plataformas LMS usando o padrão LTI 1.3.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure integrações LTI com Canvas, Moodle, Blackboard e outros LMS.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleCreateIntegration('LTI')}
                >
                  Configurar
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>
                  Configure webhooks para integrar com sistemas externos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receba notificações de eventos do sistema em URLs personalizadas.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/integrations/webhooks')}
                >
                  Configurar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="google" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Classroom</CardTitle>
              <CardDescription>
                Integre com o Google Classroom para sincronizar turmas e alunos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  A integração com o Google Classroom permite sincronizar automaticamente:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Turmas e suas informações</li>
                  <li>Alunos e professores</li>
                  <li>Atividades e tarefas</li>
                  <li>Notificações e atualizações</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Para configurar, você precisará de uma conta Google Workspace for Education e permissões de administrador.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleCreateIntegration('GOOGLE_CLASSROOM')}
              >
                Configurar Integração
              </Button>
            </CardFooter>
          </Card>

          {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {integrations
                .filter(i => i.platform === 'GOOGLE_CLASSROOM')
                .map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className={getPlatformColor(integration.platform)}>
                          {getPlatformLabel(integration.platform)}
                        </Badge>
                        <Badge variant={integration.active ? 'default' : 'destructive'}>
                          {integration.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <CardTitle>{integration.name}</CardTitle>
                      <CardDescription>
                        Criado em {new Date(integration.createdAt).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Clique no botão abaixo para gerenciar esta integração.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => handleViewIntegration(integration.id)}
                      >
                        Gerenciar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="microsoft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Microsoft Teams</CardTitle>
              <CardDescription>
                Integre com o Microsoft Teams para sincronizar turmas e alunos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  A integração com o Microsoft Teams permite sincronizar automaticamente:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Equipes e canais</li>
                  <li>Alunos e professores</li>
                  <li>Tarefas e atividades</li>
                  <li>Notificações e atualizações</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Para configurar, você precisará de uma conta Microsoft 365 Education e permissões de administrador.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleCreateIntegration('MICROSOFT_TEAMS')}
              >
                Configurar Integração
              </Button>
            </CardFooter>
          </Card>

          {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {integrations
                .filter(i => i.platform === 'MICROSOFT_TEAMS')
                .map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className={getPlatformColor(integration.platform)}>
                          {getPlatformLabel(integration.platform)}
                        </Badge>
                        <Badge variant={integration.active ? 'default' : 'destructive'}>
                          {integration.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <CardTitle>{integration.name}</CardTitle>
                      <CardDescription>
                        Criado em {new Date(integration.createdAt).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Clique no botão abaixo para gerenciar esta integração.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => handleViewIntegration(integration.id)}
                      >
                        Gerenciar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lti" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LTI (Learning Tools Interoperability)</CardTitle>
              <CardDescription>
                Integre com plataformas LMS usando o padrão LTI 1.3.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  A integração LTI permite conectar o sistema Innerview com diversos LMS:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Canvas</li>
                  <li>Moodle</li>
                  <li>Blackboard</li>
                  <li>Outros sistemas compatíveis com LTI 1.3</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Para configurar, você precisará de acesso administrativo ao LMS para registrar a ferramenta externa.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleCreateIntegration('LTI')}
              >
                Configurar Integração
              </Button>
            </CardFooter>
          </Card>

          {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {integrations
                .filter(i => i.platform === 'LTI')
                .map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className={getPlatformColor(integration.platform)}>
                          {getPlatformLabel(integration.platform)}
                        </Badge>
                        <Badge variant={integration.active ? 'default' : 'destructive'}>
                          {integration.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <CardTitle>{integration.name}</CardTitle>
                      <CardDescription>
                        Criado em {new Date(integration.createdAt).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Clique no botão abaixo para gerenciar esta integração.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => handleViewIntegration(integration.id)}
                      >
                        Gerenciar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 