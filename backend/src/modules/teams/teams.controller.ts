import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { AddStudentToTeamDto } from './dto/add-student-to-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('teams')
@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as equipes RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de equipes retornada com sucesso' })
  async findAll(@Query('userId') userId?: string, @GetUser() user?: any) {
    // Se o usuário não for admin, filtrar apenas suas equipes
    if (user && user.role !== UserRole.ADMIN && !userId) {
      return this.teamsService.findAllTeams(user.id);
    }
    return this.teamsService.findAllTeams(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma equipe RTI pelo ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Equipe encontrada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Equipe não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.teamsService.findTeamById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  @ApiOperation({ summary: 'Criar uma nova equipe RTI' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Equipe criada com sucesso' })
  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.createTeam(createTeamDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  @ApiOperation({ summary: 'Atualizar uma equipe RTI existente' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Equipe atualizada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Equipe não encontrada' })
  async update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.updateTeam(id, updateTeamDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Excluir uma equipe RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Equipe excluída com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Equipe não encontrada' })
  async remove(@Param('id') id: string) {
    return this.teamsService.deleteTeam(id);
  }

  @Post(':id/members')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  @ApiOperation({ summary: 'Adicionar um membro à equipe RTI' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Membro adicionado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Equipe não encontrada' })
  async addMember(@Param('id') id: string, @Body() addTeamMemberDto: AddTeamMemberDto) {
    return this.teamsService.addTeamMember(id, addTeamMemberDto);
  }

  @Delete(':id/members/:userId')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  @ApiOperation({ summary: 'Remover um membro da equipe RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Membro removido com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Equipe ou membro não encontrado' })
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.teamsService.removeTeamMember(id, userId);
  }

  @Post(':id/students')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST, UserRole.TEACHER)
  @ApiOperation({ summary: 'Adicionar um estudante à equipe RTI' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Estudante adicionado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Equipe não encontrada' })
  async addStudent(@Param('id') id: string, @Body() addStudentDto: AddStudentToTeamDto) {
    return this.teamsService.addStudentToTeam(id, addStudentDto);
  }

  @Delete(':id/students/:studentId')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  @ApiOperation({ summary: 'Remover um estudante da equipe RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Estudante removido com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Equipe ou estudante não encontrado' })
  async removeStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    return this.teamsService.removeStudentFromTeam(id, studentId);
  }

  @Get(':id/students')
  @ApiOperation({ summary: 'Listar estudantes da equipe RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de estudantes retornada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Equipe não encontrada' })
  async getStudents(@Param('id') id: string) {
    return this.teamsService.getTeamStudents(id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Listar membros da equipe RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de membros retornada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Equipe não encontrada' })
  async getMembers(@Param('id') id: string) {
    return this.teamsService.getTeamMembers(id);
  }

  @Get(':id/dashboard')
  @ApiOperation({ summary: 'Obter dashboard da equipe RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dashboard retornado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Equipe não encontrada' })
  async getDashboard(@Param('id') id: string) {
    return this.teamsService.getTeamDashboard(id);
  }
} 