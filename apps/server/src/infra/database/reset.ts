import * as schema from './schema/_index'
import { reset } from 'drizzle-seed'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function exec() {
  console.log('Reseting database...')

  const db = drizzle(pool, { schema })
  await reset(db, schema)
}

exec().then(() => process.exit(0))
