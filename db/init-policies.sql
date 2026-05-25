-- Row Level Security Policies para isolamento de dados Multitenant

-- Habilitar RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COMPANIES RLS
-- =====================================================

-- Policy: ADMINs veem todas as companies
CREATE POLICY admin_all_companies ON companies
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.email = current_user_name()
      AND users.role = 'ADMIN'
    )
  );

-- Policy: USERs veem apenas suas próprias companies
CREATE POLICY user_own_company ON companies
  FOR SELECT
  USING (
    id = (
      SELECT company_id FROM users
      WHERE users.email = current_user_name()
      LIMIT 1
    )
  );

-- =====================================================
-- USERS RLS
-- =====================================================

-- Policy: ADMINs veem todos os users
CREATE POLICY admin_all_users ON users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = current_user_name()
      AND u.role = 'ADMIN'
    )
  );

-- Policy: USERs veem apenas users da sua company
CREATE POLICY user_own_company_users ON users
  FOR SELECT
  USING (
    company_id = (
      SELECT company_id FROM users
      WHERE users.email = current_user_name()
      LIMIT 1
    )
  );

-- Policy: USERs podem atualizar apenas usuários da sua company
CREATE POLICY user_update_own_company_users ON users
  FOR UPDATE
  USING (
    company_id = (
      SELECT company_id FROM users
      WHERE users.email = current_user_name()
      LIMIT 1
    )
  )
  WITH CHECK (
    company_id = (
      SELECT company_id FROM users
      WHERE users.email = current_user_name()
      LIMIT 1
    )
  );

-- =====================================================
-- MACHINES RLS
-- =====================================================

-- Policy: ADMINs veem todas as machines
CREATE POLICY admin_all_machines ON machines
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.email = current_user_name()
      AND users.role = 'ADMIN'
    )
  );

-- Policy: USERs veem apenas machines da sua company
CREATE POLICY user_own_company_machines ON machines
  FOR SELECT
  USING (
    company_id = (
      SELECT company_id FROM users
      WHERE users.email = current_user_name()
      LIMIT 1
    )
  );

-- Policy: USERs podem atualizar apenas machines da sua company
CREATE POLICY user_update_own_company_machines ON machines
  FOR UPDATE
  USING (
    company_id = (
      SELECT company_id FROM users
      WHERE users.email = current_user_name()
      LIMIT 1
    )
  )
  WITH CHECK (
    company_id = (
      SELECT company_id FROM users
      WHERE users.email = current_user_name()
      LIMIT 1
    )
  );

-- Policy: USERs podem inserir machines apenas em sua company
CREATE POLICY user_insert_own_company_machines ON machines
  FOR INSERT
  WITH CHECK (
    company_id = (
      SELECT company_id FROM users
      WHERE users.email = current_user_name()
      LIMIT 1
    )
  );

-- =====================================================
-- NOTA DE SEGURANÇA
-- =====================================================
-- As policies acima usam current_user_name() que é configurado no NestJS
-- via: SET LOCAL role 'authenticated_user_email';
-- Alternativa melhor seria usar custom claims no JWT e passar via app.current_user_email
-- Implementação NestJS recomendada: Executar no início de cada request:
-- await queryRunner.query(`SET LOCAL app.current_user_email = $1`, [user.email]);
