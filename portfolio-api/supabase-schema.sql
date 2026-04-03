-- Script para criar as tabelas no Supabase (PostgreSQL)
-- Execute no SQL Editor do Supabase Dashboard

-- Tabela de projetos
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    technologies_raw TEXT DEFAULT '',
    image_url VARCHAR(500),
    demo_url VARCHAR(500),
    repo_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de experiências
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    description TEXT,
    image_url VARCHAR(500),
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de certificados
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    issuer VARCHAR(200) NOT NULL,
    issued_date TIMESTAMPTZ NOT NULL,
    expiry_date TIMESTAMPTZ,
    credential_url VARCHAR(500),
    image_url VARCHAR(500),
    description VARCHAR(1000),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de educação
CREATE TABLE IF NOT EXISTS educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(200) NOT NULL,
    field VARCHAR(200),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de perfil (apenas 1 registro)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    title VARCHAR(200),
    bio TEXT,
    email VARCHAR(200),
    phone VARCHAR(50),
    location VARCHAR(200),
    avatar_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    website_url VARCHAR(500)
);

-- Políticas de RLS (Row Level Security)
-- Leitura pública para todas as tabelas
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Permite leitura pública (a API controla a escrita via autenticação própria)
CREATE POLICY "Leitura publica de projetos" ON projects FOR SELECT USING (true);
CREATE POLICY "Leitura publica de experiencias" ON experiences FOR SELECT USING (true);
CREATE POLICY "Leitura publica de certificados" ON certificates FOR SELECT USING (true);
CREATE POLICY "Leitura publica de educacao" ON educations FOR SELECT USING (true);
CREATE POLICY "Leitura publica de perfil" ON profiles FOR SELECT USING (true);

-- Permite todas as operações via service_role (a API usa a service key)
CREATE POLICY "Service role tem acesso total a projetos" ON projects USING (auth.role() = 'service_role');
CREATE POLICY "Service role tem acesso total a experiencias" ON experiences USING (auth.role() = 'service_role');
CREATE POLICY "Service role tem acesso total a certificados" ON certificates USING (auth.role() = 'service_role');
CREATE POLICY "Service role tem acesso total a educacao" ON educations USING (auth.role() = 'service_role');
CREATE POLICY "Service role tem acesso total a perfil" ON profiles USING (auth.role() = 'service_role');

-- Bucket de storage para imagens
-- Execute no Supabase Dashboard > Storage > Create Bucket
-- Nome: portfolio
-- Público: SIM
