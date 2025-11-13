import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Bell, Shield, Vibrate, Volume2 } from 'lucide-react-native'

export default function SettingsScreen() {
  const [accidentDetection, setAccidentDetection] = useState(true)
  const [autoAlert, setAutoAlert] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [vibration, setVibration] = useState(true)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detecção de Acidentes</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Shield color="#EF4444" size={24} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Detecção Automática</Text>
                <Text style={styles.settingDescription}>
                  Detecta impactos fortes automaticamente
                </Text>
              </View>
            </View>
            <Switch
              value={accidentDetection}
              onValueChange={setAccidentDetection}
              trackColor={{ false: '#374151', true: '#EF4444' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Bell color="#F59E0B" size={24} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Alerta Automático</Text>
                <Text style={styles.settingDescription}>
                  Envia alerta para contatos após 30 segundos
                </Text>
              </View>
            </View>
            <Switch
              value={autoAlert}
              onValueChange={setAutoAlert}
              trackColor={{ false: '#374151', true: '#F59E0B' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Volume2 color="#10B981" size={24} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Alertas Sonoros</Text>
                <Text style={styles.settingDescription}>
                  Reproduz som ao detectar acidente
                </Text>
              </View>
            </View>
            <Switch
              value={soundAlerts}
              onValueChange={setSoundAlerts}
              trackColor={{ false: '#374151', true: '#10B981' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Vibrate color="#8B5CF6" size={24} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Vibração</Text>
                <Text style={styles.settingDescription}>
                  Vibra ao detectar acidente
                </Text>
              </View>
            </View>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: '#374151', true: '#8B5CF6' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Versão do App</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Desenvolvido por</Text>
            <Text style={styles.infoValue}>Vigilante 24h Team</Text>
          </View>
        </View>

        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Importante</Text>
          <Text style={styles.warningText}>
            Este app não substitui sistemas de segurança profissionais. Use sempre o cinto de segurança e dirija com responsabilidade.
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  warningCard: {
    backgroundColor: '#78350F',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#FDE68A',
    lineHeight: 20,
  },
})
