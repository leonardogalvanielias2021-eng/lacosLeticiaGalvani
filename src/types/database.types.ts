export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
      }
      categorias: {
        Row: {
          id: string
          slug: string
          name: string
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          name: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      produtos: {
        Row: {
          id: string
          slug: string
          name: string
          short_description: string
          description: string
          price: number
          old_price: number | null
          category_id: string | null
          age_range: string | null
          materials: string | null
          measurements: string | null
          stock: number
          rating: number
          reviews: number
          is_new: boolean
          is_bestseller: boolean
          is_active: boolean
          image: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          name: string
          short_description: string
          description: string
          price: number
          old_price?: number | null
          category_id?: string | null
          age_range?: string | null
          materials?: string | null
          measurements?: string | null
          stock?: number
          rating?: number
          reviews?: number
          is_new?: boolean
          is_bestseller?: boolean
          is_active?: boolean
          image?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          short_description?: string
          description?: string
          price?: number
          old_price?: number | null
          category_id?: string | null
          age_range?: string | null
          materials?: string | null
          measurements?: string | null
          stock?: number
          rating?: number
          reviews?: number
          is_new?: boolean
          is_bestseller?: boolean
          is_active?: boolean
          image?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      produto_fotos: {
        Row: {
          id: string
          product_id: string
          image_url: string
          is_primary: boolean
          display_order: number
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          is_primary?: boolean
          display_order?: number
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          is_primary?: boolean
          display_order?: number
          created_at?: string
          deleted_at?: string | null
        }
      }
      produto_variacoes: {
        Row: {
          id: string
          product_id: string
          name: string
          hex_code: string | null
          image_url: string | null
          stock: number
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          hex_code?: string | null
          image_url?: string | null
          stock?: number
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          hex_code?: string | null
          image_url?: string | null
          stock?: number
          created_at?: string
          deleted_at?: string | null
        }
      }
      banners: {
        Row: {
          id: string
          title: string | null
          image_url: string
          link_url: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          image_url: string
          link_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          image_url?: string
          link_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      configuracoes_loja: {
        Row: {
          id: string
          store_name: string
          contact_email: string | null
          whatsapp_number: string | null
          instagram_url: string | null
          about_text: string | null
          about_image_url: string | null
          top_banner_text: string | null
          business_hours: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_name: string
          contact_email?: string | null
          whatsapp_number?: string | null
          instagram_url?: string | null
          about_text?: string | null
          about_image_url?: string | null
          top_banner_text?: string | null
          business_hours?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_name?: string
          contact_email?: string | null
          whatsapp_number?: string | null
          instagram_url?: string | null
          about_text?: string | null
          about_image_url?: string | null
          top_banner_text?: string | null
          business_hours?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          role_name: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
