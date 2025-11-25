# 🔌 Documentação de Integração com Microserviços

## ✅ Status da Integração

A integração do frontend React com os microserviços foi concluída com sucesso!

## 🎯 Arquitetura Implementada

```
Frontend React (localhost:3000/4200)
         ↓
    API Gateway (localhost:8080)
         ↓
    ┌────────────────────────────────────┐
    │                                    │
    ├─→ Auth Service (8081)              │
    │   /auth-service/api/auth           │
    │                                    │
    ├─→ Academic Service (8082)          │
    │   /academic-service/api/admin      │
    │                                    │
    ├─→ Student Service (8083)           │
    │   /student-service/api/professor   │
    │                                    │
    └─→ Monitoring Service (8084)        │
        /monitoring-service/api/professor│
        └────────────────────────────────┘
```

## 📁 Estrutura de Arquivos Modificados

### Novos Arquivos

- **`src/config/api.config.js`** - Configuração centralizada dos microserviços

### Arquivos Atualizados

- **`src/services/api.js`** - Axios instance com interceptors e refresh token
- **`src/services/authService.js`** - Autenticação com JWT (accessToken/refreshToken)
- **`src/services/escolaService.js`** - CRUD de escolas via Academic Service
- **`src/services/professorService.js`** - CRUD de professores via Academic Service
- **`src/services/disciplinaService.js`** - CRUD de disciplinas via Academic Service
- **`src/services/alunoService.js`** - CRUD de alunos via Student Service
- **`src/services/monitoriaService.js`** - CRUD de monitorias via Monitoring Service
- **`src/context/AuthContext.jsx`** - Context atualizado para novos tokens

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação

1. **Login**
   ```javascript
   const { login } = useAuth();
   await login(username, password);
   ```
   - Endpoint: `POST /auth-service/api/auth/login`
   - Retorna: `{ accessToken, refreshToken, type: "Bearer", expiresIn }`
   - Armazena tokens no localStorage

2. **Tokens Armazenados**
   - `accessToken` - Token de acesso (curta duração)
   - `refreshToken` - Token para renovação
   - `user` - Dados do usuário (username, email, role)

3. **Refresh Token Automático**
   - Quando recebe erro 401, tenta renovar automaticamente
   - Se renovação falhar, redireciona para login
   - Fila de requisições pendentes durante refresh

4. **Logout**
   ```javascript
   const { logout } = useAuth();
   await logout();
   ```
   - Endpoint: `POST /auth-service/api/auth/logout`
   - Limpa todos os tokens do localStorage

### Roles Suportadas

- `ADMIN` ou `ROLE_ADMIN` - Acesso administrativo
- `PROFESSOR` ou `ROLE_PROFESSOR` - Acesso de professor
- `STUDENT` ou `ROLE_STUDENT` - Acesso de estudante

## 🔧 Configuração da API

### Arquivo: `src/config/api.config.js`

```javascript
export const API_CONFIG = {
  GATEWAY_URL: 'http://localhost:8080',
  SERVICES: {
    AUTH: '/auth-service/api/auth',
    ACADEMIC: '/academic-service/api/admin',
    STUDENT: '/student-service/api/professor',
    MONITORING: '/monitoring-service/api/professor',
  },
  TIMEOUT: 30000,
};
```

**Importante:** Para alterar a URL do backend, modifique apenas `GATEWAY_URL`.

## 📡 Services Disponíveis

### 1. Auth Service

```javascript
import { authService } from '../services/authService';

// Registrar usuário
await authService.register({
  username: 'usuario',
  email: 'email@exemplo.com',
  password: 'senha',
  fullName: 'Nome Completo',
  role: 'ADMIN' // ou 'PROFESSOR', 'STUDENT'
});

// Login
await authService.login('username', 'password');

// Logout
await authService.logout();

// Validar token
const isValid = await authService.validate();

// Verificar autenticação
const isAuth = authService.isAuthenticated();

// Verificar roles
const isAdmin = authService.isAdmin();
const isProfessor = authService.isProfessor();
```

