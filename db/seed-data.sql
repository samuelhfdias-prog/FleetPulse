-- =====================================================
-- SEED DATA - Dados Iniciais do Sistema Momesso
-- =====================================================

-- Limpar dados existentes (se houver)
DELETE FROM machines;
DELETE FROM users;
DELETE FROM companies;

-- =====================================================
-- 1. INSERIR COMPANIES
-- =====================================================
INSERT INTO companies (name, document, industry, contact_email, contact_phone, address, city, state, zip_code, is_active)
VALUES 
  (
    'Sementes AgroForte',
    '12.345.678/0001-90',
    'Beneficiamento de Sementes',
    'contato@agroforte.com.br',
    '(65) 3333-4444',
    'Estrada MT-270, Km 12',
    'Cuiabá',
    'MT',
    '78000-000',
    true
  ),
  (
    'Cooperativa Central de Grãos',
    '98.765.432/0001-10',
    'Processamento Agrícola',
    'contato@coop-grains.com.br',
    '(61) 2222-5555',
    'Rodovia BR-116, Lote 250',
    'Brasília',
    'DF',
    '72000-000',
    true
  ),
  (
    'Momesso Indústria de Máquinas',
    '11.222.333/0001-44',
    'Fabricação de Equipamentos Agrícolas',
    'suporte@momesso.ind.br',
    '(11) 3333-7777',
    'Av. Industrial, 1500',
    'São Paulo',
    'SP',
    '05000-000',
    true
  );

-- =====================================================
-- 2. INSERIR USERS
-- =====================================================
-- ADMIN Global (Momesso)
INSERT INTO users (company_id, email, password_hash, full_name, role, is_active)
SELECT id, 'suporte@momesso.ind.br', '$2b$10$nOUIs5kJ7naTuTFkWK1Be.2bS9yfJBQ4TNWaVKpKb.ND5CJiDh6TG', 'Suporte Momesso', 'ADMIN', true
FROM companies WHERE name = 'Momesso Indústria de Máquinas';

-- Usuários da AgroForte
INSERT INTO users (company_id, email, password_hash, full_name, role, is_active)
SELECT id, 'gerente@agroforte.com.br', '$2b$10$nOUIs5kJ7naTuTFkWK1Be.2bS9yfJBQ4TNWaVKpKb.ND5CJiDh6TG', 'Carlos Alberto Silva', 'USER', true
FROM companies WHERE name = 'Sementes AgroForte'
LIMIT 1;

INSERT INTO users (company_id, email, password_hash, full_name, role, is_active)
SELECT id, 'operador@agroforte.com.br', '$2b$10$nOUIs5kJ7naTuTFkWK1Be.2bS9yfJBQ4TNWaVKpKb.ND5CJiDh6TG', 'João Pereira', 'USER', true
FROM companies WHERE name = 'Sementes AgroForte'
LIMIT 1;

-- Usuários da Cooperativa Central
INSERT INTO users (company_id, email, password_hash, full_name, role, is_active)
SELECT id, 'gerente@coop-grains.com.br', '$2b$10$nOUIs5kJ7naTuTFkWK1Be.2bS9yfJBQ4TNWaVKpKb.ND5CJiDh6TG', 'Maria dos Santos', 'USER', true
FROM companies WHERE name = 'Cooperativa Central de Grãos'
LIMIT 1;

INSERT INTO users (company_id, email, password_hash, full_name, role, is_active)
SELECT id, 'tecnico@coop-grains.com.br', '$2b$10$nOUIs5kJ7naTuTFkWK1Be.2bS9yfJBQ4TNWaVKpKb.ND5CJiDh6TG', 'Roberto Ferreira', 'USER', true
FROM companies WHERE name = 'Cooperativa Central de Grãos'
LIMIT 1;

-- =====================================================
-- 3. INSERIR MACHINES - Modelos Momesso Reais
-- =====================================================

-- Máquinas da Sementes AgroForte
INSERT INTO machines (
  company_id, name, model, serial_number, equipment_type, 
  manufacture_date, installation_date, status, location, 
  operating_hours, last_maintenance
)
SELECT 
  c.id, 
  'CTS Contínuo Seed Mix 20T - Unidade 1',
  'CTS Contínuo Seed Mix 20T',
  'MOMESSO-CTS-001-2023',
  'Tratamento de Sementes',
  '2023-05-15',
  '2023-08-20',
  'OPERATIONAL',
  'Galpão Principal - Linha A',
  4520,
  NOW() - INTERVAL '45 days'
