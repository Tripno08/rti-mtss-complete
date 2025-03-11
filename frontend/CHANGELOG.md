# Changelog

## 2025-03-11 - Correções para compatibilidade com React 19

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

### Scripts de manutenção

1. **fix-select-items.js**
   - Script para corrigir todos os `SelectItem` com valor vazio no projeto
   - Mapeia valores vazios para valores significativos
   - Atualiza a lógica de filtro para lidar com os novos valores

2. **fix-forwardref.js**
   - Script para identificar componentes que usam `React.forwardRef`
   - Prepara para a execução do codemod `types-react-codemod` 