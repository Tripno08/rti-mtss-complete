# Contexto do Projeto RTI-MTSS

## Visão Geral

O RTI-MTSS (Resposta à Intervenção e Sistema de Suporte Multi-Níveis) é uma plataforma educacional projetada para ajudar escolas a implementar e gerenciar intervenções acadêmicas e comportamentais para estudantes. O sistema permite o monitoramento do progresso dos alunos, a implementação de intervenções baseadas em evidências e a colaboração entre educadores, especialistas e administradores.

## Arquitetura do Sistema

### Backend

- **Tecnologias**: NestJS, TypeScript, Prisma ORM
- **Banco de Dados**: MySQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Cache**: Redis
- **Containerização**: Docker

### Frontend

- **Tecnologias**: Next.js, React, TypeScript, Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Gerenciamento de Estado**: Zustand
- **Requisições HTTP**: Axios
- **Containerização**: Docker (desenvolvimento)
- **Execução Local**: Desenvolvimento local para melhor DX

## Estrutura do Projeto

### Backend

```
backend/
├── prisma/                  # Esquema do banco de dados e migrações
├── src/
│   ├── modules/             # Módulos da aplicação
│   │   ├── assessments/     # Avaliações dos alunos
│   │   ├── auth/            # Autenticação e autorização
│   │   ├── base-interventions/ # Intervenções base
│   │   ├── calendar/        # Eventos de calendário
│   │   ├── classes/         # Gerenciamento de turmas
│   │   ├── contents/        # Conteúdos didáticos
│   │   ├── dashboard/       # Dados para o dashboard
│   │   ├── integrations/    # Integrações com sistemas externos
│   │   ├── interventions/   # Intervenções para os alunos
│   │   ├── lesson-plans/    # Planos de aula
│   │   ├── meetings/        # Reuniões e colaboração
│   │   ├── notifications/   # Sistema de notificações
│   │   ├── schools/         # Gerenciamento de escolas
│   │   ├── students/        # Gerenciamento de alunos
│   │   ├── teams/           # Equipes de educadores
│   │   └── users/           # Gerenciamento de usuários
│   ├── prisma/              # Serviço Prisma para acesso ao banco
│   ├── scripts/             # Scripts utilitários
│   ├── app.module.ts        # Módulo principal da aplicação
│   └── main.ts              # Ponto de entrada da aplicação
└── package.json             # Dependências e scripts
```

### Frontend

```
frontend/
├── public/                  # Arquivos estáticos
├── src/
│   ├── app/                 # Páginas da aplicação (Next.js App Router)
│   │   ├── (auth)/          # Páginas de autenticação
│   │   └── (dashboard)/     # Páginas do dashboard e funcionalidades
│   │       ├── calendar/    # Módulo de calendário
│   │       ├── classes/     # Gerenciamento de turmas
│   │       ├── dashboard/   # Dashboard principal
│   │       ├── interventions/ # Intervenções
│   │       ├── lesson-plans/ # Planos de aula
│   │       ├── meetings/    # Reuniões
│   │       ├── schools/     # Escolas
│   │       ├── students/    # Estudantes
│   │       └── teacher-portal/ # Portal do professor
│   ├── components/          # Componentes reutilizáveis
│   │   ├── analytics/       # Componentes de análise de dados
│   │   ├── calendar/        # Componentes de calendário
│   │   ├── dashboard/       # Componentes do dashboard
│   │   ├── meetings/        # Componentes de reuniões
│   │   └── ui/              # Componentes de UI genéricos
│   ├── api/                 # Clientes de API para o backend
│   ├── lib/                 # Utilitários e hooks
│   │   ├── api/             # Configuração da API
│   │   ├── stores/          # Stores Zustand
│   │   └── utils/           # Funções utilitárias
│   ├── providers/           # Providers de contexto React
│   ├── middleware.ts        # Middleware Next.js para proteção de rotas
│   └── styles/              # Estilos globais
└── package.json             # Dependências e scripts
```

## Funcionalidades Implementadas

### Autenticação e Autorização

- [x] Login com email e senha
- [x] Proteção de rotas baseada em autenticação
- [x] Controle de acesso baseado em papéis (RBAC)
- [x] Tokens JWT para autenticação
- [x] Refresh tokens para manter a sessão

### Gerenciamento de Usuários

- [x] Criação, leitura, atualização e exclusão de usuários
- [x] Diferentes papéis: Administrador, Professor, Coordenador, Tutor
- [x] Perfil de usuário com informações básicas
- [x] Associação de usuários a escolas

### Escolas e Turmas

