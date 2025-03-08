import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface InterventionStats {
  count: number;
  totalImprovement: number;
  preAvg: number;
  postAvg: number;
}

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getSummaryStats() {
    try {
      const [
        studentsCount,
        activeInterventionsCount,
        assessmentsCount,
      ] = await Promise.all([
        this.prisma.student.count(),
        this.prisma.intervention.count({
          where: { status: 'ACTIVE' },
        }),
        this.prisma.assessment.count(),
      ]);

      return {
        totalStudents: studentsCount,
        activeInterventions: activeInterventionsCount,
        totalAssessments: assessmentsCount,
      };
    } catch (error) {
      this.logger.error('Erro ao buscar estatísticas de resumo', error);
      throw error;
    }
  }

  async getRtiDistribution() {
    try {
      // Simulando a distribuição de estudantes por nível RTI
      // Em um sistema real, isso seria baseado em critérios específicos
      const students = await this.prisma.student.findMany({
        include: {
          assessments: true,
          interventions: true,
        },
      });

      // Classificação simplificada baseada no número de intervenções
      let tier1Count = 0; // Universal (sem intervenções)
      let tier2Count = 0; // Seletivo (1-2 intervenções)
      let tier3Count = 0; // Intensivo (3+ intervenções)

      students.forEach(student => {
        const interventionCount = student.interventions?.length || 0;
        
        if (interventionCount === 0) {
          tier1Count++;
        } else if (interventionCount <= 2) {
          tier2Count++;
        } else {
          tier3Count++;
        }
      });

      return [
        { name: 'Nível 1 (Universal)', value: tier1Count },
        { name: 'Nível 2 (Seletivo)', value: tier2Count },
        { name: 'Nível 3 (Intensivo)', value: tier3Count },
      ];
    } catch (error) {
      this.logger.error('Erro ao buscar distribuição RTI', error);
      throw error;
    }
  }

  async getRecentActivities() {
    try {
      const [recentAssessments, recentInterventions] = await Promise.all([
        this.prisma.assessment.findMany({
          take: 5,
          orderBy: { date: 'desc' },
          include: { student: true },
        }),
        this.prisma.intervention.findMany({
          take: 5,
          orderBy: { startDate: 'desc' },
          include: { student: true },
        }),
      ]);

      // Combinar e ordenar por data
      const activities = [
        ...recentAssessments.map(assessment => ({
          id: assessment.id,
          date: new Date(assessment.date),
          type: 'assessment',
          title: `Avaliação: ${assessment.type}`,
          studentName: assessment.student?.name || 'Desconhecido',
          details: `Pontuação: ${assessment.score}`,
        })),
        ...recentInterventions.map(intervention => ({
          id: intervention.id,
          date: new Date(intervention.startDate),
          type: 'intervention',
          title: `Intervenção: ${intervention.type}`,
          studentName: intervention.student?.name || 'Desconhecido',
          details: `Status: ${intervention.status}`,
        })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime())
       .slice(0, 10);

      return activities;
    } catch (error) {
      this.logger.error('Erro ao buscar atividades recentes', error);
      throw error;
    }
  }

  async getHighRiskStudents() {
    try {
      // Identificar estudantes de alto risco com base em critérios
      // Por exemplo: estudantes com pontuações baixas em avaliações recentes
      // ou com múltiplas intervenções ativas
      const students = await this.prisma.student.findMany({
        include: {
          assessments: {
            orderBy: { date: 'desc' },
            take: 3,
          },
          interventions: {
            where: { status: 'ACTIVE' },
          },
          user: true,
        },
      });

      // Critérios simplificados para alto risco:
      // 1. Múltiplas intervenções ativas (2+)
      // 2. Pontuações baixas em avaliações recentes (abaixo de 60)
      const highRiskStudents = students
        .filter(student => {
          const hasMultipleInterventions = (student.interventions?.length || 0) >= 2;
          
          // Verificar se tem avaliações recentes com pontuações baixas
          const hasLowScores = student.assessments?.some(
            assessment => assessment.score < 60
          );
          
          return hasMultipleInterventions || hasLowScores;
        })
        .map(student => ({
          id: student.id,
          name: student.name,
          grade: student.grade,
          responsibleTeacher: student.user?.name || 'Não atribuído',
          interventionsCount: student.interventions?.length || 0,
          latestAssessmentScore: student.assessments?.[0]?.score || 'N/A',
          riskFactors: [
            ...(student.interventions?.length >= 2 ? ['Múltiplas intervenções'] : []),
            ...(student.assessments?.some(a => a.score < 60) ? ['Pontuações baixas'] : []),
          ],
        }));

      return highRiskStudents;
    } catch (error) {
      this.logger.error('Erro ao buscar estudantes de alto risco', error);
      throw error;
    }
  }

  async getInterventionEfficacy() {
    try {
      // TODO: Implementar cálculo real quando o schema estiver atualizado
      /*
      const interventions = await this.prisma.intervention.findMany({
        where: {
          status: 'COMPLETED'
        }
      });

      const count = interventions.length || 1;
      let totalImprovement = 0;
      let totalPreScore = 0;
      let totalPostScore = 0;

      for (const intervention of interventions) {
        const preScore = intervention.preScore || 0;
        const postScore = intervention.postScore || 0;
        totalImprovement += postScore - preScore;
        totalPreScore += preScore;
        totalPostScore += postScore;
      }
      */
      
      // Retornando dados mockados por enquanto
      return [{
        type: 'READING',
        count: 10,
        averageImprovement: 15.5,
        preInterventionAvg: 65.0,
        postInterventionAvg: 80.5,
      }];
    } catch (error) {
      this.logger.error('Erro ao calcular eficácia das intervenções', error);
      throw new Error('Erro ao calcular eficácia das intervenções');
    }
  }

  async getLearningDifficulties() {
    try {
      // Analisar distribuição de dificuldades de aprendizagem com base nos tipos de avaliação
      const assessments = await this.prisma.assessment.findMany();
      
      // Agrupar por tipo e contar
      const difficultiesCounts = {};
      
      assessments.forEach(assessment => {
        if (!difficultiesCounts[assessment.type]) {
          difficultiesCounts[assessment.type] = 0;
        }
        difficultiesCounts[assessment.type]++;
      });
      
      // Converter para formato adequado para gráficos
      const result = Object.entries(difficultiesCounts).map(([type, count]) => ({
        name: type,
        value: count,
      }));
      
      return result;
    } catch (error) {
      this.logger.error('Erro ao analisar dificuldades de aprendizagem', error);
      throw error;
    }
  }
} 