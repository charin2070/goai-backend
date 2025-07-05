// @/src/services/storage/localstorage-provider.ts

import { IStorageProvider } from "./storage-provider";

/**
 * Реализация IStorageProvider для работы с window.localStorage.
 *
 * localStorage - это простое, синхронное API для хранения данных "ключ-значение".
 * Оно хранит только строки, поэтому все объекты сериализуются в JSON.
 *
 * Этот провайдер эмулирует "таблицы" (хранилища), сохраняя массив объектов
 * как JSON-строку под ключом, соответствующим имени хранилища.
 *
 * ВАЖНО: Все методы возвращают Promise, чтобы соответствовать интерфейсу,
 * хотя само localStorage API - синхронное.
 */
export class LocalStorageProvider implements IStorageProvider {
    
    constructor() {}

    /**
     * Проверяет доступность localStorage и выполняет "инициализацию".
     */
    async initialize(): Promise<void> {
        if (typeof window === 'undefined' || !window.localStorage) {
            throw new Error("localStorage не поддерживается в этой среде.");
        }
        // localStorage не требует асинхронной инициализации
        return Promise.resolve();
    }

    private checkInitialized(): void {
        if (typeof window === 'undefined' || !window.localStorage) {
            throw new Error('Провайдер не инициализирован или не поддерживается.');
        }
    }

    /**
     * Вспомогательный метод для получения всех данных из хранилища.
     */
    private getStore<T>(storeName: string): T[] {
        this.checkInitialized();
        const rawData = localStorage.getItem(storeName);
        return rawData ? JSON.parse(rawData) : [];
    }

    /**
     * Вспомогательный метод для сохранения данных в хранилище.
     */
    private saveStore<T>(storeName: string, data: T[]): void {
        this.checkInitialized();
        localStorage.setItem(storeName, JSON.stringify(data));
    }

    /**
     * Создает новую запись. ID генерируется с помощью crypto.randomUUID().
     */
    async create<T extends { id?: any }>(storeName: string, data: Omit<T, 'id'>): Promise<T> {
        const storeData = this.getStore<T>(storeName);
        const newRecord = { ...data, id: crypto.randomUUID() } as T;
        storeData.push(newRecord);
        this.saveStore(storeName, storeData);
        return Promise.resolve(newRecord);
    }

    /**
     * Читает запись по ID.
     */
    async read<T>(storeName: string, id: any): Promise<T | null> {
        const storeData = this.getStore<T>(storeName);
        const record = storeData.find(item => (item as { id: any }).id === id) || null;
        return Promise.resolve(record);
    }

    /**
     * Обновляет запись по ID.
     */
    async update<T extends { id: any }>(storeName: string, id: any, data: Partial<Omit<T, 'id'>>): Promise<T> {
        const storeData = this.getStore<T>(storeName);
        const recordIndex = storeData.findIndex(item => item.id === id);

        if (recordIndex === -1) {
            throw new Error(`Запись с id ${id} не найдена в хранилище ${storeName}.`);
        }

        const updatedRecord = { ...storeData[recordIndex], ...data };
        storeData[recordIndex] = updatedRecord;
        this.saveStore(storeName, storeData);
        return Promise.resolve(updatedRecord);
    }

    /**
     * Удаляет запись по ID.
     */
    async delete(storeName: string, id: any): Promise<boolean> {
        let storeData = this.getStore<{ id: any }>(storeName);
        const initialLength = storeData.length;
        storeData = storeData.filter(item => item.id !== id);

        if (storeData.length < initialLength) {
            this.saveStore(storeName, storeData);
            return Promise.resolve(true);
        }
        
        return Promise.resolve(false);
    }

    /**
     * Возвращает список всех записей.
     */
    async list<T>(storeName: string, query?: any): Promise<T[]> {
        const storeData = this.getStore<T>(storeName);
        return Promise.resolve(storeData);
    }

    /**
     * Экспортирует хранилище в JSON-строку.
     */
    async exportStore(storeName: string): Promise<string> {
        const data = await this.list(storeName);
        return Promise.resolve(JSON.stringify(data, null, 2));
    }

    /**
     * Импортирует данные, обновляя существующие записи (upsert) или добавляя новые.
     */
    async importStore(storeName: string, data: string): Promise<void> {
        const newObjects = JSON.parse(data) as { id: any }[];
        if (!Array.isArray(newObjects)) return Promise.resolve();
        
        const storeData = this.getStore<{ id: any }>(storeName);
        const storeMap = new Map(storeData.map(item => [item.id, item]));

        for(const obj of newObjects) {
            storeMap.set(obj.id, obj);
        }

        this.saveStore(storeName, Array.from(storeMap.values()));
        return Promise.resolve();
    }
} 