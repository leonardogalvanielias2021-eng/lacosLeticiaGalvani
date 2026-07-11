-- =========================================================================
-- Laços Letícia Galvani — Esquema inicial
-- Cole este arquivo no SQL Editor do seu projeto Supabase e execute.
-- =========================================================================

-- ---------- Enum de papéis ----------
do $$ begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin');
  end if;
end $$;

-- ---------- Tabela user_roles ----------
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

drop policy if exists "users read own roles" on public.user_roles;
create policy "users read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

-- ---------- Função has_role ----------
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

-- =========================================================================
-- Categorias
-- =========================================================================
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  imagem_url text,
  ordem int not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.categorias to anon, authenticated;
grant insert, update, delete on public.categorias to authenticated;
grant all on public.categorias to service_role;
alter table public.categorias enable row level security;
drop policy if exists "categorias public read" on public.categorias;
create policy "categorias public read" on public.categorias
  for select to anon, authenticated
  using (ativo = true or public.has_role(auth.uid(), 'admin'));
drop policy if exists "categorias admin write" on public.categorias;
create policy "categorias admin write" on public.categorias
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- Produtos
-- =========================================================================
create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  descricao_curta text,
  descricao text,
  preco numeric(10,2) not null default 0,
  preco_promocional numeric(10,2),
  categoria_id uuid references public.categorias(id) on delete set null,
  estoque int not null default 0,
  destaque boolean not null default false,
  novo boolean not null default false,
  ativo boolean not null default true,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.produtos to anon, authenticated;
grant insert, update, delete on public.produtos to authenticated;
grant all on public.produtos to service_role;
alter table public.produtos enable row level security;
drop policy if exists "produtos public read" on public.produtos;
create policy "produtos public read" on public.produtos
  for select to anon, authenticated
  using (ativo = true or public.has_role(auth.uid(), 'admin'));
drop policy if exists "produtos admin write" on public.produtos;
create policy "produtos admin write" on public.produtos
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- Fotos e variações
-- =========================================================================
create table if not exists public.produto_fotos (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references public.produtos(id) on delete cascade,
  url text not null,
  alt text,
  ordem int not null default 0,
  principal boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.produto_fotos to anon, authenticated;
grant insert, update, delete on public.produto_fotos to authenticated;
grant all on public.produto_fotos to service_role;
alter table public.produto_fotos enable row level security;
drop policy if exists "fotos public read" on public.produto_fotos;
create policy "fotos public read" on public.produto_fotos
  for select to anon, authenticated using (true);
drop policy if exists "fotos admin write" on public.produto_fotos;
create policy "fotos admin write" on public.produto_fotos
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create table if not exists public.produto_variacoes (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references public.produtos(id) on delete cascade,
  cor text, cor_hex text, tamanho text, estoque int not null default 0, sku text
);
grant select on public.produto_variacoes to anon, authenticated;
grant insert, update, delete on public.produto_variacoes to authenticated;
grant all on public.produto_variacoes to service_role;
alter table public.produto_variacoes enable row level security;
drop policy if exists "variacoes public read" on public.produto_variacoes;
create policy "variacoes public read" on public.produto_variacoes
  for select to anon, authenticated using (true);
drop policy if exists "variacoes admin write" on public.produto_variacoes;
create policy "variacoes admin write" on public.produto_variacoes
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- Banners
-- =========================================================================
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  titulo text, imagem_desktop text, imagem_mobile text, link text,
  ordem int not null default 0, ativo boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.banners to anon, authenticated;
grant insert, update, delete on public.banners to authenticated;
grant all on public.banners to service_role;
alter table public.banners enable row level security;
drop policy if exists "banners public read" on public.banners;
create policy "banners public read" on public.banners
  for select to anon, authenticated
  using (ativo = true or public.has_role(auth.uid(), 'admin'));
drop policy if exists "banners admin write" on public.banners;
create policy "banners admin write" on public.banners
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- Configurações da loja (key/value)
-- =========================================================================
create table if not exists public.configuracoes_loja (
  chave text primary key,
  valor text,
  updated_at timestamptz not null default now()
);
grant select on public.configuracoes_loja to anon, authenticated;
grant insert, update, delete on public.configuracoes_loja to authenticated;
grant all on public.configuracoes_loja to service_role;
alter table public.configuracoes_loja enable row level security;
drop policy if exists "config public read" on public.configuracoes_loja;
create policy "config public read" on public.configuracoes_loja
  for select to anon, authenticated using (true);
drop policy if exists "config admin write" on public.configuracoes_loja;
create policy "config admin write" on public.configuracoes_loja
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- Storage: bucket "produtos"
-- Crie manualmente em Storage > New bucket, marque como PÚBLICO. Depois:
-- =========================================================================
drop policy if exists "produtos bucket public read" on storage.objects;
create policy "produtos bucket public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'produtos');

drop policy if exists "produtos bucket admin write" on storage.objects;
create policy "produtos bucket admin write" on storage.objects
  for all to authenticated
  using (bucket_id = 'produtos' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'produtos' and public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- Depois de criar seu usuário em Authentication > Users, rode:
--   insert into public.user_roles (user_id, role)
--   values ('SEU-USER-ID', 'admin');
-- =========================================================================
