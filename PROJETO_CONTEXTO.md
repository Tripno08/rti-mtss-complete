# Contexto do Projeto RTI-MTSS

## Visão Geral

O RTI-MTSS (Resposta à Intervenção e Sistema de Suporte Multi-Níveis) é uma plataforma educacional projetada para ajudar escolas a implementar e gerenciar intervenções acadêmicas e comportamentais para estudantes. O sistema permite o monitoramento do progresso dos alunos, a implementação de intervenções baseadas em evidências e a colaboração entre educadores, especialistas e administradores.

## Arquitetura do Sistema

### Backend

- **Tecnologias**: NestJS, TypeScript, Prisma ORM
- **Banco de Dados**: MySQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Containerização**: Docker

### Frontend

- **Tecnologias**: Next.js, React, TypeScript, Tailwind CSS
- **Gerenciamento de Estado**: Zustand
- **Requisições HTTP**: Axios
- **Containerização**: Docker

## Estrutura do Projeto

### Backend

```
backend/
├── prisma/                  # Esquema do banco de dados e migrações
├── src/
│   ├── modules/             # Módulos da aplicação
│   │   ├── assessments/     # Avaliações dos alunos
│   │   ├── auth/            # Autenticação e autorização
│   │   ├── dashboard/       # Dados para o dashboard
│   │   ├── integrations/    # Integrações com sistemas externos
│   │   ├── interventions/   # Intervenções para os alunos
│   │   ├── meetings/        # Reuniões e colaboração
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
│   ├── components/          # Componentes reutilizáveis
│   │   ├── analytics/       # Componentes de análise de dados
│   │   ├── dashboard/       # Componentes do dashboard
│   │   ├── meetings/        # Componentes de reuniões
│   │   └── ui/              # Componentes de UI genéricos
│   ├── lib/                 # Utilitários e hooks
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
- [x] Diferentes papéis: Administrador, Professor, Coordenador
- [x] Perfil de usuário com informações básicas

### Gerenciamento de Estudantes

- [x] Cadastro de estudantes
- [x] Visualização de perfil de estudante
- [x] Edição de informações do estudante
- [x] Listagem de estudantes com filtros

### Avaliações

- [x] Criação de avaliações para estudantes
- [x] Diferentes tipos de avaliações (acadêmicas, comportamentais)
- [x] Histórico de avaliações por estudante
- [x] Visualização de resultados de avaliações

### Intervenções

- [x] Criação de planos de intervenção
- [x] Acompanhamento de intervenções
- [x] Marcação de intervenções como concluídas ou canceladas
- [x] Histórico de intervenções por estudante

### Equipes e Colaboração

- [x] Criação de equipes de educadores
- [x] Adição de membros às equipes
- [x] Atribuição de estudantes às equipes
- [x] Agendamento de reuniões de equipe

### Dashboard e Análises

- [x] Visão geral do sistema com métricas principais
- [x] Gráficos de distribuição de estudantes por nível de intervenção
- [x] Lista de estudantes de alto risco
- [x] Eficácia das intervenções
- [x] Linha do tempo de atividades recentes

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
- [ ] Notificações personalizadas

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

- [ ] Biblioteca de intervenções baseadas em evidências
- [ ] Recomendações automáticas de intervenções
- [ ] Monitoramento de fidelidade de implementação
- [ ] Análise de eficácia de intervenções por categoria

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

## Desafios Técnicos Resolvidos

1. **Autenticação e Redirecionamento**: Resolvemos problemas de redirecionamento após o login, simplificando o middleware e a lógica de autenticação.

2. **Containerização**: Implementamos uma configuração Docker completa para desenvolvimento e produção.

3. **Persistência de Estado**: Configuramos o Zustand com persistência para manter o estado de autenticação entre recarregamentos de página.

## Desafios Técnicos Pendentes

1. **Desempenho com Grandes Conjuntos de Dados**: Otimização para escolas com muitos estudantes.

2. **Sincronização Offline**: Permitir o uso de algumas funcionalidades sem conexão à internet.

3. **Escalabilidade**: Preparar a arquitetura para suportar múltiplas escolas ou distritos.

4. **Segurança de Dados**: Implementar criptografia avançada para dados sensíveis dos estudantes.

## Ambiente de Desenvolvimento

### Requisitos

- Node.js 18+ (backend) e Node.js 20+ (frontend)
- Docker e Docker Compose
- MySQL 8.0
- Redis (para cache e sessões)

### Configuração

1. Clone o repositório: `git clone https://github.com/Tripno08/rti-mtss-complete.git`
2. Inicie os containers: `docker compose up -d`
3. Acesse o frontend em: `http://localhost:3000`
4. Acesse o backend em: `http://localhost:3001/api`

### Credenciais de Teste

- **Email**: admin@example.com
- **Senha**: admin123

## Convenções e Padrões

### Backend

- Controllers para manipulação de requisições HTTP
- Services para lógica de negócios
- DTOs para validação de dados de entrada
- Prisma para acesso ao banco de dados
- Guards para controle de acesso

### Frontend

- App Router do Next.js para roteamento
- Zustand para gerenciamento de estado
- Componentes funcionais com hooks
- Tailwind CSS para estilização
- Axios para requisições HTTP

## Próximos Passos

1. Implementar recuperação de senha
2. Adicionar mais relatórios e análises
3. Melhorar a interface do usuário para dispositivos móveis
4. Implementar integrações com sistemas externos
5. Adicionar testes automatizados mais abrangentes

---

Este documento serve como um guia abrangente para o projeto RTI-MTSS, fornecendo contexto para o desenvolvimento de novas funcionalidades e melhorias no sistema existente. 