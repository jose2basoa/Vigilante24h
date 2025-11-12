'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Square, Camera, AlertTriangle, Save, Settings, Shield, Clock, LogOut, CreditCard, User, Video, Eye } from 'lucide-react'
import { STORAGE_LIMITS, DEMO_USERS, type UserProfile } from '@/lib/supabase'

interface Recording {
  id: string
  timestamp: Date
  duration: number
  camera: 'front' | 'rear' | 'both'
  isImportant: boolean
  size: number
}

export default function VigilantePage() {
  const router = useRouter()
  
  // Usuário admin por padrão
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.admin)
  const [userEmail] = useState(currentUser.email)
  
  const [isRecording, setIsRecording] = useState(false)
  const [currentCamera, setCurrentCamera] = useState<'front' | 'rear' | 'both'>('both')
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [storageUsed, setStorageUsed] = useState(currentUser.storage_used)
  const [recordingTime, setRecordingTime] = useState(0)
  const [impactDetected, setImpactDetected] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLivePreview, setShowLivePreview] = useState(true)

  const storageLimit = STORAGE_LIMITS[currentUser.plan]
  const storagePercentage = (storageUsed / storageLimit) * 100
  const canRecord24h = currentUser.plan !== 'free'
  const isAdmin = currentUser.role === 'admin'

  // Simular gravações existentes
  useEffect(() => {
    const mockRecordings: Recording[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        duration: 300,
        camera: 'both',
        isImportant: false,
        size: 150
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        duration: 180,
        camera: 'both',
        isImportant: true,
        size: 90
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        duration: 420,
        camera: 'rear',
        isImportant: true,
        size: 210
      },
    ]
    setRecordings(mockRecordings)
  }, [])

  // Timer de gravação (visual apenas)
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRecording])

  const toggleRecording = () => {
    if (!isRecording && storageUsed >= storageLimit) {
      alert(`Limite de armazenamento atingido (${storageLimit}GB). ${currentUser.plan === 'free' ? 'Faça upgrade para continuar gravando!' : 'Libere espaço para continuar.'}`)
      return
    }

    if (isRecording) {
      setIsRecording(false)
      setRecordingTime(0)
      const newRecording: Recording = {
        id: Date.now().toString(),
        timestamp: new Date(),
        duration: recordingTime,
        camera: currentCamera,
        isImportant: false,
        size: Math.round(recordingTime * 0.5)
      }
      setRecordings(prev => [newRecording, ...prev])
      setStorageUsed(prev => prev + (recordingTime * 0.5 / 1000))
    } else {
      setIsRecording(true)
      setRecordingTime(0)
    }
  }

  const saveImportantClip = (recordingId: string) => {
    setRecordings(prev => 
      prev.map(rec => 
        rec.id === recordingId 
          ? { ...rec, isImportant: true }
          : rec
      )
    )
  }

  const handleLogout = () => {
    router.push('/auth')
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (mb: number) => {
    return mb > 1000 ? `${(mb / 1000).toFixed(1)}GB` : `${mb}MB`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-xl font-bold">Vigilante 24h</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400">
                  Plano: <span className="text-white font-semibold capitalize">{currentUser.plan}</span>
                </p>
                {isAdmin && (
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/recordings')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Gravações</span>
            </button>

            <button
              onClick={() => router.push('/plans')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Planos</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-700">
                    <p className="text-sm text-gray-400">Conectado como</p>
                    <p className="text-sm font-medium truncate">{userEmail}</p>
                    {isAdmin && (
                      <span className="inline-block mt-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        ADMINISTRADOR
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-700 transition-colors text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Badge Admin com Acesso Total */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-red-900/50 to-purple-900/50 border-b border-red-700 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-sm font-bold text-red-200">
                  🔓 Modo Administrador - Acesso Total Liberado
                </p>
                <p className="text-xs text-red-300">
                  Todas as funcionalidades premium desbloqueadas • Armazenamento ilimitado • Sem restrições
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de Plano Gratuito (apenas para não-admin) */}
      {!isAdmin && currentUser.plan === 'free' && (
        <div className="bg-yellow-900/30 border-b border-yellow-700 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm font-semibold text-yellow-200">
                  Plano Gratuito - Armazenamento Limitado
                </p>
                <p className="text-xs text-yellow-300">
                  Você tem {storageLimit}GB permanentes. Faça upgrade para gravação 24h contínua!
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/plans')}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold whitespace-nowrap transition-colors"
            >
              Ver Planos
            </button>
          </div>
        </div>
      )}

      {/* Alerta de Impacto (simulado) */}
      {impactDetected && (
        <div className="bg-red-600 text-white p-4 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-6 h-6" />
          <div className="flex-1">
            <p className="font-semibold">Impacto Detectado!</p>
            <p className="text-sm">Deseja salvar este trecho como importante?</p>
          </div>
          <button
            onClick={() => {
              if (recordings.length > 0) {
                saveImportantClip(recordings[0].id)
              }
              setImpactDetected(false)
            }}
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Salvar
          </button>
        </div>
      )}

      <div className="p-4 space-y-6">
        {/* Toggle Live Preview */}
        <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">Preview em Tempo Real</span>
          </div>
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              showLivePreview 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {showLivePreview ? 'Ativado' : 'Desativado'}
          </button>
        </div>

        {/* Preview das Câmeras com Live Feed */}
        {showLivePreview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Câmera Traseira */}
            <div className="relative">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                  {/* Simulação de feed ao vivo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 animate-pulse"></div>
                  
                  <div className="text-center relative z-10">
                    <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">Câmera Traseira</p>
                    <p className="text-xs text-gray-500 mt-2">(Feed ao vivo simulado)</p>
                    
                    {/* Indicador de gravação */}
                    {isRecording && (
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400 text-sm font-bold">GRAVANDO</span>
                      </div>
                    )}
                    
                    {/* Timestamp simulado */}
                    <div className="mt-2 text-xs text-green-400 font-mono">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 left-2 bg-black/70 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Traseira • LIVE
              </div>
            </div>

            {/* Câmera Frontal */}
            <div className="relative">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                  {/* Simulação de feed ao vivo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 animate-pulse"></div>
                  
                  <div className="text-center relative z-10">
                    <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">Câmera Frontal</p>
                    <p className="text-xs text-gray-500 mt-2">(Feed ao vivo simulado)</p>
                    
                    {/* Indicador de gravação */}
                    {isRecording && (
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400 text-sm font-bold">GRAVANDO</span>
                      </div>
                    )}
                    
                    {/* Timestamp simulado */}
                    <div className="mt-2 text-xs text-green-400 font-mono">
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 left-2 bg-black/70 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Frontal • LIVE
              </div>
            </div>
          </div>
        )}

        {/* Controles de Gravação */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-2xl font-mono font-bold text-green-400">
                {formatTime(recordingTime)}
              </div>
              <p className="text-gray-400 text-sm">
                {isRecording ? 'Gravando...' : 'Pronto para gravar'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={currentCamera}
                onChange={(e) => setCurrentCamera(e.target.value as 'front' | 'rear' | 'both')}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                disabled={isRecording}
              >
                <option value="both">Ambas Câmeras</option>
                <option value="rear">Apenas Traseira</option>
                <option value="front">Apenas Frontal</option>
              </select>

              <button
                onClick={toggleRecording}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-5 h-5" />
                    Parar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Iniciar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status do Armazenamento */}
        <div className={`rounded-lg p-4 border-2 ${
          storagePercentage > 90 
            ? 'bg-red-900/20 border-red-700' 
            : storagePercentage > 70 
            ? 'bg-yellow-900/20 border-yellow-700'
            : 'bg-gray-800 border-gray-700'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">
                Armazenamento {canRecord24h ? '(24h)' : '(Permanente)'}
                {isAdmin && ' • Ilimitado'}
              </span>
            </div>
            <span className="text-sm text-gray-400">
              {storageUsed.toFixed(1)}GB / {isAdmin ? '∞' : `${storageLimit}GB`}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                isAdmin 
                  ? 'bg-green-500'
                  : storagePercentage > 90 
                  ? 'bg-red-500' 
                  : storagePercentage > 70 
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: isAdmin ? '100%' : `${Math.min(storagePercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {isAdmin 
              ? '🔓 Admin: Armazenamento ilimitado e sem restrições'
              : canRecord24h 
              ? 'Gravações antigas são excluídas automaticamente após 24h'
              : 'Suas gravações não são apagadas automaticamente. Gerencie seu espaço manualmente.'
            }
          </p>
        </div>

        {/* Lista de Gravações */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Gravações Recentes
            </h3>
            <button
              onClick={() => router.push('/recordings')}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Ver todas
              <Video className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recordings.slice(0, 3).map((recording) => (
              <div
                key={recording.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  recording.isImportant
                    ? 'bg-yellow-900/20 border-yellow-600'
                    : 'bg-gray-700 border-gray-600'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {recording.timestamp.toLocaleTimeString()}
                    </span>
                    {recording.isImportant && (
                      <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs font-semibold">
                        IMPORTANTE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 space-x-4">
                    <span>Duração: {formatTime(recording.duration)}</span>
                    <span>Câmera: {recording.camera === 'both' ? 'Ambas' : recording.camera === 'front' ? 'Frontal' : 'Traseira'}</span>
                    <span>Tamanho: {formatFileSize(recording.size)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!recording.isImportant && (
                    <button
                      onClick={() => saveImportantClip(recording.id)}
                      className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-600 rounded-lg transition-colors"
                      title="Marcar como importante"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => router.push('/recordings')}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configurações */}
        {showSettings && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Configurações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm">Detecção de Impacto</label>
                <input 
                  type="checkbox" 
                  defaultChecked={canRecord24h || isAdmin}
                  disabled={!canRecord24h && !isAdmin}
                  className="rounded" 
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Gravação Automática ao Iniciar</label>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Qualidade de Vídeo</label>
                <select 
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                  disabled={currentUser.plan === 'free' && !isAdmin}
                >
                  <option>HD (720p)</option>
                  {(currentUser.plan !== 'free' || isAdmin) && <option>Full HD (1080p)</option>}
                  {(currentUser.plan === 'premium' || currentUser.plan === 'ultimate' || isAdmin) && <option>4K</option>}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Backup Automático</label>
                <input 
                  type="checkbox" 
                  disabled={currentUser.plan === 'free' && !isAdmin}
                  className="rounded" 
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Preview em Tempo Real</label>
                <input 
                  type="checkbox" 
                  checked={showLivePreview}
                  onChange={(e) => setShowLivePreview(e.target.checked)}
                  className="rounded" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Nota de Demonstração */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-200 text-center">
            <strong>Modo Demonstração:</strong> Este é um modelo visual do app. As funcionalidades de gravação, crop de vídeo e preview ao vivo serão implementadas quando você configurar as APIs necessárias de câmera e processamento de vídeo.
          </p>
        </div>
      </div>
    </div>
  )
}
