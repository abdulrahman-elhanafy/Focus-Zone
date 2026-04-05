import fs from 'fs/promises';
import mysql from 'mysql2/promise';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const sqlPath = path.resolve(process.cwd(), 'FocusZone.sql');

const parseEnv = (text) =>
  Object.fromEntries(
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const [key, ...rest] = line.split('=');
        return [key, rest.join('=')];
      })
  );

const run = async () => {
  const envData = await fs.readFile(envPath, 'utf8');
  const env = parseEnv(envData);
  const sql = await fs.readFile(sqlPath, 'utf8');
  const connection = await mysql.createConnection({
    host: env.DB_HOST || '127.0.0.1',
    port: Number(env.DB_PORT || '3306'),
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    console.log('Connected to MySQL server. Running SQL import...');
    await connection.query(sql);
    console.log('SQL import completed successfully.');
  } catch (error) {
    console.error('SQL import failed:', error.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
};

run().catch((error) => {
  console.error('Unexpected error:', error.message);
  process.exit(1);
});
