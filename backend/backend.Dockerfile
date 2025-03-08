FROM node:18-bullseye-slim

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

# Expor a porta 3001
EXPOSE 3001

# Iniciar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "start:dev"] 