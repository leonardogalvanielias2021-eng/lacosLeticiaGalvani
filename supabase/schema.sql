-- Habilitar a extensão pgcrypto para gerar UUIDs, se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Criação das Tabelas
-- ==========================================

-- Tabela de Funções (Roles)
CREATE TABLE public.user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, role)
);

-- Tabela de Categorias
CREATE TABLE public.categorias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Produtos
CREATE TABLE public.produtos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    old_price NUMERIC(10,2) CHECK (old_price >= 0),
    category_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
    age_range TEXT,
    materials TEXT,
    measurements TEXT,
    stock INTEGER DEFAULT 0 NOT NULL CHECK (stock >= 0),
    rating NUMERIC(2,1) DEFAULT 5.0,
    reviews INTEGER DEFAULT 0,
    is_new BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Fotos do Produto
CREATE TABLE public.produto_fotos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Variações do Produto (Ex: Cores)
CREATE TABLE public.produto_variacoes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hex_code TEXT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Banners
CREATE TABLE public.banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de Configurações da Loja
CREATE TABLE public.configuracoes_loja (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_name TEXT NOT NULL,
    contact_email TEXT,
    whatsapp_number TEXT,
    instagram_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Índices para performance
-- ==========================================
CREATE INDEX idx_produtos_category ON public.produtos(category_id);
CREATE INDEX idx_produtos_slug ON public.produtos(slug);
CREATE INDEX idx_categorias_slug ON public.categorias(slug);
CREATE INDEX idx_produto_fotos_product ON public.produto_fotos(product_id);
CREATE INDEX idx_produto_variacoes_product ON public.produto_variacoes(product_id);
-- Novo índice ILIKE/Search
CREATE INDEX idx_produtos_name_search ON public.produtos USING gin (to_tsvector('portuguese', name));

-- ==========================================
-- 3. Função has_role
-- ==========================================
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = role_name
  );
$$;

-- ==========================================
-- 4. Habilitar RLS (Row Level Security)
-- ==========================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_variacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_loja ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 5. Políticas RLS (Policies)
-- ==========================================

-- User Roles
CREATE POLICY "Admins e proprio usuario podem ver roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id OR public.has_role('admin'));

-- Categorias
CREATE POLICY "Categorias ativas sao publicas" ON public.categorias
FOR SELECT USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Admins podem tudo em categorias" ON public.categorias
FOR ALL USING (public.has_role('admin'));

-- Produtos
CREATE POLICY "Produtos ativos sao publicos" ON public.produtos
FOR SELECT USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Admins podem tudo em produtos" ON public.produtos
FOR ALL USING (public.has_role('admin'));

-- Fotos
CREATE POLICY "Fotos de produtos ativos sao publicas" ON public.produto_fotos
FOR SELECT USING (
  deleted_at IS NULL AND EXISTS (
    SELECT 1 FROM public.produtos 
    WHERE produtos.id = produto_fotos.product_id 
    AND produtos.is_active = true
    AND produtos.deleted_at IS NULL
  )
);

CREATE POLICY "Admins podem tudo em fotos" ON public.produto_fotos
FOR ALL USING (public.has_role('admin'));

-- Variações
CREATE POLICY "Variacoes de produtos ativos sao publicas" ON public.produto_variacoes
FOR SELECT USING (
  deleted_at IS NULL AND EXISTS (
    SELECT 1 FROM public.produtos 
    WHERE produtos.id = produto_variacoes.product_id 
    AND produtos.is_active = true
    AND produtos.deleted_at IS NULL
  )
);

CREATE POLICY "Admins podem tudo em variacoes" ON public.produto_variacoes
FOR ALL USING (public.has_role('admin'));

-- Banners
CREATE POLICY "Banners ativos sao publicos" ON public.banners
FOR SELECT USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Admins podem tudo em banners" ON public.banners
FOR ALL USING (public.has_role('admin'));

-- Configurações da loja
CREATE POLICY "Configuracoes da loja sao publicas" ON public.configuracoes_loja
FOR SELECT USING (true);

CREATE POLICY "Admins podem alterar configuracoes" ON public.configuracoes_loja
FOR ALL USING (public.has_role('admin'));

-- ==========================================
-- 6. Storage e Políticas do Bucket
-- ==========================================

-- Inserir o bucket 'produtos' se ele não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('produtos', 'produtos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
CREATE POLICY "Imagens publicas de produtos" ON storage.objects
FOR SELECT USING (bucket_id = 'produtos');

CREATE POLICY "Admins podem gerenciar imagens" ON storage.objects
FOR ALL USING (
  bucket_id = 'produtos' 
  AND public.has_role('admin')
);
