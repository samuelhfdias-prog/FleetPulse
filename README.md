# Momesso Indústria - Sistema de Gerenciamento de Parque de Máquinas

Sistema Full-Stack de telemetria, segurança multitenant e inventário para gerenciamento de máquinas agrícolas industriais.

## 🚀 Como Iniciar (Quick Start)

Este projeto foi ajustado para rodar de forma simples e direta utilizando **apenas** o `npm`. 

### Pré-requisitos
- **Node.js** 18+ instalado
- **npm** instalado
- **PostgreSQL** rodando localmente (na porta `5432`) com os dados corretos no `.env`.

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/teste_momesso.git
cd teste_momesso
```

### 2️⃣ Instalar Dependências

Este comando instalará todas as dependências do repositório principal, da API e do WebApp automaticamente:

```bash
npm run install:all
```

### 3️⃣ Iniciar o Banco de Dados

O backend precisa de um banco PostgreSQL ativo. Caso você tenha o Docker instalado na sua máquina, incluí um atalho rápido para subir um banco configurado:

```bash
npm run start:db
```

*(Se preferir rodar seu próprio PostgreSQL local, certifique-se que está na porta 5432 utilizando as configurações presentes no arquivo `api/.env`.)*

### 4️⃣ Iniciar a Aplicação (Front e Back)

Este comando irá iniciar **simultaneamente** o backend e o frontend para desenvolvimento e execução:

```bash
npm start
```

Isso fará com que:
- O backend compile e inicie em **http://localhost:3000**
- O frontend inicie em **http://localhost:4200**

## 🔧 Variáveis de Ambiente (Backend)
Se necessário, verifique o arquivo `api/.env` para conferir as credenciais do banco de dados (Host, Porta, Usuário e Senha). Você deve ter um banco rodando com a mesma configuração ou atualizar o arquivo com os dados do seu Postgres local.

## 📡 API Endpoints

- **Frontend**: http://localhost:4200
- **Backend (API)**: http://localhost:3000/api

## 📝 Troubleshooting

Caso encontre problemas no backend, você pode rodar isoladamente:
```bash
cd api
npm run build
npm run start:prod
```

Para rodar o frontend isoladamente:
```bash
cd web
npm start
```
