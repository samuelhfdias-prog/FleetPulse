# Momesso Indústria - Sistema de Gerenciamento de Parque de Máquinas

Sistema Full-Stack de telemetria, segurança multitenant e inventário para gerenciamento de máquinas agrícolas industriais.

---

## 🛠️ Tecnologias e Arquitetura

Este sistema é divido em duas frentes independentes que operam em harmonia:

1. **Frontend (Angular 21)**
   - Painel de controle moderno (Dashboard) com *Standalone Components*.
   - Formulários Reativos (Reactive Forms) para validação de dados limpa e escalável.
   - Design moderno com CSS nativo e micro-interações (sem uso de frameworks pesados de CSS).
   - Abas responsivas controlando os módulos CRUD nativamente.

2. **Backend (NestJS + TypeORM + SQLite)**
   - API RESTful completa gerando respostas ultra-rápidas.
   - Sistema de Autenticação usando **JWT (JSON Web Token)** e **Bcrypt** para criptografia de senhas.
   - Sistema **Multitenant**, separando o acesso por nível de empresa e `roles` (Permissões: ADMIN vs USER).
   - Auto-seeder inteligente (o banco já cria os usuários de teste automaticamente no primeiro carregamento).

---

## ✨ Funcionalidades (Módulos CRUD Integrados)

O painel está equipado com funcionalidades ativas para operação de ponta a ponta:

- **Autenticação (Login Segura)**
  - Qualquer novo usuário cadastrado na plataforma possui a senha automaticamente criptografada via Bcrypt no backend, e consequentemente, já está apto a fazer login e acessar o Dashboard na mesma hora.
- **Gestão de Máquinas (Machines)**
  - Adicione o tipo de equipamento (Ex: Separadora S200), Número de Série, e vincule a um status.
  - O painel calcula estatísticas (horas totais, taxas de operação).
- **Gestão de Usuários (Users)**
  - Crie perfis para a sua equipe, escolhendo se eles serão `ADMIN` (acesso a tudo) ou `USER` (acesso restrito apenas à sua própria empresa).
- **Gestão de Empresas Clientes (Companies)**
  - Liste os CNPJs e filiais das fazendas que contêm as máquinas. Exclusivo para administradores.

---

## 🚀 Como Iniciar (Quick Start)

Este projeto foi otimizado para rodar de forma simples e direta utilizando **apenas** o `npm`. 

### Pré-requisitos
- **Node.js** 18+ instalado
- **npm** instalado

### 1️⃣ Clonar o Repositório e Instalar
```bash
git clone https://github.com/samuelhfdias-prog/Teste-momesso.git
cd Teste-momesso
npm install
```

*(Nota: Como o banco utiliza SQLite na pasta do projeto, você não precisa se preocupar com portas 5432 ou dockers. É só instalar e rodar!)*

### 2️⃣ Iniciar a Aplicação (Front e Back)
Este comando irá iniciar **simultaneamente** o backend e o frontend usando o pacote `concurrently`:

```bash
npm start
```

Isso fará com que:
- O backend compile e inicie em **http://localhost:3000**
- O frontend inicie e abra automaticamente no navegador em **http://localhost:4200**

---

## 🔑 Acessos e Usuários Pré-Cadastrados

No primeiro carregamento do `npm start`, a nossa API cria automaticamente dados fictícios de demonstração. Você pode utilizar os e-mails abaixo para acessar a plataforma:

### 👤 Acesso Administrador (Acesso Total)
Possui acesso à aba de "Empresas" e consegue visualizar todos os usuários e dados globais do sistema.
- **E-mail:** `suporte@momesso.ind.br`
- **Senha:** `123456`

### 👤 Acesso Cliente/Usuário (Acesso Restrito)
Possui visão restrita apenas ao parque de máquinas da própria empresa. Não consegue deletar dados críticos.
- **E-mail:** `gerente@agroforte.com.br`
- **Senha:** `123456`

> **Lembrete:** Ao cadastrar um **Novo Usuário** na tela de "Gerenciar Usuários", ele pode tentar logar no sistema imediatamente! O back-end cuida de toda a segurança e criptografia no instante do cadastro.

---

## 📝 Troubleshooting / Resolução de Problemas

Se ao rodar o `npm start` você receber um erro `EADDRINUSE (Port 4200 or 3000 is already in use)`, significa que o comando anterior não finalizou corretamente e deixou processos perdidos no computador.

- **Solução no Windows (PowerShell):** 
```powershell
Get-NetTCPConnection -LocalPort 3000,4200 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
```
- Após rodar o comando, apenas inicie com `npm start` novamente.
