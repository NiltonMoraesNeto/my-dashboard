# My Dashboard - Frontend

Dashboard administrativo moderno desenvolvido com React, TypeScript e tecnologias modernas para gerenciamento de usuários, vendas e perfis.

## 🚀 Tecnologias

- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **CSS Framework**: [TailwindCSS](https://tailwindcss.com/) para estilização
- **Componentes**: [shadcn/ui](https://ui.shadcn.com/) para componentes reutilizáveis
- **Gráficos**: [Recharts](https://recharts.org/)
- **Formulários**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Autenticação**: JWT com Context API
- **HTTP Client**: [Axios](https://axios-http.com/)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌐 Acesso

- **Desenvolvimento**: [http://localhost:5173](http://localhost:5173)
- **Login**: [http://localhost:5173/login](http://localhost:5173/login)

## 📋 Funcionalidades

### 🔐 Autenticação

- Login com email e senha
- JWT tokens com renovação automática
- Proteção de rotas privadas
- Logout automático em caso de token expirado

### 🏠 Dashboard Home

- Gráficos de vendas mensais dinâmicos
- Comparativos de negociado, cancelado e vendido
- Dados em tempo real do backend
- Estados de loading e tratamento de erros

### 👥 Gestão de Usuários

- Listagem paginada de usuários
- Busca e filtros
- Criação e edição de usuários
- Gerenciamento de perfis de acesso

### 📊 Gestão de Vendas

- Dashboard de vendas por prédio
- Relatórios e gráficos interativos
- Filtros por ano e categoria

### ⚙️ Gestão de Perfis

- Criação e edição de perfis de usuário
- Controle de permissões
- Interface administrativa

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:4000
```

### Backend

Este frontend consome APIs do backend NestJS. Certifique-se de que o backend esteja rodando em `http://localhost:4000`.

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── charts/         # Componentes de gráficos
│   ├── ui/             # Componentes shadcn/ui
│   └── modals/         # Modais do sistema
├── contexts/           # Context API (Auth)
├── lib/                # Utilitários (utils, validações)
├── model/              # Interfaces TypeScript
├── pages/              # Páginas da aplicação
│   ├── Home/           # Dashboard principal
│   ├── Login/          # Tela de login
│   ├── Profile/        # Gestão de perfis
│   └── Users/          # Gestão de usuários
├── schemas/            # Schemas Zod para validação
├── services/           # Serviços de API
└── App.tsx             # Componente raiz
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build
npm run lint             # Verificar lint

# Código
npm run format           # Formatar código com Prettier
npm run type-check       # Verificar tipos TypeScript
```

## 🏗️ Arquitetura

### Autenticação

- Context API para gerenciamento de estado global
- JWT tokens armazenados no localStorage
- Interceptors Axios para injeção automática de tokens
- Renovação automática de tokens

### Roteamento

- React Router com proteção de rotas
- Redirecionamento automático baseado em autenticação
- Rotas dinâmicas com parâmetros

### Estado

- Context API para estado global (auth)
- useState e useEffect para estado local
- Hooks customizados para lógica reutilizável

## 🔗 Integração com Backend

O frontend consome as seguintes APIs:

- `POST /auth/login` - Autenticação
- `GET /users` - Listagem de usuários
- `GET /profiles` - Listagem de perfis
- `GET /sales` - Dados de vendas
- `GET /dashboard/sales-monthly` - Dados mensais
- `GET /dashboard/sales-comparison` - Dados comparativos

## 📄 Licença

Este projeto é privado e proprietário.

---

**Desenvolvido com ❤️ usando React + TypeScript + Vite**
