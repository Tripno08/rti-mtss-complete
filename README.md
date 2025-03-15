# RTI-MTSS Complete (Innerview)

## Visão Geral

O RTI-MTSS Complete (Innerview) é uma plataforma educacional abrangente projetada para ajudar escolas a implementar e gerenciar intervenções acadêmicas e comportamentais para estudantes. O sistema permite o monitoramento do progresso dos alunos, a implementação de intervenções baseadas em evidências e a colaboração entre educadores, especialistas e administradores.

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Gerenciamento de Estado**: Zustand
- **Requisições HTTP**: Axios

### Backend
- **Framework**: NestJS
- **Linguagem**: TypeScript
- **ORM**: Prisma com MySQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Cache**: Redis
- **Documentação API**: Swagger

### Infraestrutura
- **Containerização**: Docker e Docker Compose
- **Ambiente de Desenvolvimento**: Frontend local, Backend em Docker

## Estrutura do Repositório

```
rti-mtss-complete/
├── frontend/                # Aplicação Next.js
├── backend/                 # API NestJS
├── docker/                  # Configurações Docker
├── infra/                   # Scripts de infraestrutura
└── README.md                # Este arquivo
```

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js 18+ (backend) e Node.js 20+ (frontend)
- Docker e Docker Compose
- Git

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Tripno08/rti-mtss-complete.git
   cd rti-mtss-complete
   ```

2. Inicie os serviços de backend, MySQL e Redis:
   ```bash
   docker compose up -d
   ```

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

## Principais Rotas e Funcionalidades

### Frontend

#### Autenticação
- `/login` - Página de login
- `/register` - Página de registro (quando habilitado)

#### Dashboard
- `/dashboard` - Visão geral do sistema
- `/dashboard/analytics` - Análises e relatórios detalhados

#### Gerenciamento de Estudantes
- `/students` - Lista de todos os estudantes
- `/students/[id]` - Perfil detalhado do estudante
- `/students/[id]/assessments` - Avaliações do estudante
- `/students/[id]/interventions` - Intervenções do estudante

#### Gerenciamento de Turmas
- `/teacher-portal/classes` - Lista de turmas
- `/teacher-portal/classes/[id]` - Detalhes da turma
- `/teacher-portal/classes/[id]/contents` - Conteúdos da turma
- `/teacher-portal/classes/[id]/students` - Estudantes da turma

#### Intervenções
- `/interventions` - Biblioteca de intervenções
- `/interventions/[id]` - Detalhes da intervenção
- `/interventions/protocols` - Protocolos de intervenção

#### Avaliações
- `/assessments` - Lista de avaliações
- `/assessments/[id]` - Detalhes da avaliação
- `/assessments/create` - Criar nova avaliação

#### Calendário
- `/calendar` - Visualização do calendário
- `/calendar/events/[id]` - Detalhes do evento

#### Reuniões
- `/meetings` - Lista de reuniões
- `/meetings/[id]` - Detalhes da reunião
- `/meetings/create` - Criar nova reunião

### Backend API

#### Autenticação
- `POST /auth/login` - Autenticar usuário
- `POST /auth/refresh` - Renovar token de acesso
- `GET /auth/profile` - Obter perfil do usuário autenticado

#### Usuários
- `GET /users` - Listar usuários
- `GET /users/:id` - Obter usuário específico
- `POST /users` - Criar usuário
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Excluir usuário

#### Estudantes
- `GET /students` - Listar estudantes
- `GET /students/:id` - Obter estudante específico
- `POST /students` - Criar estudante
- `PATCH /students/:id` - Atualizar estudante
- `DELETE /students/:id` - Excluir estudante
- `GET /students/:id/assessments` - Obter avaliações do estudante
- `GET /students/:id/interventions` - Obter intervenções do estudante

#### Turmas
- `GET /classes` - Listar turmas
- `GET /classes/:id` - Obter turma específica
- `POST /classes` - Criar turma
- `PATCH /classes/:id` - Atualizar turma
- `DELETE /classes/:id` - Excluir turma
- `GET /classes/:id/students` - Obter estudantes da turma
- `GET /classes/:id/contents` - Obter conteúdos da turma

#### Intervenções
- `GET /interventions` - Listar intervenções
- `GET /interventions/:id` - Obter intervenção específica
- `POST /interventions` - Criar intervenção
- `PATCH /interventions/:id` - Atualizar intervenção
- `DELETE /interventions/:id` - Excluir intervenção

#### Avaliações
- `GET /assessments` - Listar avaliações
- `GET /assessments/:id` - Obter avaliação específica
- `POST /assessments` - Criar avaliação
- `PATCH /assessments/:id` - Atualizar avaliação
- `DELETE /assessments/:id` - Excluir avaliação

#### Calendário
- `GET /calendar/events` - Listar eventos do calendário
- `GET /calendar/events/:id` - Obter evento específico
- `POST /calendar/events` - Criar evento
- `PATCH /calendar/events/:id` - Atualizar evento
- `DELETE /calendar/events/:id` - Excluir evento

#### Notificações
- `GET /notifications` - Listar notificações
- `GET /notifications/unread` - Listar notificações não lidas
- `PATCH /notifications/:id/read` - Marcar notificação como lida
- `PATCH /notifications/read-all` - Marcar todas notificações como lidas

## Lista de Tarefas Pendentes

### Alta Prioridade
- [ ] Implementar recuperação de senha
- [ ] Corrigir problemas de compilação do frontend
- [ ] Adicionar validação de dados mais robusta
- [ ] Implementar testes unitários e de integração
- [ ] Otimizar consultas ao banco de dados para melhor desempenho

### Média Prioridade
- [ ] Implementar eventos recorrentes no calendário
- [ ] Adicionar suporte para upload de documentos
- [ ] Melhorar a interface para dispositivos móveis
- [ ] Implementar recomendações automáticas de intervenções
- [ ] Adicionar relatórios personalizáveis

### Baixa Prioridade
- [ ] Integrar com sistemas externos (Google Classroom, Microsoft Teams)
- [ ] Implementar autenticação com provedores externos
- [ ] Adicionar suporte para múltiplos idiomas
- [ ] Implementar funcionalidades offline
- [ ] Adicionar análises preditivas baseadas em machine learning

## Contribuição

Para contribuir com o projeto, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE). 