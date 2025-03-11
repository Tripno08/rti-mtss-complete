import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDificuldadeAprendizagemDto } from './dto/create-dificuldade-aprendizagem.dto';
import { UpdateDificuldadeAprendizagemDto } from './dto/update-dificuldade-aprendizagem.dto';
import { CreateEstudanteDificuldadeDto } from './dto/create-estudante-dificuldade.dto';

@Injectable()
export class DificuldadesAprendizagemService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma nova dificuldade de aprendizagem
   */
  async create(createDificuldadeDto: CreateDificuldadeAprendizagemDto) {
    return this.prisma.dificuldadeAprendizagem.create({
      data: {
        nome: createDificuldadeDto.nome,
        descricao: createDificuldadeDto.descricao,
        sintomas: createDificuldadeDto.sintomas,
        categoria: createDificuldadeDto.categoria,
      },
    });
  }

  /**
   * Busca todas as dificuldades de aprendizagem
   */
  async findAll() {
    return this.prisma.dificuldadeAprendizagem.findMany({
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Busca uma dificuldade de aprendizagem específica por ID
   */
  async findOne(id: string) {
    const dificuldade = await this.prisma.dificuldadeAprendizagem.findUnique({
      where: { id },
      include: {
        estudanteDificuldades: {
          include: {
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

    if (!dificuldade) {
      throw new NotFoundException('Dificuldade de aprendizagem não encontrada');
    }

    return dificuldade;
  }

  /**
   * Atualiza uma dificuldade de aprendizagem
   */
  async update(id: string, updateDificuldadeDto: UpdateDificuldadeAprendizagemDto) {
    // Verificar se a dificuldade existe
    await this.findOne(id);

    // Preparar os dados para atualização
    const data: any = {};
    if (updateDificuldadeDto.nome) data.nome = updateDificuldadeDto.nome;
    if (updateDificuldadeDto.descricao) data.descricao = updateDificuldadeDto.descricao;
    if (updateDificuldadeDto.sintomas) data.sintomas = updateDificuldadeDto.sintomas;
    if (updateDificuldadeDto.categoria) data.categoria = updateDificuldadeDto.categoria;

    // Atualizar dificuldade
    return this.prisma.dificuldadeAprendizagem.update({
      where: { id },
      data,
    });
  }

  /**
   * Remove uma dificuldade de aprendizagem
   */
  async remove(id: string) {
    // Verificar se a dificuldade existe
    await this.findOne(id);

    // Verificar se existem associações com estudantes
    const associacoes = await this.prisma.estudanteDificuldade.findMany({
      where: { dificuldadeId: id },
    });

    if (associacoes.length > 0) {
      throw new NotFoundException(
        'Não é possível remover esta dificuldade pois ela está associada a estudantes',
      );
    }

    // Remover dificuldade
    await this.prisma.dificuldadeAprendizagem.delete({
      where: { id },
    });

    return { message: 'Dificuldade de aprendizagem removida com sucesso' };
  }

  /**
   * Associa uma dificuldade de aprendizagem a um estudante
   */
  async associarAEstudante(createEstudanteDificuldadeDto: CreateEstudanteDificuldadeDto) {
    // Verificar se o estudante existe
    const estudante = await this.prisma.student.findUnique({
      where: { id: createEstudanteDificuldadeDto.estudanteId },
    });

    if (!estudante) {
      throw new NotFoundException('Estudante não encontrado');
    }

    // Verificar se a dificuldade existe
    const dificuldade = await this.prisma.dificuldadeAprendizagem.findUnique({
      where: { id: createEstudanteDificuldadeDto.dificuldadeId },
    });

    if (!dificuldade) {
      throw new NotFoundException('Dificuldade de aprendizagem não encontrada');
    }

    // Verificar se já existe uma associação
    const associacaoExistente = await this.prisma.estudanteDificuldade.findFirst({
      where: {
        estudanteId: createEstudanteDificuldadeDto.estudanteId,
        dificuldadeId: createEstudanteDificuldadeDto.dificuldadeId,
      },
    });

    if (associacaoExistente) {
      throw new NotFoundException('Esta dificuldade já está associada a este estudante');
    }

    // Criar a associação
    return this.prisma.estudanteDificuldade.create({
      data: {
        estudanteId: createEstudanteDificuldadeDto.estudanteId,
        dificuldadeId: createEstudanteDificuldadeDto.dificuldadeId,
        nivel: createEstudanteDificuldadeDto.nivel,
        observacoes: createEstudanteDificuldadeDto.observacoes,
      },
      include: {
        estudante: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
        dificuldade: true,
      },
    });
  }
} 