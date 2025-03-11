const fs = require('fs');
const path = require('path');

// Lista de arquivos a serem corrigidos
const files = [
  'src/app/(dashboard)/assessments/[id]/edit/page.tsx',
  'src/app/(dashboard)/students/[id]/edit/page.tsx',
  'src/app/(dashboard)/learning-difficulties/[id]/page.tsx',
  'src/app/(dashboard)/students/[id]/page.tsx',
  'src/app/(dashboard)/teams/[id]/page.tsx',
  'src/app/(dashboard)/students/[id]/goals/page.tsx',
  'src/app/(dashboard)/screening/[id]/results/page.tsx',
  'src/app/(dashboard)/students/[id]/plan-intervention/page.tsx',
  'src/app/(dashboard)/meetings/[id]/edit/page.tsx',
  'src/app/(dashboard)/users/[id]/page.tsx',
  'src/app/(dashboard)/interventions/[id]/page.tsx',
  'src/app/(dashboard)/meetings/[id]/page.tsx',
  'src/app/(dashboard)/documents/[id]/page.tsx',
  'src/app/(dashboard)/documents/[id]/edit/page.tsx',
  'src/app/(dashboard)/interventions/[id]/edit/page.tsx',
  'src/app/(dashboard)/interventions/[id]/progress/page.tsx',
  'src/app/(dashboard)/assessments/[id]/page.tsx'
];

// Função para processar cada arquivo
const processFile = (filePath) => {
  try {
    console.log(`Processando ${filePath}...`);
    
    // Ler o conteúdo do arquivo
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se o arquivo já importa React
    const hasReactImport = content.includes('import React from');
    
    // Adicionar import React se necessário
    let newContent = content;
    if (!hasReactImport) {
      newContent = newContent.replace(
        /import {/,
        "import React from 'react';\nimport {"
      );
    }
    
    // Atualizar a interface PageProps
    newContent = newContent.replace(
      /interface PageProps {\s*params: {\s*id: string;\s*};\s*}/,
      `interface PageProps {\n  params: Promise<{\n    id: string;\n  }>;\n}`
    );
    
    // Atualizar o uso de params
    newContent = newContent.replace(
      /export default function (\w+)\(\{ params \}: PageProps\) {(\s*)const router/,
      `export default function $1({ params }: PageProps) {$2const unwrappedParams = React.use(params);$2const { id } = unwrappedParams;$2const router`
    );
    
    // Remover a linha que extrai id de params
    newContent = newContent.replace(/\s*const { id } = params;/, '');
    
    // Escrever o conteúdo modificado de volta no arquivo
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✅ Arquivo ${filePath} atualizado com sucesso.`);
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
};

// Processar cada arquivo
files.forEach(processFile);

console.log('Processo concluído!'); 