- [x] Gerenciamento de redes escolares
- [x] Cadastro e gerenciamento de escolas
- [x] Gerenciamento de turmas
- [x] Associação de estudantes a turmas
- [x] Portal do professor para gerenciamento de turmas

### Gerenciamento de Estudantes

- [x] Cadastro de estudantes
- [x] Visualização de perfil de estudante
- [x] Edição de informações do estudante
- [x] Listagem de estudantes com filtros
- [x] Associação de dificuldades de aprendizagem

### Avaliações e Rastreios

- [x] Criação de avaliações para estudantes
- [x] Diferentes tipos de avaliações (acadêmicas, comportamentais)
- [x] Histórico de avaliações por estudante
- [x] Visualização de resultados de avaliações
- [x] Instrumentos de rastreio

### Intervenções

- [x] Biblioteca de intervenções baseadas em evidências
- [x] Protocolos de intervenção
- [x] Acompanhamento de progresso
- [x] Metas e resultados
- [x] Categorização por área e nível

### Conteúdos e Planos de Aula

- [x] Gerenciamento de conteúdos didáticos
- [x] Criação e edição de planos de aula
- [x] Associação de conteúdos a turmas
- [x] Categorização de conteúdos por tipo e status

### Calendário (Novo)

- [x] Visualização de eventos em diferentes formatos (mensal, semanal, diária)
- [x] Criação e gerenciamento de eventos
- [x] Eventos com diferentes tipos (aula, reunião, tarefa, lembrete)
- [x] Personalização de cores e detalhes dos eventos
- [x] Filtros por usuário e intervalo de datas
- [x] Integração com reuniões e intervenções

### Reuniões e Comunicações

- [x] Agendamento de reuniões
- [x] Participantes e status de participação
- [x] Comunicação entre equipe e responsáveis
- [x] Notificações de eventos e atividades

### Notificações

- [x] Sistema de notificações em tempo real
- [x] Notificações não lidas
- [x] Diferentes tipos de notificações
- [x] Marcação de notificações como lidas

### Interface do Usuário

- [x] Barra lateral (Sidebar) reorganizada com grupos lógicos
- [x] Cabeçalho (Header) com menus de navegação rápida
- [x] Alternador de tema (claro/escuro/sistema)
- [x] Layout responsivo para diferentes tamanhos de tela
- [x] Componentes de UI modernos e acessíveis

### Dashboard e Análises

- [x] Visão geral do sistema com métricas principais
- [x] Gráficos de distribuição de estudantes por nível de intervenção
- [x] Lista de estudantes de alto risco
- [x] Eficácia das intervenções
- [x] Linha do tempo de atividades recentes
- [x] Notificações recentes

## Funcionalidades Pendentes

### Autenticação e Autorização

- [ ] Autenticação com provedores externos (Google, Microsoft)
- [ ] Recuperação de senha
- [ ] Autenticação de dois fatores (2FA)
- [ ] Registro de novos usuários com aprovação de administrador

### Gerenciamento de Usuários

- [ ] Importação em massa de usuários
- [ ] Histórico de atividades do usuário
- [ ] Configurações avançadas de perfil
- [ ] Preferências de notificações

### Gerenciamento de Estudantes

- [ ] Importação em massa de estudantes
- [ ] Anexar documentos ao perfil do estudante
- [ ] Histórico acadêmico completo
- [ ] Integração com sistemas de informação estudantil (SIS)

### Avaliações

- [ ] Criação de modelos de avaliação personalizados
- [ ] Avaliações programadas recorrentes
- [ ] Análise comparativa de avaliações ao longo do tempo
- [ ] Exportação de resultados de avaliações

### Intervenções

- [ ] Recomendações automáticas de intervenções
- [ ] Monitoramento de fidelidade de implementação
- [ ] Análise de eficácia de intervenções por categoria
- [ ] Biblioteca expandida de intervenções

### Calendário

- [ ] Eventos recorrentes
- [ ] Lembretes e notificações de eventos
- [ ] Exportação de eventos para outros calendários
- [ ] Visualização de disponibilidade de participantes

### Equipes e Colaboração

- [ ] Comunicação em tempo real entre membros da equipe
- [ ] Compartilhamento de documentos
- [ ] Notas de reunião colaborativas
- [ ] Integração com ferramentas de videoconferência

### Dashboard e Análises

- [ ] Previsões baseadas em machine learning
- [ ] Alertas automáticos para estudantes em risco
- [ ] Relatórios personalizáveis
- [ ] Exportação de dados e relatórios

### Integrações

- [ ] Integração com Google Classroom
- [ ] Integração com Microsoft Teams
- [ ] Integração com sistemas de informação estudantil
- [ ] API pública para integrações de terceiros

## Atualizações Recentes

