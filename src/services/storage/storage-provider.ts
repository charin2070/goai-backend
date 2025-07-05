// @/src/services/storage/provider.interface.ts

export interface IStorageProvider {
    /** Инициализация хранилища */
    initialize(): Promise<void>;
  
    /**
     * Создает новую запись в хранилище.
     * @param storeName Имя таблицы или коллекции.
     * @param data Объект для сохранения.
     * @returns Сохраненный объект.
     */
    create<T extends { id?: any }>(storeName: string, data: Omit<T, 'id'>): Promise<T>;
  
    /**
     * Читает запись по идентификатору.
     * @param storeName Имя таблицы или коллекции.
     * @param id Уникальный идентификатор записи.
     * @returns Найденный объект или null.
     */
    read<T>(storeName: string, id: any): Promise<T | null>;
  
    /**
     * Обновляет запись по идентификатору.
     * @param storeName Имя таблицы или коллекции.
     * @param id Уникальный идентификатор записи.
     * @param data Объект с обновленными полями.
     * @returns Обновленный объект.
     */
    update<T extends { id: any }>(storeName: string, id: any, data: Partial<Omit<T, 'id'>>): Promise<T>;
  
    /**
     * Удаляет запись по идентификатору.
     * @param storeName Имя таблицы или коллекции.
     * @param id Уникальный идентификатор записи.
     * @returns true в случае успеха.
     */
    delete(storeName: string, id: any): Promise<boolean>;
  
    /**
     * Возвращает список записей, опционально с фильтрацией.
     * @param storeName Имя таблицы или коллекции.
     * @param query Параметры для фильтрации (могут отличаться для разных провайдеров).
     * @returns Массив найденных объектов.
     */
    list<T>(storeName: string, query?: any): Promise<T[]>;
  
    /**
     * Экспортирует все данные из указанного хранилища в виде строки (например, JSON).
     */
    exportStore(storeName: string): Promise<string>;
  
    /**
     * Импортирует данные в хранилище из строки (например, JSON), добавляя к существующим.
     */
    importStore(storeName: string, data: string): Promise<void>;
  }