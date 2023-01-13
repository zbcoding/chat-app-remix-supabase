export type Json = 
    | string
    | number
    | boolean
    | null 
    | {[key: string]: Json} 
    | Json[]

export interface Database {
    public: {
        Tables: {
            messages: {
                Row: {
                    id: string
                    created_at: string
                    content: string
                    user_id: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    content: string
                    user_id: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    content?: string
                    user_id: string
                }
            }
        }
    }
}