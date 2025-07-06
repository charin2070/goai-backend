import { db } from '@/lib/db';
import { settings } from '@/lib/db';
import { eq } from 'drizzle-orm';

export class SettingsService {
  public async getSetting<T>(key: string): Promise<T | null> {
    const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    if (result.length === 0) {
      return null;
    }
    return result[0].value as T;
  }

  public async setSetting<T>(key: string, value: T): Promise<void> {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
  }

  public async getAllSettings(): Promise<Record<string, any>> {
    const results = await db.select().from(settings);
    const allSettings: Record<string, any> = {};
    for (const setting of results) {
      allSettings[setting.key] = setting.value;
    }
    return allSettings;
  }
}

export const settingsService = new SettingsService(); 