import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScreeningInstrumentsService } from './screening-instruments.service';
import { CreateScreeningInstrumentDto } from './dto/create-screening-instrument.dto';
import { UpdateScreeningInstrumentDto } from './dto/update-screening-instrument.dto';
import { CreateScreeningIndicatorDto } from './dto/create-screening-indicator.dto';

@ApiTags('Instrumentos de Rastreio')
@Controller('screening-instruments')
@UseGuards(JwtAuthGuard)
export class ScreeningInstrumentsController {
  constructor(private readonly instrumentsService: ScreeningInstrumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo instrumento de rastreio' })
  @ApiResponse({ status: 201, description: 'Instrumento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createDto: CreateScreeningInstrumentDto) {
    return this.instrumentsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os instrumentos de rastreio' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean, description: 'Incluir instrumentos inativos' })
  @ApiResponse({ status: 200, description: 'Lista de instrumentos retornada com sucesso' })
  findAll(@Query('includeInactive') includeInactive?: string) {
    const includeInactiveBool = includeInactive === 'true';
    return this.instrumentsService.findAll(includeInactiveBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um instrumento de rastreio pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do instrumento' })
  @ApiResponse({ status: 200, description: 'Instrumento encontrado' })
  @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
  findOne(@Param('id') id: string) {
    return this.instrumentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um instrumento de rastreio' })
  @ApiParam({ name: 'id', description: 'ID do instrumento' })
  @ApiResponse({ status: 200, description: 'Instrumento atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateScreeningInstrumentDto) {
    return this.instrumentsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um instrumento de rastreio' })
  @ApiParam({ name: 'id', description: 'ID do instrumento' })
  @ApiResponse({ status: 200, description: 'Instrumento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
  remove(@Param('id') id: string) {
    return this.instrumentsService.remove(id);
  }

  @Post('indicators')
  @ApiOperation({ summary: 'Adicionar um indicador a um instrumento de rastreio' })
  @ApiResponse({ status: 201, description: 'Indicador adicionado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
  addIndicator(@Body() createDto: CreateScreeningIndicatorDto) {
    return this.instrumentsService.addIndicator(createDto);
  }

  @Get('indicators/:instrumentoId')
  @ApiOperation({ summary: 'Listar todos os indicadores de um instrumento' })
  @ApiParam({ name: 'instrumentoId', description: 'ID do instrumento' })
  @ApiResponse({ status: 200, description: 'Lista de indicadores retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Instrumento não encontrado' })
  findAllIndicators(@Param('instrumentoId') instrumentoId: string) {
    return this.instrumentsService.findAllIndicators(instrumentoId);
  }

  @Get('indicator/:id')
  @ApiOperation({ summary: 'Buscar um indicador pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do indicador' })
  @ApiResponse({ status: 200, description: 'Indicador encontrado' })
  @ApiResponse({ status: 404, description: 'Indicador não encontrado' })
  findOneIndicator(@Param('id') id: string) {
    return this.instrumentsService.findOneIndicator(id);
  }

  @Delete('indicator/:id')
  @ApiOperation({ summary: 'Remover um indicador' })
  @ApiParam({ name: 'id', description: 'ID do indicador' })
  @ApiResponse({ status: 200, description: 'Indicador removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Indicador não encontrado' })
  removeIndicator(@Param('id') id: string) {
    return this.instrumentsService.removeIndicator(id);
  }
} 