### Módulo de Calendário (Tag: 15032025-BC1.3)

O módulo de calendário foi implementado para fornecer uma interface completa para gerenciamento de eventos. Este módulo permite:

- Visualização de eventos em três formatos: mensal, semanal e diária
- Criação e edição de eventos com informações detalhadas
- Categorização de eventos por tipo (aula, reunião, tarefa, lembrete, outro)
- Personalização de cores para melhor visualização
- Associação de eventos a escolas, turmas e planos de aula
- Gerenciamento de participantes com status de participação
- Filtros por usuário e intervalo de datas
- Interface responsiva e intuitiva

Este módulo se integra com outros componentes do sistema, como reuniões e intervenções, proporcionando uma visão unificada das atividades programadas.

### Módulo de Conteúdos e Planos de Aula (Tag: 14032025-BC1.3)

O módulo de conteúdos e planos de aula foi aprimorado para utilizar a API real em vez de dados simulados. As melhorias incluem:

- Integração completa com a API backend para operações CRUD
- Melhor tratamento de erros e estados de carregamento
- Tipagem forte para garantir integridade dos dados
- Interface de usuário aprimorada para melhor experiência
- Filtros e pesquisa de conteúdos

### Módulo de Notificações (Tag: 13032025-BC1.3)

O sistema de notificações foi implementado para fornecer atualizações em tempo real sobre eventos importantes. Este módulo inclui:

- Exibição de notificações não lidas
- Diferentes tipos de notificações (reunião, intervenção, sistema)
- Marcação de notificações como lidas
- Navegação para recursos relacionados
- Componente de notificações recentes no dashboard

## Desafios Técnicos Resolvidos

1. **Autenticação e Redirecionamento**: Resolvemos problemas de redirecionamento após o login, simplificando o middleware e a lógica de autenticação.

2. **Containerização**: Implementamos uma configuração Docker completa para desenvolvimento e produção.

3. **Persistência de Estado**: Configuramos o Zustand com persistência para manter o estado de autenticação entre recarregamentos de página.

4. **Interface do Usuário Moderna**: Implementamos uma interface de usuário moderna e responsiva com suporte a temas claro e escuro.

5. **Organização da Navegação**: Reorganizamos a barra lateral e o cabeçalho para uma experiência de usuário mais intuitiva.

6. **Integração com API Real**: Substituímos dados simulados por chamadas à API real em vários módulos.

7. **Ambiente de Desenvolvimento Híbrido**: Configuramos um ambiente onde o frontend roda localmente e o backend em Docker para melhor experiência de desenvolvimento.

## Desafios Técnicos Pendentes

1. **Desempenho com Grandes Conjuntos de Dados**: Otimização para escolas com muitos estudantes.

2. **Sincronização Offline**: Permitir o uso de algumas funcionalidades sem conexão à internet.

3. **Escalabilidade**: Preparar a arquitetura para suportar múltiplas escolas ou distritos.

4. **Segurança de Dados**: Implementar criptografia avançada para dados sensíveis dos estudantes.

5. **Problemas de Compilação do Frontend**: Resolver erros relacionados a arquivos não encontrados durante a compilação do Next.js.

6. **Otimização de Cache**: Resolver problemas de cache do webpack que estão causando falhas durante o desenvolvimento.

7. **Validação de Dados**: Implementar validação mais robusta no frontend e backend.

8. **Testes Automatizados**: Adicionar testes unitários e de integração para garantir a qualidade do código.

## Ambiente de Desenvolvimento

### Requisitos

- Node.js 18+ (backend) e Node.js 20+ (frontend)
- Docker e Docker Compose
- MySQL 8.0
- Redis (para cache e sessões)

### Configuração

1. Clone o repositório: `git clone https://github.com/Tripno08/rti-mtss-complete.git`
2. Inicie os serviços de backend, MySQL e Redis: `docker compose up -d`
3. Instale as dependências do frontend:
   ```bash
   cd frontend
   npm install
   ```
4. Execute o frontend localmente:
   ```bash
   npm run dev
   ```
5. Acesse:
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:3001
   - Documentação API: http://localhost:3001/api

## Próximos Passos

1. **Implementação de Testes**: Adicionar testes unitários e de integração para garantir a qualidade do código.
2. **Melhorias de Desempenho**: Otimizar consultas ao banco de dados e carregamento de páginas.
3. **Expansão de Funcionalidades**: Implementar recursos pendentes de alta prioridade.
4. **Documentação Completa**: Melhorar a documentação da API e do código.
5. **Preparação para Produção**: Configurar ambiente de produção e pipeline de CI/CD.

## Contribuição

Para contribuir com o projeto, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request 