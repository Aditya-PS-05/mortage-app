import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface UserData {
  id: string;
  email?: string;
  phone?: string;
  username: string;
  createdAt: string;
}

interface DocumentStatus {
  id: string;
  name: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  required: boolean;
}

interface BookingStatus {
  id: string;
  propertyAddress: string;
  status: 'in_progress' | 'approved' | 'pending_documents' | 'completed';
  loanAmount: number;
  progress: number;
}

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from API
  const [documentStatuses] = useState<DocumentStatus[]>([
    { id: '1', name: 'Income Verification', status: 'verified', required: true },
    { id: '2', name: 'Bank Statements', status: 'uploaded', required: true },
    { id: '3', name: 'Credit Report', status: 'verified', required: true },
    { id: '4', name: 'Property Appraisal', status: 'pending', required: true },
    { id: '5', name: 'Insurance Documents', status: 'pending', required: false },
  ]);

  const [bookingStatus] = useState<BookingStatus>({
    id: '1',
    propertyAddress: '123 Dream Home Lane, Austin, TX',
    status: 'pending_documents',
    loanAmount: 450000,
    progress: 65,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      const storedToken = await AsyncStorage.getItem('userToken');

      if (!storedUserData || !storedToken) {
        router.replace('/login');
        return;
      }

      const user = JSON.parse(storedUserData);
      setUserData(user);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'completed':
      case 'approved':
        return '#4CAF50';
      case 'uploaded':
      case 'in_progress':
        return '#FF9800';
      case 'pending':
      case 'pending_documents':
        return '#2196F3';
      case 'rejected':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'completed':
      case 'approved':
        return 'checkmark-circle';
      case 'uploaded':
      case 'in_progress':
        return 'time';
      case 'pending':
      case 'pending_documents':
        return 'ellipse-outline';
      case 'rejected':
        return 'close-circle';
      default:
        return 'ellipse-outline';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header with Greeting */}
          <View style={styles.header}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.nameText}>{userData.username}! 👋</Text>
            </View>
            <View style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#4CAF50" />
            </View>
          </View>

          {/* Loan Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Your Mortgage Application</Text>
              <Text style={styles.progressPercentage}>{bookingStatus.progress}%</Text>
            </View>
            <Text style={styles.propertyAddress}>{bookingStatus.propertyAddress}</Text>
            <Text style={styles.loanAmount}>
              Loan Amount: ${bookingStatus.loanAmount.toLocaleString()}
            </Text>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${bookingStatus.progress}%` }
                  ]} 
                />
              </View>
            </View>
            
            <View style={styles.statusContainer}>
              <Ionicons 
                name={getStatusIcon(bookingStatus.status)} 
                size={16} 
                color={getStatusColor(bookingStatus.status)} 
              />
              <Text style={[styles.statusText, { color: getStatusColor(bookingStatus.status) }]}>
                {bookingStatus.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Ionicons name="document-text-outline" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.actionText}>Upload Documents</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/dashboard')}>
                <View style={styles.actionIcon}>
                  <Ionicons name="calculator-outline" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.actionText}>Loan Calculator</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Ionicons name="call-outline" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.actionText}>Contact Agent</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Ionicons name="help-circle-outline" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.actionText}>Get Help</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Document Status */}
          <View style={styles.documentsContainer}>
            <Text style={styles.sectionTitle}>Document Status</Text>
            {documentStatuses.map((doc) => (
              <View key={doc.id} style={styles.documentItem}>
                <View style={styles.documentInfo}>
                  <Ionicons 
                    name={getStatusIcon(doc.status)} 
                    size={20} 
                    color={getStatusColor(doc.status)} 
                  />
                  <View style={styles.documentDetails}>
                    <Text style={styles.documentName}>{doc.name}</Text>
                    <Text style={styles.documentRequired}>
                      {doc.required ? 'Required' : 'Optional'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.documentStatus, { color: getStatusColor(doc.status) }]}>
                  {doc.status.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 32,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  propertyAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  loanAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  documentsContainer: {
    marginBottom: 32,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  documentRequired: {
    fontSize: 12,
    color: '#666',
  },
  documentStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
});