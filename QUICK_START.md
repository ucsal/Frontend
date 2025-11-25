# 🚀 Guia Rápido de Uso

## ⚡ Start em 3 Passos

### 1️⃣ Inicie os Microserviços
```bash
# No diretório onde está o docker-compose.yml
docker-compose up -d

# Aguarde ~30 segundos para todos iniciarem
docker-compose ps  # Verificar se todos estão "Up"
```

### 2️⃣ Inicie o Frontend
```bash
# No diretório /home/alvaro/Documentos/frontend
npm run dev
```

### 3️⃣ Acesse o Sistema
```
http://localhost:5173
```

## 🔑 Criar Primeiro Usuário

Use **Postman**, **Insomnia** ou **curl**:

```bash
curl -X POST http://localhost:8080/auth-service/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@ucsal.br",
    "password": "senha123",
    "fullName": "Administrador",
    "role": "ADMIN"
  }'
```

Roles disponíveis: `ADMIN`, `PROFESSOR`, `STUDENT`

## 📋 Testar Integração

1. **Login no frontend** com as credenciais criadas
2. **Navegar para:**
   - Admin: `http://localhost:5173/admin`
   - Professor: `http://localhost:5173/professor`

## 🔍 Verificar se Tudo Está OK

### Backend rodando?
```bash
# Todos devem estar "Up"
docker-compose ps
```

Deve mostrar:
```
api-gateway          Up    0.0.0.0:8080->8080/tcp
auth-service         Up
academic-service     Up
student-service      Up
monitoring-service   Up
```

### Frontend rodando?
```bash
# Deve mostrar: Local: http://localhost:5173/
npm run dev
```

### Logs dos microserviços
```bash
# Ver logs de todos
docker-compose logs -f

# Ver logs de um específico
docker-compose logs -f auth-service
docker-compose logs -f academic-service
```

## 🎯 Exemplos de Uso nos Componentes

### Login
```jsx
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      // Redireciona automaticamente após login
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

### Listar Escolas (Admin)
```jsx
import { useEffect, useState } from 'react';
import { escolaService } from '../services/escolaService';

function EscolasPage() {
  const [escolas, setEscolas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEscolas();
  }, []);

  const loadEscolas = async () => {
    try {
      const data = await escolaService.getAll();
      setEscolas(data);
    } catch (error) {
      console.error('Erro ao carregar escolas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {escolas.map(escola => (
        <div key={escola.id}>{escola.nome}</div>
      ))}
    </div>
  );
}
```

### Criar Monitoria (Professor)
```jsx
import { monitoriaService } from '../services/monitoriaService';

function NovaMonitoriaForm() {
  const handleSubmit = async (formData) => {
    try {
      await monitoriaService.create({
        titulo: formData.titulo,
        descricao: formData.descricao,
        disciplinaId: formData.disciplinaId,
        professorId: formData.professorId,
        tipo: 'PRESENCIAL', // PRESENCIAL, REMOTO, HIBRIDO
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        local: formData.local,
        vagasDisponiveis: formData.vagas
      });
      alert('Monitoria criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar monitoria:', error);
      alert('Erro ao criar monitoria');
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

### Verificar Role
```jsx
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, isAdmin, isProfessor } = useAuth();

  return (
    <div>
      <h1>Bem-vindo, {user?.username}!</h1>

      {isAdmin() && (
        <div>
          <h2>Painel Administrativo</h2>
          {/* Conteúdo apenas para admins */}
        </div>
      )}

      {isProfessor() && (
        <div>
          <h2>Painel do Professor</h2>
          {/* Conteúdo apenas para professores */}
        </div>
      )}
    </div>
  );
}
```

## 🛑 Parar os Serviços

```bash
# Parar microserviços (mantém dados)
docker-compose stop

# Parar e remover containers (mantém dados)
docker-compose down

# Parar, remover containers E volumes (apaga dados)
docker-compose down -v
```

## 🔧 Comandos Úteis

### Reiniciar um serviço específico
```bash
docker-compose restart auth-service
```

### Ver logs em tempo real
```bash
docker-compose logs -f --tail=100
```

### Rebuild após mudanças no backend
```bash
docker-compose down
docker-compose up -d --build
```

### Limpar tudo (cuidado!)
```bash
docker-compose down -v
docker system prune -a
```

## 📊 Monitoramento

### Verificar se API Gateway está respondendo
```bash
curl http://localhost:8080/actuator/health
```

### Testar endpoint de login
```bash
curl -X POST http://localhost:8080/auth-service/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"senha123"}'
```

## 🐛 Problemas Comuns

### "Cannot connect to backend"
```bash
# Verificar se serviços estão rodando
docker-compose ps

# Se não estiverem, iniciar
docker-compose up -d
```

### "CORS error"
- Verifique se o backend permite `http://localhost:5173`
- Ou a porta que você está usando no Vite

### "401 Unauthorized"
- Limpe o localStorage do navegador
- Faça logout e login novamente
- Verifique se o token está expirado

### "Network timeout"
- Verifique logs: `docker-compose logs -f`
- Aumente timeout no [api.config.js](src/config/api.config.js): `TIMEOUT: 60000`

### Frontend não inicia
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 💡 Dicas

1. **Use o DevTools do navegador (F12)**
   - Aba Network: ver requisições HTTP
   - Aba Console: ver erros
   - Aba Application > Local Storage: ver tokens

2. **Teste endpoints diretamente**
   - Use Postman/Insomnia antes de integrar
   - Verifique se resposta está no formato esperado

3. **Logs são seus amigos**
   ```bash
   # Backend
   docker-compose logs -f

   # Frontend
   # Veja o terminal onde rodou npm run dev
   ```

## 📞 Suporte

Se encontrar problemas:
1. Verifique esta documentação
2. Veja [INTEGRATION.md](INTEGRATION.md) para detalhes técnicos
3. Veja [MIGRATION_NOTES.md](MIGRATION_NOTES.md) para pendências

---

**Pronto!** Agora você pode começar a usar o sistema integrado! 🎉
