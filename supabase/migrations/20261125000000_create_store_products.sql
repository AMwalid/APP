-- Public storefront and seller-managed listings (MKT-01).

create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;

-- Only verified teachers and institution admins may publish products.
-- The role comes from profiles, never from the client.
create or replace function public.current_user_is_store_seller()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('teacher', 'institution_admin')
  );
$$;

revoke all on function public.current_user_is_store_seller()
  from public, anon, authenticated;
grant execute on function public.current_user_is_store_seller()
  to authenticated;

create table public.products (
  id          uuid primary key default extensions.gen_random_uuid(),
  seller_id   uuid not null references auth.users (id) on delete cascade,
  title       text not null,
  description text not null,
  price       numeric(10,2) not null,
  type        text not null,
  created_at  timestamptz not null default now(),

  constraint products_title_length
    check (char_length(btrim(title)) between 2 and 140),
  constraint products_description_length
    check (char_length(btrim(description)) between 2 and 2000),
  constraint products_price_positive
    check (price >= 0),
  constraint products_type_valid
    check (type in ('Course', 'Book', 'Supply'))
);

create index products_title_trgm_idx
  on public.products using gin (title extensions.gin_trgm_ops);

create index products_seller_idx
  on public.products (seller_id);

create index products_type_idx
  on public.products (type);

create index products_created_at_idx
  on public.products (created_at desc);

alter table public.products enable row level security;

-- Public readers never receive seller_id. Seller names are returned only by
-- the security-definer search RPC below.
revoke all on public.products from public, anon, authenticated;

grant select (id, title, description, price, type, created_at)
  on public.products to anon;

grant select, insert, update, delete
  on public.products to authenticated;

create policy products_public_read
  on public.products for select
  to anon, authenticated
  using (true);

create policy products_seller_insert
  on public.products for insert
  to authenticated
  with check (
    auth.uid() = seller_id
    and public.current_user_is_store_seller()
  );

create policy products_seller_update
  on public.products for update
  to authenticated
  using (auth.uid() = seller_id)
  with check (
    auth.uid() = seller_id
    and public.current_user_is_store_seller()
  );

create policy products_seller_delete
  on public.products for delete
  to authenticated
  using (auth.uid() = seller_id);

-- Public title search. The join supplies the seller display name without
-- exposing seller_id or requiring anon clients to read profiles/auth.users.
create or replace function public.search_public_products(needle text)
returns table (
  id          uuid,
  title       text,
  description text,
  price       numeric(10,2),
  type        text,
  created_at  timestamptz,
  seller_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id,
    p.title,
    p.description,
    p.price,
    p.type,
    p.created_at,
    coalesce(
      nullif(btrim(pr.full_name), ''),
      split_part(u.email, '@', 1)
    ) as seller_name
  from public.products p
  join auth.users u on u.id = p.seller_id
  left join public.profiles pr on pr.id = p.seller_id
  where btrim(coalesce(needle, '')) = ''
     or p.title ilike '%' || btrim(needle) || '%'
  order by p.created_at desc, p.title asc
  limit 50;
$$;

revoke all on function public.search_public_products(text)
  from public, anon, authenticated;
grant execute on function public.search_public_products(text)
  to anon, authenticated;

select pg_notify('pgrst', 'reload schema');
