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
      delivery_locations: {
        Row: {
          city: string | null
          created_at: string | null
          delivery_date: string | null
          delivery_time: string | null
          id: number
          load_id: string
          sequence: number
          state: string | null
          updated_at: string | null
          zipcode: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          delivery_date?: string | null
          delivery_time?: string | null
          id?: number
          load_id: string
          sequence: number
          state?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          delivery_date?: string | null
          delivery_time?: string | null
          id?: number
          load_id?: string
          sequence?: number
          state?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_locations_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "load_summary"
            referencedColumns: ["load_id"]
          },
          {
            foreignKeyName: "delivery_locations_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "loads"
            referencedColumns: ["load_id"]
          },
          {
            foreignKeyName: "delivery_locations_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "truck_availability"
            referencedColumns: ["current_load_id"]
          },
        ]
      }
      drivers: {
        Row: {
          available_date: string | null
          available_time: string | null
          created_at: string | null
          current_location_city: string | null
          current_location_state: string | null
          email: string | null
          id: number
          license_number: string | null
          license_state: string | null
          name: string
          phone: string | null
          status: string | null
          truck_number: string | null
          updated_at: string | null
        }
        Insert: {
          available_date?: string | null
          available_time?: string | null
          created_at?: string | null
          current_location_city?: string | null
          current_location_state?: string | null
          email?: string | null
          id?: number
          license_number?: string | null
          license_state?: string | null
          name: string
          phone?: string | null
          status?: string | null
          truck_number?: string | null
          updated_at?: string | null
        }
        Update: {
          available_date?: string | null
          available_time?: string | null
          created_at?: string | null
          current_location_city?: string | null
          current_location_state?: string | null
          email?: string | null
          id?: number
          license_number?: string | null
          license_state?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          truck_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      load_notes: {
        Row: {
          created_at: string | null
          id: number
          load_id: string
          note_text: string
          note_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          load_id: string
          note_text: string
          note_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          load_id?: string
          note_text?: string
          note_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "load_notes_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "load_summary"
            referencedColumns: ["load_id"]
          },
          {
            foreignKeyName: "load_notes_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "loads"
            referencedColumns: ["load_id"]
          },
          {
            foreignKeyName: "load_notes_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "truck_availability"
            referencedColumns: ["current_load_id"]
          },
        ]
      }
      loads: {
        Row: {
          broker_load_number: string | null
          broker_name: string | null
          created_at: string | null
          driver_id: number | null
          id: number
          load_id: string
          load_type: string | null
          rate: number | null
          status: string
          temperature: string | null
          updated_at: string | null
        }
        Insert: {
          broker_load_number?: string | null
          broker_name?: string | null
          created_at?: string | null
          driver_id?: number | null
          id?: number
          load_id: string
          load_type?: string | null
          rate?: number | null
          status?: string
          temperature?: string | null
          updated_at?: string | null
        }
        Update: {
          broker_load_number?: string | null
          broker_name?: string | null
          created_at?: string | null
          driver_id?: number | null
          id?: number
          load_id?: string
          load_type?: string | null
          rate?: number | null
          status?: string
          temperature?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "truck_availability"
            referencedColumns: ["driver_id"]
          },
        ]
      }
      pickup_locations: {
        Row: {
          city: string | null
          created_at: string | null
          id: number
          load_id: string
          pickup_date: string | null
          pickup_time: string | null
          sequence: number
          state: string | null
          updated_at: string | null
          zipcode: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          id?: number
          load_id: string
          pickup_date?: string | null
          pickup_time?: string | null
          sequence: number
          state?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          id?: number
          load_id?: string
          pickup_date?: string | null
          pickup_time?: string | null
          sequence?: number
          state?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pickup_locations_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "load_summary"
            referencedColumns: ["load_id"]
          },
          {
            foreignKeyName: "pickup_locations_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "loads"
            referencedColumns: ["load_id"]
          },
          {
            foreignKeyName: "pickup_locations_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "truck_availability"
            referencedColumns: ["current_load_id"]
          },
        ]
      }
    }
    Views: {
      load_notes_view: {
        Row: {
          broker_load_number: string | null
          created_at: string | null
          load_id: string | null
          load_type: string | null
          note_id: number | null
          note_text: string | null
          note_type: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "load_notes_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "load_summary"
            referencedColumns: ["load_id"]
          },
          {
            foreignKeyName: "load_notes_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "loads"
            referencedColumns: ["load_id"]
          },
          {
            foreignKeyName: "load_notes_load_id_fkey"
            columns: ["load_id"]
            isOneToOne: false
            referencedRelation: "truck_availability"
            referencedColumns: ["current_load_id"]
          },
        ]
      }
      load_summary: {
        Row: {
          broker_load_number: string | null
          broker_name: string | null
          created_at: string | null
          driver_id: number | null
          driver_name: string | null
          first_delivery_city: string | null
          first_delivery_date: string | null
          first_delivery_state: string | null
          first_delivery_time: string | null
          first_delivery_zipcode: string | null
          first_pickup_city: string | null
          first_pickup_date: string | null
          first_pickup_state: string | null
          first_pickup_time: string | null
          first_pickup_zipcode: string | null
          id: number | null
          load_id: string | null
          load_type: string | null
          rate: number | null
          status: string | null
          temperature: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "truck_availability"
            referencedColumns: ["driver_id"]
          },
        ]
      }
      truck_availability: {
        Row: {
          available_date: string | null
          available_time: string | null
          current_broker_load: string | null
          current_load_id: string | null
          current_load_type: string | null
          current_location_city: string | null
          current_location_state: string | null
          driver_id: number | null
          driver_name: string | null
          last_delivery_city: string | null
          last_delivery_date: string | null
          last_delivery_state: string | null
          last_delivery_time: string | null
          last_delivery_zipcode: string | null
          load_status: string | null
          status: string | null
          truck_number: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
