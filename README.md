# Portfolio Monorepo

Sistema completo de portfólio pessoal com painel administrativo.

## Estrutura

```
/
├── portfolio-api/          → Backend .NET Core (API REST)
├── portfolio-admin/        → Painel admin (Angular)
└── my-portfolio-style-guide/ → Site do portfólio (React + Vite)
```

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- Conta no [Supabase](https://supabase.com/) (banco de dados PostgreSQL)

---

## Setup após clonar

### 1. Backend

```bash
cd portfolio-api/src/PortfolioApi
```

Copie o arquivo de configuração de desenvolvimento:

```bash
cp appsettings.Development.json.example appsettings.Development.json
```

Edite `appsettings.Development.json` preenchendo:
- `ConnectionStrings.DefaultConnection` → string de conexão do Supabase
- `Jwt.Key` → string secreta com no mínimo 32 caracteres
- `AdminPassword` → senha que você usará para entrar no painel admin
- `Supabase.Url` e `Supabase.ServiceKey` → dados do seu projeto Supabase (opcional, para upload de imagens na nuvem)

Rode as migrações e inicie a API:

```bash
$env:ASPNETCORE_ENVIRONMENT="Development"
dotnet run
```

API disponível em: `http://localhost:5000`

---

### 2. Painel Admin (Angular)

```bash
cd portfolio-admin
npm install
npm start
```

Admin disponível em: `http://localhost:4200`

---

### 3. Site do Portfólio (React/Vite)

```bash
cd my-portfolio-style-guide
npm install
npm run dev
```

Portfólio disponível em: `http://localhost:5173`

> Se a API estiver em outra porta, crie um arquivo `.env` baseado em `.env.example` e ajuste `VITE_API_URL`.

---

## Variáveis de ambiente

| Projeto | Arquivo | Descrição |
|---|---|---|
| Backend | `appsettings.Development.json` | Credenciais do banco, JWT, senha admin |
| Portfólio | `.env` (opcional) | URL da API |

> Esses arquivos **não são versionados** por segurança. Use os `.example` como base.
