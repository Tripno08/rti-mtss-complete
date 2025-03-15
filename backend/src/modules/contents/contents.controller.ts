import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@ApiTags('contents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo conteúdo' })
  @ApiResponse({ status: 201, description: 'Conteúdo criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentsService.create(createContentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os conteúdos' })
  @ApiResponse({ status: 200, description: 'Lista de conteúdos retornada com sucesso.' })
  findAll() {
    return this.contentsService.findAll();
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Listar conteúdos por turma' })
  @ApiResponse({ status: 200, description: 'Lista de conteúdos da turma retornada com sucesso.' })
  findByClass(@Param('classId') classId: string) {
    return this.contentsService.findByClass(classId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um conteúdo pelo ID' })
  @ApiResponse({ status: 200, description: 'Conteúdo encontrado.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.contentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um conteúdo' })
  @ApiResponse({ status: 200, description: 'Conteúdo atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentsService.update(id, updateContentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um conteúdo' })
  @ApiResponse({ status: 200, description: 'Conteúdo removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Conteúdo não encontrado.' })
  remove(@Param('id') id: string) {
    return this.contentsService.remove(id);
  }
} 