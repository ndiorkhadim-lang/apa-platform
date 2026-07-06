#!/usr/bin/env node
/**
 * Dev migration runner — applies prisma/migrations/*.sql via the pg driver
 * and records them in _prisma_migrations (same bookkeeping as prisma migrate).
 *
 * Why: the local `prisma dev` (PGlite/wasm) server closes connections from the
 * Rust schema engine (P1017). The pg driver works fine, so we apply SQL directly.
 * Production (Neon) uses the standard `prisma migrate deploy`.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import 'dotenv/config';

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'prisma', 'migrations');

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS _prisma_migrations (
    id                  VARCHAR(36) PRIMARY KEY,
    checksum            VARCHAR(64) NOT NULL,
    finished_at         TIMESTAMPTZ,
    migration_name      VARCHAR(255) NOT NULL,
    logs                TEXT,
    rolled_back_at      TIMESTAMPTZ,
    started_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    applied_steps_count INTEGER NOT NULL DEFAULT 0
  )
`);

const { rows: appliedRows } = await client.query(
  'SELECT migration_name FROM _prisma_migrations WHERE rolled_back_at IS NULL'
);
const applied = new Set(appliedRows.map((r) => r.migration_name));

const dirs = readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

let count = 0;
for (const name of dirs) {
  if (applied.has(name)) continue;
  const sql = readFileSync(join(MIGRATIONS_DIR, name, 'migration.sql'), 'utf8');
  if (!sql.trim()) {
    console.error(`FAILED ${name}: migration.sql is empty — refusing to record a no-op.`);
    process.exitCode = 1;
    break;
  }
  const checksum = createHash('sha256').update(sql).digest('hex');
  console.log(`Applying ${name}…`);
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query(
      `INSERT INTO _prisma_migrations (id, checksum, migration_name, finished_at, applied_steps_count)
       VALUES (gen_random_uuid(), $1, $2, now(), 1)`,
      [checksum, name]
    );
    await client.query('COMMIT');
    count++;
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(`FAILED ${name}: ${e.message}`);
    process.exitCode = 1;
    break;
  }
}

console.log(count ? `✔ ${count} migration(s) applied.` : '✔ Database already up to date.');
await client.end();
