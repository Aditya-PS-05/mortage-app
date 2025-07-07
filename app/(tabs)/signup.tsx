import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

export default function SignupScreen() {
  const params = useLocalSearchParams();
  const [registrationMethod, setRegistrationMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (params.name) {
      setFormData(prev => ({ ...prev, username: params.name as string }));
    }
    if (params.email) {
      setFormData(prev => ({ ...prev, email: params.email as string }));
      setRegistrationMethod('email');
    } else if (params.phone) {
      setFormData(prev => ({ ...prev, phone: params.phone as string }));
      setRegistrationMethod('phone');
    }
  }, [params.name, params.email, params.phone]);

  // const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

  const API_BASE_URL = 'http://192.168.104.153:3001/api';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Alert.alert('Validation Error', 'Username is required');
      return false;
    }

    if (formData.username.length < 3) {
      Alert.alert('Validation Error', 'Username must be at least 3 characters long');
      return false;
    }

    if (registrationMethod === 'email' && !formData.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }

    if (registrationMethod === 'phone' && !formData.phone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required');
      return false;
    }

    if (!formData.password.trim()) {
      Alert.alert('Validation Error', 'Password is required');
      return false;
    }

    if (formData.password.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const requestBody = {
        username: formData.username,
        password: formData.password,
        registrationMethod,
        ...(registrationMethod === 'email' ? { email: formData.email } : { phone: formData.phone })
      };

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: async () => {
                // Store user data and token, then navigate to dashboard
                await AsyncStorage.setItem('userToken', data.data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
                router.replace('/login');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Ionicons name="person" size={32} color="white" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Create your account to begin</Text>

        {/* Registration Method Toggle */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Registration Method</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                registrationMethod === 'email' && styles.toggleButtonActive,
              ]}
              onPress={() => setRegistrationMethod('email')}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  registrationMethod === 'email' && styles.toggleButtonTextActive,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                registrationMethod === 'phone' && styles.toggleButtonActive,
              ]}
              onPress={() => setRegistrationMethod('phone')}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  registrationMethod === 'phone' && styles.toggleButtonTextActive,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Email or Phone Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {registrationMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={
                registrationMethod === 'email' ? 'Enter your email' : 'Enter your number'
              }
              placeholderTextColor="#999"
              value={registrationMethod === 'email' ? formData.email : formData.phone}
              onChangeText={(value) =>
                handleInputChange(registrationMethod === 'email' ? 'email' : 'phone', value)
              }
              keyboardType={registrationMethod === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
            />
          </View>

          {/* Username Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>User Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter a username"
              placeholderTextColor="#999"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              autoCapitalize="none"
            />
          </View>

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Create Account Button */}
        <TouchableOpacity 
          style={[styles.createAccountButton, loading && styles.createAccountButtonDisabled]} 
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signInLink} onPress={() => router.push('/login')}>Sign In</Text>
          </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBackground: {
    width: 80,
    height: 80,
    backgroundColor: Platform.OS === 'android' ? '#4CAF50' : '#4F7DF3',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: Platform.OS === 'android' ? '#4CAF50' : '#4F7DF3',
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  createAccountButton: {
    backgroundColor: Platform.OS === 'android' ? '#4CAF50' : '#4F7DF3',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  createAccountButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  createAccountButtonDisabled: {
    opacity: 0.6,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    color: '#666',
  },
  signInLink: {
    fontSize: 16,
    color: Platform.OS === 'android' ? '#4CAF50' : '#4F7DF3',
    fontWeight: '600',
  },
});