FROM node:18-bullseye-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Expor a porta 3000
EXPOSE 3000

# Iniciar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "dev"] 