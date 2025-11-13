'use client'

import { Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Logo e Título */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-red-600 p-6 rounded-full">
              <Shield className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Vigilante 24h
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Sistema de monitoramento e gravação contínua para sua segurança
            </p>
          </div>

          {/* Card Principal */}
          <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">Projeto Reiniciado com Sucesso! ✅</h2>
            
            <div className="space-y-4 text-left">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-400 mb-2">✅ Estrutura Limpa</h3>
                <p className="text-gray-300">Projeto Next.js 15 configurado do zero com TypeScript e Tailwind CSS v4</p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">🎨 Design Moderno</h3>
                <p className="text-gray-300">Interface responsiva com gradientes e animações suaves</p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">🚀 Pronto para Desenvolvimento</h3>
                <p className="text-gray-300">Base sólida para adicionar funcionalidades do Vigilante 24h</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>Próximos Passos:</strong> Agora você pode me pedir para adicionar as funcionalidades específicas que deseja no app!
              </p>
            </div>
          </div>

          {/* Informações Técnicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400">Framework</p>
              <p className="text-lg font-bold">Next.js 15</p>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400">UI Library</p>
              <p className="text-lg font-bold">React 19</p>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400">Styling</p>
              <p className="text-lg font-bold">Tailwind CSS v4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
