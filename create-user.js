const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');

async function createTestUser() {
  const prisma = new PrismaClient();
  try {
    const hashedPassword = await argon2.hash('teste123');
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'teste@example.com',
        name: 'Usuário de Teste',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Usuário criado com sucesso:', user.email);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 