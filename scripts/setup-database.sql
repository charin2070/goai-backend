-- Создание ENUM типа для статуса продукта
CREATE TYPE status AS ENUM ('active', 'inactive', 'archived');

-- Создание таблицы products (если не существует)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  name TEXT NOT NULL,
  status status NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  available_at TIMESTAMP NOT NULL
);

-- Создание индексов для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Комментарии к таблице и колонкам
COMMENT ON TABLE products IS 'Таблица продуктов для GoAI-Backend';
COMMENT ON COLUMN products.id IS 'Уникальный идентификатор продукта';
COMMENT ON COLUMN products.image_url IS 'URL изображения продукта';
COMMENT ON COLUMN products.name IS 'Название продукта';
COMMENT ON COLUMN products.status IS 'Статус продукта (active, inactive, archived)';
COMMENT ON COLUMN products.price IS 'Цена продукта с точностью до 2 знаков после запятой';
COMMENT ON COLUMN products.stock IS 'Количество товара на складе';
COMMENT ON COLUMN products.available_at IS 'Дата и время доступности товара'; 