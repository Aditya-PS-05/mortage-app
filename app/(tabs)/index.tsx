import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4F7DF3', '#3B5DC7']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.content}>
          {/* App Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Image
                source={require('@/assets/images/landing/home.png')}
                style={styles.houseIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* App Title */}
          <Text style={styles.appTitle}>MortgageApp</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Your dream home is just a few taps away.{'\n'}
            Get pre-approved in minutes.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/signup')}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/login')}>
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              {/* <View style={styles.lockIcon}> */}
                <Image
                  source={require('@/assets/images/landing/secure.png')}
                  // style={styles.supportCircle}
                  resizeMode="contain"
                />
              {/* </View> */}
            </View>
            <Text style={styles.featureTitle}>Secure</Text>
            <Text style={styles.featureDescription}>Bank-level security</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Image
                  source={require('@/assets/images/landing/fast.png')}
                  // style={styles.houseIcon}
                  resizeMode="contain"
                />
            </View>
            <Text style={styles.featureTitle}>Fast</Text>
            <Text style={styles.featureDescription}>10-minute approval</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Image
                  source={require('@/assets/images/landing/support.png')}
                  // style={styles.houseIcon}
                  resizeMode="contain"
                />
            </View>
            <Text style={styles.featureTitle}>Support</Text>
            <Text style={styles.featureDescription}>Expert guidance</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconBackground: {
    width: 96,
    height: 96,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  houseIcon: {
    width: 40,
    height: 40,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#4F7DF3',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 32,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#E8F2FF',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  // Lock icon styles
  lockIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBody: {
    width: 16,
    height: 12,
    backgroundColor: '#4F7DF3',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  lockShackle: {
    width: 12,
    height: 8,
    borderWidth: 2,
    borderColor: '#4F7DF3',
    borderRadius: 6,
    borderBottomWidth: 0,
    position: 'absolute',
    top: 0,
  },
  // Lightning bolt icon styles
  boltIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bolt: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4F7DF3',
    transform: [{ rotate: '15deg' }],
  },
  // Support icon styles
  supportIcon: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4F7DF3',
    position: 'absolute',
  },
  supportPeople: {
    width: 12,
    height: 8,
    backgroundColor: '#4F7DF3',
    borderRadius: 6,
    position: 'absolute',
    bottom: 2,
  },
});