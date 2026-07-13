import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AppModule } from './app.module';
import { Company } from './modules/companies/company.entity';
import { User, UserRole } from './modules/users/user.entity';

async function seedDemoData(app: Awaited<ReturnType<typeof NestFactory.create>>): Promise<void> {
  const config = app.get(ConfigService);
  if (!config.get<boolean>('ENABLE_DEMO_SEED')) return;

  const dataSource = app.get(DataSource);
  const userRepository = dataSource.getRepository(User);
  const companyRepository = dataSource.getRepository(Company);

  let defaultCompany = await companyRepository.findOne({
    where: { document: '00000000000000' },
  });
  if (!defaultCompany) {
    defaultCompany = await companyRepository.save(
      companyRepository.create({
        name: 'Momesso Indústria',
        document: '00000000000000',
        industry: 'Agroindústria',
        contactEmail: 'contato@momesso.ind.br',
      }),
    );
  }

  const demoUsers = [
    {
      email: 'suporte@momesso.ind.br',
      password: config.getOrThrow<string>('DEMO_ADMIN_PASSWORD'),
      fullName: 'Administrador Sistema',
      role: UserRole.ADMIN,
    },
    {
      email: 'gerente@agroforte.com.br',
      password: config.getOrThrow<string>('DEMO_USER_PASSWORD'),
      fullName: 'Gerente Agroforte',
      role: UserRole.USER,
    },
  ];

  for (const demoUser of demoUsers) {
    const exists = await userRepository.findOne({ where: { email: demoUser.email } });
    if (!exists) {
      await userRepository.save(
        userRepository.create({
          email: demoUser.email,
          passwordHash: await bcrypt.hash(demoUser.password, 12),
          fullName: demoUser.fullName,
          role: demoUser.role,
          companyId: defaultCompany.id,
        }),
      );
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.use(json({ limit: '100kb' }));
  app.use(urlencoded({ extended: false, limit: '100kb' }));
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  const allowedOrigins = config
    .getOrThrow<string>('CORS_ORIGIN')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: allowedOrigins,
    credentials: false,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86_400,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Global prefix
  app.setGlobalPrefix('api');

  await seedDemoData(app);

  const port = config.getOrThrow<number>('API_PORT');
  const host = config.getOrThrow<string>('API_HOST');
  await app.listen(port, host);

  console.log(`Momesso API disponível em http://localhost:${port}/api`);
}

void bootstrap();
