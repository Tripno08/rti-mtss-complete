import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

async function createInitialUser() {
  const prisma = new PrismaClient();

  try {
    const hashedPassword = await argon2.hash('Tripno08$');

    const user = await prisma.user.create({
      data: {
        email: 'rafa@cogg.me',
        password: hashedPassword,
        name: 'Rafael Ferraz',
        role: 'ADMIN',
      },
    });

    console.log('Usuário inicial criado com sucesso:', user);
  } catch (error) {
    console.error('Erro ao criar usuário inicial:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialUser(); 