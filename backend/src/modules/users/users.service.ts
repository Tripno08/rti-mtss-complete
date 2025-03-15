import { Injectable, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      this.logger.log(`Criando novo usuário com email: ${createUserDto.email}`);
      
      // Verificar se o email já existe
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        this.logger.warn(`Tentativa de criar usuário com email já existente: ${createUserDto.email}`);
        throw new ConflictException('Email já está em uso');
      }

      // Validar o papel do usuário
      if (!['ADMIN', 'TEACHER', 'SPECIALIST'].includes(createUserDto.role)) {
        this.logger.warn(`Papel inválido fornecido: ${createUserDto.role}`);
        throw new BadRequestException('Papel de usuário inválido');
      }

      // Hash da senha
      let hashedPassword;
      try {
        hashedPassword = await argon2.hash(createUserDto.password);
      } catch (error) {
        this.logger.error('Erro ao fazer hash da senha', error);
        throw new InternalServerErrorException('Erro ao processar a senha');
      }

      // Criar usuário
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      this.logger.log(`Usuário criado com sucesso: ${user.id}`);

      // Remover a senha do objeto retornado
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(`Erro do Prisma ao criar usuário: ${error.code}`, error.message);
        throw new InternalServerErrorException('Erro ao criar usuário no banco de dados');
      }
      
      this.logger.error('Erro ao criar usuário', error);
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async findAll() {
    try {
      this.logger.log('Buscando todos os usuários');
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      return users;
    } catch (error) {
      this.logger.error('Erro ao buscar todos os usuários', error);
      throw new InternalServerErrorException('Erro ao buscar usuários');
    }
  }

  async findOne(id: string) {
    try {
      this.logger.log(`Buscando usuário com ID: ${id}`);
      
      if (!id || typeof id !== 'string') {
        this.logger.warn(`ID inválido fornecido: ${id}`);
        throw new BadRequestException('ID de usuário inválido');
      }
      
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user) {
        this.logger.warn(`Usuário não encontrado com ID: ${id}`);
        throw new NotFoundException('Usuário não encontrado');
      }

      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error(`Erro ao buscar usuário com ID: ${id}`, error);
      throw new InternalServerErrorException('Erro ao buscar usuário');
    }
  }

  async findByEmail(email: string) {
    try {
      this.logger.log(`Buscando usuário com email: ${email}`);
      
      if (!email || typeof email !== 'string') {
        this.logger.warn(`Email inválido fornecido: ${email}`);
        throw new BadRequestException('Email inválido');
      }
      
      return this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error(`Erro ao buscar usuário com email: ${email}`, error);
      throw new InternalServerErrorException('Erro ao buscar usuário por email');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      this.logger.log(`Atualizando usuário com ID: ${id}`);
      
      // Verificar se o usuário existe
      await this.findOne(id);

      // Validar o papel do usuário se fornecido
      if (updateUserDto.role && !['ADMIN', 'TEACHER', 'SPECIALIST'].includes(updateUserDto.role)) {
        this.logger.warn(`Papel inválido fornecido: ${updateUserDto.role}`);
        throw new BadRequestException('Papel de usuário inválido');
      }

      // Hash da senha se fornecida
      let data = { ...updateUserDto };
      if (updateUserDto.password) {
        try {
          data.password = await argon2.hash(updateUserDto.password);
        } catch (error) {
          this.logger.error('Erro ao fazer hash da senha', error);
          throw new InternalServerErrorException('Erro ao processar a senha');
        }
      }

      // Atualizar usuário
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      this.logger.log(`Usuário atualizado com sucesso: ${id}`);

      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(`Erro do Prisma ao atualizar usuário: ${error.code}`, error.message);
        throw new InternalServerErrorException('Erro ao atualizar usuário no banco de dados');
      }
      
      this.logger.error(`Erro ao atualizar usuário com ID: ${id}`, error);
      throw new InternalServerErrorException('Erro ao atualizar usuário');
    }
  }

  async remove(id: string) {
    try {
      this.logger.log(`Removendo usuário com ID: ${id}`);
      
      // Verificar se o usuário existe
      await this.findOne(id);

      // Remover usuário
      await this.prisma.user.delete({
        where: { id },
      });

      this.logger.log(`Usuário removido com sucesso: ${id}`);
      return { message: 'Usuário removido com sucesso' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(`Erro do Prisma ao remover usuário: ${error.code}`, error.message);
        throw new InternalServerErrorException('Erro ao remover usuário do banco de dados');
      }
      
      this.logger.error(`Erro ao remover usuário com ID: ${id}`, error);
      throw new InternalServerErrorException('Erro ao remover usuário');
    }
  }
}
