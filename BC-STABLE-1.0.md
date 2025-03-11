# BC Stable 1.0

Esta é a versão estável BC Stable 1.0 do projeto RTI/MTSS Complete. Esta versão inclui correções para compatibilidade com React 19 e outros bugs.

## Detalhes da Versão

- **Nome da Versão**: BC Stable 1.0
- **Data de Lançamento**: 11 de março de 2025
- **Branch**: bc-stable-1.0
- **Tag**: v1.0-bc-stable

## Estrutura do Projeto

O projeto está organizado nas seguintes pastas principais:

- **frontend**: Aplicação frontend em Next.js 15.2.2 com React 19
- **backend**: API backend em NestJS
- **docker**: Configurações Docker para desenvolvimento e produção
- **infra**: Scripts e configurações de infraestrutura

## Requisitos

- Node.js 20.x ou superior
- Docker e Docker Compose
- Git

## Configuração e Instalação

### Clonando o Repositório

```bash
git clone https://github.com/Tripno08/rti-mtss-complete.git
cd rti-mtss-complete
git checkout bc-stable-1.0
```

### Configuração do Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em http://localhost:3002

### Configuração do Backend

```bash
cd backend
npm install
npm run start:dev
```

O backend estará disponível em http://localhost:3001

### Usando Docker Compose

Para iniciar todo o ambiente usando Docker Compose:

```bash
docker-compose up -d
```

## Correções Implementadas

### Correções de erros

1. **Corrigido erro "element.ref was removed in React 19"**
   - Atualizado componentes que usavam `React.forwardRef` para usar a nova API de refs do React 19
   - Executado codemods `types-react-codemod` para atualizar tipos e referências

2. **Corrigido erro "SelectItem value cannot be empty"**
   - Criado script `fix-select-items.js` para corrigir todos os `SelectItem` com valor vazio
   - Substituído valores vazios por valores significativos como `all-categories`, `all-types`, etc.
   - Atualizado a lógica de filtro para lidar com os novos valores

3. **Corrigido erro "ReferenceError: matchesStatus is not defined"**
   - Corrigido erro de referência no arquivo `frontend/src/app/(dashboard)/screening/page.tsx`
   - Substituído `matchesStatus` por `matchesstatusFilter` para manter consistência com a variável definida
   - Corrigido valor de filtro de "all-statusFilters" para "all-statuses"

### Dependências atualizadas

- Atualizado pacotes do Radix UI para versões compatíveis com React 19:
  - `@radix-ui/react-select`: "^2.0.0"
  - `@radix-ui/react-slot`: "^1.0.2"
  - `@radix-ui/react-checkbox`: "^1.0.4"
  - `@radix-ui/react-dialog`: "^1.0.5"
  - `@radix-ui/react-dropdown-menu`: "^2.0.6"
  - `@radix-ui/react-label`: "^2.0.2"
  - `@radix-ui/react-popover`: "^1.0.7"
  - `@radix-ui/react-separator`: "^1.0.3"
  - `@radix-ui/react-tabs`: "^1.0.4"

## Scripts de Manutenção

1. **fix-select-items.js**
   - Script para corrigir todos os `SelectItem` com valor vazio no projeto
   - Mapeia valores vazios para valores significativos
   - Atualiza a lógica de filtro para lidar com os novos valores

2. **fix-forwardref.js**
   - Script para identificar componentes que usam `React.forwardRef`
   - Prepara para a execução do codemod `types-react-codemod`

## Contato

Para mais informações, entre em contato com a equipe de desenvolvimento. 