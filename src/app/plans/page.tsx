'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Check, 
  Shield, 
  Zap,
  Crown,
  Rocket,
  Clock,
  Camera,
  HardDrive,
  Video,
  AlertTriangle
} from 'lucide-react'

interface Plan {
  id: 'free' | 'basic' | 'premium' | 'ultimate'
  name: string
  price: number
  period: string
  description: string
  storage: string
  features: string[]
  popular?: boolean
  icon: any
  color: string
}

export default function PlansPage() {
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      period: 'para sempre',
      description: 'Ideal para testar o app',
      storage: '5GB permanentes',
      icon: Shield,
      color: 'gray',
      features: [
        'Gravação manual',
        '5GB de armazenamento permanente',
        'Câmera frontal e traseira',
        'Qualidade HD (720p)',
        'Sem gravação 24h',
        'Sem detecção de impacto',
        'Suporte por email'
      ]
    },
    {
      id: 'basic',
      name: 'Básico',
      price: billingPeriod === 'monthly' ? 19.90 : 199.90,
      period: billingPeriod === 'monthly' ? '/mês' : '/ano',
      description: 'Para uso diário',
      storage: '50GB (24h)',
      icon: Zap,
      color: 'blue',
      features: [
        'Gravação 24h automática',
        '50GB de armazenamento (24h)',
        'Detecção de impacto',
        'Câmera frontal e traseira',
        'Qualidade Full HD (1080p)',
        'Backup automático',
        'Suporte prioritário'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingPeriod === 'monthly' ? 39.90 : 399.90,
      period: billingPeriod === 'monthly' ? '/mês' : '/ano',
      description: 'Máxima proteção',
      storage: '200GB (24h)',
      icon: Crown,
      color: 'purple',
      popular: true,
      features: [
        'Gravação 24h automática',
        '200GB de armazenamento (24h)',
        'Detecção de impacto avançada',
        'Câmera frontal e traseira',
        'Qualidade 4K',
        'Backup em nuvem ilimitado',
        'Alertas em tempo real',
        'Suporte VIP 24/7'
      ]
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: billingPeriod === 'monthly' ? 79.90 : 799.90,
      period: billingPeriod === 'monthly' ? '/mês' : '/ano',
      description: 'Profissional completo',
      storage: '1TB (24h)',
      icon: Rocket,
      color: 'red',
      features: [
        'Gravação 24h automática',
        '1TB de armazenamento (24h)',
        'IA de detecção de eventos',
        'Múltiplas câmeras simultâneas',
        'Qualidade 4K HDR',
        'Backup em nuvem ilimitado',
        'Streaming ao vivo',
        'API de integração',
        'Suporte dedicado 24/7'
      ]
    }
  ]

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'hover') => {
    const colors: any = {
      gray: {
        bg: 'bg-gray-600',
        text: 'text-gray-400',
        border: 'border-gray-600',
        hover: 'hover:bg-gray-700'
      },
      blue: {
        bg: 'bg-blue-600',
        text: 'text-blue-400',
        border: 'border-blue-600',
        hover: 'hover:bg-blue-700'
      },
      purple: {
        bg: 'bg-purple-600',
        text: 'text-purple-400',
        border: 'border-purple-600',
        hover: 'hover:bg-purple-700'
      },
      red: {
        bg: 'bg-red-600',
        text: 'text-red-400',
        border: 'border-red-600',
        hover: 'hover:bg-red-700'
      }
    }
    return colors[color][variant]
  }

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      alert('Você já está no plano gratuito!')
      return
    }
    router.push(`/checkout?plan=${planId}&period=${billingPeriod}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-xl font-bold">Planos e Preços</h1>
              <p className="text-sm text-gray-400">Escolha o melhor plano para você</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Toggle de Período */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors relative ${
                billingPeriod === 'yearly'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                className={`relative bg-gray-800 rounded-2xl border-2 ${
                  plan.popular ? 'border-purple-500' : 'border-gray-700'
                } p-6 flex flex-col transition-all hover:scale-105 hover:shadow-2xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 ${getColorClasses(plan.color, 'bg')} rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      R$ {plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  {billingPeriod === 'yearly' && plan.price > 0 && (
                    <p className="text-sm text-green-400 mt-1">
                      Economize R$ {((plan.price / 0.8 * 12) - plan.price).toFixed(2).replace('.', ',')}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <div className={`flex items-center gap-2 ${getColorClasses(plan.color, 'text')} mb-2`}>
                    <HardDrive className="w-4 h-4" />
                    <span className="font-semibold">{plan.storage}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className={`w-5 h-5 ${getColorClasses(plan.color, 'text')} flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                      : `${getColorClasses(plan.color, 'bg')} ${getColorClasses(plan.color, 'hover')} text-white`
                  }`}
                >
                  {plan.id === 'free' ? 'Plano Atual' : 'Assinar Agora'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Comparação de Features */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Compare os Planos</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4">Recurso</th>
                  <th className="text-center py-4 px-4">Gratuito</th>
                  <th className="text-center py-4 px-4">Básico</th>
                  <th className="text-center py-4 px-4">Premium</th>
                  <th className="text-center py-4 px-4">Ultimate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Gravação 24h
                  </td>
                  <td className="text-center py-4 px-4">-</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-purple-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-400" />
                    Armazenamento
                  </td>
                  <td className="text-center py-4 px-4">5GB</td>
                  <td className="text-center py-4 px-4">50GB</td>
                  <td className="text-center py-4 px-4">200GB</td>
                  <td className="text-center py-4 px-4">1TB</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <Video className="w-4 h-4 text-gray-400" />
                    Qualidade
                  </td>
                  <td className="text-center py-4 px-4">HD</td>
                  <td className="text-center py-4 px-4">Full HD</td>
                  <td className="text-center py-4 px-4">4K</td>
                  <td className="text-center py-4 px-4">4K HDR</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                    Detecção de Impacto
                  </td>
                  <td className="text-center py-4 px-4">-</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-purple-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-4 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gray-400" />
                    Múltiplas Câmeras
                  </td>
                  <td className="text-center py-4 px-4">2</td>
                  <td className="text-center py-4 px-4">2</td>
                  <td className="text-center py-4 px-4">2</td>
                  <td className="text-center py-4 px-4">Ilimitado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gray-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Como funciona o armazenamento 24h?</h3>
              <p className="text-sm text-gray-300">
                Nos planos pagos, o sistema grava continuamente e mantém as últimas 24 horas de gravação. 
                Gravações antigas são automaticamente substituídas por novas, garantindo sempre as últimas 24h disponíveis.
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-sm text-gray-300">
                Sim! Você pode cancelar sua assinatura a qualquer momento. Não há multas ou taxas de cancelamento.
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Como funciona a detecção de impacto?</h3>
              <p className="text-sm text-gray-300">
                O app usa sensores do celular para detectar impactos e automaticamente salva os trechos importantes, 
                protegendo essas gravações de serem apagadas.
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Posso fazer upgrade depois?</h3>
              <p className="text-sm text-gray-300">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                As mudanças entram em vigor imediatamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
