const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Padrão a ser substituído
const pattern = /export default function (\w+)\(\{ params \}: \{ params: \{ id: string \} \}\)/;
const replacement = `interface PageProps {
  params: {
    id: string;
  };
}

export default function $1({ params }: PageProps)`;

// Processar cada arquivo
files.forEach(filePath => {
  try {
    console.log(`Processando ${filePath}...`);
    
    // Ler o conteúdo do arquivo
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Substituir o padrão
    const newContent = content.replace(pattern, replacement);
    
    // Escrever o conteúdo modificado de volta no arquivo
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✅ Arquivo ${filePath} atualizado com sucesso.`);
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
});

console.log('Processo concluído!'); 