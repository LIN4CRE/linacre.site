---
name: schema-migration-builder
description: Database architect helper. Generates normalized PostgreSQL/Supabase tables, B-Tree indexes, and Row Level Security policies.
---

# Database Schema & Migration Builder Skill

This agent skill automates building relational structures, writing UP/DOWN migration queries, generating optimal indexing, and configuring Row Level Security.

## 📋 Steps & Protocol

### 1. Data Normalization Analysis
* Analyze data objects and design third-normal-form (3NF) relational tables.
* Ensure all tables have defined primary keys (`UUID` or `BIGSERIAL`).
* Define explicit foreign key constraints (`REFERENCES`) with explicit `ON DELETE CASCADE` or `ON DELETE RESTRICT` actions.

### 2. Index Optimization
* Add B-Tree indexes to all foreign key relationship columns.
* Apply unique index constraints on emails or slug columns.
* Define composite or partial indexes where query filters dictate.

### 3. Row Level Security Policies
* Always configure Row Level Security (RLS) policies on Supabase tables:
  ```sql
  ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;
  ```
* Write policies utilizing helpers:
  * `CREATE POLICY ... FOR SELECT USING (true)` for public read access.
  * `CREATE POLICY ... FOR INSERT WITH CHECK (auth.uid() = user_id)` for authenticated owner insert access.
  * `CREATE POLICY ... FOR UPDATE USING (auth.uid() = user_id)` for owner modification.

### 4. Migration Export
* Save DDL scripts inside a structured migrations directory (e.g. `supabase/migrations/`) prefixing names with timestamps.
