'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  CreditCard, 
  Shield,
  Lock,
  Check,
  QrCode,
  Smartphone,
  Calendar,
  User,
  Mail,
  MapPin
} from 'lucide-react'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix' | 'boleto'>('credit')
  const [isProcessing, setIsProcessing] = useState(false)

  const planId = searchParams.get('plan') || 'basic'
  const period = searchParams.get('period') || 'monthly'

  const planDetails: any = {
    basic: {
      name: 'Básico',
      price: period === 'monthly' ? 19.90 : 199.90,
      storage: '50GB (24h)',
      features: ['Gravação 24h', 'Detecção de impacto', 'Full HD']
    },
    premium: {
      name: 'Premium',
      price: period === 'monthly' ? 39.90 : 399.90,
      storage: '200GB (24h)',
      features: ['Gravação 24h', 'Detecção avançada', '4K', 'Backup nuvem']
    },
    ultimate: {
      name: 'Ultimate',
      price: period === 'monthly' ? 79.90 : 799.90,
      storage: '1TB (24h)',
      features: ['Gravação 24h', 'IA de eventos', '4K HDR', 'API']
    }
  }

  const plan = planDetails[planId] || planDetails.basic

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      alert(`Pagamento processado com sucesso!\n\nPlano: ${plan.name}\nValor: R$ ${plan.price.toFixed(2)}\nMétodo: ${
        paymentMethod === 'credit' ? 'Cartão de Crédito' : 
        paymentMethod === 'pix' ? 'PIX' : 'Boleto'
      }\n\nEsta é uma demonstração. A integração real com gateway de pagamento será implementada em produção.`)
      setIsProcessing(false)
      router.push('/')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/plans')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-xl font-bold">Finalizar Pagamento</h1>
              <p className="text-sm text-gray-400">Checkout seguro</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-semibold">Pagamento Seguro</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2 space-y-6">
            {/* Métodos de Pagamento */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Método de Pagamento</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'credit'
                      ? 'border-red-500 bg-red-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <CreditCard className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Cartão de Crédito</p>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-red-500 bg-red-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <QrCode className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-semibold">PIX</p>
                  <p className="text-xs text-green-400 mt-1">Aprovação instantânea</p>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('boleto')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'boleto'
                      ? 'border-red-500 bg-red-900/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Smartphone className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Boleto</p>
                  <p className="text-xs text-yellow-400 mt-1">Até 3 dias úteis</p>
                </button>
              </div>

              {/* Formulário de Cartão */}
              {paymentMethod === 'credit' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome no Cartão</label>
                    <input
                      type="text"
                      placeholder="NOME COMPLETO"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="000"
                        maxLength={4}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Processando...' : `Pagar R$ ${plan.price.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              )}

              {/* PIX */}
              {paymentMethod === 'pix' && (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-6 text-center">
                    <QrCode className="w-32 h-32 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-300 mb-4">
                      Escaneie o QR Code com o app do seu banco
                    </p>
                    <div className="bg-gray-800 rounded p-3 mb-4">
                      <p className="text-xs text-gray-400 mb-1">Chave PIX (Copia e Cola)</p>
                      <p className="text-sm font-mono break-all">
                        00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890')
                        alert('Chave PIX copiada!')
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Copiar Chave PIX
                    </button>
                  </div>
                  
                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                    <p className="text-sm text-blue-200">
                      <strong>Atenção:</strong> Após realizar o pagamento, a confirmação é instantânea e seu plano será ativado automaticamente.
                    </p>
                  </div>
                </div>
              )}

              {/* Boleto */}
              {paymentMethod === 'boleto' && (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-8 h-8 text-yellow-400" />
                      <div>
                        <p className="font-semibold">Boleto Bancário</p>
                        <p className="text-sm text-gray-400">Vencimento em 3 dias úteis</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded p-3 mb-4">
                      <p className="text-xs text-gray-400 mb-1">Código de Barras</p>
                      <p className="text-sm font-mono break-all">
                        23793.38128 60000.123456 78901.234567 8 12345678901234
                      </p>
                    </div>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Gerando...' : 'Gerar Boleto'}
                    </button>
                  </div>
                  
                  <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                    <p className="text-sm text-yellow-200">
                      <strong>Importante:</strong> O boleto pode levar até 3 dias úteis para ser compensado. 
                      Seu plano será ativado após a confirmação do pagamento.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Dados Pessoais */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Dados Pessoais</h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Seu nome"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        placeholder="seu@email.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Endereço</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rua, número, bairro, cidade - UF"
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
              
              <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 border border-red-700 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold">{plan.name}</span>
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {period === 'monthly' ? 'MENSAL' : 'ANUAL'}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-3">{plan.storage}</p>
                
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>R$ {plan.price.toFixed(2)}</span>
                </div>
                
                {period === 'yearly' && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Desconto anual (20%)</span>
                    <span>- R$ {(plan.price * 0.25).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-400">R$ {plan.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {period === 'monthly' ? 'Cobrado mensalmente' : 'Cobrado anualmente'}
                  </p>
                </div>
              </div>

              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-green-400 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-semibold">Garantia de 7 dias</span>
                </div>
                <p className="text-xs text-green-300">
                  Não gostou? Devolvemos 100% do seu dinheiro em até 7 dias.
                </p>
              </div>

              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  <span>Pagamento 100% seguro e criptografado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Cancele quando quiser, sem multas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Suporte técnico incluído</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nota de Demonstração */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mt-8">
          <p className="text-sm text-blue-200 text-center">
            <strong>Modo Demonstração:</strong> Este é um checkout visual. A integração real com gateway de pagamento (Stripe, Mercado Pago, etc.) será implementada em produção com processamento seguro de pagamentos.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
