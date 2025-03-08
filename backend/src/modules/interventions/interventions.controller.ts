import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InterventionsService } from './interventions.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, InterventionStatus } from '@prisma/client';

@Controller('interventions')
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  create(@Body() createInterventionDto: CreateInterventionDto) {
    return this.interventionsService.create(createInterventionDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  findAll(@Query('status') status?: InterventionStatus) {
    if (status) {
      return this.interventionsService.findByStatus(status);
    }
    return this.interventionsService.findAll();
  }

  @Get('student/:studentId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  findByStudentId(@Param('studentId') studentId: string) {
    return this.interventionsService.findByStudentId(studentId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  findOne(@Param('id') id: string) {
    return this.interventionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  update(@Param('id') id: string, @Body() updateInterventionDto: UpdateInterventionDto) {
    return this.interventionsService.update(id, updateInterventionDto);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  complete(@Param('id') id: string) {
    return this.interventionsService.complete(id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.SPECIALIST)
  cancel(@Param('id') id: string) {
    return this.interventionsService.cancel(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  remove(@Param('id') id: string) {
    return this.interventionsService.remove(id);
  }
}
