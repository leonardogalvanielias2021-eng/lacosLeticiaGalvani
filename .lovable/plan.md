Plano do painel administrativo com **Supabase externo** (seu próprio projeto), com segurança RLS estrita e sem exposição pública da área admin.

## 1. Como conectar seu Supabase externo

Passos que você fará no painel do Supabase (https://supabase.com):

1. Criar um projeto novo.
2. Em **Project Settings → API**, copiar:
   - `Project URL`
   - `anon public key` (pública, pode ir no código)
   - `service_role key` (secreta — só via ferramenta de secrets)
3. Em **Authentication → Providers**, ativar **Email/Senha** e desativar "Enable signups" depois de criar seu usuário admin (fecha o cadastro público).
4. Em **Storage**, criar o bucket `produtos` como público (só leitura pública; escrita restrita por policy).
5. Me enviar a URL e a anon key no chat. A service_role key só será solicitada via formulário seguro se necessário.
6. Rodar o SQL de criação de tabelas e policies (vou entregar pronto para colar no SQL Editor).
7. Criar seu usuário admin em **Authentication → Users → Add user** e depois eu insiro seu `user_id` na tabela `user_roles` com role `admin`.

## 2. Segurança — princípios

- **`/admin` não aparece no menu público.** Nenhum link no header, footer ou home. Acesso apenas digitando a URL direta (ex: `/admin/login`).
- **Rota protegida no frontend:** middleware verifica sessão + role `admin`. Sem isso, redireciona para home.
- **RLS obrigatória em todas as tabelas.** Visitante anônimo só lê o necessário para o site funcionar; escrever é exclusivo do admin.
- **Role em tabela separada** (`user_roles`), verificada por função `has_role` com `SECURITY DEFINER` — padrão seguro do Supabase para evitar recursão e escalonamento de privilégio.
- **Storage bucket** com policy: leitura pública, upload/delete só para admin.

## 3. Tabelas (fase inicial)

- `user_roles` — id, user_id, role (`admin`).
- `categorias` — id, nome, slug, imagem_url, ordem, ativo.
- `produtos` — id, nome, slug, descricao_curta, descricao, preco, preco_promocional, categoria_id, estoque, destaque, novo, ativo, ordem, created_at.
- `produto_fotos` — id, produto_id, url, alt, ordem, principal.
- `produto_variacoes` — id, produto_id, cor, tamanho, estoque, sku.
- `banners` — id, titulo, imagem_desktop, imagem_mobile, link, ordem, ativo.
- `configuracoes_loja` — chave, valor (whatsapp, instagram, facebook, email, texto do sobre, etc.).

## 4. Políticas RLS (resumo do SQL que será entregue)

Padrão em cada tabela:

- **SELECT público (anon + authenticated):** apenas linhas com `ativo = true` (ou equivalente). Ex:
  ```sql
  CREATE POLICY "public read ativos" ON produtos
    FOR SELECT TO anon, authenticated
    USING (ativo = true);
  ```
- **INSERT/UPDATE/DELETE:** exclusivo para admin:
  ```sql
  CREATE POLICY "admin manage" ON produtos
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  ```
- **`user_roles`:** SELECT apenas do próprio user_id; escrita bloqueada (só via service_role/migração).
- **GRANTs explícitos** para `anon`, `authenticated` e `service_role` em cada tabela (obrigatório no Supabase).

### Storage (bucket `produtos`)
```sql
-- Leitura pública
CREATE POLICY "public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'produtos');

-- Upload/update/delete só admin
CREATE POLICY "admin write" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
```

## 5. Páginas do painel (rota `/admin`, oculta)

- `/admin/login` — email + senha.
- `/admin` — dashboard: totais de produtos, sem estoque, últimos cadastros.
- `/admin/produtos` — lista com busca/filtro.
- `/admin/produtos/novo` e `/admin/produtos/:id` — formulário: nome, descrições, preços, categoria, estoque, destaque, upload de múltiplas fotos com reordenação, variações.
- `/admin/categorias` — CRUD.
- `/admin/banners` — CRUD dos banners da home.
- `/admin/configuracoes` — WhatsApp, redes sociais, email, texto do sobre.

Todas passam por um `<AdminGuard>` que:
1. Verifica sessão Supabase.
2. Chama `has_role(user, 'admin')`.
3. Se falhar, redireciona para `/` (não para `/admin/login`, para não denunciar a existência).

## 6. Integração com o site atual

- `src/lib/products.ts` (mock) é substituído por consultas ao Supabase.
- Vitrine, busca, detalhe de produto, home e sobre passam a ler do banco.
- Checkout continua via WhatsApp (sem mudança agora).

## 7. Fora de escopo desta fase

Pedidos registrados no painel, clientes, cupons, pagamento online e frete automático — ficam para fases futuras.

## Próximo passo

Se aprovar, eu começo por:
1. Instalar `@supabase/supabase-js` e criar o cliente com sua URL + anon key.
2. Entregar o SQL completo (tabelas + RLS + storage + função `has_role` + GRANTs) para você colar no SQL Editor do Supabase.
3. Implementar `/admin/login`, o `AdminGuard` e a estrutura de rotas do painel.
4. Migrar os produtos mock para leitura via Supabase.

Me envie a **Project URL** e a **anon key** do seu Supabase quando aprovar, e eu sigo.