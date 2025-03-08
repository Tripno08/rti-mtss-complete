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
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { AddParticipantDto } from './dto/add-participant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, MeetingStatus } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('meetings')
@Controller('meetings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as reuniões RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de reuniões retornada com sucesso' })
  async findAll(
    @Query('teamId') teamId?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: MeetingStatus,
    @GetUser() user?: any,
  ) {
    // Se o usuário não for admin, filtrar apenas suas reuniões
    if (user && user.role !== UserRole.ADMIN && !userId) {
      return this.meetingsService.findAllMeetings(teamId, user.id, status);
    }
    return this.meetingsService.findAllMeetings(teamId, userId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma reunião RTI pelo ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reunião encontrada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reunião não encontrada' })
  async findOne(@Param('id') id: string) {
    return this.meetingsService.findMeetingById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST, UserRole.TEACHER)
  @ApiOperation({ summary: 'Criar uma nova reunião RTI' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Reunião criada com sucesso' })
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingsService.createMeeting(createMeetingDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST, UserRole.TEACHER)
  @ApiOperation({ summary: 'Atualizar uma reunião RTI existente' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reunião atualizada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reunião não encontrada' })
  async update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingsService.updateMeeting(id, updateMeetingDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  @ApiOperation({ summary: 'Excluir uma reunião RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reunião excluída com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reunião não encontrada' })
  async remove(@Param('id') id: string) {
    return this.meetingsService.deleteMeeting(id);
  }

  @Post(':id/participants')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST, UserRole.TEACHER)
  @ApiOperation({ summary: 'Adicionar um participante à reunião RTI' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Participante adicionado com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reunião não encontrada' })
  async addParticipant(@Param('id') id: string, @Body() addParticipantDto: AddParticipantDto) {
    return this.meetingsService.addParticipant(id, addParticipantDto);
  }

  @Delete(':id/participants/:userId')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST, UserRole.TEACHER)
  @ApiOperation({ summary: 'Remover um participante da reunião RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Participante removido com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reunião ou participante não encontrado' })
  async removeParticipant(@Param('id') id: string, @Param('userId') userId: string) {
    return this.meetingsService.removeParticipant(id, userId);
  }

  @Put(':id/participants/:userId/attendance')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST, UserRole.TEACHER)
  @ApiOperation({ summary: 'Atualizar presença de um participante na reunião' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Presença atualizada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reunião ou participante não encontrado' })
  async updateAttendance(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body('attended') attended: boolean,
  ) {
    return this.meetingsService.updateAttendance(id, userId, attended);
  }

  @Get(':id/participants')
  @ApiOperation({ summary: 'Listar participantes da reunião RTI' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de participantes retornada com sucesso' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Reunião não encontrada' })
  async getParticipants(@Param('id') id: string) {
    return this.meetingsService.getParticipants(id);
  }

  @Get('upcoming/me')
  @ApiOperation({ summary: 'Listar próximas reuniões do usuário logado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de reuniões retornada com sucesso' })
  async getUpcomingMeetings(@GetUser() user: any) {
    return this.meetingsService.getUpcomingMeetings(user.id);
  }
} 