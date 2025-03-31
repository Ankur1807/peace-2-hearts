export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          consultant_id: string
          consultation_type: string
          created_at: string
          date: string | null
          id: string
          message: string | null
          reference_id: string | null
          status: string
          time_slot: string
          timeframe: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          consultant_id: string
          consultation_type: string
          created_at?: string
          date?: string | null
          id?: string
          message?: string | null
          reference_id?: string | null
          status?: string
          time_slot: string
          timeframe?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          consultant_id?: string
          consultation_type?: string
          created_at?: string
          date?: string | null
          id?: string
          message?: string | null
          reference_id?: string | null
          status?: string
          time_slot?: string
          timeframe?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
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
      package_pricing: {
        Row: {
          created_at: string
          currency: string
          id: string
          is_active: boolean
          package_id: string
          package_name: string
          price: number
          services: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          package_id: string
          package_name: string
          price: number
          services: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          package_id?: string
          package_name?: string
          price?: number
          services?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          consultation_id: string
          created_at: string
          currency: string
          id: string
          payment_method: string | null
          payment_status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          consultation_id: string
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          payment_status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          consultation_id?: string
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string | null
          payment_status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
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
          id: string
          is_active: boolean
          price: number
          scenario: string
          service_id: string
          service_name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          price: number
          scenario?: string
          service_id: string
          service_name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          price?: number
          scenario?: string
          service_id?: string
          service_name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "consultant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
