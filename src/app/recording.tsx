import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useState, useRef, useEffect } from 'react'
import { Video, StopCircle, Save, MapPin } from 'lucide-react-native'
import * as Location from 'expo-location'
import { AccidentDetection } from '../services/AccidentDetection'
import { EmergencyAlert } from '../services/EmergencyAlert'

export default function RecordingScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const cameraRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const accidentDetection = useRef(new AccidentDetection())
  const emergencyAlert = useRef(new EmergencyAlert())

  useEffect(() => {
    setupAccidentDetection()
    getLocation()
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      accidentDetection.current.stop()
    }
  }, [])

  const setupAccidentDetection = async () => {
    await accidentDetection.current.start()
    
    accidentDetection.current.onAccidentDetected(async () => {
      Alert.alert(
        '🚨 ACIDENTE DETECTADO!',
        'Um impacto forte foi detectado. Deseja enviar alerta de emergência?',
        [
          {
            text: 'Estou Bem',
            style: 'cancel',
          },
          {
            text: 'Enviar Alerta',
            onPress: async () => {
              if (location) {
                await emergencyAlert.current.sendAlert(location)
                Alert.alert('✅ Alerta Enviado', 'Seus contatos de emergência foram notificados.')
              }
            },
          },
        ],
        { cancelable: false }
      )
    })
  }

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({})
        setLocation(loc)
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error)
    }
  }

  const startRecording = async () => {
    if (!cameraRef.current) return

    try {
      setIsRecording(true)
      setRecordingTime(0)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      await cameraRef.current.recordAsync({
        maxDuration: 3600, // 1 hora
      })
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error)
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.')
      setIsRecording(false)
    }
  }

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return

    try {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      await cameraRef.current.stopRecording()
      setIsRecording(false)
      
      Alert.alert(
        'Gravação Finalizada',
        'O vídeo foi salvo com sucesso.',
        [{ text: 'OK' }]
      )
    } catch (error) {
      console.error('Erro ao parar gravação:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Carregando câmera...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos de permissão para acessar a câmera
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        ref={cameraRef}
        mode="video"
      >
        {/* Overlay de Informações */}
        <View style={styles.overlay}>
          {/* Status de Gravação */}
          <View style={styles.topBar}>
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>GRAVANDO</Text>
                <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
              </View>
            )}
          </View>

          {/* Localização */}
          {location && (
            <View style={styles.locationBar}>
              <MapPin color="#fff" size={16} />
              <Text style={styles.locationText}>
                {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          {/* Controles */}
          <View style={styles.controls}>
            {!isRecording ? (
              <TouchableOpacity 
                style={[styles.controlButton, styles.recordButton]}
                onPress={startRecording}
              >
                <Video color="#fff" size={32} />
                <Text style={styles.controlButtonText}>Iniciar Gravação</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.controlButton, styles.stopButton]}
                onPress={stopRecording}
              >
                <StopCircle color="#fff" size={32} />
                <Text style={styles.controlButtonText}>Parar Gravação</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>

      {/* Informações de Segurança */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          🛡️ Detecção de acidentes ativa | 📍 Localização rastreada
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    padding: 20,
    alignItems: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  recordingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  recordingTime: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
  },
  controls: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 40,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 16,
  },
  recordButton: {
    backgroundColor: '#EF4444',
  },
  stopButton: {
    backgroundColor: '#DC2626',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBar: {
    backgroundColor: '#1F2937',
    padding: 12,
    alignItems: 'center',
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  permissionButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
