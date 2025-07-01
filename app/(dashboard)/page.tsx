'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductsTable } from './products-table';
import { SelectProduct } from '@/lib/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function ProductsPage() {
  const [products, setProducts] = useState<SelectProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [newOffset, setNewOffset] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const loadProducts = async (search = '', offset = 0) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products?q=${search}&offset=${offset}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        setNewOffset(data.newOffset);
        setIsDataLoaded(true);
      } else {
        console.error('Ошибка загрузки продуктов');
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Слушаем событие загрузки данных от кнопки в навбаре
  useEffect(() => {
    const handleLoadFromDB = () => {
      loadProducts();
    };

    window.addEventListener('loadFromDB', handleLoadFromDB);

    return () => {
      window.removeEventListener('loadFromDB', handleLoadFromDB);
    };
  }, []);

  // Показываем пустое состояние до загрузки данных
  if (!isDataLoaded) {
    return (
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Нажмите "Load from DB" в навбаре для загрузки данных из базы
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Database className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                Данные не загружены
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Используйте кнопку "Load from DB" в верхней панели навигации для загрузки продуктов из базы данных
              </p>
              <Button 
                onClick={() => loadProducts()} 
                className="mt-4 gap-2"
                disabled={isLoading}
              >
                <Database className="h-4 w-4" />
                Загрузить данные
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <ProductsTable
          products={products}
          offset={newOffset ?? 0}
          totalProducts={totalProducts}
        />
      </TabsContent>
    </Tabs>
  );
}
