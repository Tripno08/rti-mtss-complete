FROM node:18

WORKDIR /app

COPY package*.json ./

# Instalar dependências
RUN npm install

# Reinstalar bcrypt para garantir compatibilidade
RUN npm uninstall bcrypt && npm install bcrypt

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"] 