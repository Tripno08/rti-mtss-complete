import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../prisma/prisma.module';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { GoogleClassroomService } from './services/google-classroom.service';
import { MicrosoftTeamsService } from './services/microsoft-teams.service';
import { LtiService } from './services/lti.service';
import { WebhooksService } from './services/webhooks.service';

@Module({
  imports: [
    PrismaModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [IntegrationsController],
  providers: [
    IntegrationsService,
    GoogleClassroomService,
    MicrosoftTeamsService,
    LtiService,
    WebhooksService,
  ],
  exports: [
    IntegrationsService,
    GoogleClassroomService,
    MicrosoftTeamsService,
    LtiService,
    WebhooksService,
  ],
})
export class IntegrationsModule {} 