import { ApiProperty } from '@nestjs/swagger';

export class CalendarEvent {
  @ApiProperty({ description: 'ID único do evento' })
  id: string;

  @ApiProperty({ description: 'Título do evento' })
  title: string;

  @ApiProperty({ description: 'Descrição do evento' })
  description?: string;

  @ApiProperty({ description: 'Data e hora de início do evento' })
  startDate: Date;

  @ApiProperty({ description: 'Data e hora de término do evento' })
  endDate?: Date;

  @ApiProperty({ description: 'Indica se o evento dura o dia todo' })
  allDay: boolean;

  @ApiProperty({ description: 'Local do evento' })
  location?: string;

  @ApiProperty({
    description: 'Tipo do evento',
    enum: ['meeting', 'lesson', 'assessment', 'intervention', 'personal'],
  })
  type: string;

  @ApiProperty({
    description: 'Status do evento',
    enum: ['scheduled', 'cancelled', 'completed'],
  })
  status: string;

  @ApiProperty({ description: 'Cor para exibição no calendário' })
  color?: string;

  @ApiProperty({ description: 'Padrão de recorrência (JSON)' })
  recurrence?: string;

  @ApiProperty({ description: 'ID do criador do evento' })
  creatorId: string;

  @ApiProperty({ description: 'Criador do evento' })
  creator?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  @ApiProperty({ description: 'Participantes do evento' })
  participants?: Array<{
    id: string;
    userId: string;
    status: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }>;

  @ApiProperty({ description: 'ID da escola relacionada' })
  schoolId?: string;

  @ApiProperty({ description: 'Escola relacionada' })
  school?: {
    id: string;
    name: string;
  };

  @ApiProperty({ description: 'ID da turma relacionada' })
  classId?: string;

  @ApiProperty({ description: 'Turma relacionada' })
  class?: {
    id: string;
    name: string;
    grade: string;
  };

  @ApiProperty({ description: 'ID do plano de aula relacionado' })
  lessonPlanId?: string;

  @ApiProperty({ description: 'Plano de aula relacionado' })
  lessonPlan?: {
    id: string;
    title: string;
  };

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
} 