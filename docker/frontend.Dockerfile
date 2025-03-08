FROM node:18-alpine

# Adiciona dependências necessárias
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Cria diretório .next e configura permissões
RUN mkdir -p .next && chown -R node:node .

# Define o usuário node
USER node

# Instala dependências primeiro
COPY --chown=node:node package*.json ./
RUN npm install

# Copia o resto dos arquivos
COPY --chown=node:node . .

# Configura as variáveis de ambiente
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development

# Expõe a porta
EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "dev", "--", "--port", "3000", "--hostname", "0.0.0.0"] 