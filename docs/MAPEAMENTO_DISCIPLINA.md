# 🔄 Mapeamento de Campos - Disciplina

**Data:** 2025-11-25
**Status:** ✅ Corrigido

## 📋 Disciplina

### Frontend → Backend

| Campo Frontend | Campo Backend | Tipo | Obrigatório | Notas |
|----------------|---------------|------|-------------|-------|
| `sigla` | `codigo` | string | ❌ Não | Frontend usa "Sigla" mas backend espera "codigo" |
| `nome` | `nome` | string | ✅ Sim | ✅ Igual em ambos |
| `descricao` | `ementa` | string | ❌ Não | Frontend usa "Descrição" mas backend espera "ementa" |
| `cargaHoraria` | `cargaHoraria` | number | ✅ Sim | ✅ Igual em ambos (convertido para int) |
| `curso` | `curso` | string | ✅ Sim | ✅ Igual em ambos |
| `matrizVinculada` | `semestre` | string | ❌ Não | Frontend usa "Matriz Vinculada" mas backend espera "semestre" |
| `escolaId` | `escolaId` | number | ✅ Sim | ✅ Convertido para int |
| `professorId` | `professorId` | number | ✅ Sim | ✅ Convertido para int |

### Backend → Frontend (Response)

| Campo Backend | Campo Frontend (Tabela) | Notas |
|---------------|-------------------------|-------|
| `codigo` | `codigo` | ✅ Mostrado diretamente |
| `nome` | `nome` | ✅ Mostrado diretamente |
| `curso` | `curso` | ✅ Mostrado diretamente |
| `cargaHoraria` | `cargaHoraria` | ✅ Mostrado diretamente |
| `professor.nome` | `professor` (render) | ✅ Objeto aninhado |
| `isAtiva` | `isAtiva` | ✅ Mostrado como badge |
| `ementa` | `descricao` (no edit) | ⚠️ Transformado na edição |
| `semestre` | `matrizVinculada` (no edit) | ⚠️ Transformado na edição |
| `escola.id` | `escolaId` (no edit) | ⚠️ Extraído do objeto |
| `professor.id` | `professorId` (no edit) | ⚠️ Extraído do objeto |

### Transformação Implementada

```javascript
// disciplinaService.js - create() e update()
async create(disciplinaData) {
  const payload = {
    nome: disciplinaData.nome,
    codigo: disciplinaData.sigla,                    // sigla → codigo
    cargaHoraria: parseInt(disciplinaData.cargaHoraria),
    ementa: disciplinaData.descricao,                // descricao → ementa
    escolaId: parseInt(disciplinaData.escolaId),
    professorId: parseInt(disciplinaData.professorId),
    curso: disciplinaData.curso,
    semestre: disciplinaData.matrizVinculada,        // matrizVinculada → semestre
  };

  console.log('Payload sendo enviado para disciplina:', payload);
  const response = await api.post(`${BASE_PATH}/disciplinas`, payload);
  return response.data;
}
```

```javascript
// Disciplinas.jsx - handleEdit()
const handleEdit = (disciplina) => {
  setEditingDisciplina(disciplina);
  setFormData({
    sigla: disciplina.codigo || '',                  // codigo → sigla
    nome: disciplina.nome,
    descricao: disciplina.ementa || '',              // ementa → descricao
    cargaHoraria: disciplina.cargaHoraria,
    curso: disciplina.curso,
    matrizVinculada: disciplina.semestre || '',      // semestre → matrizVinculada
    escolaId: disciplina.escola?.id || '',           // objeto escola → id
    professorId: disciplina.professor?.id || '',     // objeto professor → id
  });
  setIsModalOpen(true);
};
```

### ⚠️ Observações

1. **sigla → codigo:** O frontend usa label "Sigla" mas o backend espera "codigo"
2. **descricao → ementa:** O frontend usa label "Descrição" (textarea) mas o backend espera "ementa"
3. **matrizVinculada → semestre:** O frontend usa label "Matriz Vinculada" mas o backend espera "semestre"
4. **Objetos aninhados:** Backend retorna `escola` e `professor` como objetos completos, não apenas IDs
5. **isAtiva:** Campo boolean para status ativo/inativo

