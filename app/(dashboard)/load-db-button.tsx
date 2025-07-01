'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';

export function LoadDbButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadFromDb = async () => {
    setIsLoading(true);
    try {
      // Отправляем кастомное событие для загрузки данных
      const loadEvent = new CustomEvent('loadFromDB');
      window.dispatchEvent(loadEvent);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Даем время на загрузку
    }
  };

  return (
    <Button
      onClick={handleLoadFromDb}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      Load from DB
    </Button>
  );
} 