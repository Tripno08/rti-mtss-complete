import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { StatusRastreio } from './entities/status-rastreio.enum';

@Injectable()
export class ScreeningsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo rastreio
   */
  async create(createDto: CreateScreeningDto, aplicadorId: string) {
    // Verificar se o estudante existe
    const estudante = await this.prisma.student.findUnique({
      where: { id: createDto.estudanteId },
    });

    if (!estudante) {
      throw new NotFoundException('Estudante não encontrado');
    }

    // Verificar se o instrumento existe
    const instrumento = await this.prisma.screeningInstrument.findUnique({
      where: { id: createDto.instrumentoId },
    });

    if (!instrumento) {
      throw new NotFoundException('Instrumento de rastreio não encontrado');
    }

    // Criar o rastreio
    return this.prisma.screening.create({
      data: {
        dataAplicacao: new Date(createDto.dataAplicacao),
        observacoes: createDto.observacoes,
        status: createDto.status || StatusRastreio.EM_ANDAMENTO,
        estudanteId: createDto.estudanteId,
        aplicadorId,
        instrumentoId: createDto.instrumentoId,
      },
      include: {
        estudante: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
        instrumento: {
          select: {
            id: true,
            nome: true,
            categoria: true,
          },
        },
      },
    });
  }

  /**
   * Lista todos os rastreios
   */
  async findAll(filters?: {
    estudanteId?: string;
    aplicadorId?: string;
    instrumentoId?: string;
    status?: StatusRastreio;
  }) {
    const where: any = {};

    if (filters) {
      if (filters.estudanteId) where.estudanteId = filters.estudanteId;
      if (filters.aplicadorId) where.aplicadorId = filters.aplicadorId;
      if (filters.instrumentoId) where.instrumentoId = filters.instrumentoId;
      if (filters.status) where.status = filters.status;
    }

    return this.prisma.screening.findMany({
      where,
      orderBy: { dataAplicacao: 'desc' },
      include: {
        estudante: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
        aplicador: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        instrumento: {
          select: {
            id: true,
            nome: true,
            categoria: true,
          },
        },
        resultados: {
          select: {
            id: true,
            valor: true,
            nivelRisco: true,
            indicador: {
              select: {
                id: true,
                nome: true,
                pontoCorte: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Busca um rastreio pelo ID
   */
  async findOne(id: string) {
    const rastreio = await this.prisma.screening.findUnique({
      where: { id },
      include: {
        estudante: {
          select: {
            id: true,
            name: true,
            grade: true,
            dateOfBirth: true,
          },
        },
        aplicador: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        instrumento: {
          include: {
            indicadores: true,
          },
        },
        resultados: {
          include: {
            indicador: true,
          },
        },
      },
    });

    if (!rastreio) {
      throw new NotFoundException('Rastreio não encontrado');
    }

    return rastreio;
  }

  /**
   * Atualiza um rastreio
   */
  async update(id: string, updateDto: UpdateScreeningDto) {
    // Verificar se o rastreio existe
    await this.findOne(id);

    // Preparar os dados para atualização
    const data: any = {};
    if (updateDto.dataAplicacao !== undefined) data.dataAplicacao = new Date(updateDto.dataAplicacao);
    if (updateDto.observacoes !== undefined) data.observacoes = updateDto.observacoes;
    if (updateDto.status !== undefined) data.status = updateDto.status;

    // Atualizar rastreio
    return this.prisma.screening.update({
      where: { id },
      data,
      include: {
        estudante: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
        instrumento: {
          select: {
            id: true,
            nome: true,
            categoria: true,
          },
        },
      },
    });
  }

  /**
   * Remove um rastreio
   */
  async remove(id: string) {
    // Verificar se o rastreio existe
    const rastreio = await this.findOne(id);

    // Verificar se existem resultados associados
    if (rastreio.resultados.length > 0) {
      // Remover os resultados primeiro
      await this.prisma.screeningResult.deleteMany({
        where: { rastreioId: id },
      });
    }

    // Remover o rastreio
    await this.prisma.screening.delete({
      where: { id },
    });

    return { message: 'Rastreio removido com sucesso' };
  }

  /**
   * Obtém resultados agregados de rastreios por estudante
   */
  async getStudentResults(estudanteId: string) {
    // Verificar se o estudante existe
    const estudante = await this.prisma.student.findUnique({
      where: { id: estudanteId },
    });

    if (!estudante) {
      throw new NotFoundException('Estudante não encontrado');
    }

    // Buscar todos os rastreios do estudante
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

    // Agrupar por categoria de instrumento
    const resultadosPorCategoria = {};
    
    rastreios.forEach(rastreio => {
      const categoria = rastreio.instrumento.categoria;
      
      if (!resultadosPorCategoria[categoria]) {
        resultadosPorCategoria[categoria] = [];
      }
      
      resultadosPorCategoria[categoria].push({
        id: rastreio.id,
        data: rastreio.dataAplicacao,
        instrumento: rastreio.instrumento.nome,
        resultados: rastreio.resultados.map(resultado => ({
          indicador: resultado.indicador.nome,
          valor: resultado.valor,
          pontoCorte: resultado.indicador.pontoCorte,
          nivelRisco: resultado.nivelRisco,
          acimaDoPontoCorte: resultado.valor >= resultado.indicador.pontoCorte,
        })),
      });
    });

    return {
      estudante: {
        id: estudante.id,
        nome: estudante.name,
        serie: estudante.grade,
      },
      resultadosPorCategoria,
    };
  }

  /**
   * Obtém estatísticas gerais de rastreios
   */
  async getStatistics() {
    // Total de rastreios por status
    const rastreiosPorStatus = await this.prisma.screening.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // Total de rastreios por categoria de instrumento
    const rastreiosPorCategoria = await this.prisma.$queryRaw`
      SELECT i.categoria, COUNT(s.id) as total
      FROM screenings s
      JOIN screening_instruments i ON s.instrumentoId = i.id
      GROUP BY i.categoria
    `;

    // Estudantes com mais rastreios
    const estudantesComMaisRastreios = await this.prisma.$queryRaw`
      SELECT s.estudanteId, st.name, COUNT(s.id) as total
      FROM screenings s
      JOIN students st ON s.estudanteId = st.id
      GROUP BY s.estudanteId, st.name
      ORDER BY total DESC
      LIMIT 5
    `;

    return {
      rastreiosPorStatus,
      rastreiosPorCategoria,
      estudantesComMaisRastreios,
    };
  }
} 