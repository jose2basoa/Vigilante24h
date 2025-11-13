import * as Camera from 'expo-camera'
import * as Location from 'expo-location'
import * as Contacts from 'expo-contacts'
import * as MediaLibrary from 'expo-media-library'
import { Alert } from 'react-native'

export async function requestPermissions(): Promise<boolean> {
  try {
    // Solicitar permissão de câmera
    const cameraStatus = await Camera.requestCameraPermissionsAsync()
    if (!cameraStatus.granted) {
      Alert.alert(
        'Permissão de Câmera',
        'O Vigilante 24h precisa acessar a câmera para gravar vídeos de proteção.',
        [{ text: 'OK' }]
      )
      return false
    }

    // Solicitar permissão de microfone
    const microphoneStatus = await Camera.requestMicrophonePermissionsAsync()
    if (!microphoneStatus.granted) {
      Alert.alert(
        'Permissão de Microfone',
        'O Vigilante 24h precisa acessar o microfone para gravar áudio.',
        [{ text: 'OK' }]
      )
      return false
    }

    // Solicitar permissão de localização
    const locationStatus = await Location.requestForegroundPermissionsAsync()
    if (!locationStatus.granted) {
      Alert.alert(
        'Permissão de Localização',
        'O Vigilante 24h precisa acessar sua localização para registrar onde os vídeos foram gravados e enviar sua posição em emergências.',
        [{ text: 'OK' }]
      )
      return false
    }

    // Solicitar permissão de localização em background
    const backgroundLocationStatus = await Location.requestBackgroundPermissionsAsync()
    if (!backgroundLocationStatus.granted) {
      Alert.alert(
        'Permissão de Localização em Background',
        'Para detectar acidentes mesmo quando o app está em segundo plano, precisamos de acesso contínuo à localização.',
        [{ text: 'OK' }]
      )
    }

    // Solicitar permissão de contatos
    const contactsStatus = await Contacts.requestPermissionsAsync()
    if (!contactsStatus.granted) {
      Alert.alert(
        'Permissão de Contatos',
        'O Vigilante 24h precisa acessar seus contatos para enviar alertas de emergência.',
        [{ text: 'OK' }]
      )
      return false
    }

    // Solicitar permissão de armazenamento (galeria)
    const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync()
    if (!mediaLibraryStatus.granted) {
      Alert.alert(
        'Permissão de Armazenamento',
        'O Vigilante 24h precisa acessar sua galeria para salvar vídeos importantes.',
        [{ text: 'OK' }]
      )
      return false
    }

    return true
  } catch (error) {
    console.error('Erro ao solicitar permissões:', error)
    return false
  }
}

export async function checkPermissions(): Promise<{
  camera: boolean
  microphone: boolean
  location: boolean
  backgroundLocation: boolean
  contacts: boolean
  mediaLibrary: boolean
}> {
  const cameraStatus = await Camera.getCameraPermissionsAsync()
  const microphoneStatus = await Camera.getMicrophonePermissionsAsync()
  const locationStatus = await Location.getForegroundPermissionsAsync()
  const backgroundLocationStatus = await Location.getBackgroundPermissionsAsync()
  const contactsStatus = await Contacts.getPermissionsAsync()
  const mediaLibraryStatus = await MediaLibrary.getPermissionsAsync()

  return {
    camera: cameraStatus.granted,
    microphone: microphoneStatus.granted,
    location: locationStatus.granted,
    backgroundLocation: backgroundLocationStatus.granted,
    contacts: contactsStatus.granted,
    mediaLibrary: mediaLibraryStatus.granted,
  }
}
