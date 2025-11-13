export interface EmergencyContact {
  id: string
  name: string
  phoneNumber: string
  isSelected: boolean
}

export interface AccidentData {
  timestamp: Date
  location: {
    latitude: number
    longitude: number
  } | null
  accelerometerData: {
    x: number
    y: number
    z: number
  }
  magnitude: number
}

export interface AppSettings {
  isMonitoring: boolean
  sensitivityLevel: 'low' | 'medium' | 'high'
  autoStartMonitoring: boolean
  emergencyContacts: EmergencyContact[]
  lastAccidentCheck: Date | null
}
