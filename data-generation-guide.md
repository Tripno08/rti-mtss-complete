# Guia para Geração de Massa de Dados - RTI-MTSS Complete

Este documento contém as informações necessárias para gerar uma massa inicial de dados para o sistema RTI-MTSS Complete, baseado na estrutura atual do banco de dados.

## Estrutura do Banco de Dados

O sistema possui as seguintes entidades principais e seus relacionamentos:

### Hierarquia Organizacional
- **SchoolNetwork** (Rede/Distrito Escolar)
- **School** (Escola)
- **Class** (Turma)
- **User** (Usuário - Professores, Especialistas, Administradores)
- **Student** (Estudante)

### Processo RTI-MTSS
- **RtiTeam** (Equipe RTI)
- **RtiMeeting** (Reunião RTI)
- **Assessment** (Avaliação)
- **Intervention** (Intervenção)
- **BaseIntervention** (Catálogo de Intervenções)
- **InterventionProtocol** (Protocolo de Intervenção)
- **Goal** (Meta SMART)
- **DificuldadeAprendizagem** (Dificuldade de Aprendizagem)
- **ScreeningInstrument** (Instrumento de Rastreio)

### Planejamento e Calendário
- **LessonPlan** (Plano de Aula)
- **Content** (Conteúdo)
- **CalendarEvent** (Evento de Calendário)

## Requisitos para Geração de Dados

### 1. Redes Escolares e Escolas

**SchoolNetwork (3-5 redes)**
```json
{
  "id": "UUID",
  "name": "Nome da Rede Escolar",
  "description": "Descrição da rede escolar",
  "code": "CÓDIGO-REDE",
  "active": true
}
```

**School (5-10 escolas por rede)**
```json
{
  "id": "UUID",
  "name": "Nome da Escola",
  "code": "CÓDIGO-ESCOLA",
  "address": "Endereço completo",
  "phone": "(XX) XXXXX-XXXX",
  "email": "contato@escola.edu.br",
  "active": true,
  "networkId": "ID-DA-REDE"
}
```

### 2. Usuários

**User (20-30 usuários)**
```json
{
  "id": "UUID",
  "email": "usuario@exemplo.com",
  "password": "senha_hash",
  "name": "Nome Completo",
  "role": "ADMIN | TEACHER | SPECIALIST"
}
```

Distribuição sugerida:
- 60% professores (TEACHER)
- 30% especialistas (SPECIALIST)
- 10% administradores (ADMIN)

### 3. Turmas

**Class (2-4 turmas por professor)**
```json
{
  "id": "UUID",
  "name": "Nome da Turma",
  "grade": "Série/Ano",
  "subject": "Disciplina (opcional)",
  "schoolId": "ID-DA-ESCOLA",
  "teacherId": "ID-DO-PROFESSOR"
}
```

Séries sugeridas:
- "1º ano", "2º ano", "3º ano", "4º ano", "5º ano" (Ensino Fundamental I)
- "6º ano", "7º ano", "8º ano", "9º ano" (Ensino Fundamental II)
- "1º ano EM", "2º ano EM", "3º ano EM" (Ensino Médio)

### 4. Estudantes

**Student (15-25 estudantes por turma)**
```json
{
  "id": "UUID",
  "name": "Nome do Estudante",
  "grade": "Série/Ano",
  "dateOfBirth": "YYYY-MM-DD",
  "schoolId": "ID-DA-ESCOLA",
  "userId": "ID-DO-PROFESSOR-RESPONSÁVEL"
}
```

**ClassStudent (associação estudante-turma)**
```json
{
  "id": "UUID",
  "classId": "ID-DA-TURMA",
  "studentId": "ID-DO-ESTUDANTE",
  "joinedAt": "YYYY-MM-DDTHH:MM:SS"
}
```

### 5. Dificuldades de Aprendizagem

**DificuldadeAprendizagem (10-15 dificuldades)**
```json
{
  "id": "UUID",
  "nome": "Nome da Dificuldade",
  "descricao": "Descrição detalhada",
  "sintomas": "Sintomas comuns",
  "categoria": "LEITURA | ESCRITA | MATEMATICA | ATENCAO | COMPORTAMENTO | COMUNICACAO | COORDENACAO_MOTORA | MEMORIA | ORGANIZACAO | OUTRO"
}
```

