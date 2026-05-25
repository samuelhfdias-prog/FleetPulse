import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Auto-seed Demo Data
  const { DataSource } = require('typeorm');
  const bcrypt = require('bcryptjs');
  const { User, UserRole } = require('./modules/users/user.entity');
  const { Company } = require('./modules/companies/company.entity');
  
  const dataSource = app.get(DataSource);
  const userRepository = dataSource.getRepository(User);
  const companyRepository = dataSource.getRepository(Company);

  let defaultCompany = await companyRepository.findOne({ where: { document: '00000000000000' } });
  if (!defaultCompany) {
    console.log('Seeding initial company...');
    defaultCompany = await companyRepository.save(companyRepository.create({
      name: 'Momesso Indústria',
      document: '00000000000000',
      industry: 'Agroindústria',
      contactEmail: 'contato@momesso.ind.br'
    }));
  }

  const adminExists = await userRepository.findOne({ where: { email: 'suporte@momesso.ind.br' } });
  if (!adminExists) {
    console.log('Seeding admin user...');
    await userRepository.save(userRepository.create({
      email: 'suporte@momesso.ind.br',
      passwordHash: await bcrypt.hash('123456', 10),
      fullName: 'Administrador Sistema',
      role: UserRole.ADMIN,
      companyId: defaultCompany.id
    }));
  }

  const gerenteExists = await userRepository.findOne({ where: { email: 'gerente@agroforte.com.br' } });
  if (!gerenteExists) {
    console.log('Seeding gerente user...');
    await userRepository.save(userRepository.create({
      email: 'gerente@agroforte.com.br',
      passwordHash: await bcrypt.hash('123456', 10),
      fullName: 'Gerente Agroforte',
      role: UserRole.USER,
      companyId: defaultCompany.id
    }));
  }

  const port = process.env.API_PORT || 3000;
  await app.listen(port);

  console.log(`✅ Momesso API running on http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api`);
}

bootstrap();
