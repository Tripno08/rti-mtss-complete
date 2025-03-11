import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DificuldadesAprendizagemService } from './dificuldades-aprendizagem.service';
import { CreateDificuldadeAprendizagemDto } from './dto/create-dificuldade-aprendizagem.dto';
import { UpdateDificuldadeAprendizagemDto } from './dto/update-dificuldade-aprendizagem.dto';
import { CreateEstudanteDificuldadeDto } from './dto/create-estudante-dificuldade.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dificuldades-aprendizagem')
@UseGuards(JwtAuthGuard)
export class DificuldadesAprendizagemController {
  constructor(private readonly dificuldadesService: DificuldadesAprendizagemService) {}

  @Post()
  create(@Body() createDificuldadeDto: CreateDificuldadeAprendizagemDto) {
    return this.dificuldadesService.create(createDificuldadeDto);
  }

  @Get()
  findAll() {
    return this.dificuldadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dificuldadesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDificuldadeDto: UpdateDificuldadeAprendizagemDto,
  ) {
    return this.dificuldadesService.update(id, updateDificuldadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dificuldadesService.remove(id);
  }

  @Post('associar-estudante')
  associarAEstudante(@Body() createEstudanteDificuldadeDto: CreateEstudanteDificuldadeDto) {
    return this.dificuldadesService.associarAEstudante(createEstudanteDificuldadeDto);
  }
} 