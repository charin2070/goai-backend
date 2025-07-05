import { IStorageProvider } from "./storage-provider";

/**
 * Реализация IStorageProvider для работы с IndexedDB в браузере.
 * 
 * IndexedDB - это низкоуровневое API для хранения данных на стороне клиента.
 * Оно транзакционное, асинхронное и позволяет хранить большие объемы данных.
 * 
 * Главная особенность - модель версионирования. Хранилища объектов (аналоги таблиц)
 * могут создаваться или изменяться только в обработчике события `onupgradeneeded`,
 * которое срабатывает при открытии БД с новой версией.
 * 
 * Этот провайдер инкапсулирует эту сложность, автоматически повышая версию
 * при необходимости создать новое хранилище.
 */
export class IndexedDbProvider implements IStorageProvider {
    private db: IDBDatabase | null = null;
    private readonly dbName: string;

    constructor(dbName: string = 'goai-app-db') {
        this.dbName = dbName;
    }

    /**
     * Преобразует IDBRequest в Promise для удобной работы с async/await.
     */
    private requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Инициализирует соединение с базой данных IndexedDB.
     */
    async initialize(): Promise<void> {
        // Проверяем, что код выполняется в браузере
        if (typeof window === 'undefined' || !window.indexedDB) {
            throw new Error("IndexedDB не поддерживается в этой среде.");
        }
        if (this.db) {
            return;
        }

        const request = indexedDB.open(this.dbName);
        this.db = await this.requestToPromise(request);

        // Обработчик для случаев, когда другая вкладка пытается обновить БД
        this.db.onversionchange = () => {
            this.db?.close();
            // В реальном приложении здесь можно показать уведомление пользователю
            console.warn("База данных устарела, требуется перезагрузка страницы.");
        };
    }

    /**
     * Гарантирует, что хранилище объектов (таблица) существует.
     * Если нет, переоткрывает соединение с новой версией, чтобы создать его.
     */
    private async ensureStoreExists(storeName: string): Promise<IDBDatabase> {
        if (!this.db) await this.initialize();
        
        if (this.db!.objectStoreNames.contains(storeName)) {
            return this.db!;
        }

        const currentVersion = this.db!.version;
        this.db!.close(); // Закрываем текущее соединение

        // Открываем с новой версией для запуска onupgradeneeded
        const openRequest = indexedDB.open(this.dbName, currentVersion + 1);

        openRequest.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(storeName)) {
                // Предполагаем, что 'id' - это первичный ключ.
                // autoIncrement: true позволит IndexedDB автоматически генерировать уникальные ключи.
                db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
        };

        this.db = await this.requestToPromise(openRequest);
        return this.db;
    }

    async create<T extends { id?: any }>(storeName: string, data: Omit<T, 'id'>): Promise<T> {
        const db = await this.ensureStoreExists(storeName);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const newId = await this.requestToPromise(store.add(data));
        return { ...data, id: newId } as T;
    }

    async read<T>(storeName: string, id: any): Promise<T | null> {
        const db = await this.ensureStoreExists(storeName);
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const result = await this.requestToPromise(store.get(id));
        return (result as T) ?? null;
    }

    async update<T extends { id: any }>(storeName: string, id: any, data: Partial<Omit<T, 'id'>>): Promise<T> {
        const db = await this.ensureStoreExists(storeName);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        const existingRecord = await this.requestToPromise(store.get(id));
        if (!existingRecord) {
            throw new Error(`Запись с id ${id} не найдена в хранилище ${storeName}.`);
        }

        const updatedRecord = { ...existingRecord, ...data };
        await this.requestToPromise(store.put(updatedRecord));
        return updatedRecord as T;
    }

    async delete(storeName: string, id: any): Promise<boolean> {
        const db = await this.ensureStoreExists(storeName);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        await this.requestToPromise(store.delete(id));
        // У delete нет простого способа узнать, был ли объект удален.
        // Он не вызовет ошибку, если ключа нет. Мы просто возвращаем true.
        return true;
    }

    async list<T>(storeName: string, query?: any): Promise<T[]> {
        const db = await this.ensureStoreExists(storeName);
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        return await this.requestToPromise(store.getAll());
    }

    async exportStore(storeName: string): Promise<string> {
        const data = await this.list(storeName);
        return JSON.stringify(data, null, 2);
    }

    async importStore(storeName: string, data: string): Promise<void> {
        const db = await this.ensureStoreExists(storeName);
        const objects: any[] = JSON.parse(data);

        if (!Array.isArray(objects) || objects.length === 0) {
            return;
        }

        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        // Используем Promise.all для параллельного выполнения всех операций вставки/обновления
        await Promise.all(objects.map(obj => this.requestToPromise(store.put(obj))));
    }
} 