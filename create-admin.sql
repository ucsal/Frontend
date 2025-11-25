-- Criar usuário ADMIN
-- Senha: admin123
-- Hash BCrypt da senha "admin123": $2a$10$N9qo8uLOickgx2ZMRZoMye6cO8JdAz3I8YyDOALBELs5QR7Gq5Hqq

INSERT INTO users (username, password, email, full_name, role, is_active, created_at, updated_at)
VALUES (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye6cO8JdAz3I8YyDOALBELs5QR7Gq5Hqq',
  'admin@ucsal.br',
  'Administrador do Sistema',
  'ADMIN',
  true,
  NOW(),
  NOW()
);

-- Criar usuário PROFESSOR para testes
-- Senha: professor123
INSERT INTO users (username, password, email, full_name, role, is_active, created_at, updated_at)
VALUES (
  'professor01',
  '$2a$10$8K1p/h7dEi0HIxPF3pRPNOBBXAIXHl3eZPO5sVzqyXNYLx9j9JQXS',
  'professor01@ucsal.br',
  'Professor Exemplo',
  'PROFESSOR',
  true,
  NOW(),
  NOW()
);

-- Verificar se foram criados
SELECT id, username, email, full_name, role, is_active FROM users;
