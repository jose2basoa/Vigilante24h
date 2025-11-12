'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Scissors, 
  Download, 
  Trash2,
  Camera,
  Clock,
  Calendar,
  Filter,
  Search,
  Shield
} from 'lucide-react'

interface Recording {
  id: string
  timestamp: Date
  duration: number
  camera: 'front' | 'rear' | 'both'
  isImportant: boolean
  size: number
  thumbnailUrl?: string
}

export default function RecordingsPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [cropStart, setCropStart] = useState(0)
  const [cropEnd, setCropEnd] = useState(0)
  const [isCropping, setIsCropping] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCamera, setFilterCamera] = useState<'all' | 'front' | 'rear' | 'both'>('all')

  // Carregar gravações mockadas
  useEffect(() => {
    const mockRecordings: Recording[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        duration: 300,
        camera: 'both',
        isImportant: true,
        size: 150
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        duration: 180,
        camera: 'both',
        isImportant: false,
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
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        duration: 600,
        camera: 'front',
        isImportant: false,
        size: 300
      },
    ]
    setRecordings(mockRecordings)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (mb: number) => {
    return mb > 1000 ? `${(mb / 1000).toFixed(1)}GB` : `${mb}MB`
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || selectedRecording?.duration || 0
      setDuration(dur)
      setCropEnd(dur)
    }
  }

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const startCropping = () => {
    setIsCropping(true)
    setCropStart(currentTime)
    setCropEnd(duration)
  }

  const applyCrop = () => {
    alert(`Vídeo cortado de ${formatTime(cropStart)} até ${formatTime(cropEnd)}\n\nEsta funcionalidade será implementada com processamento de vídeo real.`)
    setIsCropping(false)
  }

  const cancelCrop = () => {
    setIsCropping(false)
    setCropStart(0)
    setCropEnd(duration)
  }

  const handleDownload = (recording: Recording) => {
    alert(`Download iniciado: ${recording.id}\n\nEsta funcionalidade será implementada com armazenamento real.`)
  }

  const handleDelete = (recordingId: string) => {
    if (confirm('Tem certeza que deseja excluir esta gravação?')) {
      setRecordings(prev => prev.filter(r => r.id !== recordingId))
      if (selectedRecording?.id === recordingId) {
        setSelectedRecording(null)
      }
    }
  }

  const filteredRecordings = recordings.filter(rec => {
    const matchesSearch = rec.timestamp.toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCamera === 'all' || rec.camera === filterCamera
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Shield className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-xl font-bold">Gravações</h1>
              <p className="text-sm text-gray-400">Visualize e edite suas gravações</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 h-[calc(100vh-80px)]">
        {/* Lista de Gravações */}
        <div className="lg:col-span-1 bg-gray-800 rounded-lg p-4 overflow-y-auto">
          <div className="space-y-4 mb-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por data/hora..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Filtro */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterCamera}
                onChange={(e) => setFilterCamera(e.target.value as any)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">Todas as Câmeras</option>
                <option value="both">Ambas</option>
                <option value="front">Frontal</option>
                <option value="rear">Traseira</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredRecordings.map((recording) => (
              <div
                key={recording.id}
                onClick={() => setSelectedRecording(recording)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedRecording?.id === recording.id
                    ? 'bg-red-900/30 border-red-600'
                    : recording.isImportant
                    ? 'bg-yellow-900/20 border-yellow-600 hover:bg-yellow-900/30'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {recording.camera === 'both' ? 'Ambas' : recording.camera === 'front' ? 'Frontal' : 'Traseira'}
                    </span>
                  </div>
                  {recording.isImportant && (
                    <span className="bg-yellow-600 text-yellow-100 px-2 py-0.5 rounded text-xs font-semibold">
                      IMPORTANTE
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {recording.timestamp.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {recording.timestamp.toLocaleTimeString()} - {formatTime(recording.duration)}
                  </div>
                  <div>Tamanho: {formatFileSize(recording.size)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player de Vídeo */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4 flex flex-col">
          {selectedRecording ? (
            <>
              {/* Vídeo Preview */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-4 flex-1">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Preview de Vídeo</p>
                    <p className="text-sm text-gray-500">
                      Gravação de {selectedRecording.timestamp.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-4">
                      (Player de vídeo será implementado com API de mídia)
                    </p>
                  </div>
                </div>

                {/* Controles de Vídeo Simulados */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={handlePlayPause}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <span className="text-sm font-mono">
                      {formatTime(currentTime)} / {formatTime(selectedRecording.duration)}
                    </span>
                  </div>
                  
                  {/* Timeline */}
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max={selectedRecording.duration}
                      value={currentTime}
                      onChange={(e) => handleSeek(Number(e.target.value))}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(currentTime / selectedRecording.duration) * 100}%, #4b5563 ${(currentTime / selectedRecording.duration) * 100}%, #4b5563 100%)`
                      }}
                    />
                    
                    {/* Marcadores de Crop */}
                    {isCropping && (
                      <>
                        <div
                          className="absolute top-0 h-2 bg-yellow-500/50"
                          style={{
                            left: `${(cropStart / selectedRecording.duration) * 100}%`,
                            width: `${((cropEnd - cropStart) / selectedRecording.duration) * 100}%`
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Ferramentas de Edição */}
              <div className="space-y-4">
                {!isCropping ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={startCropping}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <Scissors className="w-4 h-4" />
                      Cortar Vídeo
                    </button>
                    <button
                      onClick={() => handleDownload(selectedRecording)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(selectedRecording.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                ) : (
                  <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Scissors className="w-5 h-5" />
                      Cortar Vídeo
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="text-sm text-gray-300 mb-1 block">Início do Corte</label>
                        <input
                          type="range"
                          min="0"
                          max={selectedRecording.duration}
                          value={cropStart}
                          onChange={(e) => {
                            const val = Number(e.target.value)
                            if (val < cropEnd) setCropStart(val)
                          }}
                          className="w-full"
                        />
                        <span className="text-sm text-gray-400">{formatTime(cropStart)}</span>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-300 mb-1 block">Fim do Corte</label>
                        <input
                          type="range"
                          min="0"
                          max={selectedRecording.duration}
                          value={cropEnd}
                          onChange={(e) => {
                            const val = Number(e.target.value)
                            if (val > cropStart) setCropEnd(val)
                          }}
                          className="w-full"
                        />
                        <span className="text-sm text-gray-400">{formatTime(cropEnd)}</span>
                      </div>
                      
                      <div className="bg-gray-700 rounded p-2 text-sm">
                        <strong>Duração do corte:</strong> {formatTime(cropEnd - cropStart)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={applyCrop}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        Aplicar Corte
                      </button>
                      <button
                        onClick={cancelCrop}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Info da Gravação */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Informações da Gravação</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Data:</span>
                      <p>{selectedRecording.timestamp.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Hora:</span>
                      <p>{selectedRecording.timestamp.toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Duração:</span>
                      <p>{formatTime(selectedRecording.duration)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Tamanho:</span>
                      <p>{formatFileSize(selectedRecording.size)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Câmera:</span>
                      <p className="capitalize">{selectedRecording.camera === 'both' ? 'Ambas' : selectedRecording.camera}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <p>{selectedRecording.isImportant ? 'Importante' : 'Normal'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-lg">Selecione uma gravação para visualizar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
