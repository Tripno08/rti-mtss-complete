import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BaseInterventionsService } from './base-interventions.service';
import { CreateBaseInterventionDto } from './dto/create-base-intervention.dto';
import { UpdateBaseInterventionDto } from './dto/update-base-intervention.dto';
import { AreaIntervencao, NivelIntervencao, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AssociateDificuldadeDto } from './dto/associate-dificuldade.dto';

@Controller('base-interventions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BaseInterventionsController {
  constructor(
    private readonly baseInterventionsService: BaseInterventionsService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  create(@Body() createBaseInterventionDto: CreateBaseInterventionDto) {
    return this.baseInterventionsService.create(createBaseInterventionDto);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive?: string) {
    return this.baseInterventionsService.findAll(includeInactive === 'true');
  }

  @Get('area/:area')
  findByArea(
    @Param('area') area: AreaIntervencao,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.baseInterventionsService.findByArea(
      area,
      includeInactive === 'true',
    );
  }

  @Get('nivel/:nivel')
  findByNivel(
    @Param('nivel') nivel: NivelIntervencao,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.baseInterventionsService.findByNivel(
      nivel,
      includeInactive === 'true',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.baseInterventionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  update(
    @Param('id') id: string,
    @Body() updateBaseInterventionDto: UpdateBaseInterventionDto,
  ) {
    return this.baseInterventionsService.update(id, updateBaseInterventionDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  remove(@Param('id') id: string) {
    return this.baseInterventionsService.remove(id);
  }

  @Post('associate-dificuldade')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  associateDificuldade(@Body() associateDificuldadeDto: AssociateDificuldadeDto) {
    return this.baseInterventionsService.associateDificuldade(associateDificuldadeDto);
  }

  @Delete(':intervencaoId/dificuldades/:dificuldadeId')
  @Roles(UserRole.ADMIN, UserRole.SPECIALIST)
  removeDificuldadeAssociation(
    @Param('intervencaoId') intervencaoId: string,
    @Param('dificuldadeId') dificuldadeId: string,
  ) {
    return this.baseInterventionsService.removeDificuldadeAssociation(
      dificuldadeId,
      intervencaoId,
    );
  }

  @Get(':id/dificuldades')
  findDificuldadesByIntervencao(@Param('id') id: string) {
    return this.baseInterventionsService.findDificuldadesByIntervencao(id);
  }

  @Get('by-dificuldade/:dificuldadeId')
  findIntervencoesByDificuldade(@Param('dificuldadeId') dificuldadeId: string) {
    return this.baseInterventionsService.findIntervencoesByDificuldade(dificuldadeId);
  }
} 