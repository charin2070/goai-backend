import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial,
  jsonb,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

export const settings = pgTable(
  'settings',
  {
    id: serial('id').primaryKey(),
    key: text('key').notNull(),
    value: jsonb('value')
  },
  (settings) => {
    return {
      keyIndex: uniqueIndex('key_idx').on(settings.key)
    };
  }
);

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  status: statusEnum('status').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  availableAt: timestamp('available_at').notNull()
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  let totalProducts = await db.select({ count: count() }).from(products);
  let moreProducts = await db.select().from(products).limit(5).offset(offset);
  let newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: moreProducts,
    newOffset,
    totalProducts: totalProducts[0].count
  };
}

export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}

// Схема для сущности "Issue" (Задача)

export const issueStatusEnum = pgEnum('issue_status', [
  'todo',
  'in_progress',
  'done',
  'archived'
]);

export const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: issueStatusEnum('status').notNull().default('todo'),
  source: text('source'),
  // Поле createdAt будет автоматически установлено базой данных в момент создания записи.
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  // Поле updatedAt будет автоматически обновляться специальным триггером в базе данных при каждом изменении записи.
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export type SelectIssue = typeof issues.$inferSelect;
export type InsertIssue = typeof issues.$inferInsert;

export const insertIssueSchema = createInsertSchema(issues);

// TODO: На следующих этапах здесь будут реализованы функции для работы с задачами (CRUD).
