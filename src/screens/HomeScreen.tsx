import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { PermissionsService } from '../services/PermissionsService'
import { accidentDetection } from '../services/AccidentDetection'
import { EmergencyAlertService } from '../services/EmergencyAlert'
import { AccidentData, EmergencyContact } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function HomeScreen({ navigation }: any) {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sensitivity, setSensitivity] = useState<'low' | 'medium' | 'high'>('medium')
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [lastAccident, setLastAccident] = useState<AccidentData | null>(null)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      // Verificar permissões
      const permissions = await PermissionsService.checkAllPermissions()
      const allGranted = Object.values(permissions).every(p => p === true)
      setPermissionsGranted(allGranted)

      // Carregar contatos salvos
      const savedContacts = await AsyncStorage.getItem('emergencyContacts')
      if (savedContacts) {
        setEmergencyContacts(JSON.parse(savedContacts))
      }

      // Carregar configurações
      const savedSensitivity = await AsyncStorage.getItem('sensitivity')
      if (savedSensitivity) {
        setSensitivity(savedSensitivity as 'low' | 'medium' | 'high')
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao inicializar app:', error)
      setIsLoading(false)
    }
  }

  const requestPermissions = async () => {
    setIsLoading(true)
    const permissions = await PermissionsService.requestAllPermissions()
    const allGranted = Object.values(permissions).every(p => p === true)
    
    if (allGranted) {
      setPermissionsGranted(true)
      Alert.alert(
        'Permissões Concedidas',
        'Todas as permissões foram concedidas. O app está pronto para uso!'
      )
    } else {
      Alert.alert(
        'Permissões Necessárias',
        'Algumas permissões não foram concedidas. O app pode não funcionar corretamente.',
        [
          { text: 'Tentar Novamente', onPress: requestPermissions },
          { text: 'Continuar Mesmo Assim', style: 'cancel' },
        ]
      )
    }
    setIsLoading(false)
  }

  const toggleMonitoring = () => {
    if (!permissionsGranted) {
      Alert.alert(
        'Permissões Necessárias',
        'Você precisa conceder todas as permissões antes de iniciar o monitoramento.',
        [{ text: 'Conceder Permissões', onPress: requestPermissions }]
      )
      return
    }

    if (emergencyContacts.filter(c => c.isSelected).length === 0) {
      Alert.alert(
        'Contatos de Emergência',
        'Você precisa configurar pelo menos um contato de emergência antes de iniciar o monitoramento.',
        [{ text: 'Configurar Agora', onPress: () => navigation.navigate('Contacts') }]
      )
      return
    }

    if (isMonitoring) {
      accidentDetection.stopMonitoring()
      setIsMonitoring(false)
    } else {
      accidentDetection.startMonitoring(sensitivity, handleAccidentDetected)
      setIsMonitoring(true)
    }
  }

  const handleAccidentDetected = async (data: AccidentData) => {
    setLastAccident(data)
    
    Alert.alert(
      '🚨 ACIDENTE DETECTADO!',
      `Um possível acidente foi detectado.\n\nIntensidade: ${data.magnitude.toFixed(2)} m/s²\n\nDeseja enviar alerta para seus contatos de emergência?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Enviar Alerta',
          onPress: async () => {
            await EmergencyAlertService.sendEmergencyAlert(data, emergencyContacts)
          },
        },
      ],
      { cancelable: false }
    )

    // Auto-enviar após 30 segundos se não houver resposta
    setTimeout(async () => {
      await EmergencyAlertService.sendEmergencyAlert(data, emergencyContacts)
    }, 30000)
  }

  const testAccidentDetection = () => {
    Alert.alert(
      'Teste de Detecção',
      'Deseja simular um acidente para testar o sistema?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Simular',
          onPress: () => {
            accidentDetection.simulateAccident()
          },
        },
      ]
    )
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EF4444" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🛡️ Vigilante 24h</Text>
          <Text style={styles.subtitle}>Proteção Automática de Acidentes</Text>
        </View>

        {/* Status de Permissões */}
        {!permissionsGranted && (
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>⚠️ Permissões Necessárias</Text>
            <Text style={styles.warningText}>
              O app precisa de permissões para funcionar corretamente:
            </Text>
            <Text style={styles.permissionsList}>
              • Câmera (gravação de vídeo){'\n'}
              • Localização (enviar em alertas){'\n'}
              • Contatos (selecionar emergência){'\n'}
              • Armazenamento (salvar gravações){'\n'}
              • Sensores (detectar acidentes)
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermissions}
            >
              <Text style={styles.permissionButtonText}>Conceder Permissões</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status de Monitoramento */}
        <View style={[styles.card, isMonitoring && styles.cardActive]}>
          <View style={styles.statusHeader}>
            <Text style={styles.cardTitle}>Status do Monitoramento</Text>
            <View style={[styles.statusBadge, isMonitoring && styles.statusBadgeActive]}>
              <Text style={styles.statusBadgeText}>
                {isMonitoring ? '🟢 ATIVO' : '🔴 INATIVO'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.statusDescription}>
            {isMonitoring
              ? 'O sistema está monitorando movimentos e detectará automaticamente acidentes.'
              : 'Inicie o monitoramento para ativar a detecção automática de acidentes.'}
          </Text>

          <TouchableOpacity
            style={[styles.mainButton, isMonitoring && styles.mainButtonActive]}
            onPress={toggleMonitoring}
            disabled={!permissionsGranted}
          >
            <Text style={styles.mainButtonText}>
              {isMonitoring ? 'Parar Monitoramento' : 'Iniciar Monitoramento'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sensibilidade */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sensibilidade de Detecção</Text>
          <View style={styles.sensitivityButtons}>
            {(['low', 'medium', 'high'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.sensitivityButton,
                  sensitivity === level && styles.sensitivityButtonActive,
                ]}
                onPress={() => {
                  setSensitivity(level)
                  accidentDetection.setSensitivity(level)
                  AsyncStorage.setItem('sensitivity', level)
                }}
              >
                <Text
                  style={[
                    styles.sensitivityButtonText,
                    sensitivity === level && styles.sensitivityButtonTextActive,
                  ]}
                >
                  {level === 'low' ? 'Baixa' : level === 'medium' ? 'Média' : 'Alta'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sensitivityDescription}>
            {sensitivity === 'low' && 'Detecta apenas impactos muito fortes'}
            {sensitivity === 'medium' && 'Detecta impactos moderados a fortes (recomendado)'}
            {sensitivity === 'high' && 'Detecta impactos leves a fortes (mais sensível)'}
          </Text>
        </View>

        {/* Contatos de Emergência */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contatos de Emergência</Text>
          <Text style={styles.contactsCount}>
            {emergencyContacts.filter(c => c.isSelected).length} contato(s) selecionado(s)
          </Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Contacts')}
          >
            <Text style={styles.secondaryButtonText}>Gerenciar Contatos</Text>
          </TouchableOpacity>
        </View>

        {/* Último Acidente */}
        {lastAccident && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🚨 Último Acidente Detectado</Text>
            <Text style={styles.accidentInfo}>
              Data/Hora: {lastAccident.timestamp.toLocaleString('pt-BR')}{'\n'}
              Intensidade: {lastAccident.magnitude.toFixed(2)} m/s²
            </Text>
          </View>
        )}

        {/* Teste */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧪 Teste do Sistema</Text>
          <Text style={styles.testDescription}>
            Simule um acidente para testar se o sistema está funcionando corretamente.
          </Text>
          <TouchableOpacity
            style={styles.testButton}
            onPress={testAccidentDetection}
          >
            <Text style={styles.testButtonText}>Simular Acidente</Text>
          </TouchableOpacity>
        </View>

        {/* Configurações */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>⚙️ Configurações</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  warningCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#7C2D12',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EA580C',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FED7AA',
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    color: '#FED7AA',
    marginBottom: 12,
  },
  permissionsList: {
    fontSize: 14,
    color: '#FED7AA',
    marginBottom: 16,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#EA580C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    marginTop: 8,
    padding: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardActive: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#7F1D1D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeActive: {
    backgroundColor: '#065F46',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    lineHeight: 20,
  },
  mainButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  mainButtonActive: {
    backgroundColor: '#EF4444',
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sensitivityButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sensitivityButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  sensitivityButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  sensitivityButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  sensitivityButtonTextActive: {
    color: '#FFFFFF',
  },
  sensitivityDescription: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  contactsCount: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  accidentInfo: {
    fontSize: 14,
    color: '#FED7AA',
    lineHeight: 22,
  },
  testDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
    lineHeight: 20,
  },
  testButton: {
    backgroundColor: '#8B5CF6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsButton: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
