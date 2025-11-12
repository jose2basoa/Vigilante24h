// Configuração simulada do Supabase (visual apenas)
// Para ativar funcionalidades reais, configure as variáveis de ambiente

export type UserPlan = 'free' | 'basic' | 'premium' | 'ultimate'
export type UserRole = 'user' | 'admin'

export interface UserProfile {
  id: string
  email: string
  plan: UserPlan
  role: UserRole
  storage_used: number
  storage_limit: number
  created_at: string
}

// Limites de armazenamento por plano
export const STORAGE_LIMITS = {
  free: 8, // 8GB - não se apaga
  basic: 50, // 50GB
  premium: 200, // 200GB
  ultimate: 1000, // 1TB
}

// Preços dos planos
export const PLAN_PRICES = {
  basic: 19.90,
  premium: 39.90,
  ultimate: 79.90,
}

// Usuários demo (incluindo admin)
export const DEMO_USERS = {
  admin: {
    id: 'admin-user',
    email: 'admin@vigilante24h.com',
    plan: 'ultimate' as UserPlan,
    role: 'admin' as UserRole,
    storage_used: 0,
    storage_limit: STORAGE_LIMITS.ultimate,
    created_at: new Date().toISOString()
  },
  user: {
    id: 'demo-user',
    email: 'usuario@demo.com',
    plan: 'free' as UserPlan,
    role: 'user' as UserRole,
    storage_used: 2.4,
    storage_limit: STORAGE_LIMITS.free,
    created_at: new Date().toISOString()
  }
}

// Cliente Supabase simulado para demonstração
export const supabase = {
  auth: {
    getSession: async () => ({ 
      data: { 
        session: {
          user: DEMO_USERS.admin // Admin por padrão
        }
      } 
    }),
    onAuthStateChange: (callback: any) => {
      // Simula usuário admin logado
      setTimeout(() => {
        callback('SIGNED_IN', {
          user: DEMO_USERS.admin
        })
      }, 100)
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    },
    signOut: async () => ({ error: null })
  }
}
