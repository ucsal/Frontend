# 📚 Documentação Técnica

Esta pasta contém documentação técnica detalhada sobre a integração do frontend com o backend.

## 📄 Arquivos

### [INTEGRATION.md](INTEGRATION.md)
Documentação completa da integração entre React frontend e Spring Boot microservices:
- Configuração da API Gateway
- Estrutura dos services
- Autenticação JWT
- Endpoints disponíveis
- Exemplos de uso

### [FIELD_MAPPING_FIXES.md](FIELD_MAPPING_FIXES.md)
Correções de mapeamento de campos aplicadas em todas as páginas:
- Escolas: `tipo` → `codigo`, `ativo` → `isAtiva`
- Professores: `numeroRegistro` → `cpf`, `nomeCompleto` → `nome`
- Disciplinas: `sigla` → `codigo`, `descricao` → `ementa`
- Alunos: `nomeCompleto` → `nome`
- Monitorias: `finalizada` → `status` (enum)

### [MAPEAMENTO_CAMPOS.md](MAPEAMENTO_CAMPOS.md)
Mapeamento detalhado dos campos do Professor:
- Transformação Frontend → Backend
- Backend → Frontend (Response)
- Exemplos de payload
- Campos não utilizados

### [MAPEAMENTO_DISCIPLINA.md](MAPEAMENTO_DISCIPLINA.md)
Mapeamento detalhado dos campos da Disciplina:
- Transformação Frontend → Backend
- Backend → Frontend (Response)
- Explicação das correções aplicadas
- Antes e depois da correção

---

## 🎯 Para que serve esta documentação?

Esta documentação é útil para:
- **Desenvolvedores novos** entenderem como o frontend se comunica com o backend
- **Debugar problemas** de integração ou campos não mapeados
- **Adicionar novas features** sabendo como transformar dados
- **Manutenção futura** quando precisar alterar campos ou endpoints

---

## 🔗 Links Úteis

- [README Principal](../README.md) - Documentação geral do projeto
- [Quick Start](../QUICK_START.md) - Guia rápido de início
- [Código Fonte](../src/) - Código fonte do frontend

---

**Última atualização:** 2025-11-25