FROM companies c WHERE c.name = 'Sementes AgroForte'
LIMIT 1;

INSERT INTO machines (
  company_id, name, model, serial_number, equipment_type, 
  manufacture_date, installation_date, status, location, 
  operating_hours, last_maintenance
)
SELECT 
  c.id, 
  'Mesa Densimétrica Cimbria Delta',
  'Mesa Densimétrica Cimbria Delta',
  'MOMESSO-DELTA-001-2023',
  'Beneficiamento',
  '2023-03-10',
  '2023-06-15',
  'OPERATIONAL',
  'Galpão Principal - Linha B',
  6850,
  NOW() - INTERVAL '30 days'
FROM companies c WHERE c.name = 'Sementes AgroForte'
LIMIT 1;

INSERT INTO machines (
  company_id, name, model, serial_number, equipment_type, 
  manufacture_date, installation_date, status, location, 
  operating_hours, last_maintenance
)
SELECT 
  c.id, 
  'Misturador Vertical MV-250K',
  'Misturador Vertical MV-250K',
  'MOMESSO-MV250-001-2023',
  'Processamento',
  '2023-07-20',
  '2023-09-10',
  'MAINTENANCE',
  'Galpão Secundário',
  2100,
  NOW() - INTERVAL '10 days'
FROM companies c WHERE c.name = 'Sementes AgroForte'
LIMIT 1;

-- Máquinas da Cooperativa Central
INSERT INTO machines (
  company_id, name, model, serial_number, equipment_type, 
  manufacture_date, installation_date, status, location, 
  operating_hours, last_maintenance
)
SELECT 
  c.id, 
  'CTS Contínuo Seed Mix 20T - Unidade 2',
  'CTS Contínuo Seed Mix 20T',
  'MOMESSO-CTS-002-2023',
  'Tratamento de Sementes',
  '2023-04-12',
  '2023-07-18',
  'OPERATIONAL',
  'Complexo de Processamento Central',
  5230,
  NOW() - INTERVAL '35 days'
FROM companies c WHERE c.name = 'Cooperativa Central de Grãos'
LIMIT 1;

INSERT INTO machines (
  company_id, name, model, serial_number, equipment_type, 
  manufacture_date, installation_date, status, location, 
  operating_hours, last_maintenance
)
SELECT 
  c.id, 
  'Mesa Densimétrica Cimbria Delta - Premium',
  'Mesa Densimétrica Cimbria Delta',
  'MOMESSO-DELTA-002-2024',
  'Beneficiamento',
  '2024-01-08',
  '2024-02-20',
  'OPERATIONAL',
  'Complexo de Processamento Central',
  1200,
  NOW() - INTERVAL '25 days'
FROM companies c WHERE c.name = 'Cooperativa Central de Grãos'
LIMIT 1;

INSERT INTO machines (
  company_id, name, model, serial_number, equipment_type, 
  manufacture_date, installation_date, status, location, 
  operating_hours, last_maintenance
)
SELECT 
  c.id, 
  'Misturador Vertical MV-250K Industrial',
  'Misturador Vertical MV-250K',
  'MOMESSO-MV250-002-2023',
  'Processamento',
  '2023-06-05',
  '2023-08-30',
  'IDLE',
  'Armazém de Reserva',
  3400,
  NOW() - INTERVAL '90 days'
FROM companies c WHERE c.name = 'Cooperativa Central de Grãos'
LIMIT 1;

-- =====================================================
-- Verificação de Dados Inseridos
-- =====================================================
SELECT 'Companies Inseridas:' as info, COUNT(*) as total FROM companies;
SELECT 'Users Inseridos:' as info, COUNT(*) as total FROM users;
SELECT 'Machines Inseridas:' as info, COUNT(*) as total FROM machines;

-- Query para visualizar dados (comentada)
-- SELECT u.email, u.role, c.name, COUNT(m.id) as machine_count
-- FROM users u
-- LEFT JOIN companies c ON u.company_id = c.id
-- LEFT JOIN machines m ON c.id = m.company_id
-- GROUP BY u.email, u.role, c.name
-- ORDER BY u.role DESC, c.name;
