import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Статусы соединения с базой данных
export type DbStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';

/**
 * Класс для управления соединением и операциями с базой данных PostgreSQL
 */
export class StorageService {
  private pool: Pool | null = null;
  private db: any = null;
  private status: DbStatus = 'DISCONNECTED';
  private connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  /**
   * Подключение к базе данных PostgreSQL
   */
  async connectToDb(): Promise<void> {
    try {
      this.status = 'CONNECTING';
      this.pool = new Pool({
        connectionString: this.connectionString,
        ssl: process.env.POSTGRES_SSL ? { rejectUnauthorized: false } : undefined,
      });
      this.db = drizzle(this.pool);
      // Проверка соединения
      await this.pool.connect();
      this.status = 'CONNECTED';
      console.log('Successfully connected to the database');
    } catch (error) {
      this.status = 'DISCONNECTED';
      console.error('Failed to connect to the database:', error);
      throw error;
    }
  }

  /**
   * Получение списка имен таблиц в базе данных
   * @returns Массив имен таблиц
   */
  async getTableNames(): Promise<string[]> {
    if (this.status !== 'CONNECTED' || !this.db) {
      throw new Error('Database is not connected');
    }
    try {
      const result = await this.db.execute(async (tx: any) => {
        const query = await tx.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
        return query.rows.map((row: any) => row.table_name);
      });
      return result;
    } catch (error) {
      console.error('Failed to get table names:', error);
      throw error;
    }
  }

  /**
   * Получение текущего статуса соединения с базой данных
   * @returns Текущий статус соединения
   */
  getStatus(): DbStatus {
    return this.status;
  }

  /**
   * Выполнение SQL-запроса к указанной таблице в базе данных
   * @param dbName Имя базы данных
   * @param tableName Имя таблицы
   * @param sqlQuery SQL-запрос для выполнения
   * @returns Результат выполнения запроса
   */
  async sqlQuery(dbName: string, tableName: string, sqlQuery: string): Promise<any> {
    if (this.status !== 'CONNECTED' || !this.db) {
      throw new Error('Database is not connected');
    }
    try {
      const result = await this.db.execute(async (tx: any) => {
        // Экранирование имени таблицы для предотвращения SQL-инъекций
        const safeTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
        const query = await tx.query(sqlQuery.replace('{tableName}', safeTableName));
        return query.rows;
      });
      return result;
    } catch (error) {
      console.error('Failed to execute SQL query:', error);
      throw error;
    }
  }

  /**
   * Добавление объекта данных в таблицу
   * @param dataKey Ключ данных (имя таблицы)
   * @param dataObject Объект с данными для вставки
   * @returns Результат операции вставки
   */
  async setObject(dataKey: string, dataObject: Record<string, any>): Promise<any> {
    if (this.status !== 'CONNECTED' || !this.db) {
      throw new Error('Database is not connected');
    }
    try {
      const result = await this.db.execute(async (tx: any) => {
        // Экранирование имени таблицы
        const safeTableName = dataKey.replace(/[^a-zA-Z0-9_]/g, '');
        const columns = Object.keys(dataObject);
        const values = Object.values(dataObject);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        const query = `INSERT INTO ${safeTableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const insertResult = await tx.query(query, values);
        return insertResult.rows[0];
      });
      return result;
    } catch (error) {
      console.error('Failed to set object in database:', error);
      throw error;
    }
  }
}

// Экспорт экземпляра сервиса с использованием переменной окружения для строки подключения
export const storageService = new StorageService(process.env.POSTGRES_URL || ''); 