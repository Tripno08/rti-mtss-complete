import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScreeningResultsService } from './screening-results.service';
import { CreateScreeningResultDto } from './dto/create-screening-result.dto';
import { UpdateScreeningResultDto } from './dto/update-screening-result.dto';

@ApiTags('Resultados de Rastreio')
@Controller('screening-results')
@UseGuards(JwtAuthGuard)
export class ScreeningResultsController {
  constructor(private readonly resultsService: ScreeningResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo resultado de rastreio' })
  @ApiResponse({ status: 201, description: 'Resultado criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Rastreio ou indicador não encontrado' })
  create(@Body() createDto: CreateScreeningResultDto) {
    return this.resultsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os resultados de rastreio' })
  @ApiQuery({ name: 'rastreioId', required: false, description: 'Filtrar por rastreio' })
  @ApiResponse({ status: 200, description: 'Lista de resultados retornada com sucesso' })
  findAll(@Query('rastreioId') rastreioId?: string) {
    return this.resultsService.findAll(rastreioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um resultado de rastreio pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do resultado' })
  @ApiResponse({ status: 200, description: 'Resultado encontrado' })
  @ApiResponse({ status: 404, description: 'Resultado não encontrado' })
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um resultado de rastreio' })
  @ApiParam({ name: 'id', description: 'ID do resultado' })
  @ApiResponse({ status: 200, description: 'Resultado atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Resultado não encontrado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateScreeningResultDto) {
    return this.resultsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um resultado de rastreio' })
  @ApiParam({ name: 'id', description: 'ID do resultado' })
  @ApiResponse({ status: 200, description: 'Resultado removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Resultado não encontrado' })
  remove(@Param('id') id: string) {
    return this.resultsService.remove(id);
  }

  @Post('batch/:rastreioId')
  @ApiOperation({ summary: 'Registrar resultados em lote para um rastreio' })
  @ApiParam({ name: 'rastreioId', description: 'ID do rastreio' })
  @ApiResponse({ status: 201, description: 'Resultados registrados com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Rastreio ou indicador não encontrado' })
  registerBatch(
    @Param('rastreioId') rastreioId: string,
    @Body() resultados: Array<{
      indicadorId: string;
      valor: number;
      nivelRisco?: string;
      observacoes?: string;
    }>,
  ) {
    return this.resultsService.registerBatch(rastreioId, resultados);
  }

  @Get('student/:estudanteId')
  @ApiOperation({ summary: 'Buscar resultados de rastreio por estudante' })
  @ApiParam({ name: 'estudanteId', description: 'ID do estudante' })
  @ApiResponse({ status: 200, description: 'Resultados encontrados' })
  @ApiResponse({ status: 404, description: 'Estudante não encontrado' })
  findByStudent(@Param('estudanteId') estudanteId: string) {
    return this.resultsService.findByStudent(estudanteId);
  }
} 