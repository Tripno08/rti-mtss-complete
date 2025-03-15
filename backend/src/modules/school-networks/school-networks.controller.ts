import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SchoolNetworksService } from './school-networks.service';
import { CreateSchoolNetworkDto } from './dto/create-school-network.dto';
import { UpdateSchoolNetworkDto } from './dto/update-school-network.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('school-networks')
@Controller('school-networks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SchoolNetworksController {
  constructor(private readonly schoolNetworksService: SchoolNetworksService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova rede escolar' })
  @ApiResponse({ status: 201, description: 'Rede escolar criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  create(@Body() createSchoolNetworkDto: CreateSchoolNetworkDto) {
    return this.schoolNetworksService.create(createSchoolNetworkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as redes escolares' })
  @ApiResponse({ status: 200, description: 'Lista de redes escolares retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll() {
    return this.schoolNetworksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma rede escolar pelo ID' })
  @ApiResponse({ status: 200, description: 'Rede escolar encontrada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Rede escolar não encontrada' })
  findOne(@Param('id') id: string) {
    return this.schoolNetworksService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar uma rede escolar' })
  @ApiResponse({ status: 200, description: 'Rede escolar atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({ status: 404, description: 'Rede escolar não encontrada' })
  update(@Param('id') id: string, @Body() updateSchoolNetworkDto: UpdateSchoolNetworkDto) {
    return this.schoolNetworksService.update(id, updateSchoolNetworkDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover uma rede escolar' })
  @ApiResponse({ status: 200, description: 'Rede escolar removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({ status: 404, description: 'Rede escolar não encontrada' })
  @ApiResponse({ status: 400, description: 'Não é possível remover uma rede com escolas associadas' })
  remove(@Param('id') id: string) {
    return this.schoolNetworksService.remove(id);
  }
} 