**EstudanteDificuldade (2-3 dificuldades para 30% dos estudantes)**
```json
{
  "id": "UUID",
  "nivel": "BAIXO | MODERADO | ALTO",
  "dataIdentificacao": "YYYY-MM-DDTHH:MM:SS",
  "observacoes": "Observações sobre a dificuldade",
  "estudanteId": "ID-DO-ESTUDANTE",
  "dificuldadeId": "ID-DA-DIFICULDADE"
}
```

### 6. Instrumentos de Rastreio

**ScreeningInstrument (5-8 instrumentos)**
```json
{
  "id": "UUID",
  "nome": "Nome do Instrumento",
  "descricao": "Descrição detalhada",
  "categoria": "ACADEMICO | COMPORTAMENTAL | SOCIOEMOCIONAL | COGNITIVO | LINGUAGEM | MOTOR | ATENCAO | OUTRO",
  "faixaEtaria": "6-8 anos",
  "tempoAplicacao": "15-20 minutos",
  "instrucoes": "Instruções de aplicação",
  "ativo": true
}
```

**ScreeningIndicator (3-5 indicadores por instrumento)**
```json
{
  "id": "UUID",
  "nome": "Nome do Indicador",
  "descricao": "Descrição do indicador",
  "tipo": "ESCALA_LIKERT | SIM_NAO | NUMERICO | MULTIPLA_ESCOLHA | TEXTO_LIVRE",
  "valorMinimo": 0,
  "valorMaximo": 5,
  "pontoCorte": 3,
  "instrumentoId": "ID-DO-INSTRUMENTO"
}
```

**Screening (1-2 rastreios para 20% dos estudantes)**
```json
{
  "id": "UUID",
  "dataAplicacao": "YYYY-MM-DDTHH:MM:SS",
  "observacoes": "Observações sobre a aplicação",
  "status": "AGENDADO | EM_ANDAMENTO | CONCLUIDO | CANCELADO",
  "estudanteId": "ID-DO-ESTUDANTE",
  "aplicadorId": "ID-DO-USUÁRIO-APLICADOR",
  "instrumentoId": "ID-DO-INSTRUMENTO"
}
```

**ScreeningResult (1 resultado por indicador por rastreio)**
```json
{
  "id": "UUID",
  "valor": 3.5,
  "nivelRisco": "BAIXO | MODERADO | ALTO | MUITO_ALTO",
  "observacoes": "Observações sobre o resultado",
  "rastreioId": "ID-DO-RASTREIO",
  "indicadorId": "ID-DO-INDICADOR"
}
```

### 7. Intervenções

**BaseIntervention (15-20 intervenções base)**
```json
{
  "id": "UUID",
  "nome": "Nome da Intervenção",
  "descricao": "Descrição detalhada",
  "objetivo": "Objetivo principal",
  "nivel": "UNIVERSAL | SELETIVO | INTENSIVO",
  "area": "LEITURA | ESCRITA | MATEMATICA | COMPORTAMENTO | ATENCAO | SOCIOEMOCIONAL | LINGUAGEM | OUTRO",
  "tempoEstimado": "30 minutos",
  "frequencia": "DIARIA | SEMANAL | QUINZENAL | MENSAL | PERSONALIZADA",
  "materiaisNecessarios": "Materiais necessários",
  "evidenciaCientifica": "Evidência científica",
  "fonteEvidencia": "Fonte da evidência",
  "ativo": true
}
```

**InterventionProtocol (1-2 protocolos por intervenção base)**
```json
{
  "id": "UUID",
  "nome": "Nome do Protocolo",
  "descricao": "Descrição detalhada",
  "duracaoEstimada": "6 semanas",
  "baseInterventionId": "ID-DA-INTERVENÇÃO-BASE"
}
```

**ProtocolStep (3-5 etapas por protocolo)**
```json
{
  "id": "UUID",
  "ordem": 1,
  "titulo": "Título da Etapa",
  "descricao": "Descrição detalhada",
  "tempoEstimado": "15 minutos",
  "materiaisNecessarios": "Materiais necessários",
  "protocoloId": "ID-DO-PROTOCOLO"
}
```

