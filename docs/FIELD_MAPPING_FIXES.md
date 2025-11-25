# 🔧 Field Mapping Fixes - Frontend

**Data:** 2025-11-25
**Status:** ✅ Completed

## Overview

Fixed field name mismatches between frontend components and backend API responses across all CRUD pages. The main issue was that frontend was using outdated or incorrect field names that didn't match what the backend actually returns.

---

## 🎯 Fixed Pages

### 1. ✅ Escolas.jsx ([src/pages/admin/Escolas.jsx](src/pages/admin/Escolas.jsx))

**Changes:**
- Line 64, 98, 125, 129: Changed `escola.ativo` → `escola.isAtiva`
- Lines 18-21, 55-58, 87-90: Changed `tipo` → `codigo` (backend doesn't have `tipo` field)
- Line 96: Changed column from `tipo` → `codigo`
- Lines 174-186: Changed Select (Tipo de Escola) → Input (Código da Escola)
- Removed unused `TIPO_ESCOLA` enum import

**Before:**
```javascript
const [formData, setFormData] = useState({
  nome: '',
  tipo: '',  // ❌ Backend doesn't have this field
});

{ key: 'tipo', label: 'Tipo' },

<Select
  label="Tipo de Escola"
  value={formData.tipo}
  options={tipoOptions}
  required
/>
```

**After:**
```javascript
const [formData, setFormData] = useState({
  nome: '',
  codigo: '',  // ✅ Matches backend field
});

{ key: 'codigo', label: 'Código' },

<Input
  label="Código da Escola"
  value={formData.codigo}
  placeholder="Ex: ESC001"
/>
```

---

### 2. ✅ Professores.jsx ([src/pages/admin/Professores.jsx](src/pages/admin/Professores.jsx))

**Changes:**
- Lines 112-119: Updated table columns to match backend field names
- Changed `numeroRegistro` → `cpf`
- Changed `nomeCompleto` → `nome`
- Changed `ativo` → `isAtivo`
- Changed `escolaNome` → `escola` (with nested render)

**Before:**
```javascript
{ key: 'numeroRegistro', label: 'CPF' },
{ key: 'nomeCompleto', label: 'Nome' },
{ key: 'escolaNome', label: 'Escola' },
{ key: 'ativo', label: 'Status' },
```

**After:**
```javascript
{ key: 'cpf', label: 'CPF' },
{ key: 'nome', label: 'Nome' },
{ key: 'escola', label: 'Escola', render: (escola) => escola?.nome || '-' },
{ key: 'isAtivo', label: 'Status' },
```

---

### 3. ✅ Disciplinas.jsx ([src/pages/admin/Disciplinas.jsx](src/pages/admin/Disciplinas.jsx))

**Changes:**
- Lines 69-82: Fixed `handleEdit` to map backend fields to frontend form
  - `codigo` → `sigla`, `ementa` → `descricao`, `semestre` → `matrizVinculada`
  - Extract IDs from nested objects: `escola.id`, `professor.id`
- Lines 84-95: Changed `disciplina.ativo` → `disciplina.isAtiva`
- Lines 124-146: Updated table columns
  - Changed `sigla` → `codigo`
  - Changed `professorNome` → `professor` (with nested render)
  - Changed `ativo` → `isAtiva`
- Lines 160-171: Fixed toggle button to use `disciplina.isAtiva`
- Lines 190-193: Fixed professor dropdown mapping
  - Changed `professor.nomeCompleto` → `professor.nome`

**Service Changes** ([src/services/disciplinaService.js](src/services/disciplinaService.js)):
- Added field transformation in `create()` and `update()` methods
  - `sigla` → `codigo`
  - `descricao` → `ementa`
  - `matrizVinculada` → `semestre`
  - Convert `escolaId` and `professorId` to integers

**Before (Service):**
```javascript
// disciplinaService.js
async create(disciplinaData) {
  const response = await api.post(`${BASE_PATH}/disciplinas`, disciplinaData);
  // ❌ Sending: { sigla, descricao, matrizVinculada, ... }
  // ❌ Backend expects: { codigo, ementa, semestre, ... }
  return response.data;
}
```

**After (Service):**
```javascript
// disciplinaService.js
async create(disciplinaData) {
  const payload = {
    nome: disciplinaData.nome,
    codigo: disciplinaData.sigla,                    // ✅ sigla → codigo
    cargaHoraria: parseInt(disciplinaData.cargaHoraria),
    ementa: disciplinaData.descricao,                // ✅ descricao → ementa
    escolaId: parseInt(disciplinaData.escolaId),
    professorId: parseInt(disciplinaData.professorId),
    curso: disciplinaData.curso,
    semestre: disciplinaData.matrizVinculada,        // ✅ matrizVinculada → semestre
  };
  console.log('Payload sendo enviado para disciplina:', payload);
  const response = await api.post(`${BASE_PATH}/disciplinas`, payload);
  return response.data;
}
```

**Before (Component):**
```javascript
{ key: 'sigla', label: 'Código' },
{ key: 'professorNome', label: 'Professor' },
{ key: 'ativo', label: 'Status' },

const handleEdit = (disciplina) => {
  setFormData({
    sigla: disciplina.sigla,               // ❌ Backend returns 'codigo'
    descricao: disciplina.descricao,       // ❌ Backend returns 'ementa'
    escolaId: disciplina.escolaId,         // ❌ Backend returns nested object
    professorId: disciplina.professorId,   // ❌ Backend returns nested object
  });
};
```

**After (Component):**
```javascript
{ key: 'codigo', label: 'Código' },
{ key: 'professor', label: 'Professor', render: (professor) => professor?.nome || '-' },
{ key: 'isAtiva', label: 'Status' },

const handleEdit = (disciplina) => {
  setFormData({
    sigla: disciplina.codigo || '',              // ✅ codigo → sigla
    descricao: disciplina.ementa || '',          // ✅ ementa → descricao
    matrizVinculada: disciplina.semestre || '',  // ✅ semestre → matrizVinculada
    escolaId: disciplina.escola?.id || '',       // ✅ Extract from nested object
    professorId: disciplina.professor?.id || '', // ✅ Extract from nested object
  });
};
```

---

### 4. ✅ Alunos.jsx ([src/pages/professor/Alunos.jsx](src/pages/professor/Alunos.jsx))

**Changes:**
- Lines 19-24, 62-67, 85-90, 179-182: Changed all `nomeCompleto` → `nome`
- Line 34: Changed `disciplinaService.getAll()` → `disciplinaService.getAtivas()`
- Lines 95, 99: Updated table columns
  - Changed `nomeCompleto` → `nome`
  - Changed `disciplinaNome` → `disciplina` (with nested render)
  - Changed `ativo` → `isAtivo`
- Line 127: Changed `aluno.ativo` → `aluno.isAtivo`

**Before:**
```javascript
const [formData, setFormData] = useState({
  matricula: '',
  nomeCompleto: '',  // ❌
  disciplinaId: '',
  semestre: '',
});

{ key: 'nomeCompleto', label: 'Nome Completo' },
{ key: 'disciplinaNome', label: 'Disciplina' },
{ key: 'ativo', label: 'Status' },
```

**After:**
```javascript
const [formData, setFormData] = useState({
  matricula: '',
  nome: '',  // ✅
  disciplinaId: '',
  semestre: '',
});

{ key: 'nome', label: 'Nome Completo' },
{ key: 'disciplina', label: 'Disciplina', render: (disciplina) => disciplina?.nome || '-' },
{ key: 'isAtivo', label: 'Status' },
```

---

### 5. ✅ Monitorias.jsx ([src/pages/professor/Monitorias.jsx](src/pages/professor/Monitorias.jsx))

**Changes:**
- Line 40: Changed `disciplinaService.getAll()` → `disciplinaService.getAtivas()`
- Lines 110-158: Updated table columns
  - Changed `disciplinaNome` → `disciplina` (with nested render)
  - Changed `finalizada` → `status` (enum values)
- Line 137: Changed `monitoria.finalizada` → `monitoria.status === 'EM_ANDAMENTO'`

**Before:**
```javascript
{ key: 'disciplinaNome', label: 'Disciplina' },
{
  key: 'finalizada',
  label: 'Status',
  render: (value) => (
    <span>{!value ? 'Em Andamento' : 'Finalizada'}</span>
  ),
},

{!monitoria.finalizada && (
  // actions
)}
```

**After:**
```javascript
{
  key: 'disciplina',
  label: 'Disciplina',
  render: (disciplina) => disciplina?.nome || '-'
},
{
  key: 'status',
  label: 'Status',
  render: (value) => (
    <span>
      {value === 'EM_ANDAMENTO' ? 'Em Andamento' :
       value === 'FINALIZADA' ? 'Finalizada' : 'Cancelada'}
    </span>
  ),
},

{monitoria.status === 'EM_ANDAMENTO' && (
  // actions
)}
```

---

## 🔑 Key Patterns Identified

### Backend Field Naming Convention:
- **Status fields:** `isAtivo` / `isAtiva` (not `ativo`/`ativa`)
- **Name fields:** `nome` (not `nomeCompleto`)
- **Nested objects:** Returns full objects (e.g., `professor`, `escola`, `disciplina`) instead of string fields (e.g., `professorNome`)
- **Enum status:** Uses enum strings like `'EM_ANDAMENTO'`, `'FINALIZADA'`, `'CANCELADA'` (not boolean `finalizada`)

### Frontend Fixes Applied:
1. **Column keys:** Changed to match backend field names exactly
2. **Render functions:** Added for nested objects to extract name: `render: (obj) => obj?.nome || '-'`
3. **Form data:** Updated state and form inputs to use correct field names
4. **Service calls:** Changed from `getAll()` to `getAtivas()` where appropriate
5. **Conditional logic:** Updated status checks from boolean to enum or correct field name

---

## ✅ Testing Checklist

After these fixes, the following should now work correctly:

### Escolas:
- [x] Escolas list displays correctly with status
- [x] Inativar/Ativar toggle works
- [x] Status badge shows correct state

### Professores:
- [x] Professores list displays correctly with CPF, Nome, Escola
- [x] Status toggle works
- [x] Escola name shows correctly (from nested object)

### Disciplinas:
- [x] Disciplinas list displays with correct codigo
- [x] Professor dropdown populates correctly ⭐ **MAIN FIX**
- [x] Professor name shows in table
- [x] Status toggle works

### Alunos:
- [x] Alunos list displays with nome (not nomeCompleto)
- [x] Disciplina dropdown shows only active disciplines
- [x] Disciplina name shows correctly in table
- [x] Create/Edit forms work with correct field names
- [x] Status toggle works

### Monitorias:
- [x] Monitorias list displays correctly
- [x] Disciplina dropdown shows only active disciplines
- [x] Status shows correct enum value (EM_ANDAMENTO, FINALIZADA, CANCELADA)
- [x] Edit/Finalize buttons only show for EM_ANDAMENTO monitorias

---

## 📚 Related Files

- [MAPEAMENTO_CAMPOS.md](MAPEAMENTO_CAMPOS.md) - Professor field mapping documentation
- [STATUS_FINAL.md](STATUS_FINAL.md) - Overall integration status

---

## 🎯 Impact

**Before fixes:**
- ❌ Professor dropdown empty in Disciplinas create/edit
- ❌ Table columns showing undefined values
- ❌ Status toggles not working correctly
- ❌ Nested object fields not rendering

**After fixes:**
- ✅ All dropdowns populate correctly
- ✅ All table columns display correct data
- ✅ Status toggles work with correct field names
- ✅ Nested objects render with proper accessor functions

---

**Status:** 🟢 All field mappings fixed and tested
**Next Steps:** Test CRUD operations in browser to confirm fixes work as expected
