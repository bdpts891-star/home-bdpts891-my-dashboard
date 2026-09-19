-- PROKRITO-LIVE transactional foundation (PostgreSQL)
-- Run this after creating the database. Migrations should be versioned before production.

create extension if not exists pgcrypto;

create type user_role as enum ('user', 'host', 'agency_owner', 'moderator', 'finance_manager', 'support_manager', 'admin', 'super_admin');
create type room_type as enum ('audio', 'video', 'battle');
create type room_status as enum ('scheduled', 'live', 'ended', 'closed');
create type transaction_status as enum ('pending', 'completed', 'failed', 'rejected');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username varchar(32) not null unique,
  display_name varchar(80) not null,
  email varchar(255) unique,
  role user_role not null default 'user',
  avatar_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists live_rooms (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references users(id),
  title varchar(120) not null,
  description text,
  type room_type not null,
  status room_status not null default 'scheduled',
  max_seats smallint not null default 2 check (max_seats in (2, 5, 9, 12, 15, 20, 30)),
  viewer_count integer not null default 0 check (viewer_count >= 0),
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists wallets (
  user_id uuid primary key references users(id),
  coins bigint not null default 0 check (coins >= 0),
  diamonds bigint not null default 0 check (diamonds >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  room_id uuid references live_rooms(id),
  type varchar(32) not null check (type in ('recharge', 'gift_sent', 'gift_received', 'withdrawal', 'bonus', 'donation')),
  coins bigint not null default 0,
  diamonds bigint not null default 0,
  amount numeric(12,2) not null default 0,
  status transaction_status not null default 'pending',
  idempotency_key varchar(100) not null unique,
  created_at timestamptz not null default now()
);

create table if not exists moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references users(id),
  target_user_id uuid references users(id),
  room_id uuid references live_rooms(id),
  reason varchar(80) not null,
  status varchar(24) not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists live_rooms_status_idx on live_rooms(status, created_at desc);
create index if not exists wallet_transactions_user_idx on wallet_transactions(user_id, created_at desc);
create index if not exists moderation_reports_status_idx on moderation_reports(status, created_at desc);
