import { Accelerometer } from 'expo-sensors'
import { Subscription } from 'expo-sensors/build/Pedometer'
import { AccidentData } from '../types'

export class AccidentDetectionService {
  private subscription: Subscription | null = null
  private isMonitoring: boolean = false
  private onAccidentDetected: ((data: AccidentData) => void) | null = null
  
  // Limiares de detecção (em m/s²)
  private readonly THRESHOLDS = {
    low: 25,      // Impacto leve
    medium: 35,   // Impacto moderado
    high: 50,     // Impacto forte
  }

  private sensitivity: 'low' | 'medium' | 'high' = 'medium'

  constructor() {
    Accelerometer.setUpdateInterval(100) // Atualiza a cada 100ms
  }

  startMonitoring(
    sensitivity: 'low' | 'medium' | 'high' = 'medium',
    onAccident: (data: AccidentData) => void
  ): void {
    if (this.isMonitoring) {
      console.log('Monitoramento já está ativo')
      return
    }

    this.sensitivity = sensitivity
    this.onAccidentDetected = onAccident
    this.isMonitoring = true

    console.log(`Iniciando monitoramento de acidentes (sensibilidade: ${sensitivity})`)

    this.subscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData
      
      // Calcula a magnitude do vetor de aceleração
      const magnitude = Math.sqrt(x * x + y * y + z * z) * 9.81 // Converte para m/s²

      // Verifica se ultrapassou o limiar
      const threshold = this.THRESHOLDS[this.sensitivity]
      
      if (magnitude > threshold) {
        console.log(`🚨 ACIDENTE DETECTADO! Magnitude: ${magnitude.toFixed(2)} m/s²`)
        
        const accidentData: AccidentData = {
          timestamp: new Date(),
          location: null, // Será preenchido pelo serviço de localização
          accelerometerData: { x, y, z },
          magnitude,
        }

        if (this.onAccidentDetected) {
          this.onAccidentDetected(accidentData)
        }

        // Pausa temporária para evitar múltiplos alertas do mesmo acidente
        this.pauseMonitoring(5000) // 5 segundos
      }
    })
  }

  stopMonitoring(): void {
    if (this.subscription) {
      this.subscription.remove()
      this.subscription = null
    }
    this.isMonitoring = false
    console.log('Monitoramento de acidentes parado')
  }

  private pauseMonitoring(duration: number): void {
    this.stopMonitoring()
    setTimeout(() => {
      if (this.onAccidentDetected) {
        this.startMonitoring(this.sensitivity, this.onAccidentDetected)
      }
    }, duration)
  }

  isActive(): boolean {
    return this.isMonitoring
  }

  setSensitivity(level: 'low' | 'medium' | 'high'): void {
    this.sensitivity = level
    console.log(`Sensibilidade alterada para: ${level}`)
  }

  // Método para teste manual
  simulateAccident(): void {
    console.log('🧪 Simulando acidente para teste...')
    const testData: AccidentData = {
      timestamp: new Date(),
      location: null,
      accelerometerData: { x: 5, y: 5, z: 5 },
      magnitude: 50,
    }
    
    if (this.onAccidentDetected) {
      this.onAccidentDetected(testData)
    }
  }
}

export const accidentDetection = new AccidentDetectionService()
