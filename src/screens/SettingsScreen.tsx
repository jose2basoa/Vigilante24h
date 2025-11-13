import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PermissionsService } from '../services/PermissionsService'

export default function SettingsScreen({ navigation }: any) {
  const [autoStart, setAutoStart] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [vibration, setVibration] = useState(true)
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    contacts: false,
    mediaLibrary: false,
    notifications: false,
  })

  useEffect(() => {
    loadSettings()
    checkPermissions()
  }, [])

  const loadSettings = async () => {
    try {
      const savedAutoStart = await AsyncStorage.getItem('autoStart')
      const savedNotifications = await AsyncStorage.getItem('notifications')
      const savedVibration = await AsyncStorage.getItem('vibration')

      if (savedAutoStart !== null) setAutoStart(savedAutoStart === 'true')
      if (savedNotifications !== null) setNotifications(savedNotifications === 'true')
      if (savedVibration !== null) setVibration(savedVibration === 'true')
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  const checkPermissions = async () => {
    const perms = await PermissionsService.checkAllPermissions()
    setPermissions(perms)
  }

  const saveSetting = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, value.toString())
    } catch (error) {
      console.error('Erro ao salvar configuração:', error)
    }
  }

  const requestAllPermissions = async () => {
    const perms = await PermissionsService.requestAllPermissions()
    setPermissions(perms)
    
    const allGranted = Object.values(perms).every(p => p === true)
    if (allGranted) {
      Alert.alert('Sucesso', 'Todas as permissões foram concedidas!')
    } else {
      Alert.alert(
        'Atenção',
        'Algumas permissões não foram concedidas. O app pode não funcionar corretamente.'
      )
    }
  }

  const clearAllData = () => {
    Alert.alert(
      'Limpar Dados',
      'Tem certeza que deseja limpar todos os dados do app? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear()
              Alert.alert('Sucesso', 'Todos os dados foram limpos.')
              loadSettings()
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar os dados.')
            }
          },
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Permissões */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissões</Text>
          
          <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionName}>📷 Câmera</Text>
              <Text style={styles.permissionStatus}>
                {permissions.camera ? '✅ Concedida' : '❌ Negada'}
              </Text>
            </View>
          </View>

          <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionName}>📍 Localização</Text>
              <Text style={styles.permissionStatus}>
                {permissions.location ? '✅ Concedida' : '❌ Negada'}
              </Text>
            </View>
          </View>

          <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionName}>📞 Contatos</Text>
              <Text style={styles.permissionStatus}>
                {permissions.contacts ? '✅ Concedida' : '❌ Negada'}
              </Text>
            </View>
          </View>

          <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionName}>💾 Armazenamento</Text>
              <Text style={styles.permissionStatus}>
                {permissions.mediaLibrary ? '✅ Concedida' : '❌ Negada'}
              </Text>
            </View>
          </View>

          <View style={styles.permissionItem}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionName}>🔔 Notificações</Text>
              <Text style={styles.permissionStatus}>
                {permissions.notifications ? '✅ Concedida' : '❌ Negada'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestAllPermissions}
          >
            <Text style={styles.permissionButtonText}>Solicitar Todas as Permissões</Text>
          </TouchableOpacity>
        </View>

        {/* Configurações Gerais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Geral</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Iniciar Monitoramento Automaticamente</Text>
              <Text style={styles.settingDescription}>
                Inicia o monitoramento ao abrir o app
              </Text>
            </View>
            <Switch
              value={autoStart}
              onValueChange={(value) => {
                setAutoStart(value)
                saveSetting('autoStart', value)
              }}
              trackColor={{ false: '#374151', true: '#10B981' }}
              thumbColor={autoStart ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Notificações</Text>
              <Text style={styles.settingDescription}>
                Receber notificações de alertas
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={(value) => {
                setNotifications(value)
                saveSetting('notifications', value)
              }}
              trackColor={{ false: '#374151', true: '#10B981' }}
              thumbColor={notifications ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Vibração</Text>
              <Text style={styles.settingDescription}>
                Vibrar ao detectar acidente
              </Text>
            </View>
            <Switch
              value={vibration}
              onValueChange={(value) => {
                setVibration(value)
                saveSetting('vibration', value)
              }}
              trackColor={{ false: '#374151', true: '#10B981' }}
              thumbColor={vibration ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Sobre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Versão</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Desenvolvido por</Text>
            <Text style={styles.infoValue}>Vigilante 24h Team</Text>
          </View>
        </View>

        {/* Ações Perigosas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona de Perigo</Text>
          
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={clearAllData}
          >
            <Text style={styles.dangerButtonText}>🗑️ Limpar Todos os Dados</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardText}>
            ℹ️ Este app utiliza sensores de movimento para detectar acidentes automaticamente.
            {'\n\n'}
            Em caso de detecção, um alerta será enviado para seus contatos de emergência após 30 segundos, a menos que você cancele.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#3B82F6',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  permissionInfo: {
    flex: 1,
  },
  permissionName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  permissionStatus: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  permissionButton: {
    marginTop: 16,
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  infoLabel: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#7F1D1D',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  dangerButtonText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1E40AF',
    borderRadius: 8,
  },
  infoCardText: {
    color: '#DBEAFE',
    fontSize: 14,
    lineHeight: 20,
  },
})
