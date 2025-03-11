# Usar a imagem blueriver/nextjs como base
FROM blueriver/nextjs:latest

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar o restante dos arquivos
COPY . .

# Definir variáveis de ambiente para o servidor
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD ["npm", "run", "dev"] 