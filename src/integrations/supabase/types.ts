export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Relationships: []
      }
      consultant_profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      consultants: {
        Row: {
          available_days: string[] | null
          available_hours: string | null
          bio: string | null
          created_at: string
          experience: number | null
          hourly_rate: number
          id: string
          is_available: boolean
          name: string | null
          profile_id: string
          profile_picture_url: string | null
          qualifications: string | null
          specialization: string
          updated_at: string
        }
        Insert: {
          available_days?: string[] | null
          available_hours?: string | null
          bio?: string | null
          created_at?: string
          experience?: number | null
          hourly_rate: number
          id?: string
          is_available?: boolean
          name?: string | null
          profile_id: string
          profile_picture_url?: string | null
          qualifications?: string | null
          specialization: string
          updated_at?: string
        }
        Update: {
          available_days?: string[] | null
          available_hours?: string | null
          bio?: string | null
          created_at?: string
          experience?: number | null
          hourly_rate?: number
          id?: string
          is_available?: boolean
          name?: string | null
          profile_id?: string
          profile_picture_url?: string | null
          qualifications?: string | null
          specialization?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "consultant_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          amount: number | null
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          consultant_id: string | null
          consultation_type: string
          created_at: string
          date: string | null
          email_sent: boolean | null
          id: string
          message: string | null
          order_id: string | null
          payment_id: string | null
          payment_status: string | null
          reference_id: string | null
          service_category: string | null
          source: string | null
          status: string
          time_slot: string
          timeframe: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          consultant_id?: string | null
          consultation_type: string
          created_at?: string
          date?: string | null
          email_sent?: boolean | null
          id?: string
          message?: string | null
          order_id?: string | null
          payment_id?: string | null
          payment_status?: string | null
          reference_id?: string | null
          service_category?: string | null
          source?: string | null
          status?: string
          time_slot: string
          timeframe?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          consultant_id?: string | null
          consultation_type?: string
          created_at?: string
          date?: string | null
          email_sent?: boolean | null
          id?: string
          message?: string | null
          order_id?: string | null
          payment_id?: string | null
          payment_status?: string | null
          reference_id?: string | null
          service_category?: string | null
          source?: string | null
          status?: string
          time_slot?: string
          timeframe?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants_public"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          applicable_services: string[] | null
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expiry_date: string | null
          id: string
          is_active: boolean
          max_discount_amount: number | null
          min_purchase_amount: number | null
          start_date: string | null
          updated_at: string
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          applicable_services?: string[] | null
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          start_date?: string | null
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          applicable_services?: string[] | null
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          start_date?: string | null
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          email: string | null
          id: string
          notes: Json | null
          rzp_order_id: string | null
          rzp_payment_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          notes?: Json | null
          rzp_order_id?: string | null
          rzp_payment_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          notes?: Json | null
          rzp_order_id?: string | null
          rzp_payment_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pricing_history: {
        Row: {
          changed_by: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          new_price: number
          old_price: number | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          new_price: number
          old_price?: number | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          new_price?: number
          old_price?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_pricing: {
        Row: {
          category: string
          created_at: string
          currency: string
          description: string | null
          id: string
          is_active: boolean
          price: number
          scenario: string
          service_id: string
          service_name: string
          services: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          price: number
          scenario?: string
          service_id: string
          service_name: string
          services?: string[] | null
          type?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          price?: number
          scenario?: string
          service_id?: string
          service_name?: string
          services?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      consultants_public: {
        Row: {
          available_days: string[] | null
          available_hours: string | null
          hourly_rate: number | null
          id: string | null
          is_available: boolean | null
          specialization: string | null
        }
        Insert: {
          available_days?: string[] | null
          available_hours?: string | null
          hourly_rate?: number | null
          id?: string | null
          is_available?: boolean | null
          specialization?: string | null
        }
        Update: {
          available_days?: string[] | null
          available_hours?: string | null
          hourly_rate?: number | null
          id?: string | null
          is_available?: boolean | null
          specialization?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "admin" | "editor"
      app_role: "admin" | "user" | "consultant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["admin", "editor"],
      app_role: ["admin", "user", "consultant"],
    },
  },
} as const
