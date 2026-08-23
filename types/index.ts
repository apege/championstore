export interface RobuxItem {
  id: string;
  amount: number;
  price: number;
  originalPrice?: number;
  isPromo?: boolean;
  isBestSeller?: boolean;
  isSultan?: boolean;
  badge?: string;
  category: 'popular' | 'promo' | 'sultan' | 'regular';
}

export interface CartItem {
  item: RobuxItem;
  quantity: number;
}

export type PaymentMethodId = 'website' | 'whatsapp';

export interface PaymentOption {
  id: PaymentMethodId;
  name: string;
  tagline: string;
  description: string;
  badgeText: string;
  badgeType: 'verified' | 'support';
  supportedMethods: string[];
}