### 2. Academic Service (Escolas, Professores, Disciplinas)

#### Escolas

```javascript
import { escolaService } from '../services/escolaService';

// Listar todas
const escolas = await escolaService.getAll();

// Buscar por ID
const escola = await escolaService.getById(1);

// Criar
await escolaService.create({
  nome: 'Escola UCSAL',
  codigo: 'ESC001',
  endereco: 'Rua X',
  telefone: '(71) 9999-9999',
  email: 'escola@ucsal.br'
});

// Atualizar
await escolaService.update(1, escolaData);

// Inativar/Ativar
await escolaService.inativar(1);
await escolaService.ativar(1);
```

#### Professores

```javascript
import { professorService } from '../services/professorService';

// Listar todos
const professores = await professorService.getAll();

// Listar ativos
const ativos = await professorService.getAtivos();

// Criar
await professorService.create({
  nome: 'Prof. João',
  cpf: '123.456.789-00',
  email: 'joao@ucsal.br',
  telefone: '(71) 9999-9999',
  formacao: 'Ciência da Computação',
  titulacao: 'Mestre',
  escolaId: 1
});

// Atualizar
await professorService.update(1, professorData);

// Inativar/Ativar
await professorService.inativar(1);
await professorService.ativar(1);
```

#### Disciplinas

```javascript
import { disciplinaService } from '../services/disciplinaService';

// Listar todas
const disciplinas = await disciplinaService.getAll();

// Listar ativas
const ativas = await disciplinaService.getAtivas();

// Criar
await disciplinaService.create({
  nome: 'Programação I',
  codigo: 'PROG001',
  cargaHoraria: 60,
  ementa: 'Introdução à programação...',
  escolaId: 1,
  professorId: 1,
  curso: 'Ciência da Computação',
  semestre: '2024.1'
});

// Atualizar
await disciplinaService.update(1, disciplinaData);

// Inativar/Ativar
await disciplinaService.inativar(1);
await disciplinaService.ativar(1);
```

### 3. Student Service (Alunos)

```javascript
import { alunoService } from '../services/alunoService';

// Listar todos
const alunos = await alunoService.getAll();

// Listar ativos
const ativos = await alunoService.getAtivos();

// Buscar por ID
const aluno = await alunoService.getById(1);

// Criar
await alunoService.create({
  nome: 'Maria Silva',
  matricula: '2024001',
  cpf: '987.654.321-00',
  email: 'maria@ucsal.br',
  telefone: '(71) 9999-9999',
  curso: 'Ciência da Computação',
  semestreIngresso: '2024.1',
  escolaId: 1
});

// Atualizar
await alunoService.update(1, alunoData);

// Inativar/Ativar
await alunoService.inativar(1);
await alunoService.ativar(1);
```

### 4. Monitoring Service (Monitorias)

```javascript
import { monitoriaService } from '../services/monitoriaService';

// Listar todas
const monitorias = await monitoriaService.getAll();

// Em andamento
const emAndamento = await monitoriaService.getEmAndamento();

// Por professor
const porProfessor = await monitoriaService.getByProfessor(1);

// Buscar por ID
const monitoria = await monitoriaService.getById(1);

// Criar
await monitoriaService.create({
  titulo: 'Monitoria de Programação',
  descricao: 'Ajuda com exercícios de programação',
  disciplinaId: 1,
  professorId: 1,
  tipo: 'PRESENCIAL', // PRESENCIAL, REMOTO, HIBRIDO
  dataInicio: '2024-11-25T14:00:00',
  dataFim: '2024-11-25T16:00:00',
  local: 'Sala 101',
  linkRemoto: null,
  vagasDisponiveis: 10
});

// Atualizar
await monitoriaService.update(1, monitoriaData);

// Controle de status
await monitoriaService.iniciar(1);
await monitoriaService.finalizar(1);
await monitoriaService.cancelar(1);
await monitoriaService.deletar(1);

// Associar/Remover alunos
await monitoriaService.associarAluno(monitoriaId, alunoId);
await monitoriaService.removerAluno(monitorId);

// Quantidade de alunos
const qtd = await monitoriaService.getQuantidadeAlunos(1);
```

