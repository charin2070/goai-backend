import { db, products } from '../lib/db';

async function resetTestData() {
  console.log('🧹 Очищаем существующие данные...');
  
  try {
    // Удаляем все существующие записи
    await db.delete(products);
    console.log('✅ Все старые записи удалены');

    // Создаем новые тестовые данные
    const testData = [
      {
        imageUrl: 'https://picsum.photos/200/300?random=1',
        name: 'Ноутбук Dell XPS 13',
        status: 'active' as const,
        price: '89999.99',
        stock: 15,
        availableAt: new Date('2024-01-15'),
      },
      {
        imageUrl: 'https://picsum.photos/200/300?random=2',
        name: 'iPhone 15 Pro',
        status: 'active' as const,
        price: '119999.99',
        stock: 25,
        availableAt: new Date('2024-02-01'),
      },
      {
        imageUrl: 'https://picsum.photos/200/300?random=3',
        name: 'Samsung Galaxy Watch',
        status: 'inactive' as const,
        price: '29999.99',
        stock: 8,
        availableAt: new Date('2024-03-10'),
      },
      {
        imageUrl: 'https://picsum.photos/200/300?random=4',
        name: 'Наушники Sony WH-1000XM5',
        status: 'active' as const,
        price: '34999.99',
        stock: 12,
        availableAt: new Date('2024-01-20'),
      },
      {
        imageUrl: 'https://picsum.photos/200/300?random=5',
        name: 'iPad Air',
        status: 'archived' as const,
        price: '59999.99',
        stock: 0,
        availableAt: new Date('2023-12-15'),
      }
    ];

    console.log('📝 Создаем новые тестовые данные...');
    
    for (const productData of testData) {
      const [product] = await db.insert(products).values(productData).returning();
      console.log(`✅ Создан продукт: "${product.name}" - ${product.price} руб.`);
    }

    console.log('🎉 Тестовые данные успешно созданы!');

    // Выводим созданные данные для проверки
    const allProducts = await db.select().from(products);
    
    console.log('\n📋 Созданные продукты:');
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} [${product.status}] - ${product.price} руб. (Остаток: ${product.stock})`);
    });

  } catch (error) {
    console.error('❌ Ошибка при сбросе данных:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

resetTestData(); 