---

## 📝 Exemplo de Payload Real

### Dados do Formulário (Frontend):
```json
{
  "sigla": "DISC001",
  "nome": "Programação Orientada a Objetos",
  "descricao": "Disciplina sobre conceitos de POO",
  "cargaHoraria": "80",
  "curso": "Ciência da Computação",
  "matrizVinculada": "2024.1",
  "escolaId": "1",
  "professorId": "2"
}
```

### Payload Enviado ao Backend:
```json
{
  "nome": "Programação Orientada a Objetos",
  "codigo": "DISC001",
  "cargaHoraria": 80,
  "ementa": "Disciplina sobre conceitos de POO",
  "escolaId": 1,
  "professorId": 2,
  "curso": "Ciência da Computação",
  "semestre": "2024.1"
}
```

### Response do Backend:
```json
{
  "id": 1,
  "nome": "Programação Orientada a Objetos",
  "codigo": "DISC001",
  "cargaHoraria": 80,
  "ementa": "Disciplina sobre conceitos de POO",
  "escola": {
    "id": 1,
    "nome": "Escola de Tecnologia",
    "codigo": "ESC001",
    "isAtiva": true
  },
  "professor": {
    "id": 2,
    "nome": "João da Silva",
    "cpf": "123.456.789-00",
    "email": "joao@ucsal.br",
    "formacao": "MESTRADO",
    "isAtivo": true
  },
  "curso": "Ciência da Computação",
  "semestre": "2024.1",
  "isAtiva": true,
  "createdAt": "2025-11-25T18:30:00",
  "updatedAt": "2025-11-25T18:30:00"
}
```

---

## ✅ Status Atual

- ✅ **Mapeamento implementado** para criar e editar disciplinas
- ✅ **Transformação automática** no service
- ✅ **Backend recebe dados no formato correto**
- ✅ **Formulário de edição preenche campos corretamente**
- ✅ **Tabela exibe objetos aninhados (professor, escola)**
- ✅ **Campo `codigo` agora será preenchido** ao criar novas disciplinas

---

## 🎯 Resolução do Problema

### Antes da correção:
```javascript
// disciplinaService.js
async create(disciplinaData) {
  const response = await api.post(`${BASE_PATH}/disciplinas`, disciplinaData);
  // ❌ Enviava: { sigla: "...", descricao: "...", matrizVinculada: "..." }
  // ❌ Backend esperava: { codigo: "...", ementa: "...", semestre: "..." }
  return response.data;
}
```

**Resultado:**
- ❌ Campo `codigo` sempre `null` no banco
- ❌ Campo `ementa` sempre `null`
- ❌ Campo `semestre` sempre `null`

### Depois da correção:
```javascript
// disciplinaService.js
async create(disciplinaData) {
  const payload = {
    nome: disciplinaData.nome,
    codigo: disciplinaData.sigla,                     // ✅ Mapeado corretamente
    ementa: disciplinaData.descricao,                 // ✅ Mapeado corretamente
    semestre: disciplinaData.matrizVinculada,         // ✅ Mapeado corretamente
    cargaHoraria: parseInt(disciplinaData.cargaHoraria),
    escolaId: parseInt(disciplinaData.escolaId),
    professorId: parseInt(disciplinaData.professorId),
    curso: disciplinaData.curso,
  };
  const response = await api.post(`${BASE_PATH}/disciplinas`, payload);
  return response.data;
}
```

**Resultado:**
- ✅ Campo `codigo` preenchido corretamente
- ✅ Campo `ementa` preenchido corretamente
- ✅ Campo `semestre` preenchido corretamente
- ✅ Agora aparece na tabela!

---

**Data:** 2025-11-25
**Status:** 🟢 Mapeamento funcionando corretamente
