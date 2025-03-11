const fs = require('fs');
const path = require('path');

// Lista de arquivos a serem corrigidos
const files = [
  'src/app/(dashboard)/learning-difficulties/page.tsx',
  'src/app/(dashboard)/screening/page.tsx',
  'src/app/(dashboard)/meetings/page.tsx',
  'src/app/(dashboard)/screening/instruments/page.tsx',
  'src/app/(dashboard)/documents/page.tsx',
  'src/app/(dashboard)/interventions/new/page.tsx',
  'src/app/(dashboard)/interventions/library/page.tsx',
  'src/app/(dashboard)/students/page.tsx',
  'src/app/(dashboard)/goals/create/page.tsx',
  'src/app/(dashboard)/assessments/page.tsx'
];

// Mapeamento de valores vazios para valores significativos
const valueMapping = {
  'Todas as categorias': 'all-categories',
  'Todos os tipos': 'all-types',
  'Todos os status': 'all-statuses',
  'Todas as séries': 'all-grades',
  'Todos os níveis': 'all-levels',
  'Nenhuma': 'none'
};

// Função para processar cada arquivo
const processFile = (filePath) => {
  try {
    console.log(`Processando ${filePath}...`);
    
    // Ler o conteúdo do arquivo
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Substituir todos os SelectItem com valor vazio
    let newContent = content;
    
    // Substituir SelectItem com valor vazio e texto específico
    Object.entries(valueMapping).forEach(([text, newValue]) => {
      const regex = new RegExp(`<SelectItem value="">(${text})<\\/SelectItem>`, 'g');
      newContent = newContent.replace(regex, `<SelectItem value="${newValue}">${text}</SelectItem>`);
    });
    
    // Substituir qualquer SelectItem com valor vazio restante (exceto os desabilitados)
    newContent = newContent.replace(/<SelectItem value=""(?! disabled)>([^<]+)<\/SelectItem>/g, (match, text) => {
      const sanitizedText = text.trim().toLowerCase().replace(/\s+/g, '-');
      return `<SelectItem value="${sanitizedText}">${text}</SelectItem>`;
    });
    
    // Atualizar a lógica de filtro
    newContent = newContent.replace(
      /const matches\w+ = (\w+Filter) \? ([^:]+) === \1 : true;/g,
      'const matches$1 = !$1 || $1 === "all-$1s" || $2 === $1;'
    );
    
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