**Intervention (1-3 intervenções para estudantes com dificuldades)**
```json
{
  "id": "UUID",
  "startDate": "YYYY-MM-DDTHH:MM:SS",
  "endDate": "YYYY-MM-DDTHH:MM:SS",
  "type": "Tipo de intervenção",
  "description": "Descrição detalhada",
  "status": "ACTIVE | COMPLETED | CANCELLED",
  "notes": "Observações",
  "studentId": "ID-DO-ESTUDANTE",
  "baseInterventionId": "ID-DA-INTERVENÇÃO-BASE"
}
```

**InterventionSession (2-5 sessões por intervenção)**
```json
{
  "id": "UUID",
  "data": "YYYY-MM-DDTHH:MM:SS",
  "duracao": 30,
  "status": "AGENDADA | REALIZADA | CANCELADA | REMARCADA",
  "observacoes": "Observações sobre a sessão",
  "materiaisUtilizados": "Materiais utilizados",
  "desafiosEncontrados": "Desafios encontrados",
  "proximosPassos": "Próximos passos",
  "interventionId": "ID-DA-INTERVENÇÃO",
  "aplicadorId": "ID-DO-USUÁRIO-APLICADOR"
}
```

**Goal (1-2 metas por intervenção)**
```json
{
  "id": "UUID",
  "titulo": "Título da Meta",
  "descricao": "Descrição detalhada",
  "tipo": "ACADEMICA | COMPORTAMENTAL | SOCIOEMOCIONAL | COGNITIVA | LINGUAGEM | MOTORA | ATENCAO | OUTRA",
  "especifico": "Descrição específica",
  "mensuravel": "Como será medido",
  "atingivel": "Por que é atingível",
  "relevante": "Por que é relevante",
  "temporal": "Prazo definido",
  "dataInicio": "YYYY-MM-DDTHH:MM:SS",
  "dataFim": "YYYY-MM-DDTHH:MM:SS",
  "status": false,
  "observacoes": "Observações adicionais",
  "interventionId": "ID-DA-INTERVENÇÃO"
}
```

### 8. Equipes RTI

**RtiTeam (1-2 equipes por escola)**
```json
{
  "id": "UUID",
  "name": "Nome da Equipe",
  "description": "Descrição da equipe",
  "active": true,
  "schoolId": "ID-DA-ESCOLA"
}
```

**RtiTeamMember (3-6 membros por equipe)**
```json
{
  "id": "UUID",
  "role": "COORDINATOR | SPECIALIST | TEACHER | COUNSELOR | PSYCHOLOGIST | OTHER",
  "joinedAt": "YYYY-MM-DDTHH:MM:SS",
  "leftAt": null,
  "active": true,
  "userId": "ID-DO-USUÁRIO",
  "teamId": "ID-DA-EQUIPE"
}
```

**StudentTeam (associação estudante-equipe para estudantes com intervenções)**
```json
{
  "id": "UUID",
  "assignedAt": "YYYY-MM-DDTHH:MM:SS",
  "removedAt": null,
  "active": true,
  "studentId": "ID-DO-ESTUDANTE",
  "teamId": "ID-DA-EQUIPE"
}
```

### 9. Reuniões

**RtiMeeting (1-2 reuniões por equipe por mês)**
```json
{
  "id": "UUID",
  "title": "Título da Reunião",
  "date": "YYYY-MM-DDTHH:MM:SS",
  "location": "Local da reunião",
  "status": "SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED",
  "notes": "Anotações prévias",
  "summary": "Resumo da reunião",
  "teamId": "ID-DA-EQUIPE"
}
```

**MeetingParticipant (todos os membros da equipe como participantes)**
```json
{
  "id": "UUID",
  "attended": true,
  "role": "Papel na reunião",
  "userId": "ID-DO-USUÁRIO",
  "meetingId": "ID-DA-REUNIÃO"
}
```

### 10. Planos de Aula e Conteúdos

**Content (5-10 conteúdos por turma)**
```json
{
  "id": "UUID",
  "title": "Título do Conteúdo",
  "description": "Descrição do conteúdo",
  "type": "lesson | activity | assessment",
  "status": "draft | published",
  "classId": "ID-DA-TURMA"
}
```

