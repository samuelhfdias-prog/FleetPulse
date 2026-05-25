# Momesso Indústria - Sistema de Gerenciamento de Parque de Máquinas

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Sistema Full-Stack de telemetria, segurança multitenant e inventário para gerenciamento de máquinas agrícolas industriais.

## 🏗️ Arquitetura do Projeto

```
teste_momesso/
├── api/                      # Backend NestJS + TypeORM
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/        # Autenticação JWT
│   │   │   ├── companies/   # CRUD de Empresas
│   │   │   ├── users/       # CRUD de Usuários
│   │   │   └── machines/    # CRUD de Máquinas
│   │   ├── common/
│   │   │   ├── guards/      # JWT Auth Guard + RLS
│   │   │   └── decorators/  # Custom Decorators
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── database.config.ts
│   ├── Dockerfile
│   └── package.json
│
├── web/                      # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/    # Auth, Machines, HTTP Interceptor
│   │   │   ├── guards/      # Route Guards
│   │   │   └── components/  # UI Components
│   │   ├── main.ts
│   │   └── index.html
│   ├── Dockerfile
│   ├── package.json
│   └── angular.json
│
├── db/                       # Scripts PostgreSQL
│   ├── init-db.sql          # Schema das tabelas
│   ├── init-policies.sql    # Row Level Security (RLS)
│   └── seed-data.sql        # Dados iniciais
│
├── docker-compose.yml        # Orquestrador
├── README.md                 # Este arquivo
└── .gitignore
```

## 🛡️ Segurança - Row Level Security (RLS)

A proteção de dados é feita **em camadas**:

### Nível 1: PostgreSQL RLS Policies
- **Usuários ADMIN**: Bypass total → veem todos os dados
- **Usuários USER**: Isolamento por empresa → veem apenas dados da sua company
- Policies configuradas em: [db/init-policies.sql](db/init-policies.sql)

### Nível 2: NestJS Guards
- `JwtAuthGuard`: Valida token JWT e injeta `company_id` na transação
- Comando crítico antes de queries:
  ```sql
  SET LOCAL app.current_company_id = 'uuid-da-empresa'
  ```
- Implementação: [api/src/common/guards/jwt-auth.guard.ts](api/src/common/guards/jwt-auth.guard.ts)

### Nível 3: Serviços de Negócio
- Controllers verificam `user.role` e `user.companyId`
- Retornam `ForbiddenException` se acesso negado

## 🚀 Quick Start - Docker Compose

### Pré-requisitos
- Docker 20.10+
- Docker Compose 2.0+
- Git

### Instalação e Deploy

#### 1️⃣ **Clone e Acesse**
```bash
git clone https://github.com/seu-usuario/teste_momesso.git
cd teste_momesso
```

#### 2️⃣ **Construir e Iniciar (um único comando)**
```bash
docker-compose up --build
```

#### 3️⃣ **Acessar a Aplicação via Docker**
| Componente | URL | Porta |
|-----------|-----|-------|
| **Frontend (Angular)** | http://localhost:4200 | 4200 |
| **Backend (NestJS)** | http://localhost:3000/api | 3000 |
| **PostgreSQL** | localhost | 5432 |

#### 4️⃣ **Rodar Localmente sem Docker (Desenvolvimento)**
Caso deseje rodar a aplicação para desenvolvimento local sem o Docker:
**Para o Frontend (Angular 17+ Standalone):**
```bash
cd web
npm install
npm start
```
**Para o Backend (NestJS):**
```bash
cd api
npm install
npm run start:dev
```

### ✅ Dados de Teste - Login

#### ADMIN Global (Momesso)
```
Email:    suporte@momesso.ind.br
Senha:    123456
Role:     ADMIN (acesso total)
```

#### Usuário Empresa 1 (Sementes AgroForte)
```
Email:    gerente@agroforte.com.br
Senha:    123456
Empresa:  Sementes AgroForte
Máquinas: 3 (Seed Mix, Mesa Densimétrica, Misturador)
```

#### Usuário Empresa 2 (Cooperativa Central de Grãos)
```
Email:    gerente@coop-grains.com.br
Senha:    123456
Empresa:  Cooperativa Central de Grãos
Máquinas: 3 (Seed Mix, Mesa Densimétrica, Misturador)
```

### 🛑 Parar os Containers
```bash
docker-compose down
```

### 🔄 Limpar Volumes (Resetar dados)
```bash
docker-compose down -v
```

## 🏢 Dados Iniciais - Seed

Três empresas são criadas automaticamente:

| Empresa | Cidade | Machines | Admin |
|---------|--------|----------|-------|
| Sementes AgroForte | Cuiabá, MT | 3 | Carlos Silva |
| Cooperativa Central | Brasília, DF | 3 | Maria Santos |
| Momesso (Suporte) | São Paulo, SP | - | Suporte |

### Máquinas Realistas (Catálogo Momesso)
- **CTS Contínuo Seed Mix 20T** - Tratamento de Sementes
- **Mesa Densimétrica Cimbria Delta** - Beneficiamento
- **Misturador Vertical MV-250K** - Processamento

## 📡 API Endpoints

