FROM node:18-slim

WORKDIR /app

# Instalar dependências necessárias
RUN apt-get update && apt-get install -y \
    openssl \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copiar arquivos do projeto
COPY . .

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Criar diretório dist manualmente
RUN mkdir -p dist

# Copiar arquivos de origem para dist
RUN cp -r src/* dist/

# Configurar permissões corretas
RUN chmod -R 777 /app/node_modules/.prisma

# Configurar usuário não-root
USER node

EXPOSE 3001

# Script para aguardar MySQL e iniciar a aplicação
CMD sh -c 'while ! nc -z mysql 3306; do sleep 1; done && npx prisma generate && npm run start:prod' 