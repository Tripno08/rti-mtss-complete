import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('integrations')
@Controller('integrations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todas as integrações' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de integrações retornada com sucesso' })
  async findAll() {
    return this.integrationsService.findAllIntegrations();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Buscar uma integração pelo ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Integração encontrada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Integração não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.integrationsService.findIntegrationById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova integração' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Integração criada com sucesso' })
  async create(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationsService.createIntegration(createIntegrationDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar uma integração existente' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Integração atualizada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Integração não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updateIntegrationDto: UpdateIntegrationDto,
  ) {
    return this.integrationsService.updateIntegration(id, updateIntegrationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Excluir uma integração' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Integração excluída com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Integração não encontrada' })
  async remove(@Param('id') id: string) {
    return this.integrationsService.deleteIntegration(id);
  }
} 