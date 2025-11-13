import * as Camera from 'expo-camera'
import * as Location from 'expo-location'
import * as Contacts from 'expo-contacts'
import * as MediaLibrary from 'expo-media-library'
import * as Notifications from 'expo-notifications'

export class PermissionsService {
  static async requestAllPermissions(): Promise<{
    camera: boolean
    location: boolean
    contacts: boolean
    mediaLibrary: boolean
    notifications: boolean
  }> {
    const results = {
      camera: false,
      location: false,
      contacts: false,
      mediaLibrary: false,
      notifications: false,
    }

    try {
      // Câmera
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      results.camera = cameraStatus.status === 'granted'

      // Localização (foreground e background)
      const locationForeground = await Location.requestForegroundPermissionsAsync()
      if (locationForeground.status === 'granted') {
        const locationBackground = await Location.requestBackgroundPermissionsAsync()
        results.location = locationBackground.status === 'granted'
      }

      // Contatos
      const contactsStatus = await Contacts.requestPermissionsAsync()
      results.contacts = contactsStatus.status === 'granted'

      // Galeria/Armazenamento
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync()
      results.mediaLibrary = mediaLibraryStatus.status === 'granted'

      // Notificações
      const notificationsStatus = await Notifications.requestPermissionsAsync()
      results.notifications = notificationsStatus.status === 'granted'

      return results
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error)
      return results
    }
  }

  static async checkAllPermissions(): Promise<{
    camera: boolean
    location: boolean
    contacts: boolean
    mediaLibrary: boolean
    notifications: boolean
  }> {
    const results = {
      camera: false,
      location: false,
      contacts: false,
      mediaLibrary: false,
      notifications: false,
    }

    try {
      const cameraStatus = await Camera.getCameraPermissionsAsync()
      results.camera = cameraStatus.status === 'granted'

      const locationStatus = await Location.getForegroundPermissionsAsync()
      results.location = locationStatus.status === 'granted'

      const contactsStatus = await Contacts.getPermissionsAsync()
      results.contacts = contactsStatus.status === 'granted'

      const mediaLibraryStatus = await MediaLibrary.getPermissionsAsync()
      results.mediaLibrary = mediaLibraryStatus.status === 'granted'

      const notificationsStatus = await Notifications.getPermissionsAsync()
      results.notifications = notificationsStatus.status === 'granted'

      return results
    } catch (error) {
      console.error('Erro ao verificar permissões:', error)
      return results
    }
  }

  static async requestCameraPermission(): Promise<boolean> {
    const { status } = await Camera.requestCameraPermissionsAsync()
    return status === 'granted'
  }

  static async requestLocationPermission(): Promise<boolean> {
    const foreground = await Location.requestForegroundPermissionsAsync()
    if (foreground.status === 'granted') {
      const background = await Location.requestBackgroundPermissionsAsync()
      return background.status === 'granted'
    }
    return false
  }

  static async requestContactsPermission(): Promise<boolean> {
    const { status } = await Contacts.requestPermissionsAsync()
    return status === 'granted'
  }

  static async requestMediaLibraryPermission(): Promise<boolean> {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    return status === 'granted'
  }
}
