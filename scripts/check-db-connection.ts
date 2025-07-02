import { db } from '../lib/db';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';

async function main() {
  console.log('Попытка подключения к базе данных...');
  try {
    // Пытаемся выполнить простой запрос к базе данных
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Успешное подключение к базе данных!');
    console.log('Тестовый запрос выполнен:', result);
  } catch (error) {
    console.error('❌ Не удалось подключиться к базе данных:', error);
    // Выходим с ошибкой, чтобы было понятно, что проверка провалилась
    process.exit(1);
  } finally {
    console.log('Проверка подключения завершена.');
    process.exit(0);
  }
}

main(); 