import { ApiProperty } from '@nestjs/swagger';

export class LessonPlan {
  @ApiProperty({ description: 'ID único do plano de aula' })
  id: string;

  @ApiProperty({ description: 'Título do plano de aula' })
  title: string;

  @ApiProperty({ description: 'Descrição do plano de aula' })
  description?: string;

  @ApiProperty({ description: 'Objetivos da aula' })
  objectives?: string;

  @ApiProperty({ description: 'Recursos necessários' })
  resources?: string;

  @ApiProperty({ description: 'Atividades planejadas' })
  activities?: string;

  @ApiProperty({ description: 'Avaliação da aprendizagem' })
  assessment?: string;

  @ApiProperty({ description: 'Duração em minutos' })
  duration?: number;

  @ApiProperty({ description: 'Data planejada para a aula' })
  date?: Date;

  @ApiProperty({ description: 'Status do plano de aula', enum: ['draft', 'published', 'completed'] })
  status: string;

  @ApiProperty({ description: 'Observações adicionais' })
  notes?: string;

  @ApiProperty({ description: 'ID da turma' })
  classId: string;

  @ApiProperty({ description: 'ID do conteúdo relacionado' })
  contentId?: string;

  @ApiProperty({ description: 'ID do professor' })
  teacherId: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
} 