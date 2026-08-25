export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          robux: number;
          price: number;
          is_active: boolean;
          image_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          robux: number;
          price: number;
          is_active?: boolean;
          image_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          robux?: number;
          price?: number;
          is_active?: boolean;
          image_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: number;
          order_code: string;
          product_id: number | null;
          user_id: string | null;
          roblox_username: string;
          customer_phone: string;
          robux: number;
          price: number;
          payment_method: string;
          payment_status: "pending" | "paid" | "failed";
          payment_proof_path: string | null;
          order_status: "pending" | "processing" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
          roblox_user_id: string | null;
          customer_notes: string | null;
          admin_notes: string | null;
          expires_at: string | null;
        };
        Insert: {
          id?: number;
          order_code: string;
          product_id?: number | null;
          user_id?: string | null;
          roblox_username: string;
          customer_phone: string;
          robux: number;
          price: number;
          payment_method?: string;
          payment_status?: "pending" | "paid" | "failed";
          payment_proof_path?: string | null;
          order_status?: "pending" | "processing" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
          roblox_user_id?: string | null;
          customer_notes?: string | null;
          admin_notes?: string | null;
          expires_at?: string | null;
        };
        Update: {
          id?: number;
          order_code?: string;
          product_id?: number | null;
          user_id?: string | null;
          roblox_username?: string;
          customer_phone?: string;
          robux?: number;
          price?: number;
          payment_method?: string;
          payment_status?: "pending" | "paid" | "failed";
          payment_proof_path?: string | null;
          order_status?: "pending" | "processing" | "completed" | "cancelled";
          created_at?: string;
          updated_at?: string;
          roblox_user_id?: string | null;
          customer_notes?: string | null;
          admin_notes?: string | null;
          expires_at?: string | null;
        };
      };
      blacklists: {
        Row: {
          id: number;
          roblox_username: string;
          reason: string | null;
          created_at: string | null;
          roblox_user_id: string | null;
          phone: string | null;
        };
        Insert: {
          id?: number;
          roblox_username: string;
          reason?: string | null;
          created_at?: string | null;
          roblox_user_id?: string | null;
          phone?: string | null;
        };
        Update: {
          id?: number;
          roblox_username?: string;
          reason?: string | null;
          created_at?: string | null;
          roblox_user_id?: string | null;
          phone?: string | null;
        };
      };
      store_settings: {
        Row: {
          id: number;
          store_name: string;
          whatsapp_number: string;
          qris_image_path: string | null;
          logo_image_path: string | null;
          updated_at: string;
          banner_image_path: string | null;
          promo_active: boolean | null;
          promo_tag: string | null;
          promo_badge: string | null;
          promo_title: string | null;
          promo_subtitle: string | null;
          promo_robux_amount: number | null;
          promo_original_label: string | null;
          promo_discount_price: number | null;
          promo_end_date: string | null;
        };
        Insert: {
          id?: number;
          store_name: string;
          whatsapp_number: string;
          qris_image_path?: string | null;
          logo_image_path?: string | null;
          updated_at?: string;
          banner_image_path?: string | null;
          promo_active?: boolean | null;
          promo_tag?: string | null;
          promo_badge?: string | null;
          promo_title?: string | null;
          promo_subtitle?: string | null;
          promo_robux_amount?: number | null;
          promo_original_label?: string | null;
          promo_discount_price?: number | null;
          promo_end_date?: string | null;
        };
        Update: {
          id?: number;
          store_name?: string;
          whatsapp_number?: string;
          qris_image_path?: string | null;
          logo_image_path?: string | null;
          updated_at?: string;
          banner_image_path?: string | null;
          promo_active?: boolean | null;
          promo_tag?: string | null;
          promo_badge?: string | null;
          promo_title?: string | null;
          promo_subtitle?: string | null;
          promo_robux_amount?: number | null;
          promo_original_label?: string | null;
          promo_discount_price?: number | null;
          promo_end_date?: string | null;
        };
      };
      testimonials: {
        Row: {
          id: number;
          user_id: string | null;
          name: string;
          message: string;
          rating: number;
          image_path: string | null;
          status: "pending" | "approved" | "rejected";
          created_at: string;
          updated_at: string;
          admin_reply: Json | null;
          order_code: string | null;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          name: string;
          message: string;
          rating: number;
          image_path?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
          updated_at?: string;
          admin_reply?: Json | null;
          order_code?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          name?: string;
          message?: string;
          rating?: number;
          image_path?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
          updated_at?: string;
          admin_reply?: Json | null;
          order_code?: string | null;
        };
      };
    };
  };
}
