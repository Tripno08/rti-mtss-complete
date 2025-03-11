#!/usr/bin/env node

/**
 * Script para corrigir problemas de React.forwardRef no React 19
 * 
 * Este script executa o codemod types-react-codemod para atualizar
 * componentes que usam React.forwardRef para a nova API de refs do React 19.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Diretórios a serem verificados
const directories = [
  'src/components/ui',
];

// Extensões de arquivos a serem verificados
const extensions = ['.tsx', '.jsx', '.ts', '.js'];

console.log('🔍 Iniciando correção de React.forwardRef para React 19...');

// Função para executar o codemod em um arquivo
function runCodemod(filePath) {
  try {
    console.log(`Processando: ${filePath}`);
    
    // Verificar se o arquivo contém React.forwardRef
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('React.forwardRef')) {
      return;
    }
    
    console.log(`🔧 Aplicando codemod em: ${filePath}`);
    
    // Executar o codemod
    execSync(`npx types-react-codemod ${filePath}`, { stdio: 'inherit' });
    
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
      runCodemod(itemPath);
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