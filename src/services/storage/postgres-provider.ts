import 'server-only';

import { Pool, QueryResult } from 'pg';
import { IStorageProvider } from './storage-provider';

/**
 * Реализация провайдера хранилища для PostgreSQL.
 * Эта реализация использует нативные SQL-запросы, так как мы работаем с
 * именами таблиц как со строками, что не позволяет использовать всю мощь
 * строго типизированных построителей запросов, как Drizzle Kit.
 *
 * Для безопасности все имена таблиц и столбцов проходят базовую проверку.
 */
export class PostgresProvider implements IStorageProvider {
  private pool: Pool | null = null;
  private connectionString: string;
  private isInitialized = false;

  constructor(connectionString: string) {
    if (!connectionString) {
      throw new Error('PostgresProvider: необходимо указать строку подключения.');
    }
    this.connectionString = connectionString;
  }

  /**
   * Инициализирует пул соединений с базой данных PostgreSQL.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('PostgresProvider уже инициализирован.');
      return;
    }
    try {
      this.pool = new Pool({
        connectionString: this.connectionString,
        ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      });
      // Простая проверка соединения
      await this.pool.query('SELECT 1');
      this.isInitialized = true;
      console.log('Успешное подключение к базе данных через PostgresProvider.');
    } catch (error) {
      this.isInitialized = false;
      console.error('Не удалось подключиться к базе данных:', error);
      throw error;
    }
  }

  /**
   * Внутренний метод для проверки и очистки имен таблиц/столбцов во избежание SQL-инъекций.
   * @param name Имя для проверки.
   * @returns Очищенное имя.
   */
  private getSanitizedName(name: string): string {
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      throw new Error(`Недопустимое имя таблицы/столбца: ${name}`);
    }
    return name;
  }
  
  private checkInitialized(): void {
    if (!this.isInitialized || !this.pool) {
      throw new Error('Провайдер не инициализирован. Вызовите initialize() перед использованием.');
    }
  }

  /**
   * Создает новую запись в таблице.
   * @param storeName Имя таблицы.
   * @param data Объект для сохранения. Ключи объекта должны соответствовать названиям столбцов.
   * @returns Созданный объект из базы данных.
   */
  async create<T extends { id?: any }>(storeName: string, data: Omit<T, 'id'>): Promise<T> {
    this.checkInitialized();
    const tableName = this.getSanitizedName(storeName);
    const columns = Object.keys(data).map(this.getSanitizedName);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const query = `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders}) RETURNING *`;
    
    try {
      const result = await this.pool!.query(query, values);
      return result.rows[0] as T;
    } catch (error) {
      console.error(`Ошибка создания записи в таблице ${storeName}:`, error);
      throw error;
    }
  }

  /**
   * Читает запись из таблицы по ее ID.
   * Примечание: предполагается, что первичный ключ называется 'id'.
   * @param storeName Имя таблицы.
   * @param id Уникальный идентификатор.
   * @returns Найденный объект или null.
   */
  async read<T>(storeName: string, id: any): Promise<T | null> {
    this.checkInitialized();
    const tableName = this.getSanitizedName(storeName);
    const query = `SELECT * FROM "${tableName}" WHERE "id" = $1`;
    
    try {
      const result = await this.pool!.query(query, [id]);
      return result.rows.length > 0 ? (result.rows[0] as T) : null;
    } catch (error) {
      console.error(`Ошибка чтения записи из ${storeName} с id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Обновляет запись в таблице по ее ID.
   * @param storeName Имя таблицы.
   * @param id Уникальный идентификатор.
   * @param data Объект с обновляемыми полями.
   * @returns Обновленный объект.
   */
  async update<T extends { id: any }>(storeName: string, id: any, data: Partial<Omit<T, 'id'>>): Promise<T> {
    this.checkInitialized();
    const tableName = this.getSanitizedName(storeName);
    const columns = Object.keys(data).map(this.getSanitizedName);
    const values = Object.values(data);
    
    if (columns.length === 0) {
        throw new Error("Нет данных для обновления.");
    }

    const setClauses = columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ');
    const whereValuePlaceholder = `$${values.length + 1}`;
    
    const query = `UPDATE "${tableName}" SET ${setClauses} WHERE "id" = ${whereValuePlaceholder} RETURNING *`;
    
    try {
      const result = await this.pool!.query(query, [...values, id]);
      if (result.rows.length === 0) {
        throw new Error(`Объект с id ${id} не найден в таблице ${storeName}`);
      }
      return result.rows[0] as T;
    } catch (error) {
      console.error(`Ошибка обновления записи в ${storeName} с id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Удаляет запись из таблицы по ее ID.
   * @param storeName Имя таблицы.
   * @param id Уникальный идентификатор.
   * @returns true, если удаление прошло успешно.
   */
  async delete(storeName: string, id: any): Promise<boolean> {
    this.checkInitialized();
    const tableName = this.getSanitizedName(storeName);
    const query = `DELETE FROM "${tableName}" WHERE "id" = $1`;

    try {
      const result = await this.pool!.query(query, [id]);
      return result.rowCount ?  result.rowCount > 0 : false;
    } catch (error) {
      console.error(`Ошибка удаления записи из ${storeName} с id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Возвращает список всех записей из таблицы.
   * @param storeName Имя таблицы.
   * @param query (Пока не используется) Параметры для фильтрации/сортировки.
   * @returns Массив объектов.
   */
  async list<T>(storeName: string, query?: any): Promise<T[]> {
    this.checkInitialized();
    const tableName = this.getSanitizedName(storeName);
    const sqlQuery = `SELECT * FROM "${tableName}"`;
    
    try {
      const result = await this.pool!.query(sqlQuery);
      return result.rows as T[];
    } catch (error) {
      console.error(`Ошибка получения списка из ${storeName}:`, error);
      throw error;
    }
  }

  /**
   * Экспортирует все данные из таблицы в строку формата JSON.
   */
  async exportStore(storeName: string): Promise<string> {
    this.checkInitialized();
    const data = await this.list(storeName);
    return JSON.stringify(data, null, 2); // Форматируем для читаемости
  }

  /**
   * Импортирует данные из строки JSON в таблицу.
   * Использует "upsert": вставляет новые строки, а существующие (с таким же 'id') обновляет.
   * Выполняется в рамках одной транзакции.
   */
  async importStore(storeName: string, data: string): Promise<void> {
    this.checkInitialized();
    const objects: Record<string, any>[] = JSON.parse(data);
    if (!Array.isArray(objects) || objects.length === 0) {
      return; // Нечего импортировать
    }

    const tableName = this.getSanitizedName(storeName);
    
    // Предполагаем, что все объекты имеют одинаковую структуру, как у первого.
    const firstObject = objects[0];
    const columns = Object.keys(firstObject).map(this.getSanitizedName);
    
    // Формируем часть запроса для обновления при конфликте
    const setClauses = columns
      .filter(c => c !== 'id') // Не обновляем сам первичный ключ
      .map(col => `"${col}" = EXCLUDED."${col}"`)
      .join(', ');

    const client = await this.pool!.connect();
    try {
      await client.query('BEGIN');

      for (const obj of objects) {
        const values = columns.map(col => obj[col]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        
        const query = `
          INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) 
          VALUES (${placeholders})
          ON CONFLICT ("id") DO UPDATE SET ${setClauses}
        `;
        await client.query(query, values);
      }
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error(`Ошибка импорта данных в ${storeName}:`, e);
      throw e;
    } finally {
      client.release();
    }
  }
} 