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
      matches: {
        Row: {
          board_number: number | null
          created_at: string
          id: string
          player1_color: string
          player1_id: string
          player2_id: string
          result: string | null
          round_id: string
          tournament_id: string
        }
        Insert: {
          board_number?: number | null
          created_at?: string
          id?: string
          player1_color?: string
          player1_id: string
          player2_id: string
          result?: string | null
          round_id: string
          tournament_id: string
        }
        Update: {
          board_number?: number | null
          created_at?: string
          id?: string
          player1_color?: string
          player1_id?: string
          player2_id?: string
          result?: string | null
          round_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          id: string
          initial_rating: number | null
          notes: string | null
          school_club: string | null
          tournament_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          initial_rating?: number | null
          notes?: string | null
          school_club?: string | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          initial_rating?: number | null
          notes?: string | null
          school_club?: string | null
          tournament_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      rounds: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          round_number: number
          start_time: string | null
          status: string
          tournament_id: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          round_number: number
          start_time?: string | null
          status?: string
          tournament_id: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          round_number?: number
          start_time?: string | null
          status?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rounds_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          created_at: string
          draws: number
          id: string
          losses: number
          player_id: string
          tiebreaker1: number
          tiebreaker2: number
          total_score: number
          tournament_id: string
          updated_at: string
          wins: number
        }
        Insert: {
          created_at?: string
          draws?: number
          id?: string
          losses?: number
          player_id: string
          tiebreaker1?: number
          tiebreaker2?: number
          total_score?: number
          tournament_id: string
          updated_at?: string
          wins?: number
        }
        Update: {
          created_at?: string
          draws?: number
          id?: string
          losses?: number
          player_id?: string
          tiebreaker1?: number
          tiebreaker2?: number
          total_score?: number
          tournament_id?: string
          updated_at?: string
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "scores_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          created_by: string | null
          current_round: number
          description: string | null
          end_date: string
          format: string
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          start_date: string
          time_control: string | null
          total_rounds: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_round?: number
          description?: string | null
          end_date: string
          format?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          start_date: string
          time_control?: string | null
          total_rounds?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_round?: number
          description?: string | null
          end_date?: string
          format?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          start_date?: string
          time_control?: string | null
          total_rounds?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_has_role: {
        Args: { user_id: string; role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "player" | "admin" | "superadmin"
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
    Enums: {
      app_role: ["player", "admin", "superadmin"],
    },
  },
} as const
