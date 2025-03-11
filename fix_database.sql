-- Adicionar coluna baseInterventionId à tabela interventions
ALTER TABLE interventions ADD COLUMN baseInterventionId VARCHAR(191) NULL;

-- Criar tabela base_interventions
CREATE TABLE base_interventions (
    id VARCHAR(191) NOT NULL,
    nome VARCHAR(191) NOT NULL,
    descricao VARCHAR(191) NOT NULL,
    objetivo VARCHAR(191) NOT NULL,
    nivel ENUM('UNIVERSAL', 'SELETIVO', 'INTENSIVO') NOT NULL,
    area ENUM('LEITURA', 'ESCRITA', 'MATEMATICA', 'COMPORTAMENTO', 'ATENCAO', 'SOCIOEMOCIONAL', 'LINGUAGEM', 'OUTRO') NOT NULL,
    tempoEstimado VARCHAR(191) NOT NULL,
    frequencia ENUM('DIARIA', 'SEMANAL', 'QUINZENAL', 'MENSAL', 'PERSONALIZADA') NOT NULL,
    materiaisNecessarios VARCHAR(191) NULL,
    evidenciaCientifica VARCHAR(191) NULL,
    fonteEvidencia VARCHAR(191) NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela dificuldades_aprendizagem
CREATE TABLE dificuldades_aprendizagem (
    id VARCHAR(191) NOT NULL,
    nome VARCHAR(191) NOT NULL,
    descricao VARCHAR(191) NOT NULL,
    sintomas VARCHAR(191) NOT NULL,
    categoria ENUM('LEITURA', 'ESCRITA', 'MATEMATICA', 'ATENCAO', 'COMPORTAMENTO', 'COMUNICACAO', 'COORDENACAO_MOTORA', 'MEMORIA', 'ORGANIZACAO', 'OUTRO') NOT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela estudante_dificuldades
CREATE TABLE estudante_dificuldades (
    id VARCHAR(191) NOT NULL,
    nivel ENUM('BAIXO', 'MODERADO', 'ALTO') NOT NULL,
    dataIdentificacao DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    observacoes VARCHAR(191) NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    estudanteId VARCHAR(191) NOT NULL,
    dificuldadeId VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela screening_instruments
CREATE TABLE screening_instruments (
    id VARCHAR(191) NOT NULL,
    nome VARCHAR(191) NOT NULL,
    descricao VARCHAR(191) NOT NULL,
    categoria ENUM('ACADEMICO', 'COMPORTAMENTAL', 'SOCIOEMOCIONAL', 'COGNITIVO', 'LINGUAGEM', 'MOTOR', 'ATENCAO', 'OUTRO') NOT NULL,
    faixaEtaria VARCHAR(191) NOT NULL,
    tempoAplicacao VARCHAR(191) NOT NULL,
    instrucoes TEXT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela screening_indicators
CREATE TABLE screening_indicators (
    id VARCHAR(191) NOT NULL,
    nome VARCHAR(191) NOT NULL,
    descricao VARCHAR(191) NOT NULL,
    tipo ENUM('ESCALA_LIKERT', 'SIM_NAO', 'NUMERICO', 'MULTIPLA_ESCOLHA', 'TEXTO_LIVRE') NOT NULL,
    valorMinimo FLOAT NOT NULL,
    valorMaximo FLOAT NOT NULL,
    pontoCorte FLOAT NOT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    instrumentoId VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela screenings
CREATE TABLE screenings (
    id VARCHAR(191) NOT NULL,
    dataAplicacao DATETIME(3) NOT NULL,
    observacoes TEXT NULL,
    status ENUM('AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO') NOT NULL DEFAULT 'EM_ANDAMENTO',
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    estudanteId VARCHAR(191) NOT NULL,
    aplicadorId VARCHAR(191) NOT NULL,
    instrumentoId VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela screening_results
CREATE TABLE screening_results (
    id VARCHAR(191) NOT NULL,
    valor FLOAT NOT NULL,
    nivelRisco ENUM('BAIXO', 'MODERADO', 'ALTO', 'MUITO_ALTO') NULL,
    observacoes VARCHAR(191) NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    rastreioId VARCHAR(191) NOT NULL,
    indicadorId VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela intervention_protocols
CREATE TABLE intervention_protocols (
    id VARCHAR(191) NOT NULL,
    nome VARCHAR(191) NOT NULL,
    descricao VARCHAR(191) NOT NULL,
    duracaoEstimada VARCHAR(191) NOT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    baseInterventionId VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela protocol_steps
CREATE TABLE protocol_steps (
    id VARCHAR(191) NOT NULL,
    ordem INT NOT NULL,
    titulo VARCHAR(191) NOT NULL,
    descricao VARCHAR(191) NOT NULL,
    tempoEstimado VARCHAR(191) NOT NULL,
    materiaisNecessarios VARCHAR(191) NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    protocoloId VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela intervention_kpis
CREATE TABLE intervention_kpis (
    id VARCHAR(191) NOT NULL,
    nome VARCHAR(191) NOT NULL,
    descricao VARCHAR(191) NOT NULL,
    unidadeMedida VARCHAR(191) NOT NULL,
    valorMinimo FLOAT NULL,
    valorMaximo FLOAT NULL,
    valorAlvo FLOAT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    baseInterventionId VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela intervention_progress
CREATE TABLE intervention_progress (
    id VARCHAR(191) NOT NULL,
    data DATETIME(3) NOT NULL,
    observacoes VARCHAR(191) NULL,
    valorKpi FLOAT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    interventionId VARCHAR(191) NOT NULL,
    kpiId VARCHAR(191) NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela intervention_sessions
CREATE TABLE intervention_sessions (
    id VARCHAR(191) NOT NULL,
    data DATETIME(3) NOT NULL,
    duracao INT NOT NULL,
    status ENUM('AGENDADA', 'REALIZADA', 'CANCELADA', 'REMARCADA') NOT NULL DEFAULT 'AGENDADA',
    observacoes VARCHAR(191) NULL,
    materiaisUtilizados VARCHAR(191) NULL,
    desafiosEncontrados VARCHAR(191) NULL,
    proximosPassos VARCHAR(191) NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    interventionId VARCHAR(191) NOT NULL,
    aplicadorId VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela kpi_results
CREATE TABLE kpi_results (
    id VARCHAR(191) NOT NULL,
    valor FLOAT NOT NULL,
    observacoes VARCHAR(191) NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    sessionId VARCHAR(191) NOT NULL,
    kpiId VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela goals
CREATE TABLE goals (
    id VARCHAR(191) NOT NULL,
    titulo VARCHAR(191) NOT NULL,
    descricao VARCHAR(191) NOT NULL,
    tipo ENUM('ACADEMICA', 'COMPORTAMENTAL', 'SOCIOEMOCIONAL', 'COGNITIVA', 'LINGUAGEM', 'MOTORA', 'ATENCAO', 'OUTRA') NOT NULL,
    especifico VARCHAR(191) NOT NULL,
    mensuravel VARCHAR(191) NOT NULL,
    atingivel VARCHAR(191) NOT NULL,
    relevante VARCHAR(191) NOT NULL,
    temporal VARCHAR(191) NOT NULL,
    dataInicio DATETIME(3) NOT NULL,
    dataFim DATETIME(3) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT false,
    observacoes VARCHAR(191) NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    interventionId VARCHAR(191) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Adicionar chaves estrangeiras
ALTER TABLE interventions ADD CONSTRAINT interventions_baseInterventionId_fkey FOREIGN KEY (baseInterventionId) REFERENCES base_interventions(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE estudante_dificuldades ADD CONSTRAINT estudante_dificuldades_estudanteId_fkey FOREIGN KEY (estudanteId) REFERENCES students(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE estudante_dificuldades ADD CONSTRAINT estudante_dificuldades_dificuldadeId_fkey FOREIGN KEY (dificuldadeId) REFERENCES dificuldades_aprendizagem(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE screening_indicators ADD CONSTRAINT screening_indicators_instrumentoId_fkey FOREIGN KEY (instrumentoId) REFERENCES screening_instruments(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE screenings ADD CONSTRAINT screenings_estudanteId_fkey FOREIGN KEY (estudanteId) REFERENCES students(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE screenings ADD CONSTRAINT screenings_aplicadorId_fkey FOREIGN KEY (aplicadorId) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE screenings ADD CONSTRAINT screenings_instrumentoId_fkey FOREIGN KEY (instrumentoId) REFERENCES screening_instruments(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE screening_results ADD CONSTRAINT screening_results_rastreioId_fkey FOREIGN KEY (rastreioId) REFERENCES screenings(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE screening_results ADD CONSTRAINT screening_results_indicadorId_fkey FOREIGN KEY (indicadorId) REFERENCES screening_indicators(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE intervention_protocols ADD CONSTRAINT intervention_protocols_baseInterventionId_fkey FOREIGN KEY (baseInterventionId) REFERENCES base_interventions(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE protocol_steps ADD CONSTRAINT protocol_steps_protocoloId_fkey FOREIGN KEY (protocoloId) REFERENCES intervention_protocols(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE intervention_kpis ADD CONSTRAINT intervention_kpis_baseInterventionId_fkey FOREIGN KEY (baseInterventionId) REFERENCES base_interventions(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE intervention_progress ADD CONSTRAINT intervention_progress_interventionId_fkey FOREIGN KEY (interventionId) REFERENCES interventions(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE intervention_progress ADD CONSTRAINT intervention_progress_kpiId_fkey FOREIGN KEY (kpiId) REFERENCES intervention_kpis(id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE intervention_sessions ADD CONSTRAINT intervention_sessions_interventionId_fkey FOREIGN KEY (interventionId) REFERENCES interventions(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE intervention_sessions ADD CONSTRAINT intervention_sessions_aplicadorId_fkey FOREIGN KEY (aplicadorId) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE kpi_results ADD CONSTRAINT kpi_results_sessionId_fkey FOREIGN KEY (sessionId) REFERENCES intervention_sessions(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE kpi_results ADD CONSTRAINT kpi_results_kpiId_fkey FOREIGN KEY (kpiId) REFERENCES intervention_kpis(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE goals ADD CONSTRAINT goals_interventionId_fkey FOREIGN KEY (interventionId) REFERENCES interventions(id) ON DELETE RESTRICT ON UPDATE CASCADE; 