import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';

import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type OnboardingStep = 'hello' | 'introduction' | 'askUser' | 'userInfo' | 'choicePoint' | 'education';

interface UserInfo {
  name: string;
  phone: string;
  email: string;
  [key: string]: string;
}

export default function HomeScreen() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('hello');
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', phone: '', email: '' });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [boxAnim] = useState(new Animated.Value(0));

  // Platform-specific colors
  const platformColors = {
    ios: { primary: '#007AFF', background: '#FFFFFF' },
    android: { primary: '#4CAF50', background: '#FFFFFF' }
  };

  const currentColors = Platform.OS === 'ios' ? platformColors.ios : platformColors.android;

  useEffect(() => {
    // Auto-progress from hello to introduction after 2 seconds
    if (currentStep === 'hello') {
      const timer = setTimeout(() => {
        setCurrentStep('introduction');
        animateStep();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const animateStep = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    boxAnim.setValue(0);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(boxAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleNext = () => {
    if (currentStep === 'introduction') {
      setCurrentStep('askUser');
      animateStep();
    } else if (currentStep === 'askUser') {
      setCurrentStep('userInfo');
      animateStep();
    } else if (currentStep === 'userInfo' && userInfo.name && userInfo.phone && userInfo.email) {
      setCurrentStep('choicePoint');
      animateStep();
    } else if (currentStep === 'choicePoint') {
      setCurrentStep('education');
      animateStep();
    }
  };

  const handleBack = () => {
    if (currentStep === 'introduction') {
      setCurrentStep('hello');
      animateStep();
    } else if (currentStep === 'askUser') {
      setCurrentStep('introduction');
      animateStep();
    } else if (currentStep === 'userInfo') {
      setCurrentStep('askUser');
      animateStep();
    } else if (currentStep === 'choicePoint') {
      setCurrentStep('userInfo');
      animateStep();
    } else if (currentStep === 'education') {
      setCurrentStep('choicePoint');
      animateStep();
    }
  };

  const renderBackButton = () => {
    if (currentStep === 'hello') return null;
    
    return (
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
      >
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={currentColors.primary} 
        />
      </TouchableOpacity>
    );
  };

  const renderHelloScreen = () => (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <View style={styles.centerContent}>
        <Text style={[styles.helloText, { color: currentColors.primary }]}>
          Hello!
        </Text>
      </View>
    </View>
  );

  const renderIntroduction = () => (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {renderBackButton()}
      <View style={styles.centerContent}>
        <Animated.View 
          style={[
            styles.animatedBox,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: boxAnim }
              ]
            }
          ]}
        >
          <Text style={styles.introText}>Hi, I am Scott.</Text>
        </Animated.View>
        
        <TouchableOpacity style={[styles.nextButton, { backgroundColor: currentColors.primary }]} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAskUser = () => (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {renderBackButton()}
      <View style={styles.centerContent}>
        <Animated.View 
          style={[
            styles.animatedBox,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: boxAnim }
              ]
            }
          ]}
        >
          <Text style={styles.askText}>You are?</Text>
        </Animated.View>
        
        <TouchableOpacity style={[styles.nextButton, { backgroundColor: currentColors.primary }]} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Tell You</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserInfo = () => (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: currentColors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {renderBackButton()}
      <View style={styles.centerContent}>
        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.formTitle}>Tell us about yourself</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={[styles.input, { borderColor: currentColors.primary }]}
              value={userInfo.name}
              onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={[styles.input, { borderColor: currentColors.primary }]}
              value={userInfo.phone}
              onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, { borderColor: currentColors.primary }]}
              value={userInfo.email}
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.nextButton, 
              { 
                backgroundColor: (userInfo.name && userInfo.phone && userInfo.email) ? currentColors.primary : '#ccc' 
              }
            ]} 
            onPress={handleNext}
            disabled={!(userInfo.name && userInfo.phone && userInfo.email)}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );

  const renderChoicePoint = () => (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      {renderBackButton()}
      <View style={styles.centerContent}>
        <Animated.View 
          style={[
            styles.animatedBox,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: boxAnim }
              ]
            }
          ]}
        >
          <Text style={styles.choiceTitle}>What would you like to do?</Text>
        </Animated.View>
        
        <View style={styles.choiceButtons}>
          <TouchableOpacity 
            style={[styles.choiceButton, { backgroundColor: currentColors.primary }]} 
            onPress={() => router.push({ pathname: '/login', params: userInfo })}
          >
            <Text style={styles.choiceButtonText}>Start Application</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.choiceButton, styles.secondaryButton, { borderColor: currentColors.primary }]} 
            onPress={handleNext}
          >
            <Text style={[styles.choiceButtonText, { color: currentColors.primary }]}>Learn More First</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEducation = () => (
    <ScrollView style={[styles.container, { backgroundColor: currentColors.background }]}>
      {renderBackButton()}
      <View style={styles.educationContainer}>
        <View style={styles.educationHeader}>
          <Text style={styles.educationTitle}>Mortgage Education</Text>
        </View>
        
        {/* FICO Section */}
        <View style={styles.educationSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.primary }]}>FICO Score</Text>
          <Text style={styles.sectionText}>
            FICO stands for Fair Isaac Corporation, the company that developed the widely used FICO credit scoring system.
          </Text>
          <Text style={styles.sectionSubTitle}>Purpose:</Text>
          <Text style={styles.sectionText}>
            FICO scores are numerical representations of a consumer's credit risk, based on information from their credit reports. 
            Lenders use these scores to assess loan applications, set interest rates, and determine credit limits.
          </Text>
          <Text style={styles.sectionSubTitle}>Key Details:</Text>
          <Text style={styles.bulletPoint}>• Score Range: 300 to 850 (higher scores = lower credit risk)</Text>
          <Text style={styles.bulletPoint}>• Founded by Bill Fair and Earl Isaac</Text>
          <Text style={styles.bulletPoint}>• Uses data from Equifax, Experian, and TransUnion</Text>
          <Text style={styles.bulletPoint}>• Higher scores mean better loan terms and lower interest rates</Text>
        </View>

        {/* LTV Section */}
        <View style={styles.educationSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.primary }]}>LTV (Loan To Value)</Text>
          <Text style={styles.sectionText}>
            The Loan-to-Value (LTV) ratio compares the loan amount to the value of the asset being financed, usually as a percentage.
          </Text>
          <Text style={styles.sectionSubTitle}>Calculation:</Text>
          <Text style={styles.formula}>LTV = Loan Amount / Appraised Property Value</Text>
          <Text style={styles.sectionSubTitle}>Example:</Text>
          <Text style={styles.example}>
            Home price: $500,000{'\n'}
            Loan: $400,000{'\n'}
            LTV = $400,000 / $500,000 = 80%
          </Text>
          <Text style={styles.sectionSubTitle}>Why It Matters:</Text>
          <Text style={styles.bulletPoint}>• Higher LTV = greater risk for lender</Text>
          <Text style={styles.bulletPoint}>• LTV affects loan approval and interest rates</Text>
          <Text style={styles.bulletPoint}>• LTV above 80% typically requires mortgage insurance (PMI)</Text>
          <Text style={styles.bulletPoint}>• Lower LTV = more home equity</Text>
        </View>

        {/* DTI Section */}
        <View style={styles.educationSection}>
          <Text style={[styles.sectionTitle, { color: currentColors.primary }]}>DTI (Debt To Income)</Text>
          <Text style={styles.sectionText}>
            Debt-to-Income (DTI) ratio compares your monthly debt payments to your gross monthly income, expressed as a percentage.
          </Text>
          <Text style={styles.sectionSubTitle}>How to Calculate:</Text>
          <Text style={styles.bulletPoint}>1. Add up all monthly debt payments (mortgage, credit cards, loans)</Text>
          <Text style={styles.bulletPoint}>2. Calculate gross monthly income (before taxes)</Text>
          <Text style={styles.bulletPoint}>3. Divide total debt by gross income</Text>
          <Text style={styles.formula}>DTI = Total Monthly Debt / Gross Monthly Income</Text>
          <Text style={styles.sectionSubTitle}>What's Considered Good:</Text>
          <Text style={styles.bulletPoint}>• Typically 40-45% (maximum 50%)</Text>
          <Text style={styles.bulletPoint}>• Lower DTI = less risky borrower</Text>
          <Text style={styles.bulletPoint}>• Lenders use DTI to assess repayment ability</Text>
        </View>

        <TouchableOpacity 
          style={[styles.getStartedButton, { backgroundColor: currentColors.primary }]} 
          onPress={() => router.push({ pathname: '/login', params: userInfo })}
        >
          <Text style={styles.getStartedButtonText}>Start Your Application</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  useEffect(() => {
    animateStep();
  }, [currentStep]);

  switch (currentStep) {
    case 'hello':
      return renderHelloScreen();
    case 'introduction':
      return renderIntroduction();
    case 'askUser':
      return renderAskUser();
    case 'userInfo':
      return renderUserInfo();
    case 'choicePoint':
      return renderChoicePoint();
    case 'education':
      return renderEducation();
    default:
      return renderHelloScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  helloText: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  animatedBox: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    marginBottom: 32,
  },
  introText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  askText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  choiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  choiceButtons: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  choiceButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  choiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  nextButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 120,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  educationContainer: {
    padding: 24,
  },
  educationHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  educationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  educationSection: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 4,
  },
  formula: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: '#e9ecef',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    color: '#333',
  },
  example: {
    fontSize: 14,
    backgroundColor: '#e9ecef',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    color: '#333',
  },
  getStartedButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});