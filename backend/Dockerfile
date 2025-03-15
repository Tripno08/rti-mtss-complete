FROM node:18-slim

WORKDIR /app

# Instalar dependências necessárias
RUN apt-get update && apt-get install -y \
    openssl \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copiar o código fonte
COPY . .

# Instalar dependências
RUN npm install

# Gerar o cliente Prisma
RUN npx prisma generate

# Criar diretório dist
RUN mkdir -p dist

# Copiar arquivos fonte para dist
RUN cp -r src/* dist/

# Dar permissões ao diretório .prisma
RUN chmod -R 777 /app/node_modules/.prisma

# Modificar o serviço de usuários para não incluir o relacionamento com a escola
RUN sed -i 's/include: {/select: {/g' dist/modules/users/users.service.js
RUN sed -i 's/school: true,/id: true, email: true, password: true, name: true, role: true, createdAt: true, updatedAt: true,/g' dist/modules/users/users.service.js

# Criar script para inicialização
RUN echo '#!/bin/bash\n\
echo "Aguardando MySQL..."\n\
while ! nc -z mysql 3306; do sleep 1; done\n\
echo "MySQL está pronto!"\n\
\n\
echo "Gerando cliente Prisma..."\n\
npx prisma generate\n\
\n\
echo "Iniciando aplicação..."\n\
npm run start:prod' > /app/start.sh && chmod +x /app/start.sh

# Configurar usuário não-root
USER node

EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["/app/start.sh"] 