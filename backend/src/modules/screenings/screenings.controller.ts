import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScreeningsService } from './screenings.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { StatusRastreio } from './entities/status-rastreio.enum';

@ApiTags('Rastreios')
@Controller('screenings')
@UseGuards(JwtAuthGuard)
export class ScreeningsController {
  constructor(private readonly screeningsService: ScreeningsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo rastreio' })
  @ApiResponse({ status: 201, description: 'Rastreio criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Estudante ou instrumento não encontrado' })
  create(@Body() createDto: CreateScreeningDto, @Req() req) {
    const aplicadorId = req.user.id;
    return this.screeningsService.create(createDto, aplicadorId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os rastreios' })
  @ApiQuery({ name: 'estudanteId', required: false, description: 'Filtrar por estudante' })
  @ApiQuery({ name: 'aplicadorId', required: false, description: 'Filtrar por aplicador' })
  @ApiQuery({ name: 'instrumentoId', required: false, description: 'Filtrar por instrumento' })
  @ApiQuery({ name: 'status', required: false, enum: StatusRastreio, description: 'Filtrar por status' })
  @ApiResponse({ status: 200, description: 'Lista de rastreios retornada com sucesso' })
  findAll(
    @Query('estudanteId') estudanteId?: string,
    @Query('aplicadorId') aplicadorId?: string,
    @Query('instrumentoId') instrumentoId?: string,
    @Query('status') status?: StatusRastreio,
  ) {
    const filters = { estudanteId, aplicadorId, instrumentoId, status };
    return this.screeningsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um rastreio pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do rastreio' })
  @ApiResponse({ status: 200, description: 'Rastreio encontrado' })
  @ApiResponse({ status: 404, description: 'Rastreio não encontrado' })
  findOne(@Param('id') id: string) {
    return this.screeningsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um rastreio' })
  @ApiParam({ name: 'id', description: 'ID do rastreio' })
  @ApiResponse({ status: 200, description: 'Rastreio atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Rastreio não encontrado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateScreeningDto) {
    return this.screeningsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um rastreio' })
  @ApiParam({ name: 'id', description: 'ID do rastreio' })
  @ApiResponse({ status: 200, description: 'Rastreio removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Rastreio não encontrado' })
  remove(@Param('id') id: string) {
    return this.screeningsService.remove(id);
  }

  @Get('student/:estudanteId')
  @ApiOperation({ summary: 'Obter resultados agregados de rastreios por estudante' })
  @ApiParam({ name: 'estudanteId', description: 'ID do estudante' })
  @ApiResponse({ status: 200, description: 'Resultados retornados com sucesso' })
  @ApiResponse({ status: 404, description: 'Estudante não encontrado' })
  getStudentResults(@Param('estudanteId') estudanteId: string) {
    return this.screeningsService.getStudentResults(estudanteId);
  }

  @Get('statistics/general')
  @ApiOperation({ summary: 'Obter estatísticas gerais de rastreios' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso' })
  getStatistics() {
    return this.screeningsService.getStatistics();
  }
} 