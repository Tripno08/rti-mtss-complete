#!/usr/bin/env node

/**
 * Script para corrigir problemas de SelectItem com valor vazio no React 19
 * 
 * Este script identifica e corrige componentes SelectItem que têm valor vazio,
 * substituindo-os por valores significativos como 'all-categories', 'all-types', etc.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Diretórios a serem verificados
const directories = [
  'src/app',
  'src/components',
];

// Extensões de arquivos a serem verificados
const extensions = ['.tsx', '.jsx', '.ts', '.js'];

console.log('🔍 Iniciando correção de SelectItem com valor vazio para React 19...');

// Função para corrigir um arquivo
function fixSelectItems(filePath) {
  try {
    console.log(`Processando: ${filePath}`);
    
    // Ler o conteúdo do arquivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se o arquivo contém SelectItem
    if (!content.includes('SelectItem')) {
      return;
    }
    
    // Verificar se há SelectItem com valor vazio
    const emptyValueRegex = /<SelectItem\s+value\s*=\s*["']\s*["']/g;
    if (!emptyValueRegex.test(content)) {
      return;
    }
    
    console.log(`🔧 Corrigindo SelectItem com valor vazio em: ${filePath}`);
    
    // Identificar o contexto para determinar o valor significativo a ser usado
    let replacementValue = 'all-items';
    
    // Tentar determinar um valor mais específico com base no contexto
    if (content.includes('category') || content.includes('Category')) {
      replacementValue = 'all-categories';
    } else if (content.includes('type') || content.includes('Type')) {
      replacementValue = 'all-types';
    } else if (content.includes('status') || content.includes('Status')) {
      replacementValue = 'all-statuses';
    } else if (content.includes('filter') || content.includes('Filter')) {
      replacementValue = 'all-filters';
    }
    
    // Substituir SelectItem com valor vazio por valor significativo
    content = content.replace(
      /<SelectItem\s+value\s*=\s*["']\s*["']/g,
      `<SelectItem value="${replacementValue}"`
    );
    
    // Atualizar a lógica de filtro para lidar com os novos valores
    // Exemplo: value === "" para value === "all-categories"
    content = content.replace(
      /value\s*===\s*["']["']/g,
      `value === "${replacementValue}"`
    );
    
    // Salvar o arquivo atualizado
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`✅ Arquivo atualizado: ${filePath}`);
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
}

// Função para percorrer diretórios recursivamente
function processDirectory(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const itemPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      processDirectory(itemPath);
    } else if (extensions.some(ext => item.name.endsWith(ext))) {
      fixSelectItems(itemPath);
    }
  }
}

// Processar cada diretório
for (const dir of directories) {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`📁 Processando diretório: ${dirPath}`);
    processDirectory(dirPath);
  } else {
    console.warn(`⚠️ Diretório não encontrado: ${dirPath}`);
  }
}

console.log('✨ Processo de correção concluído!'); 