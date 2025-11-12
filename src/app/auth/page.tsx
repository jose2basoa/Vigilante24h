'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Shield } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = () => {
    // Simula login bem-sucedido (visual apenas)
    setLoading(true)
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-red-500" />
            <h1 className="text-3xl font-bold text-white">Vigilante 24h</h1>
          </div>
          <p className="text-gray-400">
            Proteção contínua para motoristas
          </p>
        </div>

        {/* Card de Autenticação */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Entre com sua conta
          </h2>

          {/* Botão Google (Visual apenas) */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </>
            )}
          </button>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-200 text-center">
                <strong>Plano Gratuito:</strong> 8GB de armazenamento permanente
              </p>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Ao entrar, você concorda com nossos{' '}
            <a href="#" className="text-red-400 hover:text-red-300">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-red-400 hover:text-red-300">
              Política de Privacidade
            </a>
          </p>
        </div>

        {/* Nota de Demonstração */}
        <div className="mt-6 bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
          <p className="text-sm text-yellow-200 text-center">
            <strong>Modo Demonstração:</strong> Este é um modelo visual. O login com Google será implementado quando você configurar o Supabase.
          </p>
        </div>
      </div>
    </div>
  )
}
