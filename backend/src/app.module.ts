import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { InterventionsModule } from './modules/interventions/interventions.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { TeamsModule } from './modules/teams/teams.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { CommunicationsModule } from './modules/communications/communications.module';
import { ReferralsModule } from './modules/referrals/referrals.module';
import { DificuldadesAprendizagemModule } from './modules/dificuldades-aprendizagem/dificuldades-aprendizagem.module';
import { ScreeningInstrumentsModule } from './modules/screening-instruments/screening-instruments.module';
import { ScreeningsModule } from './modules/screenings/screenings.module';
import { ScreeningResultsModule } from './modules/screening-results/screening-results.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { BaseInterventionsModule } from './modules/base-interventions/base-interventions.module';
import { InterventionProtocolsModule } from './modules/intervention-protocols/intervention-protocols.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    AssessmentsModule,
    InterventionsModule,
    DashboardModule,
    IntegrationsModule,
    TeamsModule,
    MeetingsModule,
    CommunicationsModule,
    ReferralsModule,
    DificuldadesAprendizagemModule,
    ScreeningInstrumentsModule,
    ScreeningsModule,
    ScreeningResultsModule,
    BaseInterventionsModule,
    InterventionProtocolsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
