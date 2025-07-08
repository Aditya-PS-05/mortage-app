import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function OTPVerificationScreen() {
  const params = useLocalSearchParams<{ email?: string; phone?: string; registrationMethod?: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const primaryColor = Platform.OS === 'android' ? '#4CAF50' : '#4F7DF3';
  const API_BASE_URL = 'http://192.168.216.153:3001/api';

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpInput = (digit: string) => {
    if (otp.length < 6) {
      setOtp(otp + digit);
    }
  };

  const handleOtpDelete = () => {
    setOtp(otp.slice(0, -1));
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        otp,
        registrationMethod: params.registrationMethod,
        ...(params.registrationMethod === 'email' ? { email: params.email } : { phone: params.phone })
      };

      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Success',
          'OTP verified successfully!',
          [
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.setItem('userToken', data.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
                router.replace('/security-setup');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
        setOtp('');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      const requestBody = {
        registrationMethod: params.registrationMethod,
        ...(params.registrationMethod === 'email' ? { email: params.email } : { phone: params.phone })
      };

      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'OTP sent successfully!');
        setResendTimer(30);
        setCanResend(false);
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const getContactInfo = () => {
    if (params.registrationMethod === 'email') {
      return params.email;
    } else {
      return params.phone;
    }
  };

  const getContactType = () => {
    return params.registrationMethod === 'email' ? 'email' : 'phone number';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify OTP</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconBackground, { backgroundColor: primaryColor }]}>
              <Ionicons name="mail" size={32} color="white" />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a 6-digit code to your {getContactType()}
          </Text>
          <Text style={styles.contactInfo}>{getContactInfo()}</Text>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  {
                    borderColor: otp.length > index ? primaryColor : '#E5E5E5',
                    backgroundColor: otp.length > index ? `${primaryColor}10` : 'white',
                  }
                ]}
              >
                <Text style={[styles.otpText, { color: otp.length > index ? primaryColor : '#999' }]}>
                  {otp[index] || ''}
                </Text>
              </View>
            ))}
          </View>

          {/* Keypad */}
          <View style={styles.keypad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <TouchableOpacity
                key={digit}
                style={styles.keypadButton}
                onPress={() => handleOtpInput(digit.toString())}
              >
                <Text style={styles.keypadText}>{digit}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.keypadButton} />
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handleOtpInput('0')}
            >
              <Text style={styles.keypadText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={handleOtpDelete}
            >
              <Ionicons name="backspace" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          {otp.length === 6 && (
            <TouchableOpacity
              style={[styles.verifyButton, { backgroundColor: primaryColor }]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResendOtp} disabled={resendLoading}>
                {resendLoading ? (
                  <ActivityIndicator color={primaryColor} size="small" />
                ) : (
                  <Text style={[styles.resendLink, { color: primaryColor }]}>Resend</Text>
                )}
              </TouchableOpacity>
            ) : (
              <Text style={styles.resendTimer}>Resend in {resendTimer}s</Text>
            )}
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    minHeight: 700,
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
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 48,
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 48,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpText: {
    fontSize: 24,
    fontWeight: '600',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    gap: 16,
    marginBottom: 48,
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
  verifyButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#666',
  },
  resendLink: {
    fontSize: 16,
    fontWeight: '600',
  },
  resendTimer: {
    fontSize: 16,
    color: '#999',
  },
});