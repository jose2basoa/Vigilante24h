import * as Location from 'expo-location'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface EmergencyContact {
  id: string
  name: string
  phoneNumber: string
}

export class EmergencyAlert {
  async sendAlert(location: Location.LocationObject) {
    try {
      // Carrega os contatos de emergência
      const contactsJson = await AsyncStorage.getItem('emergencyContacts')
      if (!contactsJson) {
        console.log('Nenhum contato de emergência cadastrado')
        return
      }

      const contacts: EmergencyContact[] = JSON.parse(contactsJson)
      
      if (contacts.length === 0) {
        console.log('Lista de contatos vazia')
        return
      }

      // Monta a mensagem de emergência
      const message = this.buildEmergencyMessage(location)

      // Envia SMS para cada contato
      for (const contact of contacts) {
        await this.sendSMS(contact.phoneNumber, message)
      }

      console.log(`Alertas enviados para ${contacts.length} contatos`)
    } catch (error) {
      console.error('Erro ao enviar alertas:', error)
    }
  }

  private buildEmergencyMessage(location: Location.LocationObject): string {
    const { latitude, longitude } = location.coords
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
    
    return `🚨 ALERTA DE EMERGÊNCIA - VIGILANTE 24H

Um possível acidente foi detectado!

📍 Localização:
${googleMapsUrl}

Coordenadas: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}

⏰ Horário: ${new Date().toLocaleString('pt-BR')}

Por favor, entre em contato imediatamente ou acione serviços de emergência se necessário.`
  }

  private async sendSMS(phoneNumber: string, message: string) {
    try {
      // Remove caracteres não numéricos do telefone
      const cleanPhone = phoneNumber.replace(/\D/g, '')
      
      // Monta a URL do SMS
      const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(message)}`
      
      // Verifica se pode abrir a URL
      const canOpen = await Linking.canOpenURL(smsUrl)
      
      if (canOpen) {
        await Linking.openURL(smsUrl)
      } else {
        console.warn(`Não foi possível enviar SMS para ${phoneNumber}`)
      }
    } catch (error) {
      console.error(`Erro ao enviar SMS para ${phoneNumber}:`, error)
    }
  }

  async testAlert() {
    try {
      const location = await Location.getCurrentPositionAsync({})
      await this.sendAlert(location)
    } catch (error) {
      console.error('Erro ao testar alerta:', error)
    }
  }
}
