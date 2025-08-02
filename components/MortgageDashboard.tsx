import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import LoanTypeSelector from './LoanTypeSelector';
import MortgageComparison from './MortgageComparison';
import FicoLtvChart from './FicoLtvChart';

export default function MortgageDashboard() {
  const [selectedLoanType, setSelectedLoanType] = useState<'purchase' | 'refinance' | 'cashout'>('purchase');

  // Platform-specific colors
  const platformColors = {
    ios: { primary: '#007AFF' },
    android: { primary: '#4CAF50' }
  };

  const currentColors = Platform.OS === 'ios' ? platformColors.ios : platformColors.android;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <LoanTypeSelector
          selectedType={selectedLoanType}
          onTypeSelect={setSelectedLoanType}
          primaryColor={currentColors.primary}
        />
        
        <MortgageComparison
          primaryColor={currentColors.primary}
        />
        
        <FicoLtvChart
          loanType={selectedLoanType}
          primaryColor={currentColors.primary}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 32,
    paddingBottom: 32,
  },
});