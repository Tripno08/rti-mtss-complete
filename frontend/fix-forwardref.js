const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Função para processar cada arquivo
const processFile = (filePath) => {
  try {
    console.log(`Processando ${filePath}...`);
    
    // Ler o conteúdo do arquivo
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se o arquivo contém React.forwardRef
    if (!content.includes('React.forwardRef')) {
      console.log(`✅ Arquivo ${filePath} não contém React.forwardRef.`);
      return;
    }
    
    // Executar o codemod para atualizar o arquivo
    console.log(`🔄 Executando codemod para ${filePath}...`);
    
    // Aqui você pode adicionar a lógica para atualizar o arquivo
    // Por enquanto, vamos apenas registrar que o arquivo precisa ser atualizado
    console.log(`⚠️ Arquivo ${filePath} contém React.forwardRef e precisa ser atualizado manualmente.`);
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
};

// Encontrar todos os arquivos TypeScript/JavaScript no diretório frontend/src
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', { cwd: path.resolve(__dirname) });

// Processar cada arquivo
files.forEach(file => {
  const filePath = path.resolve(__dirname, file);
  processFile(filePath);
});

console.log('Processo concluído!');
console.log('Para atualizar os componentes, execute o seguinte comando:');
console.log('npx types-react-codemod@latest preset-19 ./src'); 