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

# Criar um novo app.module.js com os módulos corretos
RUN echo '"use strict";' > dist/app.module.js && \
    echo 'var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {' >> dist/app.module.js && \
    echo '    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;' >> dist/app.module.js && \
    echo '    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);' >> dist/app.module.js && \
    echo '    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;' >> dist/app.module.js && \
    echo '    return c > 3 && r && Object.defineProperty(target, key, r), r;' >> dist/app.module.js && \
    echo '};' >> dist/app.module.js && \
    echo 'Object.defineProperty(exports, "__esModule", { value: true });' >> dist/app.module.js && \
    echo 'exports.AppModule = void 0;' >> dist/app.module.js && \
    echo 'const common_1 = require("@nestjs/common");' >> dist/app.module.js && \
    echo 'const config_1 = require("@nestjs/config");' >> dist/app.module.js && \
    echo 'const app_controller_1 = require("./app.controller");' >> dist/app.module.js && \
    echo 'const app_service_1 = require("./app.service");' >> dist/app.module.js && \
    echo 'const prisma_module_1 = require("./prisma/prisma.module");' >> dist/app.module.js && \
    echo 'const auth_module_1 = require("./modules/auth/auth.module");' >> dist/app.module.js && \
    echo 'const users_module_1 = require("./modules/users/users.module");' >> dist/app.module.js && \
    echo 'const students_module_1 = require("./modules/students/students.module");' >> dist/app.module.js && \
    echo 'const assessments_module_1 = require("./modules/assessments/assessments.module");' >> dist/app.module.js && \
    echo 'const interventions_module_1 = require("./modules/interventions/interventions.module");' >> dist/app.module.js && \
    echo 'const dashboard_module_1 = require("./modules/dashboard/dashboard.module");' >> dist/app.module.js && \
    echo 'const integrations_module_1 = require("./modules/integrations/integrations.module");' >> dist/app.module.js && \
    echo 'const teams_module_1 = require("./modules/teams/teams.module");' >> dist/app.module.js && \
    echo 'const meetings_module_1 = require("./modules/meetings/meetings.module");' >> dist/app.module.js && \
    echo 'const logger_middleware_1 = require("./middleware/logger.middleware");' >> dist/app.module.js && \
    echo '' >> dist/app.module.js && \
    echo 'let AppModule = class AppModule {' >> dist/app.module.js && \
    echo '    configure(consumer) {' >> dist/app.module.js && \
    echo '        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes("*");' >> dist/app.module.js && \
    echo '    }' >> dist/app.module.js && \
    echo '};' >> dist/app.module.js && \
    echo 'exports.AppModule = AppModule;' >> dist/app.module.js && \
    echo 'exports.AppModule = AppModule = __decorate([' >> dist/app.module.js && \
    echo '    (0, common_1.Module)({' >> dist/app.module.js && \
    echo '        imports: [' >> dist/app.module.js && \
    echo '            config_1.ConfigModule.forRoot({' >> dist/app.module.js && \
    echo '                isGlobal: true,' >> dist/app.module.js && \
    echo '            }),' >> dist/app.module.js && \
    echo '            prisma_module_1.PrismaModule,' >> dist/app.module.js && \
    echo '            auth_module_1.AuthModule,' >> dist/app.module.js && \
    echo '            users_module_1.UsersModule,' >> dist/app.module.js && \
    echo '            students_module_1.StudentsModule,' >> dist/app.module.js && \
    echo '            assessments_module_1.AssessmentsModule,' >> dist/app.module.js && \
    echo '            interventions_module_1.InterventionsModule,' >> dist/app.module.js && \
    echo '            dashboard_module_1.DashboardModule,' >> dist/app.module.js && \
    echo '            integrations_module_1.IntegrationsModule,' >> dist/app.module.js && \
    echo '            teams_module_1.TeamsModule,' >> dist/app.module.js && \
    echo '            meetings_module_1.MeetingsModule,' >> dist/app.module.js && \
    echo '        ],' >> dist/app.module.js && \
    echo '        controllers: [app_controller_1.AppController],' >> dist/app.module.js && \
    echo '        providers: [app_service_1.AppService],' >> dist/app.module.js && \
    echo '    })' >> dist/app.module.js && \
    echo '], AppModule);' >> dist/app.module.js && \
    echo '//# sourceMappingURL=app.module.js.map' >> dist/app.module.js

# Configurar permissões corretas
RUN chmod -R 777 /app/node_modules/.prisma

# Configurar usuário não-root
USER node

EXPOSE 3001

# Script para aguardar MySQL e iniciar a aplicação
CMD sh -c 'while ! nc -z mysql 3306; do sleep 1; done && npx prisma generate && npm run start:prod' 