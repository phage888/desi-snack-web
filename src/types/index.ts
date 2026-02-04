export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number | null;
  half_price: number | null;
  full_price: number | null;
  description: string | null;
  is_available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  size?: 'half' | 'full';
  price: number;
}

export interface Order {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  utr_number?: string;
  created_at?: string;
}

export interface OrderItem {
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  size?: string;
}