### Autenticação
```bash
POST   /api/auth/login              # { email, password } → { accessToken, user }
```

### Empresas (Requer JWT)
```bash
GET    /api/companies               # Lista (ADMIN: todas, USER: sua empresa)
POST   /api/companies               # Criar (ADMIN only)
GET    /api/companies/:id           # Detalhe
PATCH  /api/companies/:id           # Atualizar
DELETE /api/companies/:id           # Deletar (ADMIN only)
```

### Usuários (Requer JWT)
```bash
GET    /api/users                   # Lista
POST   /api/users                   # Criar
GET    /api/users/:id               # Detalhe
PATCH  /api/users/:id               # Atualizar
DELETE /api/users/:id               # Deletar
```

### Máquinas (Requer JWT)
```bash
GET    /api/machines                # Lista (com RLS)
POST   /api/machines                # Criar
GET    /api/machines/:id            # Detalhe
GET    /api/machines/company/:cId   # Por empresa
GET    /api/machines/statistics     # Dashboard stats
PATCH  /api/machines/:id            # Atualizar
DELETE /api/machines/:id            # Deletar
```

## 🔐 Headers Obrigatórios

Todas as requisições autenticadas exigem:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## 🧪 Health Check

```bash
# Verificar se API está rodando
curl http://localhost:3000/api/auth/health

# Resposta esperada:
# {"status":"ok","timestamp":"2024-05-25T10:30:00Z"}
```

## 📝 Variáveis de Ambiente

### Backend (.env)
```env
NODE_ENV=development
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USERNAME=momesso_user
DATABASE_PASSWORD=momesso_secure_pass_2024
DATABASE_NAME=momesso_db
JWT_SECRET=momesso_jwt_secret_key_v2024_test_only
JWT_EXPIRATION=3600
API_PORT=3000
CORS_ORIGIN=*
```

### Frontend (Angular)
- Configurado via [angular.json](web/angular.json)
- Proxy de API: localhost:3000

## 🗄️ Schema do Banco de Dados

### Tabelas
1. **companies** - Empresas clientes
2. **users** - Usuários com role (ADMIN/USER)
3. **machines** - Parque de máquinas

### Relacionamentos
```
companies (1) ──→ (N) users
companies (1) ──→ (N) machines
```

### Políticas RLS
- `admin_all_*` - Bypass para ADMIN
- `user_own_company_*` - Isolamento para USER
- Implementadas em [db/init-policies.sql](db/init-policies.sql)

## 🐛 Troubleshooting

### Docker não inicia
```bash
# Ver logs
docker-compose logs -f

# Limpar e reconstruir
docker-compose down -v
docker-compose up --build
```

### Erro: "Cannot connect to database"
- Aguardar healthcheck (~10 segundos)
- Verificar se porta 5432 não está em uso
- Ver logs do container `db`: `docker-compose logs db`

### Angular: "Module not found"
```bash
docker exec momesso_web npm install
```

### API retorna 401
- Token expirado → fazer login novamente
- JWT_SECRET mismatch → usar mesmo valor em api/main.ts

## 📚 Stack Técnico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | Angular | 21.0 |
| **Backend** | NestJS | 10.3 |
| **Banco** | PostgreSQL | 16 (Alpine) |
| **ORM** | TypeORM | 0.3 |
| **Auth** | JWT + bcrypt | - |
| **HTTP** | Express | - |
| **Containerização** | Docker | 20.10+ |
| **Orquestração** | Docker Compose | 2.0+ |

## 📄 Arquivos Críticos

| Arquivo | Descrição |
|---------|-----------|
| [docker-compose.yml](docker-compose.yml) | Orquestrador dos 3 serviços |
| [db/init-db.sql](db/init-db.sql) | Schema do banco |
| [db/init-policies.sql](db/init-policies.sql) | Políticas RLS |
| [db/seed-data.sql](db/seed-data.sql) | Dados iniciais |
| [api/src/app.module.ts](api/src/app.module.ts) | Configuração da API |
| [api/src/common/guards/jwt-auth.guard.ts](api/src/common/guards/jwt-auth.guard.ts) | Guard + RLS injection |
| [web/src/app/services/auth.service.ts](web/src/app/services/auth.service.ts) | Serviço de auth frontend |

## 🎯 Compliance com Requisitos

✅ **Monorepo** - Estrutura unificada com `/api`, `/web`, `/db`  
✅ **Git Clone + Docker** - Deploy com 2 comandos  
✅ **NestJS + TypeORM + PostgreSQL** - Stack obrigatório implementado  
✅ **JWT + Guards** - Autenticação segura com rotas protegidas  
✅ **Row Level Security** - Isolamento multitenant via PostgreSQL RLS  
✅ **Docker Compose Healthcheck** - Evita race conditions  
✅ **Seed Data** - Dados realistas da Momesso  
✅ **Angular Frontend** - Interface com identidade industrial  
✅ **Dashboard** - Métricas para ADMIN e USER  

## 👨‍💼 Suporte

Contato: suporte@momesso.ind.br  
Documentação: [Wiki do Projeto]  
Issues: GitHub Issues  

---

**Desenvolvido para teste técnico Momesso 2024** 🚜⚙️🔧

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
