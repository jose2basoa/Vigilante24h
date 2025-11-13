import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native'
import * as Contacts from 'expo-contacts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { EmergencyContact } from '../types'
import { PermissionsService } from '../services/PermissionsService'

export default function ContactsScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    loadSavedContacts()
    checkPermission()
  }, [])

  const checkPermission = async () => {
    const granted = await PermissionsService.requestContactsPermission()
    setHasPermission(granted)
  }

  const loadSavedContacts = async () => {
    try {
      const saved = await AsyncStorage.getItem('emergencyContacts')
      if (saved) {
        setContacts(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
    }
  }

  const saveContacts = async (updatedContacts: EmergencyContact[]) => {
    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts))
      setContacts(updatedContacts)
    } catch (error) {
      console.error('Erro ao salvar contatos:', error)
    }
  }

  const loadContactsFromPhone = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permissão Necessária',
        'Precisamos de permissão para acessar seus contatos.',
        [{ text: 'OK', onPress: checkPermission }]
      )
      return
    }

    setIsLoading(true)
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      })

      if (data.length > 0) {
        const phoneContacts: EmergencyContact[] = data
          .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
          .map(contact => ({
            id: contact.id || Math.random().toString(),
            name: contact.name || 'Sem nome',
            phoneNumber: contact.phoneNumbers![0].number || '',
            isSelected: false,
          }))

        // Mesclar com contatos já salvos
        const merged = phoneContacts.map(pc => {
          const existing = contacts.find(c => c.phoneNumber === pc.phoneNumber)
          return existing || pc
        })

        await saveContacts(merged)
        Alert.alert('Sucesso', `${phoneContacts.length} contatos carregados!`)
      } else {
        Alert.alert('Nenhum Contato', 'Nenhum contato encontrado no seu telefone.')
      }
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
      Alert.alert('Erro', 'Não foi possível carregar os contatos.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleContactSelection = (contactId: string) => {
    const updated = contacts.map(c =>
      c.id === contactId ? { ...c, isSelected: !c.isSelected } : c
    )
    saveContacts(updated)
  }

  const addManualContact = () => {
    Alert.prompt(
      'Adicionar Contato',
      'Digite o nome do contato:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Próximo',
          onPress: (name) => {
            if (!name) return
            Alert.prompt(
              'Adicionar Contato',
              'Digite o número de telefone:',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Adicionar',
                  onPress: (phone) => {
                    if (!phone) return
                    const newContact: EmergencyContact = {
                      id: Math.random().toString(),
                      name,
                      phoneNumber: phone,
                      isSelected: true,
                    }
                    saveContacts([...contacts, newContact])
                  },
                },
              ],
              'plain-text'
            )
          },
        },
      ],
      'plain-text'
    )
  }

  const removeContact = (contactId: string) => {
    Alert.alert(
      'Remover Contato',
      'Tem certeza que deseja remover este contato?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            const updated = contacts.filter(c => c.id !== contactId)
            saveContacts(updated)
          },
        },
      ]
    )
  }

  const selectedCount = contacts.filter(c => c.isSelected).length

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Contatos de Emergência</Text>
        <Text style={styles.subtitle}>
          {selectedCount} contato(s) selecionado(s)
        </Text>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={loadContactsFromPhone}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.actionButtonText}>📱 Carregar da Lista</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={addManualContact}
        >
          <Text style={styles.actionButtonText}>➕ Adicionar Manual</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Contatos */}
      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Nenhum contato adicionado ainda.{'\n\n'}
            Carregue contatos da sua lista ou adicione manualmente.
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <TouchableOpacity
                style={styles.contactInfo}
                onPress={() => toggleContactSelection(item.id)}
              >
                <View style={styles.checkbox}>
                  {item.isSelected && <View style={styles.checkboxChecked} />}
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeContact(item.id)}
              >
                <Text style={styles.removeButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          ℹ️ Os contatos selecionados receberão um SMS automático em caso de acidente detectado.
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  listContent: {
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  contactInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 20,
  },
  infoCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1E40AF',
    borderRadius: 8,
  },
  infoText: {
    color: '#DBEAFE',
    fontSize: 14,
    lineHeight: 20,
  },
})
