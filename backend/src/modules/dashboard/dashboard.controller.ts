import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary() {
    return this.dashboardService.getSummaryStats();
  }

  @Get('distribution')
  async getDistribution() {
    return this.dashboardService.getRtiDistribution();
  }

  @Get('recent-activities')
  async getRecentActivities() {
    return this.dashboardService.getRecentActivities();
  }

  @Get('high-risk-students')
  async getHighRiskStudents() {
    return this.dashboardService.getHighRiskStudents();
  }

  @Get('intervention-efficacy')
  async getInterventionEfficacy() {
    return this.dashboardService.getInterventionEfficacy();
  }

  @Get('learning-difficulties')
  async getLearningDifficulties() {
    return this.dashboardService.getLearningDifficulties();
  }
} 