# 🔄 Mapeamento de Campos Frontend ↔ Backend

## 📋 Professor

### Frontend → Backend

| Campo Frontend | Campo Backend | Tipo | Obrigatório |
|----------------|---------------|------|-------------|
| `nomeCompleto` | `nome` | string | ✅ Sim |
| `numeroRegistro` | `cpf` | string | ✅ Sim |
| `email` | `email` | string | ✅ Sim |
| `telefone` | `telefone` | string | ❌ Não |
| `formacao` | `formacao` | string | ❌ Não |
| `nomeCurso` | `titulacao` | string | ❌ Não |
| `escolaId` | `escolaId` | number | ✅ Sim |

### Transformação Implementada

```javascript
// professorService.js - create()
const payload = {
  nome: professorData.nomeCompleto,
  cpf: professorData.numeroRegistro,
  email: professorData.email,
  telefone: professorData.telefone || '',
  formacao: professorData.formacao,
  titulacao: professorData.nomeCurso,
  escolaId: parseInt(professorData.escolaId),
};
```

### ⚠️ Observações

1. **numeroRegistro → cpf:** O frontend usa "Número de Registro" mas o backend espera "CPF"
2. **nomeCurso → titulacao:** O frontend usa "Curso" mas o backend espera "Titulação"
3. **escolaId:** Convertido de string para number com `parseInt()`

---

## 🔄 Campos que não são usados no backend

Estes campos existem no formulário mas NÃO são enviados ao backend:

- ❌ `nomeInstituicao` - Nome da instituição de formação
- ❌ `anoConclusao` - Ano de conclusão do curso
- ❌ `username` - Nome de usuário (para login)
- ❌ `password` - Senha (para login)

### Por quê?

O backend atual não espera esses campos no endpoint de criação de professor. Se você quiser usar esses campos, precisará:

1. **Adicionar no DTO do backend**
2. **Atualizar o mapeamento no service do frontend**

---

## 📝 Exemplo de Payload Real

### Dados do Formulário (Frontend):
```json
{
  "numeroRegistro": "123.456.789-00",
  "nomeCompleto": "João da Silva",
  "telefone": "(71) 99999-9999",
  "formacao": "MESTRADO",
  "nomeInstituicao": "UFBA",
  "nomeCurso": "Ciência da Computação",
  "anoConclusao": "2020",
  "escolaId": "1",
  "username": "joao.silva",
  "email": "joao@ucsal.br",
  "password": "senha123"
}
```

### Payload Enviado ao Backend:
```json
{
  "nome": "João da Silva",
  "cpf": "123.456.789-00",
  "email": "joao@ucsal.br",
  "telefone": "(71) 99999-9999",
  "formacao": "MESTRADO",
  "titulacao": "Ciência da Computação",
  "escolaId": 1
}
```

---

## 🔧 Como Adicionar Novos Campos

Se você quiser que o backend aceite os campos extras (`nomeInstituicao`, `anoConclusao`, etc):

### 1. Backend (Java):

```java
// ProfessorDTO.java ou ProfessorRequest.java
public class ProfessorRequest {
    private String nome;
    private String cpf;
    private String email;
    private String telefone;
    private String formacao;
    private String titulacao;
    private Long escolaId;

    // NOVOS CAMPOS
    private String nomeInstituicao;
    private String anoConclusao;
    private String username;
    // password tratado separadamente por segurança
}
```

### 2. Frontend (JavaScript):

```javascript
// professorService.js
async create(professorData) {
  const payload = {
    nome: professorData.nomeCompleto,
    cpf: professorData.numeroRegistro,
    email: professorData.email,
    telefone: professorData.telefone || '',
    formacao: professorData.formacao,
    titulacao: professorData.nomeCurso,
    escolaId: parseInt(professorData.escolaId),

    // ADICIONAR NOVOS CAMPOS
    nomeInstituicao: professorData.nomeInstituicao,
    anoConclusao: professorData.anoConclusao,
  };

  const response = await api.post(`${BASE_PATH}/professores`, payload);
  return response.data;
}
```

---

## ✅ Status Atual

- ✅ **Mapeamento implementado** para campos obrigatórios
- ✅ **Transformação automática** no service
- ✅ **Backend recebe dados no formato correto**
- ⚠️ **Campos extras ignorados** (não são enviados)

---

## 🎯 Próximos Passos Sugeridos

1. **Decidir se campos extras são necessários**
   - `nomeInstituicao`, `anoConclusao` são relevantes?
   - `username` e `password` devem ser criados automaticamente pelo backend?

2. **Se SIM:**
   - Atualizar DTO no backend
   - Atualizar mapeamento no frontend
   - Implementar criação de usuário junto com professor

3. **Se NÃO:**
   - Remover campos desnecessários do formulário
   - Simplificar UX

---

**Data:** 2024-11-24
**Status:** ✅ Mapeamento funcionando corretamente
