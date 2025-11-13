import { Accelerometer } from 'expo-sensors'
import { Vibration } from 'react-native'

export class AccidentDetection {
  private subscription: any = null
  private accidentThreshold = 2.5 // G-force threshold
  private onAccidentCallback: (() => void) | null = null

  async start() {
    try {
      // Verifica se o acelerômetro está disponível
      const isAvailable = await Accelerometer.isAvailableAsync()
      if (!isAvailable) {
        console.warn('Acelerômetro não disponível neste dispositivo')
        return
      }

      // Configura a taxa de atualização (100ms)
      Accelerometer.setUpdateInterval(100)

      // Inicia o monitoramento
      this.subscription = Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData
        
        // Calcula a magnitude da aceleração
        const magnitude = Math.sqrt(x * x + y * y + z * z)
        
        // Detecta impacto forte (acima do threshold)
        if (magnitude > this.accidentThreshold) {
          this.handleAccident()
        }
      })

      console.log('Detecção de acidentes iniciada')
    } catch (error) {
      console.error('Erro ao iniciar detecção de acidentes:', error)
    }
  }

  stop() {
    if (this.subscription) {
      this.subscription.remove()
      this.subscription = null
      console.log('Detecção de acidentes parada')
    }
  }

  onAccidentDetected(callback: () => void) {
    this.onAccidentCallback = callback
  }

  private handleAccident() {
    console.log('🚨 ACIDENTE DETECTADO!')
    
    // Vibra o dispositivo
    Vibration.vibrate([0, 500, 200, 500])
    
    // Chama o callback se estiver definido
    if (this.onAccidentCallback) {
      this.onAccidentCallback()
    }
  }

  setThreshold(threshold: number) {
    this.accidentThreshold = threshold
  }
}
