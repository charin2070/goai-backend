import { NextRequest } from 'next/server';
import { getProducts } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const offset = parseInt(searchParams.get('offset') || '0');

    const { products, newOffset, totalProducts } = await getProducts(search, offset);

    return Response.json({
      products,
      newOffset,
      totalProducts,
      success: true
    });
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error);
    return Response.json(
      { 
        error: 'Не удалось загрузить продукты',
        success: false 
      },
      { status: 500 }
    );
  }
} 