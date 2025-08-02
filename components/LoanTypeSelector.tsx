import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LoanTypeSelectorProps {
  selectedType: 'purchase' | 'refinance' | 'cashout';
  onTypeSelect: (type: 'purchase' | 'refinance' | 'cashout') => void;
  primaryColor: string;
}

export default function LoanTypeSelector({ selectedType, onTypeSelect, primaryColor }: LoanTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What Are You Looking To Do Today?</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            selectedType === 'purchase' && { backgroundColor: primaryColor },
            { borderColor: primaryColor }
          ]}
          onPress={() => onTypeSelect('purchase')}
        >
          <Text style={[
            styles.optionText,
            selectedType === 'purchase' && styles.selectedOptionText
          ]}>
            Purchase
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedType === 'refinance' && { backgroundColor: primaryColor },
            { borderColor: primaryColor }
          ]}
          onPress={() => onTypeSelect('refinance')}
        >
          <Text style={[
            styles.optionText,
            selectedType === 'refinance' && styles.selectedOptionText
          ]}>
            Refinance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedType === 'cashout' && { backgroundColor: primaryColor },
            { borderColor: primaryColor }
          ]}
          onPress={() => onTypeSelect('cashout')}
        >
          <Text style={[
            styles.optionText,
            selectedType === 'cashout' && styles.selectedOptionText
          ]}>
            C/O Cashout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  optionsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  option: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
});