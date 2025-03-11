import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScreeningInstrumentDto } from './dto/create-screening-instrument.dto';
import { UpdateScreeningInstrumentDto } from './dto/update-screening-instrument.dto';
import { CreateScreeningIndicatorDto } from './dto/create-screening-indicator.dto';

@Injectable()
export class ScreeningInstrumentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo instrumento de rastreio
   */
  async create(createDto: CreateScreeningInstrumentDto) {
    return this.prisma.screeningInstrument.create({
      data: {
        nome: createDto.nome,
        descricao: createDto.descricao,
        categoria: createDto.categoria,
        faixaEtaria: createDto.faixaEtaria,
        tempoAplicacao: createDto.tempoAplicacao,
        instrucoes: createDto.instrucoes,
        ativo: createDto.ativo,
      },
    });
  }

  /**
   * Lista todos os instrumentos de rastreio
   */
  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { ativo: true };
    
    return this.prisma.screeningInstrument.findMany({
      where,
      orderBy: { nome: 'asc' },
      include: {
        indicadores: {
          select: {
            id: true,
            nome: true,
            tipo: true,
          },
        },
      },
    });
  }

  /**
   * Busca um instrumento de rastreio pelo ID
   */
  async findOne(id: string) {
    const instrumento = await this.prisma.screeningInstrument.findUnique({
      where: { id },
      include: {
        indicadores: true,
        rastreios: {
          select: {
            id: true,
            dataAplicacao: true,
            status: true,
            estudante: {
              select: {
                id: true,
                name: true,
                grade: true,
              },
            },
          },
        },
      },
    });

    if (!instrumento) {
      throw new NotFoundException('Instrumento de rastreio não encontrado');
    }

    return instrumento;
  }

  /**
   * Atualiza um instrumento de rastreio
   */
  async update(id: string, updateDto: UpdateScreeningInstrumentDto) {
    // Verificar se o instrumento existe
    await this.findOne(id);

    // Preparar os dados para atualização
    const data: any = {};
    if (updateDto.nome !== undefined) data.nome = updateDto.nome;
    if (updateDto.descricao !== undefined) data.descricao = updateDto.descricao;
    if (updateDto.categoria !== undefined) data.categoria = updateDto.categoria;
    if (updateDto.faixaEtaria !== undefined) data.faixaEtaria = updateDto.faixaEtaria;
    if (updateDto.tempoAplicacao !== undefined) data.tempoAplicacao = updateDto.tempoAplicacao;
    if (updateDto.instrucoes !== undefined) data.instrucoes = updateDto.instrucoes;
    if (updateDto.ativo !== undefined) data.ativo = updateDto.ativo;

    // Atualizar instrumento
    return this.prisma.screeningInstrument.update({
      where: { id },
      data,
      include: {
        indicadores: {
          select: {
            id: true,
            nome: true,
            tipo: true,
          },
        },
      },
    });
  }

  /**
   * Remove um instrumento de rastreio
   */
  async remove(id: string) {
    // Verificar se o instrumento existe
    await this.findOne(id);

    // Verificar se existem rastreios associados
    const rastreios = await this.prisma.screening.findMany({
      where: { instrumentoId: id },
    });

    if (rastreios.length > 0) {
      // Em vez de excluir, apenas desativar
      return this.prisma.screeningInstrument.update({
        where: { id },
        data: { ativo: false },
      });
    }

    // Se não houver rastreios, remover o instrumento e seus indicadores
    await this.prisma.screeningIndicator.deleteMany({
      where: { instrumentoId: id },
    });

    await this.prisma.screeningInstrument.delete({
      where: { id },
    });

    return { message: 'Instrumento de rastreio removido com sucesso' };
  }

  /**
   * Adiciona um indicador a um instrumento de rastreio
   */
  async addIndicator(createDto: CreateScreeningIndicatorDto) {
    // Verificar se o instrumento existe
    await this.findOne(createDto.instrumentoId);

    return this.prisma.screeningIndicator.create({
      data: {
        nome: createDto.nome,
        descricao: createDto.descricao,
        tipo: createDto.tipo,
        valorMinimo: createDto.valorMinimo,
        valorMaximo: createDto.valorMaximo,
        pontoCorte: createDto.pontoCorte,
        instrumentoId: createDto.instrumentoId,
      },
    });
  }

  /**
   * Lista todos os indicadores de um instrumento
   */
  async findAllIndicators(instrumentoId: string) {
    // Verificar se o instrumento existe
    await this.findOne(instrumentoId);

    return this.prisma.screeningIndicator.findMany({
      where: { instrumentoId },
      orderBy: { nome: 'asc' },
    });
  }

  /**
   * Busca um indicador pelo ID
   */
  async findOneIndicator(id: string) {
    const indicador = await this.prisma.screeningIndicator.findUnique({
      where: { id },
      include: {
        instrumento: {
          select: {
            id: true,
            nome: true,
            categoria: true,
          },
        },
      },
    });

    if (!indicador) {
      throw new NotFoundException('Indicador de rastreio não encontrado');
    }

    return indicador;
  }

  /**
   * Remove um indicador
   */
  async removeIndicator(id: string) {
    // Verificar se o indicador existe
    await this.findOneIndicator(id);

    // Verificar se existem resultados associados
    const resultados = await this.prisma.screeningResult.findMany({
      where: { indicadorId: id },
    });

    if (resultados.length > 0) {
      throw new NotFoundException(
        'Não é possível remover este indicador pois existem resultados associados',
      );
    }

    // Remover o indicador
    await this.prisma.screeningIndicator.delete({
      where: { id },
    });

    return { message: 'Indicador de rastreio removido com sucesso' };
  }
} 