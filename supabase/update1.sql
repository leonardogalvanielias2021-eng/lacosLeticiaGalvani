-- Atualizações da tabela de configurações
ALTER TABLE public.configuracoes_loja ADD COLUMN IF NOT EXISTS about_text TEXT;
ALTER TABLE public.configuracoes_loja ADD COLUMN IF NOT EXISTS about_image_url TEXT;
ALTER TABLE public.configuracoes_loja ADD COLUMN IF NOT EXISTS top_banner_text TEXT;
ALTER TABLE public.configuracoes_loja ADD COLUMN IF NOT EXISTS business_hours TEXT;
ALTER TABLE public.configuracoes_loja ADD COLUMN IF NOT EXISTS address TEXT;

-- Atualizações da tabela de variações
ALTER TABLE public.produto_variacoes ADD COLUMN IF NOT EXISTS image_url TEXT;
