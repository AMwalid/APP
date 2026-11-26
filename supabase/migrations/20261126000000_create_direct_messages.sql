-- Direct messaging for parent/teacher/staff communication (PAR-06 / TCH-05).

create extension if not exists pgcrypto with schema extensions;

create table public.messages (
  id          uuid primary key default extensions.gen_random_uuid(),
  sender_id   uuid not null references auth.users (id) on delete cascade,
  receiver_id uuid not null references auth.users (id) on delete cascade,
  content     text not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now(),

  constraint messages_content_length
    check (char_length(btrim(content)) between 1 and 2000),
  constraint messages_no_self
    check (sender_id <> receiver_id)
);

-- Thread lookups and inbox ordering.
create index messages_sender_created_idx
  on public.messages (sender_id, created_at desc);

create index messages_receiver_created_idx
  on public.messages (receiver_id, created_at desc);

create index messages_conversation_idx
  on public.messages (
    least(sender_id, receiver_id),
    greatest(sender_id, receiver_id),
    created_at desc
  );

alter table public.messages enable row level security;

-- No anonymous access. No client UPDATE/DELETE: read_at is stored but not wired
-- into the MVP, so there is deliberately no update policy.
revoke all on public.messages from public, anon, authenticated;

grant select on public.messages to authenticated;
grant insert (sender_id, receiver_id, content) on public.messages to authenticated;

-- Participants can read only their own threads.
create policy messages_participant_select
  on public.messages for select
  to authenticated
  using (
    auth.uid() = sender_id
    or auth.uid() = receiver_id
  );

-- A user can only write messages sent by themselves.
create policy messages_sender_insert
  on public.messages for insert
  to authenticated
  with check (auth.uid() = sender_id);

-- Defence in depth for the Server Action: both sides must have a messaging
-- role and must not be the same user.
create or replace function public.can_message_user(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    auth.uid() is not null
    and p_user_id is not null
    and p_user_id <> auth.uid()
    and exists (
      select 1
      from public.profiles sender
      where sender.id = auth.uid()
        and sender.role in ('parent', 'teacher', 'institution_admin')
    )
    and exists (
      select 1
      from public.profiles receiver
      where receiver.id = p_user_id
        and receiver.role in ('parent', 'teacher', 'institution_admin')
    );
$$;

revoke all on function public.can_message_user(uuid)
  from public, anon, authenticated;
grant execute on function public.can_message_user(uuid) to authenticated;

-- Inbox summaries. Definer only so participant display names can be resolved
-- without exposing profiles/auth.users to arbitrary clients.
create or replace function public.get_conversations()
returns table (
  peer_id         uuid,
  peer_name       text,
  last_message    text,
  last_message_at timestamptz,
  unread_count    bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  with visible as (
    select
      sender_id,
      receiver_id,
      content,
      read_at,
      created_at
    from public.messages
    where auth.uid() is not null
      and (sender_id = auth.uid() or receiver_id = auth.uid())
  ),
  paired as (
    select
      case
        when sender_id = auth.uid() then receiver_id
        else sender_id
      end as peer_id,
      content,
      created_at,
      (receiver_id = auth.uid() and read_at is null) as is_unread
    from visible
  ),
  latest as (
    select distinct on (peer_id)
      peer_id,
      content as last_message,
      created_at as last_message_at
    from paired
    order by peer_id, created_at desc
  ),
  unread as (
    select peer_id, count(*) as unread_count
    from paired
    where is_unread
    group by peer_id
  )
  select
    l.peer_id,
    coalesce(
      nullif(btrim(p.full_name), ''),
      nullif(split_part(u.email, '@', 1), '')
    ) as peer_name,
    l.last_message,
    l.last_message_at,
    coalesce(un.unread_count, 0) as unread_count
  from latest l
  left join unread un on un.peer_id = l.peer_id
  join auth.users u on u.id = l.peer_id
  left join public.profiles p on p.id = l.peer_id
  order by l.last_message_at desc;
$$;

revoke all on function public.get_conversations()
  from public, anon, authenticated;
grant execute on function public.get_conversations() to authenticated;

-- Bounded thread history for one peer.
create or replace function public.get_conversation(p_peer_id uuid)
returns table (
  id          uuid,
  sender_id   uuid,
  receiver_id uuid,
  content     text,
  read_at     timestamptz,
  created_at  timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  with recent as (
    select
      m.id,
      m.sender_id,
      m.receiver_id,
      m.content,
      m.read_at,
      m.created_at
    from public.messages m
    where auth.uid() is not null
      and p_peer_id is not null
      and p_peer_id <> auth.uid()
      and (
        (m.sender_id = auth.uid() and m.receiver_id = p_peer_id)
        or (m.sender_id = p_peer_id and m.receiver_id = auth.uid())
      )
    order by m.created_at desc
    limit 200
  )
  select
    id,
    sender_id,
    receiver_id,
    content,
    read_at,
    created_at
  from recent
  order by created_at asc;
$$;

revoke all on function public.get_conversation(uuid)
  from public, anon, authenticated;
grant execute on function public.get_conversation(uuid) to authenticated;

-- Realtime INSERT delivery. Idempotent so the SQL can be re-run safely.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

select pg_notify('pgrst', 'reload schema');
