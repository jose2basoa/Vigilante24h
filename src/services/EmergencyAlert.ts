import * as Location from 'expo-location'
import * as SMS from 'expo-sms'
import * as Notifications from 'expo-notifications'
import { AccidentData, EmergencyContact } from '../types'

export class EmergencyAlertService {
  static async sendEmergencyAlert(
    accidentData: AccidentData,
    contacts: EmergencyContact[]
  ): Promise<void> {
    try {
      // Obter localização atual
      const location = await this.getCurrentLocation()
      
      // Criar mensagem de emergência
      const message = this.createEmergencyMessage(accidentData, location)
      
      // Enviar SMS para todos os contatos selecionados
      const selectedContacts = contacts.filter(c => c.isSelected)
      
      if (selectedContacts.length === 0) {
        console.warn('Nenhum contato de emergência selecionado')
        await this.showLocalNotification(
          'Acidente Detectado',
          'Nenhum contato de emergência configurado. Configure seus contatos nas configurações.'
        )
        return
      }

      await this.sendSMSToContacts(selectedContacts, message)
      
      // Mostrar notificação local
      await this.showLocalNotification(
        '🚨 Acidente Detectado',
        `Alerta enviado para ${selectedContacts.length} contato(s) de emergência`
      )

      console.log(`Alerta de emergência enviado para ${selectedContacts.length} contatos`)
    } catch (error) {
      console.error('Erro ao enviar alerta de emergência:', error)
      await this.showLocalNotification(
        'Erro ao Enviar Alerta',
        'Não foi possível enviar o alerta de emergência. Verifique as permissões.'
      )
    }
  }

  private static async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
      return location
    } catch (error) {
      console.error('Erro ao obter localização:', error)
      return null
    }
  }

  private static createEmergencyMessage(
    accidentData: AccidentData,
    location: Location.LocationObject | null
  ): string {
    const timestamp = accidentData.timestamp.toLocaleString('pt-BR')
    const magnitude = accidentData.magnitude.toFixed(2)
    
    let message = `🚨 ALERTA DE EMERGÊNCIA - Vigilante 24h\n\n`
    message += `Possível acidente detectado!\n`
    message += `Data/Hora: ${timestamp}\n`
    message += `Intensidade: ${magnitude} m/s²\n\n`
    
    if (location) {
      const { latitude, longitude } = location.coords
      message += `📍 Localização:\n`
      message += `Lat: ${latitude.toFixed(6)}\n`
      message += `Long: ${longitude.toFixed(6)}\n`
      message += `Google Maps: https://maps.google.com/?q=${latitude},${longitude}\n\n`
    } else {
      message += `⚠️ Localização não disponível\n\n`
    }
    
    message += `Por favor, verifique a situação imediatamente.`
    
    return message
  }

  private static async sendSMSToContacts(
    contacts: EmergencyContact[],
    message: string
  ): Promise<void> {
    try {
      const isAvailable = await SMS.isAvailableAsync()
      
      if (!isAvailable) {
        console.warn('SMS não disponível neste dispositivo')
        return
      }

      const phoneNumbers = contacts.map(c => c.phoneNumber)
      
      await SMS.sendSMSAsync(phoneNumbers, message)
      
      console.log(`SMS enviado para: ${phoneNumbers.join(', ')}`)
    } catch (error) {
      console.error('Erro ao enviar SMS:', error)
      throw error
    }
  }

  private static async showLocalNotification(
    title: string,
    body: string
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
        },
        trigger: null, // Imediatamente
      })
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error)
    }
  }

  static async testEmergencyAlert(contacts: EmergencyContact[]): Promise<void> {
    const testData: AccidentData = {
      timestamp: new Date(),
      location: null,
      accelerometerData: { x: 0, y: 0, z: 0 },
      magnitude: 50,
    }

    await this.showLocalNotification(
      '🧪 Teste de Alerta',
      'Este é um teste do sistema de alertas de emergência'
    )

    console.log('Teste de alerta executado')
  }
}
