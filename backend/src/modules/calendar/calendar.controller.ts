import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';

@ApiTags('calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo evento de calendário' })
  @ApiResponse({ status: 201, description: 'Evento criado com sucesso', type: CalendarEvent })
  create(@Body() createCalendarEventDto: CreateCalendarEventDto) {
    return this.calendarService.create(createCalendarEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os eventos de calendário' })
  @ApiResponse({ status: 200, description: 'Lista de eventos', type: [CalendarEvent] })
  findAll() {
    return this.calendarService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar eventos de calendário por usuário' })
  @ApiResponse({ status: 200, description: 'Lista de eventos do usuário', type: [CalendarEvent] })
  findByUser(@Param('userId') userId: string) {
    return this.calendarService.findByUser(userId);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Listar eventos de calendário por intervalo de datas' })
  @ApiResponse({ status: 200, description: 'Lista de eventos no intervalo de datas', type: [CalendarEvent] })
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.calendarService.findByDateRange(startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um evento de calendário pelo ID' })
  @ApiResponse({ status: 200, description: 'Evento encontrado', type: CalendarEvent })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  findOne(@Param('id') id: string) {
    return this.calendarService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um evento de calendário' })
  @ApiResponse({ status: 200, description: 'Evento atualizado com sucesso', type: CalendarEvent })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  update(@Param('id') id: string, @Body() updateCalendarEventDto: UpdateCalendarEventDto) {
    return this.calendarService.update(id, updateCalendarEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um evento de calendário' })
  @ApiResponse({ status: 200, description: 'Evento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado' })
  remove(@Param('id') id: string) {
    return this.calendarService.remove(id);
  }

  @Patch(':eventId/participants/:userId/status')
  @ApiOperation({ summary: 'Atualizar status de participação em um evento' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Participante não encontrado' })
  updateParticipantStatus(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @Body('status') status: 'pending' | 'accepted' | 'declined',
  ) {
    return this.calendarService.updateParticipantStatus(eventId, userId, status);
  }
} 