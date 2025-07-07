import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AuthGateScreen() {
  const [securityMethod, setSecurityMethod] = useState<'pin' | 'biometric' | null>(null);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [authAttempts, setAuthAttempts] = useState(0);

  const primaryColor = Platform.OS === 'android' ? '#4CAF50' : '#4F7DF3';

  useEffect(() => {
    checkSecuritySetup();
  }, []);

  const checkSecuritySetup = async () => {
    try {
      const securityEnabled = await AsyncStorage.getItem('securityEnabled');
      const method = await AsyncStorage.getItem('securityMethod');
      
      if (securityEnabled === 'true' && method) {
        setSecurityMethod(method as 'pin' | 'biometric');
        if (method === 'biometric') {
          handleBiometricAuth();
        }
      } else {
        // No security setup, go to main app
        router.replace('/profile');
      }
    } catch (error) {
      console.error('Failed to check security setup:', error);
      router.replace('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        router.replace('/profile');
      } else {
        if (result.error === 'user_cancel') {
          Alert.alert('Authentication Required', 'You must authenticate to access the app.');
        } else {
          // Fallback to PIN if biometric fails
          const pinExists = await AsyncStorage.getItem('securityPin');
          if (pinExists) {
            setSecurityMethod('pin');
          } else {
            Alert.alert('Authentication Error', 'Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert('Authentication Error', 'Please try again.');
    }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handlePinSubmit = async () => {
    if (pin.length === 4) {
      try {
        const storedPin = await AsyncStorage.getItem('securityPin');
        if (pin === storedPin) {
          router.replace('/profile');
        } else {
          const newAttempts = authAttempts + 1;
          setAuthAttempts(newAttempts);
          
          if (newAttempts >= 3) {
            Alert.alert(
              'Too Many Attempts',
              'You have exceeded the maximum number of attempts. Please try again later.',
              [{ text: 'OK', onPress: () => setAuthAttempts(0) }]
            );
          } else {
            Alert.alert(
              'Incorrect PIN',
              `Wrong PIN. ${3 - newAttempts} attempts remaining.`
            );
          }
          setPin('');
        }
      } catch (error) {
        console.error('PIN verification error:', error);
        Alert.alert('Error', 'Failed to verify PIN. Please try again.');
      }
    }
  };

  const handleForgotSecurity = () => {
    Alert.alert(
      'Reset Security',
      'This will log you out and require you to sign in again. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove([
              'securityEnabled',
              'securityMethod',
              'securityPin',
              'userToken',
              'userData'
            ]);
            router.replace('/');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <View style={[styles.iconBackground, { backgroundColor: primaryColor }]}>
            <Ionicons name="shield-checkmark" size={32} color="white" />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (securityMethod === 'biometric') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <View style={[styles.iconBackground, { backgroundColor: primaryColor }]}>
            <Ionicons name="finger-print" size={32} color="white" />
          </View>
          <Text style={styles.title}>Authenticate</Text>
          <Text style={styles.subtitle}>Use your biometric to access your account</Text>
          
          <TouchableOpacity
            style={[styles.authButton, { backgroundColor: primaryColor }]}
            onPress={handleBiometricAuth}
          >
            <Ionicons name="finger-print" size={24} color="white" />
            <Text style={styles.authButtonText}>Use Biometric</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotButton} onPress={handleForgotSecurity}>
            <Text style={styles.forgotButtonText}>Having trouble? Reset security</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (securityMethod === 'pin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <View style={[styles.iconBackground, { backgroundColor: primaryColor }]}>
            <Ionicons name="keypad" size={32} color="white" />
          </View>
          <Text style={styles.title}>Enter Your PIN</Text>
          <Text style={styles.subtitle}>Enter your 4-digit PIN to access your account</Text>

          <View style={styles.pinContainer}>
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.pinDot,
                  {
                    backgroundColor: pin.length > index ? primaryColor : '#E5E5E5'
                  }
                ]}
              />
            ))}
          </View>

          <View style={styles.keypad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <TouchableOpacity
                key={digit}
                style={styles.keypadButton}
                onPress={() => handlePinInput(digit.toString())}
              >
                <Text style={styles.keypadText}>{digit}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.keypadButton} />
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handlePinInput('0')}
            >
              <Text style={styles.keypadText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={handlePinDelete}
            >
              <Ionicons name="backspace" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {pin.length === 4 && (
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: primaryColor }]}
              onPress={handlePinSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.forgotButton} onPress={handleForgotSecurity}>
            <Text style={styles.forgotButtonText}>Forgot PIN? Reset security</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  pinContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    gap: 16,
    marginBottom: 32,
  },
  keypadButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keypadText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
  },
  submitButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotButton: {
    padding: 16,
  },
  forgotButtonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});