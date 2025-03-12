#!/usr/bin/env node

/**
 * Script para corrigir problemas de acesso a parâmetros de rota no Next.js 15
 * 
 * Este script identifica e corrige arquivos que acessam params.* diretamente,
 * atualizando-os para usar React.use(params) conforme recomendado no Next.js 15.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Diretórios a serem verificados
const directories = [
  'src/app',
];

// Extensões de arquivos a serem verificados
const extensions = ['.tsx', '.jsx', '.ts', '.js'];

console.log('🔍 Iniciando correção de acesso a parâmetros de rota no Next.js 15...');

// Função para corrigir um arquivo
function fixRouteParams(filePath) {
  try {
    console.log(`Processando: ${filePath}`);
    
    // Ler o conteúdo do arquivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se o arquivo contém acesso direto a params.*
    const paramsRegex = /params\.\w+/g;
    if (!paramsRegex.test(content)) {
      return;
    }
    
    console.log(`🔧 Corrigindo acesso a parâmetros em: ${filePath}`);
    
    // Verificar se já importa React
    if (!content.includes('import React')) {
      if (content.includes('import {')) {
        // Adicionar React a um import existente
        content = content.replace(/import {/, 'import React, {');
      } else {
        // Adicionar novo import para React
        content = `import React from 'react';\n${content}`;
      }
    }
    
    // Verificar se o arquivo tem uma interface PageProps
    if (content.includes('interface PageProps') && content.includes('params:')) {
      // Já tem interface PageProps, verificar se params está definido como Promise
      if (!content.includes('params: Promise<')) {
        // Atualizar a definição de params para Promise
        content = content.replace(
          /interface PageProps[^{]*{[^}]*params:[^;]*;/s,
          match => match.replace(/params:[^;]*;/, 'params: Promise<{ [key: string]: string }>;')
        );
      }
    }
    
    // Verificar se o componente já usa React.use(params)
    if (!content.includes('React.use(params)')) {
      // Adicionar resolvedParams após a declaração do componente
      content = content.replace(
        /(export default function \w+\(\s*{\s*params\s*}[^)]*\)\s*{)/,
        '$1\n  const resolvedParams = React.use(params);'
      );
      
      // Substituir todas as ocorrências de params.X por resolvedParams.X
      const paramNames = [...content.matchAll(/params\.(\w+)/g)].map(match => match[1]);
      const uniqueParamNames = [...new Set(paramNames)];
      
      for (const paramName of uniqueParamNames) {
        // Adicionar constante para cada parâmetro
        content = content.replace(
          /const resolvedParams = React.use\(params\);/,
          `const resolvedParams = React.use(params);\n  const ${paramName} = resolvedParams.${paramName};`
        );
        
        // Substituir todas as ocorrências de params.paramName por paramName
        content = content.replace(new RegExp(`params\\.${paramName}`, 'g'), paramName);
      }
    }
    
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
      fixRouteParams(itemPath);
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