FROM node:18-slim

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install --legacy-peer-deps
RUN npm install -g tailwindcss postcss autoprefixer

# Copiar o restante dos arquivos
COPY . .

# Configurar PostCSS e Tailwind
RUN npx tailwindcss init -p

# Definir variáveis de ambiente para o servidor
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

# Expor porta 3002
EXPOSE 3002

# Comando para iniciar o aplicativo
CMD ["npm", "run", "dev"] 