import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Shield, Video, Users, Settings, AlertTriangle } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { requestPermissions } from '../services/PermissionsService'

export default function HomePage() {
  const router = useRouter()
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    const granted = await requestPermissions()
    setPermissionsGranted(granted)
    
    if (!granted) {
      Alert.alert(
        'Permissões Necessárias',
        'O Vigilante 24h precisa de permissões para funcionar corretamente. Por favor, conceda acesso à câmera, localização, contatos e armazenamento.',
        [
          { text: 'Tentar Novamente', onPress: checkPermissions },
          { text: 'Cancelar', style: 'cancel' }
        ]
      )
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Logo e Título */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Shield color="#fff" size={64} />
          </View>
          <Text style={styles.title}>Vigilante 24h</Text>
          <Text style={styles.subtitle}>
            Proteção contínua com detecção automática de acidentes
          </Text>
        </View>

        {/* Status de Permissões */}
        <View style={[styles.card, permissionsGranted ? styles.cardSuccess : styles.cardWarning]}>
          <AlertTriangle 
            color={permissionsGranted ? '#10B981' : '#F59E0B'} 
            size={24} 
          />
          <Text style={styles.cardText}>
            {permissionsGranted 
              ? '✅ Todas as permissões concedidas' 
              : '⚠️ Permissões pendentes - Toque para configurar'}
          </Text>
          {!permissionsGranted && (
            <TouchableOpacity 
              style={styles.permissionButton}
              onPress={checkPermissions}
            >
              <Text style={styles.permissionButtonText}>Configurar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Funcionalidades */}
        <View style={styles.features}>
          <View style={styles.featureCard}>
            <Video color="#EF4444" size={32} />
            <Text style={styles.featureTitle}>Gravação Contínua</Text>
            <Text style={styles.featureText}>
              Grave automaticamente enquanto dirige
            </Text>
          </View>

          <View style={styles.featureCard}>
            <AlertTriangle color="#F59E0B" size={32} />
            <Text style={styles.featureTitle}>Detecção de Acidentes</Text>
            <Text style={styles.featureText}>
              Alerta automático em caso de impacto
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Users color="#10B981" size={32} />
            <Text style={styles.featureTitle}>Contatos de Emergência</Text>
            <Text style={styles.featureText}>
              Notificação automática para seus contatos
            </Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => router.push('/recording')}
            disabled={!permissionsGranted}
          >
            <Video color="#fff" size={24} />
            <Text style={styles.buttonText}>Iniciar Gravação</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => router.push('/emergency-contacts')}
          >
            <Users color="#fff" size={24} />
            <Text style={styles.buttonText}>Contatos de Emergência</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => router.push('/settings')}
          >
            <Settings color="#fff" size={24} />
            <Text style={styles.buttonText}>Configurações</Text>
          </TouchableOpacity>
        </View>

        {/* Informações */}
        <View style={styles.info}>
          <Text style={styles.infoTitle}>Como Funciona:</Text>
          <Text style={styles.infoText}>
            1. Conceda todas as permissões necessárias{'\n'}
            2. Configure seus contatos de emergência{'\n'}
            3. Inicie a gravação antes de dirigir{'\n'}
            4. Em caso de acidente, o app detecta e alerta automaticamente seus contatos
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    backgroundColor: '#EF4444',
    padding: 20,
    borderRadius: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardSuccess: {
    backgroundColor: '#065F46',
  },
  cardWarning: {
    backgroundColor: '#78350F',
  },
  cardText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  permissionButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  features: {
    gap: 16,
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  actions: {
    gap: 12,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  buttonPrimary: {
    backgroundColor: '#EF4444',
  },
  buttonSecondary: {
    backgroundColor: '#374151',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 22,
  },
})