**LessonPlan (2-3 planos por conteúdo)**
```json
{
  "id": "UUID",
  "title": "Título do Plano",
  "description": "Descrição do plano",
  "objectives": "Objetivos da aula",
  "resources": "Recursos necessários",
  "activities": "Atividades planejadas",
  "assessment": "Avaliação da aprendizagem",
  "duration": 50,
  "date": "YYYY-MM-DDTHH:MM:SS",
  "status": "draft | published | completed",
  "notes": "Observações adicionais",
  "classId": "ID-DA-TURMA",
  "contentId": "ID-DO-CONTEÚDO",
  "teacherId": "ID-DO-PROFESSOR"
}
```

### 11. Calendário

**CalendarEvent (eventos diversos)**
```json
{
  "id": "UUID",
  "title": "Título do Evento",
  "description": "Descrição do evento",
  "startDate": "YYYY-MM-DDTHH:MM:SS",
  "endDate": "YYYY-MM-DDTHH:MM:SS",
  "allDay": false,
  "location": "Local do evento",
  "type": "meeting | lesson | assessment | intervention | personal",
  "status": "scheduled | cancelled | completed",
  "color": "#4285F4",
  "recurrence": null,
  "creatorId": "ID-DO-CRIADOR",
  "schoolId": "ID-DA-ESCOLA",
  "classId": "ID-DA-TURMA",
  "lessonPlanId": "ID-DO-PLANO-DE-AULA"
}
```

**CalendarEventParticipant (participantes do evento)**
```json
{
  "id": "UUID",
  "status": "pending | accepted | declined",
  "eventId": "ID-DO-EVENTO",
  "userId": "ID-DO-USUÁRIO"
}
```

### 12. Avaliações

**Assessment (2-3 avaliações por estudante)**
```json
{
  "id": "UUID",
  "date": "YYYY-MM-DDTHH:MM:SS",
  "type": "Tipo de avaliação",
  "score": 85.5,
  "notes": "Observações sobre a avaliação",
  "studentId": "ID-DO-ESTUDANTE"
}
```

## Diretrizes para Geração de Dados

1. **Consistência**: Manter consistência entre os dados relacionados (ex: datas de intervenção devem ser posteriores às datas de identificação de dificuldades).

2. **Distribuição Realista**:
   - 70% dos estudantes sem dificuldades identificadas
   - 20% com dificuldades leves a moderadas
   - 10% com dificuldades significativas e múltiplas intervenções

3. **Cronologia**:
   - Dados históricos: até 6 meses atrás
   - Dados atuais: presente
   - Dados futuros (agendamentos): até 3 meses à frente

4. **Nomes e Textos**:
   - Usar nomes brasileiros realistas
   - Descrições detalhadas e profissionais
   - Evitar textos genéricos como "Lorem ipsum"

5. **Valores Numéricos**:
   - Notas/scores: distribuição normal com média 7.5 (escala 0-10)
   - Duração de atividades: valores realistas (15-90 minutos)

## Formato de Saída

Os dados devem ser gerados em formato JSON estruturado por entidade, seguindo a ordem de dependência (entidades independentes primeiro, seguidas por entidades que dependem delas).

Exemplo de estrutura do arquivo final:

```json
{
  "schoolNetworks": [...],
  "schools": [...],
  "users": [...],
  "students": [...],
  "classes": [...],
  "classStudents": [...],
  "dificuldadesAprendizagem": [...],
  "estudanteDificuldades": [...],
  "screeningInstruments": [...],
  "screeningIndicators": [...],
  "screenings": [...],
  "screeningResults": [...],
  "baseInterventions": [...],
  "interventionProtocols": [...],
  "protocolSteps": [...],
  "interventions": [...],
  "interventionSessions": [...],
  "goals": [...],
  "rtiTeams": [...],
  "rtiTeamMembers": [...],
  "studentTeams": [...],
  "rtiMeetings": [...],
  "meetingParticipants": [...],
  "contents": [...],
  "lessonPlans": [...],
  "calendarEvents": [...],
  "calendarEventParticipants": [...],
  "assessments": [...]
}
```

## Instruções para Uso

1. Gerar o arquivo JSON completo seguindo a estrutura acima
2. Utilizar o script de carga de dados para inserir no banco de dados
3. Verificar a consistência dos dados após a carga
4. Ajustar conforme necessário para garantir o funcionamento correto do sistema

Este guia serve como referência para a geração de uma massa de dados realista e coerente para o sistema RTI-MTSS Complete, permitindo testes e demonstrações eficazes. 