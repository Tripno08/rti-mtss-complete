#!/usr/bin/env node

/**
 * Script para executar todas as correções para React 19 e Next.js 15
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando processo de correção para React 19 e Next.js 15...');

try {
  // Executar script para corrigir React.forwardRef
  console.log('\n📌 Executando correções para React.forwardRef...');
  execSync('node scripts/fix-forwardref.js', { stdio: 'inherit' });
  
  // Executar script para corrigir acesso a parâmetros de rota
  console.log('\n📌 Executando correções para acesso a parâmetros de rota...');
  execSync('node scripts/fix-route-params.js', { stdio: 'inherit' });
  
  // Executar script para corrigir SelectItem com valor vazio
  console.log('\n📌 Executando correções para SelectItem com valor vazio...');
  execSync('node scripts/fix-select-items.js', { stdio: 'inherit' });
  
  console.log('\n✅ Todas as correções foram aplicadas com sucesso!');
  console.log('\n🔍 Recomendações:');
  console.log('  1. Execute "npm run dev" para verificar se os erros foram corrigidos');
  console.log('  2. Verifique se há novos avisos ou erros no console');
  console.log('  3. Teste as funcionalidades principais da aplicação');
  
} catch (error) {
  console.error('\n❌ Erro durante o processo de correção:', error.message);
  process.exit(1);
} 