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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          camera_id: string | null
          confidence_score: number | null
          created_at: string
          description: string
          id: string
          location: string
          metadata: Json | null
          resolved_at: string | null
          severity: string
          status: string
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          camera_id?: string | null
          confidence_score?: number | null
          created_at?: string
          description: string
          id?: string
          location: string
          metadata?: Json | null
          resolved_at?: string | null
          severity: string
          status?: string
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          camera_id?: string | null
          confidence_score?: number | null
          created_at?: string
          description?: string
          id?: string
          location?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras_public"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      camera_credentials: {
        Row: {
          camera_id: string
          created_at: string
          id: string
          rtsp_url: string
          updated_at: string
        }
        Insert: {
          camera_id: string
          created_at?: string
          id?: string
          rtsp_url: string
          updated_at?: string
        }
        Update: {
          camera_id?: string
          created_at?: string
          id?: string
          rtsp_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "camera_credentials_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: true
            referencedRelation: "cameras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "camera_credentials_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: true
            referencedRelation: "cameras_public"
            referencedColumns: ["id"]
          },
        ]
      }
      cameras: {
        Row: {
          building: string | null
          camera_type: string
          coverage_area: string | null
          created_at: string
          floor: string | null
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          rtsp_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          building?: string | null
          camera_type: string
          coverage_area?: string | null
          created_at?: string
          floor?: string | null
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          rtsp_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          building?: string | null
          camera_type?: string
          coverage_area?: string | null
          created_at?: string
          floor?: string | null
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          rtsp_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          assigned_to: string | null
          camera_id: string | null
          created_at: string
          description: string
          id: string
          incident_time: string
          location: string
          reported_by: string | null
          resolved_at: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          camera_id?: string | null
          created_at?: string
          description: string
          id?: string
          incident_time?: string
          location: string
          reported_by?: string | null
          resolved_at?: string | null
          severity: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          camera_id?: string | null
          created_at?: string
          description?: string
          id?: string
          incident_time?: string
          location?: string
          reported_by?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badge_number: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          badge_number?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          badge_number?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_uploads: {
        Row: {
          analysis_results: Json | null
          analysis_status: string
          camera_id: string | null
          created_at: string
          duration_seconds: number | null
          file_name: string
          file_size: number
          id: string
          storage_path: string
          tags: string[] | null
          thumbnail_url: string | null
          upload_date: string
          uploaded_by: string
        }
        Insert: {
          analysis_results?: Json | null
          analysis_status?: string
          camera_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_name: string
          file_size: number
          id?: string
          storage_path: string
          tags?: string[] | null
          thumbnail_url?: string | null
          upload_date?: string
          uploaded_by: string
        }
        Update: {
          analysis_results?: Json | null
          analysis_status?: string
          camera_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_name?: string
          file_size?: number
          id?: string
          storage_path?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          upload_date?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_uploads_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_uploads_camera_id_fkey"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "cameras_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      cameras_public: {
        Row: {
          building: string | null
          camera_type: string | null
          coverage_area: string | null
          created_at: string | null
          floor: string | null
          id: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          building?: string | null
          camera_type?: string | null
          coverage_area?: string | null
          created_at?: string | null
          floor?: string | null
          id?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          building?: string | null
          camera_type?: string | null
          coverage_area?: string | null
          created_at?: string | null
          floor?: string | null
          id?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "security" | "faculty"
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
      app_role: ["admin", "security", "faculty"],
    },
  },
} as const
