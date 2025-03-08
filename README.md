# Sistema RTI/MTSS - Innerview2025

Sistema de Resposta à Intervenção/Sistema de Suporte Multi-Nível para educação.

## Visão Geral

Este projeto implementa um sistema RTI/MTSS completo para instituições educacionais, permitindo o acompanhamento e intervenção personalizada para estudantes.

## Stack Tecnológico

- **Frontend**: Next.js 14 com Tailwind CSS e shadcn/ui
- **Backend**: NestJS com TypeScript
- **ORM**: Prisma com MySQL
- **Autenticação**: JWT com refresh tokens
- **Infraestrutura**: AWS (ECS Fargate, RDS, ElastiCache, S3)

## Estrutura do Repositório

```
/rti-mtss
├─ /frontend            # Next.js 14 frontend
├─ /backend             # NestJS backend
├─ /docker              # Configurações Docker
├─ /infra               # Scripts de infraestrutura
├─ docker-compose.yml   # Ambiente de desenvolvimento
└─ README.md            # Documentação
```

## Configuração de Desenvolvimento

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

### Instalação

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd rti-mtss
   ```

2. Inicie o ambiente de desenvolvimento:
   ```bash
   docker-compose up -d
   ```

3. Acesse:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Documentação API: http://localhost:3001/api

## Licença

[Tipo de Licença] 