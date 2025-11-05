export interface Product {
  id: string;
  barcode: string;
  name: string;
  description: string | null;
  price: number;
  image_filename: string | null;
  customization_type: 'names' | 'text' | 'none';
  customization_rules: CustomizationRules | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomizationRules {
  max_names?: number;
  max_chars_per_name?: number;
  max_chars?: number;
  allow_special_chars?: boolean;
  placeholder?: string;
}

export interface Order {
  id: string;
  order_number: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customization_data: Record<string, any> | null;
  status: 'pending' | 'ready' | 'picked_up' | 'cancelled';
  total_price: number;
  payment_id: string;
  payment_status: 'completed' | 'failed' | 'refunded';
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
