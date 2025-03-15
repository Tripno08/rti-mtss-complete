import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('schools')
@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova escola' })
  @ApiResponse({ status: 201, description: 'Escola criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as escolas' })
  @ApiResponse({ status: 200, description: 'Lista de escolas retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma escola pelo ID' })
  @ApiResponse({ status: 200, description: 'Escola encontrada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Escola não encontrada' })
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar uma escola' })
  @ApiResponse({ status: 200, description: 'Escola atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({ status: 404, description: 'Escola não encontrada' })
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover uma escola' })
  @ApiResponse({ status: 200, description: 'Escola removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({ status: 404, description: 'Escola não encontrada' })
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(id);
  }

  @Get('network/:networkId')
  @ApiOperation({ summary: 'Listar escolas por rede' })
  @ApiResponse({ status: 200, description: 'Lista de escolas retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findByNetwork(@Param('networkId') networkId: string) {
    return this.schoolsService.findByNetwork(networkId);
  }
} 