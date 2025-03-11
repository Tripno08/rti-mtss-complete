import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScreeningResultDto } from './dto/create-screening-result.dto';
import { UpdateScreeningResultDto } from './dto/update-screening-result.dto';
import { StatusRastreio } from '../screenings/entities/status-rastreio.enum';

@Injectable()
export class ScreeningResultsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo resultado de rastreio
   */
  async create(createDto: CreateScreeningResultDto) {
    // Verificar se o rastreio existe
    const rastreio = await this.prisma.screening.findUnique({
      where: { id: createDto.rastreioId },
    });

    if (!rastreio) {
      throw new NotFoundException('Rastreio não encontrado');
    }

    // Verificar se o indicador existe
    const indicador = await this.prisma.screeningIndicator.findUnique({
      where: { id: createDto.indicadorId },
    });

    if (!indicador) {
      throw new NotFoundException('Indicador de rastreio não encontrado');
    }

    // Verificar se o indicador pertence ao instrumento do rastreio
    if (indicador.instrumentoId !== rastreio.instrumentoId) {
      throw new NotFoundException('O indicador não pertence ao instrumento deste rastreio');
    }

    // Verificar se já existe um resultado para este indicador neste rastreio
    const resultadoExistente = await this.prisma.screeningResult.findFirst({
      where: {
        rastreioId: createDto.rastreioId,
        indicadorId: createDto.indicadorId,
      },
    });

    if (resultadoExistente) {
      // Atualizar o resultado existente
      return this.prisma.screeningResult.update({
        where: { id: resultadoExistente.id },
        data: {
          valor: createDto.valor,
          nivelRisco: createDto.nivelRisco,
          observacoes: createDto.observacoes,
        },
        include: {
          rastreio: {
            select: {
              id: true,
              dataAplicacao: true,
              status: true,
            },
          },
          indicador: {
            select: {
              id: true,
              nome: true,
              tipo: true,
              pontoCorte: true,
            },
          },
        },
      });
    }

    // Criar um novo resultado
    return this.prisma.screeningResult.create({
      data: {
        valor: createDto.valor,
        nivelRisco: createDto.nivelRisco,
        observacoes: createDto.observacoes,
        rastreioId: createDto.rastreioId,
        indicadorId: createDto.indicadorId,
      },
      include: {
        rastreio: {
          select: {
            id: true,
            dataAplicacao: true,
            status: true,
          },
        },
        indicador: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            pontoCorte: true,
          },
        },
      },
    });
  }

  /**
   * Lista todos os resultados de rastreio
   */
  async findAll(rastreioId?: string) {
    const where = rastreioId ? { rastreioId } : {};

    return this.prisma.screeningResult.findMany({
      where,
      include: {
        rastreio: {
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
        indicador: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            pontoCorte: true,
          },
        },
      },
    });
  }

  /**
   * Busca um resultado de rastreio pelo ID
   */
  async findOne(id: string) {
    const resultado = await this.prisma.screeningResult.findUnique({
      where: { id },
      include: {
        rastreio: {
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
        indicador: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            pontoCorte: true,
            instrumento: {
              select: {
                id: true,
                nome: true,
                categoria: true,
              },
            },
          },
        },
      },
    });

    if (!resultado) {
      throw new NotFoundException('Resultado de rastreio não encontrado');
    }

    return resultado;
  }

  /**
   * Atualiza um resultado de rastreio
   */
  async update(id: string, updateDto: UpdateScreeningResultDto) {
    // Verificar se o resultado existe
    await this.findOne(id);

    // Preparar os dados para atualização
    const data: any = {};
    if (updateDto.valor !== undefined) data.valor = updateDto.valor;
    if (updateDto.nivelRisco !== undefined) data.nivelRisco = updateDto.nivelRisco;
    if (updateDto.observacoes !== undefined) data.observacoes = updateDto.observacoes;

    // Atualizar resultado
    return this.prisma.screeningResult.update({
      where: { id },
      data,
      include: {
        rastreio: {
          select: {
            id: true,
            dataAplicacao: true,
            status: true,
          },
        },
        indicador: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            pontoCorte: true,
          },
        },
      },
    });
  }

  /**
   * Remove um resultado de rastreio
   */
  async remove(id: string) {
    // Verificar se o resultado existe
    await this.findOne(id);

    // Remover o resultado
    await this.prisma.screeningResult.delete({
      where: { id },
    });

    return { message: 'Resultado de rastreio removido com sucesso' };
  }

  /**
   * Registra resultados em lote para um rastreio
   */
  async registerBatch(rastreioId: string, resultados: Array<{
    indicadorId: string;
    valor: number;
    nivelRisco?: string;
    observacoes?: string;
  }>) {
    // Verificar se o rastreio existe
    const rastreio = await this.prisma.screening.findUnique({
      where: { id: rastreioId },
      include: {
        instrumento: {
          include: {
            indicadores: true,
          },
        },
      },
    });

    if (!rastreio) {
      throw new NotFoundException('Rastreio não encontrado');
    }

    // Verificar se todos os indicadores pertencem ao instrumento do rastreio
    const indicadoresDoInstrumento = rastreio.instrumento.indicadores.map(i => i.id);
    
    for (const resultado of resultados) {
      if (!indicadoresDoInstrumento.includes(resultado.indicadorId)) {
        throw new NotFoundException(`O indicador ${resultado.indicadorId} não pertence ao instrumento deste rastreio`);
      }
    }

    // Criar ou atualizar os resultados
    const operacoes = resultados.map(resultado => 
      this.prisma.screeningResult.upsert({
        where: {
          rastreioId_indicadorId: {
            rastreioId,
            indicadorId: resultado.indicadorId,
          },
        },
        create: {
          valor: resultado.valor,
          nivelRisco: resultado.nivelRisco,
          observacoes: resultado.observacoes,
          rastreioId,
          indicadorId: resultado.indicadorId,
        },
        update: {
          valor: resultado.valor,
          nivelRisco: resultado.nivelRisco,
          observacoes: resultado.observacoes,
        },
      })
    );

    await this.prisma.$transaction(operacoes);

    // Atualizar o status do rastreio para concluído se todos os indicadores tiverem resultados
    const todosIndicadoresRespondidos = await this.verificarTodosIndicadoresRespondidos(rastreioId);
    
    if (todosIndicadoresRespondidos) {
      await this.prisma.screening.update({
        where: { id: rastreioId },
        data: { status: StatusRastreio.CONCLUIDO },
      });
    }

    return { message: 'Resultados registrados com sucesso' };
  }

  /**
   * Verifica se todos os indicadores do instrumento têm resultados registrados
   */
  private async verificarTodosIndicadoresRespondidos(rastreioId: string): Promise<boolean> {
    const rastreio = await this.prisma.screening.findUnique({
      where: { id: rastreioId },
      include: {
        instrumento: {
          include: {
            indicadores: {
              select: { id: true },
            },
          },
        },
        resultados: {
          select: { indicadorId: true },
        },
      },
    });

    if (!rastreio) return false;

    const totalIndicadores = rastreio.instrumento.indicadores.length;
    const totalResultados = rastreio.resultados.length;

    return totalResultados >= totalIndicadores;
  }

  /**
   * Busca resultados de rastreio por estudante
   */
  async findByStudent(estudanteId: string) {
    // Verificar se o estudante existe
    const estudante = await this.prisma.student.findUnique({
      where: { id: estudanteId },
    });

    if (!estudante) {
      throw new NotFoundException('Estudante não encontrado');
    }

    // Buscar todos os rastreios concluídos do estudante
    const rastreios = await this.prisma.screening.findMany({
      where: {
        estudanteId,
        status: StatusRastreio.CONCLUIDO,
      },
      orderBy: { dataAplicacao: 'desc' },
      include: {
        instrumento: {
          select: {
            id: true,
            nome: true,
            categoria: true,
          },
        },
        resultados: {
          include: {
            indicador: true,
          },
        },
      },
    });

    return {
      estudante: {
        id: estudante.id,
        nome: estudante.name,
        serie: estudante.grade,
      },
      rastreios: rastreios.map(rastreio => ({
        id: rastreio.id,
        data: rastreio.dataAplicacao,
        instrumento: {
          id: rastreio.instrumento.id,
          nome: rastreio.instrumento.nome,
          categoria: rastreio.instrumento.categoria,
        },
        resultados: rastreio.resultados.map(resultado => ({
          id: resultado.id,
          indicador: resultado.indicador.nome,
          valor: resultado.valor,
          pontoCorte: resultado.indicador.pontoCorte,
          nivelRisco: resultado.nivelRisco,
          acimaDoPontoCorte: resultado.valor >= resultado.indicador.pontoCorte,
        })),
      })),
    };
  }
} 