## 🛡️ Proteção de Rotas

As rotas estão protegidas no [App.jsx](src/App.jsx:18-38):

```javascript
<ProtectedRoute requiredRole="ROLE_ADMIN">
  <Layout />
</ProtectedRoute>
```

O componente verifica:
1. Se o usuário está autenticado
2. Se tem a role necessária
3. Redireciona para login se não atender os requisitos

## 🔄 Interceptors HTTP

### Request Interceptor
- Adiciona automaticamente `Authorization: Bearer <token>` em todas as requisições
- Usa `accessToken` do localStorage

### Response Interceptor
- Detecta erro 401 (não autorizado)
- Tenta renovar token automaticamente usando `refreshToken`
- Implementa fila de requisições durante renovação
- Redireciona para login se renovação falhar

## 🚀 Como Usar

### 1. Inicie os Microserviços

```bash
# No diretório raiz onde está o docker-compose.yml
docker-compose up -d
```

Aguarde até que todos os serviços estejam rodando:
- API Gateway: http://localhost:8080
- Auth Service: http://localhost:8081
- Academic Service: http://localhost:8082
- Student Service: http://localhost:8083
- Monitoring Service: http://localhost:8084

### 2. Inicie o Frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (Vite padrão)

### 3. Teste a Integração

1. **Registrar um usuário:**
   - Use Postman/Insomnia ou crie uma página de registro
   - Endpoint: `POST http://localhost:8080/auth-service/api/auth/register`

2. **Fazer login:**
   - Acesse a página de login no frontend
   - Use as credenciais registradas

3. **Navegar pelo sistema:**
   - Se ADMIN: acesse `/admin` para gerenciar escolas, professores e disciplinas
   - Se PROFESSOR: acesse `/professor` para gerenciar monitorias e alunos

## ⚙️ Variáveis de Ambiente (Opcional)

Para diferentes ambientes (dev/prod), você pode criar um arquivo `.env`:

```env
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
```

E atualizar [api.config.js](src/config/api.config.js):

```javascript
export const API_CONFIG = {
  GATEWAY_URL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080',
  // ...
};
```

## 🐛 Troubleshooting

### Erro: CORS

**Problema:** Requisições bloqueadas por CORS

**Solução:** Verifique se o backend permite a origem do frontend:
- Vite dev server: `http://localhost:5173`
- React dev server: `http://localhost:3000`

### Erro: 401 Unauthorized em Loop

**Problema:** Refresh token expirado ou inválido

**Solução:**
1. Limpe o localStorage do navegador
2. Faça login novamente

### Erro: Cannot connect to backend

**Problema:** Microserviços não estão rodando

**Solução:**
```bash
docker-compose ps  # Verificar status
docker-compose up -d  # Iniciar serviços
docker-compose logs -f  # Ver logs
```

### Erro: Invalid token

**Problema:** Token JWT malformado ou expirado

**Solução:**
1. Verifique se o `accessToken` está sendo armazenado corretamente
2. Verifique se o header `Authorization` está correto
3. Teste o endpoint de validate: `POST /auth-service/api/auth/validate`

## 📝 Próximos Passos

1. **Testes**: Criar testes unitários e de integração
2. **Error Handling**: Melhorar tratamento de erros nos componentes
3. **Loading States**: Adicionar estados de loading nas requisições
4. **Notificações**: Implementar toast/snackbar para feedback ao usuário
5. **Validações**: Adicionar validações de formulário mais robustas
6. **Logs**: Implementar sistema de logs no frontend

## 📚 Documentação Adicional

- [React Documentation](https://react.dev)
- [Axios Documentation](https://axios-http.com)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs do backend: `docker-compose logs -f`
2. Verifique o console do navegador (F12)
3. Verifique a aba Network do DevTools para ver as requisições HTTP

---

**Última atualização:** 2024-11-24
**Versão da integração:** 1.0.0
