import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SecuritySetupScreen() {
  const params = useLocalSearchParams<{ switchTo?: string; currentMethod?: string }>();
  const [selectedMethod, setSelectedMethod] = useState<'pin' | 'biometric' | null>(null);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'choose' | 'setup-pin' | 'confirm-pin'>('choose');
  const [loading, setLoading] = useState(false);
  const [isSwitch, setIsSwitch] = useState(false);

  const primaryColor = Platform.OS === 'android' ? '#4CAF50' : '#4F7DF3';

  const checkBiometricSupport = useCallback(async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return false;
    }
  }, []);

  const handleBiometricSetup = useCallback(async () => {
    setLoading(true);
    try {
      // First check if biometric is available
      const supported = await checkBiometricSupport();
      if (!supported) {
        Alert.alert(
          'Biometric Not Available',
          'Please set up biometric authentication in your device settings first.',
          [{ text: 'OK', onPress: () => {
            setLoading(false);
            if (isSwitch) {
              router.replace('/home');
            } else {
              setStep('choose');
              setSelectedMethod(null);
            }
          }}]
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: isSwitch ? 'Verify your identity to switch to biometric authentication' : 'Set up biometric authentication',
        fallbackLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Remove any existing PIN data when switching to biometric
        if (isSwitch) {
          await AsyncStorage.removeItem('securityPin');
        }
        
        await AsyncStorage.setItem('securityMethod', 'biometric');
        await AsyncStorage.setItem('securityEnabled', 'true');
        
        Alert.alert(
          'Success',
          isSwitch ? 'Biometric authentication has been updated successfully!' : 'Biometric authentication has been set up successfully!',
          [{ text: 'OK', onPress: () => router.replace('/profile') }]
        );
      } else {
        // Handle failed authentication
        const errorType = 'error' in result ? result.error : null;
        // const isUserCancel = errorType === 'UserCancel' || 
        //                    errorType === 'UserFallback' || 
        //                    errorType === 'SystemCancel';
        
        // const errorMessage = isUserCancel 
        //   ? 'Biometric setup was cancelled.'
        //   : 'Biometric setup failed. Please try again.';

        const isUserCancel = false;
        const errorMessage = "Biomatric setup cancelled";
        
        Alert.alert(
          isUserCancel ? 'Setup Cancelled' : 'Setup Failed',
          errorMessage,
          [{ text: 'OK', onPress: () => {
            if (isSwitch) {
              router.replace('/home');
            } else {
              setStep('choose');
              setSelectedMethod(null);
            }
          }}]
        );
      }
    } catch (error) {
      console.error('Biometric setup error:', error);
      Alert.alert(
        'Error',
        'Failed to set up biometric authentication. Please try again.',
        [{ text: 'OK', onPress: () => {
          if (isSwitch) {
            router.replace('/home');
          } else {
            setStep('choose');
            setSelectedMethod(null);
          }
        }}]
      );
    } finally {
      setLoading(false);
    }
  }, [isSwitch, checkBiometricSupport]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (params.switchTo && params.currentMethod) {
      setIsSwitch(true);
      setSelectedMethod(params.switchTo as 'pin' | 'biometric');
      
      if (params.switchTo === 'pin') {
        setStep('setup-pin');
      } else if (params.switchTo === 'biometric') {
        // Small delay to ensure component is fully mounted
        // timeoutId = setTimeout(() => {
        //   handleBiometricSetup();
        // }, 100);
      }
    }

    return () => {
      // if (timeoutId) {
      //   clearTimeout(timeoutId);
      // }
    };
  }, [params, handleBiometricSetup]);

  const handleMethodSelect = async (method: 'pin' | 'biometric') => {
    if (method === 'biometric') {
      const supported = await checkBiometricSupport();
      if (!supported) {
        Alert.alert(
          'Biometric Not Available',
          'Please set up biometric authentication in your device settings first.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    setSelectedMethod(method);
    if (method === 'pin') {
      setStep('setup-pin');
    } else {
      handleBiometricSetup();
    }
  };


  const handlePinInput = (digit: string) => {
    if (step === 'setup-pin') {
      if (pin.length < 4) {
        setPin(pin + digit);
      }
    } else if (step === 'confirm-pin') {
      if (confirmPin.length < 4) {
        setConfirmPin(confirmPin + digit);
      }
    }
  };

  const handlePinDelete = () => {
    if (step === 'setup-pin') {
      setPin(pin.slice(0, -1));
    } else if (step === 'confirm-pin') {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handlePinContinue = async () => {
    if (step === 'setup-pin' && pin.length === 4) {
      setStep('confirm-pin');
    } else if (step === 'confirm-pin' && confirmPin.length === 4) {
      if (pin === confirmPin) {
        setLoading(true);
        try {
          // Remove any existing biometric data when switching to PIN
          if (isSwitch) {
            await AsyncStorage.removeItem('biometricEnabled');
          }
          
          await AsyncStorage.setItem('securityMethod', 'pin');
          await AsyncStorage.setItem('securityPin', pin);
          await AsyncStorage.setItem('securityEnabled', 'true');
          
          Alert.alert(
            'Success',
            isSwitch ? 'PIN has been updated successfully!' : 'PIN has been set up successfully!',
            [{ text: 'OK', onPress: () => router.replace('/profile') }]
          );
        } catch (error) {
          console.error('PIN setup error:', error);
          Alert.alert('Error', 'Failed to save PIN. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        Alert.alert('PIN Mismatch', 'PINs do not match. Please try again.');
        setPin('');
        setConfirmPin('');
        setStep('setup-pin');
      }
    }
  };

  const renderChooseMethod = () => (
    <View style={styles.centerContent}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, { backgroundColor: primaryColor }]}>
          <Ionicons name="shield-checkmark" size={32} color="white" />
        </View>
      </View>

      <Text style={styles.title}>{isSwitch ? 'Update Security Method' : 'Secure Your Account'}</Text>
      <Text style={styles.subtitle}>
        {isSwitch ? 'Choose your new security method' : 'Choose how you\'d like to secure your account for future logins'}
      </Text>

      <View style={styles.methodContainer}>
        <TouchableOpacity
          style={[styles.methodButton, { borderColor: primaryColor }]}
          onPress={() => handleMethodSelect('biometric')}
        >
          <Ionicons name="finger-print" size={32} color={primaryColor} />
          <Text style={styles.methodTitle}>Biometric</Text>
          <Text style={styles.methodSubtitle}>Use fingerprint or face recognition</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodButton, { borderColor: primaryColor }]}
          onPress={() => handleMethodSelect('pin')}
        >
          <Ionicons name="keypad" size={32} color={primaryColor} />
          <Text style={styles.methodTitle}>4-Digit PIN</Text>
          <Text style={styles.methodSubtitle}>Create a secure PIN code</Text>
        </TouchableOpacity>
      </View>

      {!isSwitch && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/profile')}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPinSetup = () => (
    <View style={styles.centerContent}>
      <Text style={styles.title}>
        {step === 'setup-pin' ? 'Create Your PIN' : 'Confirm Your PIN'}
      </Text>
      <Text style={styles.subtitle}>
        {step === 'setup-pin' 
          ? 'Enter a 4-digit PIN to secure your account'
          : 'Re-enter your PIN to confirm'
        }
      </Text>

      <View style={styles.pinContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              {
                backgroundColor: 
                  (step === 'setup-pin' ? pin.length : confirmPin.length) > index 
                    ? primaryColor 
                    : '#E5E5E5'
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

      {((step === 'setup-pin' && pin.length === 4) || 
        (step === 'confirm-pin' && confirmPin.length === 4)) && (
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: primaryColor, opacity: loading ? 0.6 : 1 }]}
          onPress={handlePinContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.continueButtonText}>
              {step === 'setup-pin' ? 'Continue' : 'Confirm'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && selectedMethod === 'biometric') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              if (isSwitch) {
                router.replace('/home');
              } else {
                setStep('choose');
                setSelectedMethod(null);
                setLoading(false);
              }
            }}
          >
            <Ionicons name="arrow-back" size={24} color={primaryColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isSwitch ? 'Change Security' : 'Security Setup'}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContent}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconBackground, { backgroundColor: primaryColor }]}>
              <Ionicons name="finger-print" size={32} color="white" />
            </View>
          </View>
          <Text style={styles.title}>Setting up Biometric...</Text>
          <Text style={styles.subtitle}>Please follow the prompts to authenticate</Text>
          <ActivityIndicator size="large" color={primaryColor} style={styles.loadingIndicator} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            if (step === 'confirm-pin') {
              setStep('setup-pin');
              setConfirmPin('');
            } else if (step === 'setup-pin') {
              setStep('choose');
              setPin('');
              setSelectedMethod(null);
            } else {
              isSwitch ? router.replace('/profile') : router.back();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isSwitch ? 'Change Security' : 'Security Setup'}</Text>
        <View style={styles.placeholder} />
      </View>

      {step === 'choose' && renderChooseMethod()}
      {(step === 'setup-pin' || step === 'confirm-pin') && renderPinSetup()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  methodContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  methodButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  continueButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingIndicator: {
    marginTop: 24,
  },
});