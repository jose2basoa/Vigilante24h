import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1F2937',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Vigilante 24h',
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="recording" 
          options={{ 
            title: 'Gravação',
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="emergency-contacts" 
          options={{ 
            title: 'Contatos de Emergência',
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Configurações',
            headerShown: true
          }} 
        />
      </Stack>
    </>
  )
}
