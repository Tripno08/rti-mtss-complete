FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Gerar Prisma Client com os targets corretos
RUN npx prisma generate

# Instalar netcat para verificação de conexão
RUN apk add --no-cache netcat-openbsd

# Criar diretório dist com permissões corretas
RUN mkdir -p dist && chown node:node dist

EXPOSE 3001

USER node

CMD sh -c 'echo "Aguardando MySQL iniciar..." && \
          while ! nc -z mysql 3306; do \
            sleep 1; \
          done && \
          echo "MySQL está pronto!" && \
          rm -rf dist/* || true && \
          exec npm run start:dev' 