import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

async function createAdmin() {
  const prisma = new PrismaClient();

  try {
    const hashedPassword = await argon2.hash('admin123');

    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'ADMIN',
      },
    });

    console.log('Usuário admin criado com sucesso:', admin);
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 