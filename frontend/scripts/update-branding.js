#!/usr/bin/env node

/**
 * Script para atualizar todas as referências de "RTI/MTSS" para "Innerview"
 * 
 * Este script percorre todos os arquivos do projeto e substitui as referências
 * ao nome antigo pelo novo nome do produto.
 * 
 * Uso: node scripts/update-branding.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configurações
const rootDir = path.resolve(__dirname, '..');
const filePatterns = [
  '**/*.tsx',
  '**/*.ts',
  '**/*.js',
  '**/*.jsx',
  '**/*.json',
  '**/*.md',
  '**/*.html',
  '**/*.css',
];
const excludePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/scripts/update-branding.js',
];

// Mapeamento de termos para substituição
const replacements = [
  { from: 'RTI/MTSS System', to: 'Innerview' },
  { from: 'RTI/MTSS', to: 'Innerview' },
  { from: 'RTI MTSS', to: 'Innerview' },
  { from: 'Sistema de Resposta à Intervenção', to: 'Sistema de visualização interna de dados educacionais' },
  { from: 'Sistema de Suporte Multi-Níveis', to: 'Sistema de suporte multi-níveis' },
  { from: 'Sistema de Suporte Multi-Nível', to: 'Sistema de suporte multi-níveis' },
  { from: 'Pirâmide RTI', to: 'Pirâmide de suporte' },
  { from: 'pirâmide RTI', to: 'pirâmide de suporte' },
  { from: 'modelo RTI', to: 'modelo de suporte' },
  { from: 'Modelo RTI', to: 'Modelo de suporte' },
];

// Função para processar um arquivo
function processFile(filePath) {
  try {
    // Ler o conteúdo do arquivo
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Aplicar todas as substituições
    replacements.forEach(({ from, to }) => {
      const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, to);
    });
    
    // Verificar se houve alterações
    if (content !== originalContent) {
      // Escrever o conteúdo atualizado
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Atualizado: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

// Função principal
async function main() {
  console.log('🔄 Iniciando atualização de branding...');
  
  // Encontrar todos os arquivos que correspondem aos padrões
  const files = glob.sync(filePatterns, {
    cwd: rootDir,
    ignore: excludePatterns,
    absolute: true,
  });
  
  console.log(`🔍 Encontrados ${files.length} arquivos para verificar.`);
  
  // Processar cada arquivo
  let updatedCount = 0;
  for (const file of files) {
    const updated = processFile(file);
    if (updated) updatedCount++;
  }
  
  console.log(`\n✨ Concluído! ${updatedCount} arquivos foram atualizados.`);
}

// Executar o script
main().catch(error => {
  console.error('❌ Erro:', error);
  process.exit(1);
}); 