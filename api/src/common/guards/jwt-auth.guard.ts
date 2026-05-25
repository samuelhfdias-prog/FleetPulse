import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DataSource } from 'typeorm';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private dataSource: DataSource) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Executar validação JWT padrão
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    // Injetar company_id na conexão PostgreSQL para RLS
    const user = request.user;
    if (user && user.companyId) {
      try {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        // Executar SET LOCAL app.current_company_id para RLS
        await queryRunner.query('SET LOCAL app.current_company_id = $1', [user.companyId]);
        // Também definir o email como role name para RLS policies
        await queryRunner.query('SET LOCAL role = $1', [`"${user.email}"`]);
        
        // Armazenar no request para cleanup posterior
        request.queryRunner = queryRunner;
      } catch (error) {
        console.error('Erro ao configurar RLS:', error);
        throw new UnauthorizedException('Erro ao configurar sessão de segurança');
      }
    }

    return true;
  }
}

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    // Permite requisições não autenticadas
    if (err || !user) {
      return null;
    }
    return user;
  }
}
