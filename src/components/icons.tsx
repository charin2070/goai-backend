import { ChevronLeftIcon as HeroChevronLeftIcon } from '@heroicons/react/20/solid';
import { 
  Eye, 
  EyeOff, 
  ChevronDown, 
  Clock,
  ArrowDown,
  ArrowUp,
  Box,
  Users,
  MoreHorizontal,
} from 'lucide-react';

// Экспортируем иконки с правильными именами для tail-admin компонентов
export const ChevronLeftIcon = HeroChevronLeftIcon;
export const EyeIcon = Eye;
export const EyeCloseIcon = EyeOff;
export const ChevronDownIcon = ChevronDown;
export const TimeIcon = Clock;

// Иконки для EcommerceMetrics
export const ArrowDownIcon = ArrowDown;
export const ArrowUpIcon = ArrowUp;
export const BoxIconLine = Box;
export const GroupIcon = Users;
export const MoreDotIcon = MoreHorizontal;

// Для совместимости с типами
export type IconProps = {
  className?: string;
  size?: number;
}; 