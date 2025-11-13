import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { UserPlus, Trash2, Phone } from 'lucide-react-native'
import * as Contacts from 'expo-contacts'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface EmergencyContact {
  id: string
  name: string
  phoneNumber: string
}

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const stored = await AsyncStorage.getItem('emergencyContacts')
      if (stored) {
        setContacts(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
    }
  }

  const saveContacts = async (newContacts: EmergencyContact[]) => {
    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(newContacts))
      setContacts(newContacts)
    } catch (error) {
      console.error('Erro ao salvar contatos:', error)
    }
  }

  const addContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync()
    
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos de acesso aos seus contatos.')
      return
    }

    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      })

      if (data.length > 0) {
        // Mostra lista de contatos para seleção
        const contactOptions = data
          .filter(c => c.phoneNumbers && c.phoneNumbers.length > 0)
          .slice(0, 20) // Limita a 20 contatos
          .map(c => ({
            text: `${c.name} - ${c.phoneNumbers![0].number}`,
            onPress: () => {
              const newContact: EmergencyContact = {
                id: Date.now().toString(),
                name: c.name || 'Sem nome',
                phoneNumber: c.phoneNumbers![0].number || '',
              }
              saveContacts([...contacts, newContact])
            },
          }))

        Alert.alert(
          'Selecione um Contato',
          'Escolha um contato da sua lista',
          [
            ...contactOptions,
            { text: 'Cancelar', style: 'cancel' },
          ]
        )
      } else {
        Alert.alert('Nenhum Contato', 'Não foram encontrados contatos no seu dispositivo.')
      }
    } catch (error) {
      console.error('Erro ao acessar contatos:', error)
      Alert.alert('Erro', 'Não foi possível acessar seus contatos.')
    }
  }

  const removeContact = (id: string) => {
    Alert.alert(
      'Remover Contato',
      'Tem certeza que deseja remover este contato de emergência?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            const updated = contacts.filter(c => c.id !== id)
            saveContacts(updated)
          },
        },
      ]
    )
  }

  const renderContact = ({ item }: { item: EmergencyContact }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactInfo}>
        <View style={styles.contactIcon}>
          <Phone color="#EF4444" size={24} />
        </View>
        <View style={styles.contactDetails}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeContact(item.id)}
      >
        <Trash2 color="#EF4444" size={20} />
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contatos de Emergência</Text>
        <Text style={styles.subtitle}>
          Estes contatos serão notificados automaticamente em caso de acidente detectado
        </Text>
      </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Phone color="#6B7280" size={64} />
          <Text style={styles.emptyTitle}>Nenhum contato adicionado</Text>
          <Text style={styles.emptyText}>
            Adicione contatos de emergência para serem notificados automaticamente em caso de acidente
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContact}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={addContact}
      >
        <UserPlus color="#fff" size={24} />
        <Text style={styles.addButtonText}>Adicionar Contato</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Como Funciona</Text>
        <Text style={styles.infoText}>
          Quando um acidente é detectado, o app envia automaticamente uma mensagem com sua localização para todos os contatos de emergência cadastrados.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  list: {
    padding: 20,
  },
  contactCard: {
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
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  contactIcon: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#EF4444',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#1F2937',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
})
